import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, Shield, User as UserIcon, AlertCircle } from 'lucide-react';
import { store } from '../services/store';

interface Props {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginPage: React.FC<Props> = ({ onSuccess, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.login(email.trim(), password);
      setLoading(false);
      if (res.success) {
        onSuccess();
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const handleQuickLoginAdmin = () => {
    store.loginAsAdmin();
    onSuccess();
  };

  const handleQuickLoginMember = () => {
    store.loginAsCustomer();
    onSuccess();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <span className="font-serif-luxury text-3xl font-light tracking-[0.25em] text-[#8B735E]">
          DRESSÉ
        </span>
        <h1 className="font-serif-luxury text-2xl font-bold text-[#292929]">
          เข้าสู่ระบบสมาชิก
        </h1>
        <p className="text-xs text-[#736E6A]">
          ยินดีต้อนรับกลับสู่บริการเช่าชุดราตรีระดับพรีเมียม
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#E8D8D2] shadow-luxury space-y-6">
        {/* Quick Evaluator Login Buttons */}
        <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8D8D2] space-y-2 text-xs">
          <span className="text-[11px] text-[#736E6A] font-semibold block">
            ⚡ ทางลัดสำหรับทดสอบระบบ (Quick Demo Login):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickLoginAdmin}
              className="py-2 px-3 bg-white border border-amber-300 rounded-xl text-amber-900 font-medium hover:bg-amber-50 transition flex items-center justify-center gap-1.5 text-[11px]"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={handleQuickLoginMember}
              className="py-2 px-3 bg-white border border-[#8B735E]/30 rounded-xl text-[#8B735E] font-medium hover:bg-[#FAF8F5] transition flex items-center justify-center gap-1.5 text-[11px]"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#8B735E]" />
              <span>Member Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[#292929] font-medium mb-1">อีเมลผู้ใช้งาน (Email)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#736E6A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@dresse.com หรือ admin@dresse.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[#292929] font-medium">รหัสผ่าน (Password)</label>
              <button
                type="button"
                onClick={() => alert('สำหรับระบบตัวอย่าง สามารถคลิกปุ่ม Quick Demo Login ด้านบนเพื่อเข้าสู่ระบบได้ทันที')}
                className="text-[11px] text-[#8B735E] hover:underline"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#736E6A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านของคุณ"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#736E6A]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#8B735E]"
              />
              <span>จดจำการเข้าสู่ระบบ</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#8B735E] hover:bg-[#6F5B49] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E8D8D2] text-xs text-[#736E6A]">
          <span>ยังไม่มีบัญชีสมาชิก? </span>
          <button
            onClick={onNavigateToRegister}
            className="font-semibold text-[#8B735E] hover:underline ml-1"
          >
            สมัครสมาชิกใหม่
          </button>
        </div>
      </div>
    </div>
  );
};
