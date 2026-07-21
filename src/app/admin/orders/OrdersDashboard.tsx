"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { markOrderServed, markOrderPreparing, markOrderReady, deleteOrder } from "@/lib/actions";
import { Clock, CheckCircle2, History, Bell, ChefHat, PackageCheck, CalendarDays, BarChart3 } from "lucide-react";
import { useAdminT } from "@/lib/use-admin-t";
import { getAdminLang } from "@/lib/admin-strings";
import { useUnseenOrders } from "../UnseenOrdersProvider";

interface OrderWithRelations {
  id: string;
  tableId: string;
  status: string;
  submittedAt: string | null;
  servedAt: string | null;
  items: {
    id: string;
    quantity: number;
    selectedSize: { label: { ar: string; en: string }; price: number } | null;
    notes: string | null;
    presets: string[] | null;
    priceAtOrder: string;
    menuItem: {
      nameAr: string;
      nameEn: string;
    };
  }[];
  table: {
    tableNumber: number;
    branch: {
      nameAr: string;
      nameEn: string;
    };
  };
}

interface DaySummary {
  totalOrders: number;
  totalRevenue: number;
  itemsSold: number;
  topItems: { nameEn: string; nameAr: string; quantity: number; revenue: number }[];
  branchStats: { nameEn: string; nameAr: string; count: number; revenue: number }[];
}

