import React, { useEffect, useMemo, useState } from "react";
import { PasswordGate } from "@/features/presente-x/components/PasswordGate";
import { supabase, PresenteDay } from "@/features/presente-x/services/supabase";
import { CheckCircle, Gift, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { isAfter, parseISO } from "date-fns";
import "@/features/presente-x/styles/theme.css";
import { usePresenterUser } from "@/features/presente-x/contexts/UserContext";
import {
  getUserProgress,
  touchDailyVisit,
} from "@/features/presente-x/services/userService";
import { useNavigate } from "react-router-dom";
import { Day01 } from "@/features/presente-x/days/Dia01";
import { Day02 } from "@/features/presente-x/days/Dia02";

const MapLevel = ({
  day,
  locked,
  completed,
  onClick,
}: {
  day: PresenteDay;
  locked: boolean;
  completed: boolean;
  onClick: () => void;
}) => {
  return (
    <div className={`relative presente-x-level presente-x-animate-in`}>
      <button
        onClick={onClick}
        disabled={locked}
        className={`presente-x-level-button ${locked ? "locked" : "unlocked"} ${!locked && day.day_number === new Date().getDate() ? "active" : ""}`}
      >
        <span>{day.day_number}</span>
        {!locked && (
          <span className="presente-x-status-badge">
            {completed ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <span className="dot" />
            )}
          </span>
        )}
      </button>
    </div>
  );
};

