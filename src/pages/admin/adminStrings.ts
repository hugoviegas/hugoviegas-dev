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
    EN: "Access confirmed. Full content editors will be added in a later update.",
    PT: "Acesso confirmado. Os editores completos de conteúdo serão adicionados em uma atualização futura.",
  },
  seedTitle: { EN: "Import seed content", PT: "Importar conteúdo inicial" },
  seedIntro: {
    EN: "Copies the site's current hard-coded content to Firestore. Preview the changes first; nothing is written until you confirm.",
    PT: "Copia o conteúdo atual do site, que está no código, para o Firestore. Veja as mudanças primeiro; nada é gravado até você confirmar.",
  },
  seedPreview: { EN: "Preview import", PT: "Pré-visualizar importação" },
  seedWrite: { EN: "Write changes", PT: "Gravar mudanças" },
  seedNothing: { EN: "Nothing to write", PT: "Nada para gravar" },
  seedLoading: { EN: "Comparing with Firestore…", PT: "Comparando com o Firestore…" },
  seedWriting: { EN: "Writing…", PT: "Gravando…" },
  seedDone: { EN: "Done. Docs written:", PT: "Concluído. Documentos gravados:" },
  seedError: { EN: "Import failed:", PT: "A importação falhou:" },
  seedUntouched: {
    EN: "Only in Firestore (left as is)",
    PT: "Só no Firestore (mantidos)",
  },
  "seedStatus.new": { EN: "New", PT: "Novo" },
  "seedStatus.changed": { EN: "Changed", PT: "Alterado" },
  "seedStatus.unchanged": { EN: "Unchanged", PT: "Sem mudança" },
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
