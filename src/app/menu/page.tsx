import { prisma } from "@/lib/prisma";
import MenuClient from "@/components/menu/MenuClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المنيو — شاورما، فراخ، توبات",
  description:
    "منيو جيت بوئتك — شاورما فرايز، فراخ على الفحم، توبات، فتات ومقبلات. للطلب: الخط الساخن 17514.",
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        where: { available: true },
        orderBy: { id: "asc" },
      },
    },
  });

  const serialized = categories.map((cat) => ({
    id: String(cat.id),
    name: { ar: cat.nameAr, en: cat.nameEn },
    tagline: { ar: cat.nameAr, en: cat.nameEn },
    image: cat.image,
    items: cat.items.map((item) => ({
      id: String(item.id),
      name: { ar: item.nameAr, en: item.nameEn },
      desc: { ar: item.descAr, en: item.descEn },
      price: item.price ?? undefined,
      sizes: (item.sizes as { label: { ar: string; en: string }; price: number }[] | null) ?? undefined,
      badge: (item.badge as "popular" | "spicy" | "new" | null) ?? undefined,
      image: item.image,
    })),
  }));

  return <MenuClient categories={serialized} />;
}
