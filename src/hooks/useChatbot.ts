import { useState, useCallback, useEffect } from "react";
import { generateSystemPrompt } from "@/config/chatbot-context";
import { useLanguage } from "@/hooks/useLanguage";

// Rate limiting constants
const MAX_QUESTIONS_PER_MINUTE = 4;
const MAX_QUESTIONS_PER_DAY = 30;
const ONE_MINUTE_MS = 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Storage keys for rate limiting
const RATE_LIMIT_KEY = "chatbot_rate_limit";

interface RateLimitData {
  minuteTimestamps: number[];
  dayTimestamps: number[];
  lastReset: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface UseChatbotReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  remainingMinute: number;
  remainingDay: number;
  isRateLimited: boolean;
}

// Get user identifier (using localStorage for simplicity)
const getUserId = (): string => {
  let userId = localStorage.getItem("chatbot_user_id");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("chatbot_user_id", userId);
  }
  return userId;
};

// Get rate limit data from localStorage
const getRateLimitData = (): RateLimitData => {
  try {
    const data = localStorage.getItem(RATE_LIMIT_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch {
    // If parsing fails, return default
  }
  return {
    minuteTimestamps: [],
    dayTimestamps: [],
    lastReset: Date.now(),
  };
};

// Save rate limit data to localStorage
const saveRateLimitData = (data: RateLimitData): void => {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch {
    // If saving fails, ignore
  }
};

// Clean up old timestamps
const cleanupTimestamps = (data: RateLimitData): RateLimitData => {
  const now = Date.now();

  // Check if we need to reset daily timestamps
  const dayStart = new Date().setHours(0, 0, 0, 0);
  if (data.lastReset < dayStart) {
    data.dayTimestamps = [];
    data.lastReset = now;
  }

  // Remove timestamps older than 1 minute
  data.minuteTimestamps = data.minuteTimestamps.filter(
    (ts) => now - ts < ONE_MINUTE_MS
  );

  // Remove timestamps older than 1 day
  data.dayTimestamps = data.dayTimestamps.filter(
    (ts) => now - ts < ONE_DAY_MS
  );

  return data;
};

// Check if rate limited
export const checkRateLimit = (): {
  allowed: boolean;
  remainingMinute: number;
  remainingDay: number;
} => {
  let data = getRateLimitData();
  data = cleanupTimestamps(data);

  const remainingMinute = Math.max(
    0,
    MAX_QUESTIONS_PER_MINUTE - data.minuteTimestamps.length
  );
  const remainingDay = Math.max(
    0,
    MAX_QUESTIONS_PER_DAY - data.dayTimestamps.length
  );

  return {
    allowed: remainingMinute > 0 && remainingDay > 0,
    remainingMinute,
    remainingDay,
  };
};

// Record a new request
const recordRequest = (): void => {
  let data = getRateLimitData();
  data = cleanupTimestamps(data);

  const now = Date.now();
  data.minuteTimestamps.push(now);
  data.dayTimestamps.push(now);

  saveRateLimitData(data);
};

// Call Gemini API
const callGeminiAPI = async (
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("API key not configured. Please set VITE_GEMINI_API_KEY in your environment variables.");
  }

  // Format messages for Gemini API
  const contents = messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `API request failed: ${response.status}`
    );
  }

  const data = await response.json();

  // Extract the response text from Gemini's response structure
  const responseText =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I could not generate a response.";

  return responseText;
};

export function useChatbot(): UseChatbotReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState(() => checkRateLimit());
  const { language } = useLanguage();

  // Update rate limit info periodically (every 15 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setRateLimit(checkRateLimit());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback(
    async (message: string) => {
      // Check rate limit
      const currentRateLimit = checkRateLimit();
      setRateLimit(currentRateLimit);

      if (!currentRateLimit.allowed) {
        const errorMsg =
          language === "PT"
            ? currentRateLimit.remainingDay === 0
              ? "Você atingiu o limite diário de perguntas. Tente novamente amanhã."
              : "Por favor, aguarde um momento antes de enviar outra pergunta."
            : currentRateLimit.remainingDay === 0
              ? "You have reached the daily question limit. Please try again tomorrow."
              : "Please wait a moment before sending another question.";
        setError(errorMsg);
        return;
      }

      // Clear any previous error
      setError(null);

      // Add user message
      const userMessage: ChatMessage = { role: "user", content: message };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      // Record the request for rate limiting
      recordRequest();
      
      // Update rate limit after recording request
      setRateLimit(checkRateLimit());

      setIsLoading(true);

      try {
        const systemPrompt = generateSystemPrompt(language);
        const response = await callGeminiAPI(updatedMessages, systemPrompt);

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: response,
        };
        setMessages([...updatedMessages, assistantMessage]);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : language === "PT"
              ? "Erro ao processar sua mensagem. Tente novamente."
              : "Error processing your message. Please try again.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setRateLimit(checkRateLimit());
      }
    },
    [messages, language]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    remainingMinute: rateLimit.remainingMinute,
    remainingDay: rateLimit.remainingDay,
    isRateLimited: !rateLimit.allowed,
  };
}
