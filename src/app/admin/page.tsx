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
    <div className="flex min-h-screen bg-cocoa-950">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-10 lg:pt-10">
        {/* Welcome header */}
        <div className="rounded-2xl border border-brass-500/10 bg-gradient-to-bl from-cocoa-900 via-cocoa-900/80 to-cocoa-950 p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-2 w-2 rounded-full bg-brass-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-brass-400/70"><T k="dashboardTitle" /></span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-cream">
            <T k="welcomeBack" />, {user.email?.split("@")[0]}
          </h1>
          <p className="mt-2 text-sm text-cocoa-300">جيت بوتك — الطعم الدمشقي الفاخر</p>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
          <StatCard labelKey="branches" value={branchCount} icon="📍" />
          <StatCard labelKey="categories" value={catCount} icon="📋" />
          <StatCard labelKey="items" value={itemCount} icon="🍽️" />
          <StatCard labelKey="reviews" value={reviewCount} icon="⭐" />
        </div>

        {/* Quick links */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a href="/admin/orders" className="quick-action group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-cocoa-900/60 p-4 transition-all hover:border-brass-500/20 hover:bg-cocoa-900/80">
            <span className="text-xl">🔔</span>
            <div>
              <p className="text-sm font-bold text-cream"><T k="orders" /></p>
              <p className="text-xs text-cocoa-300"><T k="manageOrders" /></p>
            </div>
          </a>
          <a href="/admin/menu" className="quick-action group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-cocoa-900/60 p-4 transition-all hover:border-brass-500/20 hover:bg-cocoa-900/80">
            <span className="text-xl">📖</span>
            <div>
              <p className="text-sm font-bold text-cream"><T k="menu" /></p>
              <p className="text-xs text-cocoa-300"><T k="editMenuItems" /></p>
            </div>
          </a>
          <a href="/admin/tables" className="quick-action group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-cocoa-900/60 p-4 transition-all hover:border-brass-500/20 hover:bg-cocoa-900/80">
            <span className="text-xl">🪑</span>
            <div>
              <p className="text-sm font-bold text-cream"><T k="tables" /></p>
              <p className="text-xs text-cocoa-300"><T k="manageTables" /></p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}

function StatCard({ labelKey, value, icon }: { labelKey: string; value: number; icon: string }) {
  return (
    <div className="stat-card rounded-xl border border-white/[0.06] bg-cocoa-900/60 p-5 lg:p-6 transition-all hover:border-brass-500/15">
      <div className="flex items-center justify-between">
        <span className="text-3xl lg:text-4xl font-display font-bold text-brass-400">{value}</span>
        <span className="text-xl opacity-60">{icon}</span>
      </div>
      <p className="mt-2 text-xs font-bold uppercase tracking-wider text-cocoa-300"><T k={labelKey} /></p>
    </div>
  );
}
