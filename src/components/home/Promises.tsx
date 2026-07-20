"use client";

import { ChefHat, Drumstick, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const icons = [Drumstick, ChefHat, ShieldCheck, Users];

export default function Promises() {
  const { t } = useLanguage();

  return (
    <section className="bg-cream-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={t.promises.kicker}
          title={t.promises.title}
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {t.promises.items.map((promise, i) => {
            const Icon = icons[i % icons.length];
            return (
              <Reveal key={promise.title} delay={i * 0.08}>
                <article className="group flex h-full flex-col items-center gap-4 rounded-3xl border border-cocoa-900/10 bg-cream-100/60 p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-brass-500/60 hover:bg-cream-100 hover:shadow-[0_30px_55px_-30px_rgba(41,26,14,0.45)]">
                  <span className="grid size-16 place-items-center rounded-full bg-cocoa-800 text-brass-400 shadow-[0_15px_30px_-15px_rgba(41,26,14,0.6)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
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
  );
}
