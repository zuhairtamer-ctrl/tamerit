import React, { useState } from 'react';
import { X, Search, Command, Copy, Check } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  description: string;
  category: 'windows' | 'files' | 'editing' | 'tools';
}

const SHORTCUTS_DATA: ShortcutItem[] = [
  { keys: ['Win', 'Shift', 'S'], description: 'تشغيل أداة القطع Snipping Tool فورياً لالتقاط الشاشة', category: 'tools' },
  { keys: ['Win', 'E'], description: 'فتح مستكشف الملفات (File Explorer)', category: 'files' },
  { keys: ['Win', 'I'], description: 'فتح تطبيق الإعدادات (Settings)', category: 'windows' },
  { keys: ['Win', 'D'], description: 'تصغير كافة النوافذ وإظهار سطح المكتب فوراً', category: 'windows' },
  { keys: ['Alt', 'Tab'], description: 'التبديل السريع بين النوافذ والبرامج النشطة', category: 'windows' },
  { keys: ['Win', 'Tab'], description: 'فتح عرض المهام (Task View) والأسطح الافتراضية', category: 'windows' },
  { keys: ['Win', 'السهم الأيمن/الأيسر'], description: 'محاذاة النافذة إلى النصف الأيمن أو الأيسر من الشاشة (Snap)', category: 'windows' },
  { keys: ['Ctrl', 'Shift', 'N'], description: 'إنشاء مجلد جديد في المكان الحالي', category: 'files' },
  { keys: ['F2'], description: 'إعادة تسمية الملف أو المجلد المحدد فوراً', category: 'files' },
  { keys: ['Shift', 'Delete'], description: 'حذف الملف نهائياً دون المرور بسلة المحذوفات', category: 'files' },
  { keys: ['Ctrl', 'C'], description: 'نسخ الملف أو النص المحدد', category: 'editing' },
  { keys: ['Ctrl', 'X'], description: 'قص (نقل) الملف أو النص المحدد', category: 'editing' },
  { keys: ['Ctrl', 'V'], description: 'لصق العنصر المنسوخ أو المقصوص', category: 'editing' },
  { keys: ['Ctrl', 'Z'], description: 'التراجع عن آخر إجراء قمت به (Undo)', category: 'editing' },
  { keys: ['Ctrl', 'A'], description: 'تحديد كافة العناصر أو النصوص في النافذة', category: 'editing' },
  { keys: ['Ctrl', 'Shift', 'Esc'], description: 'فتح مدير المهام مباشرة (Task Manager)', category: 'tools' },
  { keys: ['Alt', 'F4'], description: 'إغلاق البرنامج أو النافذة الحالية', category: 'windows' },
  { keys: ['Alt', 'Shift'], description: 'التبديل بين لغات الكتابة (عربي / إنجليزي)', category: 'windows' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = SHORTCUTS_DATA.filter(s => 
    s.description.toLowerCase().includes(search.toLowerCase()) ||
    s.keys.join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (keys: string[]) => {
    const text = keys.join(' + ');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(text);
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">دليل اختصارات لوحة المفاتيح في Windows</h3>
              <p className="text-xs text-slate-500">أهم الاختصارات التي تضاعف سرعتك وإنتاجيتك الرقمية</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="ابحث عن اختصار أو وظيفة (مثال: قص، إعدادات، مجلد، F2)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
            autoFocus
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Shortcuts List */}
        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              لا توجد اختصارات تطابق بحثك
            </div>
          ) : (
            filtered.map((item, idx) => {
              const keyString = item.keys.join(' + ');
              const isCopied = copiedKey === keyString;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-xs"
                >
                  <span className="text-slate-700 font-medium flex-1 pl-2">
                    {item.description}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 font-mono text-xs font-black text-slate-800" dir="ltr">
                      {item.keys.map((k, kIdx) => (
                        <React.Fragment key={kIdx}>
                          <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded shadow-2xs text-[11px] font-bold text-slate-700">
                            {k}
                          </kbd>
                          {kIdx < item.keys.length - 1 && <span className="text-slate-400">+</span>}
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCopy(item.keys)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                      title="نسخ الاختصار"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
