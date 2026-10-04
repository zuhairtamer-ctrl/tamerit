import { ArrowDown, ArrowLeft, Award, BookOpenCheck, Clock3, Sparkles, Target, TrendingUp } from 'lucide-react';

interface LearningDashboardProps {
  learnerName?: string;
  activeUnitTitle: string;
  completedUnitsCount: number;
  totalUnitsCount: number;
  latestQuiz?: { score: number; total: number; percentage: number } | null;
  onContinue: () => void;
  onStartQuiz: () => void;
}

export function LearningDashboard({ learnerName, activeUnitTitle, completedUnitsCount, totalUnitsCount, latestQuiz, onContinue, onStartQuiz }: LearningDashboardProps) {
  const percentage = totalUnitsCount ? Math.round((completedUnitsCount / totalUnitsCount) * 100) : 0;

  return (
    <section className="learning-dashboard relative isolate overflow-hidden rounded-[2rem] bg-[#171822] text-white shadow-[0_24px_70px_-36px_rgba(37,17,22,.65)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_0%,rgba(245,158,11,.25),transparent_27%),radial-gradient(circle_at_95%_100%,rgba(185,28,28,.54),transparent_38%),linear-gradient(115deg,#171822_0%,#21141b_56%,#501c29_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full border border-white/[.07]" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-8 -top-12 h-40 w-40 rounded-full border border-white/[.09]" />

      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10 lg:py-9">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-100/10 px-3 py-1.5 text-[11px] font-extrabold text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            مسارك المهني يبدأ بخطوة
          </div>
          <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl lg:text-[2.35rem]">
            {learnerName ? `أهلًا ${learnerName}،` : 'مرحبًا بك في رحلتك،'} <span className="text-amber-300">أتقن المهارات الرقمية.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            تعلّم بالتطبيق، اختبر فهمك، وراقب تقدّمك في عشرة محاور عملية صُمّمت لتقرب التقنية من عملك اليومي.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={onContinue} className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300/30">
              أكمل التعلّم <ArrowDown className="h-4 w-4" />
            </button>
            <button onClick={onStartQuiz} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.07] px-5 py-3 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/[.12] focus:outline-none focus:ring-4 focus:ring-white/10">
              اختبر معرفتك <ArrowLeft className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-300">
            <span className="inline-flex items-center gap-1.5"><BookOpenCheck className="h-4 w-4 text-amber-300" /> 10 وحدات تفاعلية</span>
            <span className="inline-flex items-center gap-1.5"><Target className="h-4 w-4 text-amber-300" /> 30 سؤالًا وتحديًا</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4 text-amber-300" /> تعلّم على وتيرتك</span>
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr] items-center gap-5 rounded-2xl border border-white/10 bg-white/[.06] p-5 backdrop-blur-sm sm:min-w-[330px] sm:gap-6 sm:p-6">
          <div className="relative grid h-28 w-28 place-items-center rounded-full sm:h-32 sm:w-32" style={{ background: `conic-gradient(#fcd34d ${percentage * 3.6}deg, rgba(255,255,255,.12) 0deg)` }} aria-label={`إنجاز ${percentage}%`}>
            <div className="grid h-[5.35rem] w-[5.35rem] place-items-center rounded-full bg-[#22171d] text-center sm:h-24 sm:w-24">
              <div><div className="text-2xl font-black text-white">{percentage}<span className="text-sm text-amber-300">%</span></div><div className="text-[10px] font-bold text-slate-400">منجز</div></div>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-200"><TrendingUp className="h-4 w-4" /> لوحة تقدّمك</div>
            <div className="mt-2 text-lg font-black">{completedUnitsCount}<span className="px-1 text-slate-500">/</span>{totalUnitsCount} وحدات</div>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300">التالي: {activeUnitTitle}</p>
            <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
              <Award className="h-3.5 w-3.5 text-amber-300" />
              {latestQuiz ? `آخر تقييم: ${latestQuiz.percentage}%` : 'أكمل المحاور لفتح الشهادة'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
