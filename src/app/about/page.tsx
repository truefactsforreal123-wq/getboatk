import type { Metadata } from "next";
import AboutClient from "@/components/about/AboutClient";

export const metadata: Metadata = {
  title: "قصتنا — أربعين سنة من الطعم الدمشقي",
  description:
    "حكاية جيت بوئتك من دمشق 1982 إلى القاهرة — ملوك الشاورما من سوريا والأردن إلى مصر والسعودية.",
};

export default function AboutPage() {
  return <AboutClient />;
}
