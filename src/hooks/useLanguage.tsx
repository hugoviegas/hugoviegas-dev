import { useState, useEffect, useCallback } from "react";
import { languages, LanguageCode } from "@/config/languages";
import { getTranslation } from "@/config/translations";

// Create a global state for language
let globalLanguage: LanguageCode = "EN";
const globalListeners: Set<() => void> = new Set();

// Initialize from localStorage immediately
try {
  const saved = localStorage.getItem("language") as LanguageCode;
  if (saved && saved in languages) {
    globalLanguage = saved;
  }
} catch {
  // If localStorage fails, keep default
}

const notifyListeners = () => {
  globalListeners.forEach((listener) => listener());
};

const setGlobalLanguage = (newLanguage: LanguageCode) => {
  globalLanguage = newLanguage;
  try {
    localStorage.setItem("language", newLanguage);
  } catch (e) {
    console.error("Error saving language to localStorage:", e);
  }
  notifyListeners();
};

export function useLanguage() {
  const [language, setLanguage] = useState<LanguageCode>(globalLanguage);

  // Subscribe to global language changes
  useEffect(() => {
    const listener = () => {
      setLanguage(globalLanguage);
    };

    globalListeners.add(listener);

    return () => {
      globalListeners.delete(listener);
    };
  }, []);

  const toggleLanguage = useCallback(() => {
    const newLang = globalLanguage === "EN" ? "PT" : "EN";
    setGlobalLanguage(newLang);
  }, []);

  const setLanguageValue = useCallback((newLanguage: LanguageCode) => {
    setGlobalLanguage(newLanguage);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getTranslation(key, language);
    },
    [language]
  );

  const currentLanguage = languages[language];

  return {
    language,
    setLanguage: setLanguageValue,
    toggleLanguage,
    t,
    currentLanguage,
  };
}
