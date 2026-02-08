import { supabase } from "@/features/presente-x/services/supabase";

export interface PresenteUser {
  id: number;
  full_name: string;
  name_normalized: string;
  total_points: number;
  coins_balance: number;
  current_streak: number;
  longest_streak: number;
  last_visit_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: number;
  user_id: number;
  day_number: number;
  points_earned: number;
  completed_at: string;
  answers?: Record<string, string> | null;
}

// Simple in-memory cache to avoid hammering the public worldtime API
let brazilTimeCache: { date: Date; fetchedAt: number } | null = null;
let warnedBrazilTimeApiDown = false;

const BRAZIL_OFFSET_HOURS = -3; // São Paulo standard time (UTC-3) - used as safe fallback

const normalizeName = (value: string) => value.toLowerCase().trim();

export async function getAllUsers(): Promise<PresenteUser[]> {
  const { data, error } = await supabase
    .from("presente_users")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return (data || []) as PresenteUser[];
}

export async function findUserByName(
  name: string,
): Promise<PresenteUser | null> {
  const normalized = normalizeName(name);

  const { data, error } = await supabase
    .from("presente_users")
    .select("*")
    .eq("name_normalized", normalized)
    .maybeSingle();

  if (error) {
    console.error("Error finding user:", error);
    return null;
  }

  return (data as PresenteUser) || null;
}

export async function findUserByPartialName(
  name: string,
): Promise<PresenteUser | null> {
  const normalized = normalizeName(name);

  const { data, error } = await supabase
    .from("presente_users")
    .select("*")
    .ilike("name_normalized", `%${normalized}%`)
    .order("full_name", { ascending: true })
    .limit(1);

  if (error) {
    console.error("Error finding user (partial):", error);
    return null;
  }

  return (data?.[0] as PresenteUser) || null;
}

export async function getUserById(id: number): Promise<PresenteUser | null> {
  const { data, error } = await supabase
    .from("presente_users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user by id", error);
    return null;
  }

  return (data as PresenteUser) || null;
}

export async function createUser(
  fullName: string,
): Promise<PresenteUser | null> {
  const normalized = normalizeName(fullName);
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("presente_users")
    .insert({
      full_name: fullName,
      name_normalized: normalized,
      total_points: 0,
      coins_balance: 0,
      current_streak: 0,
      longest_streak: 0,
      last_visit_date: today,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  return data as PresenteUser;
}

export async function updateUserStreak(
  userId: number,
  currentStreak: number,
  longestStreak: number,
): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("presente_users")
    .update({
      current_streak: currentStreak,
      longest_streak: Math.max(currentStreak, longestStreak),
      last_visit_date: today,
    })
    .eq("id", userId);

  return !error;
}

export async function updateUserPoints(
  userId: number,
  totalPoints: number,
): Promise<boolean> {
  const { error } = await supabase
    .from("presente_users")
    .update({ total_points: totalPoints })
    .eq("id", userId);

  return !error;
}

export async function updateUserCoins(
  userId: number,
  coinsBalance: number,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("presente_users")
    .update({ coins_balance: coinsBalance })
    .eq("id", userId)
    .select("*")
    .maybeSingle();

  if (error) {
    // Log structured details to help diagnose 400/403/other errors from Supabase
    try {
      const structuredError = error as {
        message?: string;
        status?: number;
        details?: string;
        hint?: string;
      };
      console.error("Error updating user coins", {
        userId,
        coinsBalance,
        message: structuredError.message,
        status: structuredError.status,
        details: structuredError.details,
        hint: structuredError.hint,
        full: error,
      });
    } catch (e) {
      console.error(
        "Error updating user coins (unable to stringify error)",
        error,
      );
    }
    return false;
  }

  if (!data) {
    console.warn("updateUserCoins: no row returned after update", {
      userId,
      coinsBalance,
    });
  }

  return true;
}

// Dedup concurrent fetches to avoid multiple errors when the endpoint is down
let brazilTimePromise: Promise<Date> | null = null;

async function getBrazilNow(): Promise<Date> {
  // reuse recent value for 60 seconds to reduce external requests
  try {
    const now = Date.now();
    if (brazilTimeCache && now - brazilTimeCache.fetchedAt < 60_000) {
      return new Date(brazilTimeCache.date);
    }

    // If a fetch is already in progress, reuse that promise
    if (brazilTimePromise) {
      return brazilTimePromise;
    }

    brazilTimePromise = (async () => {
      try {
        const response = await fetch(
          "https://worldtimeapi.org/api/timezone/America/Sao_Paulo",
        );

        // If the API returns an error status (429 etc), don't try to parse JSON
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          if (!warnedBrazilTimeApiDown) {
            console.warn(
              `WorldTimeAPI returned status ${response.status}: ${text} — falling back to computed São Paulo time. Consider checking the network or migrating to a more reliable time source.`,
            );
            warnedBrazilTimeApiDown = true;
          }

          // cache a fallback time for 5 minutes to avoid tight error loops
          brazilTimeCache = {
            date: new Date(Date.now() + BRAZIL_OFFSET_HOURS * 3600_000),
            fetchedAt: Date.now(),
          };
          return new Date(brazilTimeCache.date);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text().catch(() => "");
          if (!warnedBrazilTimeApiDown) {
            console.warn(
              "WorldTimeAPI returned non-JSON response — falling back to computed São Paulo time:",
              text,
            );
            warnedBrazilTimeApiDown = true;
          }
          brazilTimeCache = {
            date: new Date(Date.now() + BRAZIL_OFFSET_HOURS * 3600_000),
            fetchedAt: Date.now(),
          };
          return new Date(brazilTimeCache.date);
        }

        const data = await response.json();
        if (data?.datetime) {
          const dt = new Date(data.datetime);
          brazilTimeCache = { date: dt, fetchedAt: Date.now() };
          return dt;
        }
      } catch (error) {
        // network errors are common when remote is unreachable; log once and fallback
        if (!warnedBrazilTimeApiDown) {
          console.warn(
            "Fallback to computed São Paulo time; could not fetch Brazil time",
            error,
          );
          warnedBrazilTimeApiDown = true;
        }

        // Cache a computed São Paulo time for 5 minutes to avoid repeated network attempts
        brazilTimeCache = {
          date: new Date(Date.now() + BRAZIL_OFFSET_HOURS * 3600_000),
          fetchedAt: Date.now(),
        };
        return new Date(brazilTimeCache.date);
      } finally {
        // clear the in-flight promise so future calls can attempt again after cache expiry
        brazilTimePromise = null;
      }

      // final fallback (shouldn't be reached normally)
      brazilTimeCache = {
        date: new Date(Date.now() + BRAZIL_OFFSET_HOURS * 3600_000),
        fetchedAt: Date.now(),
      };
      return new Date(brazilTimeCache.date);
    })();

    return brazilTimePromise;
  } catch (err) {
    // unexpected error - return computed São Paulo date
    console.warn(
      "Unexpected error in getBrazilNow; falling back to computed São Paulo time",
      err,
    );
    return new Date(Date.now() + BRAZIL_OFFSET_HOURS * 3600_000);
  }
}

