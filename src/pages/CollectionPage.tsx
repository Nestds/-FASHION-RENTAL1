import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Heart,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Check
} from 'lucide-react';
import { Category, Product, Size } from '../types';

interface Props {
  products: Product[];
  categories: Category[];
  sizes: Size[];
  favorites: string[];
  initialCategoryId?: string;
  onToggleFavorite: (productId: string) => void;
  onSelectProduct: (productId: string) => void;
}

export const CollectionPage: React.FC<Props> = ({
  products,
  categories,
  sizes,
  favorites,
  initialCategoryId = '',
  onToggleFavorite,
  onSelectProduct,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'popular' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available unique colors from products
  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.color) set.add(p.color);
    });
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (!p.isActive) return false;

        // Search match (name, code, description, color)
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matches =
            p.name.toLowerCase().includes(q) ||
            p.productCode.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.color.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category filter
        if (selectedCategory && p.categoryId !== selectedCategory) {
          return false;
        }

        // Size filter
        if (selectedSize) {
          const hasSize = p.sizes.some((s) => s.sizeId === selectedSize && s.quantity > 0);
          if (!hasSize) return false;
        }

        // Color filter
        if (selectedColor && p.color !== selectedColor) {
          return false;
        }

        // Price filter
        if (p.rentalPrice > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.rentalPrice - b.rentalPrice;
        if (sortBy === 'price-desc') return b.rentalPrice - a.rentalPrice;
        if (sortBy === 'popular') return (b.rentalCount || 0) - (a.rentalCount || 0);
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // default featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, search, selectedCategory, selectedSize, selectedColor, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedColor('');
    setMaxPrice(5000);
    setSortBy('featured');
  };

  const hasActiveFilters = Boolean(
    search || selectedCategory || selectedSize || selectedColor || maxPrice < 5000 || sortBy !== 'featured'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.25em] text-[#B26571] uppercase font-semibold">
          Haute Couture Wardrobe
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#2C2123]">
          คอลเลกชันชุดราตรีและชุดแฟชั่น
        </h1>
        <p className="text-xs sm:text-sm text-[#7E6D70] font-light">
          ค้นหาและเช่าชุดราตรีสำหรับทุกวาระโอกาสสำคัญ ตรวจสอบวันว่างและคำนวณค่าเช่าแบบเรียลไทม์
        </p>
      </div>

      {/* Top Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#EED8DC] shadow-card-soft flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#7E6D70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อชุด, รหัสชุด (DRS-), สี หรือเนื้อผ้า..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571] transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7E6D70] hover:text-[#2C2123]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 bg-[#FDF9F9] border border-[#EED8DC] text-xs font-medium text-[#2C2123] rounded-xl flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B26571]" />
            <span>ตัวกรอง ({hasActiveFilters ? 'เปิดอยู่' : 'ทั้งหมด'})</span>
          </button>

          <div className="flex items-center space-x-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#7E6D70]" />
            <span className="text-[#7E6D70] hidden sm:inline">เรียงตาม:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 pl-2.5 pr-8 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl text-xs text-[#2C2123] focus:outline-hidden focus:border-[#B26571]"
            >
              <option value="featured">ชุดแนะนำ (Featured)</option>
              <option value="price-asc">ราคาเช่า: ต่ำไปสูง</option>
              <option value="price-desc">ราคาเช่า: สูงไปต่ำ</option>
              <option value="popular">ยอดนิยมที่สุด (Popular)</option>
              <option value="newest">ชุดมาใหม่ล่าสุด (Newest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-3xl border border-[#EED8DC] shadow-card-soft h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-[#EED8DC]">
            <h3 className="text-sm font-semibold text-[#2C2123] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#B26571]" />
              ตัวกรองค้นหา
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#B26571] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                รีเซ็ต
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2C2123] uppercase tracking-wider block">
              หมวดหมู่ชุด
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition flex items-center justify-between ${
                  !selectedCategory
                    ? 'bg-[#B26571] text-white font-medium shadow-xs'
                    : 'text-[#7E6D70] hover:bg-[#FDF9F9]'
                }`}
              >
                <span>ทั้งหมด</span>
                <span>({products.filter((p) => p.isActive).length})</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.categoryId && p.isActive).length;
                return (
                  <button
                    key={cat.categoryId}
                    onClick={() => setSelectedCategory(cat.categoryId)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition flex items-center justify-between ${
                      selectedCategory === cat.categoryId
                        ? 'bg-[#B26571] text-white font-medium shadow-xs'
                        : 'text-[#7E6D70] hover:bg-[#FDF9F9]'
                    }`}
                  >
                    <span className="truncate mr-2">{cat.name}</span>
                    <span>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Filter */}
          <div className="space-y-2 pt-3 border-t border-[#EED8DC]/60">
            <label className="text-xs font-semibold text-[#2C2123] uppercase tracking-wider block">
              ขนาดไซซ์
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setSelectedSize('')}
                className={`py-1.5 text-xs rounded-xl border text-center transition ${
                  !selectedSize
                    ? 'border-[#B26571] bg-[#B26571] text-white font-medium shadow-xs'
                    : 'border-[#EED8DC] text-[#7E6D70] hover:bg-[#FDF9F9]'
                }`}
              >
                ทุกไซซ์
              </button>
              {sizes.map((s) => (
                <button
                  key={s.sizeId}
                  onClick={() => setSelectedSize(selectedSize === s.sizeId ? '' : s.sizeId)}
                  className={`py-1.5 text-xs rounded-xl border text-center transition ${
                    selectedSize === s.sizeId
                      ? 'border-[#B26571] bg-[#B26571] text-white font-medium shadow-xs'
                      : 'border-[#EED8DC] text-[#7E6D70] hover:bg-[#FDF9F9]'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Filter */}
          <div className="space-y-2 pt-3 border-t border-[#EED8DC]/60">
            <label className="text-xs font-semibold text-[#2C2123] uppercase tracking-wider block">
              โทนสี
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedColor('')}
                className={`px-2.5 py-1 text-[11px] rounded-lg border transition ${
                  !selectedColor
                    ? 'border-[#B26571] bg-[#B26571] text-white'
                    : 'border-[#EED8DC] text-[#7E6D70] hover:bg-[#FDF9F9]'
                }`}
              >
                ทุกสี
              </button>
              {availableColors.map((col) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(selectedColor === col ? '' : col)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg border transition ${
                    selectedColor === col
                      ? 'border-[#B26571] bg-[#B26571] text-white'
                      : 'border-[#EED8DC] text-[#7E6D70] hover:bg-[#FDF9F9]'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-3 border-t border-[#EED8DC]/60">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-[#2C2123] uppercase tracking-wider">
                งบค่าเช่าต่อวัน
              </label>
              <span className="font-bold text-[#B26571] tabular-nums">
                ไม่เกิน ฿{maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="5000"
              step="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#B26571]"
            />
            <div className="flex justify-between text-[10px] text-[#7E6D70]">
              <span>฿1,000</span>
              <span>฿5,000+</span>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 lg:hidden flex justify-end">
            <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#EED8DC]">
                <h3 className="text-sm font-semibold text-[#2C2123]">ตัวกรองสินค้า</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-[#7E6D70] hover:bg-[#FDF9F9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#2C2123]">หมวดหมู่</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-[#EED8DC] rounded-xl text-xs"
                >
                  <option value="">ทุกหมวดหมู่</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#2C2123]">ไซซ์</span>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full p-2 border border-[#EED8DC] rounded-xl text-xs"
                >
                  <option value="">ทุกไซซ์</option>
                  {sizes.map((s) => (
                    <option key={s.sizeId} value={s.sizeId}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#2C2123]">
                  ราคาเช่าสูงสุด: ฿{maxPrice.toLocaleString()}
                </span>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#B26571]"
                />
              </div>

              <div className="pt-4 border-t border-[#EED8DC] flex gap-2">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 py-2 text-xs border border-[#EED8DC] rounded-xl text-[#7E6D70]"
                >
                  ล้างตัวกรอง
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2 text-xs bg-[#B26571] text-white rounded-xl font-medium"
                >
                  ดูผลลัพธ์
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Result Counter & Active Tags */}
          <div className="flex items-center justify-between text-xs text-[#7E6D70]">
            <span>
              แสดง <strong>{filteredProducts.length}</strong> รายการ จากทั้งหมด {products.length} ชุด
            </span>
            {hasActiveFilters && (
              <span className="text-[#B26571] font-medium hidden sm:inline">
                ผลการค้นหาตามตัวกรอง
              </span>
            )}
          </div>

          {/* Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const isFav = favorites.includes(product.productId);
                return (
                  <div
                    key={product.productId}
                    className="group bg-white rounded-3xl overflow-hidden border border-[#EED8DC]/80 shadow-card-soft hover:shadow-rose-glow transition duration-300 flex flex-col"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-3/4 overflow-hidden bg-[#FAF5F6]">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.isBestSeller && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#B26571] text-white shadow-xs">
                            Best Seller
                          </span>
                        )}
                        {product.isNewArrival && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#D48C95] text-white shadow-xs">
                            New In
                          </span>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(product.productId);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#2C2123] flex items-center justify-center transition shadow-md"
                      >
                        <Heart
                          className={`w-4 h-4 transition ${
                            isFav ? 'fill-rose-500 text-rose-500' : 'text-[#7E6D70]'
                          }`}
                        />
                      </button>

                      {/* Quick View Button */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex gap-2">
                        <button
                          onClick={() => onSelectProduct(product.productId)}
                          className="w-full py-2.5 bg-white text-[#2C2123] text-xs font-semibold rounded-xl hover:bg-[#B26571] hover:text-white transition shadow-md"
                        >
                          ดูรายละเอียดชุด & จองวันว่าง
                        </button>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-[#7E6D70]">
                          <span className="font-mono">{product.productCode}</span>
                          <span className="font-medium text-[#B26571]">{product.color}</span>
                        </div>
                        <h3
                          onClick={() => onSelectProduct(product.productId)}
                          className="font-serif-luxury text-lg font-semibold text-[#2C2123] hover:text-[#B26571] cursor-pointer line-clamp-1 mt-0.5 transition"
                        >
                          {product.name}
                        </h3>
                      </div>

                      {/* Available sizes pills */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {product.sizes.map((s) => (
                          <span
                            key={s.sizeId}
                            className={`text-[10px] px-2 py-0.5 rounded-md border ${
                              s.quantity > 0
                                ? 'bg-[#FDF9F9] border-[#EED8DC] text-[#2C2123]'
                                : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                            }`}
                          >
                            {s.sizeName} ({s.quantity})
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-[#EED8DC]/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#7E6D70] block">
                            มัดจำ ฿{product.depositPrice.toLocaleString()}
                          </span>
                          <span className="text-base font-bold text-[#B26571] tabular-nums">
                            ฿{product.rentalPrice.toLocaleString()}
                            <span className="text-xs font-normal text-[#7E6D70]"> / วัน</span>
                          </span>
                        </div>

                        <button
                          onClick={() => onSelectProduct(product.productId)}
                          className="px-3.5 py-1.5 rounded-xl border border-[#B26571] text-[#B26571] text-xs font-medium hover:bg-[#B26571] hover:text-white transition shadow-2xs"
                        >
                          จองชุด
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center bg-white rounded-3xl border border-[#EED8DC] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF5F6] flex items-center justify-center mx-auto text-[#B26571]">
                <Search className="w-8 h-8 opacity-40" />
              </div>
              <h3 className="font-serif-luxury text-xl font-semibold text-[#2C2123]">
                ไม่พบชุดที่ตรงกับเงื่อนไขการค้นหา
              </h3>
              <p className="text-xs text-[#7E6D70] max-w-sm mx-auto leading-relaxed">
                ลองปรับเปลี่ยนคำค้นหา ขยายช่วงราคา หรือเลือกหมวดหมู่อื่นเพื่อค้นหาชุดราตรีที่คุณต้องการ
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#B26571] text-white text-xs font-medium rounded-full hover:bg-[#8F4954] transition shadow-xs"
              >
                ล้างตัวกรองทั้งหมด
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
