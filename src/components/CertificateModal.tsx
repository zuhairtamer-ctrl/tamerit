import React, { useState } from 'react';
import { VTCLogo } from './VTCLogo';
import { COURSE_METADATA } from '../data/courseData';
import { X, Printer, Award, CheckCircle2, Sparkles } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedUnitsCount: number;
  totalUnitsCount: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  completedUnitsCount,
  totalUnitsCount,
}) => {
  const [traineeName, setTraineeName] = useState<string>('محمد أحمد عبدالله');
  const [issueDate] = useState<string>(new Date().toLocaleDateString('ar-JO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  if (!isOpen) return null;

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 relative shadow-2xl border border-slate-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Settings / Customization */}
        <div className="no-print mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم المتدرب كما ترغب بظهوره في الشهادة:
            </label>
            <input
              type="text"
              value={traineeName}
              onChange={(e) => setTraineeName(e.target.value)}
              placeholder="اكتب اسم المتدرب ثلاثياً أو رباعياً..."
              className="w-full text-xs font-bold p-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintCertificate}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الشهادة الآن</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            THE CERTIFICATE (PRINT READY)
           ======================================================== */}
        <div className="relative p-8 md:p-12 border-8 border-double border-amber-600/60 rounded-2xl bg-gradient-to-br from-amber-50/20 via-white to-red-50/20 text-center select-none shadow-sm overflow-hidden">
          
          {/* Subtle Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <VTCLogo size="xl" />
          </div>

          {/* Top Logo and Header */}
          <div className="flex items-center justify-between border-b-2 border-amber-500/40 pb-4 mb-6">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-500">المملكة الأردنية الهاشمية</div>
              <div className="text-xs font-black text-slate-800">مؤسسة التدريب المهني</div>
              <div className="text-[9px] font-semibold text-amber-700">اليوبيل الذهبي 50 عاماً</div>
            </div>

            {/* Mandatory VTC Logo */}
            <VTCLogo size="md" />

            <div className="text-left">
              <div className="text-[10px] font-mono text-slate-400">رقم الشهادة:</div>
              <div className="text-xs font-mono font-bold text-red-700">VTC-DS-2025-0894</div>
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-100/70 border border-amber-300 px-3 py-1 rounded-full text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>شهادة إتمام وتفوق معتمدة</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              شهادة كفاءة في المهارات الرقمية والحاسوبية
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              وفق المعايير المهنية المعتمدة لدى مؤسسة التدريب المهني
            </p>
          </div>

          {/* Certification Body Text */}
          <div className="space-y-4 max-w-xl mx-auto my-6 text-slate-700">
            <p className="text-xs text-slate-500">تشهد إدارة التدريب بأن المتدرب / المتدربة:</p>
            <div className="text-xl md:text-2xl font-black text-red-700 border-b-2 border-slate-300 pb-2 inline-block px-8">
              {traineeName || 'المتدرب الكريم'}
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              قد أتم بنجاح متطلبات <strong>الحقيبة التدريبية في المهارات الرقمية</strong> بواقع 10 محاور تدريبية شملت: أهمية الحاسوب، المكونات المادية والبرمجية، أجهزة الإدخال والإخراج، إدارة النوافذ، التعامل مع الملفات والمجلدات، ضغط البيانات، أداة القطع، وإدارة البرامج بأمان.
            </p>
          </div>

          {/* Golden Badge and Signatures */}
          <div className="pt-8 border-t border-slate-200 mt-8 grid grid-cols-3 items-end text-xs">
            
            {/* Institution stamp */}
            <div className="text-center">
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-red-500 flex flex-col items-center justify-center mx-auto text-[9px] text-red-700 font-bold mb-2">
                <span>خاتم الاعتماد</span>
                <span>المؤسسي</span>
              </div>
              <div className="font-bold text-slate-800">مؤسسة التدريب المهني</div>
              <div className="text-[10px] text-slate-400">قسم التدريب والتعليم المستمر</div>
            </div>

            {/* Central 50 Years Emblem */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex flex-col items-center justify-center mx-auto shadow-md mb-2">
                <Award className="w-6 h-6 text-white" />
                <span className="text-[9px] font-black uppercase">50 عاماً</span>
              </div>
              <div className="text-[10px] text-slate-500">التاريخ: {issueDate}</div>
            </div>

            {/* Instructor Signature */}
            <div className="text-center">
              <div className="font-serif italic text-red-700 text-sm font-black mb-2">
                Tamer Mistarihi
              </div>
              <div className="font-extrabold text-slate-900">{COURSE_METADATA.instructor}</div>
              <div className="text-[10px] text-slate-500">{COURSE_METADATA.instructorTitle}</div>
            </div>

          </div>

          {/* Verification footer */}
          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>إنجاز كامل المحاور ({completedUnitsCount}/{totalUnitsCount})</span>
            </span>
            <span>رمز التحقق الرقمي: VTC-VERIFY-2025-JORDAN</span>
          </div>

        </div>

      </div>
    </div>
  );
};
