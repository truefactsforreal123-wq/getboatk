"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { site } from "@/lib/data";

export default function Navbar() {
  const { t, lang, toggle } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trap focus in mobile menu
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    },
    [open]
  );

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/menu", label: t.nav.menu },
    { href: "/branches", label: t.nav.branches },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream-50/90 shadow-[var(--shadow-elevation-mid)] backdrop-blur-xl"
          : "bg-cream-50/60 backdrop-blur-md"
      } border-b border-cocoa-900/10`}
      role="banner"
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative block size-11 overflow-hidden rounded-full ring-2 ring-brass-500/70 ring-offset-2 ring-offset-cream-50 transition-transform duration-500 group-hover:rotate-6">
            <Image
              src="/logo.jpg"
              alt={t.brand.name}
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl font-bold text-cocoa-900">
              {t.brand.name}
            </span>
            <span className="hidden text-[11px] font-medium tracking-wide text-brass-600 sm:block">
              {t.brand.tagline}
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`relative rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 ${
                isActive(link.href)
                  ? "text-brass-700"
                  : "text-cocoa-700 hover:text-cocoa-950"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brass-500"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  aria-hidden="true"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          {/* Language toggle */}
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${lang === "ar" ? "English" : "Arabic"}`}
            className="relative flex items-center rounded-full border border-cocoa-900/15 bg-cream-100 p-1 text-xs font-extrabold"
          >
            {(["ar", "en"] as const).map((l) => (
              <span
                key={l}
                className={`relative z-10 rounded-full px-2.5 py-1 transition-colors duration-300 ${
                  lang === l ? "text-cream-50" : "text-cocoa-600"
                }`}
              >
                {l === "ar" ? "ع" : "EN"}
              </span>
            ))}
            <motion.span
              className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-cocoa-800"
              animate={{
                insetInlineStart: lang === "ar" ? "4px" : "calc(50%)",
              }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              aria-hidden="true"
            />
          </button>

          {/* Hotline */}
          <a
            href={`tel:${site.hotline}`}
            className="hidden items-center gap-2 rounded-full bg-cocoa-800 px-5 py-2.5 text-sm font-extrabold text-cream-50 shadow-[var(--shadow-elevation-low)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cocoa-700 hover:shadow-[var(--shadow-elevation-mid)] sm:flex"
          >
            <Phone className="size-4 text-brass-400" aria-hidden="true" />
            <span dir="ltr">{site.hotlineDisplay}</span>
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid size-10 place-items-center rounded-full border border-cocoa-900/15 text-cocoa-800 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-cocoa-900/10 bg-cream-50/95 backdrop-blur-xl lg:hidden"
            role="navigation"
            aria-label="Mobile navigation"
            onKeyDown={handleKeyDown}
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-xl px-4 py-3 text-base font-bold transition-colors ${
                    isActive(link.href)
                      ? "bg-cocoa-800 text-cream-50"
                      : "text-cocoa-700 hover:bg-cream-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`tel:${site.hotline}`}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-cocoa-800 px-4 py-3 text-base font-extrabold text-cream-50"
              >
                <Phone className="size-4 text-brass-400" aria-hidden="true" />
                {t.nav.call} — <span dir="ltr">{site.hotlineDisplay}</span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
