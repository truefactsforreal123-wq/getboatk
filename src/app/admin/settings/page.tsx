import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";
import { Sidebar } from "../sidebar";
import { T } from "@/components/admin-translate";

export default async function AdminSettingsPage() {
  const settings = await prisma.systemSetting.findMany();
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;

  return (
    <div className="flex min-h-screen bg-cocoa-950">
      <Sidebar />
      <div className="flex-1 p-4 pt-16 lg:p-10 lg:pt-10">
        <div className="rounded-2xl border border-brass-500/10 bg-gradient-to-bl from-cocoa-900 via-cocoa-900/80 to-cocoa-950 p-6 lg:p-8">
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-cream"><T k="settingsTitle" /></h1>
          <p className="mt-2 text-sm text-cocoa-300"><T k="systemConfig" /></p>
        </div>
        <SettingsForm settings={map} />
      </div>
    </div>
  );
}
