import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Instagram,
  MessageCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('จองคิวลองชุดที่โชว์รูม');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'ขั้นตอนการจองคิวลองชุดที่โชว์รูมมีค่าใช้จ่ายหรือไม่?',
      a: 'ไม่มีค่าใช้จ่ายในการลองชุดที่โชว์รูมทองหล่อ ลูกค้าสามารถนัดหมายล่วงหน้าได้ 1-2 สัปดาห์ เพื่อให้เจ้าหน้าที่เตรียมชุดและห้องฟิตติ้งส่วนตัวพร้อมผู้เชี่ยวชาญดูแล',
    },
    {
      q: 'หากต้องการปรับแก้ทรงชุด ทางร้านมีบริการหรือไม่?',
      a: 'ทางร้านมีช่างประจำร้านคอยเก็บทรงชั่วคราว เช่น สอยเกล็ดเอว หรือปรับสายเดี่ยว โดยไม่ตัดต่อเนื้อผ้า เพื่อให้พอดีกับสรีระของคุณที่สุดและคงสภาพชุดไว้สมบูรณ์',
    },
    {
      q: 'ขั้นตอนการคืนเงินประกันความเสียหายเป็นอย่างไร?',
      a: 'เมื่อชุดถูกส่งกลับถึงโชว์รูม เจ้าหน้าที่จะทำการตรวจสอบสภาพผ้าและตะเข็บ หากไม่พบความเสียหายรุนแรง ระบบจะโอนเงินประกันคืนเข้าบัญชีเดิมของคุณภายใน 24 ชั่วโมง',
    },
    {
      q: 'ลูกค้าต้องซักชุดเองก่อนส่งคืนหรือไม่?',
      a: 'ไม่ต้องซักชุดเองเด็ดขาดค่ะ DRESSÉ มีบริการซักแห้งด้วยน้ำยาถนอมผ้าเกรดโอต์กูตูร์ฟรีทุกชุด เพียงแพ็คชุดใส่ถุงสูทที่ทางร้านจัดเตรียมไว้แล้วส่งคืนได้เลย',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs tracking-[0.25em] text-[#8B735E] uppercase font-semibold">
          Get in Touch
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl text-[#292929]">
          ติดต่อ DRESSÉ โชว์รูม
        </h1>
        <p className="text-xs sm:text-sm text-[#736E6A] font-light">
          จองคิวลองชุดราตรี ปรึกษาสไตล์ลิสต์ หรือสอบถามรายละเอียดบริการเช่าชุด
        </p>
      </div>

      {/* Grid: Contact Info & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info & Showroom (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D8D2] shadow-sm space-y-6">
            <h3 className="font-serif-luxury text-2xl font-bold text-[#292929]">
              DRESSÉ Flagship Showroom
            </h3>

            <div className="space-y-4 text-xs text-[#736E6A]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8B735E]/10 text-[#8B735E] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-semibold text-[#292929] text-sm">ที่ตั้งโชว์รูม:</h5>
                  <p className="mt-0.5 leading-relaxed">
                    999 อาคารเดรสเซ่ บูทีค ซอยสุขุมวิท 55 (ทองหล่อ) แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110 (มีที่จอดรถส่วนตัว)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8B735E]/10 text-[#8B735E] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-semibold text-[#292929] text-sm">เวลาทำการ:</h5>
                  <p className="mt-0.5">เปิดทุกวัน: 10:00 - 20:00 น. (กรุณานัดหมายคิวล่วงหน้า)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8B735E]/10 text-[#8B735E] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-semibold text-[#292929] text-sm">เบอร์โทรศัพท์ติดต่อ (Demo):</h5>
                  <p className="mt-0.5">02-888-9999 / 081-999-8888</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8B735E]/10 text-[#8B735E] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="font-semibold text-[#292929] text-sm">อีเมลติดต่อ:</h5>
                  <p className="mt-0.5">concierge@dresse-couture.com</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D8D2]/60 flex items-center gap-3">
              <a
                href="#line"
                onClick={(e) => { e.preventDefault(); alert('LINE ID: @dresse_official (Demo)'); }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#06C755]/10 text-[#06C755] border border-[#06C755]/30 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#06C755]/20 transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Line: @dresse</span>
              </a>
              <a
                href="#ig"
                onClick={(e) => { e.preventDefault(); alert('Instagram: @dresse_couture (Demo)'); }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-purple-100 transition"
              >
                <Instagram className="w-4 h-4" />
                <span>IG: @dresse_couture</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Interactive Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E8D8D2] shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#292929]">
                ได้รับข้อความของคุณเรียบร้อยแล้ว
              </h3>
              <p className="text-xs text-[#736E6A] max-w-sm mx-auto leading-relaxed">
                เจ้าหน้าที่สไตล์ลิสต์ของ DRESSÉ จะติดต่อกลับทางเบอร์โทรศัพท์หรืออีเมลภายใน 2-4 ชั่วโมง ขอบคุณค่ะ
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-[#8B735E] text-white text-xs font-medium rounded-xl hover:bg-[#6F5B49] transition"
              >
                ส่งข้อความเพิ่มเติม
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <h3 className="font-serif-luxury text-2xl font-bold text-[#292929] border-b border-[#E8D8D2] pb-3">
                ส่งข้อความสอบถามหรือนัดหมาย
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#292929] font-medium mb-1">ชื่อของคุณ *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น คุณกัญญาภัทร"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                  />
                </div>

                <div>
                  <label className="block text-[#292929] font-medium mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08X-XXX-XXXX"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#292929] font-medium mb-1">อีเมลของคุณ *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                  />
                </div>

                <div>
                  <label className="block text-[#292929] font-medium mb-1">หัวข้อเรื่อง</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl text-xs"
                  >
                    <option value="จองคิวลองชุดที่โชว์รูม">จองคิวลองชุดที่โชว์รูม</option>
                    <option value="สอบถามคิววันว่างของชุด">สอบถามคิววันว่างของชุด</option>
                    <option value="เช่าเซ็ตเพื่อนเจ้าสาว/งานบายเนียร์">เช่าเซ็ตเพื่อนเจ้าสาว/งานบายเนียร์</option>
                    <option value="สอบถามการชำระเงินและคืนเงินประกัน">สอบถามการชำระเงินและคืนเงินประกัน</option>
                    <option value="เรื่องอื่นๆ">เรื่องอื่นๆ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#292929] font-medium mb-1">ข้อความรายละเอียด *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="ระบุวันที่ต้องการใช้งาน ชื่องาน หรือรหัสชุดที่สนใจ..."
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E8D8D2] rounded-xl focus:outline-hidden focus:border-[#8B735E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#8B735E] hover:bg-[#6F5B49] text-white text-xs font-semibold tracking-wider uppercase rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ส่งข้อความถึงทีมงาน DRESSÉ</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <section className="bg-white rounded-3xl p-8 border border-[#E8D8D2] shadow-sm space-y-6 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <span className="text-xs tracking-[0.25em] text-[#8B735E] uppercase font-semibold">
            Common Questions
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-[#292929]">
            คำถามที่พบบ่อยเกี่ยวกับการเช่าชุด (FAQ)
          </h3>
        </div>

        <div className="divide-y divide-[#E8D8D2]/60">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-semibold text-[#292929] hover:text-[#8B735E] transition"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#8B735E] shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#736E6A] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#8B735E]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-[#736E6A] leading-relaxed pl-6 animate-in fade-in duration-200">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