export function OrdersDashboard({
  initialActive: activeOrders,
  initialServed: servedOrders,
  historyTTL,
  allBranches,
}: {
  initialActive: OrderWithRelations[];
  initialServed: OrderWithRelations[];
  historyTTL: number;
  allBranches: { id: number; nameEn: string; nameAr: string }[];
}) {
  const router = useRouter();
  const t = useAdminT();
  const lang = getAdminLang();
  const {
    branchFilter,
    setBranchFilter,
    reset: resetUnseenOrders,
  } = useUnseenOrders();

  // Clear unseen badge when visiting orders page
  useEffect(() => {
    resetUnseenOrders();
  }, [resetUnseenOrders]);

  function itemName(item: { menuItem: { nameEn: string; nameAr: string } }) {
    return lang === "ar" ? item.menuItem.nameAr : item.menuItem.nameEn;
  }

  function branchName(branch: { nameEn: string; nameAr: string }) {
    return lang === "ar" ? branch.nameAr : branch.nameEn;
  }

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    submitted: { label: t.new, color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
    preparing: { label: t.preparing, color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
    ready: { label: t.ready, color: "bg-green-500/15 text-green-400 border-green-500/20" },
    served: { label: t.served, color: "bg-green-500/10 text-green-400/60" },
  };

  const [tab, setTab] = useState<"active" | "history" | "summary">("active");
  const [acting, setActing] = useState<string | null>(null);
  // Summary date picker state
  const todayStr = new Date().toISOString().slice(0, 10);
  const [summaryDate, setSummaryDate] = useState(todayStr);
  const [summaryData, setSummaryData] = useState<DaySummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const branches = useMemo(() => {
    return allBranches.map((b) => [b.nameEn, { nameEn: b.nameEn, nameAr: b.nameAr }] as const).sort(([, a], [, b]) => lang === "ar" ? a.nameAr.localeCompare(b.nameAr) : a.nameEn.localeCompare(b.nameEn));
  }, [allBranches, lang]);

  const filteredActive = branchFilter === "all"
    ? activeOrders
    : activeOrders.filter((o) => o.table.branch.nameEn === branchFilter);
  const filteredServed = branchFilter === "all"
    ? servedOrders
    : servedOrders.filter((o) => o.table.branch.nameEn === branchFilter);

  const getTimeAgo = useCallback((dateStr: string | null) => {
    if (!dateStr) return "";
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return lang === "ar" ? "الآن" : "Just now";
    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ${diff % 60}m`;
    return `${Math.floor(hours / 24)}d`;
  }, [lang]);

  const getTimeColor = useCallback((dateStr: string | null) => {
    if (!dateStr) return "text-cream/45";
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 5) return "text-green-400";
    if (diff < 15) return "text-yellow-400";
    return "text-red-400";
  }, []);

  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      router.refresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("live-orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Order" },
        () => {
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Order" },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [router]);

  // Fetch summary when date changes or summary tab opens
  useEffect(() => {
    if (tab !== "summary") return;
    let cancelled = false;
    fetch(`/api/orders/summary?date=${summaryDate}`, { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setSummaryData(data);
          setSummaryLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setSummaryLoading(false);
      });
    return () => { cancelled = true; };
  }, [tab, summaryDate]);

  async function handleAction(orderId: string, action: () => Promise<void>) {
    setActing(orderId);
    try {
      await action();
      router.refresh();
    } catch (err) {
      console.error("Order action failed:", err);
      alert("Failed. Please try again.");
    } finally {
      setActing(null);
    }
  }

  async function handleDelete(orderId: string) {
    if (!confirm(lang === "ar" ? "هل أنت متأكد من حذف هذا الطلب؟" : "Are you sure you want to delete this order?")) return;
    setActing(orderId);
    try {
      await deleteOrder(orderId);
      router.refresh();
    } catch (err) {
      console.error("Order delete failed:", err);
      alert("Failed. Please try again.");
    } finally {
      setActing(null);
    }
  }

  const groupedActive = useMemo(() =>
    filteredActive.reduce(
      (acc, order) => {
        const branch = lang === "ar" ? order.table.branch.nameAr : order.table.branch.nameEn;
        const key = `Table ${order.table.tableNumber} — ${branch}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(order);
        return acc;
      },
      {} as Record<string, OrderWithRelations[]>
    ),
    [filteredActive, lang]
  );

  const summaryLabel = lang === "ar" ? "ملخص" : "Summary";

  return (
    <div>
      {/* Tabs + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("active")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-base font-bold transition-colors ${
              tab === "active"
                ? "bg-brand-500/15 text-gold-300"
                : "text-cream/35 hover:text-cream"
            }`}
          >
            <Bell size={18} />
            {t.activeOrders} ({filteredActive.length})
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-base font-bold transition-colors ${
              tab === "history"
                ? "bg-brand-500/15 text-gold-300"
                : "text-cream/35 hover:text-cream"
            }`}
          >
            <History size={18} />
            {t.history} ({filteredServed.length})
          </button>
          <button
            onClick={() => { setTab("summary"); setSummaryLoading(true); }}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-base font-bold transition-colors ${
              tab === "summary"
                ? "bg-brand-500/15 text-gold-300"
                : "text-cream/35 hover:text-cream"
            }`}
          >
            <BarChart3 size={18} />
            {summaryLabel}
          </button>
        </div>

        {tab !== "summary" && (
          <div className="flex items-center gap-2">
            {branches.length > 0 && (
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="rounded-lg border border-white/10 bg-ink-900 px-3 py-2.5 text-sm font-bold text-cream"
              >
                <option value="all">{t.allBranches}</option>
                {branches.map(([id, b]) => (
                  <option key={id} value={String(id)}>{branchName(b)}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {/* Active Orders Tab */}
      {tab === "active" && (
        <div className="mt-6">
          {Object.keys(groupedActive).length === 0 && (
            <div className="rounded-xl border border-dashed border-white/10 p-12 text-center">
              <p className="text-cream/35 text-base font-bold">{t.noActiveOrders}</p>
              <p className="mt-1 text-sm text-cream/25">{t.newOrdersAppear}</p>
            </div>
          )}

          {Object.entries(groupedActive).map(([groupKey, orders]) => (
            <div key={groupKey} className="mb-6">
              <h3 className="text-sm font-black text-cream/45 uppercase tracking-wider mb-3">
                {groupKey}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {orders
                  .sort(
                    (a, b) =>
                      new Date(a.submittedAt ?? 0).getTime() -
                      new Date(b.submittedAt ?? 0).getTime()
                  )
                  .map((order) => {
                    const statusInfo = STATUS_LABELS[order.status] ?? STATUS_LABELS.submitted;
                    return (
                      <div
                        key={order.id}
                        className="rounded-xl border border-white/8 bg-ink-900 p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className={getTimeColor(order.submittedAt)} />
                            <span className={`text-base font-black ${getTimeColor(order.submittedAt)}`}>
                              {getTimeAgo(order.submittedAt)}
                            </span>
                          </div>
                          <span className="text-xl font-black text-gold-300">
                            {order.items.reduce((s, i) => s + Number(i.priceAtOrder), 0)} LE
                          </span>
                        </div>

                        <div className="mt-2">
                          <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-black ${statusInfo.color}`}>
                            {order.status === "submitted" && <Bell size={12} className="me-1" />}
                            {order.status === "preparing" && <ChefHat size={12} className="me-1" />}
                            {order.status === "ready" && <PackageCheck size={12} className="me-1" />}
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1.5">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-cream">
                                  {item.quantity}x {itemName(item)}
                                </span>
                                {item.selectedSize &&
                                  typeof item.selectedSize === "object" &&
                                  item.selectedSize !== null && (
                                    <span className="text-cream font-bold ms-1">
                                      ({(item.selectedSize as { label?: { ar?: string; en?: string } }).label?.[lang] ?? (item.selectedSize as { label?: { ar?: string; en?: string } }).label?.en ?? ""})
                                    </span>
                                  )}
                                {item.presets && Array.isArray(item.presets) && item.presets.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-0.5">
                                    {item.presets.map((p: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="rounded bg-brand-500/15 px-1.5 py-0.5 text-xs font-bold text-brand-300"
                                      >
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {item.notes && (
                                  <span className="text-cream/35 italic ms-1 text-sm">
                                    — &quot;{item.notes}&quot;
                                  </span>
                                )}
                              </div>
                              <span className="text-cream/45 shrink-0 ms-2 font-bold text-sm">
                                {Number(item.priceAtOrder)} LE
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {order.status === "submitted" && (
                            <button
                              onClick={() => handleAction(order.id, () => markOrderPreparing(order.id))}
                              disabled={acting === order.id}
                              className="flex items-center gap-1.5 rounded-lg bg-yellow-500/10 px-3 py-2 text-sm font-bold text-yellow-400 hover:bg-yellow-500/20 transition-colors disabled:opacity-40 min-h-[44px]"
                            >
                              <ChefHat size={16} />
                              {acting === order.id ? "..." : t.preparing}
                            </button>
                          )}
                          {order.status === "preparing" && (
                            <button
                              onClick={() => handleAction(order.id, () => markOrderReady(order.id))}
                              disabled={acting === order.id}
                              className="flex items-center gap-1.5 rounded-lg bg-green-500/10 px-3 py-2 text-sm font-bold text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-40 min-h-[44px]"
                            >
                              <PackageCheck size={16} />
                              {acting === order.id ? "..." : t.ready}
                            </button>
                          )}
                          {(order.status === "submitted" || order.status === "preparing" || order.status === "ready") && (
                            <button
                              onClick={() => handleAction(order.id, () => markOrderServed(order.id))}
                              disabled={acting === order.id}
                              className="flex items-center gap-1.5 rounded-lg bg-gold-500/10 px-3 py-2 text-sm font-bold text-gold-300 hover:bg-gold-500/20 transition-colors disabled:opacity-40 min-h-[44px]"
                            >
                              <CheckCircle2 size={16} />
                              {acting === order.id ? "..." : t.served}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(order.id)}
                            disabled={acting === order.id}
                            className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40 min-h-[44px]"
                          >
                            {acting === order.id ? "..." : lang === "ar" ? "حذف" : "Delete"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <div className="mt-6">
          {filteredServed.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/10 p-12 text-center">
              <p className="text-cream/35 text-base font-bold">{t.noServedOrders}</p>
              <p className="mt-1 text-sm text-cream/25">
                {t.served}... {historyTTL} {lang === "ar" ? "ساعة" : "hours"}
              </p>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredServed.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-green-500/10 bg-green-500/5 p-4 opacity-70"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-green-400" />
                  <span className="text-sm font-bold text-green-400">
                    Table {order.table.tableNumber} — {branchName(order.table.branch)}
                  </span>
                  <span className="text-sm text-cream/35">
                    {getTimeAgo(order.servedAt)}
                  </span>
                </div>
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1 min-w-0">
                        <span className="text-cream/55">
                          {item.quantity}x {itemName(item)}
                          {item.selectedSize &&
                            typeof item.selectedSize === "object" &&
                            item.selectedSize !== null && (
                              <span className="text-cream/75 ms-1">
                                ({(item.selectedSize as { label?: { ar?: string; en?: string } }).label?.[lang] ?? (item.selectedSize as { label?: { ar?: string; en?: string } }).label?.en ?? ""})
                              </span>
                            )}
                        </span>
                      </div>
                      <span className="text-cream/35 shrink-0 ms-2 text-sm">{Number(item.priceAtOrder)} LE</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(order.id)}
                    disabled={acting === order.id}
                    className="text-xs font-bold text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-40"
                  >
                    {acting === order.id ? "..." : lang === "ar" ? "حذف" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Tab */}
      {tab === "summary" && (
        <div className="mt-6">
          {/* Date Picker */}
          <div className="flex items-center gap-3 mb-6">
            <CalendarDays size={20} className="text-cream/50" />
            <input
              type="date"
              value={summaryDate}
              max={todayStr}
              onChange={(e) => { setSummaryDate(e.target.value); setSummaryLoading(true); }}
              className="rounded-lg border border-white/10 bg-ink-900 px-4 py-2.5 text-base font-bold text-cream"
            />
            {summaryDate === todayStr ? (
              <span className="rounded-lg bg-green-500/15 px-3 py-1.5 text-sm font-bold text-green-400">
                {lang === "ar" ? "اليوم" : "Today"}
              </span>
            ) : (
              <button
                onClick={() => { setSummaryDate(todayStr); setSummaryLoading(true); }}
                className="rounded-lg bg-white/5 px-3 py-1.5 text-sm font-bold text-cream/50 hover:text-cream transition-colors"
              >
                {lang === "ar" ? "العودة لليوم" : "Back to Today"}
              </button>
            )}
          </div>

          {summaryLoading ? (
            <div className="rounded-xl border border-white/8 bg-ink-900 p-12 text-center">
              <p className="text-base text-cream/40">{lang === "ar" ? "جارٍ التحميل..." : "Loading..."}</p>
            </div>
          ) : summaryData ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl border border-white/8 bg-ink-900 p-5">
                  <p className="text-sm text-cream/40 uppercase">{lang === "ar" ? "الطلبات" : "Orders"}</p>
                  <p className="text-4xl font-black text-cream mt-1">{summaryData.totalOrders}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-ink-900 p-5">
                  <p className="text-sm text-cream/40 uppercase">{lang === "ar" ? "الإيرادات" : "Revenue"}</p>
                  <p className="text-4xl font-black text-gold-300 mt-1">{summaryData.totalRevenue} <span className="text-lg">LE</span></p>
                </div>
                <div className="rounded-xl border border-white/8 bg-ink-900 p-5">
                  <p className="text-sm text-cream/40 uppercase">{lang === "ar" ? "الأصناف المباعة" : "Items Sold"}</p>
                  <p className="text-4xl font-black text-cream mt-1">{summaryData.itemsSold}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-ink-900 p-5">
                  <p className="text-sm text-cream/40 uppercase">{lang === "ar" ? "متوسط الطلب" : "Avg Order"}</p>
                  <p className="text-4xl font-black text-cream mt-1">
                    {summaryData.totalOrders > 0 ? Math.round(summaryData.totalRevenue / summaryData.totalOrders) : 0} <span className="text-lg">LE</span>
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Top Items */}
                {summaryData.topItems.length > 0 && (
                  <div className="rounded-xl border border-white/8 bg-ink-900 p-5">
                    <h3 className="text-base font-black text-cream/60 uppercase mb-4">
                      {lang === "ar" ? "الأكثر مبيعًا" : "Top Selling Items"}
                    </h3>
                    <div className="space-y-2">
                      {summaryData.topItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-cream/30 w-6">#{idx + 1}</span>
                            <span className="text-base font-bold text-cream">{lang === "ar" ? item.nameAr : item.nameEn}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-cream/40">×{item.quantity}</span>
                            <span className="text-base font-bold text-gold-300">{item.revenue} LE</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Branch Stats */}
                {summaryData.branchStats.length > 0 && (
                  <div className="rounded-xl border border-white/8 bg-ink-900 p-5">
                    <h3 className="text-base font-black text-cream/60 uppercase mb-4">
                      {lang === "ar" ? "الطلبات حسب الفرع" : "Orders by Branch"}
                    </h3>
                    <div className="space-y-2">
                      {summaryData.branchStats.map((branch, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5">
                          <span className="text-base font-bold text-cream">{lang === "ar" ? branch.nameAr : branch.nameEn}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-cream/40">{branch.count} {lang === "ar" ? "طلب" : "orders"}</span>
                            <span className="text-base font-bold text-gold-300">{branch.revenue} LE</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {summaryData.totalOrders === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 p-12 text-center">
                  <p className="text-cream/35 text-base font-bold">
                    {lang === "ar" ? "لا توجد طلبات في هذا اليوم" : "No orders on this day"}
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
