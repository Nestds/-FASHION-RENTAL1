import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Calendar,
  CreditCard,
  RotateCcw,
  Users,
  BarChart3,
  CheckSquare,
  Database,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Shield,
  Sparkles,
  Plus,
  ShoppingBag
} from 'lucide-react';
import { User, Product, Category, Size, Booking, Payment, RentalReturn } from '../../types';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminBookings } from './AdminBookings';
import { AdminPayments } from './AdminPayments';
import { AdminReturns } from './AdminReturns';
import { AdminCustomers } from './AdminCustomers';
import { AdminReports } from './AdminReports';
import { AdminTestSuite } from './AdminTestSuite';

interface Props {
  currentUser: User;
  products: Product[];
  categories: Category[];
  sizes: Size[];
  bookings: Booking[];
  payments: Payment[];
  returns: RentalReturn[];
  users: User[];
  onOpenFirebaseGuide: () => void;
  onExitAdmin: () => void;
  onLogout: () => void;
}

export const AdminLayout: React.FC<Props> = ({
  currentUser,
  products,
  categories,
  sizes,
  bookings,
  payments,
  returns,
  users,
  onOpenFirebaseGuide,
  onExitAdmin,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [triggerAddProduct, setTriggerAddProduct] = useState<boolean>(false);

  const pendingPaymentsCount = payments.filter((p) => p.paymentStatus === 'pending').length;
  const activeRentalsCount = bookings.filter((b) => b.bookingStatus === 'in_rental').length;

  const menuItems = [
    { id: 'overview', label: 'ภาพรวมระบบ (Overview)', icon: LayoutDashboard },
    { id: 'products', label: `จัดการสินค้าในร้าน (${products.length})`, icon: Package, highlight: true },
    { id: 'bookings', label: `รายการจอง (${bookings.length})`, icon: Calendar },
    {
      id: 'payments',
      label: 'ตรวจสอบสลิปโอนเงิน',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined,
    },
    {
      id: 'returns',
      label: 'จัดการการคืนชุด & ประกัน',
      icon: RotateCcw,
      badge: activeRentalsCount > 0 ? activeRentalsCount : undefined,
    },
    { id: 'customers', label: `สมาชิกร้าน (${users.length})`, icon: Users },
    { id: 'reports', label: 'รายงานยอด & Export CSV', icon: BarChart3 },
    { id: 'test_suite', label: 'ชุดทดสอบระบบ 14 ข้อ', icon: CheckSquare },
  ];

  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const handleOpenAddProductFromHeader = () => {
    setActiveTab('products');
    setTriggerAddProduct(true);
    // reset flag after tick so subsequent clicks work
    setTimeout(() => setTriggerAddProduct(false), 500);
  };

  return (
    <div className="min-h-screen bg-[#FDF9F9] flex flex-col lg:flex-row">
      {/* Top Persistent Bar for Quick Actions (Visible across devices) */}
      <header className="lg:hidden bg-white border-b border-[#EED8DC] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-xl text-[#7E6D70] hover:bg-[#FDF9F9] border border-[#EED8DC]"
            title="เปิดเมนูผู้ดูแลระบบ"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-serif-luxury font-bold text-base text-[#2C2123]">DRESSÉ</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#FAD5DA] text-[#782834] font-bold">
              ADMIN
            </span>
          </div>
        </div>

        <button
          onClick={handleOpenAddProductFromHeader}
          className="px-3 py-1.5 bg-[#B26571] hover:bg-[#8F4954] text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>+ เพิ่มสินค้า</span>
        </button>
      </header>

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-[#EED8DC] flex flex-col justify-between p-6 transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="space-y-1 pb-4 border-b border-[#EED8DC]/60">
            <div className="flex items-center justify-between">
              <span className="font-serif-luxury text-2xl font-bold tracking-[0.15em] text-[#2C2123]">
                DRESSÉ
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAD5DA] text-[#782834] font-bold">
                ADMIN
              </span>
            </div>
            <p className="text-[10px] tracking-wider text-[#B26571] uppercase font-semibold">
              Management Portal
            </p>
          </div>

          {/* Quick Add Product Button in Sidebar */}
          <button
            onClick={handleOpenAddProductFromHeader}
            className="w-full py-2.5 px-3.5 bg-gradient-to-r from-[#B26571] to-[#8F4954] text-white rounded-2xl text-xs font-bold transition shadow-rose-glow flex items-center justify-center gap-2 hover:opacity-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ เพิ่มสินค้าใหม่ (Add Product)</span>
          </button>

          {/* Nav List */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#B26571] text-white shadow-xs'
                      : 'text-[#2C2123] hover:bg-[#FDF9F9]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7E6D70]'}`} />
                    <span className={item.highlight ? 'font-semibold' : ''}>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white text-[#B26571]'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="space-y-2 pt-4 border-t border-[#EED8DC]/60 text-xs">
          <button
            onClick={onOpenFirebaseGuide}
            className="w-full py-2 px-3 rounded-xl bg-[#FDF9F9] border border-[#EED8DC] hover:bg-[#F7ECEE] text-[#B26571] flex items-center gap-2 transition cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-[#D48C95]" />
            <span>Firebase Diagnostics</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="w-full py-2 px-3 rounded-xl border border-[#EED8DC] hover:bg-[#FDF9F9] text-[#2C2123] flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#7E6D70]" />
            <span>กลับหน้าเว็บไซต์ลูกค้า</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Persistent Desktop Top Bar */}
        <div className="hidden lg:flex items-center justify-between pb-6 mb-6 border-b border-[#EED8DC]/60">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#7E6D70]">โหมดผู้ดูแลระบบ:</span>
            <span className="text-xs font-bold text-[#2C2123] bg-white px-3 py-1 rounded-full border border-[#EED8DC]">
              {currentUser.fullName} ({currentUser.email})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#B26571] text-white border-[#B26571]'
                  : 'bg-white text-[#2C2123] border-[#EED8DC] hover:bg-[#FDF9F9]'
              }`}
            >
              👗 สินค้าในร้าน ({products.length})
            </button>
            <button
              onClick={handleOpenAddProductFromHeader}
              className="px-4 py-1.5 bg-[#B26571] hover:bg-[#8F4954] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ เพิ่มสินค้าใหม่</span>
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <AdminOverview
            onNavigateTab={(tab) => {
              if (tab === 'add_product') {
                setActiveTab('products');
                setTriggerAddProduct(true);
              } else {
                setActiveTab(tab);
              }
            }}
          />
        )}
        {activeTab === 'products' && (
          <AdminProducts
            products={products}
            categories={categories}
            sizes={sizes}
            initialOpenAdd={triggerAddProduct}
          />
        )}
        {activeTab === 'bookings' && (
          <AdminBookings bookings={bookings} />
        )}
        {activeTab === 'payments' && (
          <AdminPayments payments={payments} />
        )}
        {activeTab === 'returns' && (
          <AdminReturns returns={returns} bookings={bookings} />
        )}
        {activeTab === 'customers' && (
          <AdminCustomers users={users} bookings={bookings} />
        )}
        {activeTab === 'reports' && (
          <AdminReports />
        )}
        {activeTab === 'test_suite' && (
          <AdminTestSuite />
        )}
      </main>
    </div>
  );
};
