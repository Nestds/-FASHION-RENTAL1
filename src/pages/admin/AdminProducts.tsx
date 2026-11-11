import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
  Check,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Sparkles,
  Layers,
  Ruler,
  Image as ImageIcon,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Product, Category, Size } from '../../types';
import { store } from '../../services/store';

interface Props {
  products: Product[];
  categories: Category[];
  sizes: Size[];
  initialOpenAdd?: boolean;
}

export const AdminProducts: React.FC<Props> = ({ products, categories, sizes, initialOpenAdd = false }) => {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'categories' | 'sizes'>('products');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Product modal
  const [productModalOpen, setProductModalOpen] = useState(initialOpenAdd);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImageUrl, setCatImageUrl] = useState('');

  // Size modal
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);
  const [sizeName, setSizeName] = useState('');
  const [sizeBust, setSizeBust] = useState('');
  const [sizeWaist, setSizeWaist] = useState('');
  const [sizeHip, setSizeHip] = useState('');

  // Product Form state
  const [productCode, setProductCode] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.categoryId || '');
  const [color, setColor] = useState('');
  const [rentalPrice, setRentalPrice] = useState<number>(1800);
  const [depositPrice, setDepositPrice] = useState<number>(3000);
  const [fabric, setFabric] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Quantities per size
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>({
    'size-xs': 1,
    'size-s': 2,
    'size-m': 2,
    'size-l': 1,
    'size-xl': 0,
  });

  // Handler for opening Add Product
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductCode(`DRS-GOWN-0${products.length + 1}`);
    setName('');
    setCategoryId(categories[0]?.categoryId || '');
    setColor('Rose Champagne');
    setRentalPrice(1800);
    setDepositPrice(3000);
    setFabric('Silk Chiffon & French Crepe');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80');
    setIsActive(true);
    const qMap: Record<string, number> = {};
    sizes.forEach((s) => {
      qMap[s.sizeId] = 2;
    });
    setSizeQuantities(qMap);
    setProductModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setProductCode(p.productCode);
    setName(p.name);
    setCategoryId(p.categoryId);
    setColor(p.color);
    setRentalPrice(p.rentalPrice);
    setDepositPrice(p.depositPrice);
    setFabric(p.fabric || '');
    setDescription(p.description);
    setImageUrl(p.images[0] || '');
    setIsActive(p.isActive);

    const qMap: Record<string, number> = {};
    sizes.forEach((s) => {
      const found = p.sizes.find((ps) => ps.sizeId === s.sizeId);
      qMap[s.sizeId] = found ? found.quantity : 0;
    });
    setSizeQuantities(qMap);
    setProductModalOpen(true);
  };

  const handleDelete = (productId: string, name: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบชุด "${name}" ออกจากระบบ?`)) {
      store.deleteProduct(productId);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !productCode.trim() || !imageUrl.trim()) {
      alert('กรุณากรอกชื่อชุด รหัสชุด และลิงก์รูปภาพให้ครบถ้วน');
      return;
    }

    const catObj = categories.find((c) => c.categoryId === categoryId);

    const sizesArray = sizes.map((s) => ({
      sizeId: s.sizeId,
      sizeName: s.name,
      quantity: Number(sizeQuantities[s.sizeId] || 0),
    }));

    if (editingProduct) {
      store.updateProduct(editingProduct.productId, {
        productCode: productCode.trim(),
        name: name.trim(),
        categoryId,
        categoryName: catObj?.name,
        color: color.trim(),
        rentalPrice: Number(rentalPrice),
        depositPrice: Number(depositPrice),
        fabric: fabric.trim(),
        description: description.trim(),
        images: [imageUrl.trim()],
        isActive,
        sizes: sizesArray,
      });
      alert('บันทึกการแก้ไขข้อมูลชุดเรียบร้อยแล้ว');
    } else {
      store.addProduct({
        productCode: productCode.trim(),
        name: name.trim(),
        categoryId,
        categoryName: catObj?.name,
        color: color.trim(),
        rentalPrice: Number(rentalPrice),
        depositPrice: Number(depositPrice),
        fabric: fabric.trim(),
        description: description.trim(),
        images: [imageUrl.trim()],
        isActive,
        sizes: sizesArray,
      });
      alert('เพิ่มชุดใหม่ลงในระบบเรียบร้อยแล้ว');
    }

    setProductModalOpen(false);
  };

  // Category Actions
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDescription('');
    setCatImageUrl('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80');
    setCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCatName(c.name);
    setCatDescription(c.description || '');
    setCatImageUrl(c.imageUrl || '');
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) {
      alert('กรุณาระบุชื่อหมวดหมู่');
      return;
    }
    if (editingCategory) {
      store.updateCategory(editingCategory.categoryId, {
        name: catName.trim(),
        description: catDescription.trim(),
        imageUrl: catImageUrl.trim(),
      });
      alert('แก้ไขหมวดหมู่สำเร็จ');
    } else {
      store.addCategory({
        name: catName.trim(),
        description: catDescription.trim(),
        imageUrl: catImageUrl.trim(),
        isActive: true,
      });
      alert('เพิ่มหมวดหมู่ใหม่สำเร็จ');
    }
    setCategoryModalOpen(false);
  };

  const handleDeleteCategory = (categoryId: string, name: string) => {
    if (confirm(`คุณต้องการลบหมวดหมู่ "${name}" หรือไม่?`)) {
      store.deleteCategory(categoryId);
    }
  };

  // Size Actions
  const handleOpenAddSize = () => {
    setEditingSize(null);
    setSizeName('');
    setSizeBust('32-34');
    setSizeWaist('24-26');
    setSizeHip('35-37');
    setSizeModalOpen(true);
  };

  const handleOpenEditSize = (s: Size) => {
    setEditingSize(s);
    setSizeName(s.name);
    setSizeBust(s.bust || '');
    setSizeWaist(s.waist || '');
    setSizeHip(s.hip || '');
    setSizeModalOpen(true);
  };

  const handleSaveSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sizeName.trim()) {
      alert('กรุณาระบุชื่อไซซ์');
      return;
    }
    if (editingSize) {
      store.updateSize(editingSize.sizeId, {
        name: sizeName.trim(),
        description: `ขนาดมาตรฐานสำหรับสัดส่วน อก ${sizeBust} นิ้ว เอว ${sizeWaist} นิ้ว สะโพก ${sizeHip} นิ้ว`,
        bust: sizeBust.trim(),
        waist: sizeWaist.trim(),
        hip: sizeHip.trim(),
      });
      alert('แก้ไขข้อมูลไซซ์สำเร็จ');
    } else {
      store.addSize({
        name: sizeName.trim(),
        description: `ขนาดมาตรฐานสำหรับสัดส่วน อก ${sizeBust} นิ้ว เอว ${sizeWaist} นิ้ว สะโพก ${sizeHip} นิ้ว`,
        bust: sizeBust.trim(),
        waist: sizeWaist.trim(),
        hip: sizeHip.trim(),
      });
      alert('เพิ่มไซซ์ใหม่สำเร็จ');
    }
    setSizeModalOpen(false);
  };

  const handleDeleteSize = (sizeId: string, name: string) => {
    if (confirm(`คุณต้องการลบไซซ์ "${name}" หรือไม่?`)) {
      store.deleteSize(sizeId);
    }
  };

  const filtered = products.filter((p) => {
    if (categoryFilter && p.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.productCode.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Banner with Action Callout */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EED8DC] shadow-card-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#B26571] uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>Product & Inventory Management</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2123]">
            จัดการสินค้าและคลังชุดราตรี
          </h2>
          <p className="text-xs text-[#7E6D70] mt-1 max-w-xl">
            คุณสามารถเพิ่มชุดใหม่ แก้ไขรายละเอียด กำหนดสต็อกแต่ละไซซ์ ค่าเช่าต่อวัน และเงินประกัน รวมถึงจัดการหมวดหมู่และตารางไซซ์ของร้าน
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={handleOpenAdd}
            className="px-6 py-3.5 bg-gradient-to-r from-[#B26571] to-[#8F4954] hover:from-[#8F4954] hover:to-[#782834] text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-rose-glow flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ เพิ่มสินค้าใหม่ (Add Product)</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Products / Categories / Sizes */}
      <div className="flex border-b border-[#EED8DC] gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeSubTab === 'products'
              ? 'border-[#B26571] text-[#B26571]'
              : 'border-transparent text-[#7E6D70] hover:text-[#2C2123]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>รายการชุดในร้าน ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeSubTab === 'categories'
              ? 'border-[#B26571] text-[#B26571]'
              : 'border-transparent text-[#7E6D70] hover:text-[#2C2123]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>หมวดหมู่สินค้า ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sizes')}
          className={`pb-3 px-4 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer ${
            activeSubTab === 'sizes'
              ? 'border-[#B26571] text-[#B26571]'
              : 'border-transparent text-[#7E6D70] hover:text-[#2C2123]'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>ตารางไซซ์มาตรฐาน ({sizes.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: PRODUCTS ================= */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#EED8DC] shadow-card-soft flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#7E6D70] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาชื่อชุด, รหัสสินค้า, โทนสี..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
              />
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <span className="text-xs text-[#7E6D70] hidden sm:inline">หมวดหมู่:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-2 px-3 text-xs bg-[#FDF9F9] border border-[#EED8DC] rounded-xl text-[#2C2123] focus:outline-hidden focus:border-[#B26571]"
              >
                <option value="">ทุกหมวดหมู่ ({products.length} ชุด)</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-[#EED8DC] shadow-card-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FDF9F9] text-[#B26571] border-b border-[#EED8DC]">
                    <th className="py-3.5 px-4 font-semibold">รูปภาพ & รหัสชุด</th>
                    <th className="py-3.5 px-4 font-semibold">ชื่อชุดราตรี</th>
                    <th className="py-3.5 px-4 font-semibold">หมวดหมู่ & สี</th>
                    <th className="py-3.5 px-4 font-semibold">สต็อกไซซ์</th>
                    <th className="py-3.5 px-4 font-semibold">ค่าเช่า / ประกัน</th>
                    <th className="py-3.5 px-4 font-semibold">สถานะ</th>
                    <th className="py-3.5 px-4 font-semibold text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EED8DC]/60">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-[#7E6D70]">
                        <Package className="w-8 h-8 text-[#EED8DC] mx-auto mb-2" />
                        <p>ไม่พบสินค้าตรงตามเงื่อนไขที่ค้นหา</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => {
                      const totalStock = p.sizes.reduce((sum, s) => sum + s.quantity, 0);
                      return (
                        <tr key={p.productId} className="hover:bg-[#FDF9F9]/60 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt=""
                                className="w-10 aspect-3/4 object-cover rounded-lg border border-[#EED8DC] shrink-0"
                              />
                              <span className="font-mono font-bold text-[#B26571]">{p.productCode}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-[#2C2123] line-clamp-1">{p.name}</span>
                            <span className="text-[10px] text-[#7E6D70] block line-clamp-1">{p.fabric}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[#2C2123] block font-medium">{p.categoryName || 'Evening Gown'}</span>
                            <span className="text-[10px] text-[#7E6D70]">{p.color}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1 flex-wrap">
                              {p.sizes.map((s) => (
                                <span
                                  key={s.sizeId}
                                  className={`px-1.5 py-0.5 rounded text-[10px] border ${
                                    s.quantity > 0
                                      ? 'bg-white border-[#EED8DC] text-[#2C2123]'
                                      : 'bg-gray-100 border-gray-200 text-gray-400'
                                  }`}
                                >
                                  {s.sizeName}:{s.quantity}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] text-[#7E6D70] block mt-0.5">รวม {totalStock} ชุด</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-[#B26571] block">฿{p.rentalPrice.toLocaleString()}/วัน</span>
                            <span className="text-[10px] text-[#7E6D70]">ประกัน ฿{p.depositPrice.toLocaleString()}</span>
                          </td>
                          <td className="py-3 px-4">
                            {p.isActive ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                เปิดให้เช่า
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600">
                                ปิดชั่วคราว
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEdit(p)}
                                className="px-2.5 py-1.5 rounded-lg text-[#B26571] hover:bg-[#FDF9F9] border border-[#EED8DC] text-[11px] font-medium transition flex items-center gap-1 cursor-pointer"
                                title="แก้ไขสินค้า"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>แก้ไข</span>
                              </button>
                              <button
                                onClick={() => handleDelete(p.productId, p.name)}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                                title="ลบสินค้า"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: CATEGORIES ================= */}
      {activeSubTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#2C2123]">หมวดหมู่สินค้า</h3>
              <p className="text-xs text-[#7E6D70]">หมวดหมู่ที่ใช้แบ่งประเภทชุดราตรีในหน้าร้าน</p>
            </div>
            <button
              onClick={handleOpenAddCategory}
              className="px-4 py-2 bg-[#B26571] hover:bg-[#8F4954] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มหมวดหมู่ใหม่</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => {
              const dressCount = products.filter((p) => p.categoryId === c.categoryId).length;
              return (
                <div
                  key={c.categoryId}
                  className="bg-white rounded-3xl border border-[#EED8DC] overflow-hidden shadow-card-soft flex flex-col justify-between"
                >
                  <div>
                    {c.imageUrl && (
                      <div className="h-40 overflow-hidden relative">
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs rounded-full text-[10px] font-bold text-[#B26571]">
                          {dressCount} ชุดในหมวดนี้
                        </div>
                      </div>
                    )}
                    <div className="p-5 space-y-2">
                      <h4 className="font-serif-luxury text-lg font-bold text-[#2C2123]">{c.name}</h4>
                      <p className="text-xs text-[#7E6D70] line-clamp-2">{c.description || 'ไม่มีคำอธิบาย'}</p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-[#EED8DC]/60 flex items-center justify-end gap-2 bg-[#FDF9F9]/40">
                    <button
                      onClick={() => handleOpenEditCategory(c)}
                      className="px-3 py-1.5 rounded-lg border border-[#EED8DC] text-[#B26571] hover:bg-[#F7ECEE] text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.categoryId, c.name)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      title="ลบหมวดหมู่"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: SIZES ================= */}
      {activeSubTab === 'sizes' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#2C2123]">ตารางไซซ์มาตรฐานของร้าน</h3>
              <p className="text-xs text-[#7E6D70]">ขนาดสัดส่วน (รอบอก, เอว, สะโพก) ที่ลูกค้าสามารถเลือกดูในตารางไซซ์</p>
            </div>
            <button
              onClick={handleOpenAddSize}
              className="px-4 py-2 bg-[#B26571] hover:bg-[#8F4954] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มไซซ์ใหม่</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#EED8DC] shadow-card-soft overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FDF9F9] text-[#B26571] border-b border-[#EED8DC]">
                  <th className="py-3.5 px-4 font-semibold">รหัสไซซ์</th>
                  <th className="py-3.5 px-4 font-semibold">ชื่อไซซ์</th>
                  <th className="py-3.5 px-4 font-semibold">รอบอก (Bust)</th>
                  <th className="py-3.5 px-4 font-semibold">รอบเอว (Waist)</th>
                  <th className="py-3.5 px-4 font-semibold">สะโพก (Hip)</th>
                  <th className="py-3.5 px-4 font-semibold text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EED8DC]/60">
                {sizes.map((s) => (
                  <tr key={s.sizeId} className="hover:bg-[#FDF9F9]/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#B26571]">{s.sizeId}</td>
                    <td className="py-3 px-4 font-bold text-[#2C2123]">{s.name}</td>
                    <td className="py-3 px-4 text-[#7E6D70]">{s.bust} นิ้ว</td>
                    <td className="py-3 px-4 text-[#7E6D70]">{s.waist} นิ้ว</td>
                    <td className="py-3 px-4 text-[#7E6D70]">{s.hip} นิ้ว</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditSize(s)}
                          className="px-2.5 py-1.5 rounded-lg text-[#B26571] hover:bg-[#FDF9F9] border border-[#EED8DC] text-[11px] font-medium transition flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>แก้ไข</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSize(s.sizeId, s.name)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PRODUCT ================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-[#EED8DC] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EED8DC] pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#B26571] uppercase tracking-wider block">
                  {editingProduct ? 'Update Product' : 'Create New Product'}
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2C2123]">
                  {editingProduct ? 'แก้ไขข้อมูลชุดราตรี' : 'เพิ่มชุดราตรีใหม่เข้าสู่ระบบ'}
                </h3>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1 rounded-full text-[#7E6D70] hover:bg-[#FDF9F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#2C2123] font-medium mb-1">รหัสชุด (Product Code) *</label>
                  <input
                    type="text"
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="เช่น DRS-GOWN-05"
                    className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl font-mono uppercase focus:outline-hidden focus:border-[#B26571]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C2123] font-medium mb-1">หมวดหมู่ชุด *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                  >
                    {categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#2C2123] font-medium mb-1">ชื่อชุดราตรี (Product Name) *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น The Aurelia Champagne Silk Gown"
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#2C2123] font-medium mb-1">โทนสี (Color)</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="เช่น Champagne Gold"
                    className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C2123] font-medium mb-1">ราคาเช่าต่อวัน (THB) *</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl font-bold text-[#B26571] focus:outline-hidden focus:border-[#B26571]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C2123] font-medium mb-1">เงินประกันความเสียหาย (THB) *</label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={depositPrice}
                    onChange={(e) => setDepositPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl font-bold text-[#2C2123] focus:outline-hidden focus:border-[#B26571]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#2C2123] font-medium mb-1">เนื้อผ้า / การตัดเย็บ</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="เช่น Silk Chiffon with Boned Corset"
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                />
              </div>

              {/* Stock per Size */}
              <div className="p-4 bg-[#FDF9F9] rounded-2xl border border-[#EED8DC] space-y-2">
                <label className="block text-xs font-semibold text-[#2C2123] uppercase tracking-wider">
                  จำนวนชุดคงเหลือในคลัง แยกตามไซซ์ (Stock Quantity)
                </label>
                <p className="text-[11px] text-[#7E6D70]">
                  กำหนดจำนวนสต็อกชุดที่มีพร้อมให้เช่าในแต่ละไซซ์
                </p>
                <div className="grid grid-cols-5 gap-2 pt-2">
                  {sizes.map((s) => (
                    <div key={s.sizeId} className="space-y-1 text-center bg-white p-2.5 rounded-xl border border-[#EED8DC]">
                      <span className="font-bold text-[11px] text-[#B26571]">{s.name}</span>
                      <input
                        type="number"
                        min="0"
                        value={sizeQuantities[s.sizeId] !== undefined ? sizeQuantities[s.sizeId] : 0}
                        onChange={(e) =>
                          setSizeQuantities({
                            ...sizeQuantities,
                            [s.sizeId]: Math.max(0, parseInt(e.target.value) || 0),
                          })
                        }
                        className="w-full p-1.5 text-center bg-[#FDF9F9] border border-[#EED8DC] rounded-lg font-bold text-[#2C2123]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#2C2123] font-medium mb-1">URL รูปภาพหลักของชุด *</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                />
                {imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-14 aspect-3/4 object-cover rounded-lg border border-[#EED8DC]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <span className="text-[11px] text-emerald-700">✓ แสดงตัวอย่างรูปภาพชุด</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#2C2123] font-medium mb-1">รายละเอียดสินค้า (Description)</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="คำอธิบายจุดเด่นของชุด คัตติ้ง และโอกาสที่เหมาะสมในการสวมใส่..."
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-[#B26571] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-[#2C2123] font-medium cursor-pointer">
                  เปิดให้ลูกค้าจองเช่าชุดนี้ในหน้า Collection (Active Status)
                </label>
              </div>

              <div className="pt-4 border-t border-[#EED8DC] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-[#EED8DC] rounded-xl text-[#7E6D70] hover:bg-[#FDF9F9] cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#B26571] hover:bg-[#8F4954] text-white rounded-xl font-bold shadow-md cursor-pointer transition"
                >
                  {editingProduct ? 'บันทึกการแก้ไข' : 'บันทึกและเพิ่มชุดลงระบบ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT CATEGORY ================= */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-[#EED8DC] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EED8DC] pb-3">
              <h3 className="font-serif-luxury text-lg font-bold text-[#2C2123]">
                {editingCategory ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
              </h3>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-1 rounded-full text-[#7E6D70] hover:bg-[#FDF9F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#2C2123] font-medium mb-1">ชื่อหมวดหมู่ (Category Name) *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="เช่น Evening Gowns, Cocktail Dresses..."
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                />
              </div>

              <div>
                <label className="block text-[#2C2123] font-medium mb-1">คำอธิบายหมวดหมู่</label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  placeholder="รายละเอียดสั้นๆ เกี่ยวกับหมวดหมู่นี้..."
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                />
              </div>

              <div>
                <label className="block text-[#2C2123] font-medium mb-1">URL รูปภาพหมวดหมู่</label>
                <input
                  type="url"
                  value={catImageUrl}
                  onChange={(e) => setCatImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                />
              </div>

              <div className="pt-3 border-t border-[#EED8DC] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 border border-[#EED8DC] rounded-xl text-[#7E6D70]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B26571] hover:bg-[#8F4954] text-white rounded-xl font-bold"
                >
                  {editingCategory ? 'บันทึก' : 'เพิ่มหมวดหมู่'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT SIZE ================= */}
      {sizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl border border-[#EED8DC] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#EED8DC] pb-3">
              <h3 className="font-serif-luxury text-lg font-bold text-[#2C2123]">
                {editingSize ? 'แก้ไขไซซ์' : 'เพิ่มไซซ์ใหม่'}
              </h3>
              <button
                onClick={() => setSizeModalOpen(false)}
                className="p-1 rounded-full text-[#7E6D70] hover:bg-[#FDF9F9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSize} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#2C2123] font-medium mb-1">ชื่อไซซ์ (Size Name) *</label>
                <input
                  type="text"
                  value={sizeName}
                  onChange={(e) => setSizeName(e.target.value)}
                  placeholder="เช่น XS, S, M, L, XL, Free Size"
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[#2C2123] font-medium mb-1">อก (นิ้ว)</label>
                  <input
                    type="text"
                    value={sizeBust}
                    onChange={(e) => setSizeBust(e.target.value)}
                    placeholder="32-34"
                    className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl text-center focus:outline-hidden focus:border-[#B26571]"
                  />
                </div>
                <div>
                  <label className="block text-[#2C2123] font-medium mb-1">เอว (นิ้ว)</label>
                  <input
                    type="text"
                    value={sizeWaist}
                    onChange={(e) => setSizeWaist(e.target.value)}
                    placeholder="24-26"
                    className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl text-center focus:outline-hidden focus:border-[#B26571]"
                  />
                </div>
                <div>
                  <label className="block text-[#2C2123] font-medium mb-1">สะโพก (นิ้ว)</label>
                  <input
                    type="text"
                    value={sizeHip}
                    onChange={(e) => setSizeHip(e.target.value)}
                    placeholder="35-37"
                    className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl text-center focus:outline-hidden focus:border-[#B26571]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#EED8DC] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSizeModalOpen(false)}
                  className="px-4 py-2 border border-[#EED8DC] rounded-xl text-[#7E6D70]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B26571] hover:bg-[#8F4954] text-white rounded-xl font-bold"
                >
                  {editingSize ? 'บันทึก' : 'เพิ่มไซซ์'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
