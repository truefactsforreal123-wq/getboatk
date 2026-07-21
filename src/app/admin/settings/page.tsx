import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";
import { Sidebar } from "../sidebar";
import { T } from "@/components/admin-translate";

export default async function AdminSettingsPage() {
  const settings = await prisma.systemSetting.findMany();
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <div className="flex-1 p-4 pt-16 lg:p-10 lg:pt-10">
        <div>
          <h1 className="text-2xl font-black text-cream"><T k="settingsTitle" /></h1>
          <p className="mt-1 text-sm text-cream"><T k="systemConfig" /></p>
        </div>
        <SettingsForm settings={map} />
      </div>
    </div>
  );
}
