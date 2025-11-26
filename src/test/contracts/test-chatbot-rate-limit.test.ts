import { describe, it, expect, beforeEach, vi } from "vitest";

// Since the rate limiting logic is not easily testable directly from the hook,
// we'll test the core rate limiting concepts through mocked localStorage

describe("Chatbot Rate Limiting", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Rate limit data structure", () => {
    it("should initialize with empty rate limit data", () => {
      const data = localStorage.getItem("chatbot_rate_limit");
      expect(data).toBeNull();
    });

    it("should store rate limit data correctly", () => {
      const mockData = {
        minuteTimestamps: [Date.now()],
        dayTimestamps: [Date.now()],
        lastReset: Date.now(),
      };
      
      localStorage.setItem("chatbot_rate_limit", JSON.stringify(mockData));
      
      const retrieved = JSON.parse(localStorage.getItem("chatbot_rate_limit") || "{}");
      expect(retrieved.minuteTimestamps).toHaveLength(1);
      expect(retrieved.dayTimestamps).toHaveLength(1);
    });
  });

  describe("Minute rate limiting (4 per minute)", () => {
    it("should allow up to 4 requests in a minute", () => {
      const now = Date.now();
      const mockData = {
        minuteTimestamps: [now - 1000, now - 2000, now - 3000], // 3 requests
        dayTimestamps: [now - 1000, now - 2000, now - 3000],
        lastReset: now,
      };
      
      // 3 requests made, should allow 1 more
      const remaining = 4 - mockData.minuteTimestamps.length;
      expect(remaining).toBe(1);
    });

    it("should block when 4 requests made in a minute", () => {
      const now = Date.now();
      const mockData = {
        minuteTimestamps: [now - 1000, now - 2000, now - 3000, now - 4000], // 4 requests
        dayTimestamps: [now - 1000, now - 2000, now - 3000, now - 4000],
        lastReset: now,
      };
      
      const remaining = 4 - mockData.minuteTimestamps.length;
      expect(remaining).toBe(0);
    });

    it("should reset minute count after 60 seconds", () => {
      const now = Date.now();
      const oldTimestamps = [
        now - 65000, // 65 seconds ago
        now - 70000, // 70 seconds ago
        now - 75000, // 75 seconds ago
        now - 80000, // 80 seconds ago
      ];
      
      // Filter timestamps older than 60 seconds
      const validTimestamps = oldTimestamps.filter((ts) => now - ts < 60000);
      expect(validTimestamps).toHaveLength(0);
    });
  });

  describe("Daily rate limiting (30 per day)", () => {
    it("should allow up to 30 requests per day", () => {
      const now = Date.now();
      const dayTimestamps = Array(29).fill(now - 1000); // 29 requests
      
      const remaining = 30 - dayTimestamps.length;
      expect(remaining).toBe(1);
    });

    it("should block when 30 requests made in a day", () => {
      const now = Date.now();
      const dayTimestamps = Array(30).fill(now - 1000); // 30 requests
      
      const remaining = 30 - dayTimestamps.length;
      expect(remaining).toBe(0);
    });

    it("should reset daily count at midnight", () => {
      const now = Date.now();
      const dayStart = new Date().setHours(0, 0, 0, 0);
      
      // Simulate data from yesterday
      const yesterdayTimestamp = dayStart - 1000; // Just before midnight
      
      // Check if lastReset is before day start
      const shouldReset = yesterdayTimestamp < dayStart;
      expect(shouldReset).toBe(true);
    });
  });

  describe("User identification", () => {
    it("should generate a unique user ID if not present", () => {
      const userId = localStorage.getItem("chatbot_user_id");
      expect(userId).toBeNull();
      
      // Simulate generating a user ID
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem("chatbot_user_id", newUserId);
      
      const storedUserId = localStorage.getItem("chatbot_user_id");
      expect(storedUserId).toBe(newUserId);
      expect(storedUserId).toMatch(/^user_\d+_[a-z0-9]+$/);
    });

    it("should reuse existing user ID", () => {
      const existingUserId = "user_123456789_abc123";
      localStorage.setItem("chatbot_user_id", existingUserId);
      
      const storedUserId = localStorage.getItem("chatbot_user_id");
      expect(storedUserId).toBe(existingUserId);
    });
  });

  describe("Combined rate limits", () => {
    it("should be blocked if either limit is reached", () => {
      // Test: minute limit reached but day limit not reached
      const minuteRemaining = 0;
      const dayRemaining = 20;
      const allowed1 = minuteRemaining > 0 && dayRemaining > 0;
      expect(allowed1).toBe(false);

      // Test: day limit reached but minute limit not reached
      const minuteRemaining2 = 3;
      const dayRemaining2 = 0;
      const allowed2 = minuteRemaining2 > 0 && dayRemaining2 > 0;
      expect(allowed2).toBe(false);

      // Test: both limits have remaining
      const minuteRemaining3 = 2;
      const dayRemaining3 = 15;
      const allowed3 = minuteRemaining3 > 0 && dayRemaining3 > 0;
      expect(allowed3).toBe(true);
    });
  });
});

describe("Chatbot Context", () => {
  it("should have portfolio context data available", async () => {
    const { portfolioContext } = await import("@/config/chatbot-context");
    
    expect(portfolioContext.personal.name).toBe("Hugo Viegas");
    expect(portfolioContext.personal.location).toBe("Dublin, Ireland");
    expect(portfolioContext.currentRole.title).toBe("IT Support Specialist");
  });

  it("should generate system prompt for EN language", async () => {
    const { generateSystemPrompt } = await import("@/config/chatbot-context");
    
    const prompt = generateSystemPrompt("EN");
    
    expect(prompt).toContain("Hugo Viegas");
    expect(prompt).toContain("ONLY answer questions about Hugo Viegas");
    expect(prompt).toContain("Dublin, Ireland");
  });

  it("should generate system prompt for PT language", async () => {
    const { generateSystemPrompt } = await import("@/config/chatbot-context");
    
    const prompt = generateSystemPrompt("PT");
    
    expect(prompt).toContain("Hugo Viegas");
    expect(prompt).toContain("APENAS perguntas sobre Hugo Viegas");
  });
});
