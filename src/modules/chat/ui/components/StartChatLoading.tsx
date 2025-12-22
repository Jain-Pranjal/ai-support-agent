'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MessageSquare, Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface StartChatLoadingProps {
    onSendMessage: (message: string) => void
}

export const StartChatLoading = ({ onSendMessage }: StartChatLoadingProps) => {
    const suggestedMessages = [
        'Where is my order?',
        'What is the refund policy?',
        'How can I track my shipment?',
        'Can you help me with product recommendations?',
        'What are the shipping options available?',
        'How do I change my account password?',
    ]

    return (
        <div className="flex h-full items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mx-auto max-w-2xl text-center"
            >
                {/* Welcome Message */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                >
                    <h1 className="text-foreground mb-4 text-3xl font-bold">
                        Welcome to AI agent chat support! 
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        I&apos;m here to help you answer your questions.
                        Ask me anything about:
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-8 grid gap-4 md:grid-cols-2"
                >
                    <Card className="bg-gradient-card border-0 p-4 text-left">
                        <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 rounded-lg p-2">
                                <MessageSquare className="text-primary h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-foreground font-semibold">
                                    Order Support
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Get personalized guidance
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-card border-0 p-4 text-left">
                        <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 rounded-lg p-2">
                                <Sparkles className="text-primary h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-foreground font-semibold">
                                    Technical Support
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Learn new technologies
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Suggested Messages */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mb-8"
                >
                    <h2 className="text-foreground mb-6 text-xl font-semibold">
                        Try asking me about:
                    </h2>
                    <div className="mx-auto max-w-md space-y-3">
                        {suggestedMessages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <Button
                                    variant="outline"
                                    className="hover:bg-primary/5 hover:border-primary/20 h-auto w-full cursor-pointer justify-between p-4 text-left"
                                    onClick={() => onSendMessage(message)}
                                >
                                    <span className="text-sm">{message}</span>
                                    <ArrowRight className="text-muted-foreground h-4 w-4" />
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Start Chat Prompt */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                >
                    <p className="text-muted-foreground">
                        Or just type your question below to get started!
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
