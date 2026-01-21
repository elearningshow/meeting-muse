import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/types/meeting';
import { cn } from '@/lib/utils';
import { askQuestionWithGemini } from '@/services/geminiService';

interface SessionQAProps {
  transcript: string;
  isOpen: boolean;
  onClose: () => void;
}

export const SessionQA = ({ transcript, isOpen, onClose }: SessionQAProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = async (question: string): Promise<string> => {
    // Build conversation history for context
    const history = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      const response = await askQuestionWithGemini(transcript, question, history);
      return response;
    } catch (error) {
      console.error('Q&A error:', error);
      if (error instanceof Error && error.message.includes('GEMINI_API_KEY')) {
        return 'Gemini API key is not configured. Please add your API key in the project settings to enable AI-powered Q&A.';
      }
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateResponse(input.trim());
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card rounded-xl shadow-elevated border border-border overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Ask About This Session</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Ask Questions About Your Meeting</h4>
              <p className="text-sm text-muted-foreground">
                I can help you find information, summarize points, or clarify details from your recorded session.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-lg",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-secondary p-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the meeting..."
              disabled={isLoading || !transcript}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading || !transcript}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
          {!transcript && (
            <p className="text-xs text-muted-foreground mt-2">
              Record a meeting first to ask questions about it.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
