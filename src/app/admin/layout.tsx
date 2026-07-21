import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { UnseenOrdersProvider } from "./UnseenOrdersProvider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) redirect("/login");

  const [soundSetting, tables] = await Promise.all([
    prisma.systemSetting.findUnique({ where: { key: "staff_sound_alerts" }, select: { value: true } }),
    prisma.restaurantTable.findMany({
      select: { id: true, branch: { select: { nameEn: true } } },
    }),
  ]);
  const soundEnabled = soundSetting?.value === true || soundSetting?.value === "true";

  return (
    <UnseenOrdersProvider
      initialSoundEnabled={soundEnabled}
      tableBranches={tables.map((table) => ({ tableId: table.id, branchName: table.branch.nameEn }))}
    >
      {children}
    </UnseenOrdersProvider>
  );
}
