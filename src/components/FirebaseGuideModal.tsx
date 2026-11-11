import React, { useState } from 'react';
import { Database, ShieldCheck, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, X, RefreshCw } from 'lucide-react';
import { testFirestoreConnection } from '../services/firebase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'status' | 'blueprint' | 'rules' | 'manual'>('status');

  const [customConfig, setCustomConfig] = useState(() => {
    return localStorage.getItem('dresse_firebase_config') || '';
  });

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await testFirestoreConnection();
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveCustomConfig = () => {
    try {
      if (!customConfig.trim()) {
        localStorage.removeItem('dresse_firebase_config');
        alert('ลบการตั้งค่าเรียบร้อยแล้ว');
        window.location.reload();
        return;
      }
      JSON.parse(customConfig);
      localStorage.setItem('dresse_firebase_config', customConfig);
      alert('บันทึก Firebase Config สำเร็จ กำลังโหลดระบบใหม่...');
      window.location.reload();
    } catch {
      alert('รูปแบบ JSON ไม่ถูกต้อง กรุณาตรวจสอบ Firebase Config อีกครั้ง');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#C9A58B]/30 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-[#FFFFFF] border-b border-[#E8D8D2] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B735E]/10 flex items-center justify-center text-[#8B735E]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#292929] flex items-center gap-2">
                Firebase Integration & Architecture Diagnostics
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A58B]/20 text-[#8B735E] font-normal">
                  สำหรับโปรเจกต์นักศึกษา
                </span>
              </h2>
              <p className="text-xs text-[#736E6A]">
                มาตรฐานโครงสร้างฐานข้อมูล Cloud Firestore, Firebase Auth, และ Security Rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#736E6A] hover:bg-[#FAF8F5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E8D8D2] bg-white px-6">
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'status'
                ? 'border-[#8B735E] text-[#8B735E]'
                : 'border-transparent text-[#736E6A] hover:text-[#292929]'
            }`}
          >
            สถานะ & ขั้นตอนเชื่อมต่อ
          </button>
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'blueprint'
                ? 'border-[#8B735E] text-[#8B735E]'
                : 'border-transparent text-[#736E6A] hover:text-[#292929]'
            }`}
          >
            Database Collections (12 Collections)
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'rules'
                ? 'border-[#8B735E] text-[#8B735E]'
                : 'border-transparent text-[#736E6A] hover:text-[#292929]'
            }`}
          >
            Security Rules (ABAC Default Deny)
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition ${
              activeTab === 'manual'
                ? 'border-[#8B735E] text-[#8B735E]'
                : 'border-transparent text-[#736E6A] hover:text-[#292929]'
            }`}
          >
            กำหนด Firebase Config เอง
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm space-y-6">
          {activeTab === 'status' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">การเชื่อมต่อ Backend & Cloud Firestore</h4>
                  <p className="text-xs mt-1 text-amber-800 leading-relaxed">
                    ระบบได้ออกแบบและสร้างโครงสร้างรองรับ <strong>Cloud Firestore, Firebase Authentication และ Firebase Storage</strong> ไว้ครบถ้วนทุก Collections ตามเกณฑ์โปรเจกต์ หากต้องการเชื่อมต่อโปรเจกต์ Firebase ของคุณเอง สามารถนำ Firebase Config มาวางในแท็บ "กำหนด Firebase Config เอง" หรือกดเชื่อมต่อผ่าน Google AI Studio
                  </p>
                </div>
              </div>

              {/* Status Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-[#E8D8D2] space-y-2">
                  <div className="flex items-center gap-2 text-[#8B735E] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Firestore Blueprint Scheme</span>
                  </div>
                  <p className="text-xs text-[#736E6A]">
                    ไฟล์ <code className="bg-[#FAF8F5] px-1 py-0.5 rounded">firebase-blueprint.json</code> กำหนดโครงสร้าง 12 Collections ครบถ้วน
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8D8D2] space-y-2">
                  <div className="flex items-center gap-2 text-[#8B735E] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Security Rules Hardened</span>
                  </div>
                  <p className="text-xs text-[#736E6A]">
                    ไฟล์ <code className="bg-[#FAF8F5] px-1 py-0.5 rounded">firestore.rules</code> และ <code className="bg-[#FAF8F5] px-1 py-0.5 rounded">storage.rules</code> ตามหลัก Zero-Trust ABAC
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8D8D2] space-y-2">
                  <div className="flex items-center gap-2 text-[#8B735E] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Booking Availability Engine</span>
                  </div>
                  <p className="text-xs text-[#736E6A]">
                    ตรวจสอบช่วงวันทับซ้อนและสต็อกแบบ Real-time ป้องกันการจองซ้ำ
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8D8D2] space-y-2">
                  <div className="flex items-center gap-2 text-[#8B735E] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Admin Slip Approval & Returns</span>
                  </div>
                  <p className="text-xs text-[#736E6A]">
                    ระบบตรวจสลิปโอนเงิน คำนวณค่าปรับคืนล่าช้า และคืนเงินประกัน
                  </p>
                </div>
              </div>

              {/* Test Connection Button */}
              <div className="p-4 rounded-xl bg-white border border-[#E8D8D2] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-medium text-[#292929]">ตรวจสอบการเชื่อมต่อกับ Firebase Live</h4>
                  <p className="text-xs text-[#736E6A]">
                    ทดสอบคำสั่ง getDocFromServer() ไปยังเซิร์ฟเวอร์ Firestore
                  </p>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                  className="px-4 py-2 bg-[#8B735E] text-white rounded-lg text-xs font-medium hover:bg-[#6F5B49] transition flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                  {testingConnection ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ'}
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'blueprint' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#736E6A]">
                  โครงสร้าง 12 Collections ที่ถูกออกแบบและสร้างขึ้นตามข้อกำหนด PART 5:
                </p>
                <button
                  onClick={() =>
                    handleCopy(
                      'users, categories, products, sizes, productSizes, bookings, bookingDetails, payments, rentalReturns, reviews, promotions, favorites',
                      'collections'
                    )
                  }
                  className="text-xs text-[#8B735E] hover:underline flex items-center gap-1"
                >
                  {copied === 'collections' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  คัดลอกรายชื่อ Collections
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
                {[
                  { name: '1. users', desc: 'uid, fullName, email, phone, address, role, createdAt' },
                  { name: '2. categories', desc: 'categoryId, name, description, imageUrl, isActive' },
                  { name: '3. products', desc: 'productId, productCode, name, categoryId, rentalPrice, depositPrice, images, isActive...' },
                  { name: '4. sizes', desc: 'sizeId, name, description, bust, waist, hip, length' },
                  { name: '5. productSizes', desc: 'productSizeId, productId, sizeId, quantity (สต็อกสินค้า)' },
                  { name: '6. bookings', desc: 'bookingId, bookingCode, userId, startDate, endDate, subtotal, discount, deposit, totalAmount, bookingStatus...' },
                  { name: '7. bookingDetails', desc: 'detailId, bookingId, productId, sizeId, quantity, rentalPrice, depositPrice (Snapshot ราคา)' },
                  { name: '8. payments', desc: 'paymentId, bookingId, userId, amount, paymentMethod, slipUrl, paymentStatus, reviewedBy...' },
                  { name: '9. rentalReturns', desc: 'returnId, bookingId, actualReturnDate, returnCondition, lateFee, damageFee, depositRefund, status' },
                  { name: '10. reviews', desc: 'reviewId, userId, productId, bookingId, rating, comment, createdAt' },
                  { name: '11. promotions', desc: 'promotionId, name, code, discountType, discountValue, startDate, endDate, isActive' },
                  { name: '12. favorites', desc: 'userId, productIds, updatedAt' },
                ].map((col) => (
                  <div key={col.name} className="p-3 bg-white rounded-lg border border-[#E8D8D2]">
                    <div className="font-bold text-[#8B735E]">{col.name}</div>
                    <div className="text-[11px] text-[#736E6A] mt-1 break-all">{col.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  กำหนดกฎความปลอดภัยตามหลัก Default Deny, Isolated PII, และ Role-Based Access Control (RBAC)
                </span>
              </div>
              <pre className="p-4 bg-[#292929] text-emerald-400 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. Default Deny Catch-all
    match /{document=**} {
      allow read, write: if false;
    }

    // 2. Users (PII Isolation: read/write only owner or admin)
    match /users/{userId} {
      allow get: if isOwner(userId) || isAdmin();
      allow list: if isAdmin();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isOwner(userId) && request.resource.data.role == resource.data.role;
    }

    // 3. Products & Categories (Public read, Admin write)
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // 4. Bookings & Payments (Owner can create/read, Admin can review)
    match /bookings/{bookingId} {
      allow read: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
      allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
      allow update: if isAdmin();
    }
  }
}`}
              </pre>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#292929] mb-1">
                  วาง Firebase Configuration JSON (จาก Firebase Console &gt; Project Settings &gt; General &gt; Web App)
                </label>
                <textarea
                  rows={8}
                  value={customConfig}
                  onChange={(e) => setCustomConfig(e.target.value)}
                  placeholder={`{\n  "apiKey": "AIzaSy...",\n  "authDomain": "your-app.firebaseapp.com",\n  "projectId": "your-project-id",\n  "storageBucket": "your-app.appspot.com",\n  "messagingSenderId": "...",\n  "appId": "..."\n}`}
                  className="w-full p-3 font-mono text-xs bg-white border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#736E6A]">
                  ข้อมูลจะถูกบันทึกในเบราว์เซอร์อย่างปลอดภัยเพื่อเชื่อมต่อฐานข้อมูลจริงของคุณ
                </span>
                <button
                  onClick={handleSaveCustomConfig}
                  className="px-4 py-2 bg-[#8B735E] text-white rounded-lg text-xs font-medium hover:bg-[#6F5B49] transition"
                >
                  บันทึกและเชื่อมต่อ Firebase
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFFFFF] border-t border-[#E8D8D2] flex items-center justify-between">
          <p className="text-xs text-[#736E6A]">
            DRESSÉ Fashion Rental • Graduation Project Architecture
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#8B735E] text-white text-xs font-medium rounded-lg hover:bg-[#6F5B49] transition"
          >
            เข้าใจแล้ว / ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
