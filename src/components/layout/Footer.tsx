"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Clock } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { site } from "@/lib/data";
import Pattern from "@/components/ui/Pattern";
import Ornament from "@/components/ui/Ornament";
import { FacebookIcon, InstagramIcon } from "@/components/ui/BrandIcons";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/menu", label: t.nav.menu },
    { href: "/branches", label: t.nav.branches },
  ];

  return (
    <footer
      className="relative overflow-hidden bg-cocoa-950 text-cream-100"
      role="contentinfo"
    >
      <Pattern className="pointer-events-none absolute inset-0 size-full text-cocoa-800 opacity-40" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="relative block size-14 overflow-hidden rounded-full bg-cream-50 ring-2 ring-brass-500/80">
                <Image
                  src="/logo.jpg"
                  alt={t.brand.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-cream-50">
                  {t.brand.name}
                </span>
                <span className="text-xs font-medium tracking-wide text-brass-400">
                  {t.brand.tagline}
                </span>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-cream-200/70">
              {t.footer.about}
            </p>
            <div className="flex items-center gap-3" role="list" aria-label="Social media links">
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook (opens in new tab)"
                className="grid size-10 place-items-center rounded-full border border-cream-100/15 text-cream-200/80 transition-all duration-300 hover:-translate-y-1 hover:border-brass-500 hover:text-brass-400"
                role="listitem"
              >
                <FacebookIcon className="size-4" aria-hidden="true" />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram (opens in new tab)"
                className="grid size-10 place-items-center rounded-full border border-cream-100/15 text-cream-200/80 transition-all duration-300 hover:-translate-y-1 hover:border-brass-500 hover:text-brass-400"
                role="listitem"
              >
                <InstagramIcon className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-4" aria-label="Footer navigation">
            <h2 className="font-display text-lg font-bold text-brass-400">
              {t.footer.links}
            </h2>
            <ul className="flex flex-col gap-2.5" role="list">
              {links.map((link) => (
                <li key={link.href} role="listitem">
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-cream-200/70 transition-colors hover:text-brass-300 focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa-950"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Branches */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold text-brass-400">
              {t.footer.branchesTitle}
            </h2>
            <ul className="flex flex-col gap-3" role="list">
              {t.branches.list.map((branch) => (
                <li
                  key={branch.name}
                  className="flex items-start gap-2 text-sm text-cream-200/70"
                  role="listitem"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brass-500" aria-hidden="true" />
                  <span>
                    <span className="block font-bold text-cream-100">
                      {branch.name}
                    </span>
                    {branch.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold text-brass-400">
              {t.footer.contact}
            </h2>
            <a
              href={`tel:${site.hotline}`}
              className="group flex items-center gap-3"
              aria-label={`Call hotline ${site.hotlineDisplay}`}
            >
              <span className="grid size-11 place-items-center rounded-full bg-brass-500/15 text-brass-400 ring-1 ring-brass-500/40 transition-transform duration-300 group-hover:scale-110">
                <Phone className="size-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col">
                <span className="text-xs text-cream-200/60">
                  {t.footer.hotline}
                </span>
                <span
                  dir="ltr"
                  className="font-display text-2xl font-bold tracking-wider text-cream-50"
                >
                  {site.hotlineDisplay}
                </span>
              </span>
            </a>
            <p className="flex items-center gap-2 text-sm text-cream-200/70">
              <Clock className="size-4 shrink-0 text-brass-500" aria-hidden="true" />
              {t.branches.hoursValue}
            </p>
          </div>
        </div>

        <Ornament className="my-10 text-cream-100/40" aria-hidden="true" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-cream-200/50 sm:flex-row">
          <p>
            © {year} {t.brand.name} — {t.footer.rights}
          </p>
          <p className="font-bold tracking-widest text-brass-500">
            {t.footer.since}
          </p>
        </div>
      </div>
    </footer>
  );
}
