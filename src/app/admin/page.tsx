import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "./sidebar";
import { redirect } from "next/navigation";
import { T } from "@/components/admin-translate";
import {
  MapPin,
  UtensilsCrossed,
  Star,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import type { ElementType } from "react";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");

  const [branchCount, catCount, itemCount, reviewCount] = await Promise.all([
    prisma.branch.count(),
    prisma.category.count(),
    prisma.menuItem.count(),
    prisma.review.count(),
  ]);

  const today = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-cocoa-950">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 py-8 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brass-500/[0.12]">
                <TrendingUp size={18} className="text-brass-400" />
              </div>
              <div>
                <h1 className="text-[22px] font-bold tracking-tight text-cream">
                  <T k="dashboardTitle" />
                </h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium text-cream/60">
                  <CalendarDays size={13} />
                  {today}
                </p>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              labelKey="branches"
              value={branchCount}
              icon={MapPin}
              color="brass"
              href="/admin/branches"
            />
            <StatCard
              labelKey="categories"
              value={catCount}
              icon={UtensilsCrossed}
              color="warm"
              href="/admin/menu"
            />
            <StatCard
              labelKey="items"
              value={itemCount}
              icon={TrendingUp}
              color="green"
              href="/admin/menu"
            />
            <StatCard
              labelKey="reviews"
              value={reviewCount}
              icon={Star}
              color="rose"
              href="/admin/reviews"
            />
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-cream/55">
              <T k="quickActions" />
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <QuickAction
                href="/admin/orders"
                icon={UtensilsCrossed}
                labelKey="orders"
                descriptionKey="manageOrders"
              />
              <QuickAction
                href="/admin/menu"
                icon={UtensilsCrossed}
                labelKey="menuEditor"
                descriptionKey="editMenuItems"
              />
              <QuickAction
                href="/admin/tables"
                icon={MapPin}
                labelKey="tablesTitle"
                descriptionKey="manageTables"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const colorMap = {
  brass: {
    iconBg: "bg-brass-500/[0.1]",
    iconColor: "text-brass-400",
    ring: "ring-brass-500/[0.08]",
  },
  warm: {
    iconBg: "bg-cocoa-400/[0.12]",
    iconColor: "text-cocoa-300",
    ring: "ring-cocoa-400/[0.08]",
  },
  green: {
    iconBg: "bg-green-500/[0.1]",
    iconColor: "text-green-400",
    ring: "ring-green-500/[0.08]",
  },
  rose: {
    iconBg: "bg-red-400/[0.1]",
    iconColor: "text-red-400",
    ring: "ring-red-400/[0.08]",
  },
} as const;

function StatCard({
  labelKey,
  value,
  icon: Icon,
  color,
  href,
}: {
  labelKey: string;
  value: number;
  icon: ElementType;
  color: keyof typeof colorMap;
  href: string;
}) {
  const c = colorMap[color];
  return (
    <Link
      href={href}
      className="stat-card group relative overflow-hidden rounded-2xl border border-white/[0.1] bg-cocoa-900 p-5 transition-all duration-300 hover:border-white/[0.15] hover:bg-cocoa-800/80"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.iconBg} ring-1 ${c.ring}`}
        >
          <Icon size={18} className={c.iconColor} strokeWidth={2} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[28px] font-bold tracking-tight text-cream">
            {value}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-cream/60">
          <T k={labelKey} />
        </p>
        <ArrowUpRight
          size={14}
          className="text-cream/30 transition-all duration-300 group-hover:text-cream/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  );
}

function QuickAction({
  href,
  icon: Icon,
  labelKey,
  descriptionKey,
}: {
  href: string;
  icon: ElementType;
  labelKey: string;
  descriptionKey: string;
}) {
  return (
    <Link
      href={href}
      className="quick-action group flex items-center gap-4 rounded-2xl border border-white/[0.1] bg-cocoa-900/60 p-4 transition-all duration-300 hover:border-white/[0.15] hover:bg-cocoa-900/80"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-500/[0.08] ring-1 ring-brass-500/[0.06] transition-colors duration-300 group-hover:bg-brass-500/[0.12]">
        <Icon size={18} className="text-brass-400 transition-colors duration-300 group-hover:text-brass-300" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-cream/80 transition-colors duration-300 group-hover:text-cream">
          <T k={labelKey} />
        </p>
        <p className="mt-0.5 text-[12px] font-medium text-cream/50">
          <T k={descriptionKey} />
        </p>
      </div>
      <ArrowUpRight
        size={16}
        className="shrink-0 text-cream/30 transition-all duration-300 group-hover:text-cream/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
