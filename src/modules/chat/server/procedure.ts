import { protectedProcedure, createTRPCRouter } from '@/trpc/init'
import { z } from 'zod'
import { db } from '@/db'
import { chatSession, message, messageSenderEnum } from '@/db/schema'
import { eq, desc, asc, and } from 'drizzle-orm'
import { AiChatSupport } from '@/lib/ai'
import { TRPCError } from '@trpc/server'

export const chatRouter = createTRPCRouter({
    // Create a new chat session
    createSession: protectedProcedure
        .input(z.object({ title: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            // Check if a session with the same title already exists for this user
            const existingSession = await db
                .select()
                .from(chatSession)
                .where(
                    and(
                        eq(chatSession.title, input.title),
                        eq(chatSession.userId, ctx.auth.session.userId)
                    )
                )
                .limit(1)

            if (existingSession.length > 0) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message:
                        'A chat session with this title already exists for this user.',
                })
            }

            const [session] = await db
                .insert(chatSession)
                .values({
                    title: input.title,
                    userId: ctx.auth.session.userId,
                })
                .returning()
            return session
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const session = await db
                .delete(chatSession)
                .where(
                    and(
                        eq(chatSession.id, input.id),
                        eq(chatSession.userId, ctx.auth.session.userId)
                    )
                )
                .returning()
            if (!session.length)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Chat session not found or not authorized',
                })
            return { success: true }
        }),

    // List all chat sessions for the user
    getAllChatSessions: protectedProcedure.query(async ({ ctx }) => {
        // First get all chat sessions
        const sessions = await db
            .select()
            .from(chatSession)
            .where(eq(chatSession.userId, ctx.auth.session.userId))
            .orderBy(desc(chatSession.createdAt))

        // Then get the last message for each session
        const sessionsWithLastMessage = await Promise.all(
            sessions.map(async (session) => {
                const lastMessage = await db
                    .select()
                    .from(message)
                    .where(eq(message.chatSessionId, session.id))
                    .orderBy(desc(message.createdAt))
                    .limit(1)

                return {
                    ...session,
                    lastMessage: lastMessage[0]?.content || null,
                }
            })
        )

        return { chatSessions: sessionsWithLastMessage }
    }),

    // Get one session (with messages optionally)
    getChatSessionById: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const session = await db
                .select()
                .from(chatSession)
                .where(
                    and(
                        eq(chatSession.id, input.id),
                        eq(chatSession.userId, ctx.auth.session.userId)
                    )
                )
                .limit(1)

            if (!session.length)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Chat session not found',
                })

            // Fetch messages belonging to this session
            const messages = await db
                .select()
                .from(message)
                .where(eq(message.chatSessionId, input.id))
                .orderBy(asc(message.createdAt))

            return { session: session[0], messages }
        }),
})

export const messageRouter = createTRPCRouter({
    // Send a user message and get AI response
    sendMessage: protectedProcedure
        .input(
            z.object({
                chatSessionId: z.string(),
                content: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { chatSessionId, content } = input // Destructure input
            const session = await db
                .select()
                .from(chatSession)
                .where(
                    and(
                        eq(chatSession.id, chatSessionId),
                        eq(chatSession.userId, ctx.auth.session.userId)
                    )
                )
                .limit(1)

            if (!session.length)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Chat session not found',
                })

            // Save user message
            const [userMessage] = await db
                .insert(message)
                .values({
                    chatSessionId: chatSessionId,
                    sender: messageSenderEnum.enumValues[0], //'user' is the first enum value
                    content: content,
                })
                .returning()

            // Call Gemini AI
            const aiReply = await AiChatSupport(content)

            // Save AI message
            const [aiMessage] = await db
                .insert(message)
                .values({
                    chatSessionId: chatSessionId,
                    sender: messageSenderEnum.enumValues[1], //  'ai' is the second enum value
                    content: aiReply ?? 'No response from AI',
                })
                .returning()

            return { userMessage, aiMessage }
        }),

    // Get messages for a session (with pagination)
    getMessages: protectedProcedure
        .input(
            z.object({
                chatSessionId: z.string(),
                limit: z.number().min(1).max(50).default(20),
                cursor: z.string().optional(), // message.id cursor for pagination
            })
        )
        .query(async ({ ctx, input }) => {
            const messages = await db
                .select()
                .from(message)
                .where(eq(message.chatSessionId, input.chatSessionId))
                .orderBy(asc(message.createdAt))
                .limit(input.limit)

            return messages
        }),
})
