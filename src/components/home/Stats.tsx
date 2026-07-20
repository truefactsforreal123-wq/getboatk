"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import Khatam from "@/components/ui/Khatam";

export default function Stats() {
  const { t } = useLanguage();

  return (
    <section
      className="content-visibility-auto border-y border-cocoa-900/10 bg-cream-100 py-16 lg:py-20"
      aria-labelledby="stats-heading"
    >
      <h2 id="stats-heading" className="sr-only">
        Statistics
      </h2>
      <div
        className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-12 px-4 sm:px-6 lg:grid-cols-4 lg:px-8"
        role="list"
      >
        {t.stats.items.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="flex flex-col items-center gap-3 text-center" role="listitem">
              <Khatam className="size-5 text-brass-500" aria-hidden="true" />
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="font-display text-4xl font-bold text-cocoa-900 sm:text-5xl lg:text-6xl"
              />
              <p className="text-sm font-bold text-cocoa-500">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
