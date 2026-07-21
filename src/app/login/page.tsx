"use client";

import { createClient } from "@/lib/supabase/client";
import { Flame, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminT } from "@/lib/use-admin-t";

export default function AdminLogin() {
  const t = useAdminT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-cocoa-900 shadow-2xl">
        <div className="bg-gradient-to-br from-cocoa-800 to-cocoa-900 px-8 py-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-brass-500/10 shadow-lg">
            <Image src="/logo.jpg" alt="" width={56} height={56} className="rounded-xl" />
          </div>
          <h1 className="mt-5 text-2xl font-black text-cream">{t.adminPanel}</h1>
          <p className="mt-1 text-sm text-brass-400 font-bold">جيت بوئتك</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-8">
          {error && <p className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs font-bold text-red-400">{error}</p>}

          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-cream/60">{t.email}</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="min-h-12 rounded-xl border border-white/10 bg-cocoa-950 px-4 text-sm font-semibold text-cream placeholder:text-cream/25 focus:border-brass-500 focus:ring-1 focus:ring-brass-500/30 focus:outline-none transition-colors" placeholder="admin@getboatkeg.com" />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-cream/60">{t.password}</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="min-h-12 rounded-xl border border-white/10 bg-cocoa-950 px-4 text-sm font-semibold text-cream placeholder:text-cream/25 focus:border-brass-500 focus:ring-1 focus:ring-brass-500/30 focus:outline-none transition-colors" />
          </label>

          <button type="submit" disabled={loading} className="brand-button mt-3 w-full rounded-xl">
            {loading ? <Flame size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? t.signingIn : t.signIn}
          </button>
        </form>
      </div>
    </div>
  );
}
