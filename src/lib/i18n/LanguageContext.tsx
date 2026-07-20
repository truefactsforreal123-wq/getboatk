"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Lang } from "./dictionaries";
import { languageStore } from "./store";

const STORAGE_KEY = "gb-lang";

type LanguageContextValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Dictionary;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    languageStore.subscribe,
    languageStore.getSnapshot,
    languageStore.getServerSnapshot,
  );
  const dir: "rtl" | "ltr" = lang === "ar" ? "rtl" : "ltr";

  // Sync the document direction/lang + persist. No React state is set here,
  // so this stays clear of the set-state-in-effect rule.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, dir]);

  const value: LanguageContextValue = {
    lang,
    dir,
    t: dictionaries[lang],
    setLang: languageStore.setLang,
    toggle: () => languageStore.setLang(lang === "ar" ? "en" : "ar"),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
