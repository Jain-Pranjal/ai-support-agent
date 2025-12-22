'use client'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { ChatSidebar } from './ChatSidebar'
import { StartChatLoading } from './StartChatLoading'
import { useTRPC } from '@/trpc/client'
import ReactMarkdown from 'react-markdown'
import { Textarea } from '@/components/ui/textarea'
import { generatedAvatarURI } from '@/lib/avatarURI'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
} from '@/components/ui/drawer'
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from '@tanstack/react-query'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

interface ChatInterfaceProps {
    chatSessions: {
        id: string
        title: string
        createdAt: string
        updatedAt: string
        userId: string
        lastMessageAt: string
    }[] //chat sessions is the array of chat sessions
    initialActiveSession: {
        id: string
        title: string
        createdAt: string
        updatedAt: string
        userId: string
        lastMessageAt: string
    } | null
}

export const ChatInterface = ({
    chatSessions,
    initialActiveSession,
}: ChatInterfaceProps) => {
    const trpc = useTRPC()
    const queryClient = useQueryClient()

    const [activeSessionId, setActiveSessionId] = useState<string | null>(
        initialActiveSession?.id ?? null
    )
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false)
    const [newChatTitle, setNewChatTitle] = useState('')
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const { data, isPending } = authClient.useSession()

    // Detect if we're on mobile
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 1024) // lg breakpoint
        }

        checkIsMobile()
        window.addEventListener('resize', checkIsMobile)

        return () => window.removeEventListener('resize', checkIsMobile)
    }, [])

    // Pick active session (fallback to first)
    const activeSession =
        chatSessions?.find((s) => s.id === activeSessionId) ??
        chatSessions?.[0] ??
        null

    // Fetch messages for active session
    const { data: messages = [] } = useSuspenseQuery(
        trpc.message.getMessages.queryOptions(
            { chatSessionId: activeSession?.id ?? '', limit: 50 },
            { enabled: !!activeSession }
            // passing the id of the chat session for which we need messages
        )
    )

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector(
                '[data-radix-scroll-area-viewport]'
            )
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight
            }
        }
    }, [messages, isTyping])

    // TODO: need to modify the send message function to handle errors and loading states

    // Mutation: send message
    const sendMessageMutation = useMutation(
        trpc.message.sendMessage.mutationOptions({
            onMutate: async ({ chatSessionId, content }) => {
                setIsTyping(true)

                // Add user message optimistically
                queryClient.setQueryData(
                    trpc.message.getMessages.queryOptions({
                        chatSessionId,
                    }).queryKey,
                    //eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (old: any) => [
                        ...(old ?? []),
                        {
                            id: `temp-${Date.now()}`,
                            chatSessionId,
                            sender: 'user',
                            content,
                            createdAt: new Date(),
                        },
                    ]
                )
            },
            onSuccess: async (data, variables) => {
                // Replace with real user + AI message
                await queryClient.invalidateQueries(
                    trpc.message.getMessages.queryOptions({
                        chatSessionId: variables.chatSessionId,
                    })
                )
                await queryClient.invalidateQueries(
                    trpc.chat.getAllChatSessions.queryOptions()
                )
                setIsTyping(false)
            },
            onError: () => {
                setIsTyping(false)
            },
        })
    )

    // Mutation: create new chat session
    const createSession = useMutation(
        trpc.chat.createSession.mutationOptions({
            onSuccess: async (newSession) => {
                await queryClient.invalidateQueries(
                    trpc.chat.getAllChatSessions.queryOptions()
                )
                setActiveSessionId(newSession.id)
                setIsNewChatDialogOpen(false)
                setNewChatTitle('')
            },
            onError: (error) => {
                toast.error(
                    error?.message ||
                        'Failed to create chat session. Please try again.'
                )
            },
        })
    )

    if (isPending || !data?.user) {
        return null
    }

    const handleSendMessage = () => {
        if (!inputValue.trim() || !activeSession) return
        sendMessageMutation.mutate({
            chatSessionId: activeSession.id,
            content: inputValue,
        })
        setInputValue('')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleCreateNewChat = () => {
        if (newChatTitle.trim()) {
            createSession.mutate({ title: newChatTitle.trim() })
        }
    }

    return (
        <div className="flex h-screen">
            <ChatSidebar
                sessions={chatSessions}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                onNewChat={() => setIsNewChatDialogOpen(true)}
                onSelectSession={(id) => setActiveSessionId(id)}
            />

            {/* Chat Area */}
            <div className="bg-background flex h-full flex-1 flex-col">
                {/* Chat Header */}
                <div className="border-border bg-card/50 flex-shrink-0 border-b p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                        <Avatar>
                            <AvatarImage
                                src={generatedAvatarURI({
                                    seed: `${activeSession?.title ?? 'AI agent support'}`,
                                    variant: 'rings',
                                })}
                                alt="AI agent support"
                            />
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                                <Bot className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-foreground font-semibold">
                                {activeSession?.title ?? 'AI agent support'}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Always here to help with your queries!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea ref={scrollAreaRef} className="min-h-0 flex-1">
                    <div className="p-4">
                        <div className="mx-auto max-w-4xl">
                            {messages.length === 0 && !isTyping ? (
                                <StartChatLoading
                                    onSendMessage={(message) => {
                                        if (activeSession) {
                                            sendMessageMutation.mutate({
                                                chatSessionId: activeSession.id,
                                                content: message,
                                            })
                                        }
                                    }}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`animate-fade-in flex items-start space-x-3 ${
                                                message.sender === 'user'
                                                    ? 'flex-row-reverse space-x-reverse'
                                                    : ''
                                            }`}
                                        >
                                            <Avatar className="flex-shrink-0">
                                                {message.sender === 'user' ? (
                                                    <>
                                                        <AvatarImage
                                                            src={
                                                                data.user
                                                                    .image ||
                                                                generatedAvatarURI(
                                                                    {
                                                                        seed: `${data.user.name ?? 'User'}`,
                                                                        variant:
                                                                            'openPeeps',
                                                                    }
                                                                )
                                                            }
                                                            alt="User Profile"
                                                        />
                                                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                                                            <User className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AvatarImage
                                                            src={generatedAvatarURI(
                                                                {
                                                                    seed: `${activeSession?.title ?? 'AI Agent support'}`,
                                                                    variant:
                                                                        'rings',
                                                                }
                                                            )}
                                                            alt="AI Agent support"
                                                        />
                                                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                                                            <Bot className="h-4 w-4" />
                                                        </AvatarFallback>
                                                    </>
                                                )}
                                            </Avatar>
                                            <Card
                                                className={`max-w-2xl gap-2 p-4 ${
                                                    message.sender === 'user'
                                                        ? 'bg-chat-user text-chat-user-foreground ml-12'
                                                        : 'bg-chat-ai text-chat-ai-foreground mr-12'
                                                }`}
                                            >
                                                <div className="overflow-x-auto text-sm leading-relaxed">
                                                    <ReactMarkdown>
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                                <p className="mt-2 text-xs opacity-70">
                                                    {new Date(
                                                        message.createdAt
                                                    ).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            </Card>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div className="animate-fade-in flex items-start space-x-3">
                                            <Avatar>
                                                <AvatarImage
                                                    src={generatedAvatarURI({
                                                        seed: `${activeSession?.title ?? 'AI Agent support'}`,
                                                        variant: 'rings',
                                                    })}
                                                    alt="AI Agent support"
                                                />
                                                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                                                    <Bot className="h-4 w-4" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <Card className="bg-chat-ai text-chat-ai-foreground mr-12 p-4">
                                                <div className="flex items-center space-x-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span className="text-sm">
                                                        AI is thinking...
                                                    </span>
                                                </div>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>

                {/* Input Area */}
                {activeSession && (
                    <div className="border-border bg-card/50 flex-shrink-0 border-t p-4 backdrop-blur-sm">
                        <div className="mx-auto max-w-4xl">
                            <div className="flex items-end space-x-3">
                                <div className="flex-1">
                                    <Textarea
                                        value={inputValue}
                                        onChange={(e) =>
                                            setInputValue(e.target.value)
                                        }
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask me anything, I am here to help!"
                                        className="bg-muted focus:bg-background border-border max-h-[120px] min-h-[44px] resize-none overflow-y-auto"
                                    />
                                </div>
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isTyping}
                                    variant="outline"
                                    size="icon"
                                    className="h-[44px] w-[44px] shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* New Chat Dialog/Drawer */}
            {isNewChatDialogOpen &&
                (isMobile ? (
                    /* Mobile Version - Drawer */
                    <Drawer
                        open={true}
                        onOpenChange={(open) => {
                            if (!open) {
                                setIsNewChatDialogOpen(false)
                                setNewChatTitle('')
                            }
                        }}
                    >
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>
                                    Create New Chat Session
                                </DrawerTitle>
                                <DrawerDescription>
                                    Give your new chat session a descriptive
                                    title to help you organize your
                                    conversations.
                                </DrawerDescription>
                            </DrawerHeader>
                            <div className="grid gap-4 px-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="title-mobile"
                                        className="text-sm font-medium"
                                    >
                                        Title
                                    </label>
                                    <Input
                                        id="title-mobile"
                                        value={newChatTitle}
                                        onChange={(e) =>
                                            setNewChatTitle(e.target.value)
                                        }
                                        placeholder="e.g., order status..."
                                        className="w-full"
                                        onKeyPress={(e) => {
                                            if (
                                                e.key === 'Enter' &&
                                                newChatTitle.trim()
                                            ) {
                                                handleCreateNewChat()
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <DrawerFooter>
                                <Button
                                    type="button"
                                    onClick={handleCreateNewChat}
                                    disabled={
                                        !newChatTitle.trim() ||
                                        createSession.isPending
                                    }
                                >
                                    {createSession.isPending
                                        ? 'Creating...'
                                        : 'Create Chat'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        setIsNewChatDialogOpen(false)
                                        setNewChatTitle('')
                                    }}
                                >
                                    Cancel
                                </Button>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    /* Desktop Version - Dialog */
                    <Dialog
                        open={true}
                        onOpenChange={(open) => {
                            if (!open) {
                                setIsNewChatDialogOpen(false)
                                setNewChatTitle('')
                            }
                        }}
                    >
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Create New Chat Session
                                </DialogTitle>
                                <DialogDescription>
                                    Give your new chat session a descriptive
                                    title to help you organize your
                                    conversations.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="flex flex-col gap-2">
                                    <label
                                        htmlFor="title-desktop"
                                        className="text-sm font-medium"
                                    >
                                        Title
                                    </label>
                                    <Input
                                        id="title-desktop"
                                        value={newChatTitle}
                                        onChange={(e) =>
                                            setNewChatTitle(e.target.value)
                                        }
                                        placeholder="e.g., shipping delay..."
                                        className="w-full"
                                        onKeyPress={(e) => {
                                            if (
                                                e.key === 'Enter' &&
                                                newChatTitle.trim()
                                            ) {
                                                handleCreateNewChat()
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => {
                                        setIsNewChatDialogOpen(false)
                                        setNewChatTitle('')
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCreateNewChat}
                                    disabled={
                                        !newChatTitle.trim() ||
                                        createSession.isPending
                                    }
                                >
                                    {createSession.isPending
                                        ? 'Creating...'
                                        : 'Create Chat'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ))}
        </div>
    )
}
