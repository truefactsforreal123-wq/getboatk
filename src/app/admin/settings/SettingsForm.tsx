"use client";

import { useState } from "react";
import { updateSystemSetting, regenerateAllTableTokens } from "@/lib/actions";
import { useAdminT } from "@/lib/use-admin-t";
import { getAdminLang } from "@/lib/admin-strings";
import { RefreshCw } from "lucide-react";

export function SettingsForm({ settings }: { settings: Record<string, unknown> }) {
  const t = useAdminT();
  const lang = getAdminLang();
  const [liveTracking, setLiveTracking] = useState(settings.customer_live_tracking === true || settings.customer_live_tracking === "true");
  const [soundAlerts, setSoundAlerts] = useState(settings.staff_sound_alerts === true || settings.staff_sound_alerts === "true");
  const [regeneratingAll, setRegeneratingAll] = useState(false);

  async function save(key: string, value: unknown) {
    await updateSystemSetting(key, value);
  }

  async function handleRegenerateAll() {
    const msg = lang === "ar"
      ? "سيتم إلغاء صلاحية جميع رموز QR في جميع الفروع. يجب إعادة طباعة كل رمز. متأكد؟"
      : "This will invalidate ALL QR codes across ALL branches. You must re-print every QR. Continue?";
    if (!confirm(msg)) return;
    setRegeneratingAll(true);
    try {
      const count = await regenerateAllTableTokens();
      alert(lang === "ar"
        ? `تم! تم إعادة توليد ${count} رمز QR. اطبعها من صفحة الطاولات.`
        : `Done! ${count} QR codes regenerated. Print new ones from the tables page.`);
    } catch (err) {
      console.error("Failed to regenerate all tokens:", err);
      alert("Failed. Please try again.");
    } finally {
      setRegeneratingAll(false);
    }
  }

  return (
    <div className="mt-8 max-w-lg space-y-6">
      <div className="rounded-xl border border-brass-500/15 bg-cocoa-900 p-6">
        <label className="text-base font-black text-cream">{t.liveTracking}</label>
        <p className="mt-2 text-sm text-cream">
          {t.liveTrackingDesc}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => {
              const next = !liveTracking;
              setLiveTracking(next);
              save("customer_live_tracking", next);
            }}
            className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${
              liveTracking
                ? "bg-green-500/15 text-green-400"
                : "bg-cocoa-800/50 text-cocoa-300"
            }`}
          >
            {liveTracking ? t.on : t.off}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-brass-500/15 bg-cocoa-900 p-6">
        <label className="text-base font-black text-cream">{t.soundAlerts}</label>
        <p className="mt-2 text-sm text-cream">
          {t.soundAlertsDesc}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={() => {
              const next = !soundAlerts;
              setSoundAlerts(next);
              window.localStorage.setItem("staff_sound_alerts", String(next));
              window.dispatchEvent(new CustomEvent("staff-sound-alerts-changed", { detail: next }));
              save("staff_sound_alerts", next);
            }}
            className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-colors ${
              soundAlerts
                ? "bg-green-500/15 text-green-400"
                : "bg-cocoa-800/50 text-cocoa-300"
            }`}
          >
            {soundAlerts ? t.on : t.off}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
        <label className="text-base font-black text-cream">
          {lang === "ar" ? "إعادة توليد جميع رموز QR" : "Regenerate All QR Codes"}
        </label>
        <p className="mt-2 text-sm text-cream">
          {lang === "ar"
            ? "سيؤدي هذا إلى إلغاء صلاحية جميع رموز QR الحالية في جميع الفروع. يجب إعادة طباعة كل رمز QR جديد."
            : "This will invalidate all current QR codes across all branches. You'll need to re-print every QR code."}
        </p>
        <div className="mt-3">
          <button
            onClick={handleRegenerateAll}
            disabled={regeneratingAll}
            className="flex items-center gap-2 rounded-lg bg-red-500/15 px-5 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/25 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={16} className={regeneratingAll ? "animate-spin" : ""} />
            {regeneratingAll ? "..." : lang === "ar" ? "إعادة التوليد" : "Regenerate All"}
          </button>
        </div>
      </div>
    </div>
  );
}
