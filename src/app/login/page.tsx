"use client";

import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    <div className="login-page flex min-h-screen items-center justify-center bg-cocoa-950 px-4">
      {/* Subtle background texture */}
      <div className="login-bg" />

      <div className="login-card relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.06] bg-cocoa-900/80 shadow-2xl backdrop-blur-xl">
        {/* Top accent line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-brass-500/60 to-transparent" />

        <div className="px-8 pt-10 pb-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-cocoa-800/80 ring-1 ring-white/[0.06]">
                <Image src="/logo.jpg" alt="" width={48} height={48} className="rounded-xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-cocoa-900 bg-green-400" />
            </div>
          </div>

          {/* Title */}
          <div className="mt-6 text-center">
            <h1 className="text-[22px] font-bold tracking-tight text-cream">{t.adminPanel}</h1>
            <p className="mt-1.5 text-[13px] font-medium text-brass-400/70">جيت بوتك — ملوك الشاورما منذ ١٩٨٢</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-[13px] font-medium text-red-400">
                {error}
              </div>
            )}

            <label className="grid gap-2">
              <span className="text-[13px] font-semibold text-cream">{t.email}</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="login-input h-12 rounded-xl border border-white/[0.12] bg-cocoa-950/60 px-4 text-[14px] font-medium text-cream placeholder:text-cream focus:outline-none"
                placeholder="admin@getboatkeg.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-[13px] font-semibold text-cream">{t.password}</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="login-input h-12 rounded-xl border border-white/[0.12] bg-cocoa-950/60 px-4 text-[14px] font-medium text-cream placeholder:text-cream focus:outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="login-button mt-2 flex h-12 items-center justify-center gap-2.5 rounded-xl text-[14px] font-bold tracking-wide disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t.signingIn}
                </>
              ) : (
                t.signIn
              )}
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <div className="border-t border-white/[0.05] bg-cocoa-950/30 px-8 py-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-[13px] font-medium text-cream transition-colors hover:text-cream"
          >
            <ArrowLeft size={14} />
            {t.backToDashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}
