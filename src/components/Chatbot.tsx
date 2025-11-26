import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import { MessageCircle, Send, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/hooks/useChatbot";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

// Import a LEGO brick image for the floating icon
import yellowFront from "@/assets/lego-bricks/yellow-front.png";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useLanguage();

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    remainingMinute,
    remainingDay,
    isRateLimited,
  } = useChatbot();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading || isRateLimited) return;

    setInputValue("");
    await sendMessage(trimmedInput);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <>
      {/* Floating Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50",
          "w-16 h-16 rounded-full",
          "glass-strong",
          "flex items-center justify-center",
          "shadow-lg hover:shadow-xl",
          "transform hover:scale-110 active:scale-95",
          "transition-all duration-300",
          "group",
          isOpen && "rotate-12"
        )}
        aria-label={isOpen ? t("chatbot.close") : t("chatbot.title")}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-primary" />
        ) : (
          <div className="relative">
            <img
              src={yellowFront}
              alt=""
              className="w-10 h-10 object-contain drop-shadow-md group-hover:animate-bounce"
            />
            <MessageCircle className="absolute -bottom-1 -right-1 w-5 h-5 text-primary bg-background rounded-full p-0.5" />
          </div>
        )}
      </button>

      {/* Chat Dialog */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-6 z-50",
            "w-[min(400px,calc(100vw-48px))] h-[min(600px,calc(100vh-160px))]",
            "glass-strong rounded-3xl",
            "flex flex-col",
            "shadow-2xl",
            "animate-in slide-in-from-bottom-4 fade-in duration-300"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <img
                src={yellowFront}
                alt=""
                className="w-8 h-8 object-contain"
              />
              <div>
                <h3 className="font-semibold text-foreground">
                  {t("chatbot.title")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("chatbot.rateLimit.day")}: {remainingDay}/30
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={clearMessages}
                className="h-8 w-8"
                title={t("chatbot.clear")}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome message if no messages */}
            {messages.length === 0 && (
              <div className="glass rounded-2xl p-4 text-sm text-foreground/80">
                {t("chatbot.welcome")}
              </div>
            )}

            {/* Chat messages */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl p-3 text-sm",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "glass text-foreground"
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="glass rounded-2xl p-3 text-sm text-foreground/60">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                    </div>
                    <span>{t("chatbot.loading")}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="glass rounded-2xl p-3 text-sm text-red-400 border border-red-400/30">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border/50">
            {/* Rate limit indicator */}
            {isRateLimited && (
              <div className="mb-2 text-xs text-amber-400 text-center">
                {remainingDay === 0
                  ? t("chatbot.rateLimit.day")
                  : t("chatbot.rateLimit.minute")}
                : 0
              </div>
            )}

            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("chatbot.placeholder")}
                disabled={isLoading || isRateLimited}
                className={cn(
                  "flex-1 min-h-[44px] max-h-[120px] resize-none",
                  "px-4 py-2 rounded-xl",
                  "bg-muted/50 border border-border/50",
                  "text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "text-sm"
                )}
                rows={1}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputValue.trim() || isLoading || isRateLimited}
                className="h-[44px] w-[44px] rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Remaining questions indicator */}
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>
                {t("chatbot.rateLimit.minute")}: {remainingMinute}/4
              </span>
              <span>
                {t("chatbot.rateLimit.day")}: {remainingDay}/30
              </span>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
