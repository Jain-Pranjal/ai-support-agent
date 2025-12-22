'use client'
import React from 'react'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ChatInterface } from '../components/ChatInterface'

const ChatPage = () => {
    // const router = useRouter()
    const trpc = useTRPC()

    // Fetch all chat sessions
    const { data } = useSuspenseQuery(
        trpc.chat.getAllChatSessions.queryOptions()
    )

    const chatSessions = data?.chatSessions ?? []
    const activeChatSession = chatSessions?.[0] ?? null

    return (
        <>
            <ChatInterface
                chatSessions={chatSessions}
                initialActiveSession={activeChatSession}
            />
        </>
    )
}

export default ChatPage
// Loading fallback
export const ChatPageLoading = () => (
    <div className="flex h-screen items-center justify-center text-black">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-black"></div>
        <span className="ml-4">Loading chats...</span>
    </div>
)
// Error fallback
export const ChatPageError = () => (
    <div className="flex h-screen items-center justify-center bg-gray-100 text-red-500">
        <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">
                Oops! Something went wrong
            </h2>
            <p className="mb-4">
                Failed to load chat. Please try refreshing the page.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
                Retry
            </button>
        </div>
    </div>
)
