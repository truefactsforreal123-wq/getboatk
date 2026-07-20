"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { menu, site } from "@/lib/data";
import Pattern from "@/components/ui/Pattern";
import Ornament from "@/components/ui/Ornament";
import Reveal from "@/components/ui/Reveal";
import Khatam from "@/components/ui/Khatam";

export default function MenuClient() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(menu[0].id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Scroll-spy: highlight the category currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    for (const category of menu) {
      const el = sectionRefs.current[category.id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    setActive(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const badgeLabel = (badge: "popular" | "spicy" | "new") =>
    t.menu.badges[badge];

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
            {t.menu.kicker}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-[1.3] text-cocoa-900 sm:text-5xl md:text-6xl"
          >
            {t.menu.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl text-lg leading-relaxed text-cocoa-500"
          >
            {t.menu.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Sticky category nav */}
      <div className="sticky top-18 z-40 border-y border-cocoa-900/10 bg-cream-50/90 backdrop-blur-xl">
        <div
          className="mx-auto flex max-w-7xl gap-2.5 overflow-x-auto px-4 py-3.5 sm:px-6 lg:justify-center lg:px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {menu.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => jumpTo(category.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold transition-all duration-300 ${
                active === category.id
                  ? "bg-cocoa-800 text-cream-50 shadow-[0_12px_25px_-12px_rgba(41,26,14,0.7)]"
                  : "bg-cream-100 text-cocoa-600 hover:bg-cream-200 hover:text-cocoa-900"
              }`}
            >
              {category.name[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="bg-cream-50 py-16 lg:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 sm:px-6 lg:px-8">
          {menu.map((category) => (
            <section
              key={category.id}
              id={category.id}
              ref={(el) => {
                sectionRefs.current[category.id] = el;
              }}
              className="scroll-mt-40"
            >
              <Reveal className="mb-10 flex flex-col items-center gap-3 text-center">
                <h2 className="font-display text-4xl font-bold text-cocoa-900">
                  {category.name[lang]}
                </h2>
                <p className="text-sm font-medium text-brass-600">
                  {category.tagline[lang]}
                </p>
                <Ornament className="mt-1 w-44 text-cocoa-400" />
              </Reveal>

              <div className="grid gap-x-14 gap-y-9 lg:grid-cols-2">
                {category.items.map((item, i) => (
                  <Reveal key={item.id} delay={Math.min(i * 0.05, 0.25)}>
                    <article className="group">
                      <div className="flex items-baseline gap-3">
                        <h3 className="font-display text-xl font-bold text-cocoa-900 transition-colors duration-300 group-hover:text-brass-700">
                          {item.name[lang]}
                        </h3>
                        {item.badge ? (
                          <span
                            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${
                              item.badge === "spicy"
                                ? "bg-red-900/10 text-red-800"
                                : item.badge === "new"
                                  ? "bg-emerald-900/10 text-emerald-800"
                                  : "bg-brass-500/15 text-brass-700"
                            }`}
                          >
                            {badgeLabel(item.badge)}
                          </span>
                        ) : null}
                        {item.price != null && (
                          <>
                            <span
                              className="flex-1 -translate-y-1 border-b-2 border-dotted border-cocoa-300/80"
                              aria-hidden="true"
                            />
                            <span className="shrink-0 font-display text-xl font-bold text-brass-600">
                              <span dir="ltr">{item.price}</span>{" "}
                              <span className="text-xs font-medium text-cocoa-400">
                                {t.menu.currency}
                              </span>
                            </span>
                          </>
                        )}
                      </div>

                      {item.desc ? (
                        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-cocoa-500">
                          {item.desc[lang]}
                        </p>
                      ) : null}

                      {item.sizes ? (
                        <div className="mt-3 flex flex-col gap-2">
                          {item.sizes.map((size) => (
                            <div
                              key={size.label.en}
                              className="flex items-baseline gap-3 text-sm"
                            >
                              <span className="font-bold text-cocoa-700">
                                {size.label[lang]}
                              </span>
                              <span
                                className="flex-1 -translate-y-1 border-b border-dotted border-cocoa-300/70"
                                aria-hidden="true"
                              />
                              <span className="font-display text-base font-bold text-brass-600">
                                <span dir="ltr">{size.price}</span>{" "}
                                <span className="text-[11px] font-medium text-cocoa-400">
                                  {t.menu.currency}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* Menu note + CTA */}
      <section className="bg-cream-50 pb-24 lg:pb-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-cocoa-900/10 bg-cream-100 px-8 py-12 text-center">
              <Khatam className="size-6 text-brass-500" />
              <p className="max-w-xl text-base font-bold leading-relaxed text-cocoa-700">
                {t.menu.note}
              </p>
              <a
                href={`tel:${site.hotline}`}
                className="inline-flex items-center gap-3 rounded-full bg-cocoa-800 px-8 py-4 text-lg font-extrabold text-cream-50 shadow-[0_18px_35px_-15px_rgba(41,26,14,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cocoa-700"
              >
                <Phone className="size-5 text-brass-400" />
                <span dir="ltr">{site.hotlineDisplay}</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
