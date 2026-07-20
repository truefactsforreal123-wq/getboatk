"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { branches, site, whatsappLink } from "@/lib/data";
import Pattern from "@/components/ui/Pattern";
import Ornament from "@/components/ui/Ornament";
import Reveal from "@/components/ui/Reveal";
import Khatam from "@/components/ui/Khatam";

export default function BranchesClient() {
  const { t } = useLanguage();

  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-cream-50 pb-14 pt-36 lg:pb-16 lg:pt-44">
        <Pattern className="pointer-events-none absolute inset-0 size-full text-cocoa-300 opacity-35" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-brass-500/50 bg-brass-200/40 px-4 py-1.5 text-sm font-bold text-brass-700"
          >
            <Khatam className="size-3.5" />
            {t.branches.kicker}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-[1.3] text-cocoa-900 sm:text-5xl md:text-6xl"
          >
            {t.branches.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-lg leading-relaxed text-cocoa-500"
          >
            {t.branches.subtitle}
          </motion.p>
          <Ornament className="mt-2 w-56 text-brass-600" />
        </div>
      </section>

      {/* Hotline hero card */}
      <section className="bg-cream-50 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-bl from-cocoa-800 via-cocoa-900 to-cocoa-950 px-6 py-14 text-center text-cream-50 shadow-[0_50px_100px_-40px_rgba(41,26,14,0.8)] md:px-12">
              <Pattern className="pointer-events-none absolute inset-0 size-full text-cocoa-700 opacity-60" />
              <div className="relative flex flex-col items-center gap-6">
                <span className="text-sm font-extrabold uppercase tracking-[0.25em] text-brass-400">
                  {t.branches.hotlineTitle}
                </span>
                <a
                  href={`tel:${site.hotline}`}
                  dir="ltr"
                  className="font-display text-6xl font-bold tracking-wider text-cream-50 transition-colors duration-300 hover:text-brass-300 sm:text-7xl md:text-8xl"
                >
                  {site.hotlineDisplay}
                </a>
                <p className="text-base text-cream-200/70">
                  {t.branches.hotlineSub}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`tel:${site.hotline}`}
                    className="inline-flex items-center gap-2.5 rounded-full bg-brass-500 px-7 py-3.5 text-base font-extrabold text-cocoa-950 shadow-[0_18px_35px_-15px_rgba(200,155,60,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brass-400"
                  >
                    <Phone className="size-5" />
                    {t.branches.call}
                  </a>
                  <a
                    href={whatsappLink(t.whatsapp.message)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-full border-2 border-cream-100/25 px-7 py-3.5 text-base font-extrabold text-cream-50 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass-400 hover:text-brass-300"
                  >
                    {t.branches.whatsapp}
                  </a>
                </div>
                <p className="flex items-center gap-2 pt-2 text-sm text-cream-200/70">
                  <Clock className="size-4 shrink-0 text-brass-400" />
                  {t.branches.hoursValue}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Branch cards */}
      <section className="bg-cream-50 pb-20">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {t.branches.list.map((branch, i) => (
            <Reveal key={branch.name} delay={i * 0.1} className="h-full">
              <article className="group flex h-full flex-col gap-5 rounded-3xl border border-cocoa-900/10 bg-cream-100/60 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-brass-500/60 hover:bg-cream-100 hover:shadow-[0_30px_55px_-30px_rgba(41,26,14,0.45)]">
                <div className="flex items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-cocoa-800 text-brass-400 transition-transform duration-500 group-hover:scale-110">
                    <MapPin className="size-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-cocoa-900">
                      {branch.name}
                    </h2>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-brass-600">
                      {branch.area}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-cocoa-400">
                    {t.branches.address}
                  </span>
                  <p className="text-base font-bold text-cocoa-800">
                    {branch.address}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-cocoa-400">
                    {t.branches.phone}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {branch.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone}`}
                        dir="ltr"
                        className="rounded-full border border-cocoa-900/15 bg-cream-50 px-3.5 py-1.5 text-sm font-bold text-cocoa-700 transition-colors duration-300 hover:border-brass-500 hover:text-brass-700"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2.5 pt-3">
                  <a
                    href={`tel:${branch.phones[0]}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-cocoa-800 px-4 py-2.5 text-sm font-extrabold text-cream-50 transition-colors duration-300 hover:bg-cocoa-700"
                  >
                    <Phone className="size-4 text-brass-400" />
                    {t.branches.call}
                  </a>
                  <a
                    href={whatsappLink(t.whatsapp.message)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-cocoa-800/15 px-4 py-2.5 text-sm font-extrabold text-cocoa-800 transition-colors duration-300 hover:border-brass-500 hover:text-brass-700"
                  >
                    {t.branches.whatsapp}
                  </a>
                  <a
                    href={branches[i]?.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-cocoa-800/15 px-4 py-2.5 text-sm font-extrabold text-cocoa-800 transition-colors duration-300 hover:border-brass-500 hover:text-brass-700"
                  >
                    <Navigation className="size-4" />
                    {t.branches.directions}
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Delivery + catering */}
      <section className="bg-cream-50 pb-24 lg:pb-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-cocoa-900/10 bg-cream-100 px-8 py-12 text-center">
              <span className="text-sm font-extrabold uppercase tracking-[0.25em] text-brass-600">
                {t.branches.deliveryTitle}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {t.branches.delivery.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-2 rounded-full bg-cocoa-800 px-5 py-2.5 text-sm font-extrabold text-cream-50"
                  >
                    <MapPin className="size-4 text-brass-400" />
                    {area}
                  </span>
                ))}
              </div>
              <Ornament className="w-48 text-cocoa-400" />
              <p className="max-w-lg text-base font-bold leading-relaxed text-cocoa-700">
                {t.branches.catering}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
