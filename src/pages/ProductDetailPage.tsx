import React, { useState, useMemo } from 'react';
import {
  Heart,
  Calendar,
  Ruler,
  ShieldCheck,
  Truck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Star
} from 'lucide-react';
import { Product, Size, Review } from '../types';
import { store } from '../services/store';

interface Props {
  product: Product;
  sizes: Size[];
  reviews: Review[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBack: () => void;
  onOpenSizeChart: () => void;
  onStartBooking: (params: {
    productId: string;
    sizeId: string;
    startDate: string;
    endDate: string;
  }) => void;
}

export const ProductDetailPage: React.FC<Props> = ({
  product,
  sizes,
  reviews,
  isFavorite,
  onToggleFavorite,
  onBack,
  onOpenSizeChart,
  onStartBooking,
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState<string>(() => {
    const firstAvail = product.sizes.find((s) => s.quantity > 0);
    return firstAvail ? firstAvail.sizeId : product.sizes[0]?.sizeId || '';
  });

  // Default dates: tomorrow to +3 days (standard 3-day rental)
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const threeDaysLaterStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const [startDate, setStartDate] = useState(tomorrowStr);
  const [endDate, setEndDate] = useState(threeDaysLaterStr);

  // Check availability
  const availability = useMemo(() => {
    return store.checkAvailability(product.productId, selectedSizeId, startDate, endDate);
  }, [product.productId, selectedSizeId, startDate, endDate]);

  // Cost calculation
  const costs = useMemo(() => {
    return store.calculateBookingCosts(product.rentalPrice, product.depositPrice, startDate, endDate, 1);
  }, [product.rentalPrice, product.depositPrice, startDate, endDate]);

  const selectedSizeObj = sizes.find((s) => s.sizeId === selectedSizeId);
  const productReviews = reviews.filter((r) => r.productId === product.productId);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `เช่าชุด ${product.name} ที่ DRESSÉ`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('คัดลอกลิงก์ชุดราตรีเรียบร้อยแล้ว');
    }
  };

