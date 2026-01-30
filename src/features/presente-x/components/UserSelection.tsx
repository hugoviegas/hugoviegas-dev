import React, { useMemo, useState } from "react";
import {
  findUserByName,
  PresenteUser,
} from "@/features/presente-x/services/userService";
import { usePresenterUser } from "@/features/presente-x/contexts/UserContext";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import "@/features/presente-x/styles/theme.css";

interface UserSelectionProps {
  onUserSelected: () => void;
}

const normalizeName = (value: string) => value.toLowerCase().trim();

export const UserSelection: React.FC<UserSelectionProps> = ({
  onUserSelected,
}) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { setCurrentUser } = usePresenterUser();

  const normalizedInput = useMemo(() => normalizeName(input), [input]);

  const handleSelectUser = (user: PresenteUser) => {
    setCurrentUser({
      id: user.id,
      full_name: user.full_name,
      total_points: user.total_points,
      coins_balance: user.coins_balance,
      current_streak: user.current_streak,
      longest_streak: user.longest_streak,
      last_visit_date: user.last_visit_date,
    });
    onUserSelected();
  };

  const handleSearch = async () => {
    if (!normalizedInput) return;

    const words = normalizedInput.split(" ").filter(Boolean);
    if (words.length < 2) {
      setNotFound(false);
      if (normalizedInput === "sthefany") {
        toast.error("Por favor, insira o nome completo.");
      } else {
        toast.error("Digite pelo menos nome e sobrenome.");
      }
      return;
    }

    setLoading(true);
    const exact = await findUserByName(normalizedInput);
    if (exact) {
      setNotFound(false);
      setLoading(false);
      handleSelectUser(exact);
      return;
    }
    setNotFound(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FAF7F2] via-[#F5E6D3] to-[#E8D4C4] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#D4A574] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-[#E8B4A0] rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white/60 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/30 animate-bounce">
            <Heart className="w-12 h-12 text-[#E8B4A0]" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-[#6B5D52]">
            Quem está aqui hoje?
          </h2>
          <p className="text-[#9B8968]">
            Digite seu nome completo para começar.
          </p>
        </div>

        <div className="space-y-4">
          <input
            className="presente-x-input w-full"
            placeholder="Digite seu nome completo"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              if (notFound) setNotFound(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSearch();
            }}
            autoFocus
          />

          <button
            className="presente-x-btn w-full"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Buscando..." : "Continuar"}
          </button>
        </div>
        {notFound && (
          <p className="text-center text-sm text-red-500 font-medium">
            Perfil não encontrado.
          </p>
        )}
      </div>
    </div>
  );
};
