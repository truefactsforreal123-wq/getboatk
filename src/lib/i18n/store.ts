import type { Lang } from "./dictionaries";

const STORAGE_KEY = "gb-lang";
const DEFAULT_LANG: Lang = "ar";

let currentLang: Lang = DEFAULT_LANG;
const listeners = new Set<() => void>();

function readStored(): Lang {
  if (typeof window === "undefined") return DEFAULT_LANG;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "en" || saved === "ar" ? saved : DEFAULT_LANG;
}

// On the client, seed from localStorage once at module load.
if (typeof window !== "undefined") {
  currentLang = readStored();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Lang {
  return currentLang;
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG;
}

function setLang(next: Lang) {
  if (next === currentLang) return;
  currentLang = next;
  listeners.forEach((listener) => listener());
}

export const languageStore = {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  setLang,
};
