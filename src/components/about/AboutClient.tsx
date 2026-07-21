"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChefHat, Drumstick, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { site } from "@/lib/data";
import Pattern from "@/components/ui/Pattern";
import Ornament from "@/components/ui/Ornament";
import SealBadge from "@/components/ui/SealBadge";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import { FacebookIcon } from "@/components/ui/BrandIcons";

const valueIcons = [Drumstick, ChefHat, ShieldCheck, Users];

export default function AboutClient() {
  const { t } = useLanguage();

  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-cream-50 pb-16 pt-36 lg:pb-20 lg:pt-44">
        <Pattern className="pointer-events-none absolute inset-0 size-full text-cocoa-300 opacity-35" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-brass-500/50 bg-brass-200/40 px-4 py-1.5 text-sm font-bold text-brass-700"
          >
            {t.about.kicker}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-[1.3] text-cocoa-900 sm:text-5xl md:text-6xl"
          >
            {t.about.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-lg leading-relaxed text-cocoa-500"
          >
            {t.about.lead}
          </motion.p>
          <Ornament className="mt-2 w-56 text-brass-600" />
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream-50 pb-24 lg:pb-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
          <Reveal className="relative order-2 mx-auto w-full max-w-md lg:order-1 lg:max-w-none">
            <div
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-brass-500/50"
              aria-hidden="true"
            />
            <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] shadow-[0_45px_80px_-30px_rgba(41,26,14,0.5)] ring-1 ring-cocoa-900/10">
              <Image
                src="/images/interior.jpg"
                alt={t.brand.name}
                fill
                sizes="(min-width: 1024px) 512px, 100vw"
                className="object-cover animate-[kenburns-3_24s_ease-in-out_infinite_alternate]"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-cocoa-950/30 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
            <SealBadge
              text={`${t.brand.kings} ✦ ${t.brand.tagline} ✦ `}
              className="absolute -bottom-7 -end-3 size-28 text-brass-600 md:-end-8 md:size-36"
            />
          </Reveal>

          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <SectionHeading
              kicker={t.heritage.kicker}
              title={t.about.storyTitle}
              align="start"
            />
            {t.about.story.map((paragraph, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}>
                <p className="text-base leading-loose text-cocoa-600 md:text-lg">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-cocoa-900/10 bg-cream-100 py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            kicker={t.promises.kicker}
            title={t.about.valuesTitle}
          />
          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {t.promises.items.map((promise, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <Reveal key={promise.title} delay={i * 0.08}>
                  <article className="group flex h-full flex-col items-center gap-4 rounded-3xl border border-cocoa-900/10 bg-cream-50 p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-brass-500/60 hover:shadow-[0_30px_55px_-30px_rgba(41,26,14,0.45)]">
                    <span className="grid size-16 place-items-center rounded-full bg-cocoa-800 text-brass-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="size-7" />
                    </span>
                    <h3 className="font-display text-xl font-bold text-cocoa-900">
                      {promise.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-cocoa-500">
                      {promise.desc}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="bg-cream-50 py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-start gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col gap-8">
            <SectionHeading
              kicker={t.heritage.journeyTitle}
              title={t.heritage.title}
              align="start"
            />
            <Reveal delay={0.1}>
              <p className="max-w-xl text-lg leading-relaxed text-cocoa-500">
                {t.heritage.body}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <ol className="relative flex flex-col gap-8 border-s-2 border-cocoa-200 ps-8">
              {t.heritage.journey.map((stop) => (
                <li key={stop.place} className="relative">
                  <span
                    className="absolute -start-[41px] top-1.5 grid size-4 place-items-center rounded-full border-2 border-brass-500 bg-cream-50"
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-display text-2xl font-bold text-cocoa-900">
                      {stop.place}
                    </span>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-brass-600">
                      {stop.year}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-cocoa-500">{stop.note}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* Community band */}
      <section className="bg-cream-50 pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-cocoa-950 px-6 py-14 text-center text-cream-50 md:px-12">
              <Pattern className="pointer-events-none absolute inset-0 size-full text-cocoa-700 opacity-60" />
              <div className="relative flex flex-col items-center gap-6">
                <span className="text-sm font-extrabold uppercase tracking-[0.25em] text-brass-400">
                  {t.about.communityKicker}
                </span>
                <Counter
                  value={593}
                  suffix="K+"
                  className="font-display text-6xl font-bold text-cream-50 md:text-7xl"
                />
                <h2 className="max-w-xl font-display text-2xl font-bold text-cream-50 md:text-3xl">
                  {t.about.communityTitle}
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-cream-200/70">
                  {t.about.communityBody}
                </p>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2.5 rounded-full bg-[#1877f2] px-7 py-3.5 text-base font-extrabold text-white shadow-[0_18px_35px_-15px_rgba(24,119,242,0.8)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <FacebookIcon className="size-5" />
                  {t.about.communityCta}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
