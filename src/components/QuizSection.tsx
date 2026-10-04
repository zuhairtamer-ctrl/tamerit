import React, { useState } from 'react';
import { COURSE_UNITS, COURSE_METADATA } from '../data/courseData';
import { BONUS_QUESTIONS } from '../data/bonusQuestions';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizSectionProps {
  onOpenCertificate: () => void;
  onQuizResult?: (score: number, total: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onOpenCertificate, onQuizResult }) => {
  // Aggregate the original course questions and scenario-based enrichment questions.
  const allQuestions = [
    ...COURSE_UNITS.flatMap(u => u.quiz.map(question => ({ unitTitle: u.title, unitId: u.id, question }))),
    ...BONUS_QUESTIONS,
  ];

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (qId: string, optIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let correct = 0;
    allQuestions.forEach(({ question }) => {
      if (answers[question.id] === question.correctAnswer) {
        correct += 1;
      }
    });
    return correct;
  };

  const total = allQuestions.length;
  const score = calculateScore();
  const percentage = Math.round((score / total) * 100);
  const isPassed = percentage >= 70;

  const handleSubmit = () => {
    setSubmitted(true);
    onQuizResult?.(score, total);
    if (isPassed) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      
      {/* Quiz Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-black/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>التقييم الشامل المعتمد للمهارات الرقمية</span>
            </div>
            <h1 className="text-2xl font-black">
              اختبار الكفاءة الشامل ({total} سؤالاً تقييمياً)
            </h1>
            <p className="text-xs text-red-100 mt-1 max-w-xl">
              يقيس الاختبار فهم المحاور العشرة عبر أسئلة المنهج وتحديات تطبيقية إضافية بإشراف {COURSE_METADATA.instructor}. اجتياز 70% يؤهلك للحصول على شهادة الإتمام.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center min-w-[120px]">
            <div className="text-2xl font-black">{Object.keys(answers).length} / {total}</div>
            <div className="text-[11px] text-amber-200 font-semibold">الأسئلة المجابة</div>
          </div>
        </div>
      </div>

      {/* Results Banner if submitted */}
      {submitted && (
        <div className={`p-6 rounded-2xl border ${
          isPassed 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-md' 
            : 'bg-amber-50 border-amber-300 text-amber-950 shadow-md'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${
                isPassed ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                {percentage}%
              </div>
              <div>
                <h3 className="text-lg font-black">
                  {isPassed ? 'مبارك! لقد اجتزت التقييم الشامل بنجاح باهر 🎓' : 'فرصة أخرى! لم تصل لنسبة الاجتياز المطلوبة (70%)'}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  أجبت بشكل صحيح على {score} من أصل {total} أسئلة ({percentage}%).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isPassed ? (
                <button
                  onClick={onOpenCertificate}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-98 animate-bounce"
                >
                  <Award className="w-4 h-4" />
                  <span>إصدار وتحميل شهادة الإتمام الرسمية</span>
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs px-4 py-2 rounded-xl"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة المحاولة من جديد</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {allQuestions.map(({ unitTitle, unitId, question }, qIdx) => {
          const selected = answers[question.id];
          const isCorrect = selected === question.correctAnswer;

          return (
            <div
              key={question.id}
              className={`bg-white rounded-2xl border p-6 transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-red-300 bg-red-50/20'
                  : 'border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              {/* Question metadata badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  المحور {unitId}: {unitTitle}
                </span>
                {question.id.startsWith('bonus-') && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">تحدٍّ تطبيقي</span>}

                {submitted && (
                  <span className={`flex items-center gap-1 text-xs font-black ${
                    isCorrect ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{isCorrect ? 'إجابة صحيحة (+1)' : 'إجابة غير صحيحة (0)'}</span>
                  </span>
                )}
              </div>

              {/* Question title */}
              <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-start gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {qIdx + 1}
                </span>
                <span>{question.question}</span>
              </h3>

              {/* Options */}
              <div className="space-y-2">
                {question.options.map((opt, optIdx) => {
                  let optClass = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300';
                  
                  if (selected === optIdx) {
                    optClass = 'bg-red-50 border-red-500 text-red-950 font-bold ring-1 ring-red-400';
                  }

                  if (submitted) {
                    if (optIdx === question.correctAnswer) {
                      optClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                    } else if (selected === optIdx && !isCorrect) {
                      optClass = 'bg-red-100 border-red-500 text-red-950 line-through';
                    } else {
                      optClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={submitted}
                      onClick={() => handleSelect(question.id, optIdx)}
                      className={`w-full text-right p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optClass}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-bold">
                          {['أ', 'ب', 'ج', 'د'][optIdx]}
                        </span>
                        <span>{opt}</span>
                      </span>
                      {submitted && optIdx === question.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed explanation when submitted */}
              {submitted && (
                <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                  <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1 text-[11px]">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>التوضيح العلمي من المدرب:</span>
                  </div>
                  <div>{question.explanation}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz action footer */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 sticky bottom-4">
        <div>
          <div className="text-xs font-bold text-slate-700">
            تمت الإجابة على {Object.keys(answers).length} من أصل {total} سؤالاً
          </div>
          <div className="text-[11px] text-slate-400">
            تأكد من مراجعة إجاباتك جيداً قبل التسليم النهائي للتقييم.
          </div>
        </div>

        <div className="flex items-center gap-2">
          {submitted ? (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الاختبار</span>
              </button>
              {isPassed && (
                <button
                  onClick={onOpenCertificate}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md"
                >
                  <Award className="w-4 h-4" />
                  <span>شهادة الإتمام</span>
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length === 0}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-98"
            >
              <span>تسليم التقييم وعرض النتيجة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
