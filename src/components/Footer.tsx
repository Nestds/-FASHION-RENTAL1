import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  onNavigate: (path: string, params?: Record<string, any>) => void;
  onOpenFirebaseGuide: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onOpenFirebaseGuide }) => {
  return (
    <footer className="bg-[#261B1D] text-[#FFF5F6] pt-16 pb-12 border-t border-[#B26571]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="font-serif-luxury text-3xl font-light tracking-[0.25em] text-[#FAD5DA] block">
              DRESSÉ
            </span>
            <p className="text-xs text-[#FFF5F6]/75 leading-relaxed font-light">
              บริการเช่าชุดราตรีและชุดแฟชั่นชั้นสูงระดับโอต์กูตูร์ คัดสรรเนื้อผ้าและคัตติ้งระดับพรีเมียม เพื่อให้คุณเปล่งประกายในทุกช่วงเวลาสำคัญที่สุดในชีวิต
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="#instagram"
                onClick={(e) => { e.preventDefault(); alert('@dresse_rental (Instagram Demo)'); }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAD5DA] hover:bg-[#B26571] transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                onClick={(e) => { e.preventDefault(); alert('DRESSÉ Official (Facebook Demo)'); }}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#FAD5DA] hover:bg-[#B26571] transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-[#D48C95] uppercase font-serif-luxury">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#FFF5F6]/80 font-light">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#FAD5DA] transition">
                  หน้าแรก (Home)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collection')} className="hover:text-[#FAD5DA] transition">
                  คอลเลกชันชุดทั้งหมด (All Dresses)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collection', { categoryId: 'cat-evening-gown' })} className="hover:text-[#FAD5DA] transition">
                  ชุดราตรียาว (Evening Gowns)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collection', { categoryId: 'cat-thai-modern' })} className="hover:text-[#FAD5DA] transition">
                  ชุดไทยประยุกต์ร่วมสมัย (Thai Modern)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#FAD5DA] transition">
                  ติดต่อเราและที่ตั้งหน้าร้าน (Contact Us)
                </button>
              </li>
            </ul>
          </div>

          {/* Service Policies */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-[#D48C95] uppercase font-serif-luxury">
              Rental Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#FFF5F6]/80 font-light">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D48C95]" />
                <span>บริการซักแห้งระดับมืออาชีพ ฟรีทุกชุด</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D48C95]" />
                <span>ระยะเวลาเช่ามาตรฐาน 3 วัน หรือตามต้องการ</span>
              </li>
              <li>
                <span className="block text-[#D48C95]/90 font-medium">การคืนเงินประกัน:</span>
                <span className="text-[11px] text-[#FFF5F6]/70">โอนคืนภายใน 24 ชม. หลังตรวจรับสภาพชุด</span>
              </li>
              <li>
                <button
                  onClick={onOpenFirebaseGuide}
                  className="text-xs text-[#FAD5DA] hover:underline flex items-center gap-1.5 mt-2"
                >
                  <span>Firebase Database & Rules Schema</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider text-[#D48C95] uppercase font-serif-luxury">
              Showroom & Contact
            </h4>
            <ul className="space-y-3 text-xs text-[#FFF5F6]/80 font-light">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#D48C95] shrink-0 mt-0.5" />
                <span>999 ซอยสุขุมวิท 55 (ทองหล่อ) แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#D48C95] shrink-0" />
                <span>02-888-9999 / 081-999-8888</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#D48C95] shrink-0" />
                <span>concierge@dresse-couture.com</span>
              </li>
              <li className="flex items-center space-x-2.5 text-[#FAD5DA]">
                <Clock className="w-4 h-4 shrink-0" />
                <span>เปิดทุกวัน: 10:00 - 20:00 น. (จองคิวลองชุดล่วงหน้า)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF5F6]/60 gap-4">
          <p>© 2026 DRESSÉ – Haute Couture & Fashion Rental. All rights reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>ระบบโปรเจกต์จบระดับปริญญาตรี (Full-stack Web Application)</span>
            <span className="opacity-40">•</span>
            <span>Cloud Firestore & Firebase Auth Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
