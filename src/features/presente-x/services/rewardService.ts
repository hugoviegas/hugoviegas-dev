import { supabase } from "@/features/presente-x/services/supabase";
import { PresenteUser, getUserById, updateUserCoins } from "@/features/presente-x/services/userService";

export interface Reward {
  id: number;
  title: string;
  description: string | null;
  cost_coins: number;
  is_active: boolean;
  created_at: string;
}

export interface Redemption {
  id: number;
  user_id: number;
  reward_id: number | null;
  reward_name: string;
  reward_description: string | null;
  points_cost: number;
  coins_spent: number;
  is_redeemed: boolean;
  redeemed_at: string;
}

export async function listRewards(): Promise<Reward[]> {
  const { data, error } = await supabase
    .from("presente_rewards")
    .select("*")
    .eq("is_active", true)
    .order("cost_coins", { ascending: true });

  if (error) {
    console.error("Error listing rewards", error);
    return [];
  }

  return (data || []) as Reward[];
}

export async function createReward(
  title: string,
  description: string,
  costCoins: number,
): Promise<Reward | null> {
  const { data, error } = await supabase
    .from("presente_rewards")
    .insert({ title, description, cost_coins: costCoins })
    .select("*")
    .single();

  if (error) {
    console.error("Error creating reward", error);
    return null;
  }

  return data as Reward;
}

export async function listRedemptions(userId: number): Promise<Redemption[]> {
  const { data, error } = await supabase
    .from("presente_user_rewards")
    .select("*")
    .eq("user_id", userId)
    .order("redeemed_at", { ascending: false });

  if (error) {
    console.error("Error listing redemptions", error);
    return [];
  }

  return (data || []) as Redemption[];
}

export async function redeemReward(
  userId: number,
  reward: Reward,
): Promise<{ user: PresenteUser; redemption: Redemption } | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  if (user.coins_balance < reward.cost_coins) {
    throw new Error("Saldo insuficiente");
  }

  const newBalance = user.coins_balance - reward.cost_coins;
  const coinsUpdated = await updateUserCoins(userId, newBalance);
  if (!coinsUpdated) {
    throw new Error("Não foi possível atualizar as moedas");
  }

  const { data, error } = await supabase
    .from("presente_user_rewards")
    .insert({
      user_id: userId,
      reward_id: reward.id,
      reward_name: reward.title,
      reward_description: reward.description,
      points_cost: reward.cost_coins,
      coins_spent: reward.cost_coins,
      is_redeemed: true,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("Error creating redemption", error);
    return null;
  }

  return {
    user: { ...user, coins_balance: newBalance },
    redemption: data as Redemption,
  };
}
