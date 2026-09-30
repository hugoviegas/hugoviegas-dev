import { useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import type { Translation } from "@/config/translations";

// Admin-only strings live in the lazy admin chunk so they stay out of the
// homepage bundle. Same EN / PT shape as src/config/translations.ts.
const adminStrings = {
  title: { EN: "Content admin", PT: "Administração de conteúdo" },
  intro: {
    EN: "Private area. Sign in with the owner's Google account.",
    PT: "Área privada. Entre com a conta Google do proprietário.",
  },
  signIn: { EN: "Sign in with Google", PT: "Entrar com Google" },
  signOut: { EN: "Sign out", PT: "Sair" },
  loading: { EN: "Checking sign-in…", PT: "Verificando login…" },
  checking: { EN: "Checking access…", PT: "Verificando acesso…" },
  denied: {
    EN: "This account does not have access. It has been signed out.",
    PT: "Esta conta não tem acesso. Ela foi desconectada.",
  },
  error: {
    EN: "Could not verify access. Check your connection and try again.",
    PT: "Não foi possível verificar o acesso. Verifique sua conexão e tente novamente.",
  },
  retry: { EN: "Try again", PT: "Tentar novamente" },
  signInError: {
    EN: "Sign-in failed. Try again.",
    PT: "Falha ao entrar. Tente novamente.",
  },
  unconfigured: {
    EN: "Firebase is not configured for this build. Set the VITE_FIREBASE_* variables.",
    PT: "O Firebase não está configurado nesta build. Defina as variáveis VITE_FIREBASE_*.",
  },
  signedInAs: { EN: "Signed in as", PT: "Conectado como" },
  granted: {
    EN: "Access confirmed. Content editors will be added in a later update.",
    PT: "Acesso confirmado. Os editores de conteúdo serão adicionados em uma atualização futura.",
  },
} satisfies Record<string, Translation>;

export type AdminStringKey = keyof typeof adminStrings;

export const useAdminT = () => {
  const { language } = useLanguage();
  return useCallback(
    (key: AdminStringKey) => adminStrings[key][language],
    [language],
  );
};

export { adminStrings };
