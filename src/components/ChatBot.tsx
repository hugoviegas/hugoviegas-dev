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

const ChatBot = () => {
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
        content: 'Desculpe, ocorreu um erro. Por favor, tente novamente. / Sorry, an error occurred. Please try again.',
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
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
      >
        <div className="relative w-16 h-16 flex items-center justify-center transition-transform duration-300 hover:scale-110">
          {/* Lego brick background with glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 blur-lg group-hover:blur-xl transition-all" />
          <img
            src={redFront}
            alt="Chat"
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
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-neutral-700/50 bg-neutral-900/95 backdrop-blur-lg animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700/50 bg-neutral-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <img
                  src={redFront}
                  alt="Hugo's Assistant"
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Hugo's Assistant</h3>
                <p className="text-xs text-neutral-400">hugoviegas.dev</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleChat}
              className="text-neutral-400 hover:text-white hover:bg-neutral-700/50"
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
                <h4 className="font-medium text-white mb-2">Olá! 👋</h4>
                <p className="text-sm text-neutral-400 mb-4">
                  Sou o assistente do Hugo em hugoviegas.dev. Pergunte sobre tecnologia, projetos, habilidades ou o que quiser!
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Me fale sobre o Hugo', 'Quais tecnologias você usa?', 'Como foi feito este site?'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setInput(suggestion);
                        inputRef.current?.focus();
                      }}
                      className="text-xs px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
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
                          : 'bg-neutral-800 text-neutral-100 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-800 text-neutral-100 px-4 py-2.5 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
          
          {/* Rate limit info */}
          <div className="px-4 py-1.5 text-xs text-neutral-500 border-t border-neutral-800/50 bg-neutral-900/50">
            <span>{rateInfo.dayRemaining}/100 perguntas restantes hoje</span>
            <span className="mx-2">•</span>
            <span>{rateInfo.minuteRemaining}/15 por minuto</span>
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-700/50 bg-neutral-800/30">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                disabled={isLoading}
                className="flex-1 bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-primary"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
