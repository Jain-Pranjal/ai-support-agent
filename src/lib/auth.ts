// server instance of better-auth
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import { FullSchema } from '@/db/schema'
import { haveIBeenPwned } from 'better-auth/plugins'
import { lastLoginMethod } from 'better-auth/plugins'


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: FullSchema,
    }),

    baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },

    plugins: [
        haveIBeenPwned({
            customPasswordCompromisedMessage:
                'This is a very simple password. Please choose a stronger, unique password.',
        }),
        lastLoginMethod(),
    ],
})
