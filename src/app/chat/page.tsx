// server component

import ChatPage from '@/modules/chat/ui/views/ChatView'
import { auth } from '@/lib/auth' //server instance of auth
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import {
    ChatPageLoading,
    ChatPageError,
} from '@/modules/chat/ui/views/ChatView'
import { ErrorBoundary } from 'react-error-boundary'

export const metadata: Metadata = {
    title: 'Chat',
    description:
        'Chat with our AI support agent. Get answers to your queries and manage your account seamlessly.',
    openGraph: {
        title: 'Chat',
        description:
            'Chat with our AI support agent. Get answers to your queries and manage your account seamlessly.',
        // url: 'https://ai-agent-support.vercel.app/chat',
        siteName: 'AI agent support',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        title: 'Chat',
        description:
            'Chat with our AI support agent. Get answers to your queries and manage your account seamlessly.',
        card: 'summary_large_image',
        // site: 'https://ai-agent-support.vercel.app/chat',
    },
}

const AIChatBot = async () => {
    const queryClient = getQueryClient()

    // Prefetch all user chat sessions (so sidebar/history loads instantly)
    void queryClient.prefetchQuery(trpc.chat.getAllChatSessions.queryOptions())

    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        // If the user is not signed in, redirect them to sign in page
        redirect('/sign-in')
    }
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<ChatPageLoading />}>
                <ErrorBoundary fallback={<ChatPageError />}>
                    <ChatPage />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}

export default AIChatBot
