import React from 'react'
import SignupView from '@/modules/auth/ui/SignUpView'
import { auth } from '@/lib/auth' //server instance of auth
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up',
    description:
        'Join our AI agent support platform. Sign up to start chatting and managing your account with our intelligent AI support agent.',
    openGraph: {
        title: 'AI agent support | Sign Up',
        description:
            'Join our AI agent support platform. Sign up to start chatting and managing your account with our intelligent AI support agent.',
        // url: 'https://ai-agent-support.vercel.app/sign-up',
        siteName: 'AI agent support',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        title: 'AI agent support | Sign Up',
        description:
            'Join our AI agent support platform. Sign up to start chatting and managing your account with our intelligent AI support agent.',
        card: 'summary_large_image',
        // site: 'https://ai-agent-support.vercel.app/sign-up',
    },
}

async function SignUp() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        // If the user is already signed in, redirect them to the home page
        redirect('/chat')
    }

    return (
        <div>
            <SignupView />
        </div>
    )
}

export default SignUp
