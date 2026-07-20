"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Flame, Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { site } from "@/lib/data";
import Pattern from "@/components/ui/Pattern";
import SealBadge from "@/components/ui/SealBadge";
import Khatam from "@/components/ui/Khatam";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Hero() {
  const { t, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const trust = [
    { value: "43+", label: t.hero.trustYears },
    { value: "10+", label: t.hero.trustBranches },
    { value: "593K+", label: t.hero.trustCommunity },
  ];

  return (
    <section className="relative overflow-hidden bg-cream-50">
      <Pattern className="pointer-events-none absolute inset-0 size-full text-cocoa-300 opacity-[0.35]" />
      <div
        className="pointer-events-none absolute -top-32 start-1/4 size-[480px] rounded-full bg-brass-300/30 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8 lg:pb-28 lg:pt-40">
        {/* Copy */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-start gap-7"
        >
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2.5 rounded-full border border-brass-500/50 bg-brass-200/40 px-4 py-1.5 text-sm font-bold text-brass-700"
          >
            <Khatam className="size-3.5" />
            {t.hero.kicker}
          </motion.span>

          <motion.h1
            variants={item}
            className="font-display text-4xl font-bold leading-[1.35] text-cocoa-900 sm:text-6xl xl:text-7xl"
          >
            {t.hero.titleA}{" "}
            <span className="bg-gradient-to-l from-brass-600 via-brass-500 to-brass-400 bg-clip-text text-transparent">
              {t.hero.titleB}
            </span>{" "}
            {t.hero.titleC}
          </motion.h1>

          <motion.p
            variants={item}
            className="max-w-xl text-lg leading-relaxed text-cocoa-500"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4">
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2.5 rounded-full bg-cocoa-800 px-7 py-3.5 text-base font-extrabold text-cream-50 shadow-[0_18px_35px_-15px_rgba(41,26,14,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cocoa-700"
            >
              {t.hero.ctaMenu}
              <Arrow className="size-5 text-brass-400 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${site.hotline}`}
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-cocoa-800/20 bg-cream-50/60 px-7 py-3 text-base font-extrabold text-cocoa-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass-500 hover:text-brass-700"
            >
              <Phone className="size-5" />
              <span dir="ltr">{site.hotlineDisplay}</span>
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            {trust.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <span
                  dir="ltr"
                  className="font-display text-2xl font-bold text-brass-600"
                >
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-cocoa-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-lg"
        >
          {/* Arch echo */}
          <div
            className="absolute inset-0 translate-x-5 translate-y-5 rounded-b-[2.5rem] rounded-t-[14rem] border-2 border-brass-500/50"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2.5rem] rounded-t-[14rem] shadow-[0_45px_80px_-30px_rgba(41,26,14,0.5)] ring-1 ring-cocoa-900/10">
            <Image
              src="/images/wrap.jpg"
              alt={t.hero.floatCard}
              fill
              priority
              sizes="(min-width: 1024px) 512px, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-cocoa-950/25 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Rotating seal */}
          <SealBadge
            text={`${t.brand.kings} ✦ ${t.brand.tagline} ✦ `}
            className="absolute -top-8 -start-4 size-28 text-brass-600 md:-start-10 md:size-36"
          />

          {/* Floating card */}
          <div className="absolute -bottom-7 -end-3 animate-float md:-end-8">
            <div className="flex items-center gap-3 rounded-2xl border border-cocoa-900/10 bg-cream-50/95 px-5 py-4 shadow-[0_25px_50px_-20px_rgba(41,26,14,0.45)] backdrop-blur">
              <span className="grid size-11 place-items-center rounded-full bg-cocoa-800 text-brass-400">
                <Flame className="size-5" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-extrabold text-cocoa-900">
                  {t.hero.floatCard}
                </span>
                <span className="text-xs font-medium text-cocoa-500">
                  {t.hero.floatCardSub}
                </span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
