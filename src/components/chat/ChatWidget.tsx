import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Trash2, Minimize2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
    toggleChat,
    closeChat,
    addMessage,
    setSending,
    clearChat,
} from '@/features/chat/chatSlice';
import { aiChatService } from '@/lib/aiChatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { cn } from '@/lib/utils';

export function ChatWidget() {
    const dispatch = useAppDispatch();
    const { messages, isOpen, isSending } = useAppSelector((state) => state.chat);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isSending) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        dispatch(
            addMessage({
                id: `user-${Date.now()}`,
                role: 'user',
                content: userMessage,
                timestamp: new Date().toISOString(),
            })
        );

        // Set sending state
        dispatch(setSending(true));

        try {
            // Get AI response
            const response = await aiChatService.sendMessage(userMessage);

            // Add AI response
            dispatch(
                addMessage({
                    id: `ai-${Date.now()}`,
                    role: 'assistant',
                    content: response,
                    timestamp: new Date().toISOString(),
                })
            );
        } catch (error) {
            dispatch(
                addMessage({
                    id: `error-${Date.now()}`,
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again.',
                    timestamp: new Date().toISOString(),
                })
            );
        } finally {
            dispatch(setSending(false));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleClear = () => {
        dispatch(clearChat());
        aiChatService.clearHistory();
    };

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <Button
                            size="lg"
                            onClick={() => dispatch(toggleChat())}
                            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 hover:scale-110 transition-transform"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                        {/* Pulse animation */}
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)]"
                    >
                        <div className="flex flex-col h-[520px] bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                            <MessageCircle className="h-5 w-5" />
                                        </div>
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">HealthGem AI</h3>
                                        <p className="text-xs opacity-80">Online • Ready to help</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleClear}
                                        className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => dispatch(closeChat())}
                                        className="h-8 w-8 text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1" ref={scrollRef}>
                                <div className="divide-y divide-border/50">
                                    {messages.map((message) => (
                                        <ChatMessage
                                            key={message.id}
                                            role={message.role}
                                            content={message.content}
                                            timestamp={message.timestamp}
                                        />
                                    ))}
                                    {isSending && (
                                        <div className="flex items-center gap-3 p-4 bg-muted/30">
                                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                                <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-sm text-muted-foreground">Thinking</span>
                                                <span className="flex gap-1">
                                                    <span className="animate-bounce delay-0">.</span>
                                                    <span className="animate-bounce delay-100">.</span>
                                                    <span className="animate-bounce delay-200">.</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            <div className="p-3 border-t border-border bg-background">
                                <div className="flex items-center gap-2">
                                    <Input
                                        ref={inputRef}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your message..."
                                        disabled={isSending}
                                        className="flex-1 rounded-full bg-muted/50 border-0 focus-visible:ring-1"
                                    />
                                    <Button
                                        size="icon"
                                        onClick={handleSend}
                                        disabled={!input.trim() || isSending}
                                        className="h-10 w-10 rounded-full shrink-0"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-center text-muted-foreground mt-2">
                                    AI Assistant • For demo purposes only
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
