import type { Metadata } from "next";
import BranchesClient from "@/components/branches/BranchesClient";

export const metadata: Metadata = {
  title: "الفروع — وسط البلد، مصر الجديدة، مدينة نصر",
  description:
    "فروع جيت بوئتك في القاهرة: وسط البلد ومصر الجديدة ومدينة نصر. يومياً من 10 صباحاً لـ 12 بالليل. خط ساخن 17514.",
};

export default function BranchesPage() {
  return <BranchesClient />;
}
