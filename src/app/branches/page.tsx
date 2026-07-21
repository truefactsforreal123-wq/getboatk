import { prisma } from "@/lib/prisma";
import BranchesClient from "@/components/branches/BranchesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الفروع — وسط البلد، مصر الجديدة، مدينة نصر",
  description:
    "فروع جيت بوئتك في القاهرة: وسط البلد ومصر الجديدة ومدينة نصر. يومياً من 10 صباحاً لـ 12 بالليل. خط ساخن 17514.",
};

export const dynamic = "force-dynamic";

export default async function BranchesPage() {
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });

  const serialized = branches.map((b) => ({
    id: b.id,
    number: b.number,
    nameAr: b.nameAr,
    nameEn: b.nameEn,
    addressAr: b.addressAr,
    addressEn: b.addressEn,
    phone: b.phone,
    whatsapp: b.whatsapp,
    mapsUrl: b.mapsUrl,
  }));

  return <BranchesClient branches={serialized} />;
}