const PresenteX = () => {
  const [days, setDays] = useState<PresenteDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeDay, setActiveDay] = useState<PresenteDay | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const { currentUser, setCurrentUser } = usePresenterUser();
  const navigate = useNavigate();

  const firstName = useMemo(() => {
    if (!currentUser?.full_name) return "";
    return currentUser.full_name.split(" ")[0];
  }, [currentUser]);

  useEffect(() => {
    fetchDays();
  }, []);

  useEffect(() => {
    const updateStreak = async () => {
      if (!currentUser) return;
      const updated = await touchDailyVisit({
        id: currentUser.id,
        full_name: currentUser.full_name,
        name_normalized: currentUser.full_name.toLowerCase(),
        total_points: currentUser.total_points,
        coins_balance: currentUser.coins_balance ?? 0,
        current_streak: currentUser.current_streak,
        longest_streak: currentUser.longest_streak,
        last_visit_date: currentUser.last_visit_date ?? null,
        created_at: "",
        updated_at: "",
      });
      if (updated) {
        setCurrentUser({
          id: updated.id,
          full_name: updated.full_name,
          total_points: updated.total_points,
          coins_balance: updated.coins_balance,
          current_streak: updated.current_streak,
          longest_streak: updated.longest_streak,
          last_visit_date: updated.last_visit_date,
        });
      }
    };
    updateStreak();
  }, [currentUser, setCurrentUser]);

  useEffect(() => {
    const loadProgress = async () => {
      if (!currentUser) {
        setCompletedDays(new Set());
        return;
      }
      const progress = await getUserProgress(currentUser.id);
      const completed = new Set(progress.map((p) => p.day_number));
      setCompletedDays(completed);
    };

    loadProgress();
  }, [currentUser]);

  const fetchDays = async () => {
    try {
      const { data, error } = await supabase
        .from("presente_days")
        .select("*")
        .order("day_number", { ascending: true });

      if (error) throw error;
      setDays(data || []);
      const points = (data || []).reduce(
        (sum, day) => sum + (day.points_reward || 0),
        0,
      );
      setTotalPoints(points);
    } catch (error) {
      console.error("Error fetching days:", error);
      if (days.length === 0) {
        setDays(
          Array.from({ length: 31 }, (_, i) => ({
            id: i,
            day_number: i + 1,
            title: `Dia ${i + 1}`,
            description: "",
            video_url: "",
            quiz_data: {},
            unlock_date: new Date(2026, 4, i + 1, 9, 0, 0).toISOString(),
            points_reward: 100,
            is_active: true,
          })),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (day: PresenteDay) => {
    const now = new Date();
    const unlockDate = parseISO(day.unlock_date);

    if (isAfter(unlockDate, now)) {
      const daysLeft = Math.ceil(
        (unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      toast.error(
        `💝 Essa surpresa abre em ${daysLeft} dia${daysLeft !== 1 ? "s" : ""}!`,
        { duration: 3000 },
      );
      return;
    }

    setActiveDay(day);
  };

  return (
    <PasswordGate>
      <div className="presente-x-container">
        {/* Background decorations */}
        <div className="presente-x-bg-decoration">
          <div className="blob-1" />
          <div className="blob-2" />
        </div>

        {/* Header */}
        <header className="presente-x-header">
          <div className="max-w-6xl mx-auto px-4 py-4 md:py-5 flex justify-between items-center relative z-10 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4A574] to-[#E8B4A0] rounded-lg flex items-center justify-center shadow-md">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="presente-x-heading text-2xl md:text-3xl leading-tight">
                  Presente
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/50 px-3 py-2 rounded-full backdrop-blur-sm border border-white/30 shadow-sm min-w-[170px] justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#D4A574]" />
                <div>
                  <p className="text-[11px] text-[#9B8968] uppercase tracking-wide">
                    {firstName || "Visitante"}
                  </p>
                </div>
              </div>
              <div className="text-right text-[12px] text-[#9B8968] leading-tight">
                <div className="font-mono text-base font-bold text-[#D4A574]">
                  🔥 {currentUser?.current_streak ?? 0}
                </div>
                <div className="font-mono text-base font-bold text-[#D4A574]">
                  💰 {currentUser?.coins_balance ?? 0}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 container max-w-2xl mx-auto py-12 px-4 md:px-6">
          {/* Title Section */}
          <div className="text-center mb-16">
            <div className="mb-4 inline-block">
              <Sparkles className="w-8 h-8 text-[#E8B4A0] animate-pulse" />
            </div>
            <h2 className="presente-x-heading text-4xl md:text-5xl mb-4">
              Mês de Surpresas
            </h2>
            <p className="presente-x-text text-lg md:text-xl max-w-lg mx-auto">
              Uma surpresa a cada dia do mês. Descubra, desbloqueie e ganhe
              moedas ao longo da jornada.
            </p>
          </div>

          {/* Map Grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="text-center">
                <div className="inline-block animate-spin">
                  <Sparkles className="w-8 h-8 text-[#D4A574]" />
                </div>
                <p className="mt-4 text-[#9B8968]">
                  Carregando suas surpresas...
                </p>
              </div>
            </div>
          ) : (
            <div className="presente-x-calendar relative pb-16">
              {/* Decorative path SVG (optional) */}
              <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20"
                style={{ zIndex: 0 }}
              >
                {/* Simplified path connecting the levels */}
                <line
                  x1="50%"
                  y1="0"
                  x2="50%"
                  y2="100%"
                  stroke="url(#pathGradient)"
                  strokeWidth="2"
                  strokeDasharray="10,5"
                />
                <defs>
                  <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A574" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#E8B4A0" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Levels */}
              {days.map((day) => {
                const isLocked = isAfter(parseISO(day.unlock_date), new Date());
                const isCompleted = completedDays.has(day.day_number);
                return (
                  <MapLevel
                    key={day.id}
                    day={day}
                    locked={isLocked}
                    completed={isCompleted}
                    onClick={() => handleDayClick(day)}
                  />
                );
              })}
            </div>
          )}

          {/* Footer CTA */}
          <div className="mt-16 text-center space-y-4">
            <p className="presente-x-text">
              💌 Aproveite cada dia, cada surpresa e cada momento especial!
            </p>
            <button
              className="presente-x-btn px-5 py-3"
              onClick={() => navigate("/presente-x/recompensas")}
            >
              Abrir loja de recompensas
            </button>
          </div>
        </main>

        {activeDay && (
          <div className="presente-x-modal-backdrop">
            <div className="presente-x-modal">
              {activeDay.day_number === 1 ? (
                <Day01 onClose={() => setActiveDay(null)} />
              ) : activeDay.day_number === 2 ? (
                <Day02 onClose={() => setActiveDay(null)} />
              ) : (
                <div className="presente-x-modal-content">
                  <div className="presente-x-modal-header">
                    <div>
                      <p className="presente-x-heading text-2xl">
                        Dia {activeDay.day_number}
                      </p>
                      <p className="presente-x-text text-sm">Em breve...</p>
                    </div>
                    <button
                      className="presente-x-btn"
                      onClick={() => setActiveDay(null)}
                    >
                      Fechar
                    </button>
                  </div>
                  <div className="presente-x-card p-6">
                    <p className="presente-x-text">
                      Estamos preparando algo especial para esse dia.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating elements (decorative) */}
        <div className="fixed bottom-4 right-4 pointer-events-none opacity-30 animate-bounce">
          <Gift className="w-12 h-12 text-[#E8B4A0]" />
        </div>
      </div>
    </PasswordGate>
  );
};

export default PresenteX;
