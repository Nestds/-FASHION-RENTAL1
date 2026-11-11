import React from 'react';
import {
  TrendingUp,
  Package,
  Users,
  Calendar,
  CreditCard,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { store } from '../../services/store';

interface Props {
  onNavigateTab: (tab: string) => void;
}

export const AdminOverview: React.FC<Props> = ({ onNavigateTab }) => {
  const stats = store.getDashboardStats();
  const bookings = store.getAllBookings();
  const pendingPayments = store.getAllPayments().filter((p) => p.paymentStatus === 'pending');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#B26571] to-[#8F4954] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-rose-glow">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#FAD5DA]">
            <Sparkles className="w-4 h-4 text-[#FAD5DA]" />
            <span>DRESSÉ Executive Management Portal</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold">
            ภาพรวมระบบจัดการร้าน (Dashboard Overview)
          </h2>
          <p className="text-xs text-[#FFF5F6]/85">
            ข้อมูลแบบเรียลไทม์เชื่อมต่อฐานข้อมูล Cloud Firestore
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigateTab('payments')}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-medium backdrop-blur-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>ตรวจสลิป ({pendingPayments.length})</span>
          </button>
          <button
            onClick={() => onNavigateTab('add_product')}
            className="px-4 py-2 bg-white text-[#B26571] hover:bg-[#FDF4F5] rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ เพิ่มสินค้าใหม่เข้าสู่ร้าน</span>
          </button>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-white p-5 rounded-3xl border border-[#EED8DC] shadow-card-soft hover:border-[#B26571] cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-[#F7ECEE] text-[#B26571]">
              <Package className="w-4 h-4" />
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#7E6D70]" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[#2C2123] tabular-nums">{stats.totalProducts}</span>
            <span className="text-[11px] text-[#7E6D70] block">ชุดทั้งหมดในระบบ</span>
          </div>
        </div>

        {/* 2. Total Members */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="bg-white p-5 rounded-3xl border border-[#EED8DC] shadow-card-soft hover:border-[#B26571] cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#7E6D70]" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[#2C2123] tabular-nums">{stats.totalMembers}</span>
            <span className="text-[11px] text-[#7E6D70] block">สมาชิกทั้งหมด</span>
          </div>
        </div>

        {/* 3. Total Bookings */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="bg-white p-5 rounded-3xl border border-[#EED8DC] shadow-card-soft hover:border-[#B26571] cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Calendar className="w-4 h-4" />
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#7E6D70]" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[#2C2123] tabular-nums">{stats.totalBookings}</span>
            <span className="text-[11px] text-[#7E6D70] block">รายการจองทั้งหมด</span>
          </div>
        </div>

        {/* 4. Pending Bookings */}
        <div
          onClick={() => onNavigateTab('bookings')}
          className="bg-white p-5 rounded-3xl border border-[#EED8DC] shadow-card-soft hover:border-[#B26571] cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">รอชำระ</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#2C2123] tabular-nums">{stats.pendingBookings}</span>
            <span className="text-[11px] text-[#7E6D70] block">รอชำระเงิน</span>
          </div>
        </div>

        {/* 5. Pending Payments */}
        <div
          onClick={() => onNavigateTab('payments')}
          className="bg-white p-5 rounded-3xl border border-[#EED8DC] shadow-card-soft hover:border-[#B26571] cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <CreditCard className="w-4 h-4" />
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">รอตรวจ</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#2C2123] tabular-nums">{stats.pendingPayments}</span>
            <span className="text-[11px] text-[#7E6D70] block">สลิปรออนุมัติ</span>
          </div>
        </div>

        {/* 6. Total Revenue */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white p-5 rounded-3xl border border-[#EED8DC] shadow-card-soft hover:border-[#B26571] cursor-pointer transition space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-[#F7ECEE] text-[#B26571]">
              <TrendingUp className="w-4 h-4" />
            </span>
            <span className="text-[10px] text-[#B26571] font-bold">THB</span>
          </div>
          <div>
            <span className="text-xl font-bold text-[#B26571] tabular-nums">฿{stats.totalRevenue.toLocaleString()}</span>
            <span className="text-[11px] text-[#7E6D70] block">รายได้สะสมที่อนุมัติ</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Monthly Chart & Popular Dresses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monthly Revenue Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#EED8DC] shadow-card-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#2C2123]">
                สถิติรายได้และจำนวนการจองรายเดือน
              </h3>
              <p className="text-xs text-[#7E6D70]">สรุปยอดเช่าชุดรอบ 4 เดือนล่าสุด</p>
            </div>
            <span className="text-xs font-semibold text-[#B26571]">ปี 2026</span>
          </div>

          <div className="pt-4 space-y-5">
            {stats.monthlyData.map((m) => {
              const maxRev = 100000;
              const widthPct = Math.min(100, Math.round((m.revenue / maxRev) * 100));
              return (
                <div key={m.month} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-[#2C2123]">{m.month}</span>
                    <span className="text-[#B26571] font-bold tabular-nums">
                      ฿{m.revenue.toLocaleString()}{' '}
                      <span className="font-normal text-[#7E6D70]">({m.bookings} ออเดอร์)</span>
                    </span>
                  </div>
                  <div className="h-3.5 bg-[#FDF9F9] rounded-full overflow-hidden border border-[#EED8DC]/60">
                    <div
                      className="h-full bg-gradient-to-r from-[#D48C95] to-[#B26571] rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(10, widthPct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#EED8DC]/60 flex items-center justify-between text-xs text-[#7E6D70]">
            <span>ดึงข้อมูลจาก Collections: <strong>bookings, payments</strong></span>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-[#B26571] hover:underline font-medium"
            >
              ดูรายงานละเอียด & ส่งออก CSV →
            </button>
          </div>
        </div>

        {/* Top Rented Dresses (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EED8DC] shadow-card-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#2C2123]">
                ชุดยอดนิยมที่มีการเช่าสูงสุด
              </h3>
              <p className="text-xs text-[#7E6D70]">จัดอันดับตามจำนวนครั้งที่จอง</p>
            </div>
            <ShoppingBag className="w-5 h-5 text-[#B26571]" />
          </div>

          <div className="space-y-3">
            {stats.topDresses.map((dress, idx) => (
              <div
                key={dress.productId}
                className="p-3 bg-[#FDF9F9] rounded-2xl border border-[#EED8DC]/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="w-6 h-6 rounded-full bg-white border border-[#EED8DC] flex items-center justify-center font-bold text-[#B26571] text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <img
                    src={dress.images[0]}
                    alt=""
                    className="w-10 aspect-3/4 rounded-lg object-cover shrink-0"
                  />
                  <div className="truncate">
                    <h5 className="font-semibold text-[#2C2123] truncate">{dress.name}</h5>
                    <span className="text-[10px] text-[#7E6D70]">{dress.productCode} • ฿{dress.rentalPrice.toLocaleString()}/วัน</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-[#B26571] block tabular-nums">{dress.rentalCount || 10}</span>
                  <span className="text-[10px] text-[#7E6D70]">ครั้ง</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="w-full py-2.5 bg-[#FDF9F9] border border-[#EED8DC] hover:bg-[#F7ECEE] text-[#B26571] text-xs font-semibold rounded-xl transition"
          >
            จัดการคลังสินค้าทั้งหมด (Product Inventory)
          </button>
        </div>
      </div>
    </div>
  );
};
