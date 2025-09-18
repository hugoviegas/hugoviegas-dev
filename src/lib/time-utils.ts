/**
 * Time Utilities Module
 *
 * Provides time-based utilities for greeting calculation and timezone handling
 * according to the time-utils contract specification.
 */

export type TimeBasedGreeting = "morning" | "afternoon" | "evening" | "night";

export interface TimeContext {
  currentHour: number; // 0-23
  currentMinute: number; // 0-59
  timezone: string; // IANA timezone identifier
  timestamp: Date; // Current timestamp
  isDST: boolean; // Daylight saving time flag
}

export interface GreetingData {
  type: TimeBasedGreeting;
  text: {
    EN: string;
    PT: string;
  };
  emoji: string;
  timeRange: {
    start: number; // Hour (0-23)
    end: number; // Hour (0-23)
  };
}

export interface TimeUtils {
  getCurrentTime(): TimeContext;
  getTimeBasedGreeting(hour?: number): GreetingData;
  formatTimeForDisplay(date: Date): string;
  getUserTimezone(): string;
}

// Greeting ranges as defined in contract
const GREETING_RANGES = {
  morning: { start: 5, end: 11, emoji: "🌅" },
  afternoon: { start: 12, end: 16, emoji: "☀️" },
  evening: { start: 17, end: 20, emoji: "🌆" },
  night: { start: 21, end: 4, emoji: "🌙" },
} as const;

// Greeting translations
const GREETING_TRANSLATIONS: Record<
  TimeBasedGreeting,
  { EN: string; PT: string }
> = {
  morning: { EN: "Hi, Good Morning! I'm", PT: "Oi, Bom Dia! Eu sou" },
  afternoon: { EN: "Hi, Good Afternoon! I'm", PT: "Oi, Boa Tarde! Eu sou" },
  evening: { EN: "Hi, Good Evening! I'm", PT: "Oi, Boa Noite! Eu sou" },
  night: { EN: "Hi, Good Night! I'm", PT: "Oi, Boa Noite! Eu sou" },
};

/**
 * Get the user's timezone using Intl API with fallback
 */
export function getUserTimezone(): string {
  try {
    // Primary method: Use Intl.DateTimeFormat
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    // Fallback: Try to get from browser
    try {
      return (
        new Date()
          .toLocaleString("en", { timeZoneName: "long" })
          .split(", ")[1] || "UTC"
      );
    } catch (fallbackError) {
      // Final fallback: UTC
      return "UTC";
    }
  }
}

/**
 * Get current time context
 */
export function getCurrentTime(): TimeContext {
  const now = new Date();
  const timezone = getUserTimezone();

  // Calculate DST (Daylight Saving Time)
  const january = new Date(now.getFullYear(), 0, 1);
  const july = new Date(now.getFullYear(), 6, 1);
  const isDST =
    Math.max(january.getTimezoneOffset(), july.getTimezoneOffset()) !==
    now.getTimezoneOffset();

  return {
    currentHour: now.getHours(),
    currentMinute: now.getMinutes(),
    timezone,
    timestamp: now,
    isDST,
  };
}

/**
 * Calculate time-based greeting based on hour
 */
export function getTimeBasedGreeting(hour?: number): GreetingData {
  const currentHour = hour ?? new Date().getHours();

  // Handle night range that wraps around midnight
  if (
    currentHour >= GREETING_RANGES.night.start ||
    currentHour <= GREETING_RANGES.night.end
  ) {
    return {
      type: "night",
      text: GREETING_TRANSLATIONS.night,
      emoji: GREETING_RANGES.night.emoji,
      timeRange: GREETING_RANGES.night,
    };
  }

  // Check other ranges
  for (const [greetingType, range] of Object.entries(GREETING_RANGES)) {
    if (currentHour >= range.start && currentHour <= range.end) {
      const type = greetingType as TimeBasedGreeting;
      return {
        type,
        text: GREETING_TRANSLATIONS[type],
        emoji: range.emoji,
        timeRange: range,
      };
    }
  }

  // Default fallback (should not reach here with proper ranges)
  return {
    type: "morning",
    text: GREETING_TRANSLATIONS.morning,
    emoji: GREETING_RANGES.morning.emoji,
    timeRange: GREETING_RANGES.morning,
  };
}

/**
 * Format time for display
 */
export function formatTimeForDisplay(date: Date): string {
  try {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    // Fallback formatting
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }
}

/**
 * Get greeting for current time
 */
export function getCurrentGreeting(): GreetingData {
  const timeContext = getCurrentTime();
  return getTimeBasedGreeting(timeContext.currentHour);
}

/**
 * Check if current time is within a specific greeting range
 */
export function isCurrentTimeInRange(greetingType: TimeBasedGreeting): boolean {
  const currentHour = new Date().getHours();
  const range = GREETING_RANGES[greetingType];

  if (greetingType === "night") {
    return currentHour >= range.start || currentHour <= range.end;
  }

  return currentHour >= range.start && currentHour <= range.end;
}

/**
 * Get all greeting ranges for reference
 */
export function getGreetingRanges() {
  return { ...GREETING_RANGES };
}

/**
 * Validate timezone string
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
}

// Default export for the TimeUtils interface
const timeUtils: TimeUtils = {
  getCurrentTime,
  getTimeBasedGreeting,
  formatTimeForDisplay,
  getUserTimezone,
};

export default timeUtils;
