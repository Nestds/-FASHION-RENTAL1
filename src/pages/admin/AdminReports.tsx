import React, { useState } from 'react';
import {
  Download,
  Calendar,
  TrendingUp,
  FileSpreadsheet,
  Package,
  Users,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { store } from '../../services/store';

export const AdminReports: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('2026-10-01');
  const [dateTo, setDateTo] = useState('2026-12-31');

  const stats = store.getDashboardStats();
  const bookings = store.getAllBookings();
  const payments = store.getAllPayments();
  const products = store.getProducts();
  const users = store.getAllUsers();

  // Export CSV function
  const handleExportCSV = (type: 'revenue' | 'bookings' | 'products') => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'; // include BOM for Thai character support in Excel

    if (type === 'bookings') {
      csvContent += 'BookingCode,CustomerName,Phone,StartDate,EndDate,RentalDays,Subtotal,Discount,Deposit,TotalAmount,Status\n';
      bookings.forEach((b) => {
        csvContent += `"${b.bookingCode}","${b.customerName}","${b.customerPhone}","${b.startDate}","${b.endDate}",${b.rentalDays},${b.subtotal},${b.discount},${b.deposit},${b.totalAmount},"${b.bookingStatus}"\n`;
      });
    } else if (type === 'revenue') {
      csvContent += 'PaymentID,BookingCode,Amount,Method,Bank,Status,Date\n';
      payments.forEach((p) => {
        csvContent += `"${p.paymentId}","${p.bookingCode}",${p.amount},"${p.paymentMethod}","${p.transferBank || ''}","${p.paymentStatus}","${p.createdAt}"\n`;
      });
    } else {
      csvContent += 'ProductCode,Name,Category,RentalPricePerDay,Deposit,TotalStock,RentalCount\n';
      products.forEach((p) => {
        const stock = p.sizes.reduce((sum, s) => sum + s.quantity, 0);
        csvContent += `"${p.productCode}","${p.name}","${p.categoryName || ''}",${p.rentalPrice},${p.depositPrice},${stock},${p.rentalCount || 0}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dresse_report_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#292929]">
            รายงานและสถิติธุรกิจ (Reports & Export)
          </h2>
          <p className="text-xs text-[#736E6A]">
            สรุปข้อมูลรายได้ ปริมาณการเช่า อัตราการใช้งานชุด และดาวน์โหลดไฟล์ CSV
          </p>
        </div>

        {/* Date Filter & Export All */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E8D8D2] text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#8B735E]" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-transparent text-xs text-[#292929] focus:outline-hidden"
            />
            <span className="text-[#736E6A]">ถึง</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-transparent text-xs text-[#292929] focus:outline-hidden"
            />
          </div>

          <button
            onClick={() => handleExportCSV('bookings')}
            className="px-4 py-2 bg-[#8B735E] hover:bg-[#6F5B49] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export Bookings CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8D8D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#8B735E]">
            <TrendingUp className="w-5 h-5" />
            <button
              onClick={() => handleExportCSV('revenue')}
              className="text-[11px] hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>CSV</span>
            </button>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#292929]">฿{stats.totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-[#736E6A] block">รายได้รวมที่อนุมัติ</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8D8D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-600">
            <Calendar className="w-5 h-5" />
            <button
              onClick={() => handleExportCSV('bookings')}
              className="text-[11px] text-[#8B735E] hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>CSV</span>
            </button>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#292929]">{bookings.length}</span>
            <span className="text-xs text-[#736E6A] block">จำนวนการจองทั้งหมด</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8D8D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-600">
            <Package className="w-5 h-5" />
            <button
              onClick={() => handleExportCSV('products')}
              className="text-[11px] text-[#8B735E] hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>CSV</span>
            </button>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#292929]">{products.length}</span>
            <span className="text-xs text-[#736E6A] block">แบบชุดในคลังสินค้า</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8D8D2] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-purple-600">
            <Users className="w-5 h-5" />
            <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#292929]">{users.length}</span>
            <span className="text-xs text-[#736E6A] block">สมาชิกลงทะเบียน</span>
          </div>
        </div>
      </div>

      {/* Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Dresses Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8D8D2] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8D8D2] pb-3">
            <h3 className="font-serif-luxury text-lg font-bold text-[#292929]">
              รายงานชุดราตรีที่มีอัตราการเช่าสูงสุด
            </h3>
            <button
              onClick={() => handleExportCSV('products')}
              className="text-xs text-[#8B735E] hover:underline flex items-center gap-1 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="space-y-3">
            {stats.topDresses.map((dress) => {
              const estRevenue = (dress.rentalCount || 10) * dress.rentalPrice * 3;
              return (
                <div
                  key={dress.productId}
                  className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8D2]/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={dress.images[0]} alt="" className="w-9 aspect-3/4 rounded-md object-cover" />
                    <div>
                      <span className="font-semibold text-[#292929] block">{dress.name}</span>
                      <span className="text-[10px] text-[#736E6A]">{dress.productCode} • ฿{dress.rentalPrice.toLocaleString()}/วัน</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#8B735E] block">฿{estRevenue.toLocaleString()}</span>
                    <span className="text-[10px] text-[#736E6A]">เช่า {dress.rentalCount} ครั้ง</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export Data Center */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8D8D2] shadow-sm space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-[#292929] border-b border-[#E8D8D2] pb-3">
            ศูนย์ส่งออกข้อมูลสำหรับรายงานและนำเสนอ (Export Center)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8D8D2] flex items-center justify-between">
              <div>
                <h5 className="font-semibold text-[#292929]">รายงานรายการจองทั้งหมด (Bookings Report)</h5>
                <p className="text-[11px] text-[#736E6A] mt-0.5">รวมรหัสการจอง ลูกค้า วันเริ่ม-วันคืน ยอดเงิน และสถานะ</p>
              </div>
              <button
                onClick={() => handleExportCSV('bookings')}
                className="px-4 py-2 bg-white border border-[#8B735E] text-[#8B735E] hover:bg-[#8B735E] hover:text-white rounded-xl font-medium transition"
              >
                ดาวน์โหลด CSV
              </button>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8D8D2] flex items-center justify-between">
              <div>
                <h5 className="font-semibold text-[#292929]">รายงานประวัติการชำระเงิน (Payments Report)</h5>
                <p className="text-[11px] text-[#736E6A] mt-0.5">รายการโอนเงิน ธนาคาร ยอดเงิน และการอนุมัติสลิป</p>
              </div>
              <button
                onClick={() => handleExportCSV('revenue')}
                className="px-4 py-2 bg-white border border-[#8B735E] text-[#8B735E] hover:bg-[#8B735E] hover:text-white rounded-xl font-medium transition"
              >
                ดาวน์โหลด CSV
              </button>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8D8D2] flex items-center justify-between">
              <div>
                <h5 className="font-semibold text-[#292929]">รายงานสต็อกสินค้าและราคา (Inventory Report)</h5>
                <p className="text-[11px] text-[#736E6A] mt-0.5">รหัสชุด ชื่อ ราคาเช่า เงินประกัน และจำนวนคงเหลือ</p>
              </div>
              <button
                onClick={() => handleExportCSV('products')}
                className="px-4 py-2 bg-white border border-[#8B735E] text-[#8B735E] hover:bg-[#8B735E] hover:text-white rounded-xl font-medium transition"
              >
                ดาวน์โหลด CSV
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
