import { useEffect, useState } from 'react';
import { COURSE_UNITS, COURSE_METADATA } from './data/courseData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { UnitView } from './components/UnitView';
import { PdfExportView } from './components/PdfExportView';
import { InteractiveLabs } from './components/InteractiveLabs';
import { QuizSection } from './components/QuizSection';
import { CertificateModal } from './components/CertificateModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { VTCLogo } from './components/VTCLogo';
import { AuthModal } from './components/AuthModal';
import { LearningDashboard } from './components/LearningDashboard';
import { getSession, logoutAccount, saveProgress, saveQuizResult, type AuthSession, type AuthUser, type QuizSummary } from './lib/api';
import { 
  Sparkles, 
  Menu, 
  X, 
  Printer, 
  FlaskConical, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Heart
} from 'lucide-react';

const GUEST_PROGRESS_KEY = 'vtc-digital-skills-guest-progress-v1';

function readGuestProgress(): number[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(GUEST_PROGRESS_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter((id): id is number => Number.isInteger(id) && id >= 1 && id <= COURSE_UNITS.length))];
  } catch {
    return [];
  }
}

function nextUnitId(completedUnitIds: number[]): number {
  return COURSE_UNITS.find((unit) => !completedUnitIds.includes(unit.id))?.id
    ?? COURSE_UNITS[COURSE_UNITS.length - 1].id;
}

