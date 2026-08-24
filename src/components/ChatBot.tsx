import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  sendChatMessage, 
  checkRateLimit, 
  type ChatMessage 
} from '@/lib/chatbot-service';
import redFront from '@/assets/lego-bricks/red-front.png';
import { useLanguage } from '@/hooks/useLanguage';

const ChatBot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rateInfo, setRateInfo] = useState({ minuteRemaining: 15, dayRemaining: 100 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Update rate limit info
  const updateRateInfo = useCallback(() => {
    const info = checkRateLimit();
    setRateInfo({
      minuteRemaining: info.minuteRemaining,
      dayRemaining: info.dayRemaining
    });
  }, []);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      updateRateInfo();
    }
  }, [isOpen, updateRateInfo]);
  
  // Update rate info periodically
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(updateRateInfo, 10000);
    return () => clearInterval(interval);
  }, [isOpen, updateRateInfo]);
  
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedInput,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await sendChatMessage(trimmedInput, messages);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      updateRateInfo();
    } catch (error) {
      console.error('Failed to get response:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: t('chatError'),
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label={isOpen ? t('chatClose') : t('chatOpen')}
      >
        <div className="relative w-16 h-16 flex items-center justify-center transition-transform duration-300 hover:scale-110">
          {/* Lego brick background with glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/30 blur-lg group-hover:blur-xl transition-all" />
          <img
            src={redFront}
            alt=""
            aria-hidden="true"
            className="w-14 h-14 object-contain relative z-10 drop-shadow-lg"
          />
          {/* Chat icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            {isOpen ? (
              <X className="w-6 h-6 text-white drop-shadow-md" />
            ) : (
              <MessageCircle className="w-6 h-6 text-white drop-shadow-md" />
            )}
          </div>
          {/* Pulse animation when closed */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-xl bg-primary/30 animate-ping" />
          )}
        </div>
      </button>
      
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] max-h-[calc(100vh-120px)] w-[360px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border border-border bg-popover/95 shadow-2xl backdrop-blur-lg animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <img
                  src={redFront}
                  alt=""
                  aria-hidden="true"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {t('chatAssistantName')}
                </h3>
                <p className="text-xs text-muted-foreground">hugoviegas.dev</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              aria-label={t('chatClose')}
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <img
                    src={redFront}
                    alt=""
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h4 className="mb-2 font-medium text-foreground">
                  {t('chatGreeting')}
                </h4>
                <p className="mb-4 text-sm text-muted-foreground">
                  {t('chatIntro')}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[t('chatSuggestion1'), t('chatSuggestion2'), t('chatSuggestion3')].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-foreground">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          
          {/* Rate limit info */}
          <div className="border-t border-border bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground">
            <span>
              {rateInfo.dayRemaining}/100 {t('chatQuotaDay')}
            </span>
            <span className="mx-2">•</span>
            <span>
              {rateInfo.minuteRemaining}/15 {t('chatQuotaMinute')}
            </span>
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="border-t border-border bg-muted/20 p-3">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatPlaceholder')}
                disabled={isLoading}
                aria-label={t('chatPlaceholder')}
                className="flex-1 border-border bg-card text-foreground focus:border-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                aria-label={t('chatSend')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
