import React, { useState } from 'react';
import { VTCLogo } from './VTCLogo';
import { COURSE_METADATA, COURSE_UNITS } from '../data/courseData';
import { 
  Printer, 
  ArrowRight, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  HelpCircle,
  Clock, 
  Sparkles
} from 'lucide-react';

interface PdfExportViewProps {
  onBackToCourse: () => void;
}

export const PdfExportView: React.FC<PdfExportViewProps> = ({ onBackToCourse }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-300 py-6 px-2 sm:px-4 text-slate-900 print:bg-white print:p-0 print:m-0">
      
      {/* Screen Control Bar (Hidden on Print) */}
      <div className="no-print sticky top-20 z-50 max-w-5xl mx-auto mb-6 bg-slate-900/95 text-white backdrop-blur-md p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4 border border-slate-700">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCourse}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للمنصة</span>
          </button>
          
          <div>
            <h2 className="text-sm font-black text-amber-400">معاينة وتصدير ملف PDF المعتمد</h2>
            <p className="text-[11px] text-slate-300">
              يتضمن اللوجو في جميع الصفحات واسم المدرب: {COURSE_METADATA.instructor}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
              className="p-1.5 hover:text-amber-400 transition-colors"
              title="تصغير المعاينة"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-bold text-slate-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
              className="p-1.5 hover:text-amber-400 transition-colors"
              title="تكبير المعاينة"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Print / Save as PDF Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl shadow-md transition-all active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة / حفظ كملف PDF الآن</span>
          </button>

        </div>

      </div>

      {/* Printable Document Wrapper */}
      <div 
        className="max-w-[210mm] mx-auto transition-transform origin-top"
        style={{ transform: `scale(${zoomLevel / 100})` }}
      >

        {/* ========================================================
            PAGE 1: OFFICIAL COVER PAGE (صفحة الغلاف الرسمي)
           ======================================================== */}
        <section className="pdf-sheet bg-white rounded-xl shadow-lg border border-slate-200 mb-8 p-10 min-h-[297mm] flex flex-col justify-between relative overflow-hidden page-break-after">
          
          {/* Top Decorative Bars */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-red-700 via-amber-500 to-red-700" />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-red-700 via-amber-500 to-red-700" />

          {/* Cover Header with Logo */}
          <div className="flex items-center justify-between border-b-2 border-red-600 pb-6 pt-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500">المملكة الأردنية الهاشمية</div>
              <div className="text-sm font-black text-slate-800">مؤسسة التدريب المهني</div>
              <div className="text-[11px] font-semibold text-amber-700 tracking-wider">
                VOCATIONAL TRAINING CORPORATION
              </div>
            </div>
            {/* The Mandatory Logo */}
            <div className="p-2 bg-white rounded-lg">
              <VTCLogo size="md" />
            </div>
          </div>

          {/* Cover Body / Titles */}
          <div className="my-auto py-12 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>إصدار اليوبيل الذهبي - 50 عاماً من التميز والريادة المهنية</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {COURSE_METADATA.title}
              </h1>
              <p className="text-base font-bold text-red-700 max-w-xl mx-auto leading-relaxed">
                {COURSE_METADATA.subTitle}
              </p>
            </div>

            {/* Visual Emblem Badge */}
            <div className="w-24 h-1 bg-red-600 mx-auto rounded-full" />

            {/* Course Features Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto text-xs text-slate-700 font-semibold pt-4">
              <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">10 محاور تدريبية متكاملة</span>
              <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">تمارين عملية تطبيقية</span>
              <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">اختصارات لوحة المفاتيح</span>
              <span className="bg-slate-100 px-3 py-1 rounded-md border border-slate-200">معايير الكفاءة الرقمية</span>
            </div>

          </div>

          {/* Cover Footer Information */}
          <div className="border-t-2 border-slate-200 pt-6 bg-slate-50/80 -mx-10 -mb-10 p-10 rounded-b-xl">
            <div className="grid grid-cols-2 gap-4 text-xs">
              
              {/* Instructor Credentials */}
              <div className="border-l border-slate-200 pl-4 space-y-1">
                <div className="text-slate-400 font-bold text-[10px]">إعداد وتأليف المحتوى:</div>
                <div className="text-base font-black text-red-700">{COURSE_METADATA.instructor}</div>
                <div className="text-slate-600 font-medium text-[11px] leading-relaxed">
                  {COURSE_METADATA.instructorTitle}
                </div>
              </div>

              {/* Institution Credentials */}
              <div className="space-y-1 pr-4">
                <div className="text-slate-400 font-bold text-[10px]">الجهة المشرفة والمعتمدة:</div>
                <div className="text-sm font-extrabold text-slate-800">{COURSE_METADATA.institution}</div>
                <div className="text-slate-600 text-[11px]">
                  العام التدريبي: {COURSE_METADATA.year} | {COURSE_METADATA.edition}
                </div>
              </div>

            </div>
          </div>

        </section>


        {/* ========================================================
            PAGE 2: TABLE OF CONTENTS (فهرس المحتويات التدريبية)
           ======================================================== */}
        <section className="pdf-sheet bg-white rounded-xl shadow-lg border border-slate-200 mb-8 p-10 min-h-[297mm] flex flex-col justify-between page-break-after">
          
          {/* Running Header */}
          <PdfRunningHeader currentModuleTitle="فهرس المحتويات ومنهاج الدورة التدريبية" />

          {/* Table of contents content */}
          <div className="flex-1 py-4 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-lg font-black text-slate-900">
                فهرس المحاور التدريبية العشرة
              </h2>
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                منهاج المهارات الرقمية المعتمد
              </span>
            </div>

            {/* Course Overview Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong>مقدمة الحقيبة التدريبية: </strong>
              {COURSE_METADATA.overview}
            </div>

            {/* The 10 Modules List */}
            <div className="space-y-2.5">
              {COURSE_UNITS.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-colors text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-red-600 text-white font-extrabold flex items-center justify-center text-[11px]">
                      {u.id}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800">{u.title}</div>
                      <div className="text-[11px] text-slate-500">{u.subtitle}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500 font-medium">{u.duration}</span>
                    <span className="w-6 text-center font-mono font-bold text-slate-700 bg-slate-100 rounded px-1.5 py-0.5">
                      {u.id + 2}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Running Footer */}
          <PdfRunningFooter pageNum={2} />

        </section>


        {/* ========================================================
            PAGES 3 - 12: DETAILED MODULES (كل وحدة في صفحة A4 مخصصة)
           ======================================================== */}
        {COURSE_UNITS.map((unit, index) => {
          const pageNum = index + 3;

          return (
            <section 
              key={unit.id}
              className="pdf-sheet bg-white rounded-xl shadow-lg border border-slate-200 mb-8 p-10 min-h-[297mm] flex flex-col justify-between page-break-after"
            >
              {/* Running Header with Logo */}
              <PdfRunningHeader currentModuleTitle={`المحور ${unit.id}: ${unit.title}`} />

              {/* Module Content */}
              <div className="flex-1 py-4 space-y-4">
                
                {/* Module title box */}
                <div className="bg-gradient-to-l from-slate-50 to-red-50/40 p-4 rounded-xl border border-red-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-red-600 bg-white px-2 py-0.5 rounded border border-red-200 text-[10px]">
                      الوحدة التدريبية رقم ({unit.id})
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 font-bold text-[10px]">
                      <Clock className="w-3 h-3" />
                      <span>زمن التدريب: {unit.duration}</span>
                    </span>
                  </div>
                  <h2 className="text-base font-black text-slate-900 leading-snug">
                    {unit.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">{unit.subtitle}</p>
                </div>

                {/* Target Learning Outcomes */}
                <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl">
                  <div className="text-xs font-bold text-amber-900 mb-2">الأهداف ومخرجات التعلم:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {unit.learningOutcomes.map((lo, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{lo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Sections */}
                <div className="space-y-3.5">
                  {unit.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="border-t border-slate-200 pt-3">
                      <h3 className="text-xs font-extrabold text-slate-800 mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-3 bg-red-600 rounded-sm inline-block" />
                        <span>{sec.title}</span>
                      </h3>

                      {sec.content && (
                        <div className="space-y-1 mb-2">
                          {sec.content.map((p, pIdx) => (
                            <p key={pIdx} className="text-[11px] text-slate-700 leading-relaxed">
                              {p}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Highlights */}
                      {sec.highlights && (
                        <div className="space-y-1 my-2">
                          {sec.highlights.map((h, hIdx) => (
                            <div key={hIdx} className="bg-slate-50 border-r-2 border-red-600 p-2 text-[10.5px] text-slate-800 rounded-l">
                              {h}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tables */}
                      {sec.table && (
                        <div className="my-2 overflow-x-auto rounded border border-slate-200 text-[10px]">
                          <table className="w-full text-right">
                            <thead className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold">
                              <tr>
                                {sec.table.headers.map((th, thIdx) => (
                                  <th key={thIdx} className="p-1.5">{th}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {sec.table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="p-1.5 text-slate-700 leading-snug">{cell}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Steps */}
                      {sec.steps && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 text-[10.5px]">
                          {sec.steps.map((st) => (
                            <div key={st.step} className="bg-slate-50 p-2 rounded border border-slate-200 flex items-start gap-2">
                              <span className="w-4 h-4 rounded bg-red-600 text-white font-bold text-[9px] flex items-center justify-center shrink-0">
                                {st.step}
                              </span>
                              <div>
                                <div className="font-bold text-slate-800">{st.title}</div>
                                <div className="text-slate-600 leading-tight">{st.desc}</div>
                                {st.shortcut && (
                                  <div className="mt-1 font-mono text-[9px] text-red-700 font-bold">
                                    اختصار: {st.shortcut}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ))}
                </div>

                {/* Practical Exercise Box */}
                <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 text-[11px] avoid-break">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-amber-400">التطبيق العملي للمتدرب: {unit.practicalExercise.title}</span>
                    <span className="text-[10px] text-slate-400">تقييم الأداء</span>
                  </div>
                  <ul className="space-y-0.5 text-slate-300 text-[10px] mb-2 list-disc list-inside">
                    {unit.practicalExercise.steps.slice(0, 3).map((st, stIdx) => (
                      <li key={stIdx}>{st}</li>
                    ))}
                  </ul>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    النتيجة المستهدفة: {unit.practicalExercise.expectedResult}
                  </div>
                </div>

                {/* Quick Quiz Questions for review */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-[10.5px] avoid-break">
                  <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-red-600" />
                    <span>أسئلة التحقق والمراجعة الذاتية:</span>
                  </div>
                  <div className="space-y-2">
                    {unit.quiz.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-1">
                        <div className="font-semibold text-slate-900">
                          {qIdx + 1}. {q.question}
                        </div>
                        <div className="text-[10px] text-emerald-800 bg-emerald-50/70 p-1.5 rounded border border-emerald-200">
                          <strong>الإجابة الصحيحة: </strong> {q.options[q.correctAnswer]} ({q.explanation})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Running Footer */}
              <PdfRunningFooter pageNum={pageNum} />

            </section>
          );
        })}


        {/* ========================================================
            PAGE 13: APPENDIX (ملحق الاختصارات ومعجم المصطلحات)
           ======================================================== */}
        <section className="pdf-sheet bg-white rounded-xl shadow-lg border border-slate-200 mb-8 p-10 min-h-[297mm] flex flex-col justify-between page-break-after">
          
          <PdfRunningHeader currentModuleTitle="ملحق المرجع السريع: الاختصارات والمصطلحات التقنية" />

          <div className="flex-1 py-4 space-y-5">
            
            <div>
              <h2 className="text-base font-black text-slate-900 mb-2 border-b border-slate-200 pb-2">
                ملحق 1: جدول أهم اختصارات لوحة المفاتيح في نظام Windows
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 text-xs">
                <table className="w-full text-right">
                  <thead className="bg-slate-100 text-slate-800 font-bold">
                    <tr>
                      <th className="p-2">الاختصار</th>
                      <th className="p-2">الوظيفة والمهام</th>
                      <th className="p-2">مجال الاستخدام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr><td className="p-2 font-mono font-bold text-red-700">Win + Shift + S</td><td className="p-2">تشغيل أداة لقطة الشاشة (Snipping Tool) الفورية</td><td className="p-2">التوثيق والشروحات</td></tr>
                    <tr><td className="p-2 font-mono font-bold text-red-700">Win + E</td><td className="p-2">فتح مستكشف الملفات (File Explorer)</td><td className="p-2">إدارة الملفات</td></tr>
                    <tr><td className="p-2 font-mono font-bold text-red-700">Win + I</td><td className="p-2">فتح تطبيق الإعدادات (Settings)</td><td className="p-2">ضبط النظام</td></tr>
                    <tr><td className="p-2 font-mono font-bold text-red-700">Win + D</td><td className="p-2">تصغير جميع النوافذ وإظهار سطح المكتب</td><td className="p-2">إدارة النوافذ</td></tr>
                    <tr><td className="p-2 font-mono font-bold text-red-700">Alt + Tab</td><td className="p-2">التبديل الفوري بين البرامج النشطة</td><td className="p-2">تعدد المهام</td></tr>
                    <tr><td className="p-2 font-mono font-bold text-red-700">Ctrl + Shift + N</td><td className="p-2">إنشاء مجلد جديد فوراً</td><td className="p-2">الملفات والمجلدات</td></tr>
                    <tr><td className="p-2 font-mono font-bold text-red-700">F2</td><td className="p-2">إعادة تسمية الملف أو المجلد المحدد</td><td className="p-2">إدارة الملفات</td></tr>
                    <tr><td className="p-2 font-mono font-bold text-red-700">Shift + Delete</td><td className="p-2">الحذف النهائي متجاوزاً سلة المحذوفات</td><td className="p-2">تنظيف القرص</td></tr>
                    <tr><td className="p-2 font-mono font-bold text-red-700">Ctrl + Shift + Esc</td><td className="p-2">فتح مدير المهام (Task Manager) المباشر</td><td className="p-2">مراقبة الأداء والعتاد</td></tr>
                    <tr><td className="p-2 font-mono font-bold text-red-700">Alt + F4</td><td className="p-2">إغلاق النافذة أو إنهاء البرنامج الحالي</td><td className="p-2">التحكم السريع</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Glossary of Terms */}
            <div>
              <h2 className="text-base font-black text-slate-900 mb-2 border-b border-slate-200 pb-2">
                ملحق 2: معجم المصطلحات التقنية الأساسية (Glossary)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <strong className="text-red-700">CPU (المعالج): </strong> وحدة المعالجة المركزية وعقل الحاسوب الذي ينفذ كافة التعليمات.
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <strong className="text-red-700">RAM (الذاكرة العشوائية): </strong> ذاكرة سريعة متطايرة تخزن البرامج والبيانات النشطة حالياً.
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <strong className="text-red-700">SSD (القرص الصلب السريع): </strong> محرك تخزين دائم يعتمد على شرائح الذاكرة السريعة دون أجزاء متحركة.
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <strong className="text-red-700">OS (نظام التشغيل): </strong> البرمجية الأساسية المسؤولة عن تنسيق عمل العتاد والتطبيقات (مثل Windows).
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <strong className="text-red-700">GUI (الواجهة الرسومية): </strong> أسلوب التفاعل مع الحاسوب عبر النوافذ والأيقونات والفأرة بدلاً من الأوامر النصية.
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <strong className="text-red-700">ZIP Compression: </strong> خوارزمية لتقليص حجم الملفات وتجميعها في حزمة واحدة لتسهيل النقل والأرشفة.
                </div>
              </div>
            </div>

            {/* End of Handbook Accreditation Box */}
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-center space-y-2">
              <div className="text-xs font-black text-amber-900">
                تم اعتماد هذه الحقيبة التدريبية رسمياً وفق معايير التدريب المهني والتقني
              </div>
              <div className="text-xs text-slate-700">
                إشراف وتدريب المهندس: <strong>{COURSE_METADATA.instructor}</strong> | {COURSE_METADATA.institution}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                كود الاعتماد: VTC-DIGITAL-50Y-TM2025
              </div>
            </div>

          </div>

          <PdfRunningFooter pageNum={13} />

        </section>

      </div>

    </div>
  );
};

// Running Header Component with the mandatory logo
const PdfRunningHeader: React.FC<{ currentModuleTitle: string }> = ({ currentModuleTitle }) => (
  <div className="border-b-2 border-red-600 pb-3 mb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <VTCLogo size="sm" />
      <div className="text-right border-r border-slate-300 pr-2">
        <div className="text-[10px] font-black text-slate-800">مؤسسة التدريب المهني</div>
        <div className="text-[9px] text-amber-700 font-semibold">اليوبيل الذهبي 50 عاماً</div>
      </div>
    </div>

    <div className="text-left">
      <div className="text-[10px] font-extrabold text-slate-700 truncate max-w-xs sm:max-w-md">
        {currentModuleTitle}
      </div>
      <div className="text-[9px] text-slate-400 font-medium">
        حقيبة المهارات الرقمية | م. تامر مستريحي
      </div>
    </div>
  </div>
);

// Running Footer Component with instructor credit & page numbers
const PdfRunningFooter: React.FC<{ pageNum: number }> = ({ pageNum }) => (
  <div className="border-t border-slate-200 pt-2.5 mt-2 flex items-center justify-between text-[10px] text-slate-500">
    <div className="flex items-center gap-1">
      <span className="font-semibold">المحاضر:</span>
      <span className="font-bold text-red-700">{COURSE_METADATA.instructor}</span>
      <span className="text-slate-300 mx-1">|</span>
      <span>{COURSE_METADATA.institution}</span>
    </div>

    <div className="flex items-center gap-1 font-mono font-bold text-slate-700">
      <span>صفحة</span>
      <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-red-700">
        {pageNum}
      </span>
      <span>من 13</span>
    </div>
  </div>
);
