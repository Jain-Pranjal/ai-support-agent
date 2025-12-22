'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Plus, MessageCircle, Menu, X, Clock, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTRPC } from '@/trpc/client'
import { ChatUserButton } from './ChatUserButton'


interface ChatSidebarProps {
    sessions: {
        id: string
        title: string
        lastMessage?: string
        createdAt: string
    }[]
    isOpen: boolean
    onToggle: () => void
    onNewChat: () => void
    onSelectSession: (id: string) => void
}

export const ChatSidebar = ({
    sessions,
    isOpen,
    onToggle,
    onNewChat,
    onSelectSession,
}: ChatSidebarProps) => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    // Mutation: delete session
    const deleteSession = useMutation(
        trpc.chat.delete.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.chat.getAllChatSessions.queryOptions()
                )
            },
        })
    )

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (days === 0) return 'Today'
        if (days === 1) return 'Yesterday'
        if (days < 7) return `${days} days ago`
        return date.toLocaleDateString()
    }

    return (
        <>
            {/* Mobile Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                className={`bg-card/80 fixed top-4 left-4 z-50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
                    isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
                }`}
                onClick={onToggle}
            >
                <Menu className="h-5 w-5" />
            </Button>

            {/* Sidebar */}
            <div
                className={` ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} border-border lg:bg-gradient-card bg-card/95 fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r shadow-xl backdrop-blur-md transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:backdrop-blur-sm`}
            >
                {/* Sidebar Header */}
                <div className="border-border border-b p-4">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-foreground text-lg font-semibold">
                            Chat Sessions
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={onToggle}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <Button
                        onClick={onNewChat}
                        variant="outline"
                        className="w-full justify-start"
                        size="lg"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        New Chat Session
                    </Button>
                </div>

                {/* Chat Sessions List */}
                <ScrollArea className="flex-1 overflow-hidden">
                    <div className="space-y-3 p-4">
                        {sessions.length === 0 ? (
                            <div className="py-8 text-center">
                                <MessageCircle className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
                                <p className="text-muted-foreground">
                                    No chat sessions yet
                                </p>
                                <p className="text-muted-foreground/70 text-sm">
                                    Start your first conversation!
                                </p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <Card
                                    key={session.id}
                                    onClick={() => onSelectSession(session.id)}
                                    className="hover:shadow-medium group shadow-soft border-border bg-card/50 cursor-pointer p-3 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02]"
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <h3 className="text-foreground group-hover:text-primary text-md truncate pr-2 font-medium transition-colors">
                                            {session.title}
                                        </h3>
                                        <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={(e) => {
                                                    e.stopPropagation() // Prevent selecting session
                                                    deleteSession.mutate({
                                                        id: session.id,
                                                    })
                                                }}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <span className="text-muted-foreground text-xs font-bold">
                                            Last message:
                                        </span>
                                        <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                                            {session.lastMessage ??
                                                'No messages yet'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            <Clock className="mr-1 h-3 w-3" />
                                            {formatTime(session.createdAt)}
                                        </Badge>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </ScrollArea>

                {/* User Button */}
                <ChatUserButton />
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={onToggle}
                />
            )}
        </>
    )
}
