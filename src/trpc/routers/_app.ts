// here we will define our main app router that contains all the other routers
import { createTRPCRouter } from '../init'
import { chatRouter } from '@/modules/chat/server/procedure'
import { messageRouter } from '@/modules/chat/server/procedure'
import { authRouter } from '@/modules/auth/server/procedure'

export const appRouter = createTRPCRouter({
    chat: chatRouter,
    message: messageRouter,
    auth: authRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
