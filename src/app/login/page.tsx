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
      <div className="w-full max-w-sm rounded-xl border border-white/8 bg-ink-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <Image src="/logo.jpg" alt="" width={72} height={72} className="mx-auto rounded-full shadow-gold-glow" />
          <h1 className="mt-4 text-xl font-black text-cream">{t.adminPanel}</h1>
          <p className="mt-1 text-xs text-cream/45">جيت بوئتك</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && <p className="rounded-lg bg-brand-500/15 px-4 py-2.5 text-xs font-bold text-brand-300">{error}</p>}

          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-cream/55">{t.email}</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="min-h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm font-semibold text-cream placeholder:text-cream/25 focus:border-gold-400 focus:outline-none" placeholder="admin@getboatkeg.com" />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-cream/55">{t.password}</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="min-h-11 rounded-lg border border-white/10 bg-black/20 px-4 text-sm font-semibold text-cream placeholder:text-cream/25 focus:border-gold-400 focus:outline-none" />
          </label>

          <button type="submit" disabled={loading} className="brand-button mt-2 w-full">
            {loading ? <Flame size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? t.signingIn : t.signIn}
          </button>
        </form>
      </div>
    </div>
  );
}
