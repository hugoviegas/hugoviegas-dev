import React, { useEffect, useState } from "react";
import { Lock, Gift } from "lucide-react";
import { UserSelection } from "@/features/presente-x/components/UserSelection";
import { usePresenterUser } from "@/features/presente-x/contexts/UserContext";
import "@/features/presente-x/styles/theme.css";

function setCookie(name: string, value: string, days: number) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

interface PasswordGateProps {
  children: React.ReactNode;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [stage, setStage] = useState<"password" | "user" | "done">("password");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loading, setLoading] = useState(true);
  const { currentUser } = usePresenterUser();

  const EXPECTED_PASSWORD = import.meta.env.VITE_PRESENTE_X_PASSWORD || "2405";

  useEffect(() => {
    const saved = getCookie("presente_x_access");
    if (saved === "granted") {
      setStage("user");
    }
    setLoading(false);
  }, []);
  // Keep hooks in a stable order: this effect must run on every render
  // (it's placed before any early returns) to avoid hook order mismatches.
  useEffect(() => {
    if (stage === "user" && currentUser) {
      setStage("done");
    }
    if (stage === "done" && !currentUser) {
      setStage("user");
    }
  }, [stage, currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === EXPECTED_PASSWORD) {
      setCookie("presente_x_access", "granted", 365);
      setError(false);
      setStage("user");
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => setPassword(""), 600);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] to-[#F5E6D3]" />
    );
  }

  if (stage === "done") {
    return <>{children}</>;
  }

  if (stage === "user") {
    return <UserSelection onUserSelected={() => setStage("done")} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FAF7F2] via-[#F5E6D3] to-[#E8D4C4] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#D4A574] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#E8B4A0] rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div
        className={`max-w-md w-full space-y-12 relative z-10 transition-transform duration-500 ${shaking ? "animate-pulse" : ""}`}
      >
        {/* Animated lock icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/30 animate-bounce">
            <Lock className="w-12 h-12 text-[#D4A574]" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-bold text-[#6B5D52] leading-tight">
            Presente X
          </h2>
          <p className="text-[#9B8968] text-base md:text-lg">
            Insira o código secreto para desbloquear sua jornada de surpresas.
          </p>
          <p className="text-xs text-[#A8B8A0] italic">
            Uma surpresa a cada dia de maio... ✨
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className={`w-full px-6 py-4 text-center text-2xl tracking-widest font-mono font-bold placeholder-[#9B8968]/30 text-[#6B5D52] bg-white/70 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                error
                  ? "border-red-300 bg-red-50/50"
                  : "border-[#D4A574]/30 focus:border-[#D4A574] focus:bg-white"
              }`}
              placeholder="••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(false);
              }}
            />
            {error && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-pulse">
                <div className="text-red-400 text-sm font-semibold">✗</div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center font-medium animate-pulse">
              Código incorreto. Tente novamente! 🔐
            </div>
          )}

          <button
            type="submit"
            className="presente-x-btn w-full py-4 text-lg font-bold flex items-center justify-center gap-2 group"
          >
            <span>Desbloquear</span>
            <Gift className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
        </form>

        {/* Footer hint */}
        <p className="text-xs text-center text-[#9B8968]/60">
          💌 Dica: O código é especial. Pense na data importante! 📅
        </p>
      </div>

      {/* Floating decorative element */}
      <div className="fixed bottom-8 right-8 opacity-20 pointer-events-none animate-bounce">
        <Gift className="w-16 h-16 text-[#E8B4A0]" />
      </div>
    </div>
  );
};
