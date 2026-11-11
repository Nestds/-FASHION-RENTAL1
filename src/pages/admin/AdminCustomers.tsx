import React, { useState } from 'react';
import { Search, User as UserIcon, Phone, Mail, MapPin, Calendar, Eye, X, Shield } from 'lucide-react';
import { User, Booking } from '../../types';
import { store } from '../../services/store';

interface Props {
  users: User[];
  bookings: Booking[];
}

export const AdminCustomers: React.FC<Props> = ({ users, bookings }) => {
  const [search, setSearch] = useState('');
  const [inspectingUser, setInspectingUser] = useState<User | null>(null);

  const filtered = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q)
    );
  });

  const getUserBookings = (userId: string) => {
    return bookings.filter((b) => b.userId === userId);
  };

  const getUserTotalSpent = (userId: string) => {
    return bookings
      .filter((b) => b.userId === userId && b.bookingStatus !== 'cancelled' && b.bookingStatus !== 'rejected')
      .reduce((sum, b) => sum + b.totalAmount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#292929]">
          รายชื่อสมาชิกและลูกค้า (Customer Directory)
        </h2>
        <p className="text-xs text-[#736E6A]">
          จัดการข้อมูลสมาชิก ตรวจสอบประวัติการจองและยอดการเช่าสะสม
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8D8D2] shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#736E6A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อสมาชิก, อีเมล, เบอร์โทร..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
          />
        </div>

        <span className="text-xs text-[#736E6A]">
          รวมสมาชิก {users.length} บัญชี
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E8D8D2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#8B735E] border-b border-[#E8D8D2]">
                <th className="py-3.5 px-4 font-semibold">ชื่อสมาชิก</th>
                <th className="py-3.5 px-4 font-semibold">อีเมล & เบอร์โทร</th>
                <th className="py-3.5 px-4 font-semibold">ที่อยู่</th>
                <th className="py-3.5 px-4 font-semibold">สิทธิ์ (Role)</th>
                <th className="py-3.5 px-4 font-semibold">คำสั่งจองสะสม</th>
                <th className="py-3.5 px-4 font-semibold">ยอดเช่ารวม</th>
                <th className="py-3.5 px-4 font-semibold text-right">รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8D2]/60">
              {filtered.map((u) => {
                const uBookings = getUserBookings(u.uid);
                const spent = getUserTotalSpent(u.uid);
                return (
                  <tr key={u.uid} className="hover:bg-[#FAF8F5]/40 transition">
                    <td className="py-3 px-4 font-semibold text-[#292929]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#8B735E] text-white flex items-center justify-center font-bold text-xs">
                          {u.fullName.charAt(0)}
                        </div>
                        <span>{u.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[#292929] block">{u.email}</span>
                      <span className="text-[10px] text-[#736E6A]">{u.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-[#736E6A] max-w-xs truncate">
                      {u.address || '-'}
                    </td>
                    <td className="py-3 px-4">
                      {u.role === 'admin' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                          <Shield className="w-3 h-3" />
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8D8D2]/50 text-[#8B735E]">
                          Member
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#292929]">
                      {uBookings.length} ครั้ง
                    </td>
                    <td className="py-3 px-4 font-bold text-[#8B735E]">
                      ฿{spent.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setInspectingUser(u)}
                        className="px-3 py-1.5 rounded-lg border border-[#8B735E] text-[#8B735E] text-xs hover:bg-[#8B735E] hover:text-white transition flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ดูประวัติ</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {inspectingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl border border-[#E8D8D2] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8D8D2] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#8B735E] text-white flex items-center justify-center font-bold text-sm">
                  {inspectingUser.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                    {inspectingUser.fullName}
                  </h3>
                  <span className="text-xs text-[#736E6A]">{inspectingUser.email}</span>
                </div>
              </div>
              <button
                onClick={() => setInspectingUser(null)}
                className="p-1 rounded-full text-[#736E6A] hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Detail Box */}
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8D8D2] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#736E6A]">เบอร์โทร:</span>
                <span className="font-medium text-[#292929]">{inspectingUser.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#736E6A]">ที่อยู่จัดส่ง:</span>
                <span className="text-[#292929] text-right max-w-xs">{inspectingUser.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#736E6A]">วันที่ลงทะเบียน:</span>
                <span className="text-[#292929]">{new Date(inspectingUser.createdAt).toLocaleDateString('th-TH')}</span>
              </div>
            </div>

            {/* Bookings history by this user */}
            <div className="space-y-3">
              <h4 className="font-semibold text-xs text-[#292929] uppercase tracking-wider">
                ประวัติการจองชุดของลูกค้ารายนี้ ({getUserBookings(inspectingUser.uid).length} รายการ)
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {getUserBookings(inspectingUser.uid).map((b) => (
                  <div
                    key={b.bookingId}
                    className="p-3 bg-white rounded-xl border border-[#E8D8D2] flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-[#8B735E]">{b.bookingCode}</span>
                      <span className="text-[10px] text-[#736E6A] block">{b.startDate} ถึง {b.endDate}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#292929] block">฿{b.totalAmount.toLocaleString()}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8D8D2]/50 text-[#8B735E]">
                        {b.bookingStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingUser(null)}
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
