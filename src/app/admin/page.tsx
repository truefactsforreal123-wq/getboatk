import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "./sidebar";
import { redirect } from "next/navigation";
import { T } from "@/components/admin-translate";
import { MapPin, UtensilsCrossed, Star, CalendarDays, TrendingUp } from "lucide-react";

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

  const today = new Date().toLocaleDateString("ar-EG", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <main className="flex-1 p-4 pt-16 lg:p-8 lg:pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-cream"><T k="dashboardTitle" /></h1>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-cream/55">
            <CalendarDays size={14} className="text-brass-400" />
            {today}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard labelKey="branches" value={branchCount} icon={MapPin} color="brass" />
          <StatCard labelKey="categories" value={catCount} icon={UtensilsCrossed} color="gold" />
          <StatCard labelKey="items" value={itemCount} icon={TrendingUp} color="green" />
          <StatCard labelKey="reviews" value={reviewCount} icon={Star} color="red" />
        </div>
      </main>
    </div>
  );
}

const colorMap = {
  brass: { bg: "bg-brass-500/10", icon: "text-brass-400", accent: "bg-brass-500" },
  gold: { bg: "bg-gold-500/10", icon: "text-gold-300", accent: "bg-gold-300" },
  green: { bg: "bg-green-500/10", icon: "text-green-400", accent: "bg-green-400" },
  red: { bg: "bg-red-500/10", icon: "text-red-400", accent: "bg-red-400" },
} as const;

function StatCard({ labelKey, value, icon: Icon, color }: { labelKey: string; value: number; icon: React.ElementType; color: keyof typeof colorMap }) {
  const c = colorMap[color];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-cocoa-900 shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-xl">
      <div className={`absolute inset-x-0 top-0 h-1 ${c.accent}`} />
      <div className="p-5 pt-6">
        <div className="flex items-start justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg}`}>
            <Icon size={20} className={c.icon} />
          </div>
          <span className="text-4xl font-black text-cream">{value}</span>
        </div>
        <p className="mt-4 text-sm font-bold text-cream/60 uppercase tracking-wide"><T k={labelKey} /></p>
      </div>
    </div>
  );
}
