// Best-effort, in-memory rate limiting for /api/chat.
// Each warm function instance keeps its own counters, so this slows abuse
// down but is not a global guarantee. A shared store (for example Upstash
// Redis) would make it exact; that needs a separate approval.

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

interface Window {
  start: number;
  count: number;
}

export interface RateLimiterOptions {
  perMinute: number;
  perDay: number;
  globalPerHour: number;
}

export const DEFAULT_RATE_LIMITS: RateLimiterOptions = {
  perMinute: 6,
  perDay: 40,
  globalPerHour: 300,
};

const MINUTE = 60_000;
const DAY = 86_400_000;
const HOUR = 3_600_000;

export class RateLimiter {
  private minute = new Map<string, Window>();
  private day = new Map<string, Window>();
  private global: Window = { start: 0, count: 0 };

  constructor(private readonly options: RateLimiterOptions = DEFAULT_RATE_LIMITS) {}

  private bump(map: Map<string, Window>, key: string, span: number, limit: number, now: number) {
    const current = map.get(key);
    const window = current && now - current.start < span ? current : { start: now, count: 0 };
    if (window.count >= limit) return Math.ceil((window.start + span - now) / 1000);
    window.count += 1;
    map.set(key, window);
    return 0;
  }

  check(key: string, now = Date.now()): RateLimitResult {
    // Drop stale entries so memory stays small on a long-lived instance.
    if (this.day.size > 5_000) {
      for (const [k, w] of this.day) if (now - w.start >= DAY) this.day.delete(k);
      for (const [k, w] of this.minute) if (now - w.start >= MINUTE) this.minute.delete(k);
    }

    if (now - this.global.start >= HOUR) this.global = { start: now, count: 0 };
    if (this.global.count >= this.options.globalPerHour) {
      return { allowed: false, retryAfterSeconds: Math.ceil((this.global.start + HOUR - now) / 1000) };
    }

    const minuteWait = this.bump(this.minute, key, MINUTE, this.options.perMinute, now);
    if (minuteWait) return { allowed: false, retryAfterSeconds: minuteWait };
    const dayWait = this.bump(this.day, key, DAY, this.options.perDay, now);
    if (dayWait) {
      // Give back the minute slot taken above.
      const w = this.minute.get(key);
      if (w) w.count -= 1;
      return { allowed: false, retryAfterSeconds: dayWait };
    }
    this.global.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  }
}

/** Client IP as reported by Vercel's edge (first x-forwarded-for entry). */
export const clientKey = (headers: Headers): string =>
  headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "unknown";
