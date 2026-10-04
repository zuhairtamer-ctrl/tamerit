import React, { useState } from 'react';
import { 
  CourseUnit, 
  COURSE_METADATA 
} from '../data/courseData';
import { 
  CheckCircle2, 
  Clock, 
  Target, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  Laptop, 
  Check, 
  AlertCircle,
  Lightbulb,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface UnitViewProps {
  unit: CourseUnit;
  isCompleted: boolean;
  onToggleComplete: (unitId: number) => void;
  onPrevUnit: () => void;
  onNextUnit: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const UnitView: React.FC<UnitViewProps> = ({
  unit,
  isCompleted,
  onToggleComplete,
  onPrevUnit,
  onNextUnit,
  hasPrev,
  hasNext,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
    setRevealedAnswers(prev => ({ ...prev, [questionId]: true }));
  };

  const handleCompleteUnit = () => {
    if (!isCompleted) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    }
    onToggleComplete(unit.id);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Unit Header Card */}
      <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-red-100/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                الوحدة التدريبية رقم {unit.id}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{unit.duration}</span>
              </span>
            </div>

            <button
              onClick={handleCompleteUnit}
              className={`flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full transition-all border ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-red-500 hover:text-red-600'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isCompleted ? 'تم إتمام هذا المحور ✓' : 'تحديد كمكتمل'}</span>
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2">
            {unit.title}
          </h1>
          <p className="text-base text-slate-600 font-medium leading-relaxed">
            {unit.subtitle}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span>المدرب: </span>
              <strong className="text-slate-800">{COURSE_METADATA.instructor}</strong>
            </div>
            <div>
              <span>المؤسسة: </span>
              <strong className="text-slate-800">{COURSE_METADATA.institutionEn}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Diagram or Illustration if present */}
      {unit.image && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900 relative group">
          <img
            src={unit.image}
            alt={unit.title}
            className="w-full h-64 md:h-80 object-cover object-center group-hover:scale-102 transition-transform duration-500 opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
            <div className="text-white text-xs font-medium bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              شكل توضيحي معتمد للمحور التدريبي رقم {unit.id}
            </div>
          </div>
        </div>
      )}

      {/* Learning Outcomes */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-3 text-amber-900 font-bold text-base">
          <Target className="w-5 h-5 text-amber-600" />
          <h2>مخرجات التعلم المستهدفة (Learning Outcomes)</h2>
        </div>
        <p className="text-xs text-amber-800/80 mb-4">
          بنهاية هذا المحور التدريبي، يتوقع من المتدرب أن يكون قادراً بكفاءة على:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {unit.learningOutcomes.map((outcome, idx) => (
            <div key={idx} className="flex items-start gap-2.5 bg-white/80 p-3 rounded-xl border border-amber-100">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs text-slate-700 leading-relaxed font-medium">
                {outcome}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Unit Sections */}
      <div className="space-y-8">
        {unit.sections.map((section, sIdx) => (
          <section key={sIdx} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2 h-6 bg-red-600 rounded-full inline-block" />
              {section.title}
            </h3>

            {section.content && (
              <div className="space-y-3 mb-5">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-sm text-slate-700 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Highlights callouts */}
            {section.highlights && (
              <div className="my-5 space-y-2">
                {section.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-start gap-3 bg-red-50/70 border-r-4 border-red-600 p-3 rounded-l-xl">
                    <Lightbulb className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-red-950 font-semibold leading-relaxed">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Tables if available */}
            {section.table && (
              <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100/90 text-slate-800 border-b border-slate-200 font-bold">
                    <tr>
                      {section.table.headers.map((th, thIdx) => (
                        <th key={thIdx} className="p-3 whitespace-nowrap">
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {section.table.rows.map((row, rIdx) => (
                      <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 text-slate-700 leading-relaxed font-medium">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Step-by-step guides */}
            {section.steps && (
              <div className="my-5 space-y-3">
                {section.steps.map((st) => (
                  <div key={st.step} className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {st.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-slate-800">{st.title}</h4>
                        {st.shortcut && (
                          <span className="bg-slate-200 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-slate-300">
                            {st.shortcut}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Practical Hands-on Exercise */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-amber-400 font-bold text-base">
          <Laptop className="w-5 h-5 text-amber-400" />
          <h3>تمرين عملي وتطبيق واقعي (Hands-on Lab)</h3>
        </div>
        <h4 className="text-sm font-bold text-white mb-2">
          {unit.practicalExercise.title}
        </h4>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          {unit.practicalExercise.description}
        </p>

        <div className="bg-white/10 rounded-xl p-4 border border-white/10 mb-4">
          <div className="text-xs font-bold text-amber-300 mb-2">خطوات التنفيذ للمتدرب:</div>
          <ul className="space-y-1.5 text-xs text-slate-200">
            {unit.practicalExercise.steps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/50 p-3 rounded-lg border border-emerald-800/50">
          <FileCheck className="w-4 h-4 shrink-0" />
          <span><strong>النتيجة المتوقعة:</strong> {unit.practicalExercise.expectedResult}</span>
        </div>
      </div>

      {/* Mini Quiz / Knowledge Check */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-base">
          <HelpCircle className="w-5 h-5 text-red-600" />
          <h3>تقييم الفهم السريع (Knowledge Check)</h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          أجب عن الأسئلة التالية للتأكد من استيعابك للمفاهيم الجوهرية في هذا المحور:
        </p>

        <div className="space-y-6">
          {unit.quiz.map((q, qIndex) => {
            const isAnswered = revealedAnswers[q.id];
            const chosen = selectedAnswers[q.id];
            const isCorrect = chosen === q.correctAnswer;

            return (
              <div key={q.id} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50">
                <div className="text-xs font-extrabold text-slate-800 mb-3 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {qIndex + 1}
                  </span>
                  <span>{q.question}</span>
                </div>

                <div className="space-y-2 mb-3">
                  {q.options.map((option, optIdx) => {
                    let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:border-slate-300';
                    if (isAnswered) {
                      if (optIdx === q.correctAnswer) {
                        optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (chosen === optIdx && !isCorrect) {
                        optionStyle = 'bg-red-50 border-red-500 text-red-900';
                      } else {
                        optionStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-right p-2.5 rounded-lg border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswered && optIdx === q.correctAnswer && (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isAnswered && chosen === optIdx && !isCorrect && (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className={`p-3 rounded-lg text-xs leading-relaxed ${
                    isCorrect ? 'bg-emerald-100/60 text-emerald-900' : 'bg-amber-100/60 text-amber-900'
                  }`}>
                    <strong>الشرح التوضيحي: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          onClick={onPrevUnit}
          disabled={!hasPrev}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
            hasPrev
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-98'
              : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
          <span>المحور السابق</span>
        </button>

        <button
          onClick={handleCompleteUnit}
          className={`flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-xl transition-all ${
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? 'محور مكتمل ✓' : 'إتمام هذا المحور والمتابعة'}</span>
        </button>

        <button
          onClick={onNextUnit}
          disabled={!hasNext}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
            hasNext
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-98'
              : 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50'
          }`}
        >
          <span>المحور التالي</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

    </article>
  );
};
