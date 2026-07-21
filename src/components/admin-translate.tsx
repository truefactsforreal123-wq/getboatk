"use client";

import { useAdminT } from "@/lib/use-admin-t";

export function T({ k }: { k: string }) {
  const t = useAdminT();
  return <>{t[k as keyof typeof t] ?? k}</>;
}
