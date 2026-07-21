"use client";

import { useAdminT } from "@/lib/use-admin-t";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useAdminT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 p-4">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-black text-cream">{t.somethingWentWrong}</h2>
        <p className="mt-2 text-sm text-cream/55">
          {t.unexpectedError}
        </p>
        <button
          onClick={reset}
          className="brand-button mt-6"
        >
          {t.tryAgain}
        </button>
        <a
          href="/admin"
          className="mt-3 inline-block text-sm font-bold text-cream/60 hover:text-cream"
        >
          {t.backToDashboard}
        </a>
      </div>
    </div>
  );
}
