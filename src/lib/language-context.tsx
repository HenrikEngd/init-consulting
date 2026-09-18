"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Lang } from "@/lib/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "init-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("no");

  useEffect(() => {
    // Read the persisted language after mount (localStorage isn't available
    // during SSR, and the first client render must match the server's
    // default to avoid a hydration mismatch), then sync it into state once.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "no" || stored === "en") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from an external store (localStorage) after mount
        setLangState(stored);
      }
    } catch {
      // localStorage unavailable (private mode etc.) — fall back to default
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggleLang = useCallback(
    () => setLangState((prev) => (prev === "no" ? "en" : "no")),
    []
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, toggleLang, t: dictionaries[lang] }),
    [lang, setLang, toggleLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
