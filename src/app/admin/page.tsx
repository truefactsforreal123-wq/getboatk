import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "./sidebar";
import { redirect } from "next/navigation";
import { T } from "@/components/admin-translate";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const [branchCount, catCount, itemCount, reviewCount] = await Promise.all([
    prisma.branch.count(),
    prisma.category.count(),
    prisma.menuItem.count(),
    prisma.review.count(),
  ]);

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-10 lg:pt-10">
        <h1 className="text-2xl font-black text-cream"><T k="dashboardTitle" /></h1>
        <p className="mt-1 text-sm text-cream/60"><T k="welcomeBack" />, {user.email}</p>
        <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard labelKey="branches" value={branchCount} />
          <StatCard labelKey="categories" value={catCount} />
          <StatCard labelKey="items" value={itemCount} />
          <StatCard labelKey="reviews" value={reviewCount} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ labelKey, value }: { labelKey: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/8 bg-ink-900 p-4 lg:p-6">
      <span className="text-3xl lg:text-4xl font-black text-gold-300">{value}</span>
      <p className="mt-2 text-xs font-bold text-cream/70"><T k={labelKey} /></p>
    </div>
  );
}
