import React from 'react';
import { QrCode, AlertTriangle, Building, Copy, Check } from 'lucide-react';

interface Props {
  amount: number;
  bookingCode: string;
}

export const PromptPayQR: React.FC<Props> = ({ amount, bookingCode }) => {
  const [copiedBank, setCopiedBank] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(key);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8D8D2] p-6 shadow-sm space-y-6">
      {/* Demo Warning Banner */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold">ข้อมูลบัญชีและ QR Code จำลองสำหรับทดสอบ (Demo Only)</p>
          <p className="text-amber-800 mt-0.5">
            ตามข้อกำหนดโปรเจกต์ ข้อมูลนี้ใช้สำหรับทดสอบขั้นตอนการโอนและอัปโหลดสลิป <strong>ห้ามโอนเงินจริงเด็ดขาด</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* QR Code Container styled like Thai PromptPay */}
        <div className="flex flex-col items-center">
          <div className="w-64 bg-[#003D6B] rounded-2xl overflow-hidden shadow-md border-2 border-[#003D6B]">
            {/* PromptPay Header */}
            <div className="py-2.5 px-4 text-center bg-[#003D6B] text-white">
              <span className="font-serif tracking-widest font-bold text-sm">PromptPay</span>
              <span className="text-[10px] block opacity-80">พร้อมเพย์ • ชำระเงิน</span>
            </div>

            {/* QR Pattern Box */}
            <div className="bg-white p-4 flex flex-col items-center justify-center">
              <div className="relative p-2 border-2 border-dashed border-[#003D6B]/30 rounded-xl bg-[#FAF8F5]">
                {/* SVG QR Code Pattern */}
                <svg
                  className="w-44 h-44 text-[#003D6B]"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  {/* Outer corner 1 */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="11" y="11" width="14" height="14" fill="currentColor" />
                  {/* Outer corner 2 */}
                  <rect x="69" y="5" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="75" y="11" width="14" height="14" fill="currentColor" />
                  {/* Outer corner 3 */}
                  <rect x="5" y="69" width="26" height="26" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
                  <rect x="11" y="75" width="14" height="14" fill="currentColor" />
                  {/* Data matrix dots simulation */}
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="46" y="8" width="6" height="6" />
                  <rect x="56" y="8" width="6" height="6" />
                  <rect x="8" y="36" width="6" height="6" />
                  <rect x="20" y="36" width="6" height="6" />
                  <rect x="36" y="36" width="8" height="8" />
                  <rect x="48" y="36" width="6" height="6" />
                  <rect x="58" y="36" width="6" height="6" />
                  <rect x="70" y="36" width="6" height="6" />
                  <rect x="82" y="36" width="6" height="6" />
                  <rect x="8" y="48" width="6" height="6" />
                  <rect x="22" y="48" width="6" height="6" />
                  <rect x="36" y="48" width="6" height="6" />
                  <rect x="46" y="48" width="10" height="10" />
                  <rect x="62" y="48" width="6" height="6" />
                  <rect x="76" y="48" width="6" height="6" />
                  <rect x="8" y="58" width="6" height="6" />
                  <rect x="24" y="58" width="6" height="6" />
                  <rect x="38" y="60" width="8" height="6" />
                  <rect x="52" y="60" width="6" height="6" />
                  <rect x="64" y="60" width="6" height="6" />
                  <rect x="78" y="60" width="8" height="8" />
                  <rect x="36" y="74" width="6" height="6" />
                  <rect x="46" y="74" width="6" height="6" />
                  <rect x="58" y="74" width="6" height="6" />
                  <rect x="70" y="74" width="6" height="6" />
                  <rect x="82" y="74" width="6" height="6" />
                  <rect x="36" y="86" width="8" height="6" />
                  <rect x="50" y="86" width="6" height="6" />
                  <rect x="64" y="86" width="8" height="6" />
                  <rect x="78" y="86" width="6" height="6" />
                  {/* Center promptpay emblem */}
                  <circle cx="50" cy="50" r="10" fill="#003D6B" />
                  <text x="50" y="53" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">฿</text>
                </svg>
              </div>

              {/* Amount Label */}
              <div className="mt-3 text-center">
                <span className="text-[11px] text-[#736E6A]">ยอดชำระสุทธิ</span>
                <div className="text-xl font-bold text-[#8B735E]">
                  ฿{amount.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#736E6A] block mt-0.5">
                  Ref: {bookingCode}
                </span>
              </div>
            </div>

            <div className="py-1.5 bg-[#FAF8F5] text-center text-[10px] text-[#736E6A] border-t border-[#E8D8D2]">
              DRESSÉ FASHION RENTAL (DEMO)
            </div>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-[#292929] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#8B735E]" />
            ช่องทางโอนเงินผ่านธนาคาร (ตัวอย่าง)
          </h4>

          {/* KBANK Card */}
          <div className="p-4 rounded-xl border border-[#E8D8D2] bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#00A950] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00A950]"></span>
                ธนาคารกสิกรไทย (KBANK)
              </span>
              <button
                onClick={() => handleCopy('0822998871', 'kbank')}
                className="text-[11px] text-[#8B735E] hover:underline flex items-center gap-1"
              >
                {copiedBank === 'kbank' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                คัดลอกเลขบัญชี
              </button>
            </div>
            <div className="font-mono font-bold text-sm text-[#292929]">
              082-2-99887-1
            </div>
            <div className="text-[11px] text-[#736E6A]">
              ชื่อบัญชี: <strong>บจก. เดรสเซ่ แฟชั่น เร้นทัล (บัญชีทดสอบ)</strong>
            </div>
          </div>

          {/* SCB Card */}
          <div className="p-4 rounded-xl border border-[#E8D8D2] bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#4E2A84] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4E2A84]"></span>
                ธนาคารไทยพาณิชย์ (SCB)
              </span>
              <button
                onClick={() => handleCopy('1129887765', 'scb')}
                className="text-[11px] text-[#8B735E] hover:underline flex items-center gap-1"
              >
                {copiedBank === 'scb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                คัดลอกเลขบัญชี
              </button>
            </div>
            <div className="font-mono font-bold text-sm text-[#292929]">
              112-9-88776-5
            </div>
            <div className="text-[11px] text-[#736E6A]">
              ชื่อบัญชี: <strong>บจก. เดรสเซ่ แฟชั่น เร้นทัล (บัญชีทดสอบ)</strong>
            </div>
          </div>

          <div className="text-[11px] text-[#736E6A] space-y-1 bg-[#FAF8F5] p-3 rounded-lg border border-[#E8D8D2]/60">
            <p>1. โอนเงินตามยอดสุทธิ <strong>฿{amount.toLocaleString()}</strong></p>
            <p>2. บันทึกภาพสลิปการโอนเงิน (รองรับไฟล์ JPG, PNG, WEBP)</p>
            <p>3. แนบหลักฐานสลิปในส่วนด้านล่างและกดยืนยันการชำระเงิน</p>
          </div>
        </div>
      </div>
    </div>
  );
};
