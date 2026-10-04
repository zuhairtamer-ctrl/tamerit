import { useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound, X } from 'lucide-react';
import { loginAccount, registerAccount, type AuthSession } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (session: AuthSession) => void;
}

export function AuthModal({ isOpen, onClose, onAuthenticated }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setBusy(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const session = mode === 'register'
        ? await registerAccount({ name, email, password })
        : await loginAccount({ email, password });
      onAuthenticated(session);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تسجيل الدخول الآن.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-bl from-[#611b28] via-red-700 to-red-600 px-7 pb-7 pt-8 text-white">
          <button type="button" aria-label="إغلاق" onClick={onClose} className="absolute left-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"><X className="h-4 w-4" /></button>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10"><LockKeyhole className="h-6 w-6 text-amber-300" /></div>
          <p className="text-xs font-bold text-amber-200">حسابك يحفظ رحلتك التعليمية</p>
          <h2 id="auth-title" className="mt-1 text-2xl font-black">{mode === 'login' ? 'مرحبًا بعودتك' : 'أنشئ حساب المتدرب'}</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-red-100">تابع الوحدات التي أنجزتها واحتفظ بنتائج اختباراتك في حسابك.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-7 py-6" dir="rtl">
          {mode === 'register' && (
            <label className="block space-y-1.5 text-sm font-bold text-slate-700">
              الاسم الكامل
              <span className="relative block">
                <UserRound className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="مثال: أحمد محمد" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100" />
              </span>
            </label>
          )}
          <label className="block space-y-1.5 text-sm font-bold text-slate-700">
            البريد الإلكتروني
            <span className="relative block">
              <Mail className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input autoComplete="email" type="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" dir="ltr" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-3 text-left text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100" />
            </span>
          </label>
          <label className="block space-y-1.5 text-sm font-bold text-slate-700">
            كلمة المرور
            <span className="relative block">
              <LockKeyhole className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} type={showPassword ? 'text' : 'password'} required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === 'register' ? '8 أحرف على الأقل' : 'أدخل كلمة المرور'} dir="ltr" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pr-10 pl-11 text-left text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-100" />
              <button type="button" aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'} onClick={() => setShowPassword((visible) => !visible)} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </span>
            {mode === 'register' && <span className="block text-[11px] font-medium text-slate-400">لن نخزن كلمة المرور كنص مكشوف.</span>}
          </label>

          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{error}</div>}

          <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-red-700 to-red-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-900/15 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-wait disabled:opacity-70">
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
            {busy ? 'جارٍ التحقق...' : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
          </button>
          <p className="text-center text-sm text-slate-500">
            {mode === 'login' ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }} className="font-extrabold text-red-700 hover:text-red-900">{mode === 'login' ? 'أنشئ حسابًا' : 'سجّل الدخول'}</button>
          </p>
        </form>
      </section>
    </div>
  );
}
