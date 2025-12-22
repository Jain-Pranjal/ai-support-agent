import React from 'react'
import SigninView from '@/modules/auth/ui/SignInView'
import { auth } from '@/lib/auth' //server instance of auth
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign In',
    description:
        'Access the AI agent support dashboard. Sign in to continue chatting and managing your account with our AI agent support.',
    openGraph: {
        title: 'AI agent support  | Sign In',
        description:
            'Access the AI agent support dashboard. Sign in to continue chatting and managing your account with our AI agent support.',
        // url: 'https://ai-agent-support.vercel.app/sign-in',
        siteName: 'AI agent support',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        title: 'AI agent support | Sign In',
        description:
            'Access the AI agent support dashboard. Sign in to continue chatting and managing your account with our AI agent support.',
        card: 'summary_large_image',
        // site: 'https://ai-agent-support.vercel.app/sign-in',
    },
}

async function SignIn() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session) {
        // If the user is already signed in, redirect them to the home page
        redirect('/chat')
    }

    return (
        <div>
            <SigninView />
        </div>
    )
}

export default SignIn
