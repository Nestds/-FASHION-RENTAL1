import React, { useState } from 'react';
import {
  RotateCcw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  X,
  FileCheck,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Booking, RentalReturn } from '../../types';
import { store } from '../../services/store';

interface Props {
  returns: RentalReturn[];
  bookings: Booking[];
}

export const AdminReturns: React.FC<Props> = ({ returns, bookings }) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Return process state
  const [actualReturnDate, setActualReturnDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [condition, setCondition] = useState<RentalReturn['returnCondition']>('good');
  const [damageFee, setDamageFee] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Active rentals eligible for return inspection
  const activeRentals = bookings.filter(
    (b) => b.bookingStatus === 'in_rental' || b.bookingStatus === 'returned' || b.bookingStatus === 'confirmed'
  );

  const handleOpenProcessModal = (b: Booking) => {
    setSelectedBooking(b);
    setActualReturnDate(new Date().toISOString().split('T')[0]);
    setCondition('good');
    setDamageFee(0);
    setNotes('');
    setModalOpen(true);
  };

  const handleConfirmReturn = () => {
    if (!selectedBooking) return;

    const res = store.processReturn({
      bookingId: selectedBooking.bookingId,
      actualReturnDate,
      returnCondition: condition,
      damageFee: Number(damageFee),
      notes: notes.trim(),
      processedBy: 'admin-001',
    });

    if (res.success) {
      alert(res.message);
      setModalOpen(false);
      setSelectedBooking(null);
    } else {
      alert(res.message);
    }
  };

  // Live calculation in modal
  const calcLateDays = () => {
    if (!selectedBooking) return 0;
    const exp = new Date(selectedBooking.endDate);
    const act = new Date(actualReturnDate);
    const diff = act.getTime() - exp.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const lateDays = calcLateDays();
  const lateFee = lateDays * 300;
  const depositRefund = selectedBooking
    ? Math.max(0, selectedBooking.deposit - lateFee - Number(damageFee))
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#292929]">
          จัดการการคืนชุดและเงินประกัน (Return & Deposit Settlement)
        </h2>
        <p className="text-xs text-[#736E6A]">
          บันทึกวันคืนจริง ตรวจสอบสภาพชุด คำนวณค่าปรับคืนล่าช้า และคำนวณเงินประกันคืนลูกค้า
        </p>
      </div>

      {/* Section 1: Active Rentals Due for Return */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8D8D2] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="font-serif-luxury text-lg font-bold text-[#292929]">
              ชุดที่อยู่ระหว่างการเช่า / รอส่งคืน ({activeRentals.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#E8D8D2]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#8B735E] border-b border-[#E8D8D2]">
                <th className="py-3 px-4 font-semibold">เลขที่จอง</th>
                <th className="py-3 px-4 font-semibold">ชื่อผู้เช่า</th>
                <th className="py-3 px-4 font-semibold">กำหนดวันคืน</th>
                <th className="py-3 px-4 font-semibold">เงินประกัน</th>
                <th className="py-3 px-4 font-semibold">สถานะ</th>
                <th className="py-3 px-4 font-semibold text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8D2]/60">
              {activeRentals.map((b) => (
                <tr key={b.bookingId} className="hover:bg-[#FAF8F5]/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#8B735E]">
                    {b.bookingCode}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#292929]">
                    {b.customerName}
                  </td>
                  <td className="py-3 px-4 text-[#736E6A]">
                    {b.endDate}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#292929]">
                    ฿{b.deposit.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenProcessModal(b)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#8B735E] text-white text-xs font-semibold hover:bg-[#6F5B49] transition shadow-2xs"
                    >
                      บันทึกการคืนชุด & คืนประกัน
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Completed Return Records */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8D8D2] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FileCheck className="w-4 h-4" />
            </span>
            <h3 className="font-serif-luxury text-lg font-bold text-[#292929]">
              ประวัติการตรวจรับและคืนเงินประกันแล้ว ({returns.length})
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#E8D8D2]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#8B735E] border-b border-[#E8D8D2]">
                <th className="py-3 px-4 font-semibold">เลขที่จอง</th>
                <th className="py-3 px-4 font-semibold">วันคืนตามนัด</th>
                <th className="py-3 px-4 font-semibold">วันคืนจริง</th>
                <th className="py-3 px-4 font-semibold">สภาพชุด</th>
                <th className="py-3 px-4 font-semibold">ค่าปรับล่าช้า</th>
                <th className="py-3 px-4 font-semibold">ค่าชำรุด</th>
                <th className="py-3 px-4 font-semibold">ยอดคืนประกันสุทธิ</th>
                <th className="py-3 px-4 font-semibold">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8D2]/60">
              {returns.map((r) => (
                <tr key={r.returnId} className="hover:bg-[#FAF8F5]/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#8B735E]">
                    {r.bookingCode}
                  </td>
                  <td className="py-3 px-4 text-[#736E6A]">
                    {r.expectedReturnDate}
                  </td>
                  <td className="py-3 px-4 text-[#292929] font-medium">
                    {r.actualReturnDate}
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize">{r.returnCondition}</span>
                  </td>
                  <td className="py-3 px-4 text-rose-600 font-medium">
                    ฿{r.lateFee.toLocaleString()} ({r.lateDays} วัน)
                  </td>
                  <td className="py-3 px-4 text-rose-600 font-medium">
                    ฿{r.damageFee.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700">
                    ฿{r.depositRefund.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Return Inspection Modal */}
      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-[#E8D8D2] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8D8D2] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#8B735E] block">
                  {selectedBooking.bookingCode}
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                  บันทึกการส่งคืนชุดและคืนเงินประกัน
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-[#736E6A] hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8D2] space-y-1">
                <div className="flex justify-between text-[#736E6A]">
                  <span>ผู้เช่าชุด:</span>
                  <span className="font-semibold text-[#292929]">{selectedBooking.customerName}</span>
                </div>
                <div className="flex justify-between text-[#736E6A]">
                  <span>กำหนดส่งคืนเดิม:</span>
                  <span className="font-medium text-[#292929]">{selectedBooking.endDate}</span>
                </div>
                <div className="flex justify-between text-[#736E6A]">
                  <span>เงินประกันที่วางไว้:</span>
                  <span className="font-bold text-[#8B735E]">฿{selectedBooking.deposit.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-[#292929] font-medium mb-1">วันที่รับคืนจริง *</label>
                <input
                  type="date"
                  value={actualReturnDate}
                  onChange={(e) => setActualReturnDate(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[#292929] font-medium mb-1">สภาพชุดหลังตรวจสอบ *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs"
                >
                  <option value="good">สมบูรณ์ดีเยี่ยม (Good) - ไม่พบคราบหรือรอยฉีก</option>
                  <option value="dirty">มีคราบเปื้อนซักออกได้ (Dirty) - ซักแห้งปกติ</option>
                  <option value="minor_damage">ชำรุดเล็กน้อย (Minor Damage) - ซ่อมแซมได้</option>
                  <option value="major_damage">ชำรุดรุนแรง/ขาดเสียหาย (Major Damage)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#292929] font-medium mb-1">
                  หักค่าความเสียหายเพิ่มเติม (THB)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={damageFee}
                  onChange={(e) => setDamageFee(Number(e.target.value))}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[#292929] font-medium mb-1">บันทึกผลการตรวจสอบ</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="เช่น ตรวจสอบผ้าลูกไม้และซิปเรียบร้อย..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs"
                />
              </div>

              {/* Settlement Summary */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-950">
                <div className="flex justify-between">
                  <span>เงินประกันตั้งต้น:</span>
                  <span>฿{selectedBooking.deposit.toLocaleString()}</span>
                </div>
                {lateDays > 0 && (
                  <div className="flex justify-between text-rose-700">
                    <span>หักค่าส่งคืนล่าช้า ({lateDays} วัน × ฿300):</span>
                    <span>-฿{lateFee.toLocaleString()}</span>
                  </div>
                )}
                {damageFee > 0 && (
                  <div className="flex justify-between text-rose-700">
                    <span>หักค่าความเสียหาย:</span>
                    <span>-฿{damageFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-emerald-300 flex justify-between items-center text-sm font-bold">
                  <span>ยอดคืนเงินประกันสุทธิ:</span>
                  <span className="text-lg text-emerald-700">฿{depositRefund.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#E8D8D2] rounded-xl text-[#736E6A]"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReturn}
                  className="px-6 py-2.5 bg-[#8B735E] hover:bg-[#6F5B49] text-white rounded-xl font-semibold transition shadow-md"
                >
                  ยืนยันตรวจรับ & ปิดคำสั่ง (Complete)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
