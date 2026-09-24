import React, { useEffect, useState } from "react";
import { PasswordGate } from "@/features/presente-x/components/PasswordGate";
import { usePresenterUser } from "@/features/presente-x/contexts/UserContext";
import {
  listRewards,
  redeemReward,
  listRedemptions,
  Reward,
  Redemption,
  getSeededRewards,
} from "@/features/presente-x/services/rewardService";
import { toast } from "sonner";
import { Gift, ShoppingBag, Coins, Sparkles } from "lucide-react";
import "@/features/presente-x/styles/theme.css";
import { useNavigate } from "react-router-dom";

type CartItem = {
  reward: Reward;
  quantity: number;
};

const PresenteXRecompensas = () => {
  const { currentUser, setCurrentUser } = usePresenterUser();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [revealMessage, setRevealMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [migrationMissing, setMigrationMissing] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [store, redeemed] = await Promise.all([
          listRewards(),
          currentUser ? listRedemptions(currentUser.id) : Promise.resolve([]),
        ]);
        setRewards(store);
        setRedemptions(redeemed);
      } catch (err: unknown) {
        if (err instanceof Error && err.message === "missing-table") {
          console.warn(
            "presente_rewards table missing in Supabase. Falling back to seeded rewards.",
          );
          setMigrationMissing(true);
          setRewards(getSeededRewards());
          setRedemptions(
            currentUser ? await listRedemptions(currentUser.id) : [],
          );
        } else {
          console.error("Error loading store:", err);
        }
      } finally {
        setLoading(false);
      }
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
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
          ? (error as { message: string }).message
          : "Saldo insuficiente.";
      toast.error(message);
    }
  };

  const purchasedMap = React.useMemo(() => {
    const map = new Map<number, Redemption>();
    redemptions.forEach((r) => {
      if (r.reward_id) map.set(r.reward_id, r);
    });
    return map;
  }, [redemptions]);

  const getAvailableQty = (reward: Reward) =>
    Math.max(1, reward.available_quantity ?? 1);

  const addToCart = (reward: Reward) => {
    if (reward.id < 0) {
      toast.error("Loja ainda não sincronizada com o banco.");
      return;
    }
    const maxQty = getAvailableQty(reward);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.reward.id === reward.id);
      if (existing) {
        if (existing.quantity >= maxQty) {
          toast.error("Quantidade máxima disponível atingida.");
          return prev;
        }
        return prev.map((item) =>
          item.reward.id === reward.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { reward, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (rewardId: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.reward.id === rewardId
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(1, item.quantity + delta),
                  getAvailableQty(item.reward),
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (rewardId: number) => {
    setCartItems((prev) => prev.filter((item) => item.reward.id !== rewardId));
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.reward.cost_coins * item.quantity,
    0,
  );

  const remainingCoins = (currentUser?.coins_balance ?? 0) - cartTotal;

  const handleCheckout = async () => {
    if (!currentUser) {
      toast.error("Entre com seu nome primeiro.");
      return;
    }
    if (cartItems.length === 0) return;
    if (remainingCoins < 0) {
      toast.error("Saldo insuficiente para finalizar a compra.");
      return;
    }

    try {
      const purchasedNames: string[] = [];
      let latestBalance = currentUser.coins_balance ?? 0;

      for (const item of cartItems) {
        if (item.reward.id < 0) {
          throw new Error("Loja ainda não sincronizada com o banco.");
        }
        const result = await redeemReward(
          currentUser.id,
          item.reward,
          item.quantity,
        );
        if (result) {
          latestBalance = result.user.coins_balance;
          purchasedNames.push(item.reward.title);
          setRedemptions((prev) => [result.redemption, ...prev]);
        }
      }

      setCurrentUser({
        ...currentUser,
        coins_balance: latestBalance,
      });

      setCartItems([]);
      setCartOpen(false);
      if (purchasedNames.length > 0) {
        setRevealMessage(
          `Parabéns! Você acaba de ganhar ${purchasedNames.join(", ")}.`,
        );
      }
    } catch (error: unknown) {
      const message =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message?: unknown }).message === "string"
          ? (error as { message: string }).message
          : "Não foi possível finalizar a compra.";
      toast.error(message);
    }
  };

  return (
    <PasswordGate>
      <div className="presente-x-container min-h-screen no-blur">
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
          <div className="presente-x-store-hero mb-8">
            <div>
              <h2 className="presente-x-heading text-3xl mb-2">
                Feira de Presentes 🎁
              </h2>
              <p className="presente-x-text">
                Escolha seus prêmios, coloque no carrinho e finalize a compra.
              </p>
            </div>
            <div className="presente-x-saldo-box">
              <div className="saldo-content">
                <Coins className="w-5 h-5 text-[#D4A574]" />
                <div className="text-sm text-[#6B5D52]">
                  <div className="font-semibold">Saldo</div>
                  <div className="font-mono text-lg font-bold text-[#D4A574]">
                    {currentUser?.coins_balance ?? 0} moedas
                  </div>
                </div>
              </div>
              <button
                className="presente-x-cart-button"
                onClick={() => setCartOpen(true)}
              >
                🛒 Carrinho ({cartItems.length})
              </button>
            </div>
          </div>

          <section className="space-y-4 mb-10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4A574]" />
              <h3 className="presente-x-heading text-2xl">Vitrine</h3>
            </div>
            {loading ? (
              <p className="presente-x-text">Carregando...</p>
            ) : rewards.length === 0 ? (
              <p className="presente-x-text">Nenhuma recompensa disponível.</p>
            ) : (
              <div className="presente-x-store-grid">
                {rewards.map((reward) => {
                  const isPurchased = purchasedMap.has(reward.id);
                  const canAfford =
                    (currentUser?.coins_balance ?? 0) >= reward.cost_coins;
                  const masked = reward.is_surprise && !isPurchased;
                  return (
                    <div
                      key={reward.id}
                      className={`presente-x-store-card ${!canAfford ? "is-disabled" : ""}`}
                    >
                      {isPurchased && (
                        <span className="presente-x-store-badge">Comprado</span>
                      )}
                      <div className="flex items-start gap-3">
                        <div className="presente-x-store-icon">
                          {masked
                            ? "❓"
                            : reward.title === "Açaí"
                              ? "🍨"
                              : reward.title === "Flores"
                                ? "🌸"
                                : reward.title === "Carta"
                                  ? "✉️"
                                  : reward.title === "Poema"
                                    ? "📜"
                                    : reward.title === "Vale cinema"
                                      ? "🎬"
                                      : reward.title === "Video especial IA"
                                        ? "🤖"
                                        : reward.title === "Livro personalizado"
                                          ? "📘"
                                          : reward.title ===
                                              "Gift Card para roupa"
                                            ? "🛍️"
                                            : reward.title ===
                                                "Passeio com almoço"
                                              ? "🍽️"
                                              : reward.title ===
                                                  "Presente Master"
                                                ? "🏆"
                                                : reward.title === "Lego"
                                                  ? "🧱"
                                                  : reward.title ===
                                                      "Passagem para Irlanda"
                                                    ? "✈️"
                                                    : reward.title ===
                                                        "Passagem para o Brasil"
                                                      ? "🇧🇷"
                                                      : "🎁"}
                        </div>
                        <div>
                          <p className="presente-x-heading text-lg">
                            {masked ? "???" : reward.title}
                          </p>
                          <p className="presente-x-text text-sm">
                            {masked
                              ? reward.hint || "Surpresa misteriosa"
                              : reward.description || reward.hint || ""}
                          </p>
                        </div>
                      </div>
                      <div className="presente-x-store-actions">
                        <span className="presente-x-store-price">
                          💰 {reward.cost_coins}
                        </span>
                        <button
                          className="presente-x-btn px-3 py-2 text-sm"
                          onClick={() => addToCart(reward)}
                          disabled={isPurchased || !canAfford}
                        >
                          {isPurchased ? "Comprado" : "Adicionar"}
                        </button>
                      </div>
                    </div>
                  );
                })}
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
        {cartOpen && (
          <div className="presente-x-cart-modal">
            <div className="presente-x-cart-panel">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4A574]" />
                  <p className="presente-x-heading text-xl">Seu carrinho</p>
                </div>
                <button
                  className="presente-x-btn"
                  onClick={() => setCartOpen(false)}
                >
                  Fechar
                </button>
              </div>

              {cartItems.length === 0 ? (
                <p className="presente-x-text">Seu carrinho está vazio.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.reward.id} className="presente-x-cart-row">
                      <div>
                        <p className="presente-x-heading text-base">
                          {item.reward.is_surprise &&
                          !purchasedMap.has(item.reward.id)
                            ? "???"
                            : item.reward.title}
                        </p>
                        <p className="text-xs text-[#9B8968]">
                          💰 {item.reward.cost_coins} cada
                        </p>
                      </div>
                      {getAvailableQty(item.reward) > 1 ? (
                        <div className="presente-x-qty">
                          <button
                            onClick={() => updateQuantity(item.reward.id, -1)}
                          >
                            −
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.reward.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#9B8968]">1 un.</span>
                      )}
                      <button
                        className="presente-x-btn px-3 py-2 text-sm"
                        onClick={() => removeFromCart(item.reward.id)}
                      >
                        Remover
                      </button>
                    </div>
                  ))}

                  <div className="presente-x-card p-4">
                    <div className="flex items-center justify-between">
                      <span className="presente-x-text">Total do carrinho</span>
                      <span className="presente-x-store-price">
                        💰 {cartTotal}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#9B8968] mt-2">
                      <span>Saldo atual</span>
                      <span>{currentUser?.coins_balance ?? 0} moedas</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#9B8968]">
                      <span>Saldo após compra</span>
                      <span>{remainingCoins} moedas</span>
                    </div>
                  </div>

                  <button
                    className="presente-x-btn w-full"
                    onClick={handleCheckout}
                  >
                    Comprar agora
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {revealMessage && (
          <div
            className="presente-x-reveal"
            onClick={() => setRevealMessage(null)}
          >
            <div className="presente-x-reveal-card">
              <div className="text-3xl mb-3">🎉</div>
              <p className="presente-x-heading text-2xl mb-2">Parabéns!</p>
              <p className="presente-x-text mb-4">{revealMessage}</p>
              <button
                className="presente-x-btn"
                onClick={() => setRevealMessage(null)}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </PasswordGate>
  );
};

export default PresenteXRecompensas;