export async function touchDailyVisit(
  user: PresenteUser,
): Promise<PresenteUser | null> {
  const now = await getBrazilNow();
  const today = now.toISOString().split("T")[0];
  const lastVisit = user.last_visit_date;

  let nextStreak = 1;
  if (lastVisit) {
    const last = new Date(lastVisit + "T00:00:00Z");
    const diffDays = Math.floor(
      (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) {
      nextStreak = user.current_streak;
    } else if (diffDays === 1) {
      nextStreak = user.current_streak + 1;
    } else {
      nextStreak = 1;
    }
  }

  const longest = Math.max(nextStreak, user.longest_streak);

  const { data, error } = await supabase
    .from("presente_users")
    .update({
      current_streak: nextStreak,
      longest_streak: longest,
      last_visit_date: today,
    })
    .eq("id", user.id)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error updating daily visit", error);
    return null;
  }

  return data as PresenteUser;
}

export async function getUserProgress(userId: number): Promise<UserProgress[]> {
  const { data, error } = await supabase
    .from("presente_user_progress")
    .select("*")
    .eq("user_id", userId)
    .order("day_number", { ascending: true });

  if (error) {
    console.error("Error fetching progress:", error);
    return [];
  }

  return (data || []) as UserProgress[];
}

export async function getDayProgress(
  userId: number,
  dayNumber: number,
): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from("presente_user_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("day_number", dayNumber)
    .maybeSingle();

  if (error) {
    console.error("Error fetching day progress:", error);
    return null;
  }

  return (data as UserProgress) || null;
}

/**
 * Fetch the most recently updated progress for the given day across all users.
 * This lets multiple participants view/continue the same shared story.
 */
let warnedMissingUpdatedAt = false;

export async function getSharedDayProgress(
  dayNumber: number,
): Promise<UserProgress | null> {
  // Use 'id' descending as a proxy for recency to avoid 400 errors on missing 'updated_at'
  const { data, error } = await supabase
    .from("presente_user_progress")
    .select("*")
    .eq("day_number", dayNumber)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching shared day progress:", error);
    return null;
  }

  return (data as UserProgress) || null;
}

export async function recordDayProgress(
  userId: number,
  dayNumber: number,
  coinsEarned: number,
  answers?: Record<string, string> | null,
): Promise<UserProgress | null> {
  const insertObj: any = {
    user_id: userId,
    day_number: dayNumber,
    points_earned: coinsEarned,
  };

  if (answers !== undefined) {
    insertObj.answers = answers;
  }

  const { data, error } = await supabase
    .from("presente_user_progress")
    .insert(insertObj)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error recording day progress:", error);
    return null;
  }

  return (data as UserProgress) || null;
}

export async function upsertDayProgress(
  userId: number,
  dayNumber: number,
  coinsEarned: number,
  answers?: Record<string, unknown> | null,
  // When provided, will write/update the progress under this target user's row
  // This allows multiple participants to collaboratively edit one canonical story row
  targetUserId?: number,
): Promise<UserProgress | null> {
  type UpsertProgressPayload = {
    user_id: number;
    day_number: number;
    points_earned: number;
    answers?: Record<string, unknown> | null;
  };

  const payload: UpsertProgressPayload = {
    user_id: targetUserId ?? userId,
    day_number: dayNumber,
    points_earned: coinsEarned,
  };

  if (answers !== undefined) {
    payload.answers = answers;
  }

  const { data, error } = await supabase
    .from("presente_user_progress")
    .upsert(payload, { onConflict: "user_id,day_number" })
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Error upserting day progress:", error);
    return null;
  }

  return (data as UserProgress) || null;
}
