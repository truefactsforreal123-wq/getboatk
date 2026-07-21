"use client";

import { approveReview, deleteReview } from "@/lib/actions";
import { useAdminT } from "@/lib/use-admin-t";
import { Check, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Review = {
  id: number;
  branchId: number | null;
  branch?: { nameAr: string; nameEn: string } | null;
  name: string;
  rating: number;
  text: string;
  approved: boolean;
  createdAt: Date | string;
};

export function ReviewsEditor({ reviews: initial, branches }: { reviews: Review[]; branches: { id: number; nameAr: string; nameEn: string }[] }) {
  const t = useAdminT();
  const router = useRouter();
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (branchFilter === "all") return initial;
    return initial.filter((r) => r.branchId === Number(branchFilter));
  }, [initial, branchFilter]);

  if (initial.length === 0) {
    return <p className="mt-8 text-sm text-cream">{t.noReviews}</p>;
  }

  return (
    <div className="mt-6 space-y-3">
      {branches.length > 0 && (
        <div className="flex items-center gap-3">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-ink-900 px-4 py-2 text-sm font-bold text-cream"
          >
            <option value="all">{t.allBranches}</option>
            {branches.map((b) => (
              <option key={b.id} value={String(b.id)}>{b.nameAr}</option>
            ))}
          </select>
          <span className="text-xs text-cream">{filtered.length} {t.reviews}</span>
        </div>
      )}

      {filtered.map((r) => (
        <div key={r.id} className={`rounded-xl border p-5 overflow-hidden ${r.approved ? "border-white/8 bg-ink-900" : "border-gold-400/25 bg-gold-500/5"}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-cream">{r.name}</span>
                {r.branch && <span className="rounded bg-brand-500/10 px-2 py-0.5 text-[10px] font-black text-brand-300">{r.branch.nameAr}</span>}
                {!r.approved && <span className="rounded bg-gold-200/20 px-2 py-0.5 text-[10px] font-black text-gold-300">{t.pending}</span>}
              </div>
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < r.rating ? "#F5B942" : "none"} className={i < r.rating ? "text-gold-300" : "text-ink-700"} />
                ))}
              </div>
              <p className="mt-2 text-sm leading-6 text-cream break-all">{r.text}</p>
              <p className="mt-2 text-xs text-cream">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              {!r.approved && (
                <button
                  onClick={async () => {
                    try {
                      await approveReview(r.id);
                      router.refresh();
                    } catch (err) {
                      console.error("Failed to approve review:", err);
                      alert("Failed. Please try again.");
                    }
                  }}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-olive-400/16 text-olive-400"
                >
                  <Check size={15} />
                </button>
              )}
              <button
                onClick={async () => {
                  if (!confirm(t.deleteReviewConfirm)) return;
                  try {
                    await deleteReview(r.id);
                    router.refresh();
                  } catch (err) {
                    console.error("Failed to delete review:", err);
                    alert("Failed. Please try again.");
                  }
                }}
                className="grid h-8 w-8 place-items-center rounded-lg text-cream hover:text-red-400"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
