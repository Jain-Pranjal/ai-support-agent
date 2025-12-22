import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { db } from '@/db'
import { user } from '@/db/schema'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { TRPCError } from '@trpc/server'

export const authRouter = createTRPCRouter({
    checkUserByEmail: baseProcedure
        .input(
            z.object({
                email: z.string().email('Invalid email address'),
            })
        )
        .query(async ({ input }) => {
            const email = input.email.toLowerCase()
            const [userByEmail] = await db
                .select()
                .from(user)
                .where(eq(user.email, email))
                .limit(1)

            if (!userByEmail) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found',
                })
            }

            return { exists: true }
        }),
})

// We always get the data in the array form if we are using the drizzle ORM
