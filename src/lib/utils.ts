import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Metadata } from 'next'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const appURL = process.env.NEXT_PUBLIC_APP_URL!

// Metadata
export function constructMetadata(): Metadata {
    return {
        metadataBase: new URL(appURL),
        manifest: '/manifest.json',
        title: {
            default: 'AI Support Agent',
            template: 'AI Support Agent | %s',
        },
        description:
            'An AI-powered chat support system that provides instant, accurate, and 24/7 assistance to users',
        applicationName: 'AI Support Agent',
        keywords: [
            'AI Support Agent',
            'AI Chat Support',
            'Customer Support AI',
            'AI Helpdesk',
            'AI Customer Service',
            'Support Chatbot',
            'AI Assistance',
            '24/7 AI Support',
            'AI-powered Support',
            'Intelligent Support Agent',
        ],
        openGraph: {
            title: 'AI Support Agent',
            description:
                'An AI-powered chat support system that provides instant, accurate, and 24/7 assistance to users',
            url: appURL,
            siteName: 'AI Support Agent',
            locale: 'en_US',
            type: 'website',
            images: [
                {
                    url: '/opengraph-image.png',
                    width: 1200,
                    height: 630,
                    alt: 'OpenGraph Image',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'AI Support Agent',
            description:
                'An AI-powered chat support system that provides instant, accurate, and 24/7 assistance to users',
            images: [
                {
                    url: '/twitter-image.png',
                    width: 1200,
                    height: 630,
                    alt: 'Twitter Image',
                },
            ],
            creator: '@PranjalJain03',
        },
    }
}
