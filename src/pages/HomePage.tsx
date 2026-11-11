import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Heart,
  Star,
  CheckCircle,
  Truck,
  Scissors,
  Tag,
  Copy,
  Check
} from 'lucide-react';
import { Category, Product, Promotion, Review } from '../types';

interface Props {
  categories: Category[];
  products: Product[];
  promotions: Promotion[];
  reviews: Review[];
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onNavigate: (path: string, params?: Record<string, any>) => void;
  onSelectProduct: (productId: string) => void;
}

export const HomePage: React.FC<Props> = ({
  categories,
  products,
  promotions,
  reviews,
  favorites,
  onToggleFavorite,
  onNavigate,
  onSelectProduct,
}) => {
  const [activeTab, setActiveTab] = useState<'featured' | 'newArrivals' | 'bestSellers'>('featured');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const featuredDresses = products.filter((p) => p.featured && p.isActive);
  const newArrivalDresses = products.filter((p) => p.isNewArrival && p.isActive);
  const bestSellerDresses = products.filter((p) => p.isBestSeller && p.isActive);

  const displayedProducts =
    activeTab === 'featured'
      ? featuredDresses
      : activeTab === 'newArrivals'
      ? newArrivalDresses
      : bestSellerDresses;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. LUXURY EDITORIAL HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF4F5] via-[#FDF9F9] to-[#FAF5F6] border-b border-[#EED8DC]/60 pt-10 pb-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-white border border-[#EED8DC] text-xs tracking-[0.2em] uppercase text-[#B26571] font-medium shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D48C95]" />
                <span>Haute Couture & Evening Dress Rental</span>
              </div>

              <div className="space-y-4">
                <h1 className="font-serif-luxury text-4xl sm:text-6xl lg:text-7xl font-normal tracking-[0.03em] leading-[1.08] text-[#2C2123] text-balance">
                  FIND YOUR <br />
                  <span className="italic font-light text-[#B26571]">PERFECT DRESS</span>
                </h1>
                <p className="max-w-xl text-sm sm:text-base font-light text-[#7E6D70] leading-relaxed tracking-wide">
                  สัมผัสประสบการณ์เช่าชุดราตรีระดับโอต์กูตูร์ คัดสรรเนื้อผ้าไหมซาตินและลูกไม้ฝรั่งเศสชั้นเลิศ พร้อมบริการลองชุด ปรับสรีระ และจัดส่งพรีเมียมถึงหน้าบ้านทั่วประเทศ
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('collection')}
                  className="px-8 py-4 rounded-full bg-[#B26571] hover:bg-[#8F4954] text-white text-xs tracking-widest uppercase font-semibold transition duration-300 shadow-rose-glow flex items-center justify-center gap-3 group"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-300" />
                </button>

                <button
                  onClick={() => onNavigate('contact')}
                  className="px-8 py-4 rounded-full bg-white hover:bg-[#F7ECEE] text-[#2C2123] border border-[#EED8DC] text-xs tracking-widest uppercase font-medium transition duration-300 flex items-center justify-center shadow-xs"
                >
                  จองคิวลองชุดที่โชว์รูม
                </button>
              </div>

              {/* Micro Trust Indicators (Clean unboxed text) */}
              <div className="pt-8 border-t border-[#EED8DC]/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#7E6D70] font-light">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#B26571] shrink-0" />
                  <span>ซักแห้งพรีเมียมฟรี</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#B26571] shrink-0" />
                  <span>คืนเงินประกันใน 24 ชม.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-[#B26571] shrink-0" />
                  <span>ปรับเก็บทรงชั่วคราว</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B26571] shrink-0" />
                  <span>จัดส่งด่วนทั่วไทย</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Imagery (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image */}
                <div className="aspect-3/4 rounded-3xl overflow-hidden shadow-rose-glow border-4 border-white bg-[#FDF4F5]">
                  <img
                    src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85"
                    alt="DRESSÉ Haute Couture"
                    className="w-full h-full object-cover object-top hover:scale-105 transition duration-700 ease-out"
                  />
                </div>

                {/* Floating Chic Testimonial Tag */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-[#EED8DC] max-w-[260px] hidden sm:block">
                  <div className="flex items-center gap-1 text-[#D48C95] mb-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-[#2C2123] line-clamp-2">
                    "ชุดผ้าไหมสีแชมเปญสวยสง่ามาก คัตติ้งเนี้ยบระดับโอต์กูตูร์"
                  </p>
                  <span className="text-[10px] text-[#B26571] font-medium block mt-1">
                    คุณพัชริดา · งานกาล่าดินเนอร์
                  </span>
                </div>

                {/* Floating Best Seller Badge */}
                <div className="absolute top-6 -right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-[#EED8DC] text-xs font-semibold text-[#B26571] flex items-center gap-2 hidden sm:flex">
                  <Sparkles className="w-3.5 h-3.5 text-[#D48C95]" />
                  <span>คอลเลกชันใหม่ล่าสุด 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED CATEGORIES SHOWCASE */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs tracking-[0.25em] text-[#B26571] uppercase font-semibold">
            Curated Categories
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#2C2123]">
            หมวดหมู่ชุดยอดนิยม
          </h2>
          <div className="w-12 h-0.5 bg-[#B26571] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.categoryId}
              onClick={() => onNavigate('collection', { categoryId: cat.categoryId })}
              className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-card-soft border border-[#EED8DC]/60 bg-white"
            >
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C2123]/85 via-[#2C2123]/30 to-transparent"></div>

              <div className="absolute inset-x-0 bottom-0 p-7 text-white space-y-2">
                <span className="text-[11px] tracking-widest text-[#FAD5DA] uppercase font-medium">
                  {cat.itemCount || 3} ชุดพร้อมให้บริการ
                </span>
                <h3 className="font-serif-luxury text-2xl font-semibold group-hover:text-[#FAD5DA] transition">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#FFF5F6]/85 line-clamp-2 font-light">
                  {cat.description}
                </p>
                <div className="pt-2 flex items-center text-xs text-[#FAD5DA] font-medium group-hover:translate-x-1.5 transition duration-300">
                  <span>เลือกชมชุด</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE WARDROBE (FEATURED / NEW / BEST SELLERS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-[#EED8DC] pb-5 gap-4">
          <div>
            <span className="text-xs tracking-[0.25em] text-[#B26571] uppercase font-semibold">
              The Collection
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2C2123]">
              คอลเลกชันชุดราตรีแนะนำ
            </h2>
          </div>

          {/* Interactive Filter Tabs (Zero-pill compliant segmented control) */}
          <div className="flex items-center space-x-1 bg-[#FDF4F5] p-1.5 rounded-full border border-[#EED8DC] shadow-2xs">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                activeTab === 'featured'
                  ? 'bg-[#B26571] text-white shadow-xs'
                  : 'text-[#7E6D70] hover:text-[#2C2123]'
              }`}
            >
              Featured Dresses
            </button>
            <button
              onClick={() => setActiveTab('newArrivals')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                activeTab === 'newArrivals'
                  ? 'bg-[#B26571] text-white shadow-xs'
                  : 'text-[#7E6D70] hover:text-[#2C2123]'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('bestSellers')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition ${
                activeTab === 'bestSellers'
                  ? 'bg-[#B26571] text-white shadow-xs'
                  : 'text-[#7E6D70] hover:text-[#2C2123]'
              }`}
            >
              Best Sellers
            </button>
          </div>
        </div>

        {/* Product Cards Grid - Clean 4-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {displayedProducts.map((product) => {
            const isFav = favorites.includes(product.productId);
            return (
              <div
                key={product.productId}
                className="group bg-white rounded-3xl overflow-hidden border border-[#EED8DC]/80 shadow-card-soft hover:shadow-rose-glow transition duration-300 flex flex-col"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-3/4 overflow-hidden bg-[#FAF5F6]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />

                  {/* Clean unboxed status markers */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.isBestSeller && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#B26571] text-white shadow-xs">
                        Best Seller
                      </span>
                    )}
                    {product.isNewArrival && (
                      <span className="px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#D48C95] text-white shadow-xs">
                        New In
                      </span>
                    )}
                  </div>

                  {/* Favorite Toggle Button */}
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

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex gap-2">
                    <button
                      onClick={() => onSelectProduct(product.productId)}
                      className="w-full py-2.5 bg-white text-[#2C2123] text-xs font-semibold rounded-xl hover:bg-[#B26571] hover:text-white transition shadow-md"
                    >
                      ดูรายละเอียด & ตรวจวันว่าง
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase text-[#7E6D70] font-medium block">
                      {product.productCode} · {product.color}
                    </span>
                    <h4
                      onClick={() => onSelectProduct(product.productId)}
                      className="font-serif-luxury text-lg font-semibold text-[#2C2123] hover:text-[#B26571] cursor-pointer line-clamp-1 mt-0.5 transition"
                    >
                      {product.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {product.sizes.map((s) => (
                      <span
                        key={s.sizeId}
                        className="text-[10px] px-2 py-0.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-md text-[#7E6D70]"
                      >
                        {s.sizeName} ({s.quantity})
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#EED8DC]/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#7E6D70] block">ราคาเช่าเริ่มต้น</span>
                      <span className="text-base font-bold text-[#B26571] tabular-nums">
                        ฿{product.rentalPrice.toLocaleString()}
                        <span className="text-xs font-normal text-[#7E6D70]"> / วัน</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectProduct(product.productId)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#B26571] text-[#B26571] text-xs font-medium hover:bg-[#B26571] hover:text-white transition"
                    >
                      เช่าชุดนี้
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => onNavigate('collection')}
            className="px-8 py-3.5 rounded-full border border-[#B26571] text-[#B26571] hover:bg-[#B26571] hover:text-white text-xs tracking-wider uppercase font-semibold transition duration-300 shadow-xs"
          >
            ดูชุดทั้งหมดในคอลเลกชัน (All Dresses)
          </button>
        </div>
      </section>

      {/* 4. SPECIAL PROMOTIONS (Luxury Rose Theme) */}
      <section className="bg-gradient-to-r from-[#FDF4F5] via-[#FAF0F2] to-[#FDF4F5] py-16 border-y border-[#EED8DC]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs tracking-[0.25em] text-[#B26571] uppercase font-semibold">
              Special Privileges
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2C2123]">
              โปรโมชั่นพิเศษประจำเดือน
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.promotionId}
                className="bg-white rounded-3xl p-6 border border-[#EED8DC] shadow-card-soft flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 rounded-2xl bg-[#F7ECEE] text-[#B26571]">
                      <Tag className="w-5 h-5" />
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <h4 className="font-serif-luxury text-xl font-bold text-[#2C2123]">
                    {promo.name}
                  </h4>
                  <p className="text-xs text-[#7E6D70] leading-relaxed">
                    {promo.discountType === 'percentage'
                      ? `รับส่วนลดทันที ${promo.discountValue}% เมื่อเช่าชุดขั้นต่ำ ${promo.minSpend?.toLocaleString()} บาท`
                      : `รับส่วนลดเงินสด ${promo.discountValue} บาท เมื่อเช่าชุดขั้นต่ำ ${promo.minSpend?.toLocaleString()} บาท`}
                  </p>
                </div>

                <div className="p-3 bg-[#FDF9F9] rounded-2xl border border-dashed border-[#D48C95] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#7E6D70] block">รหัสส่วนลด</span>
                    <span className="font-mono font-bold text-sm text-[#B26571]">
                      {promo.code}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className="px-3 py-1.5 bg-white text-xs font-medium text-[#2C2123] border border-[#EED8DC] rounded-xl hover:border-[#B26571] transition flex items-center gap-1.5 shadow-2xs"
                  >
                    {copiedCode === promo.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">คัดลอกแล้ว</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#7E6D70]" />
                        <span>คัดลอกโค้ด</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. THE DRESSÉ BOUTIQUE EXPERIENCE */}
      <section id="about-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs tracking-[0.25em] text-[#B26571] uppercase font-semibold">
              The DRESSÉ Experience
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-[#2C2123] leading-tight">
              ทำไมผู้หญิงยุคใหม่จึงเลือกเช่าชุดกับ DRESSÉ
            </h2>
            <p className="text-sm text-[#7E6D70] leading-relaxed font-light">
              เราเชื่อว่าทุกค่ำคืนมีความหมาย และการสวมใส่ชุดราตรีชั้นเลิศไม่จำเป็นต้องเป็นการซื้อที่ใส่เพียงครั้งเดียว DRESSÉ ช่วยให้คุณเข้าถึงตู้เสื้อผ้าระดับกาล่าดินเนอร์ ด้วยมาตรฐานการดูแลรักษาระดับโรงแรมห้าดาว
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F7ECEE] text-[#B26571] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#2C2123]">เนื้อผ้าเกรดโอต์กูตูร์นำเข้า</h4>
                  <p className="text-xs text-[#7E6D70] mt-0.5">ไหมแท้ ซาตินอิตาลี และลูกไม้ปักมือ คัตติ้งเนี้ยบช่วยเก็บสรีระอย่างมั่นใจ</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F7ECEE] text-[#B26571] flex items-center justify-center shrink-0 mt-0.5">
                  <Scissors className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#2C2123]">บริการฟิตติ้งและปรับแก้ทรงฟรี</h4>
                  <p className="text-xs text-[#7E6D70] mt-0.5">มีช่างประจำร้านคอยดูแลเก็บทรงชั่วคราวให้พอดีตัวเป๊ะ ไม่เสียทรงชุด</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-2xl bg-[#F7ECEE] text-[#B26571] flex items-center justify-center shrink-0 mt-0.5">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#2C2123]">ส่งมอบตรงเวลาในถุงสูทกันฝุ่นพรีเมียม</h4>
                  <p className="text-xs text-[#7E6D70] mt-0.5">จัดส่งล่วงหน้าก่อนวันงาน 1 วัน พร้อมไม้แขวนเสื้อและกระเป๋าคลุมชุดหรูหรา</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-4/5 rounded-3xl overflow-hidden shadow-rose-glow border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=1000&q=80"
                alt="Fitting Room Experience"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-[#EED8DC] max-w-xs hidden sm:block">
              <div className="flex items-center gap-1 text-[#D48C95] mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs font-semibold text-[#2C2123]">"ชุดสวย คัตติ้งเนี้ยบ บริการประทับใจ"</p>
              <p className="text-[11px] text-[#7E6D70] mt-1">รีวิวเฉลี่ย 4.9 ดาว จากลูกค้ากว่า 500+ ท่าน</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-[0.25em] text-[#B26571] uppercase font-semibold">
            Client Testimonials
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2C2123]">
            เสียงประทับใจจากลูกค้า DRESSÉ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.reviewId}
              className="bg-white rounded-3xl p-6 border border-[#EED8DC] shadow-card-soft flex flex-col justify-between space-y-4 hover:shadow-rose-glow transition"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#D48C95]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-[#2C2123] italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#EED8DC]/60 flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-xs text-[#2C2123]">{rev.userName}</h5>
                  <span className="text-[10px] text-[#B26571] block">{rev.productName}</span>
                </div>
                <span className="text-[10px] text-[#7E6D70]">Verified Customer</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
