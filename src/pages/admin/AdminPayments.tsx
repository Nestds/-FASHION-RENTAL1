import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  CreditCard,
  Clock,
  AlertTriangle,
  Check,
  Shield
} from 'lucide-react';
import { Payment } from '../../types';
import { store } from '../../services/store';

interface Props {
  payments: Payment[];
}

export const AdminPayments: React.FC<Props> = ({ payments }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [inspectingPayment, setInspectingPayment] = useState<Payment | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (paymentId: string) => {
    store.reviewPayment(paymentId, 'approved', '', 'admin-001');
    setInspectingPayment(null);
    alert('อนุมัติยอดชำระเงินเรียบร้อยแล้ว สถานะการจองถูกเปลี่ยนเป็น confirmed');
  };

  const handleReject = (paymentId: string) => {
    if (!rejectReason.trim()) {
      alert('กรุณาระบุเหตุผลในการปฏิเสธสลิป (เช่น ยอดเงินไม่ตรง หรือสลิปไม่ชัดเจน)');
      return;
    }
    store.reviewPayment(paymentId, 'rejected', rejectReason.trim(), 'admin-001');
    setInspectingPayment(null);
    setRejectReason('');
    alert('ปฏิเสธรายการชำระเงินเรียบร้อยแล้ว');
  };

  const filtered = payments.filter((p) => {
    if (statusFilter && p.paymentStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.bookingCode.toLowerCase().includes(q) || p.paymentId.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#292929]">
          ตรวจสอบและอนุมัติการชำระเงิน (Payment Review)
        </h2>
        <p className="text-xs text-[#736E6A]">
          ตรวจสอบภาพสลิปการโอนเงิน เปรียบเทียบยอดสุทธิ และอนุมัติรายการคำสั่งเช่าชุด
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8D8D2] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#736E6A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาเลขที่จอง (DRS-)..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <span className="text-xs text-[#736E6A] hidden sm:inline">สถานะ:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl"
          >
            <option value="">ทุกสถานะ ({payments.length})</option>
            <option value="pending">รอการตรวจสอบ (Pending)</option>
            <option value="approved">อนุมัติแล้ว (Approved)</option>
            <option value="rejected">ปฏิเสธ (Rejected)</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-[#E8D8D2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#8B735E] border-b border-[#E8D8D2]">
                <th className="py-3.5 px-4 font-semibold">เลขที่จอง</th>
                <th className="py-3.5 px-4 font-semibold">ยอดเงินที่ต้องชำระ</th>
                <th className="py-3.5 px-4 font-semibold">ธนาคาร & เวลาโอน</th>
                <th className="py-3.5 px-4 font-semibold">ภาพสลิป</th>
                <th className="py-3.5 px-4 font-semibold">สถานะ</th>
                <th className="py-3.5 px-4 font-semibold text-right">การตรวจสอบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8D2]/60">
              {filtered.map((p) => (
                <tr key={p.paymentId} className="hover:bg-[#FAF8F5]/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#8B735E]">
                    {p.bookingCode}
                  </td>
                  <td className="py-3 px-4 font-bold text-sm text-[#292929]">
                    ฿{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[#736E6A]">
                    <span className="text-[#292929] font-medium block">{p.transferBank || 'ธนาคาร'}</span>
                    <span className="text-[10px]">{p.transferTime || p.createdAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div
                      onClick={() => setInspectingPayment(p)}
                      className="cursor-pointer group flex items-center gap-2"
                    >
                      <img
                        src={p.slipUrl}
                        alt="Slip"
                        className="w-9 h-12 object-cover rounded-md border border-[#E8D8D2] group-hover:scale-105 transition"
                      />
                      <span className="text-xs text-[#8B735E] group-hover:underline">เปิดดูสลิป</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {p.paymentStatus === 'approved' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        อนุมัติแล้ว
                      </span>
                    )}
                    {p.paymentStatus === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 animate-pulse">
                        รอตรวจสลิป
                      </span>
                    )}
                    {p.paymentStatus === 'rejected' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                        ปฏิเสธ
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setInspectingPayment(p)}
                      className="px-3 py-1.5 rounded-lg bg-[#8B735E] text-white text-xs font-medium hover:bg-[#6F5B49] transition shadow-2xs"
                    >
                      ตรวจสอบสลิป
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Inspector Workbench Modal */}
      {inspectingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-[#E8D8D2] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8D8D2] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#8B735E] block">
                  {inspectingPayment.bookingCode}
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                  โต๊ะตรวจสอบสลิปการโอนเงิน (Slip Verification Workbench)
                </h3>
              </div>
              <button
                onClick={() => setInspectingPayment(null)}
                className="p-1 rounded-full text-[#736E6A] hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Slip Image Fullview */}
              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8D8D2] flex flex-col items-center">
                <span className="text-[11px] text-[#736E6A] font-medium mb-2 block">
                  ภาพหลักฐานสลิปที่ลูกค้าแนบมา
                </span>
                <div className="max-h-80 overflow-auto rounded-xl shadow-xs border border-[#E8D8D2]">
                  <img
                    src={inspectingPayment.slipUrl}
                    alt="Uploaded Slip"
                    className="w-full object-contain"
                  />
                </div>
              </div>

              {/* Verification Details */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8D8D2] space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-[#736E6A]">เลขที่การจอง:</span>
                    <span className="font-mono font-bold text-[#8B735E]">{inspectingPayment.bookingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736E6A]">ยอดเงินที่ต้องชำระ:</span>
                    <span className="font-bold text-base text-[#292929]">฿{inspectingPayment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736E6A]">ธนาคารปลายทาง:</span>
                    <span className="font-medium text-[#292929]">{inspectingPayment.transferBank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736E6A]">เวลาที่โอน:</span>
                    <span className="text-[#292929]">{inspectingPayment.transferTime}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E8D8D2]/60 pt-2">
                    <span className="text-[#736E6A]">สถานะปัจจุบัน:</span>
                    <span className="font-bold">{inspectingPayment.paymentStatus.toUpperCase()}</span>
                  </div>
                </div>

                {inspectingPayment.paymentStatus === 'pending' && (
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => handleApprove(inspectingPayment.paymentId)}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>อนุมัติการชำระเงิน (Approve Payment)</span>
                    </button>

                    <div className="pt-2 border-t border-[#E8D8D2]/60 space-y-2">
                      <label className="block text-[11px] text-[#736E6A]">
                        หากยอดเงินไม่ตรง หรือสลิปไม่ถูกต้อง ระบุเหตุผล:
                      </label>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="เช่น ยอดเงินโอนไม่ตรงกับบิลจอง..."
                        className="w-full p-2 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs"
                      />
                      <button
                        onClick={() => handleReject(inspectingPayment.paymentId)}
                        className="w-full py-2 bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>ปฏิเสธสลิปนี้ (Reject)</span>
                      </button>
                    </div>
                  </div>
                )}

                {inspectingPayment.paymentStatus !== 'pending' && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 text-center text-xs">
                    รายการนี้ได้รับการตรวจสอบแล้วเมื่อ {inspectingPayment.reviewedAt || 'เร็วๆ นี้'} โดย {inspectingPayment.reviewedBy || 'Admin'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
