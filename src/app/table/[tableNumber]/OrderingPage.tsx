"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  X,
  ChevronRight,
  Check,
  ArrowLeft,
  ChefHat,
  PackageCheck,
  UtensilsCrossed,
} from "lucide-react";

interface LocaleLabel {
  ar: string;
  en: string;
}

interface Size {
  label: LocaleLabel;
  price: number;
}

interface MenuItemType {
  id: number;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number | null;
  sizes: Size[] | null;
  image: string;
  badge: string | null;
}

interface CategoryType {
  id: number;
  nameAr: string;
  nameEn: string;
  items: MenuItemType[];
}

interface TableInfo {
  id: string;
  tableNumber: number;
  branchNameAr: string;
  branchNameEn: string;
  qrToken: string;
}

interface CartItem {
  menuItemId: number;
  nameAr: string;
  nameEn: string;
  quantity: number;
  selectedSize?: Size;
  image: string;
  notes?: string;
  presets?: string[];
  unitPrice: number;
}

type Screen = "menu" | "review" | "success";
type QRLang = "ar" | "en";

const qr = {
  ar: {
    table: "طاولة",
    reviewOrder: "مراجعة الطلب",
    total: "الإجمالي",
    submitting: "جارٍ الإرسال...",
    confirmOrder: "تأكيد الطلب",
    noChanges: "بعد الإرسال لا يمكن تعديل الطلب.",
    add: "أضف",
    from: "من",
    currency: "ج.م",
    popular: "الأكثر طلبًا",
    viewCart: "عرض السلة",
    cart: "السلة",
    cartEmpty: "سلتك فاضية",
    editNotes: "تعديل ملاحظات",
    addNotes: "+ إضافة ملاحظات",
    remove: "حذف",
    cancel: "إلغاء",
    quickOptions: "خيارات سريعة",
    customNote: "ملاحظة خاصة",
    done: "تم",
    addNotesFor: "إضافة ملاحظات",
    orderSubmitted: "تم استلام الطلب!",
    itemsWord: "صنف",
    staffComing: "الموظف هييجي لك بالطلب قريبًا. شكرًا!",
    orderReceived: "تم استلام الطلب",
    preparing: "قيد التحضير",
    ready: "جاهز",
    served: "تم التسليم",
    stageSubmitted: "طلبك اتسلم والمطبخ هيبدأ تحضيره قريبًا.",
    stagePreparing: "الشيف بيحضّر أكلك دلوقتي.",
    stageReady: "أكلك جاهز! الموظف هيجيبه لك على الطاولة.",
    stageServed: "بالهنا والشفا!",
    networkError: "مشكلة في الشبكة. حاول تاني.",
    presets: ["بدون بصل", "حراق زيادة", "مستوي كويس", "ملح قليل", "بدون توم"],
  },
  en: {
    table: "Table",
    reviewOrder: "Review Your Order",
    total: "Total",
    submitting: "Submitting...",
    confirmOrder: "Confirm Order",
    noChanges: "Once submitted, this order cannot be changed.",
    add: "Add",
    from: "from",
    currency: "LE",
    popular: "Popular",
    viewCart: "View Cart",
    cart: "Cart",
    cartEmpty: "Your cart is empty",
    editNotes: "Edit notes",
    addNotes: "+ Add notes",
    remove: "Remove",
    cancel: "Cancel",
    quickOptions: "Quick options",
    customNote: "Custom note",
    done: "Done",
    addNotesFor: "Add Notes",
    orderSubmitted: "Order Submitted!",
    itemsWord: "items",
    staffComing: "Staff will bring your food shortly. Thank you!",
    orderReceived: "Order Received",
    preparing: "Preparing",
    ready: "Ready",
    served: "Served",
    stageSubmitted: "Your order has been received. The kitchen will start preparing it soon.",
    stagePreparing: "The chef is preparing your food now.",
    stageReady: "Your food is ready! Staff will bring it to your table.",
    stageServed: "Enjoy your meal!",
    networkError: "Network error. Please try again.",
    presets: ["No onions", "Extra spicy", "Well done", "Less salt", "No garlic"],
  },
} as const;

const COMMON_PRESETS_EN = qr.en.presets;
const COMMON_PRESETS_AR = qr.ar.presets;

