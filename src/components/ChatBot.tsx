import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  sendChatMessage,
  checkRateLimit,
  type ChatMessage,
} from "@/lib/chatbot-service";
import { useLanguage } from "@/hooks/useLanguage";
import redFront from "@/assets/lego-bricks/red-front.png";

interface ChatBotProps {
  projectId?: string;
  initialPrompt?: string;
  embedded?: boolean;
  onClose?: () => void;
}

const ChatBot = ({
  projectId,
  initialPrompt,
  embedded = false,
  onClose,
}: ChatBotProps) => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rateInfo, setRateInfo] = useState({
    minuteRemaining: 15,
    dayRemaining: 100,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastInitialPromptRef = useRef<string>();

  const updateRateInfo = useCallback(() => {
    const info = checkRateLimit();
    setRateInfo({
      minuteRemaining: info.minuteRemaining,
      dayRemaining: info.dayRemaining,
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      updateRateInfo();
    }
  }, [isOpen, updateRateInfo]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(updateRateInfo, 10000);
    return () => clearInterval(interval);
  }, [isOpen, updateRateInfo]);

  const sendMessage = useCallback(async (prompt: string) => {
    const trimmedInput = prompt.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmedInput,
      timestamp: Date.now(),
    };
    const previousMessages = messages;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(false);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(trimmedInput, previousMessages, {
        projectId,
        activeLanguage: language,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, timestamp: Date.now() },
      ]);
      updateRateInfo();
    } catch (requestError) {
      console.error("Failed to get response:", requestError);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, language, messages, projectId, updateRateInfo]);

  useEffect(() => {
    if (initialPrompt && initialPrompt !== lastInitialPromptRef.current) {
      lastInitialPromptRef.current = initialPrompt;
      void sendMessage(initialPrompt);
    }
  }, [initialPrompt, sendMessage]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const toggleChat = () => {
    if (isOpen) {
      onClose?.();
    }
    setIsOpen((prev) => !prev);
  };

  const panel = (
    <div
      className={
        embedded
          ? "flex h-[500px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-primary/30 bg-neutral-900 shadow-xl"
          : "fixed bottom-24 right-6 z-50 flex h-[500px] max-h-[calc(100vh-120px)] w-[360px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border border-neutral-700/50 bg-neutral-900/95 shadow-2xl backdrop-blur-lg"
      }
    >
      <div className="flex items-center justify-between border-b border-neutral-700/50 bg-neutral-800/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
            <img src={redFront} alt="" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Hugo's Assistant
            </h3>
            <p className="text-xs text-neutral-400">
              {projectId ? t("darcyAskTitle") : "hugoviegas.dev"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleChat}
          aria-label={t("chatClose")}
          className="text-neutral-400 hover:bg-neutral-700/50 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
              <img src={redFront} alt="" className="h-10 w-10 object-contain" />
            </div>
            <h4 className="mb-2 font-medium text-white">
              {t("chatGreeting")}
            </h4>
            <p className="mb-4 text-sm text-neutral-400">
              {projectId
                ? t("darcyChatDescription")
                : t("chatDescription")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={`${msg.timestamp}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-neutral-800 text-neutral-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-neutral-800 px-4 py-2.5 text-sm text-neutral-300">
                  {projectId ? t("darcyLoadingResponse") : t("chatLoading")}
                </div>
              </div>
            )}
            {error && (
              <p role="alert" className="text-sm text-red-300">
                {projectId ? t("darcyChatError") : t("chatError")}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-neutral-800/50 bg-neutral-900/50 px-4 py-1.5 text-xs text-neutral-500">
        <span>{rateInfo.dayRemaining}/100</span>
        <span className="mx-2">•</span>
        <span>{rateInfo.minuteRemaining}/15</span>
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t border-neutral-700/50 bg-neutral-800/30 p-3"
      >
        <div className="flex gap-2">
          <label htmlFor="chatbot-input" className="sr-only">
            {t("chatQuestionLabel")}
          </label>
          <Input
            id="chatbot-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t("chatInputPlaceholder")}
            disabled={isLoading}
            className="flex-1 border-neutral-700 bg-neutral-800/50 text-white placeholder:text-neutral-500 focus:border-primary"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            aria-label={t("chatSend")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );

  if (embedded) {
    return isOpen ? panel : null;
  }

  return (
    <>
      <button
        onClick={toggleChat}
        className="group fixed bottom-6 right-6 z-50"
        aria-label={isOpen ? t("chatClose") : t("chatOpen")}
      >
        <div className="relative flex h-16 w-16 items-center justify-center transition-transform duration-300 hover:scale-110">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 blur-lg transition-all group-hover:blur-xl" />
          <img src={redFront} alt="" className="relative z-10 h-14 w-14 object-contain drop-shadow-lg" />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
          </div>
          {!isOpen && <div className="absolute inset-0 animate-ping rounded-xl bg-primary/30" />}
        </div>
      </button>
      {isOpen && panel}
    </>
  );
};

export default ChatBot;
