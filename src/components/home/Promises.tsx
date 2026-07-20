"use client";

import { motion } from "framer-motion";
import { ChefHat, Drumstick, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const icons = [Drumstick, ChefHat, ShieldCheck, Users];

export default function Promises() {
  const { t } = useLanguage();

  return (
    <section
      className="content-visibility-auto bg-cream-50 py-24 lg:py-32"
      aria-labelledby="promises-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={t.promises.kicker}
          title={t.promises.title}
          id="promises-heading"
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {t.promises.items.map((promise, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={promise.title} delay={i * 0.08}>
                <motion.article
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex h-full flex-col items-center gap-4 rounded-3xl border border-cocoa-900/10 bg-cream-100/60 p-8 text-center transition-shadow duration-500 hover:border-brass-500/60 hover:bg-cream-100 hover:shadow-[var(--shadow-elevation-high)]"
                >
                  <span className="grid size-16 place-items-center rounded-full bg-cocoa-800 text-brass-400 shadow-[var(--shadow-elevation-mid)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[var(--shadow-glow-brass)]">
                    <Icon className="size-7" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl font-bold text-cocoa-900 transition-colors duration-300 group-hover:text-brass-700">
                    {promise.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-cocoa-500">
                    {promise.desc}
                  </p>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
