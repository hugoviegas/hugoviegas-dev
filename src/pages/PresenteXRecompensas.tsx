import React, { useEffect, useState } from "react";
import { PasswordGate } from "@/features/presente-x/components/PasswordGate";
import { usePresenterUser } from "@/features/presente-x/contexts/UserContext";
import {
  listRewards,
  redeemReward,
  listRedemptions,
  Reward,
  Redemption,
} from "@/features/presente-x/services/rewardService";
import { toast } from "sonner";
import { Gift, ShoppingBag, Coins } from "lucide-react";
import "@/features/presente-x/styles/theme.css";
import { useNavigate } from "react-router-dom";

const PresenteXRecompensas = () => {
  const { currentUser, setCurrentUser } = usePresenterUser();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [store, redeemed] = await Promise.all([
        listRewards(),
        currentUser ? listRedemptions(currentUser.id) : Promise.resolve([]),
      ]);
      setRewards(store);
      setRedemptions(redeemed);
      setLoading(false);
    };
    load();
  }, [currentUser]);

  const handleRedeem = async (reward: Reward) => {
    if (!currentUser) {
      toast.error("Entre com seu nome primeiro.");
      return;
    }
    try {
      const result = await redeemReward(currentUser.id, reward);
      if (!result) {
        toast.error("Não foi possível resgatar agora.");
        return;
      }
      setCurrentUser({
        ...currentUser,
        coins_balance: result.user.coins_balance,
      });
      setRedemptions((prev) => [result.redemption, ...prev]);
      toast.success("Presente resgatado! 🎁");
    } catch (error: any) {
      toast.error(error?.message || "Saldo insuficiente.");
    }
  };

  return (
    <PasswordGate>
      <div className="presente-x-container min-h-screen">
        <header className="presente-x-header">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4A574] to-[#E8B4A0] rounded-lg flex items-center justify-center shadow-md">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="presente-x-heading text-xl">
                  Loja de Recompensas
                </p>
                <p className="text-xs text-[#9B8968]">
                  Troque moedas por presentes
                </p>
              </div>
            </div>
            <button
              className="presente-x-btn px-4 py-2 text-sm"
              onClick={() => navigate("/presente-x")}
            >
              Voltar
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="presente-x-heading text-3xl mb-2">
                Olá, {currentUser?.full_name || "Visitante"}
              </h2>
              <p className="presente-x-text">
                Use suas moedas para resgatar presentes especiais.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/60 px-4 py-3 rounded-2xl border border-white/40 backdrop-blur-sm shadow-sm">
              <Coins className="w-5 h-5 text-[#D4A574]" />
              <div className="text-sm text-[#6B5D52]">
                <div className="font-semibold">Saldo</div>
                <div className="font-mono text-lg font-bold text-[#D4A574]">
                  {currentUser?.coins_balance ?? 0} moedas
                </div>
              </div>
            </div>
          </div>

          <section className="space-y-4 mb-10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4A574]" />
              <h3 className="presente-x-heading text-2xl">Catálogo</h3>
            </div>
            {loading ? (
              <p className="presente-x-text">Carregando...</p>
            ) : rewards.length === 0 ? (
              <p className="presente-x-text">Nenhuma recompensa disponível.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => (
                  <div
                    key={reward.id}
                    className="presente-x-card p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-[#D4A574]" />
                      <p className="presente-x-heading text-lg">
                        {reward.title}
                      </p>
                    </div>
                    <p className="presente-x-text text-sm">
                      {reward.description || ""}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#D4A574] font-bold">
                        💰 {reward.cost_coins}
                      </span>
                      <button
                        className="presente-x-btn px-3 py-2 text-sm"
                        onClick={() => handleRedeem(reward)}
                        disabled={
                          (currentUser?.coins_balance ?? 0) < reward.cost_coins
                        }
                      >
                        Resgatar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#D4A574]" />
              <h3 className="presente-x-heading text-2xl">Resgates recentes</h3>
            </div>
            {redemptions.length === 0 ? (
              <p className="presente-x-text">
                Você ainda não resgatou nenhum presente.
              </p>
            ) : (
              <div className="space-y-2">
                {redemptions.map((redeem) => (
                  <div
                    key={redeem.id}
                    className="presente-x-card p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="presente-x-heading text-base">
                        {redeem.reward_name}
                      </p>
                      <p className="text-sm text-[#9B8968]">
                        Resgatado em{" "}
                        {new Date(redeem.redeemed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-mono text-sm text-[#D4A574]">
                      - {redeem.coins_spent} moedas
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </PasswordGate>
  );
};

export default PresenteXRecompensas;
