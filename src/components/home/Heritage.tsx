"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Pattern from "@/components/ui/Pattern";
import SealBadge from "@/components/ui/SealBadge";

export default function Heritage() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-cocoa-950 py-24 text-cream-50 lg:py-32">
      <Pattern className="pointer-events-none absolute inset-0 size-full text-cocoa-700 opacity-50" />
      <div
        className="pointer-events-none absolute -bottom-40 -start-32 size-[520px] rounded-full bg-brass-600/15 blur-[160px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* Copy */}
        <div className="flex flex-col gap-8">
          <SectionHeading
            kicker={t.heritage.kicker}
            title={t.heritage.title}
            align="start"
            tone="dark"
          />
          <Reveal delay={0.1}>
            <p className="max-w-xl text-lg leading-relaxed text-cream-200/80">
              {t.heritage.body}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <blockquote className="relative border-s-2 border-brass-500 ps-6">
              <span
                className="absolute -top-5 start-2 font-display text-7xl text-brass-500/40"
                aria-hidden="true"
              >
                ”
              </span>
              <p className="font-display text-2xl font-bold text-brass-300 md:text-3xl">
                {t.heritage.quote}
              </p>
            </blockquote>
          </Reveal>

          {/* Journey */}
          <Reveal delay={0.26}>
            <h3 className="mb-5 text-sm font-extrabold uppercase tracking-[0.2em] text-brass-400">
              {t.heritage.journeyTitle}
            </h3>
            <ol className="relative flex flex-col gap-6 border-s border-cocoa-700 ps-6">
              {t.heritage.journey.map((stop) => (
                <li key={stop.place} className="relative">
                  <span
                    className="absolute -start-[31px] top-1 size-3 rounded-full border-2 border-brass-400 bg-cocoa-950"
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-display text-xl font-bold text-cream-50">
                      {stop.place}
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-brass-400">
                      {stop.year}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-cream-200/60">{stop.note}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/* Visual */}
        <Reveal delay={0.15} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            className="absolute inset-0 -translate-x-5 translate-y-5 rounded-b-[2.5rem] rounded-t-[14rem] border-2 border-brass-500/40"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2.5rem] rounded-t-[14rem] shadow-[0_45px_90px_-30px_rgba(0,0,0,0.7)] ring-1 ring-cream-100/10">
            <Image
              src="/images/grill.jpg"
              alt={t.heritage.kicker}
              fill
              sizes="(min-width: 1024px) 512px, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-cocoa-950/45 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
          <SealBadge
            text={`${t.brand.kings} ✦ ${t.brand.tagline} ✦ `}
            className="absolute -bottom-8 -start-3 size-28 text-brass-400 md:-start-8 md:size-36"
          />
        </Reveal>
      </div>
    </section>
  );
}
