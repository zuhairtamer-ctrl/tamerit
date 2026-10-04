import React from 'react';
import { VTCLogo } from './VTCLogo';
import { 
  Printer, 
  FlaskConical, 
  GraduationCap, 
  Keyboard, 
  Search, 
  BookOpen, 
  Sparkles,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { COURSE_METADATA } from '../data/courseData';

interface NavbarProps {
  currentTab: 'course' | 'pdf' | 'labs' | 'quiz';
  setCurrentTab: (tab: 'course' | 'pdf' | 'labs' | 'quiz') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  completedUnitsCount: number;
  totalUnitsCount: number;
  onOpenShortcuts: () => void;
  onOpenCertificate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  completedUnitsCount,
  totalUnitsCount,
  onOpenShortcuts,
  onOpenCertificate,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrintTrigger = () => {
    setCurrentTab('pdf');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top institution ribbon */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wide">المملكة الأردنية الهاشمية</span>
            <span className="opacity-60">|</span>
            <span>{COURSE_METADATA.institution}</span>
            <span className="opacity-60">|</span>
            <span className="bg-amber-400 text-red-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              اليوبيل الذهبي 50 عاماً
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-0.5 rounded-md">
              <span className="text-amber-200 font-semibold">إعداد وإشراف:</span>
              <span className="font-bold underline decoration-amber-400 decoration-2">{COURSE_METADATA.instructor}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-amber-200 transition-colors text-[11px]"
              title="مشاركة رابط المادة التدريبية"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'تم النسخ!' : 'مشاركة'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Main Title */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentTab('course')}>
            <div className="p-1 bg-white rounded-lg border border-slate-100 shadow-2xs hover:scale-102 transition-transform">
              <VTCLogo size="sm" />
            </div>
            <div className="hidden sm:block border-r border-slate-200 pr-4">
              <h1 className="text-base font-extrabold text-slate-800 leading-tight">
                الحقيبة التدريبية في المهارات الرقمية
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                دليل المتدرب الشامل والمعتمد | م. تامر مستريحي
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs hidden md:block">
            <input
              type="text"
              placeholder="ابحث في محاور المادة ومفاهيمها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-100/90 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Action Tabs & Buttons */}
          <div className="flex items-center gap-2">
            
            {/* View Mode Switcher */}
            <nav className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setCurrentTab('course')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentTab === 'course'
                    ? 'bg-white text-red-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>المادة العلمية</span>
              </button>

              <button
                onClick={() => setCurrentTab('pdf')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentTab === 'pdf'
                    ? 'bg-white text-red-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>كتاب PDF</span>
              </button>

              <button
                onClick={() => setCurrentTab('labs')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentTab === 'labs'
                    ? 'bg-white text-red-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                <span className="hidden sm:inline">المختبر التفاعلي</span>
                <span className="sm:hidden">المختبر</span>
              </button>

              <button
                onClick={() => setCurrentTab('quiz')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentTab === 'quiz'
                    ? 'bg-white text-red-700 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">التقييم الشامل</span>
                <span className="sm:hidden">التقييم</span>
              </button>
            </nav>

            {/* Quick Keyboard Shortcuts Trigger */}
            <button
              onClick={onOpenShortcuts}
              title="دليل اختصارات ويندوز السريعة"
              className="p-2 text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-all"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Print directly as PDF button */}
            <button
              onClick={handlePrintTrigger}
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all hover:shadow-md active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>تحميل / طباعة PDF</span>
            </button>

            {/* Progress Badge */}
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors"
              title="عرض نسبة الإنجاز والشهادة المعتمدة"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{completedUnitsCount}/{totalUnitsCount}</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
