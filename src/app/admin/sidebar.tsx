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
    return `flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-bold transition-colors ${
      active ? "bg-brand-500/15 text-gold-300" : "text-cream/55 hover:bg-white/5 hover:text-cream"
    }`;
  }

  function toggleLang() {
    const current = window.localStorage.getItem("getboatkeg-admin-lang");
    switchAdminLang(current === "en" ? "ar" : "en");
  }

  const navContent = (
    <>
      <div className="flex items-center gap-3 border-b border-white/15 px-5 py-5">
        <Image src="/logo.jpg" alt="" width={40} height={40} className="rounded-full" />
        <span className="text-sm font-black text-cream">{ta.adminPanel}</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={linkClass(href)} onClick={() => setOpen(false)}>
            <Icon size={18} />
            {label}
            {href === "/admin/orders" && unseenOrders > 0 && (
              <span className="me-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white">
                {unseenOrders > 99 ? "99+" : unseenOrders}
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/15 p-3">
        <button onClick={toggleLang} className="mb-1 flex w-full min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-bold text-cream/70 hover:bg-white/5 hover:text-cream">
          <Languages size={18} />
          {ta.language}
        </button>
        <a href="/" target="_blank" className="mb-1 flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-bold text-cream/70 hover:bg-white/5 hover:text-cream">
          <Flame size={18} />
          {ta.viewSite}
        </a>
        <button onClick={() => signOut()} className="flex w-full min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-bold text-cream/70 hover:bg-white/5 hover:text-cream">
          <LogOut size={18} />
          {ta.signOut}
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 right-4 z-50 rounded-lg bg-ink-900 border border-white/10 p-2 text-cream lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className="hidden lg:flex w-64 flex-col border-e border-white/15 bg-ink-900 shrink-0">
        {navContent}
      </aside>

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-64 flex-col bg-ink-900 border-e border-white/15 transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 left-4 rounded-lg p-1 text-cream/55 hover:text-cream"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
        {navContent}
      </aside>
    </>
  );
}
