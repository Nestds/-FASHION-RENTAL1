import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  Shield,
  Calendar,
  Database,
  ChevronDown
} from 'lucide-react';
import { User } from '../types';

interface Props {
  currentUser: User | null;
  currentPath: string;
  onNavigate: (path: string, params?: Record<string, any>) => void;
  favoritesCount: number;
  onOpenFirebaseGuide: () => void;
  onSwitchRole: (role: 'admin' | 'member') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<Props> = ({
  currentUser,
  currentPath,
  onNavigate,
  favoritesCount,
  onOpenFirebaseGuide,
  onSwitchRole,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: 'home' },
    { label: 'Collection', path: 'collection' },
    { label: 'Categories', path: 'collection', params: { scrollToCategories: true } },
    { label: 'About Us', path: 'home', params: { scrollToAbout: true } },
    { label: 'Contact', path: 'contact' },
  ];

  const handleLinkClick = (path: string, params?: Record<string, any>) => {
    onNavigate(path, params);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDF9F9]/92 backdrop-blur-md border-b border-[#EED8DC]/80 transition">
      {/* Top Rose Announcement Bar */}
      <div className="bg-[#B26571] text-[#FFF5F6] text-xs py-1.5 px-4 text-center flex items-center justify-between font-light">
        <div className="hidden sm:flex items-center gap-2 mx-auto text-[11px] tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#FAD5DA]" />
          <span>DRESSÉ Haute Couture Evening Dress Rental • ส่งตรงชุดราตรีหรูระดับพรีเมียมทั่วประเทศ</span>
          <span className="opacity-60">|</span>
          <span className="text-[#FAD5DA] font-normal">โค้ด WELCOME500 รับส่วนลด 500 บาท สำหรับลูกค้าใหม่</span>
        </div>

        {/* Quick Testing Role Switcher */}
        <div className="flex items-center gap-1.5 text-[11px] ml-auto">
          <span className="hidden md:inline text-white/80">ทดสอบระบบ:</span>
          <button
            onClick={() => onSwitchRole('member')}
            className={`px-2.5 py-0.5 rounded-md text-[10px] transition ${
              currentUser?.role === 'member'
                ? 'bg-white text-[#B26571] font-semibold shadow-xs'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Member Demo
          </button>
          <button
            onClick={() => onSwitchRole('admin')}
            className={`px-2.5 py-0.5 rounded-md text-[10px] transition flex items-center gap-1 ${
              currentUser?.role === 'admin'
                ? 'bg-[#FAD5DA] text-[#782834] font-semibold shadow-xs'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Shield className="w-2.5 h-2.5" />
            Admin Demo
          </button>
        </div>
      </div>

      {/* Main Navbar - 3-Zone Strict Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div
            onClick={() => handleLinkClick('home')}
            className="cursor-pointer group flex flex-col items-start sm:items-center select-none shrink-0"
          >
            <span className="font-serif-luxury text-3xl sm:text-4xl font-normal tracking-[0.22em] text-[#2C2123] group-hover:text-[#B26571] transition duration-300">
              DRESSÉ
            </span>
            <span className="text-[9px] tracking-[0.38em] text-[#B26571] uppercase -mt-1 font-medium">
              Haute Couture Rental
            </span>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line typography) */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs tracking-wider uppercase">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleLinkClick(link.path, link.params)}
                className={`relative py-1.5 transition-colors duration-200 whitespace-nowrap shrink-0 hover:text-[#B26571] ${
                  currentPath === link.path && !link.params
                    ? 'text-[#B26571] font-semibold'
                    : 'text-[#4A3B3E] font-medium'
                }`}
              >
                {link.label}
                {currentPath === link.path && !link.params && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B26571] rounded-full"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions & Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
            {/* Firebase Diagnostics Button */}
            <button
              onClick={onOpenFirebaseGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#EED8DC] bg-white text-[#B26571] hover:bg-[#F7ECEE] transition shadow-xs"
              title="ตรวจสอบสถาปัตยกรรม Firebase & Security Rules"
            >
              <Database className="w-3.5 h-3.5 text-[#D48C95]" />
              <span className="hidden sm:inline">Firebase Status</span>
            </button>

            {/* Wishlist / Favorites */}
            <button
              onClick={() => onNavigate('account', { tab: 'favorites' })}
              className="relative p-2 text-[#4A3B3E] hover:text-[#B26571] transition rounded-full hover:bg-white"
              title="ชุดที่บันทึกไว้"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B26571] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth State */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pl-3 rounded-full bg-white border border-[#EED8DC] hover:border-[#B26571] transition shadow-xs"
                >
                  <div className="w-7 h-7 rounded-full bg-[#B26571] text-white flex items-center justify-center text-xs font-semibold">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <span className="text-xs font-medium text-[#2C2123] max-w-[100px] truncate hidden sm:inline">
                    {currentUser.fullName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7E6D70]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#EED8DC] py-2 z-50 text-xs text-[#2C2123] animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-[#EED8DC]/60">
                      <p className="font-semibold text-sm truncate">{currentUser.fullName}</p>
                      <p className="text-[#7E6D70] text-[11px] truncate">{currentUser.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                        currentUser.role === 'admin'
                          ? 'bg-[#FAD5DA] text-[#782834]'
                          : 'bg-[#F7ECEE] text-[#B26571]'
                      }`}>
                        Role: {currentUser.role}
                      </span>
                    </div>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#FDF9F9] text-[#B26571] font-semibold flex items-center gap-2.5 transition"
                      >
                        <Shield className="w-4 h-4 text-[#B26571]" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('account', { tab: 'profile' });
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FDF9F9] flex items-center gap-2.5 transition"
                    >
                      <UserIcon className="w-4 h-4 text-[#7E6D70]" />
                      <span>โปรไฟล์ของฉัน</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('account', { tab: 'bookings' });
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FDF9F9] flex items-center gap-2.5 transition"
                    >
                      <Calendar className="w-4 h-4 text-[#7E6D70]" />
                      <span>รายการจองของฉัน (My Bookings)</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('account', { tab: 'favorites' });
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FDF9F9] flex items-center gap-2.5 transition"
                    >
                      <Heart className="w-4 h-4 text-[#7E6D70]" />
                      <span>ชุดที่บันทึกไว้ ({favoritesCount})</span>
                    </button>

                    <div className="border-t border-[#EED8DC]/60 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-2 text-xs font-medium text-[#4A3B3E] hover:text-[#B26571] transition"
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 rounded-full bg-[#B26571] text-white text-xs font-medium hover:bg-[#8F4954] transition shadow-xs"
                >
                  สมัครสมาชิก
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2C2123] hover:bg-white rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EED8DC] px-6 py-4 space-y-3 shadow-xl">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => handleLinkClick(link.path, link.params)}
              className="block w-full text-left py-2 text-sm text-[#2C2123] font-medium hover:text-[#B26571]"
            >
              {link.label}
            </button>
          ))}

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleLinkClick('admin')}
              className="block w-full text-left py-2 text-sm text-[#B26571] font-semibold flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
