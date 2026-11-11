import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ShieldCheck,
  Tag,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Truck,
  Sparkles
} from 'lucide-react';
import { Product, Size, User } from '../types';
import { store } from '../services/store';

interface Props {
  product: Product;
  sizeId: string;
  startDate: string;
  endDate: string;
  currentUser: User | null;
  onBack: () => void;
  onNavigateToLogin: () => void;
  onBookingSuccess: (bookingId: string) => void;
}

export const BookingPage: React.FC<Props> = ({
  product,
  sizeId,
  startDate,
  endDate,
  currentUser,
  onBack,
  onNavigateToLogin,
  onBookingSuccess,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('WELCOME500'); // Pre-fill welcome coupon
  const [promoError, setPromoError] = useState('');
  const [notes, setNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Customer contact form state
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(
    currentUser?.address || '128/45 คอนโดมิเนียมสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110'
  );

  const sizeObj = store.getSizes().find((s) => s.sizeId === sizeId);

  // Costs calculation
  const costs = useMemo(() => {
    return store.calculateBookingCosts(
      product.rentalPrice,
      product.depositPrice,
      startDate,
      endDate,
      1,
      appliedPromo || undefined
    );
  }, [product.rentalPrice, product.depositPrice, startDate, endDate, appliedPromo]);

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCode.trim()) return;

    const testCost = store.calculateBookingCosts(
      product.rentalPrice,
      product.depositPrice,
      startDate,
      endDate,
      1,
      promoCode.trim()
    );

    if (testCost.promoApplied) {
      setAppliedPromo(promoCode.trim().toUpperCase());
      setPromoCode('');
    } else {
      setPromoError('รหัสส่วนลดไม่ถูกต้อง หมดอายุ หรือยอดเช่าไม่ถึงเกณฑ์ขั้นต่ำ');
    }
  };

  const handleSubmitBooking = async () => {
    if (!currentUser) {
      alert('กรุณาเข้าสู่ระบบก่อนดำเนินการจองชุด');
      onNavigateToLogin();
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      alert('กรุณากรอกชื่อ-นามสกุล เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบถ้วน');
      return;
    }

    if (!agreeTerms) {
      alert('กรุณากดยอมรับเงื่อนไขการเช่าชุดราตรีของ DRESSÉ');
      return;
    }

    setSubmitting(true);
    try {
      const res = store.createBooking({
        userId: currentUser.uid,
        productId: product.productId,
        sizeId,
        startDate,
        endDate,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        promoCode: appliedPromo || undefined,
        notes,
      });

      if (res.success && res.booking) {
        onBookingSuccess(res.booking.bookingId);
      } else {
        alert(res.message);
      }
    } catch (e: any) {
      alert('เกิดข้อผิดพลาดในการบันทึกการจอง: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#7E6D70] hover:text-[#2C2123] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>กลับไปแก้ไขรายละเอียดชุด</span>
      </button>

      {/* Page Title */}
      <div className="space-y-2 border-b border-[#EED8DC] pb-6">
        <span className="text-xs tracking-[0.25em] text-[#B26571] uppercase font-semibold">
          Checkout & Reservation
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2C2123]">
          ตรวจสอบและยืนยันการจองชุด
        </h1>
        <p className="text-xs text-[#7E6D70]">
          กรุณาตรวจสอบรายละเอียดชุด วันที่เช่า และข้อมูลการจัดส่งก่อนดำเนินการชำระเงิน
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Customer Info & Delivery (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Auth Check */}
          {!currentUser ? (
            <div className="p-4 bg-[#FDF4F5] border border-[#EED8DC] rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-[#B26571] shrink-0" />
                <div className="text-xs text-[#2C2123]">
                  <p className="font-semibold">คุณยังไม่ได้เข้าสู่ระบบ</p>
                  <p className="text-[#7E6D70]">กรุณาเข้าสู่ระบบเพื่อให้ข้อมูลการจองบันทึกในบัญชีของคุณ</p>
                </div>
              </div>
              <button
                onClick={onNavigateToLogin}
                className="px-4 py-2 bg-[#B26571] text-white text-xs font-medium rounded-xl hover:bg-[#8F4954] transition shadow-xs"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span>เข้าสู่ระบบในนาม: <strong>{currentUser.fullName}</strong> ({currentUser.email})</span>
              </div>
            </div>
          )}

          {/* Contact Details Form */}
          <div className="bg-white p-6 rounded-3xl border border-[#EED8DC] shadow-card-soft space-y-4">
            <h3 className="font-serif-luxury text-lg font-semibold text-[#2C2123] flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#B26571]" />
              ข้อมูลผู้เช่าและที่อยู่จัดส่งชุด
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#2C2123] font-medium mb-1">ชื่อ-นามสกุล *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                  placeholder="เช่น พัชริดา รัตนวรกุล"
                />
              </div>

              <div>
                <label className="block text-[#2C2123] font-medium mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                  placeholder="เช่น 089-123-4567"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#2C2123] font-medium mb-1">อีเมลผู้เช่า</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full p-2.5 bg-gray-100 border border-[#EED8DC] rounded-xl text-gray-500 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#2C2123] font-medium mb-1">ที่อยู่จัดส่งพัสดุ (หรือรับที่โชว์รูม) *</label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                  placeholder="ระบุบ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#2C2123] font-medium mb-1">หมายเหตุเพิ่มเติม (ถ้ามี)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571]"
                  placeholder="เช่น วันงานจริง 16 พ.ย., ขอรับชุดที่โชว์รูมทองหล่อ"
                />
              </div>
            </div>
          </div>

          {/* Rental Terms Checkbox */}
          <div className="p-4 bg-[#FDF9F9] rounded-2xl border border-[#EED8DC] text-xs space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-[#B26571]"
              />
              <span className="text-[#2C2123] leading-relaxed">
                ฉันได้อ่านและยอมรับ <strong>เงื่อนไขการเช่าชุดราตรี</strong> ของ DRESSÉ (ระยะเวลาเช่าตามที่ระบุ, ไม่ตัดต่อผ้าชุด, ส่งคืนตรงเวลา และรับเงินประกันคืนเต็มจำนวนหลังตรวจสภาพชุด)
              </span>
            </label>
          </div>
        </div>

        {/* Right Summary: Dress Snapshot & Pricing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#EED8DC] shadow-rose-glow space-y-6">
            <h3 className="font-serif-luxury text-xl font-bold text-[#2C2123] border-b border-[#EED8DC] pb-3">
              สรุปรายการเช่าชุด
            </h3>

            {/* Dress Item Snapshot */}
            <div className="flex gap-4">
              <div className="w-20 aspect-3/4 rounded-2xl overflow-hidden bg-[#FAF5F6] shrink-0 border border-[#EED8DC]">
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-1 text-xs">
                <span className="text-[10px] text-[#7E6D70] block">{product.productCode}</span>
                <h4 className="font-serif-luxury text-base font-semibold text-[#2C2123] line-clamp-1">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 text-[#7E6D70]">
                  <span>ไซซ์: <strong className="text-[#B26571]">{sizeObj?.name}</strong></span>
                  <span>•</span>
                  <span>สี: {product.color}</span>
                </div>
                <div className="text-[#B26571] font-semibold pt-1 tabular-nums">
                  ฿{product.rentalPrice.toLocaleString()} / วัน
                </div>
              </div>
            </div>

            {/* Rental Dates Summary */}
            <div className="p-3.5 bg-[#FDF9F9] rounded-2xl border border-[#EED8DC] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#7E6D70]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#B26571]" />
                  <span>วันเริ่มเช่า:</span>
                </span>
                <span className="font-medium text-[#2C2123]">{startDate}</span>
              </div>
              <div className="flex items-center justify-between text-[#7E6D70]">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#B26571]" />
                  <span>วันกำหนดคืน:</span>
                </span>
                <span className="font-medium text-[#2C2123]">{endDate}</span>
              </div>
              <div className="pt-2 border-t border-[#EED8DC]/60 flex justify-between font-semibold text-[#B26571]">
                <span>รวมระยะเวลาเช่า:</span>
                <span>{costs.rentalDays} วัน</span>
              </div>
            </div>

            {/* Promotion Coupon Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#2C2123] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#B26571]" />
                <span>โค้ดส่วนลด (Promotion Code)</span>
              </label>

              {appliedPromo ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>ใช้โค้ด: <strong>{appliedPromo}</strong> (ลด ฿{costs.discount.toLocaleString()})</span>
                  </div>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    ยกเลิก
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="ใส่รหัส เช่น WELCOME500"
                    className="flex-1 p-2.5 text-xs bg-[#FDF9F9] border border-[#EED8DC] rounded-xl focus:outline-hidden focus:border-[#B26571] uppercase font-mono"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2.5 bg-[#B26571] text-white text-xs font-medium rounded-xl hover:bg-[#8F4954] transition shadow-2xs"
                  >
                    ใช้โค้ด
                  </button>
                </div>
              )}
              {promoError && <p className="text-[11px] text-rose-600">{promoError}</p>}
            </div>

            {/* Detailed Pricing Table */}
            <div className="border-t border-[#EED8DC] pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#7E6D70]">
                <span>ค่าเช่ารวม ({costs.rentalDays} วัน):</span>
                <span className="tabular-nums">฿{costs.subtotal.toLocaleString()}</span>
              </div>
              {costs.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>ส่วนลดโปรโมชั่น:</span>
                  <span className="tabular-nums">-฿{costs.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-[#7E6D70]">
                <span>เงินประกันความเสียหาย (คืนเต็มจำนวน):</span>
                <span className="tabular-nums">฿{costs.deposit.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-[#EED8DC] flex justify-between items-center text-sm font-bold text-[#2C2123]">
                <span>ยอดชำระสุทธิทั้งหมด:</span>
                <span className="text-xl text-[#B26571] tabular-nums">
                  ฿{costs.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Submit Reservation Button */}
            <button
              disabled={submitting}
              onClick={handleSubmitBooking}
              className="w-full py-4 bg-[#B26571] hover:bg-[#8F4954] text-white text-xs font-semibold tracking-wider uppercase rounded-full transition shadow-rose-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'กำลังบันทึกการจอง...' : 'ยืนยันการจอง & ไปหน้าชำระเงิน'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
