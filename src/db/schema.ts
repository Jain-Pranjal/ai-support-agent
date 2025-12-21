import {
    pgTable,
    text,
    timestamp,
    boolean,
    pgEnum,
    uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export const user = pgTable('user', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => nanoid(10)),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})

export const session = pgTable('session', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => nanoid(10)),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => nanoid(10)),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})

export const verification = pgTable('verification', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => nanoid(10)),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
})

export const messageSenderEnum = pgEnum('message_sender', ['user', 'ai'])

export const chatSession = pgTable(
    'chat_session',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => nanoid(10)),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        title: text('title').notNull(), // A name or topic for the chat session
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .$onUpdate(() => new Date())
            .notNull(),
        lastMessageAt: timestamp('last_message_at').defaultNow().notNull(),
    },
    (table) => ({
        uniqueUserTitle: uniqueIndex('unique_user_title').on(
            table.userId,
            table.title
        ),
    })
)

export const message = pgTable('message', {
    id: text('id')
        .primaryKey()
        .$defaultFn(() => nanoid(10)),
    chatSessionId: text('chat_session_id')
        .notNull()
        .references(() => chatSession.id, { onDelete: 'cascade' }),
    sender: messageSenderEnum('sender').notNull(), // 'user' or 'ai'
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})

//  relations for Drizzle
export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    chatSessions: many(chatSession),
}))

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}))

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}))

export const chatSessionRelations = relations(chatSession, ({ one, many }) => ({
    user: one(user, {
        fields: [chatSession.userId],
        references: [user.id],
    }),
    messages: many(message),
}))

export const messageRelations = relations(message, ({ one }) => ({
    chatSession: one(chatSession, {
        fields: [message.chatSessionId],
        references: [chatSession.id],
    }),
}))

export const FullSchema = {
    user,
    session,
    account,
    verification,
    chatSession,
    message,
}
