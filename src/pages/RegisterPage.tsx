import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { store } from '../services/store';

interface Props {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<Props> = ({ onSuccess, onNavigateToLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (mail: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('กรุณากรอกชื่อและนามสกุล');
      return;
    }

    if (!validateEmail(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    if (!phone.trim() || phone.length < 9) {
      setError('กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (อย่างน้อย 9-10 หลัก)');
      return;
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    if (!agreeTerms) {
      setError('กรุณากดยอมรับเงื่อนไขและนโยบายความเป็นส่วนตัว');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.register({
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim() || 'กรุงเทพมหานคร',
        password,
      });

      setLoading(false);
      if (res.success) {
        alert(res.message);
        onSuccess();
      } else {
        setError(res.message);
      }
    }, 500);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="font-serif-luxury text-3xl font-light tracking-[0.25em] text-[#8B735E]">
          DRESSÉ
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#292929]">
          สมัครสมาชิกใหม่
        </h1>
        <p className="text-xs text-[#736E6A]">
          สมัครเพื่อรับสิทธิพิเศษ ส่วนลด 500 บาท และติดตามสถานะการเช่าชุดของคุณ
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D8D2] shadow-luxury space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#292929] font-medium mb-1">ชื่อ (First Name) *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#736E6A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="เช่น พัชริดา"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#292929] font-medium mb-1">นามสกุล (Last Name) *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="เช่น รัตนวรกุล"
                className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#292929] font-medium mb-1">อีเมล (Email) *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#736E6A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#292929] font-medium mb-1">เบอร์โทรศัพท์ (Phone) *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#736E6A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#292929] font-medium mb-1">ที่อยู่จัดส่งพัสดุ (Shipping Address)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#736E6A] absolute left-3 top-3" />
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ระบุที่อยู่จัดส่งของคุณ (สามารถแก้ไขได้ภายหลัง)"
                className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#292929] font-medium mb-1">รหัสผ่าน (Password) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#736E6A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#292929] font-medium mb-1">ยืนยันรหัสผ่าน (Confirm Password) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#736E6A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8D8D2] text-[11px] text-[#736E6A]">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 accent-[#8B735E]"
              />
              <span>
                ฉันยอมรับเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัวของ DRESSÉ ข้อมูลจะถูกจัดเก็บอย่างปลอดภัยบน Cloud Firestore
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#8B735E] hover:bg-[#6F5B49] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'กำลังบันทึกข้อมูล...' : 'ลงทะเบียนเป็นสมาชิก DRESSÉ'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E8D8D2] text-xs text-[#736E6A]">
          <span>มีบัญชีสมาชิกอยู่แล้ว? </span>
          <button
            onClick={onNavigateToLogin}
            className="font-semibold text-[#8B735E] hover:underline ml-1"
          >
            เข้าสู่ระบบที่นี่
          </button>
        </div>
      </div>
    </div>
  );
};
