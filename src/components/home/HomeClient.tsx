"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/ui/Marquee";
import Signature from "@/components/home/Signature";
import Heritage from "@/components/home/Heritage";
import Stats from "@/components/home/Stats";
import Promises from "@/components/home/Promises";
import CtaBanner from "@/components/home/CtaBanner";

export default function HomeClient() {
  const { t } = useLanguage();

  return (
    <>
      <Hero />
      <Marquee items={t.marquee} />
      <Signature />
      <Heritage />
      <Stats />
      <Promises />
      <CtaBanner />
    </>
  );
}
