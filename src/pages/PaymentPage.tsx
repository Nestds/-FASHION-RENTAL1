import React, { useState } from 'react';
import {
  CheckCircle2,
  Upload,
  FileText,
  AlertTriangle,
  ArrowRight,
  Clock,
  Printer,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { Booking } from '../types';
import { PromptPayQR } from '../components/PromptPayQR';
import { store } from '../services/store';
import confetti from 'canvas-confetti';

interface Props {
  booking: Booking;
  onViewBookings: () => void;
}

export const PaymentPage: React.FC<Props> = ({ booking, onViewBookings }) => {
  const [selectedBank, setSelectedBank] = useState('ธนาคารกสิกรไทย (KBANK)');
  const [transferDate, setTransferDate] = useState(() => {
    return new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  });
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(booking.bookingStatus === 'payment_review' || booking.bookingStatus === 'confirmed');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSlipPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUseDemoSlip = () => {
    setSlipPreview('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80');
  };

  const handleSubmitSlip = () => {
    if (!slipPreview) {
      alert('กรุณาเลือกไฟล์สลิปการโอนเงิน หรือกดปุ่ม "ใช้สลิปทดสอบ (Demo Slip)"');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const res = store.submitPayment({
        bookingId: booking.bookingId,
        userId: booking.userId,
        amount: booking.totalAmount,
        slipUrl: slipPreview,
        transferBank: selectedBank,
        transferTime: transferDate,
      });

      setIsUploading(false);
      if (res.success) {
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // optional
        }
      } else {
        alert(res.message);
      }
    }, 600);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2 border-b border-[#EED8DC] pb-6">
        <span className="text-xs tracking-[0.25em] text-[#B26571] uppercase font-semibold">
          Payment & Slip Verification
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2C2123]">
          ชำระเงินและแจ้งโอนเงิน
        </h1>
        <p className="text-xs text-[#7E6D70]">
          เลขที่การจอง: <strong className="font-mono text-[#B26571]">{booking.bookingCode}</strong>
        </p>
      </div>

      {isCompleted ? (
        /* Payment Slip Submitted Success State */
        <div className="bg-white rounded-3xl p-8 border border-[#EED8DC] shadow-rose-glow text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-serif-luxury text-2xl font-bold text-[#2C2123]">
              บันทึกหลักฐานการชำระเงินเรียบร้อยแล้ว!
            </h2>
            <p className="text-xs text-[#7E6D70] leading-relaxed">
              ระบบได้ส่งข้อมูลการชำระเงินไปยังฝ่ายบัญชีของ DRESSÉ เจ้าหน้าที่จะทำการตรวจสอบยอดเงินและอนุมัติรายการจองของคุณภายใน 15-30 นาที
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="p-5 bg-[#FDF9F9] rounded-2xl border border-[#EED8DC] max-w-lg mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#7E6D70]">รหัสการจอง:</span>
              <span className="font-mono font-bold text-[#B26571]">{booking.bookingCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E6D70]">ผู้จอง:</span>
              <span className="font-medium text-[#2C2123]">{booking.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E6D70]">กำหนดการเช่า:</span>
              <span className="font-medium text-[#2C2123]">{booking.startDate} ถึง {booking.endDate} ({booking.rentalDays} วัน)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E6D70]">ยอดชำระสุทธิ:</span>
              <span className="font-bold text-[#B26571] tabular-nums">฿{booking.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7E6D70]">สถานะปัจจุบัน:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAD5DA] text-[#782834]">
                รอเจ้าหน้าที่ตรวจสอบสลิป (Payment Review)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handlePrintReceipt}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#EED8DC] text-xs font-medium text-[#2C2123] hover:bg-[#FDF9F9] transition flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#7E6D70]" />
              <span>พิมพ์ใบแจ้งการจอง (Print Receipt)</span>
            </button>

            <button
              onClick={onViewBookings}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#B26571] text-white text-xs font-medium hover:bg-[#8F4954] transition shadow-md flex items-center justify-center gap-2"
            >
              <span>ไปที่หน้ารายการจองของฉัน</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Payment Checkout Workbench */
        <div className="space-y-8">
          {/* 1. PromptPay & Bank Info Card */}
          <PromptPayQR amount={booking.totalAmount} bookingCode={booking.bookingCode} />

          {/* 2. Slip Upload Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EED8DC] shadow-card-soft space-y-6">
            <h3 className="font-serif-luxury text-xl font-bold text-[#2C2123] flex items-center gap-2 border-b border-[#EED8DC] pb-3">
              <Upload className="w-5 h-5 text-[#B26571]" />
              อัปโหลดหลักฐานการโอนเงิน (สลิป)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[#2C2123] font-medium mb-1">ธนาคารที่โอนเข้า</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl text-xs"
                >
                  <option value="ธนาคารกสิกรไทย (KBANK)">ธนาคารกสิกรไทย (KBANK) 082-2-99887-1</option>
                  <option value="ธนาคารไทยพาณิชย์ (SCB)">ธนาคารไทยพาณิชย์ (SCB) 112-9-88776-5</option>
                  <option value="PromptPay QR Code">พร้อมเพย์ QR Code</option>
                </select>
              </div>

              <div>
                <label className="block text-[#2C2123] font-medium mb-1">วันและเวลาที่โอนเงิน</label>
                <input
                  type="datetime-local"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  className="w-full p-2.5 bg-[#FDF9F9] border border-[#EED8DC] rounded-xl text-xs text-[#2C2123]"
                />
              </div>
            </div>

            {/* File Upload Zone */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-[#2C2123]">
                รูปภาพสลิปการโอนเงิน (รองรับ JPG, PNG, WEBP ขนาดไม่เกิน 10MB) *
              </label>

              {slipPreview ? (
                <div className="relative p-4 bg-[#FDF9F9] rounded-2xl border-2 border-dashed border-[#B26571]/50 flex flex-col items-center">
                  <img
                    src={slipPreview}
                    alt="Slip Preview"
                    className="max-h-64 object-contain rounded-xl shadow-md border border-[#EED8DC]"
                  />
                  <div className="mt-3 flex gap-3">
                    <label className="cursor-pointer text-xs text-[#B26571] hover:underline font-medium">
                      เปลี่ยนรูปสลิป
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[#7E6D70]">|</span>
                    <button
                      onClick={() => setSlipPreview(null)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      ลบรูปสลิป
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-[#EED8DC] rounded-2xl bg-[#FDF9F9]/80 hover:bg-[#FDF4F5] transition text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-[#B26571] shadow-2xs">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="text-xs text-[#7E6D70]">
                    <label className="cursor-pointer font-semibold text-[#B26571] hover:underline">
                      คลิกเพื่อเลือกไฟล์สลิปจากอุปกรณ์ของคุณ
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] mt-1 text-[#7E6D70]/80">หรือลากไฟล์ภาพสลิปมาวางที่นี่</p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleUseDemoSlip}
                      className="px-3.5 py-1.5 bg-white border border-[#D48C95] text-[#B26571] text-xs rounded-xl hover:bg-[#B26571] hover:text-white transition shadow-2xs"
                    >
                      💡 ใช้สลิปตัวอย่างสำหรับทดสอบ (Demo Slip)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Button */}
            <button
              disabled={isUploading || !slipPreview}
              onClick={handleSubmitSlip}
              className="w-full py-4 bg-[#B26571] hover:bg-[#8F4954] text-white text-xs font-semibold tracking-wider uppercase rounded-full transition shadow-rose-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึกข้อมูลสลิป...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ยืนยันการแจ้งชำระเงิน</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
