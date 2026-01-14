import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
    const isAssistant = role === 'assistant';

    // Parse markdown-like formatting
    const formatContent = (text: string) => {
        return text.split('\n').map((line, index) => {
            // Handle bullet points
            if (line.startsWith('• ') || line.startsWith('- ')) {
                return (
                    <li key={index} className="ml-4 list-disc">
                        {line.slice(2)}
                    </li>
                );
            }
            // Handle numbered lists
            if (/^\d+\.\s/.test(line)) {
                return (
                    <li key={index} className="ml-4 list-decimal">
                        {line.replace(/^\d+\.\s/, '')}
                    </li>
                );
            }
            // Handle bold text
            const boldParsed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return (
                <p
                    key={index}
                    className={line === '' ? 'h-2' : ''}
                    dangerouslySetInnerHTML={{ __html: boldParsed }}
                />
            );
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'flex gap-3 p-3',
                isAssistant ? 'bg-muted/30' : ''
            )}
        >
            <div
                className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    isAssistant
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                )}
            >
                {isAssistant ? (
                    <Bot className="h-4 w-4" />
                ) : (
                    <User className="h-4 w-4" />
                )}
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                        {isAssistant ? 'HealthGem AI' : 'You'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {format(new Date(timestamp), 'HH:mm')}
                    </span>
                </div>
                <div className="text-sm text-foreground/90 space-y-1">
                    {formatContent(content)}
                </div>
            </div>
        </motion.div>
    );
}