  const handleBookClick = () => {
    if (!availability.isAvailable) {
      alert('ขออภัย ชุดไซซ์นี้ไม่ว่างในช่วงวันที่คุณเลือก กรุณาเลือกวันอื่น');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      alert('วันคืนชุดต้องไม่น้อยกว่าวันเริ่มเช่า');
      return;
    }
    onStartBooking({
      productId: product.productId,
      sizeId: selectedSizeId,
      startDate,
      endDate,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#7E6D70] hover:text-[#2C2123] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับไปหน้าคอลเลกชัน</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-[#7E6D70]">
          <span>Collection</span>
          <span>/</span>
          <span>{product.categoryName || 'Evening Gown'}</span>
          <span>/</span>
          <span className="text-[#B26571] font-medium">{product.productCode}</span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-[#FAF5F6] border border-[#EED8DC] shadow-rose-glow">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-top transition duration-500"
            />

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#B26571] text-white shadow-md">
                {product.categoryName || 'Evening Dress'}
              </span>
            </div>

            <div className="absolute top-4 right-4 flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#2C2123] flex items-center justify-center transition shadow-md"
                title="แชร์ชุดนี้"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onToggleFavorite}
                className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#2C2123] flex items-center justify-center transition shadow-md"
                title="บันทึกในรายการโปรด"
              >
                <Heart
                  className={`w-4 h-4 transition ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : 'text-[#7E6D70]'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 aspect-3/4 rounded-2xl overflow-hidden border-2 transition shrink-0 ${
                    selectedImage === idx
                      ? 'border-[#B26571] ring-2 ring-[#B26571]/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Fabric & Material Details */}
          <div className="p-6 bg-white rounded-3xl border border-[#EED8DC] shadow-card-soft space-y-4">
            <h4 className="font-serif-luxury text-lg font-semibold text-[#2C2123] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B26571]" />
              รายละเอียดและการดูแลเนื้อผ้า
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#7E6D70]">
              <div>
                <span className="font-medium text-[#2C2123] block">ชนิดเนื้อผ้า (Fabric):</span>
                <span>{product.fabric || 'ไหมชีฟองและซาตินเกรดพรีเมียม'}</span>
              </div>
              <div>
                <span className="font-medium text-[#2C2123] block">เฉดสี (Color):</span>
                <span>{product.color}</span>
              </div>
              <div>
                <span className="font-medium text-[#2C2123] block">การทำความสะอาด:</span>
                <span>บริการซักแห้งด้วยน้ำยาถนอมเนื้อผ้าเกรดโอต์กูตูร์ ฟรีทุกชุด</span>
              </div>
              <div>
                <span className="font-medium text-[#2C2123] block">ประกันชุดชำรุดเล็กน้อย:</span>
                <span>ครอบคลุมคราบสกปรกทั่วไปและตะเข็บหลุดลุ่ยตามปกติ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Engine & Pricing (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EED8DC] shadow-rose-glow space-y-6">
            {/* Header */}
            <div className="space-y-2 border-b border-[#EED8DC] pb-5">
              <div className="flex items-center justify-between text-xs text-[#7E6D70]">
                <span className="font-mono">{product.productCode}</span>
                <div className="flex items-center gap-1 text-[#D48C95]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-[#2C2123]">{product.rating || 5.0}</span>
                  <span className="text-[#7E6D70]">({product.rentalCount || 20} ครั้งที่ถูกเช่า)</span>
                </div>
              </div>

              <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C2123] leading-tight">
                {product.name}
              </h1>

              <div className="pt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#B26571] tabular-nums">
                    ฿{product.rentalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#7E6D70]"> / วัน</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#7E6D70] block">เงินประกันความเสียหาย</span>
                  <span className="text-xs font-semibold text-[#2C2123] tabular-nums">
                    ฿{product.depositPrice.toLocaleString()} (ได้คืนเต็มจำนวน)
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#7E6D70] leading-relaxed font-light">
              {product.description}
            </p>

            {/* Step 1: Select Size */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#2C2123] uppercase tracking-wider">
                  1. เลือกไซซ์ชุด
                </label>
                <button
                  onClick={onOpenSizeChart}
                  className="text-xs text-[#B26571] hover:underline flex items-center gap-1 font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>ตารางเทียบไซซ์</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSizeId === s.sizeId;
                  const isOutOfStock = s.quantity <= 0;
                  return (
                    <button
                      key={s.sizeId}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSizeId(s.sizeId)}
                      className={`py-2.5 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-[#B26571] bg-[#B26571] text-white shadow-xs'
                          : isOutOfStock
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through'
                          : 'border-[#EED8DC] hover:border-[#B26571] text-[#2C2123] bg-[#FDF9F9]'
                      }`}
                    >
                      <span className="font-bold text-xs">{s.sizeName}</span>
                      <span className="text-[10px] opacity-80">
                        {isOutOfStock ? 'หมด' : `เหลือ ${s.quantity}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedSizeObj && (
                <div className="p-3 bg-[#FDF9F9] rounded-2xl text-[11px] text-[#7E6D70] flex justify-between border border-[#EED8DC]/60">
                  <span>สัดส่วนไซซ์ {selectedSizeObj.name}:</span>
                  <span>อก {selectedSizeObj.bust}" | เอว {selectedSizeObj.waist}" | สะโพก {selectedSizeObj.hip}"</span>
                </div>
              )}
            </div>

            {/* Step 2: Date Availability Picker */}
            <div className="space-y-3 pt-3 border-t border-[#EED8DC]/60">
              <label className="text-xs font-semibold text-[#2C2123] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B26571]" />
                <span>2. ตรวจสอบวันว่าง & เลือกระยะเวลาเช่า</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-[#7E6D70] block mb-1">วันเริ่มเช่า</span>
                  <input
                    type="date"
                    min={tomorrowStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FDF9F9] border border-[#EED8DC] rounded-xl text-[#2C2123] focus:outline-hidden focus:border-[#B26571]"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-[#7E6D70] block mb-1">วันกำหนดคืนชุด</span>
                  <input
                    type="date"
                    min={startDate || tomorrowStr}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FDF9F9] border border-[#E8D8D2] rounded-xl text-[#2C2123] focus:outline-hidden focus:border-[#B26571]"
                  />
                </div>
              </div>

              {/* Availability Indicator Badge */}
              <div
                className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between ${
                  availability.isAvailable
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {availability.isAvailable ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>
                    {availability.isAvailable
                      ? `ชุดว่างพร้อมเช่าในช่วงวันที่เลือก (คงเหลือ ${availability.availableStock} ชุด)`
                      : `ขออภัย ไซซ์นี้ถูกจองเต็มแล้วในช่วงวันที่เลือก`}
                  </span>
                </div>
                <span className="font-semibold">{costs.rentalDays} วัน</span>
              </div>
            </div>

            {/* Step 3: Cost Breakdown Summary */}
            <div className="p-4 bg-[#FDF9F9] rounded-2xl border border-[#EED8DC] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#7E6D70]">
                <span>ค่าเช่า {costs.rentalDays} วัน (฿{product.rentalPrice.toLocaleString()} × {costs.rentalDays}):</span>
                <span className="tabular-nums">฿{costs.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#7E6D70]">
                <span>เงินประกันความเสียหาย (ได้รับคืนเต็มจำนวน):</span>
                <span className="tabular-nums">฿{costs.deposit.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-[#EED8DC] flex justify-between items-center text-sm font-bold text-[#2C2123]">
                <span>ยอดชำระสุทธิ (รวมเงินประกัน):</span>
                <span className="text-xl text-[#B26571] tabular-nums">฿{costs.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                disabled={!availability.isAvailable}
                onClick={handleBookClick}
                className="w-full py-4 rounded-full bg-[#B26571] hover:bg-[#8F4954] text-white text-xs font-semibold tracking-wider uppercase transition shadow-rose-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                <span>ยืนยันการจองชุดนี้ (Book Now)</span>
              </button>

              <button
                onClick={onToggleFavorite}
                className="w-full py-2.5 rounded-full border border-[#EED8DC] text-[#2C2123] hover:bg-[#FDF9F9] text-xs font-medium transition flex items-center justify-center gap-2"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFavorite ? 'บันทึกในรายการโปรดแล้ว' : 'เพิ่มในชุดที่ถูกใจ (Favorites)'}</span>
              </button>
            </div>

            {/* Service Guarantees */}
            <div className="pt-4 border-t border-[#EED8DC]/60 grid grid-cols-2 gap-3 text-[11px] text-[#7E6D70]">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#B26571]" />
                <span>ส่งถึงก่อนวันงาน 1 วัน</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#B26571]" />
                <span>คืนเงินประกันใน 24 ชม.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <section className="bg-white rounded-3xl p-8 border border-[#EED8DC] shadow-card-soft space-y-6">
        <div className="flex items-center justify-between border-b border-[#EED8DC] pb-4">
          <div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#2C2123]">
              รีวิวจากลูกค้าผู้เช่าจริง ({productReviews.length})
            </h3>
            <p className="text-xs text-[#7E6D70]">
              คะแนนความพึงพอใจเฉลี่ย 4.9/5 ดาว
            </p>
          </div>
        </div>

        {productReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {productReviews.map((rev) => (
              <div
                key={rev.reviewId}
                className="p-5 rounded-2xl bg-[#FDF9F9] border border-[#EED8DC]/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#2C2123]">{rev.userName}</span>
                  <div className="flex items-center gap-1 text-[#D48C95]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#7E6D70] italic leading-relaxed">
                  "{rev.comment}"
                </p>
                <span className="text-[10px] text-[#7E6D70]/60 block">
                  {new Date(rev.createdAt).toLocaleDateString('th-TH')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#7E6D70] italic py-4">
            ยังไม่มีรีวิวสำหรับชุดนี้ เป็นคนแรกที่เช่าและร่วมแบ่งปันความประทับใจ!
          </p>
        )}
      </section>
    </div>
  );
};
