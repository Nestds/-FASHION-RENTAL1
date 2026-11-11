import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Eye,
  X,
  Calendar,
  User as UserIcon,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { Booking } from '../../types';
import { store } from '../../services/store';

interface Props {
  bookings: Booking[];
}

export const AdminBookings: React.FC<Props> = ({ bookings }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleUpdateStatus = (bookingId: string, status: Booking['bookingStatus']) => {
    store.updateBookingStatus(bookingId, status);
    if (selectedBooking && selectedBooking.bookingId === bookingId) {
      setSelectedBooking({
        ...selectedBooking,
        bookingStatus: status,
      });
    }
  };

  const filtered = bookings.filter((b) => {
    if (statusFilter && b.bookingStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        b.bookingCode.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: Booking['bookingStatus']) => {
    switch (status) {
      case 'pending_payment':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">รอชำระเงิน</span>;
      case 'payment_review':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">รอตรวจสอบสลิป</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">ยืนยันการจองแล้ว</span>;
      case 'in_rental':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800">กำลังเช่าชุด</span>;
      case 'returned':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">ส่งคืนชุดแล้ว</span>;
      case 'completed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800">เสร็จสิ้นสมบูรณ์</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800">ยกเลิก/ปฏิเสธ</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#292929]">
          จัดการรายการจองชุด (Booking Management)
        </h2>
        <p className="text-xs text-[#736E6A]">
          ตรวจสอบรายการจอง อนุมัติ ปรับสถานะการจัดส่ง และตรวจรับการส่งคืนชุด
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
            placeholder="ค้นหาเลขที่จอง, ชื่อลูกค้า, เบอร์โทร..."
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
            <option value="">ทุกสถานะ ({bookings.length})</option>
            <option value="pending_payment">รอชำระเงิน</option>
            <option value="payment_review">รอตรวจสอบสลิป</option>
            <option value="confirmed">ยืนยันแล้ว</option>
            <option value="in_rental">กำลังเช่าชุด</option>
            <option value="returned">ส่งคืนแล้ว</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-[#E8D8D2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#8B735E] border-b border-[#E8D8D2]">
                <th className="py-3.5 px-4 font-semibold">เลขที่จอง</th>
                <th className="py-3.5 px-4 font-semibold">ชื่อลูกค้า & ติดต่อ</th>
                <th className="py-3.5 px-4 font-semibold">กำหนดวันเช่า - วันคืน</th>
                <th className="py-3.5 px-4 font-semibold">ยอดเช่ารวม</th>
                <th className="py-3.5 px-4 font-semibold">เงินประกัน</th>
                <th className="py-3.5 px-4 font-semibold">สถานะ</th>
                <th className="py-3.5 px-4 font-semibold text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8D2]/60">
              {filtered.map((b) => (
                <tr key={b.bookingId} className="hover:bg-[#FAF8F5]/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-[#8B735E]">
                    {b.bookingCode}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#292929] block">{b.customerName}</span>
                    <span className="text-[10px] text-[#736E6A]">{b.customerPhone}</span>
                  </td>
                  <td className="py-3 px-4 text-[#736E6A]">
                    <span className="text-[#292929] font-medium block">
                      {b.startDate} ถึง {b.endDate}
                    </span>
                    <span className="text-[10px]">รวม {b.rentalDays} วัน</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#8B735E]">
                    ฿{b.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[#736E6A]">
                    ฿{b.deposit.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(b.bookingStatus)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-3 py-1.5 rounded-lg border border-[#8B735E] text-[#8B735E] text-xs hover:bg-[#8B735E] hover:text-white transition flex items-center gap-1 ml-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>จัดการ</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail & Status Update Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-[#E8D8D2] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8D8D2] pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#8B735E] block">
                  {selectedBooking.bookingCode}
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                  รายละเอียดคำสั่งจองชุด
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full text-[#736E6A] hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8D8D2] space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-[#E8D8D2]/60 pb-2">
                <span className="text-[#736E6A]">สถานะปัจจุบัน:</span>
                <div>{getStatusBadge(selectedBooking.bookingStatus)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#736E6A] block">ชื่อลูกค้า:</span>
                  <span className="font-semibold text-[#292929]">{selectedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-[#736E6A] block">เบอร์โทรติดต่อ:</span>
                  <span className="font-semibold text-[#292929]">{selectedBooking.customerPhone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#736E6A] block">ที่อยู่จัดส่ง:</span>
                  <span className="text-[#292929]">{selectedBooking.shippingAddress}</span>
                </div>
                <div>
                  <span className="text-[#736E6A] block">ระยะเวลาเช่า:</span>
                  <span className="font-medium text-[#292929]">
                    {selectedBooking.startDate} ถึง {selectedBooking.endDate} ({selectedBooking.rentalDays} วัน)
                  </span>
                </div>
                <div>
                  <span className="text-[#736E6A] block">ยอดชำระสุทธิ:</span>
                  <span className="font-bold text-[#8B735E]">฿{selectedBooking.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="pt-2 border-t border-[#E8D8D2]/60">
                  <span className="text-[#736E6A] block">หมายเหตุจากลูกค้า:</span>
                  <p className="text-[#292929] italic">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {/* Change Status Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#292929] uppercase tracking-wider block">
                เปลี่ยนสถานะการจอง (Update Booking Status):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.bookingId, 'confirmed')}
                  className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 font-medium hover:bg-emerald-100 transition flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ยืนยันการจอง</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.bookingId, 'in_rental')}
                  className="p-2.5 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-800 font-medium hover:bg-indigo-100 transition flex items-center justify-center gap-1"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>จัดส่งชุดแล้ว</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.bookingId, 'returned')}
                  className="p-2.5 rounded-xl border border-blue-300 bg-blue-50 text-blue-800 font-medium hover:bg-blue-100 transition flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>รับคืนชุดแล้ว</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.bookingId, 'completed')}
                  className="p-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-800 font-medium hover:bg-gray-100 transition flex items-center justify-center gap-1"
                >
                  <span>เสร็จสิ้นคำสั่ง</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.bookingId, 'cancelled')}
                  className="p-2.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 font-medium hover:bg-rose-100 transition flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>ยกเลิกคำสั่ง</span>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D8D2] flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2 bg-[#8B735E] text-white rounded-xl text-xs font-medium"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
