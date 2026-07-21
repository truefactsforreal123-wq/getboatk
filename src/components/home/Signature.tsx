"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { useState, useEffect, useCallback } from "react";

type LocalizedText = { ar: string; en: string };

type SignatureItem = {
  id: string;
  name: LocalizedText;
  desc: LocalizedText;
  price?: number;
  badge?: "popular" | null;
  image: string;
};

export default function Signature({ items }: { items: SignatureItem[] }) {
  const { t, lang, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = items.length;
  const visibleCount = 4;

  const next = useCallback(() => {
    setActive((p) => (p + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setActive((p) => (p - 1 + count) % count);
  }, [count]);

  // Auto-advance
  useEffect(() => {
    if (paused || count <= visibleCount) return;
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [paused, next, count]);

  // Get visible items (wrapping around)
  const visibleItems: { item: SignatureItem; offset: number }[] = [];
  for (let i = 0; i < Math.min(visibleCount, count); i++) {
    visibleItems.push({ item: items[(active + i) % count], offset: i });
  }

  return (
    <section
      className="relative bg-cream-50 py-24 lg:py-32 overflow-hidden"
      aria-labelledby="signature-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={t.signature.kicker}
          title={t.signature.title}
          subtitle={t.signature.subtitle}
          id="signature-heading"
        />

        {items.length > 0 ? (
          <>
            {/* Carousel container */}
            <div className="relative mt-14">
              {/* Navigation arrows */}
              {count > visibleCount && (
                <>
                  <button
                    onClick={prev}
                    className="absolute -start-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cocoa-900/10 bg-cream-50/90 shadow-lg backdrop-blur-sm transition-all hover:border-brass-500 hover:bg-brass-500/10 lg:-start-6"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="size-5 text-cocoa-700" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute -end-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cocoa-900/10 bg-cream-50/90 shadow-lg backdrop-blur-sm transition-all hover:border-brass-500 hover:bg-brass-500/10 lg:-end-6"
                    aria-label="Next"
                  >
                    <ChevronRight className="size-5 text-cocoa-700" />
                  </button>
                </>
              )}

              {/* Cards grid */}
              <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
                {visibleItems.map(({ item: dish, offset }) => (
                  <motion.article
                    key={`${dish.id}-${offset}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: offset * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-b-3xl rounded-t-[6rem] border border-cocoa-900/10 bg-cream-50 shadow-[var(--shadow-elevation-low)] transition-shadow duration-500 hover:shadow-[var(--shadow-elevation-high)]"
                  >
                    {/* Image container */}
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <Image
                        src={dish.image}
                        alt={dish.name[lang]}
                        fill
                        sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 animate-[kenburns-1_20s_ease-in-out_infinite_alternate]"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-cocoa-950/40 via-transparent to-transparent transition-opacity duration-500 group-hover:from-cocoa-950/50"
                        aria-hidden="true"
                      />
                      {dish.badge ? (
                        <span className="absolute start-4 top-4 rounded-full bg-brass-500 px-3.5 py-1.5 text-xs font-extrabold text-cocoa-950 shadow-lg">
                          {t.menu.badges[dish.badge]}
                        </span>
                      ) : null}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col gap-2.5 p-6">
                      <h3 className="font-display text-xl font-bold leading-snug text-cocoa-900 transition-colors duration-300 group-hover:text-brass-700">
                        {dish.name[lang]}
                      </h3>
                      <p className="flex-1 text-sm leading-relaxed text-cocoa-500">
                        {dish.desc[lang]}
                      </p>
                      <div className="flex items-end justify-between pt-2">
                        <p className="font-display text-2xl font-bold text-brass-600">
                          <span dir="ltr">{dish.price}</span>{" "}
                          <span className="text-sm font-medium text-cocoa-400">
                            {t.signature.currency}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="absolute bottom-0 start-0 h-1 w-0 bg-gradient-to-r from-brass-600 to-brass-400 transition-all duration-500 group-hover:w-full" />
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Dot indicators */}
            {count > visibleCount && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === active
                        ? "w-8 bg-brass-500"
                        : "w-2 bg-cocoa-300/40 hover:bg-cocoa-300/60"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="mt-14 text-center text-cocoa-400">
            {lang === "ar" ? "الأطباق المميزة ستظهر قريباً" : "Signature dishes coming soon"}
          </div>
        )}

        <Reveal className="mt-12 flex justify-center" delay={0.15}>
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2.5 rounded-full border-2 border-cocoa-800/20 px-7 py-3 text-base font-extrabold text-cocoa-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass-500 hover:text-brass-700"
          >
            {t.signature.viewAll}
            <Arrow className="size-5 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
