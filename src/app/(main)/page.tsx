import React from 'react'
import LandingPage from '@/modules/landing/ui/views/LandingPage'
import { auth } from '@/lib/auth' //server instance of auth
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Welcome',
    description:
        'Get answer for your queries by our AI support agent. Start asking questions and managing your account today!',
    openGraph: {
        title: 'Welcome',
        description:
            'Get answer for your queries by our AI support agent. Start asking questions and managing your account today!',
        // url: 'https://ai-agent-support.vercel.app',
        siteName: 'AI agent support',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        title: 'Welcome',
        description:
            'Get answer for your queries by our AI support agent. Start asking questions and managing your account today!',
        card: 'summary_large_image',
        // site: 'https://ai-agent-support.vercel.app',
    },
}

const page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        // If user is signed in, redirect to chat page
        redirect('/chat')
    }

    return <LandingPage />
}

export default page
