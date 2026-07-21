"use client";

import { deleteCategory, deleteMenuItem, toggleMenuItemAvailability, updateCategory, createCategory, createMenuItem, updateMenuItem } from "@/lib/actions";
import { uploadMenuImage } from "@/lib/storage";
import { useAdminT } from "@/lib/use-admin-t";
import type { Prisma } from "@prisma/client";
import { Check, ChevronDown, ChevronRight, Edit3, Trash2, X, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

type Cat = Prisma.CategoryGetPayload<{ include: { items: true } }>;
type Item = Cat["items"][number];

interface SizeRow {
  labelAr: string;
  labelEn: string;
  price: number;
}

interface ItemForm {
  categoryId: number;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: string;
  hasSizes: boolean;
  sizes: SizeRow[];
  image: string;
  badge: string;
}

const emptyForm = (categoryId: number): ItemForm => ({
  categoryId,
  nameAr: "",
  nameEn: "",
  descAr: "",
  descEn: "",
  price: "",
  hasSizes: false,
  sizes: [],
  image: "",
  badge: "",
});

function itemToForm(item: Item, categoryId: number): ItemForm {
  const sizesArr = (item.sizes as unknown as SizeRow[]) ?? [];
  return {
    categoryId,
    nameAr: item.nameAr,
    nameEn: item.nameEn,
    descAr: item.descAr,
    descEn: item.descEn,
    price: item.price !== null ? String(item.price) : "",
    hasSizes: sizesArr.length > 0,
    sizes: sizesArr,
    image: item.image,
    badge: item.badge ?? "",
  };
}

export function MenuEditor({ categories }: { categories: Cat[] }) {
  const t = useAdminT();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [editingCat, setEditingCat] = useState<number | null>(null);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatAr, setNewCatAr] = useState("");
  const [newCatEn, setNewCatEn] = useState("");
  const [itemForm, setItemForm] = useState<ItemForm | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleCreateCategory() {
    if (!newCatAr || !newCatEn) return;
    try {
      await createCategory({ nameAr: newCatAr, nameEn: newCatEn, order: categories.length, image: categories[0]?.image ?? "" });
      setNewCatAr("");
      setNewCatEn("");
      setShowAddCat(false);
      router.refresh();
    } catch (err) {
      console.error("Failed to create category:", err);
      alert("Failed. Please try again.");
    }
  }

  function openAddItem(catId: number) {
    setEditingItemId(null);
    setItemForm(emptyForm(catId));
  }

  function openEditItem(item: Item) {
    setEditingItemId(item.id);
    setItemForm(itemToForm(item, (item as { categoryId?: number }).categoryId ?? 0));
  }

  async function handleUpload(file: File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type) || file.size === 0 || file.size > 8 * 1024 * 1024) {
      alert("Upload a JPG, PNG, or WebP image smaller than 8 MB.");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.readAsDataURL(file);
      });
      const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
      const stem = file.name.replace(/\.[^.]+$/, "").replace(/\s/g, "-");
      const url = await uploadMenuImage(base64, `menu-${Date.now()}-${stem}.${extension}`, file.type);
      setItemForm((prev) => (prev ? { ...prev, image: url } : null));
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveItem() {
    if (!itemForm) return;

    const data: {
      categoryId: number;
      nameAr: string;
      nameEn: string;
      descAr: string;
      descEn: string;
      image: string;
      price: number | undefined;
      sizes: SizeRow[] | undefined;
      badge: string | undefined;
    } = {
      categoryId: itemForm.categoryId,
      nameAr: itemForm.nameAr,
      nameEn: itemForm.nameEn,
      descAr: itemForm.descAr,
      descEn: itemForm.descEn,
      image: itemForm.image,
      price: itemForm.hasSizes ? undefined : (itemForm.price !== "" ? Number(itemForm.price) : undefined),
      sizes: itemForm.hasSizes && itemForm.sizes.length > 0 ? itemForm.sizes : undefined,
      badge: itemForm.badge || undefined,
    };

    if (editingItemId) {
      await updateMenuItem(editingItemId, {
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        descAr: data.descAr,
        descEn: data.descEn,
        image: data.image,
        price: data.price ?? null,
        sizes: (data.sizes ?? null) as unknown as Prisma.InputJsonValue | null,
        badge: data.badge ?? null,
      });
    } else {
      await createMenuItem({
        categoryId: data.categoryId,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        descAr: data.descAr,
        descEn: data.descEn,
        image: data.image,
        price: data.price,
        sizes: data.sizes as unknown as Prisma.InputJsonValue | undefined,
        badge: data.badge,
      });
    }

    setItemForm(null);
    setEditingItemId(null);
    router.refresh();
  }

  function addSize() {
    setItemForm((prev) =>
      prev
        ? { ...prev, sizes: [...prev.sizes, { labelAr: "", labelEn: "", price: 0 }] }
        : prev
    );
  }

  function removeSize(idx: number) {
    setItemForm((prev) =>
      prev ? { ...prev, sizes: prev.sizes.filter((_, i) => i !== idx) } : prev
    );
  }

  function updateSize(idx: number, field: keyof SizeRow, value: string | number) {
    setItemForm((prev) => {
      if (!prev) return prev;
      const sizes = [...prev.sizes];
      sizes[idx] = { ...sizes[idx], [field]: value };
      return { ...prev, sizes };
    });
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowAddCat(!showAddCat)}
          className="outline-button text-xs"
        >
          <Plus size={14} />
          {t.addCategory}
        </button>
      </div>

      {showAddCat && (
        <form
          className="flex flex-wrap items-center gap-2 rounded-xl border border-white/8 bg-ink-900 p-4"
          onSubmit={(e) => { e.preventDefault(); handleCreateCategory(); }}
        >
          <input
            placeholder={t.arabicName}
            value={newCatAr}
            onChange={(e) => setNewCatAr(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-cream placeholder:text-cream/25"
          />
          <input
            placeholder={t.englishName}
            value={newCatEn}
            onChange={(e) => setNewCatEn(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-cream placeholder:text-cream/25"
          />
          <button type="submit" className="brand-button text-xs">{t.create}</button>
          <button type="button" onClick={() => setShowAddCat(false)} className="outline-button text-xs">{t.cancel}</button>
        </form>
      )}

      {categories.map((cat) => (
        <div key={cat.id} className="overflow-hidden rounded-xl border border-white/8 bg-ink-900">
          <div className="flex items-center gap-3 px-5 py-4">
            <button onClick={() => toggle(cat.id)} className="text-cream/45 hover:text-cream">
              {expanded.has(cat.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
              <Image src={cat.image} alt="" fill sizes="32px" className="object-cover" />
            </div>
            {editingCat === cat.id ? (
              <form
                className="flex flex-1 items-center gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  await updateCategory(cat.id, { nameAr: fd.get("nameAr") as string, nameEn: fd.get("nameEn") as string });
                  setEditingCat(null);
                  router.refresh();
                }}
              >
                <input name="nameAr" defaultValue={cat.nameAr} className="min-h-9 rounded-lg border border-white/10 bg-black/20 px-3 text-sm font-bold text-cream" />
                <input name="nameEn" defaultValue={cat.nameEn} className="min-h-9 rounded-lg border border-white/10 bg-black/20 px-3 text-sm font-bold text-cream" />
                <button type="submit" className="grid h-9 w-9 place-items-center rounded-lg bg-olive-400/16 text-olive-400"><Check size={16} /></button>
                <button type="button" onClick={() => setEditingCat(null)} className="grid h-9 w-9 place-items-center rounded-lg text-cream/35 hover:text-cream"><X size={16} /></button>
              </form>
            ) : (
              <>
                <span className="flex-1 text-sm font-black text-cream">{cat.nameAr} <span className="text-cream/35">— {cat.nameEn}</span></span>
                  <span className="text-xs font-bold text-cream/25">{cat.items.length} {t.items}</span>
                <button onClick={() => openAddItem(cat.id)} className="flex items-center gap-1 rounded-lg bg-gold-500/10 px-3 py-1.5 text-xs font-bold text-gold-300 hover:bg-gold-500/20">
                   <Plus size={14} /> {t.addItem}
                </button>
                <button onClick={() => setEditingCat(cat.id)} className="grid h-8 w-8 place-items-center rounded-lg text-cream/35 hover:text-cream"><Edit3 size={15} /></button>
                <button
                  onClick={async () => {
                    if (!confirm(t.deleteCategoryConfirm)) return;
                    try {
                      await deleteCategory(cat.id);
                      router.refresh();
                    } catch (err) {
                      console.error("Failed to delete category:", err);
                      alert("Failed. Please try again.");
                    }
                  }}
                  className="grid h-8 w-8 place-items-center rounded-lg text-cream/25 hover:text-brand-400"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>

          {expanded.has(cat.id) && (
            <div className="border-t border-white/5">
              {cat.items.map((item: Item) => {
                const sizesArr = (item.sizes as unknown as SizeRow[]) ?? [];
                return (
                <div key={item.id} className="flex items-center gap-3 border-b border-white/3 px-5 py-3 last:border-b-0">
                  <div className="relative h-9 w-14 shrink-0 overflow-hidden rounded">
                    <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold text-cream">{item.nameAr}</p>
                      {item.badge && <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-black ${item.badge === "popular" ? "bg-gold-200 text-ink-950" : "bg-brand-100 text-brand-700"}`}>{item.badge}</span>}
                      {!item.available && <span className="shrink-0 rounded bg-ink-800 px-1.5 py-0.5 text-[10px] font-black text-cream/35">{t.hidden}</span>}
                    </div>
                    <p className="truncate text-xs text-cream/35">{item.nameEn}</p>
                  </div>
                  <span className="shrink-0 text-xs font-black text-gold-300">
                    {item.price ? `${item.price} LE` : sizesArr.length > 0 ? `${sizesArr[0]?.price}–${sizesArr[sizesArr.length - 1]?.price} LE` : "—"}
                  </span>
                  <button onClick={() => openEditItem(item)} className="grid h-8 w-8 place-items-center rounded-lg text-cream/35 hover:text-cream"><Edit3 size={14} /></button>
                  <button onClick={async () => { try { await toggleMenuItemAvailability(item.id); router.refresh(); } catch (err) { console.error("Failed to toggle item:", err); alert("Failed. Please try again."); } }} className="grid h-8 w-8 place-items-center rounded-lg text-xs text-cream/35 hover:text-cream">
                    {item.available ? <Check size={14} /> : <X size={14} />}
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm(`Delete "${item.nameEn}"?`)) return;
                      try {
                        await deleteMenuItem(item.id);
                        router.refresh();
                      } catch (err) {
                        console.error("Failed to delete item:", err);
                        alert("Failed. Please try again.");
                      }
                    }}
                    className="grid h-8 w-8 place-items-center rounded-lg text-cream/25 hover:text-brand-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {itemForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 pt-12 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-ink-900 border border-white/10 p-6 my-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-cream">
                {editingItemId ? t.editItem : t.addItem}
              </h2>
              <button onClick={() => { setItemForm(null); setEditingItemId(null); }} className="text-cream/35 hover:text-cream"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-cream/45">{t.arabicName}</label>
                  <input value={itemForm.nameAr} onChange={(e) => setItemForm({ ...itemForm, nameAr: e.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-sm text-cream" />
                </div>
                <div>
                  <label className="text-xs font-bold text-cream/45">{t.englishName}</label>
                  <input value={itemForm.nameEn} onChange={(e) => setItemForm({ ...itemForm, nameEn: e.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-sm text-cream" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-cream/45">{t.arabicDesc}</label>
                  <input value={itemForm.descAr} onChange={(e) => setItemForm({ ...itemForm, descAr: e.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-sm text-cream" />
                </div>
                <div>
                  <label className="text-xs font-bold text-cream/45">{t.englishDesc}</label>
                  <input value={itemForm.descEn} onChange={(e) => setItemForm({ ...itemForm, descEn: e.target.value })} className="mt-1 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-sm text-cream" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-cream/45">{t.badge}</label>
                <select
                  value={itemForm.badge}
                  onChange={(e) => setItemForm({ ...itemForm, badge: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-sm text-cream"
                >
                  <option value="">{t.none}</option>
                  <option value="popular">{t.popular}</option>
                  <option value="spicy">{t.spicy}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-cream/45">{t.image}</label>
                <div className="mt-1 flex items-center gap-3">
                  {itemForm.image && (
                    <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg">
                      <Image src={itemForm.image} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                  )}
                  <input
                    type="text"
                    value={itemForm.image}
                    onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-sm text-cream placeholder:text-cream/25"
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-cream/65 hover:bg-white/20 disabled:opacity-40"
                  >
                    <Upload size={14} />
                    {uploading ? "..." : t.upload}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.hasSizes}
                    onChange={(e) => setItemForm({ ...itemForm, hasSizes: e.target.checked, price: e.target.checked ? "" : itemForm.price })}
                    className="accent-gold-400"
                  />
                  <span className="text-sm font-bold text-cream/65">{t.hasSizes}</span>
                </label>
              </div>

              {!itemForm.hasSizes ? (
                <div>
                  <label className="text-xs font-bold text-cream/45">{t.price} (LE)</label>
                  <input
                    type="number"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-ink-950 px-3 py-2 text-sm text-cream"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-cream/45">{t.sizes}</label>
                  <div className="mt-2 space-y-2">
                    {itemForm.sizes.map((size, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          placeholder="AR label"
                          value={size.labelAr}
                          onChange={(e) => updateSize(idx, "labelAr", e.target.value)}
                          className="flex-1 rounded-lg border border-white/10 bg-ink-950 px-2 py-1.5 text-xs text-cream"
                        />
                        <input
                          placeholder="EN label"
                          value={size.labelEn}
                          onChange={(e) => updateSize(idx, "labelEn", e.target.value)}
                          className="flex-1 rounded-lg border border-white/10 bg-ink-950 px-2 py-1.5 text-xs text-cream"
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={size.price || ""}
                          onChange={(e) => updateSize(idx, "price", Number(e.target.value))}
                          className="w-20 rounded-lg border border-white/10 bg-ink-950 px-2 py-1.5 text-xs text-cream"
                        />
                        <button onClick={() => removeSize(idx)} className="text-red-400 hover:text-red-300 p-1"><X size={14} /></button>
                      </div>
                    ))}
                    <button onClick={addSize} className="text-xs font-bold text-gold-300 hover:text-gold-200">
                      {t.addSize}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={handleSaveItem} className="brand-button flex-1 justify-center text-sm">
                {editingItemId ? t.update : t.create}
              </button>
              <button onClick={() => { setItemForm(null); setEditingItemId(null); }} className="outline-button flex-1 justify-center text-sm">
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
