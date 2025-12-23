// API route to handle streaming chat responses as tRPC does not support streaming yet

import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { chatSession, message, messageSenderEnum } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { AiChatSupportStream } from '@/lib/ai'

export async function POST(request: NextRequest) {
    try {
        // Get auth session
        const session = await auth.api.getSession({
            headers: await request.headers,
        })

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await request.json()
        const { chatSessionId, content } = body

        if (!chatSessionId || !content) {
            return new Response('Missing required fields', { status: 400 })
        }

        // Verify session belongs to user
        const [chatSessionData] = await db
            .select()
            .from(chatSession)
            .where(
                and(
                    eq(chatSession.id, chatSessionId),
                    eq(chatSession.userId, session.user.id)
                )
            )
            .limit(1)

        if (!chatSessionData) {
            return new Response('Chat session not found', { status: 404 })
        }

        // Save user message
        const [userMessage] = await db
            .insert(message)
            .values({
                chatSessionId: chatSessionId,
                sender: messageSenderEnum.enumValues[0],
                content: content,
            })
            .returning()

        // Create streaming response
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Send user message ID first
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({ type: 'user', messageId: userMessage.id })}\n\n`
                        )
                    )

                    let fullAiResponse = ''

                    // Stream AI response
                    for await (const chunk of AiChatSupportStream(content)) {
                        fullAiResponse += chunk
                        controller.enqueue(
                            encoder.encode(
                                `data: ${JSON.stringify({ type: 'chunk', data: chunk })}\n\n`
                            )
                        )
                    }

                    // Save complete AI message
                    const [aiMessage] = await db
                        .insert(message)
                        .values({
                            chatSessionId: chatSessionId,
                            sender: messageSenderEnum.enumValues[1],
                            content: fullAiResponse,
                        })
                        .returning()

                    // Send done signal
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({ type: 'done', messageId: aiMessage.id })}\n\n`
                        )
                    )

                    controller.close()
                } catch (error) {
                    console.error('Stream error:', error)
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({ type: 'error', message: 'Failed to generate response' })}\n\n`
                        )
                    )
                    controller.close()
                }
            },
        })

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        })
    } catch (error) {
        console.error('API error:', error)
        return new Response('Internal Server Error', { status: 500 })
    }
}
