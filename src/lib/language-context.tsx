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
  }, [lang]);

  /**
   * Store the choice, and say whether it will survive a reload.
   *
   * The effect above used to do this, but an effect runs after the render
   * that triggered it, which is too late when the next thing to happen is a
   * reload: the page would come back reading whatever was stored before.
   */
  const persist = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * Change the language by reloading the page in it.
   *
   * The choice is written first, then the page is reloaded and reads it back
   * on mount. The URL is untouched, so a reader deep in the page comes back
   * where they were, on the page they were on.
   *
   * Where the choice cannot be stored — a private window, blocked site data —
   * a reload would return in the old language, so the language is changed in
   * place instead. Switching without a reload is better than not switching.
   */
  const setLang = useCallback(
    (next: Lang) => {
      if (next === lang) return;
      if (persist(next)) {
        window.location.reload();
        return;
      }
      setLangState(next);
    },
    [lang, persist]
  );

  const toggleLang = useCallback(
    () => setLang(lang === "no" ? "en" : "no"),
    [lang, setLang]
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
