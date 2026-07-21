import { useState, useRef } from 'react';

export type ProductData = {
  id: string;
  name: string;
  inspiredBy: string;
  gender: "Women" | "Men" | "Unisex";
  concentration: string;
  family: string;
  top: string[];
  heart: string[];
  base: string[];
  mood: string;
  sizes: { ml: number; price: number }[];
  image: string;
  bestseller?: boolean;
  nouveau?: boolean;
  rating: number;
  reviews: number;
  story: string;
};

type Props = {
  products: ProductData[];
  onSave: (products: ProductData[]) => void;
  onClose: () => void;
  deliveryCharge: number;
  onDeliveryChange: (charge: number) => void;
  whatsapp: string;
  onWhatsappChange: (num: string) => void;
};

const getAdminProductImage = (p: ProductData) => {
  if (p.image && p.image.trim() !== "") {
    return p.image;
  }
  
  const family = (p.family || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  
  // Scent template checks
  if (name.includes('sauvage') || name.includes('bleu') || name.includes('cool water') || name.includes('hawas') || name.includes('chrome') || name.includes('explorer') || name.includes('acqua') || family.includes('aquatic') || family.includes('marine')) {
    return '/images/base_aquatic.png';
  }
  if (name.includes('wood') || name.includes('oud') || name.includes('janan') || name.includes('prestige') || family.includes('wood') || family.includes('oud')) {
    return '/images/base_woody.png';
  }
  if (name.includes('vanille') || name.includes('khamrah') || name.includes('asad') || name.includes('code') || name.includes('stronger') || family.includes('spicy') || family.includes('amber') || family.includes('oriental')) {
    return '/images/base_spicy.png';
  }
  if (name.includes('leather') || name.includes('suede') || name.includes('animalic') || family.includes('leather')) {
    return '/images/base_leather.png';
  }
  if (name.includes('tweed') || name.includes('sage') || name.includes('legend') || name.includes('century') || family.includes('green') || family.includes('herbal')) {
    return '/images/base_green.png';
  }
  if (name.includes('bloom') || name.includes('j\'adore') || name.includes('blue lady') || name.includes('jasmine') || name.includes('grace') || family.includes('white floral') || family.includes('jasmine')) {
    return '/images/base_white_floral.png';
  }
  if (name.includes('yara') || name.includes('bombshell') || name.includes('cherry') || name.includes('rouge 540') || name.includes('baccarat') || name.includes('pear') || family.includes('fruity') || family.includes('sweet') || family.includes('gourmand')) {
    return '/images/base_fruity.png';
  }
  if (name.includes('rose') || name.includes('flora') || name.includes('chance') || name.includes('bright crystal') || family.includes('floral') || family.includes('rose')) {
    return '/images/base_floral.png';
  }

  // Fallbacks
  if (p.gender === 'Men') return '/images/base_aquatic.png';
  if (p.gender === 'Women') return '/images/base_floral.png';
  return '/images/base_spicy.png';
};

const EMPTY_PRODUCT: ProductData = {
  id: "",
  name: "",
  inspiredBy: "",
  gender: "Men",
  concentration: "Eau de Parfum",
  family: "",
  top: [],
  heart: [],
  base: [],
  mood: "",
  sizes: [{ ml: 10, price: 299 }, { ml: 50, price: 1299 }, { ml: 100, price: 2499 }],
  image: "",
  bestseller: false,
  nouveau: false,
  rating: 4.8,
  reviews: 0,
  story: "",
};

export default function AdminPanel({ products, onSave, onClose, deliveryCharge, onDeliveryChange, whatsapp, onWhatsappChange }: Props) {
  const [tab, setTab] = useState<"products" | "add" | "settings">("products");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editData, setEditData] = useState<ProductData | null>(null);
  const [newProduct, setNewProduct] = useState<ProductData>({ ...EMPTY_PRODUCT });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [tempDelivery, setTempDelivery] = useState(deliveryCharge);
  const [tempWA, setTempWA] = useState(whatsapp);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileRefNew = useRef<HTMLInputElement>(null);

  const flash = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 2500);
  };

  /* ── Edit ── */
  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setEditData({ ...products[idx] });
    setTab("products");
  };

  const saveEdit = () => {
    if (!editData || editIdx === null) return;
    const updated = [...products];
    updated[editIdx] = editData;
    onSave(updated);
    setEditIdx(null);
    setEditData(null);
    flash("✓ Product updated successfully");
  };

  /* ── Delete ── */
  const deleteProduct = (id: string) => {
    onSave(products.filter(p => p.id !== id));
    setConfirmDelete(null);
    flash("✓ Product deleted");
  };

  /* ── Add ── */
  const addProduct = () => {
    if (!newProduct.name.trim()) { flash("⚠ Name is required"); return; }
    const id = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    const prod = { ...newProduct, id };
    onSave([...products, prod]);
    setNewProduct({ ...EMPTY_PRODUCT });
    setTab("products");
    flash("✓ Product added successfully");
  };

  /* ── Move order ── */
  const moveProduct = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= products.length) return;
    const updated = [...products];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    onSave(updated);
  };

  /* ── Image upload to data URL ── */
  const handleImageUpload = (file: File, setter: (url: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) setter(e.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  /* ── Notes editor helper ── */
  const NotesField = ({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) => (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">{label}</label>
      <input
        value={value.join(", ")}
        onChange={e => onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
        placeholder="Comma separated, e.g. Rose, Jasmine"
        className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white mt-1"
      />
    </div>
  );

  /* ── Size editor ── */
  const SizeEditor = ({ sizes, onChange }: { sizes: { ml: number; price: number }[]; onChange: (s: { ml: number; price: number }[]) => void }) => (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Sizes & Prices (PKR)</label>
      <div className="space-y-2 mt-1">
        {sizes.map((s, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="number"
              value={s.ml}
              onChange={e => { const c = [...sizes]; c[i] = { ...c[i], ml: Number(e.target.value) }; onChange(c); }}
              className="w-20 border border-[#d8c4a0] rounded-lg px-2 py-2 text-[13px] outline-none"
              placeholder="ml"
            />
            <span className="text-[12px] text-[#9a8560]">ml</span>
            <input
              type="number"
              value={s.price}
              onChange={e => { const c = [...sizes]; c[i] = { ...c[i], price: Number(e.target.value) }; onChange(c); }}
              className="w-28 border border-[#d8c4a0] rounded-lg px-2 py-2 text-[13px] outline-none"
              placeholder="Price"
            />
            <span className="text-[12px] text-[#9a8560]">PKR</span>
            <button onClick={() => onChange(sizes.filter((_, j) => j !== i))} className="text-red-500 text-[12px] hover:text-red-700">✕</button>
          </div>
        ))}
        <button onClick={() => onChange([...sizes, { ml: 0, price: 0 }])} className="text-[12.5px] text-[#b07a28] underline">+ Add size</button>
      </div>
    </div>
  );

  /* ── Product form ── */
  const ProductForm = ({ data, setData, isNew }: { data: ProductData; setData: (d: ProductData) => void; isNew?: boolean }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Product Name *</label>
          <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white mt-1" placeholder="e.g. Armani Code" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Inspired By</label>
          <input value={data.inspiredBy} onChange={e => setData({ ...data, inspiredBy: e.target.value })} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white mt-1" placeholder="e.g. Armani Code by Giorgio Armani" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Gender</label>
          <select value={data.gender} onChange={e => setData({ ...data, gender: e.target.value as ProductData["gender"] })} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none bg-white mt-1">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Concentration</label>
          <input value={data.concentration} onChange={e => setData({ ...data, concentration: e.target.value })} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white mt-1" placeholder="Eau de Parfum" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Family</label>
          <input value={data.family} onChange={e => setData({ ...data, family: e.target.value })} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white mt-1" placeholder="Amber Spicy" />
        </div>
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Mood / Tags</label>
        <input value={data.mood} onChange={e => setData({ ...data, mood: e.target.value })} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white mt-1" placeholder="seductive • dark • magnetic" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <NotesField label="Top Notes" value={data.top} onChange={v => setData({ ...data, top: v })} />
        <NotesField label="Heart Notes" value={data.heart} onChange={v => setData({ ...data, heart: v })} />
        <NotesField label="Base Notes" value={data.base} onChange={v => setData({ ...data, base: v })} />
      </div>

      <SizeEditor sizes={data.sizes} onChange={s => setData({ ...data, sizes: s })} />

      <div>
        <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Story / Description</label>
        <textarea value={data.story} onChange={e => setData({ ...data, story: e.target.value })} rows={3} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white mt-1 resize-none" placeholder="Write product description…" />
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Product Image</label>
        <div className="mt-1 flex items-center gap-4">
          <img src={getAdminProductImage(data)} alt="" className="w-16 h-16 rounded-xl object-cover border border-[#e0ccaa]" />
          <div className="flex-1">
            <input value={data.image} onChange={e => setData({ ...data, image: e.target.value })} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white" placeholder="Image URL or upload below" />
            <input
              ref={isNew ? fileRefNew : fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0], url => setData({ ...data, image: url })); }}
            />
            <button onClick={() => (isNew ? fileRefNew : fileRef).current?.click()} className="mt-2 text-[12.5px] text-[#b07a28] underline">Upload from device</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Rating</label>
          <input type="number" step="0.01" min="0" max="5" value={data.rating} onChange={e => setData({ ...data, rating: Number(e.target.value) })} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none bg-white mt-1" />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Reviews Count</label>
          <input type="number" value={data.reviews} onChange={e => setData({ ...data, reviews: Number(e.target.value) })} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none bg-white mt-1" />
        </div>
        <div className="flex items-end gap-3 pb-1">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" checked={data.bestseller || false} onChange={e => setData({ ...data, bestseller: e.target.checked })} className="w-4 h-4 accent-[#b07a28]" />
            Bestseller
          </label>
        </div>
        <div className="flex items-end gap-3 pb-1">
          <label className="flex items-center gap-2 text-[13px] cursor-pointer">
            <input type="checkbox" checked={data.nouveau || false} onChange={e => setData({ ...data, nouveau: e.target.checked })} className="w-4 h-4 accent-[#7b1d2a]" />
            New Arrival
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative m-auto w-[min(1100px,96vw)] h-[92vh] rounded-[24px] bg-[#faf6ef] shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#e6d2b3] flex items-center justify-between bg-[#1b1310] text-[#f6e7cc] rounded-t-[24px]">
          <div>
            <div className="text-[20px] font-[600]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>🔒 Admin Panel</div>
            <div className="text-[11.5px] text-[#c9a870] tracking-wider">Huda Essence • Full Control</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[12px] text-[#a89070]">{products.length} products</div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#2a1f16] grid place-items-center text-[#c9a870] hover:bg-[#3a2f22] transition text-[16px]">✕</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-[#e6d2b3] flex gap-2 bg-[#f5ede0]">
          {([
            ["products", `📦 Products (${products.length})`],
            ["add", "➕ Add New Product"],
            ["settings", "⚙️ Settings"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setEditIdx(null); setEditData(null); }}
              className={`px-4 py-2 rounded-xl text-[13.5px] font-[500] transition ${tab === key ? "bg-[#1b1310] text-[#f6e7cc]" : "bg-white text-[#5b4733] border border-[#e0ccaa] hover:bg-[#fff6e7]"}`}
            >{label}</button>
          ))}
        </div>

        {/* Save message */}
        {saveMsg && (
          <div className="mx-6 mt-3 px-4 py-2.5 rounded-xl bg-[#1b1310] text-[#f6e7cc] text-[13.5px] font-[500]">{saveMsg}</div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-5">

          {/* ── Products Tab ── */}
          {tab === "products" && !editData && (
            <div className="space-y-3">
              {products.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-4 bg-white rounded-2xl border border-[#ead9bf] p-3 hover:shadow-md transition">
                  <img src={getAdminProductImage(p)} alt="" className="w-[70px] h-[70px] rounded-xl object-cover shrink-0 border border-[#e8d5be]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[17px] font-[600] truncate" style={{ fontFamily: '"Cormorant Garamond", serif' }}>{p.name}</span>
                      {p.bestseller && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1b1310] text-[#f4e2c2] uppercase tracking-wider">Best</span>}
                      {p.nouveau && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#7b1d2a] text-white uppercase tracking-wider">New</span>}
                    </div>
                    <div className="text-[12px] text-[#8a7254]">{p.gender} • {p.family} • ★ {p.rating} ({p.reviews})</div>
                    <div className="text-[12px] text-[#6a5a44] mt-0.5">
                      {p.sizes.map(s => `${s.ml}ml PKR ${s.price}`).join(" • ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => moveProduct(idx, -1)} disabled={idx === 0} className="w-8 h-8 rounded-lg border border-[#e0ccaa] grid place-items-center text-[13px] disabled:opacity-30 hover:bg-[#fff6e7]">↑</button>
                    <button onClick={() => moveProduct(idx, 1)} disabled={idx === products.length - 1} className="w-8 h-8 rounded-lg border border-[#e0ccaa] grid place-items-center text-[13px] disabled:opacity-30 hover:bg-[#fff6e7]">↓</button>
                    <button onClick={() => startEdit(idx)} className="px-3 py-[7px] rounded-lg bg-[#f3e7d2] text-[#43311f] text-[12.5px] font-[600] hover:bg-[#ead5b4]">Edit</button>
                    <button
                      onClick={() => setConfirmDelete(confirmDelete === p.id ? null : p.id)}
                      className="px-3 py-[7px] rounded-lg border border-red-200 text-red-600 text-[12.5px] hover:bg-red-50"
                    >
                      {confirmDelete === p.id ? "Confirm?" : "Delete"}
                    </button>
                    {confirmDelete === p.id && (
                      <button onClick={() => deleteProduct(p.id)} className="px-3 py-[7px] rounded-lg bg-red-600 text-white text-[12.5px] font-[600]">Yes Delete</button>
                    )}
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="text-center py-16 text-[#9a8062]">
                  <div className="text-[40px] mb-3">📦</div>
                  <div>No products yet. Add your first one!</div>
                </div>
              )}
            </div>
          )}

          {/* ── Edit Product ── */}
          {tab === "products" && editData && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[22px] font-[600]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
                  Editing: {editData.name}
                </h3>
                <button onClick={() => { setEditIdx(null); setEditData(null); }} className="text-[13px] text-[#8a7254] underline">← Back to list</button>
              </div>
              <ProductForm data={editData} setData={setEditData} />
              <div className="mt-6 flex gap-3">
                <button onClick={saveEdit} className="px-6 py-3 rounded-xl bg-[#1b1310] text-[#f6e7cc] font-[600] text-[14px] hover:bg-[#2a1f16] transition">
                  💾 Save Changes
                </button>
                <button onClick={() => { setEditIdx(null); setEditData(null); }} className="px-6 py-3 rounded-xl border border-[#d8c4a0] text-[#5b4733] text-[14px]">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Add New Product ── */}
          {tab === "add" && (
            <div>
              <h3 className="text-[22px] font-[600] mb-5" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Add New Product</h3>
              <ProductForm data={newProduct} setData={setNewProduct} isNew />
              <div className="mt-6">
                <button onClick={addProduct} className="px-6 py-3 rounded-xl bg-[#1b1310] text-[#f6e7cc] font-[600] text-[14px] hover:bg-[#2a1f16] transition">
                  ➕ Add Product
                </button>
              </div>
            </div>
          )}

          {/* ── Settings ── */}
          {tab === "settings" && (
            <div className="max-w-[600px] space-y-6">
              <h3 className="text-[22px] font-[600]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Store Settings</h3>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Delivery Charge (PKR)</label>
                <input type="number" value={tempDelivery} onChange={e => setTempDelivery(Number(e.target.value))} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white mt-1" />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">WhatsApp Number (with country code, no +)</label>
                <input value={tempWA} onChange={e => setTempWA(e.target.value)} className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none focus:border-[#b89050] bg-white mt-1" placeholder="923376760760" />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600]">Bulk Price Update — Set same price for ALL products</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[10, 50, 100].map(ml => (
                    <div key={ml}>
                      <label className="text-[12px] text-[#7a6548]">{ml}ml Price (PKR)</label>
                      <input
                        type="number"
                        placeholder={`${ml}ml`}
                        id={`bulk-${ml}`}
                        className="w-full border border-[#d8c4a0] rounded-lg px-3 py-2.5 text-[13.5px] outline-none bg-white mt-1"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const p10 = Number((document.getElementById("bulk-10") as HTMLInputElement)?.value);
                    const p50 = Number((document.getElementById("bulk-50") as HTMLInputElement)?.value);
                    const p100 = Number((document.getElementById("bulk-100") as HTMLInputElement)?.value);
                    if (!p10 && !p50 && !p100) { flash("⚠ Enter at least one price"); return; }
                    const updated = products.map(p => ({
                      ...p,
                      sizes: p.sizes.map(s => {
                        if (s.ml === 10 && p10) return { ...s, price: p10 };
                        if (s.ml === 50 && p50) return { ...s, price: p50 };
                        if (s.ml === 100 && p100) return { ...s, price: p100 };
                        return s;
                      }),
                    }));
                    onSave(updated);
                    flash("✓ All product prices updated");
                  }}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-[#f3e7d2] text-[#43311f] text-[13px] font-[600] hover:bg-[#ead5b4]"
                >
                  Apply to All Products
                </button>
              </div>

              <div className="border-t border-[#e6d2b3] pt-5">
                <button
                  onClick={() => {
                    onDeliveryChange(tempDelivery);
                    onWhatsappChange(tempWA);
                    flash("✓ Settings saved");
                  }}
                  className="px-6 py-3 rounded-xl bg-[#1b1310] text-[#f6e7cc] font-[600] text-[14px] hover:bg-[#2a1f16] transition"
                >
                  💾 Save Settings
                </button>
              </div>

              <div className="border-t border-[#e6d2b3] pt-5">
                <div className="text-[11px] uppercase tracking-wider text-[#8a7a60] font-[600] mb-2">Danger Zone</div>
                <button
                  onClick={() => {
                    if (confirm("Reset ALL data to factory defaults? This cannot be undone.")) {
                      localStorage.removeItem("he_products_v2");
                      localStorage.removeItem("he_delivery");
                      localStorage.removeItem("he_whatsapp");
                      window.location.reload();
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl border border-red-300 text-red-600 text-[13px] hover:bg-red-50"
                >
                  🔄 Reset to Factory Defaults
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
