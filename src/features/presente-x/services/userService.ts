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
}

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
  const { error } = await supabase
    .from("presente_users")
    .update({ coins_balance: coinsBalance })
    .eq("id", userId);

  return !error;
}

async function getBrazilNow(): Promise<Date> {
  try {
    const response = await fetch(
      "https://worldtimeapi.org/api/timezone/America/Sao_Paulo",
    );
    const data = await response.json();
    if (data?.datetime) {
      return new Date(data.datetime);
    }
  } catch (error) {
    console.error("Fallback to local time; could not fetch Brazil time", error);
  }
  return new Date();
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
