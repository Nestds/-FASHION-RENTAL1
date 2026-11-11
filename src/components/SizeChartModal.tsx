import React from 'react';
import { X, Ruler, Sparkles } from 'lucide-react';
import { Size } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sizes: Size[];
}

export const SizeChartModal: React.FC<Props> = ({ isOpen, onClose, sizes }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#FAF8F5] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#C9A58B]/30 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E8D8D2] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B735E]/10 flex items-center justify-center text-[#8B735E]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif-luxury font-semibold text-[#292929]">
                DRESSÉ Size Guide & Measurements
              </h3>
              <p className="text-xs text-[#736E6A]">
                ตารางเทียบไซซ์มาตรฐานชุดราตรีและชุดแฟชั่น (หน่วยเป็นนิ้ว)
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

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="overflow-x-auto rounded-xl border border-[#E8D8D2] bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] text-[#8B735E] border-b border-[#E8D8D2]">
                  <th className="py-3 px-4 font-semibold">ไซซ์ (Size)</th>
                  <th className="py-3 px-4 font-semibold">รอบอก (Bust)</th>
                  <th className="py-3 px-4 font-semibold">รอบเอว (Waist)</th>
                  <th className="py-3 px-4 font-semibold">สะโพก (Hip)</th>
                  <th className="py-3 px-4 font-semibold">ความยาวชุด (Length)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8D2]/60 text-[#292929]">
                {sizes.map((s) => (
                  <tr key={s.sizeId} className="hover:bg-[#FAF8F5]/60 transition">
                    <td className="py-3 px-4 font-bold text-[#8B735E]">{s.name}</td>
                    <td className="py-3 px-4">{s.bust || '-'} นิ้ว</td>
                    <td className="py-3 px-4">{s.waist || '-'} นิ้ว</td>
                    <td className="py-3 px-4">{s.hip || '-'} นิ้ว</td>
                    <td className="py-3 px-4">{s.length || '56-58'} นิ้ว</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advice card */}
          <div className="p-4 rounded-xl bg-[#E8D8D2]/30 border border-[#C9A58B]/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#8B735E] shrink-0 mt-0.5" />
            <div className="text-xs text-[#292929] leading-relaxed">
              <p className="font-semibold text-[#8B735E] mb-1">คำแนะนำในการวัดสัดส่วนสำหรับชุดราตรี:</p>
              <ul className="list-disc list-inside space-y-1 text-[#736E6A]">
                <li><strong>รอบอก:</strong> วัดผ่านจุดยอดอกรอบตัว โดยสวมบราหรือซิลิโคนบราที่จะใช้ในวันงานจริง</li>
                <li><strong>รอบเอว:</strong> วัดบริเวณจุดที่คอดที่สุดของลำตัว เหนือสะดือประมาณ 1 นิ้ว</li>
                <li><strong>สะโพก:</strong> วัดบริเวณกว้างที่สุดของสะโพก ขนานกับพื้น</li>
                <li>หากสัดส่วนคาบเกี่ยวระหว่าง 2 ไซซ์ แนะนำให้เลือกไซซ์ที่ใหญ่กว่าเพื่อให้สวมใส่สบาย หรือติดต่อแอดมินเพื่อขอปรับโครงชุดชั่วคราว</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8D8D2] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#8B735E] text-white text-xs font-medium rounded-lg hover:bg-[#6F5B49] transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
