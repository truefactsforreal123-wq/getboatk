"use client";

import { signOut } from "@/lib/auth";
import {
  LayoutDashboard,
  UtensilsCrossed,
  MapPin,
  MessageSquareText,
  LogOut,
  Flame,
  Table2,
  ClipboardList,
  Settings,
  Menu,
  X,
  Languages,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAdminT } from "@/lib/use-admin-t";
import { switchAdminLang } from "@/lib/admin-strings";
import { useUnseenOrders } from "./UnseenOrdersProvider";

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ta = useAdminT();
  const { count: unseenOrders } = useUnseenOrders();

  const links = [
    { href: "/admin", label: ta.dashboard, icon: LayoutDashboard },
    { href: "/admin/menu", label: ta.menu, icon: UtensilsCrossed },
    { href: "/admin/branches", label: ta.branches, icon: MapPin },
    { href: "/admin/tables", label: ta.tables, icon: Table2 },
    { href: "/admin/orders", label: ta.orders, icon: ClipboardList },
    { href: "/admin/reviews", label: ta.reviews, icon: MessageSquareText },
    { href: "/admin/settings", label: ta.settings, icon: Settings },
  ];

  function linkClass(href: string) {
    const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
    return `sidebar-link flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
      active
        ? "sidebar-link-active bg-brass-500/[0.12] text-brass-400"
        : "text-cream hover:bg-white/[0.08] hover:text-cream"
    }`;
  }

  function toggleLang() {
    const current = window.localStorage.getItem("getboatkeg-admin-lang");
    switchAdminLang(current === "en" ? "ar" : "en");
  }

  const navContent = (
    <>
      {/* Brand header */}
      <div className="flex items-center gap-3 px-5 pb-6 pt-6">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-cocoa-800/80 ring-1 ring-white/[0.1]">
          <Image src="/logo.jpg" alt="" width={32} height={32} className="rounded-lg" />
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-cream">{ta.adminPanel}</span>
          <span className="text-[11px] font-medium text-cream">جيت بوتك</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/[0.08]" />

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(href)} onClick={() => setOpen(false)}>
            <Icon size={18} strokeWidth={2} />
            <span className="flex-1">{label}</span>
            {href === "/admin/orders" && unseenOrders > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500/90 px-1.5 text-[10px] font-bold text-white">
                {unseenOrders > 99 ? "99+" : unseenOrders}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4">
        <div className="mx-1 mb-3 h-px bg-white/[0.08]" />
        <div className="space-y-0.5">
          <button
            onClick={toggleLang}
            className="sidebar-link flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-cream transition-all duration-200 hover:bg-white/[0.08] hover:text-cream"
          >
            <Languages size={18} strokeWidth={2} />
            {ta.language}
          </button>
          <a
            href="/"
            target="_blank"
            className="sidebar-link flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-cream transition-all duration-200 hover:bg-white/[0.08] hover:text-cream"
          >
            <Flame size={18} strokeWidth={2} />
            {ta.viewSite}
          </a>
          <button
            onClick={() => signOut()}
            className="sidebar-link flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold text-cream transition-all duration-200 hover:bg-red-500/[0.08] hover:text-red-400/80"
          >
            <LogOut size={18} strokeWidth={2} />
            {ta.signOut}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-cocoa-900/90 text-cream backdrop-blur-sm lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="sidebar-container hidden lg:flex w-[260px] flex-col border-l border-white/[0.1] bg-cocoa-950/80 backdrop-blur-xl shrink-0">
        {navContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`sidebar-container fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col border-l border-white/[0.1] bg-cocoa-950/95 backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-lg text-cream transition-colors hover:text-cream"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
        {navContent}
      </aside>
    </>
  );
}
