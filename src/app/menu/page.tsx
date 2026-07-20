import type { Metadata } from "next";
import MenuClient from "@/components/menu/MenuClient";

export const metadata: Metadata = {
  title: "المنيو — شاورما، مشويات، بروست",
  description:
    "منيو جيت بوئتك الدمشقي — شاورما عالفحم، مشويات، بروست، برجر ومقبلات. للطلب: الخط الساخن 17514.",
};

export default function MenuPage() {
  return <MenuClient />;
}
