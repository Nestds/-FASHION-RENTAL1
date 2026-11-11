import React, { useState } from 'react';
import {
  User as UserIcon,
  Calendar,
  CreditCard,
  History,
  Heart,
  Lock,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Star,
  X,
  Eye
} from 'lucide-react';
import { User, Booking, Payment, RentalReturn, Product } from '../types';
import { store } from '../services/store';

interface Props {
  currentUser: User;
  initialTab?: string;
  onNavigateToPayment: (booking: Booking) => void;
  onSelectProduct: (productId: string) => void;
  onLogout: () => void;
}

export const MyAccountPage: React.FC<Props> = ({
  currentUser,
  initialTab = 'profile',
  onNavigateToPayment,
  onSelectProduct,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Profile Form state
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phone, setPhone] = useState(currentUser.phone);
  const [address, setAddress] = useState(currentUser.address);
  const [profileSaved, setProfileSaved] = useState(false);

  // Password Form state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // Slip modal state
  const [viewingSlipUrl, setViewingSlipUrl] = useState<string | null>(null);

  // Review modal state
  const [reviewModalProduct, setReviewModalProduct] = useState<{ id: string; name: string; bookingId: string } | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // Data queries strictly filtered by currentUser.uid
  const myBookings = store.getUserBookings(currentUser.uid);
  const myPayments = store.getAllPayments().filter((p) => p.userId === currentUser.uid);
  const myCompletedRentals = myBookings.filter((b) => b.bookingStatus === 'completed' || b.bookingStatus === 'returned');
  const favoriteProductIds = store.getFavorites(currentUser.uid);
  const favoriteProducts = store.getProducts().filter((p) => favoriteProductIds.includes(p.productId));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateUserProfile(currentUser.uid, {
      fullName,
      phone,
      address,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('');
    if (!newPass || newPass.length < 6) {
      setPassMsg('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (newPass !== confirmNewPass) {
      setPassMsg('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    setPassMsg('เปลี่ยนรหัสผ่านสำเร็จเรียบร้อย');
    setCurrentPass('');
    setNewPass('');
    setConfirmNewPass('');
  };

  const handleSubmitReview = () => {
    if (!reviewModalProduct || !reviewComment.trim()) {
      alert('กรุณากรอกความคิดเห็นสำหรับชุดนี้');
      return;
    }
    store.addReview({
      userId: currentUser.uid,
      userName: currentUser.fullName,
      productId: reviewModalProduct.id,
      productName: reviewModalProduct.name,
      bookingId: reviewModalProduct.bookingId,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    alert('บันทึกรีวิวของคุณเรียบร้อยแล้ว ขอบคุณสำหรับความคิดเห็นค่ะ');
    setReviewModalProduct(null);
    setReviewComment('');
  };

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E8D8D2] pb-6 gap-4">
        <div>
          <span className="text-xs tracking-[0.25em] text-[#8B735E] uppercase font-semibold">
            Member Sanctuary
          </span>
          <h1 className="font-serif-luxury text-3xl font-bold text-[#292929]">
            บัญชีสมาชิกของฉัน (My Account)
          </h1>
          <p className="text-xs text-[#736E6A]">
            ยินดีต้อนรับคุณ {currentUser.fullName} • สมาชิกประเภท <strong>{currentUser.role.toUpperCase()}</strong>
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2 border border-rose-200 text-rose-600 rounded-xl text-xs font-medium hover:bg-rose-50 transition flex items-center gap-2 self-start"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>ออกจากระบบ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar Menu (4 Cols) */}
        <aside className="lg:col-span-4 bg-white rounded-3xl p-4 border border-[#E8D8D2] shadow-sm space-y-1 h-fit">
          <div className="p-4 border-b border-[#E8D8D2]/60 mb-2 flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-[#8B735E] text-white flex items-center justify-center font-bold text-lg">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-[#292929] truncate">{currentUser.fullName}</h4>
              <p className="text-xs text-[#736E6A] truncate">{currentUser.email}</p>
            </div>
          </div>

          {[
            { id: 'profile', label: 'ข้อมูลส่วนตัว (Profile)', icon: UserIcon },
            { id: 'bookings', label: `รายการจองของฉัน (${myBookings.length})`, icon: Calendar },
            { id: 'payments', label: `ประวัติการชำระเงิน (${myPayments.length})`, icon: CreditCard },
            { id: 'rentals', label: `ประวัติการเช่าชุด (${myCompletedRentals.length})`, icon: History },
            { id: 'favorites', label: `ชุดที่บันทึกไว้ (${favoriteProducts.length})`, icon: Heart },
            { id: 'password', label: 'เปลี่ยนรหัสผ่าน', icon: Lock },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-[#8B735E] text-white shadow-xs'
                    : 'text-[#292929] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#736E6A]'}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#736E6A]/50'}`} />
              </button>
            );
          })}
        </aside>

        {/* Right Content View (8 Cols) */}
        <main className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D8D2] shadow-sm">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="border-b border-[#E8D8D2] pb-3">
                <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                  ข้อมูลส่วนตัวสมาชิก (Personal Profile)
                </h3>
                <p className="text-xs text-[#736E6A]">
                  แก้ไขข้อมูลติดต่อและที่อยู่สำหรับจัดส่งชุดราตรี
                </p>
              </div>

              {profileSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>บันทึกข้อมูลส่วนตัวของคุณเรียบร้อยแล้ว</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#292929] font-medium mb-1">ชื่อ-นามสกุล</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs text-[#292929] focus:outline-hidden focus:border-[#8B735E]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#292929] font-medium mb-1">อีเมลสมาชิก (ไม่สามารถเปลี่ยนได้)</label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="w-full p-2.5 bg-gray-100 border border-[#E8D8D2] rounded-xl text-xs text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[#292929] font-medium mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs text-[#292929] focus:outline-hidden focus:border-[#8B735E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#292929] font-medium mb-1">ที่อยู่จัดส่งพัสดุ</label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs text-[#292929] focus:outline-hidden focus:border-[#8B735E]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8B735E] hover:bg-[#6F5B49] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-xs"
                >
                  บันทึกการแก้ไข
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="border-b border-[#E8D8D2] pb-3">
                <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                  รายการจองชุดของฉัน (My Bookings)
                </h3>
                <p className="text-xs text-[#736E6A]">
                  ติดตามสถานะการจอง การชำระเงิน และการจัดส่งชุดราตรี
                </p>
              </div>

              {myBookings.length > 0 ? (
                <div className="space-y-4">
                  {myBookings.map((b) => (
                    <div
                      key={b.bookingId}
                      className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8D8D2] space-y-4 hover:border-[#8B735E]/50 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8D8D2]/60 pb-3">
                        <div>
                          <span className="font-mono font-bold text-xs text-[#8B735E]">
                            {b.bookingCode}
                          </span>
                          <span className="text-[11px] text-[#736E6A] block">
                            สร้างเมื่อ: {new Date(b.createdAt).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                        {getStatusBadge(b.bookingStatus)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-[#736E6A] block">ช่วงเวลาเช่าชุด:</span>
                          <span className="font-medium text-[#292929]">
                            {b.startDate} ถึง {b.endDate} ({b.rentalDays} วัน)
                          </span>
                        </div>
                        <div>
                          <span className="text-[#736E6A] block">ยอดชำระสุทธิ:</span>
                          <span className="font-bold text-[#8B735E]">
                            ฿{b.totalAmount.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#736E6A] block">
                            (รวมประกัน ฿{b.deposit.toLocaleString()})
                          </span>
                        </div>
                        <div>
                          <span className="text-[#736E6A] block">ที่อยู่จัดส่ง:</span>
                          <span className="font-light text-[#292929] line-clamp-2">
                            {b.shippingAddress}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons per status */}
                      <div className="pt-2 flex items-center justify-end gap-3">
                        {b.bookingStatus === 'pending_payment' && (
                          <button
                            onClick={() => onNavigateToPayment(b)}
                            className="px-4 py-2 bg-[#8B735E] text-white rounded-lg text-xs font-semibold hover:bg-[#6F5B49] transition shadow-xs"
                          >
                            แจ้งโอนเงิน / ชำระตอนนี้
                          </button>
                        )}
                        {b.bookingStatus === 'payment_review' && (
                          <button
                            onClick={() => onNavigateToPayment(b)}
                            className="px-3 py-1.5 border border-[#8B735E] text-[#8B735E] rounded-lg text-xs hover:bg-[#8B735E] hover:text-white transition"
                          >
                            ดูสลิปที่แนบไว้
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#736E6A]">
                  คุณยังไม่มีรายการจองชุดในขณะนี้
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PAYMENT HISTORY */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="border-b border-[#E8D8D2] pb-3">
                <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                  ประวัติการชำระเงิน (Payment History)
                </h3>
                <p className="text-xs text-[#736E6A]">
                  รายการโอนเงิน สลิปที่แนบ และผลการตรวจสอบโดยฝ่ายการเงิน
                </p>
              </div>

              {myPayments.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-[#E8D8D2]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#FAF8F5] text-[#8B735E] border-b border-[#E8D8D2]">
                        <th className="py-3 px-4 font-semibold">รหัสการจอง</th>
                        <th className="py-3 px-4 font-semibold">ยอดเงิน</th>
                        <th className="py-3 px-4 font-semibold">ช่องทาง</th>
                        <th className="py-3 px-4 font-semibold">สลิป</th>
                        <th className="py-3 px-4 font-semibold">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8D8D2]/60">
                      {myPayments.map((p) => (
                        <tr key={p.paymentId} className="hover:bg-[#FAF8F5]/50">
                          <td className="py-3 px-4 font-mono font-medium text-[#292929]">
                            {p.bookingCode}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#8B735E]">
                            ฿{p.amount.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-[#736E6A]">
                            {p.transferBank || 'โอนผ่านธนาคาร'}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setViewingSlipUrl(p.slipUrl)}
                              className="text-xs text-[#8B735E] hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>ดูรูปสลิป</span>
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            {p.paymentStatus === 'approved' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                อนุมัติแล้ว
                              </span>
                            )}
                            {p.paymentStatus === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                                รอตรวจสอบ
                              </span>
                            )}
                            {p.paymentStatus === 'rejected' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800">
                                ปฏิเสธ ({p.rejectReason || 'สลิปไม่ถูกต้อง'})
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#736E6A]">
                  ยังไม่มีประวัติการชำระเงิน
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RENTAL HISTORY */}
          {activeTab === 'rentals' && (
            <div className="space-y-6">
              <div className="border-b border-[#E8D8D2] pb-3">
                <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                  ประวัติการเช่าชุดที่เสร็จสิ้น (Rental History)
                </h3>
                <p className="text-xs text-[#736E6A]">
                  ชุดที่คุณเคยเช่าและส่งคืนเรียบร้อยแล้ว ร่วมเขียนรีวิวเพื่อรับคะแนนสะสม
                </p>
              </div>

              {myCompletedRentals.length > 0 ? (
                <div className="space-y-4">
                  {myCompletedRentals.map((b) => (
                    <div
                      key={b.bookingId}
                      className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8D8D2] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <span className="font-mono text-xs font-bold text-[#8B735E] block">
                          {b.bookingCode}
                        </span>
                        <p className="text-xs text-[#292929] font-medium mt-1">
                          เช่าวันที่: {b.startDate} ถึง {b.endDate} ({b.rentalDays} วัน)
                        </p>
                        <p className="text-[11px] text-emerald-700">
                          ✓ ส่งคืนชุดและคืนเงินประกันเรียบร้อยแล้ว
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setReviewModalProduct({
                            id: 'prod-001',
                            name: 'ชุดราตรี DRESSÉ',
                            bookingId: b.bookingId,
                          })
                        }
                        className="px-4 py-2 bg-white border border-[#8B735E] text-[#8B735E] rounded-xl text-xs font-medium hover:bg-[#8B735E] hover:text-white transition flex items-center gap-1.5 self-start sm:self-auto"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>เขียนรีวิวความประทับใจ</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#736E6A]">
                  ยังไม่มีประวัติการเช่าชุดที่เสร็จสิ้น
                </div>
              )}
            </div>
          )}

          {/* TAB 5: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="border-b border-[#E8D8D2] pb-3">
                <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                  ชุดที่บันทึกไว้ในรายการโปรด ({favoriteProducts.length})
                </h3>
                <p className="text-xs text-[#736E6A]">
                  รายการชุดที่คุณถูกใจ สามารถคลิกเพื่อตรวจสอบวันว่างและเช่าได้ทันที
                </p>
              </div>

              {favoriteProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteProducts.map((p) => (
                    <div
                      key={p.productId}
                      className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8D8D2] flex gap-3 hover:border-[#8B735E] transition"
                    >
                      <div className="w-20 aspect-3/4 rounded-xl overflow-hidden bg-white shrink-0">
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1 text-xs">
                        <div>
                          <span className="text-[10px] text-[#736E6A] block">{p.productCode}</span>
                          <h4 className="font-semibold text-[#292929] line-clamp-1">{p.name}</h4>
                          <span className="font-bold text-[#8B735E] block mt-1">
                            ฿{p.rentalPrice.toLocaleString()} / วัน
                          </span>
                        </div>
                        <button
                          onClick={() => onSelectProduct(p.productId)}
                          className="px-3 py-1.5 bg-[#8B735E] text-white rounded-lg text-xs font-medium hover:bg-[#6F5B49] transition w-fit"
                        >
                          ตรวจวันว่าง & เช่า
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#736E6A]">
                  ยังไม่มีชุดในรายการโปรด เลือกกดรูปหัวใจที่ชุดที่คุณสนใจในหน้าคอลเลกชัน
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CHANGE PASSWORD */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              <div className="border-b border-[#E8D8D2] pb-3">
                <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                  เปลี่ยนรหัสผ่าน (Change Password)
                </h3>
                <p className="text-xs text-[#736E6A]">
                  เพื่อความปลอดภัยในการเข้าใช้งานบัญชี DRESSÉ
                </p>
              </div>

              {passMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passMsg.includes('สำเร็จ')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passMsg}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm text-xs">
                <div>
                  <label className="block text-[#292929] font-medium mb-1">รหัสผ่านปัจจุบัน</label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="รหัสผ่านเดิม"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs text-[#292929]"
                  />
                </div>

                <div>
                  <label className="block text-[#292929] font-medium mb-1">รหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs text-[#292929]"
                  />
                </div>

                <div>
                  <label className="block text-[#292929] font-medium mb-1">ยืนยันรหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs text-[#292929]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#8B735E] hover:bg-[#6F5B49] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition shadow-xs"
                >
                  อัปเดตรหัสผ่านใหม่
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Slip Viewer Modal */}
      {viewingSlipUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full space-y-3 relative">
            <div className="flex justify-between items-center border-b border-[#E8D8D2] pb-2">
              <span className="font-semibold text-xs text-[#292929]">หลักฐานสลิปการโอนเงิน</span>
              <button
                onClick={() => setViewingSlipUrl(null)}
                className="p-1 rounded-full text-[#736E6A] hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-[#FAF8F5] rounded-xl p-2">
              <img src={viewingSlipUrl} alt="Slip" className="max-h-[65vh] object-contain rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-[#E8D8D2]">
            <div className="flex justify-between items-center border-b border-[#E8D8D2] pb-3">
              <h4 className="font-serif-luxury text-lg font-bold text-[#292929]">
                เขียนรีวิวความประทับใจ
              </h4>
              <button
                onClick={() => setReviewModalProduct(null)}
                className="p-1 rounded-full text-[#736E6A] hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#736E6A]">ให้คะแนน:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= reviewRating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#292929] font-medium mb-1">ความคิดเห็นของคุณ</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="เล่าความรู้สึกหลังสวมใส่ชุด คัตติ้ง และบริการ..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalProduct(null)}
                  className="px-4 py-2 border border-[#E8D8D2] rounded-lg text-[#736E6A]"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  className="px-5 py-2 bg-[#8B735E] text-white rounded-lg font-medium hover:bg-[#6F5B49]"
                >
                  ส่งรีวิว
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
