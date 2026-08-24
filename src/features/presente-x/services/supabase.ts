import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Key not found in environment variables.");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

export interface PresenteDay {
  id: number;
  day_number: number;
  title: string;
  description: string;
  video_url: string;
  youtube_id?: string;
  quiz_data: Record<string, any>;
  custom_content?: string;
  unlock_date: string;
  points_reward: number;
  is_active: boolean;
  created_at?: string;
}
