import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

export default async function Home() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      items: {
        where: { available: true, badge: "popular" },
        orderBy: { id: "asc" },
        take: 4,
      },
    },
  });

  const popularItems = categories
    .flatMap((cat) => cat.items)
    .slice(0, 4)
    .map((item) => ({
      id: String(item.id),
      name: { ar: item.nameAr, en: item.nameEn },
      desc: { ar: item.descAr, en: item.descEn },
      price: item.price ?? undefined,
      badge: item.badge as "popular" | null,
      image: item.image,
    }));

  return <HomeClient signatureItems={popularItems} />;
}