export function App() {
  const [currentTab, setCurrentTab] = useState<'course' | 'pdf' | 'labs' | 'quiz'>('course');
  const [activeUnitId, setActiveUnitId] = useState<number>(1);
  const [completedUnitIds, setCompletedUnitIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [latestQuiz, setLatestQuiz] = useState<QuizSummary | null>(null);
  const [authReady, setAuthReady] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    getSession()
      .then((session) => {
        if (cancelled) return;
        setCurrentUser(session.user);
        setLatestQuiz(session.latestQuiz);
        const progress = session.user ? session.completedUnitIds : readGuestProgress();
        setCompletedUnitIds(progress);
        setActiveUnitId(nextUnitId(progress));
      })
      .catch((error) => {
        console.warn('Account API is not available; continuing with guest progress.', error);
        if (!cancelled) {
          const progress = readGuestProgress();
          setCompletedUnitIds(progress);
          setActiveUnitId(nextUnitId(progress));
        }
      })
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    if (currentUser) {
      const timer = window.setTimeout(() => {
        saveProgress(completedUnitIds).catch((error) => console.warn('Progress could not be saved.', error));
      }, 250);
      return () => window.clearTimeout(timer);
    }
    try {
      localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(completedUnitIds));
    } catch (error) {
      console.warn('Guest progress could not be stored in this browser.', error);
    }
  }, [authReady, completedUnitIds, currentUser]);

  const activeUnit = COURSE_UNITS.find(u => u.id === activeUnitId) || COURSE_UNITS[0];

  const handleAuthenticated = (session: AuthSession) => {
    if (!session.user) return;
    setCurrentUser(session.user);
    setCompletedUnitIds(session.completedUnitIds);
    setActiveUnitId(nextUnitId(session.completedUnitIds));
    setLatestQuiz(session.latestQuiz);
  };

  const handleLogout = async () => {
    try {
      await logoutAccount();
    } catch (error) {
      console.warn('Logout request did not complete.', error);
    }
    setCurrentUser(null);
    setCompletedUnitIds([]);
    setActiveUnitId(1);
    setLatestQuiz(null);
  };

  const handleQuizResult = (score: number, total: number) => {
    if (!currentUser) return;
    saveQuizResult(score, total)
      .then(() => setLatestQuiz({ score, total, percentage: Math.round((score / total) * 100), created_at: new Date().toISOString() }))
      .catch((error) => console.warn('Quiz result could not be saved.', error));
  };

  const handleToggleComplete = (unitId: number) => {
    if (completedUnitIds.includes(unitId)) {
      setCompletedUnitIds(prev => prev.filter(id => id !== unitId));
    } else {
      setCompletedUnitIds(prev => [...prev, unitId]);
      // If there is a next unit, navigate there smoothly
      if (unitId < COURSE_UNITS.length) {
        setTimeout(() => {
          setActiveUnitId(unitId + 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
      }
    }
  };

  const handlePrevUnit = () => {
    if (activeUnitId > 1) {
      setActiveUnitId(activeUnitId - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextUnit = () => {
    if (activeUnitId < COURSE_UNITS.length) {
      setActiveUnitId(activeUnitId + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-red-600 selection:text-white" dir="rtl">
      
      {/* Top Navbar */}
      <div className="no-print">
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          completedUnitsCount={completedUnitIds.length}
          totalUnitsCount={COURSE_UNITS.length}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={() => { void handleLogout(); }}
        />
      </div>

      {/* Main Container Switcher */}
      {currentTab === 'pdf' ? (
        <main className="flex-1">
          <PdfExportView onBackToCourse={() => setCurrentTab('course')} />
        </main>
      ) : currentTab === 'labs' ? (
        <main className="flex-1 py-4">
          <InteractiveLabs />
        </main>
      ) : currentTab === 'quiz' ? (
        <main className="flex-1 py-4">
          <QuizSection onOpenCertificate={() => setIsCertificateOpen(true)} onQuizResult={handleQuizResult} />
        </main>
      ) : (
        /* Course E-learning View with Sidebar & Unit Detail */
        <div className="flex-1 w-full max-w-7xl mx-auto pb-8">
          <div className="px-4 pt-5 sm:px-6 lg:px-8 lg:pt-7">
            <LearningDashboard
              learnerName={currentUser?.name.split(' ')[0]}
              activeUnitTitle={activeUnit.title}
              completedUnitsCount={completedUnitIds.length}
              totalUnitsCount={COURSE_UNITS.length}
              latestQuiz={latestQuiz}
              onContinue={() => document.getElementById('course-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              onStartQuiz={() => setCurrentTab('quiz')}
            />
          </div>
          <div id="course-content" className="mt-6 flex flex-col px-4 lg:flex-row sm:px-6 lg:px-8 scroll-mt-28">
          
          {/* Mobile Sidebar Toggle Button */}
          <div className="lg:hidden p-3 bg-white border-b border-slate-200 flex items-center justify-between no-print">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>فهرس المحاور (10 وحدات)</span>
            </button>
            <span className="text-xs font-bold text-red-700">
              الوحدة {activeUnit.id}: {activeUnit.title.slice(0, 24)}...
            </span>
          </div>

          {/* Desktop & Mobile Sidebar */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block no-print`}>
            <Sidebar
              units={COURSE_UNITS}
              activeUnitId={activeUnitId}
              setActiveUnitId={(id) => {
                setActiveUnitId(id);
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              completedUnitIds={completedUnitIds}
              searchQuery={searchQuery}
              onOpenCertificate={() => setIsCertificateOpen(true)}
            />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 bg-slate-50/50 pb-12">
            <UnitView
              unit={activeUnit}
              isCompleted={completedUnitIds.includes(activeUnit.id)}
              onToggleComplete={handleToggleComplete}
              onPrevUnit={handlePrevUnit}
              onNextUnit={handleNextUnit}
              hasPrev={activeUnitId > 1}
              hasNext={activeUnitId < COURSE_UNITS.length}
            />
          </main>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        completedUnitsCount={completedUnitIds.length}
        totalUnitsCount={COURSE_UNITS.length}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Site Footer (Hidden on Print) */}
      <footer className="no-print bg-slate-900 text-white border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800 text-xs">
            
            {/* Institution Brand */}
            <div className="md:col-span-2 space-y-3">
              <div className="bg-white p-2.5 rounded-xl inline-block">
                <VTCLogo size="md" />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                {COURSE_METADATA.title} - المنهاج التدريبي المتكامل المعتمد لتطوير الكفاءات الرقمية لمواكبة متطلبات التحول الرقمي وسوق العمل، صادر بمناسبة اليوبيل الذهبي لمؤسسة التدريب المهني (50 عاماً).
              </p>
              <div className="flex items-center gap-2 text-amber-400 text-[11px] font-bold">
                <Sparkles className="w-4 h-4" />
                <span>50 عاماً من الريادة والتميز المهني في المملكة الأردنية الهاشمية</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-amber-400 text-sm">أقسام المنصة</h4>
              <ul className="space-y-1.5 text-slate-300">
                <li>
                  <button onClick={() => setCurrentTab('course')} className="hover:text-white flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-red-400" />
                    <span>المادة العلمية والمحاور</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('pdf')} className="hover:text-white flex items-center gap-1.5">
                    <Printer className="w-3.5 h-3.5 text-red-400" />
                    <span>طباعة وتصدير ملف PDF</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('labs')} className="hover:text-white flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-red-400" />
                    <span>المختبر التفاعلي والمحاكاة</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentTab('quiz')} className="hover:text-white flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-red-400" />
                    <span>الاختبار والتقييم الشامل</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsCertificateOpen(true)} className="hover:text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>شهادة الإتمام المعتمدة</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Instructor Credit & Information */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-amber-400 text-sm">المحاضر والمدرب</h4>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 space-y-1">
                <div className="text-white font-extrabold text-xs">{COURSE_METADATA.instructor}</div>
                <div className="text-slate-400 text-[11px] leading-relaxed">{COURSE_METADATA.instructorTitle}</div>
                <div className="text-amber-300 text-[10px] pt-1 border-t border-slate-700/50">
                  {COURSE_METADATA.institution}
                </div>
              </div>
            </div>

          </div>

          {/* Bottom sub-footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              جميع الحقوق محفوظة © {COURSE_METADATA.year} - مؤسسة التدريب المهني (Vocational Training Corporation)
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span>تم إعداد المادة بإشراف</span>
              <span className="text-white font-bold">{COURSE_METADATA.instructor}</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-1" />
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;