export function OrderingPage({
  table,
  categories,
  popularItemIds,
  liveTrackingEnabled,
}: {
  table: TableInfo;
  categories: CategoryType[];
  popularItemIds: number[];
  liveTrackingEnabled: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? 0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>("menu");
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderId: string;
    total: number;
    items: unknown[];
    submittedAt: string;
  } | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("submitted");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sizePicker, setSizePicker] = useState<MenuItemType | null>(null);
  const [noteItem, setNoteItem] = useState<CartItem | null>(null);
  const [tempNote, setTempNote] = useState("");
  const [tempPresets, setTempPresets] = useState<string[]>([]);
  const cartLoadedRef = useRef(false);
  const [lang, setLang] = useState<QRLang>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("qr-lang") as QRLang) || "en";
  });
  const t = qr[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("qr-lang", lang);
  }, [lang]);

  const storageKey = `qr-cart-${table.id}`;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) setCart(JSON.parse(saved));
      } catch {
        localStorage.removeItem(storageKey);
      } finally {
        cartLoadedRef.current = true;
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!cartLoadedRef.current) return;
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, storageKey]);

  const addToCart = useCallback(
    (item: MenuItemType, size?: Size) => {
      setCart((prev) => {
        const existing = prev.findIndex(
          (c) =>
            c.menuItemId === item.id &&
            c.selectedSize?.label?.en === (size?.label?.en ?? undefined)
        );
        if (existing >= 0) {
          const next = [...prev];
          next[existing] = { ...next[existing], quantity: next[existing].quantity + 1 };
          return next;
        }
        const unitPrice = size ? size.price : item.price ?? 0;
        return [
          ...prev,
          {
            menuItemId: item.id,
            nameAr: item.nameAr,
            nameEn: item.nameEn,
            quantity: 1,
            selectedSize: size,
            image: item.image,
            unitPrice,
          },
        ];
      });
    },
    []
  );

  function updateQuantity(menuItemId: number, sizeLabelEn?: string, delta?: number) {
    setCart((prev) =>
      prev
        .map((c) => {
          if (
            c.menuItemId === menuItemId &&
            c.selectedSize?.label?.en === (sizeLabelEn ?? undefined)
          ) {
            const qty = delta !== undefined ? c.quantity + delta : 1;
            return { ...c, quantity: Math.max(1, qty) };
          }
          return c;
        })
    );
  }

  function removeFromCart(menuItemId: number, sizeLabelEn?: string) {
    setCart((prev) =>
      prev.filter(
        (c) =>
          !(
            c.menuItemId === menuItemId &&
            c.selectedSize?.label?.en === (sizeLabelEn ?? undefined)
          )
      )
    );
  }

  function updateNotes(menuItemId: number, sizeLabelEn?: string) {
    setCart((prev) =>
      prev.map((c) => {
        if (
          c.menuItemId === menuItemId &&
          c.selectedSize?.label?.en === (sizeLabelEn ?? undefined)
        ) {
          return { ...c, notes: tempNote || undefined, presets: tempPresets.length ? tempPresets : undefined };
        }
        return c;
      })
    );
    setNoteItem(null);
    setTempNote("");
    setTempPresets([]);
  }

  const cartTotal = cart.reduce((s, c) => s + c.unitPrice * c.quantity, 0);
  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  async function handleSubmit() {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          tableId: table.id,
          token: table.qrToken,
          items: cart.map((c) => ({
            menuItemId: c.menuItemId,
            quantity: c.quantity,
            selectedSize: c.selectedSize,
            notes: c.notes,
            presets: c.presets,
          })),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to submit order");
        return;
      }
      const data = await res.json();
      setOrderResult(data);
      setScreen("success");
      setCart([]);
      localStorage.removeItem(storageKey);
    } catch {
      alert(t.networkError);
    } finally {
      setSubmitting(false);
    }
  }

  const allCategories = categories.filter((c) => c.items.length > 0);
  const currentCat = allCategories.find((c) => c.id === activeCategory) ?? allCategories[0];

  if (screen === "success" && orderResult) {
    return (
      <SuccessScreen
        orderResult={orderResult}
        liveTrackingEnabled={liveTrackingEnabled}
        orderStatus={orderStatus}
        setOrderStatus={setOrderStatus}
        pollRef={pollRef}
        lang={lang}
        tableToken={table.qrToken}
      />
    );
  }

  if (screen === "review") {
    return (
      <div className="min-h-screen bg-cocoa-950">
        <div className="sticky top-0 z-10 bg-cocoa-950 border-b border-white/[0.06] px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setScreen("menu")} className="flex h-9 w-9 items-center justify-center rounded-lg text-cream">
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-cream">{t.reviewOrder}</h1>
              <p className="text-xs text-cream">{t.table} {table.tableNumber}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3 max-w-lg mx-auto">
          {cart.map((item) => {
            const key = `${item.menuItemId}-${item.selectedSize?.label?.en ?? "single"}`;
            return (
              <div key={key} className="rounded-xl border border-white/[0.08] bg-cocoa-900 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-cream">{lang === "ar" ? item.nameAr : item.nameEn}</h3>
                    {item.selectedSize && (
                      <span className="text-xs text-cream">{lang === "ar" ? item.selectedSize.label.ar : item.selectedSize.label.en}</span>
                    )}
                    {item.presets && item.presets.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.presets.map((p) => (
                          <span key={p} className="rounded-md bg-brass-500/15 px-2 py-0.5 text-[10px] font-bold text-brass-400">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.notes && (
                      <p className="mt-1 text-xs text-cream italic">&quot;{item.notes}&quot;</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-brass-400">
                      {item.unitPrice * item.quantity} {t.currency}
                    </span>
                    <p className="text-xs text-cream">x{item.quantity}</p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="rounded-xl border border-brass-500/20 bg-brass-500/[0.06] p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-cream">{t.total}</span>
              <span className="text-xl font-bold text-brass-400">{cartTotal} {t.currency}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brass-500 py-3.5 text-sm font-bold text-cocoa-950 transition-colors hover:bg-brass-400 disabled:opacity-50"
          >
            {submitting ? t.submitting : `${t.confirmOrder} — ${cartTotal} ${t.currency}`}
          </button>

          <p className="text-center text-xs text-cream px-4">
            {t.noChanges}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cocoa-950 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-cocoa-950/95 backdrop-blur border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-cream">
              {t.table} {table.tableNumber}
            </h1>
            <p className="text-xs text-cream">{lang === "ar" ? table.branchNameAr : table.branchNameEn}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-cocoa-900 text-xs font-bold text-cream"
            >
              {lang === "ar" ? "EN" : "ع"}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-9 items-center gap-2 rounded-full bg-brass-500 px-4 text-sm font-bold text-cocoa-950"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cocoa-950 text-[10px] font-bold text-brass-400"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-white/[0.06] px-2 py-2" style={{ scrollbarWidth: "none" }}>
        {allCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
              activeCategory === cat.id
                ? "bg-brass-500 text-cocoa-950"
                : "bg-cocoa-900 text-cream hover:bg-cocoa-800"
            }`}
          >
            {lang === "ar" ? cat.nameAr : cat.nameEn}
          </button>
        ))}
      </div>

      {/* Menu items */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {currentCat && (
              <div className="space-y-3">
                {currentCat.items.map((item, index) => {
                  const hasSizes = item.sizes && item.sizes.length > 0;
                  const isPopular = popularItemIds.includes(item.id);
                  const displayPrice = hasSizes ? item.sizes![0].price : item.price ?? 0;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-xl border border-white/[0.08] bg-cocoa-900 p-3"
                    >
                      <div className="flex gap-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cocoa-800">
                          <Image
                            src={item.image}
                            alt={item.nameEn}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-cream">{lang === "ar" ? item.nameAr : item.nameEn}</h3>
                          <p className="text-xs text-cream line-clamp-2">{lang === "ar" ? item.descAr : item.descEn}</p>
                          {isPopular && (
                            <span className="mt-1 inline-block rounded-md bg-brass-500/15 px-2 py-0.5 text-[10px] font-bold text-brass-400">
                              {t.popular}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => hasSizes ? setSizePicker(item) : addToCart(item)}
                          className="flex items-center gap-1.5 rounded-lg bg-brass-500 px-3 py-1.5 text-xs font-bold text-cocoa-950"
                        >
                          <Plus size={14} />
                          {t.add}
                        </motion.button>
                        <span className="text-sm font-bold text-brass-400">
                          {hasSizes && item.sizes!.length > 1
                            ? `${t.from} ${displayPrice}`
                            : displayPrice}{" "}
                          {t.currency}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating cart bar */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 z-20"
          >
            <button
              onClick={() => setScreen("review")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brass-500 py-3.5 text-sm font-bold text-cocoa-950 shadow-lg shadow-brass-500/20"
            >
              {t.viewCart} ({cartCount}) — {cartTotal} {t.currency}
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-cocoa-950 shadow-2xl flex flex-col"
              dir="ltr"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
                <h2 className="text-sm font-bold text-cream">
                  {t.cart} ({cartCount})
                </h2>
                <button onClick={() => setCartOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-cream">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 && (
                  <p className="text-center text-sm text-cream py-12">{t.cartEmpty}</p>
                )}
                {cart.map((item) => {
                  const key = `${item.menuItemId}-${item.selectedSize?.label?.en ?? "single"}`;
                  return (
                    <div key={key} className="rounded-xl border border-white/[0.08] bg-cocoa-900 p-3">
                      <div className="flex items-start gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                          <Image src={item.image} alt={item.nameEn} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-cream">{lang === "ar" ? item.nameAr : item.nameEn}</h4>
                          {item.selectedSize && (
                            <span className="text-[10px] text-cream">{lang === "ar" ? item.selectedSize.label.ar : item.selectedSize.label.en}</span>
                          )}
                          {item.presets && item.presets.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.presets.map((p) => (
                                <span key={p} className="rounded bg-brass-500/15 px-1.5 py-0.5 text-[9px] font-bold text-brass-400">
                                  {p}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-1 flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.selectedSize?.label?.en, -1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-cocoa-800 text-cream hover:bg-cocoa-700"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold text-cream w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.menuItemId, item.selectedSize?.label?.en, 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-cocoa-800 text-cream hover:bg-cocoa-700"
                            >
                              <Plus size={12} />
                            </button>
                            <span className="ml-auto text-xs font-bold text-brass-400">
                              {item.unitPrice * item.quantity} {t.currency}
                            </span>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => {
                                setNoteItem(item);
                                setTempNote(item.notes ?? "");
                                setTempPresets(item.presets ?? []);
                                setCartOpen(false);
                              }}
                              className="text-[10px] font-bold text-cream hover:text-brass-400"
                            >
                              {item.notes || item.presets?.length ? t.editNotes : t.addNotes}
                            </button>
                            <button
                              onClick={() => removeFromCart(item.menuItemId, item.selectedSize?.label?.en)}
                              className="text-[10px] font-bold text-red-400 hover:text-red-300"
                            >
                              <Trash2 size={12} className="inline mr-1" />
                              {t.remove}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-white/[0.06] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-cream">{t.total}</span>
                    <span className="text-lg font-bold text-brass-400">{cartTotal} {t.currency}</span>
                  </div>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setScreen("review");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brass-500 py-3 text-sm font-bold text-cocoa-950"
                  >
                    {t.reviewOrder}
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Size picker modal */}
      <AnimatePresence>
        {sizePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 flex items-end sm:items-center justify-center p-4"
            onClick={() => setSizePicker(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-cocoa-900 p-6 border border-white/[0.08]"
            >
              <h3 className="text-sm font-bold text-cream">{lang === "ar" ? sizePicker.nameAr : sizePicker.nameEn}</h3>
              <p className="mt-1 text-xs text-cream">{lang === "ar" ? sizePicker.descAr : sizePicker.descEn}</p>
              <div className="mt-4 space-y-2">
                {sizePicker.sizes?.map((size) => (
                  <button
                    key={size.label.en}
                    onClick={() => {
                      addToCart(sizePicker, size);
                      setSizePicker(null);
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-cocoa-950 px-4 py-3 text-sm font-bold text-cream hover:border-brass-500/30 hover:bg-cocoa-800 transition-colors"
                  >
                    <span>{lang === "ar" ? size.label.ar : size.label.en}</span>
                    <span className="text-brass-400">{size.price} {t.currency}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSizePicker(null)}
                className="mt-3 w-full rounded-xl bg-cocoa-800 py-3 text-xs font-bold text-cream hover:bg-cocoa-700"
              >
                {t.cancel}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes modal */}
      <AnimatePresence>
        {noteItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 flex items-end sm:items-center justify-center p-4"
            onClick={() => {
              updateNotes(noteItem.menuItemId, noteItem.selectedSize?.label?.en);
            }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-cocoa-900 p-6 border border-white/[0.08]"
            >
              <h3 className="text-sm font-bold text-cream">{t.addNotesFor} — {lang === "ar" ? noteItem.nameAr : noteItem.nameEn}</h3>

              <div className="mt-4">
                <p className="text-xs font-bold text-cream mb-2">{t.quickOptions}</p>
                <div className="flex flex-wrap gap-2">
                  {(lang === "ar" ? COMMON_PRESETS_AR : COMMON_PRESETS_EN).map((preset, idx) => {
                    const storagePreset = COMMON_PRESETS_EN[idx];
                    return (
                      <button
                        key={preset}
                        onClick={() =>
                          setTempPresets((prev) =>
                            prev.includes(storagePreset)
                              ? prev.filter((p) => p !== storagePreset)
                              : [...prev, storagePreset]
                          )
                        }
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                          tempPresets.includes(storagePreset)
                            ? "bg-brass-500 text-cocoa-950"
                            : "bg-cocoa-800 text-cream hover:bg-cocoa-700"
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold text-cream">{t.customNote}</label>
                <input
                  type="text"
                  value={tempNote}
                  onChange={(e) => setTempNote(e.target.value)}
                  placeholder='e.g. "no onions, extra spicy"'
                  className="mt-1 w-full rounded-lg border border-white/[0.08] bg-cocoa-950 px-3 py-2.5 text-sm text-cream placeholder:text-cream focus:outline-none focus:border-brass-500/40"
                />
              </div>

              <button
                onClick={() =>
                  updateNotes(noteItem.menuItemId, noteItem.selectedSize?.label?.en)
                }
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-brass-500 py-3 text-sm font-bold text-cocoa-950"
              >
                {t.done}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessScreen({
  orderResult,
  liveTrackingEnabled,
  orderStatus,
  setOrderStatus,
  pollRef,
  lang,
  tableToken,
}: {
  orderResult: { orderId: string; total: number; items: unknown[]; submittedAt: string };
  liveTrackingEnabled: boolean;
  orderStatus: string;
  setOrderStatus: (s: string) => void;
  pollRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
  lang: QRLang;
  tableToken: string;
}) {
  const t = qr[lang];
  const STAGES = [
    { key: "submitted", label: t.orderReceived, icon: Check },
    { key: "preparing", label: t.preparing, icon: ChefHat },
    { key: "ready", label: t.ready, icon: PackageCheck },
    { key: "served", label: t.served, icon: UtensilsCrossed },
  ];
  const currentStageIdx = STAGES.findIndex((s) => s.key === orderStatus);

  useEffect(() => {
    if (!liveTrackingEnabled) return;

    async function poll() {
      try {
        const res = await fetch(`/api/orders/${orderResult.orderId}/status?token=${encodeURIComponent(tableToken)}`, {
          credentials: "same-origin",
        });
        if (res.ok) {
          const data = await res.json();
          setOrderStatus(data.status);
          if (data.status === "served") {
            if (pollRef.current) clearInterval(pollRef.current);
          }
        }
      } catch {}
    }

    poll();
    pollRef.current = setInterval(poll, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [liveTrackingEnabled, orderResult.orderId, setOrderStatus, pollRef, tableToken]);

  return (
    <div className="min-h-screen bg-cocoa-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mb-6"
        >
          <Check size={32} className="text-green-400" />
        </motion.div>

        <h1 className="text-2xl font-bold text-cream">{t.orderSubmitted}</h1>
        <p className="mt-2 text-sm text-cream">
          {orderResult.items.length} {t.itemsWord} — {orderResult.total} {t.currency}
        </p>

        {!liveTrackingEnabled && (
          <p className="mt-4 text-sm text-cream">
            {t.staffComing}
          </p>
        )}

        {liveTrackingEnabled && (
          <div className="mt-8">
            <div className="flex items-center justify-between px-2">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isActive = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div key={stage.key} className="flex flex-col items-center gap-2 relative">
                    {idx > 0 && (
                      <div
                        className={`absolute top-4 -left-[calc(50%+8px)] w-[calc(100%-16px)] h-0.5 -translate-y-1/2 transition-colors ${
                          isActive ? "bg-brass-500" : "bg-cocoa-800"
                        }`}
                        style={{ left: idx === 1 ? "-50%" : undefined }}
                      />
                    )}
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-brass-500 text-cocoa-950"
                          : "bg-cocoa-800 text-cream"
                      }`}
                    >
                      <Icon size={14} />
                    </motion.div>
                    <span
                      className={`text-[10px] font-bold ${
                        isActive ? "text-cream" : "text-cream"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <motion.p
              key={orderStatus}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-sm font-bold text-cream"
            >
              {orderStatus === "submitted" && t.stageSubmitted}
              {orderStatus === "preparing" && t.stagePreparing}
              {orderStatus === "ready" && t.stageReady}
              {orderStatus === "served" && t.stageServed}
            </motion.p>
          </div>
        )}
      </div>
    </div>
  );
}
