import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { languages, LanguageCode } from "@/config/languages";
import { getTranslation } from "@/config/translations";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  currentLanguage: (typeof languages)[LanguageCode];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    // Initialize from localStorage immediately
    try {
      const saved = localStorage.getItem("language") as LanguageCode;
      return saved && saved in languages ? saved : "EN";
    } catch {
      return "EN";
    }
  });

  const setLanguage = useCallback((newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    try {
      localStorage.setItem("language", newLanguage);
    } catch (e) {
      console.error("Error saving language to localStorage:", e);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = language === "EN" ? "PT" : "EN";
    setLanguage(newLang);
  }, [language, setLanguage]);

  const t = useCallback(
    (key: string): string => {
      return getTranslation(key, language);
    },
    [language]
  );

  const currentLanguage = languages[language];

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    currentLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
