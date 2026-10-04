import React, { type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Application rendering failed:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main dir="rtl" className="grid min-h-screen place-items-center bg-slate-50 px-5 py-12 text-slate-900">
          <section role="alert" className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-700"><AlertTriangle className="h-7 w-7" /></div>
            <h1 className="mt-5 text-2xl font-black">تعذر تحميل واجهة المنصة</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">لم تُحمّل الصفحة بشكل صحيح. أعد المحاولة، وإذا تكرر العطل فتحقق من تشغيل الواجهة وخادم الحسابات معًا عبر الأمر <code dir="ltr" className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">npm run dev</code>.</p>
            <button onClick={() => window.location.reload()} className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-800"><RefreshCw className="h-4 w-4" /> إعادة تحميل الصفحة</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
