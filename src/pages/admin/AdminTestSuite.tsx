import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Clock,
  Terminal,
  Activity
} from 'lucide-react';
import { TestResultItem } from '../../types';
import { store } from '../../services/store';

export const AdminTestSuite: React.FC = () => {
  const [results, setResults] = useState<TestResultItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleRunTests = async () => {
    setIsRunning(true);
    setResults([]);
    try {
      const res = await store.runSystemTests();
      setResults(res);
      setHasRun(true);
    } catch (e: any) {
      alert('Error running tests: ' + e.message);
    } finally {
      setIsRunning(false);
    }
  };

  const passedCount = results.filter((r) => r.status === 'passed').length;
  const failedCount = results.filter((r) => r.status === 'failed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#292929]">
            ชุดทดสอบระบบอัตโนมัติ (Automated System Test Suite)
          </h2>
          <p className="text-xs text-[#736E6A]">
            ทดสอบการทำงานของ 14 ระบบหลักตามข้อกำหนด PART 10 เพื่อความสมบูรณ์ของโปรเจกต์
          </p>
        </div>

        <button
          disabled={isRunning}
          onClick={handleRunTests}
          className="px-6 py-3 bg-[#8B735E] hover:bg-[#6F5B49] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-lg flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>กำลังรันการทดสอบ...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>รันชุดทดสอบทั้งหมด (Run 14 Test Cases)</span>
            </>
          )}
        </button>
      </div>

      {/* Summary Scorecard */}
      {hasRun && (
        <div className="p-6 rounded-3xl bg-white border border-[#E8D8D2] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${
              failedCount === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {passedCount}/{results.length}
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl font-bold text-[#292929]">
                {failedCount === 0 ? 'ทุกระบบผ่านการทดสอบ 100% (All Passed)' : 'พบข้อผิดพลาดบางรายการ'}
              </h3>
              <p className="text-xs text-[#736E6A]">
                ทดสอบเสร็จสมบูรณ์เมื่อ {new Date().toLocaleTimeString('th-TH')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ผ่าน {passedCount} ข้อ</span>
            </div>
            {failedCount > 0 && (
              <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 text-rose-800 font-semibold border border-rose-200 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>ไม่ผ่าน {failedCount} ข้อ</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test List Table */}
      <div className="bg-white rounded-3xl border border-[#E8D8D2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F5] text-[#8B735E] border-b border-[#E8D8D2]">
                <th className="py-3.5 px-4 font-semibold w-16">#</th>
                <th className="py-3.5 px-4 font-semibold">ชื่อการทดสอบ (Test Case)</th>
                <th className="py-3.5 px-4 font-semibold">หมวดหมู่</th>
                <th className="py-3.5 px-4 font-semibold">ผลการทดสอบ</th>
                <th className="py-3.5 px-4 font-semibold">รายละเอียด / คำอธิบายการยืนยัน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8D2]/60 font-mono text-[11px]">
              {results.length > 0 ? (
                results.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-[#FAF8F5]/40 transition">
                    <td className="py-3 px-4 text-[#736E6A] font-bold">{idx + 1}</td>
                    <td className="py-3 px-4 font-sans font-semibold text-[#292929]">
                      {t.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8D8D2] text-[#736E6A] font-sans">
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {t.status === 'passed' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>PASSED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>FAILED</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-sans text-[#736E6A]">
                      {t.message}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#736E6A] font-sans text-xs">
                    กดปุ่ม <strong>"รันชุดทดสอบทั้งหมด"</strong> ด้านบน เพื่อเริ่มต้นการตรวจสอบ 14 ฟังก์ชันหลัก
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
