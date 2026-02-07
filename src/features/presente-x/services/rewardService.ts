import { supabase } from "@/features/presente-x/services/supabase";
import {
  PresenteUser,
  getUserById,
  updateUserCoins,
} from "@/features/presente-x/services/userService";

export interface Reward {
  id: number;
  title: string;
  description: string | null;
  hint?: string | null;
  is_surprise?: boolean;
  available_quantity?: number | null;
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
  quantity?: number;
  is_redeemed: boolean;
  redeemed_at: string;
}

export function getSeededRewards(): Reward[] {
  return [
    {
      id: -1,
      title: "Açaí",
      description: "Um açaí bem gostoso para recarregar as energias.",
      hint: null,
      is_surprise: false,
      available_quantity: 1,
      cost_coins: 100,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -2,
      title: "Flores",
      description: null,
      hint: "Algo delicado para alegrar o dia.",
      is_surprise: true,
      available_quantity: 1,
      cost_coins: 300,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -3,
      title: "Carta",
      description: "Uma carta especial com palavras do coração.",
      hint: null,
      is_surprise: false,
      available_quantity: 1,
      cost_coins: 200,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -4,
      title: "Poema",
      description: "Um poema feito sob medida.",
      hint: null,
      is_surprise: false,
      available_quantity: 1,
      cost_coins: 100,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -5,
      title: "Vale cinema",
      description: "Uma ida ao cinema para um momento especial.",
      hint: null,
      is_surprise: false,
      available_quantity: 1,
      cost_coins: 400,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -6,
      title: "Video especial IA",
      description: null,
      hint: "Um conteúdo surpreendente feito com IA.",
      is_surprise: true,
      available_quantity: 1,
      cost_coins: 800,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -7,
      title: "Livro personalizado",
      description: null,
      hint: "Algo único feito só para você.",
      is_surprise: true,
      available_quantity: 1,
      cost_coins: 600,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -8,
      title: "Gift Card para roupa",
      description: "Um gift card para escolher algo especial.",
      hint: null,
      is_surprise: false,
      available_quantity: 1,
      cost_coins: 1000,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -9,
      title: "Passeio com almoço",
      description: null,
      hint: "Um passeio gostoso com uma refeição especial.",
      is_surprise: true,
      available_quantity: 1,
      cost_coins: 1000,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -10,
      title: "Presente Master",
      description: "O grande prêmio de toda a jornada.",
      hint: null,
      is_surprise: false,
      available_quantity: 1,
      cost_coins: 2000,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -11,
      title: "Lego",
      description: "Um Lego especial para construir memórias.",
      hint: null,
      is_surprise: false,
      available_quantity: 1,
      cost_coins: 10000,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -12,
      title: "Passagem para Irlanda",
      description: "Uma aventura especial do outro lado do oceano.",
      hint: null,
      is_surprise: false,
      available_quantity: 1,
      cost_coins: 999999,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: -13,
      title: "Passagem para o Brasil",
      description: "Um reencontro muito esperado.",
      hint: null,
      is_surprise: false,
      available_quantity: 1,
      cost_coins: 100000,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];
}

export async function listRewards(): Promise<Reward[]> {
  const { data, error } = await supabase
    .from("presente_rewards")
    .select("*")
    .eq("is_active", true)
    .order("cost_coins", { ascending: true });

  if (error) {
    console.error("Error listing rewards", error);
    // If the table is missing in Supabase, provide a local fallback and instruct to run the migration
    if (
      (error as any)?.code === "PGRST205" ||
      (error as any)?.message?.includes("Could not find the table")
    ) {
      throw new Error("missing-table");
    }
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
  quantity = 1,
): Promise<{ user: PresenteUser; redemption: Redemption } | null> {
  const user = await getUserById(userId);
  if (!user) return null;

  const qty = Math.max(1, Math.floor(quantity));
  const available = reward.available_quantity ?? 1;
  if (qty > available) {
    throw new Error("Quantidade indisponível");
  }
  const totalCost = reward.cost_coins * qty;

  if (user.coins_balance < totalCost) {
    throw new Error("Saldo insuficiente");
  }

  // Decrement stock atomically before finalizing purchase
  if ((reward.id ?? 0) > 0) {
    const { data: decData, error: decError } = await supabase.rpc(
      "decrement_reward_quantity",
      {
        rid: reward.id,
        q: qty,
      },
    );
    if (
      decError ||
      !(decData === true || (Array.isArray(decData) && decData[0] === true))
    ) {
      throw new Error("Quantidade indisponível");
    }
  }

  const newBalance = user.coins_balance - totalCost;
  const coinsUpdated = await updateUserCoins(userId, newBalance);
  if (!coinsUpdated) {
    // rollback stock
    if ((reward.id ?? 0) > 0) {
      await supabase.rpc("increment_reward_quantity", {
        rid: reward.id,
        q: qty,
      });
    }
    throw new Error("Não foi possível atualizar as moedas");
  }

  // Try to insert redemption, but be tolerant to missing columns in schema (PGRST204)
  let insertPayload: any = {
    user_id: userId,
    reward_id: reward.id,
    reward_name: reward.title,
    reward_description: reward.description,
    points_cost: reward.cost_coins,
    coins_spent: totalCost,
    quantity: qty,
    is_redeemed: true,
  };

  // Track which missing columns we've already warned about (module-level cache)
  const warnedMissingColumns = ((
    tryInsertAdaptive as any
  )._warnedMissingColumns ||= new Set<string>());

  // Helper to attempt insert with adaptive retry when schema columns are missing
  async function tryInsertAdaptive(payload: any) {
    let attemptPayload = { ...payload };
    const removedColumns: string[] = [];
    while (true) {
      const { data, error } = await supabase
        .from("presente_user_rewards")
        .insert(attemptPayload)
        .select("*")
        .single();

      if (!error && data) {
        // If we removed columns to succeed, log a single consolidated warning
        if (removedColumns.length > 0) {
          console.warn(
            `Partial insert succeeded but DB schema missing columns: ${removedColumns.join(", ")}. Please run the store migration to add them.`,
          );
        }
        return { data, error: null };
      }

      // If error indicates missing column(s), remove the offending column and retry
      const msg: string = (error && (error as any).message) || "";
      const m = msg.match(/Could not find the '([^']+)' column/);
      if (m && m[1]) {
        const col = m[1];
        // Warn only once per column to avoid log spam
        if (!warnedMissingColumns.has(col)) {
          console.warn(`Schema missing column '${col}', retrying without it`);
          warnedMissingColumns.add(col);
        }
        if (col in attemptPayload) {
          delete attemptPayload[col];
          removedColumns.push(col);
        } else {
          // if the column isn't in payload, can't do more
          return { data: null, error };
        }
        // loop and retry
        continue;
      }

      // non-schema error - return as is
      return { data: null, error };
    }
  }

  const insertResult = await tryInsertAdaptive(insertPayload);

  if (insertResult.error || !insertResult.data) {
    console.error("Error creating redemption", insertResult.error);
    // rollback coin update and stock
    await updateUserCoins(userId, user.coins_balance);
    if ((reward.id ?? 0) > 0) {
      await supabase.rpc("increment_reward_quantity", {
        rid: reward.id,
        q: qty,
      });
    }
    // If schema-related error, surface a helpful message
    const err = insertResult.error as any;
    if (err && err.code === "PGRST204") {
      throw new Error(
        "Configuração do banco incompleta. Rode a migration da loja.",
      );
    }

    throw new Error("Não foi possível finalizar a compra.");
  }

  const dataInserted = insertResult.data as any;

  return {
    user: { ...user, coins_balance: newBalance },
    redemption: dataInserted as Redemption,
  };
}
