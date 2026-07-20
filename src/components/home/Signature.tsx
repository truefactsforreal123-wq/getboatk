"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const dishImages = [
  "/images/wrap.jpg",
  "/images/grill.jpg",
  "/images/fried.jpg",
  "/images/burger.jpg",
];

export default function Signature() {
  const { t, dir } = useLanguage();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <section className="relative bg-cream-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker={t.signature.kicker}
          title={t.signature.title}
          subtitle={t.signature.subtitle}
        />

        <div className="mt-14 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
          {t.signature.items.map((dish, i) => (
            <Reveal key={dish.name} delay={i * 0.08}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-b-3xl rounded-t-[6rem] border border-cocoa-900/10 bg-cream-50 shadow-[0_20px_45px_-25px_rgba(41,26,14,0.35)] transition-all duration-500 hover:-translate-y-2.5 hover:shadow-[0_35px_60px_-25px_rgba(41,26,14,0.5)]">
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={dishImages[i]}
                    alt={dish.name}
                    fill
                    sizes="(min-width: 1280px) 320px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-cocoa-950/35 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  {"badge" in dish && dish.badge ? (
                    <span className="absolute start-4 top-4 rounded-full bg-brass-500 px-3.5 py-1.5 text-xs font-extrabold text-cocoa-950 shadow-lg">
                      {dish.badge}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-2.5 p-6">
                  <h3 className="font-display text-xl font-bold leading-snug text-cocoa-900">
                    {dish.name}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-cocoa-500">
                    {dish.desc}
                  </p>
                  <p className="pt-2 font-display text-2xl font-bold text-brass-600">
                    <span dir="ltr">{dish.price}</span>{" "}
                    <span className="text-sm font-medium text-cocoa-400">
                      {t.signature.currency}
                    </span>
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex justify-center" delay={0.15}>
          <Link
            href="/menu"
            className="group inline-flex items-center gap-2.5 rounded-full border-2 border-cocoa-800/20 px-7 py-3 text-base font-extrabold text-cocoa-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-brass-500 hover:text-brass-700"
          >
            {t.signature.viewAll}
            <Arrow className="size-5 transition-transform duration-300 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
