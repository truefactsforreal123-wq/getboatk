"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { site, whatsappLink } from "@/lib/data";
import Reveal from "@/components/ui/Reveal";
import Pattern from "@/components/ui/Pattern";

export default function CtaBanner() {
  const { t } = useLanguage();

  return (
    <section
      className="content-visibility-auto bg-cream-50 pb-24 lg:pb-32"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-bl from-cocoa-800 via-cocoa-900 to-cocoa-950 px-6 py-16 text-center text-cream-50 shadow-[0_50px_100px_-40px_rgba(41,26,14,0.8)] md:px-12 lg:py-20">
            <Pattern className="pointer-events-none absolute inset-0 size-full text-cocoa-700 opacity-60" aria-hidden="true" />
            <span
              dir="ltr"
              className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-display text-[7rem] font-bold tracking-tight text-cream-50/[0.04] sm:text-[9rem] md:text-[15rem]"
              aria-hidden="true"
            >
              {site.hotlineDisplay}
            </span>

            <div className="relative flex flex-col items-center gap-7">
              <h2
                id="cta-heading"
                className="font-display text-5xl font-bold md:text-6xl"
              >
                {t.cta.title}
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-cream-200/80">
                {t.cta.subtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <motion.a
                  href={`tel:${site.hotline}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 rounded-full bg-brass-500 px-8 py-4 text-lg font-extrabold text-cocoa-950 shadow-[var(--shadow-glow-brass)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brass-400 focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa-900"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  {t.cta.call}
                </motion.a>
                <motion.a
                  href={whatsappLink(t.whatsapp.message)}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 rounded-full border-2 border-cream-100/25 px-8 py-4 text-lg font-extrabold text-cream-50 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass-400 hover:text-brass-300 focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cocoa-900"
                >
                  {t.cta.whatsapp}
                  <span className="sr-only">(opens in new tab)</span>
                </motion.a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
