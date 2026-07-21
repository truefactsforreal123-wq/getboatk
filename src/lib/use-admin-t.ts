"use client";

import { useEffect, useReducer } from "react";
import { t, getAdminLang } from "@/lib/admin-strings";

export function useAdminT() {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const lang = getAdminLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    const handler = () => forceUpdate();
    window.addEventListener("admin-lang-changed", handler);
    return () => window.removeEventListener("admin-lang-changed", handler);
  }, []);
  return t;
}
