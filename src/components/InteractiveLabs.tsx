import React, { useState } from 'react';
import { 
  FolderPlus, 
  FileText, 
  Trash2, 
  Scissors, 
  Archive, 
  HardDriveDownload, 
  RotateCcw, 
  Check, 
  Copy, 
  CornerUpLeft, 
  Layers,
  Sparkles,
  Download,
  AlertTriangle
} from 'lucide-react';

export const InteractiveLabs: React.FC = () => {
  const [activeLab, setActiveLab] = useState<'files' | 'snipping' | 'compression' | 'installer'>('files');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 md:p-8 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المختبر الرقمي التفاعلي - التدريب العملي</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black">
            محاكي المهارات الرقمية ونظام التشغيل Windows
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            تدرب افتراضياً على المهارات العملية المطلوبة: إدارة الملفات والمجلدات، ضغط الملفات، أداة القطع، وتثبيت وإلغاء البرمجيات.
          </p>
        </div>

        {/* Lab selector tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveLab('files')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeLab === 'files'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>إدارة الملفات والمجلدات</span>
          </button>

          <button
            onClick={() => setActiveLab('snipping')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeLab === 'snipping'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>أداة القطع (Snipping)</span>
          </button>

          <button
            onClick={() => setActiveLab('compression')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeLab === 'compression'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>ضغط وفك الملفات (ZIP)</span>
          </button>

          <button
            onClick={() => setActiveLab('installer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeLab === 'installer'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>تثبيت وإلغاء البرامج</span>
          </button>
        </div>
      </div>

      {/* Active Lab Component */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        {activeLab === 'files' && <FileExplorerSimulator />}
        {activeLab === 'snipping' && <SnippingToolSimulator />}
        {activeLab === 'compression' && <CompressionSimulator />}
        {activeLab === 'installer' && <InstallerSimulator />}
      </div>

    </div>
  );
};

/* =========================================================================
   LAB 1: FILE EXPLORER SIMULATOR
   ========================================================================= */
interface MockItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  extension?: string;
  size?: string;
  date: string;
}

const FileExplorerSimulator: React.FC = () => {
  const initialItems: MockItem[] = [
    { id: '1', name: 'التقارير_المهنية_2025', type: 'folder', date: '2025-05-10' },
    { id: '2', name: 'صور_الورشة_التدريبية', type: 'folder', date: '2025-05-12' },
    { id: '3', name: 'سيرة_ذاتية_محدثة', type: 'file', extension: '.docx', size: '240 KB', date: '2025-05-14' },
    { id: '4', name: 'كشف_حضور_المتدربين', type: 'file', extension: '.xlsx', size: '512 KB', date: '2025-05-15' },
    { id: '5', name: 'شهادة_إتمام_الدورة', type: 'file', extension: '.pdf', size: '1.2 MB', date: '2025-05-16' },
  ];

  const [items, setItems] = useState<MockItem[]>(initialItems);
  const [recycleBin, setRecycleBin] = useState<MockItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [clipboard, setClipboard] = useState<{ item: MockItem; action: 'copy' | 'cut' } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [message, setMessage] = useState<string>('مرحباً بك في محاكي مستكشف الملفات. جرب إنشاء مجلد أو إعادة تسمية أو حذف ملف.');

  const handleCreateFolder = () => {
    const newFolder: MockItem = {
      id: Date.now().toString(),
      name: `مجلد جديد ${items.filter(i => i.type === 'folder').length + 1}`,
      type: 'folder',
      date: new Date().toISOString().split('T')[0],
    };
    setItems([newFolder, ...items]);
    setSelectedId(newFolder.id);
    setMessage(`تم إنشاء مجلد جديد بنجاح: ${newFolder.name} (Ctrl+Shift+N)`);
  };

  const handleCreateFile = () => {
    const newFile: MockItem = {
      id: Date.now().toString(),
      name: `مستند_جديد_${items.length + 1}`,
      type: 'file',
      extension: '.txt',
      size: '12 KB',
      date: new Date().toISOString().split('T')[0],
    };
    setItems([newFile, ...items]);
    setSelectedId(newFile.id);
    setMessage(`تم إنشاء ملف نصي جديد بنجاح: ${newFile.name}.txt`);
  };

  const handleStartRename = () => {
    const item = items.find(i => i.id === selectedId);
    if (!item) return;
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const handleSaveRename = () => {
    if (!editingId || !editingName.trim()) return;
    setItems(items.map(i => i.id === editingId ? { ...i, name: editingName.trim() } : i));
    setEditingId(null);
    setMessage(`تم إعادة تسمية العنصر إلى: "${editingName.trim()}" (مفتاح F2)`);
  };

  const handleDelete = (permanent: boolean) => {
    const item = items.find(i => i.id === selectedId);
    if (!item) return;

    if (permanent) {
      setItems(items.filter(i => i.id !== selectedId));
      setSelectedId(null);
      setMessage(`تم الحذف النهائي للعنصر: ${item.name} فوراً (Shift + Delete)`);
    } else {
      setItems(items.filter(i => i.id !== selectedId));
      setRecycleBin([item, ...recycleBin]);
      setSelectedId(null);
      setMessage(`تم نقل ${item.name} إلى سلة المحذوفات. يمكن استرجاعه لاحقاً (Delete).`);
    }
  };

  const handleCopy = () => {
    const item = items.find(i => i.id === selectedId);
    if (!item) return;
    setClipboard({ item, action: 'copy' });
    setMessage(`تم نسخ "${item.name}" إلى الحافظة (Ctrl+C). اضغط 'لصق' لإدراجه.`);
  };

  const handleCut = () => {
    const item = items.find(i => i.id === selectedId);
    if (!item) return;
    setClipboard({ item, action: 'cut' });
    setMessage(`تم قص "${item.name}" (Ctrl+X). اضغط 'لصق' لنقله هنا.`);
  };

  const handlePaste = () => {
    if (!clipboard) return;
    if (clipboard.action === 'copy') {
      const copyItem: MockItem = {
        ...clipboard.item,
        id: Date.now().toString(),
        name: `${clipboard.item.name} - نسخة`,
        date: new Date().toISOString().split('T')[0],
      };
      setItems([copyItem, ...items]);
      setMessage(`تم لصق نسخة من "${clipboard.item.name}" (Ctrl+V)`);
    } else if (clipboard.action === 'cut') {
      setItems(items.map(i => i.id === clipboard.item.id ? clipboard.item : i));
      setClipboard(null);
      setMessage(`تم نقل "${clipboard.item.name}" بنجاح إلى هذا المجلد.`);
    }
  };

  const handleRestoreRecycle = (item: MockItem) => {
    setRecycleBin(recycleBin.filter(i => i.id !== item.id));
    setItems([item, ...items]);
    setMessage(`تم استرجاع "${item.name}" من سلة المحذوفات بنجاح.`);
  };

  return (
    <div className="space-y-4">
      {/* Simulation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={handleCreateFolder}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg font-bold transition-all shadow-2xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
            <span>مجلد جديد (Ctrl+Shift+N)</span>
          </button>

          <button
            onClick={handleCreateFile}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg font-bold transition-all shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>ملف نصي جديد</span>
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1" />

          <button
            onClick={handleStartRename}
            disabled={!selectedId}
            className="flex items-center gap-1.5 bg-white disabled:opacity-40 hover:bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg font-bold transition-all shadow-2xs"
          >
            <span>إعادة تسمية (F2)</span>
          </button>

          <button
            onClick={handleCopy}
            disabled={!selectedId}
            className="flex items-center gap-1 bg-white disabled:opacity-40 hover:bg-slate-50 border border-slate-300 text-slate-800 px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-2xs"
          >
            <Copy className="w-3.5 h-3.5 text-slate-600" />
            <span>نسخ (Ctrl+C)</span>
          </button>

          <button
            onClick={handleCut}
            disabled={!selectedId}
            className="flex items-center gap-1 bg-white disabled:opacity-40 hover:bg-slate-50 border border-slate-300 text-slate-800 px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-2xs"
          >
            <Scissors className="w-3.5 h-3.5 text-slate-600" />
            <span>قص (Ctrl+X)</span>
          </button>

          <button
            onClick={handlePaste}
            disabled={!clipboard}
            className="flex items-center gap-1 bg-white disabled:opacity-40 hover:bg-slate-50 border border-slate-300 text-slate-800 px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-2xs"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>لصق (Ctrl+V)</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleDelete(false)}
            disabled={!selectedId}
            className="flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg font-bold disabled:opacity-40 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف مؤقت (Delete)</span>
          </button>

          <button
            onClick={() => handleDelete(true)}
            disabled={!selectedId}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold disabled:opacity-40 transition-all text-[11px]"
            title="حذف نهائي بدون المرور بسلة المحذوفات"
          >
            <span>نهائي (Shift+Del)</span>
          </button>
        </div>
      </div>

      {/* Message Banner */}
      <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="font-semibold">{message}</span>
      </div>

      {/* Explorer Grid */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {/* Address bar */}
        <div className="bg-slate-50 p-2.5 border-b border-slate-200 text-xs font-mono text-slate-600 flex items-center gap-2">
          <span className="font-bold text-slate-800">المسار:</span>
          <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 flex-1">
            C:\المتدربين\مؤسسة_التدريب_المهني\مشروع_المهارات_الرقمية
          </span>
        </div>

        {/* Item table list */}
        <div className="p-4 bg-white min-h-[220px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((item) => {
              const isSelected = item.id === selectedId;
              const isEditing = item.id === editingId;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center group ${
                    isSelected
                      ? 'bg-red-50 border-red-400 ring-2 ring-red-400/30'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center mb-2">
                    {item.type === 'folder' ? (
                      <FolderPlus className="w-10 h-10 text-amber-500 group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="relative">
                        <FileText className="w-10 h-10 text-blue-500 group-hover:scale-105 transition-transform" />
                        {item.extension && (
                          <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-slate-800 text-white px-1 rounded uppercase">
                            {item.extension.replace('.', '')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="w-full flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                        className="w-full text-xs p-1 border border-red-500 rounded text-center bg-white"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveRename}
                        className="p-1 bg-red-600 text-white rounded text-[10px]"
                      >
                        ✓
                      </button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="text-xs font-bold text-slate-800 truncate" title={item.name}>
                        {item.name}
                        {item.extension}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {item.size || 'مجلد ملفات'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recycle Bin status panel */}
        {recycleBin.length > 0 && (
          <div className="bg-amber-50/70 border-t border-amber-200 p-3 text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Trash2 className="w-4 h-4 text-amber-600" />
              <span>سلة المحذوفات ({recycleBin.length} عناصر محذوفة مؤقتاً)</span>
            </div>
            <div className="flex items-center gap-2">
              {recycleBin.map((rItem) => (
                <button
                  key={rItem.id}
                  onClick={() => handleRestoreRecycle(rItem)}
                  className="flex items-center gap-1 bg-white border border-amber-300 px-2.5 py-1 rounded-md text-[11px] hover:bg-amber-100 font-semibold text-amber-900"
                >
                  <CornerUpLeft className="w-3 h-3 text-emerald-600" />
                  <span>استرجاع &quot;{rItem.name}&quot;</span>
                </button>
              ))}
              <button
                onClick={() => {
                  setRecycleBin([]);
                  setMessage('تم إفراغ سلة المحذوفات نهائياً!');
                }}
                className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md hover:bg-red-700"
              >
                إفراغ السلة الآن
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

/* =========================================================================
   LAB 2: SNIPPING TOOL SIMULATOR
   ========================================================================= */
const SnippingToolSimulator: React.FC = () => {
  const [snipMode, setSnipMode] = useState<'rect' | 'window' | 'full'>('rect');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [activePen, setActivePen] = useState<'yellow' | 'red' | 'none'>('yellow');
  const [highlightsCount, setHighlightsCount] = useState<number>(1);

  const handleTriggerSnip = () => {
    setIsCapturing(true);
    setCaptured(false);
    setTimeout(() => {
      setIsCapturing(false);
      setCaptured(true);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900 text-white rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold">أداة القطع في ويندوز (Snipping Tool)</h3>
            <p className="text-[11px] text-slate-400">الاختصار السريع: Windows Logo + Shift + S</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSnipMode('rect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              snipMode === 'rect' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            قص مستطيل (Rectangular)
          </button>
          <button
            onClick={() => setSnipMode('window')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              snipMode === 'window' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            قص نافذة (Window Snip)
          </button>
          <button
            onClick={() => setSnipMode('full')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              snipMode === 'full' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            كامل الشاشة (Fullscreen)
          </button>
          <button
            onClick={handleTriggerSnip}
            disabled={isCapturing}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-98"
          >
            <Scissors className="w-4 h-4" />
            <span>{isCapturing ? 'جارٍ الالتقاط...' : 'التقاط الشاشة الآن (Win+Shift+S)'}</span>
          </button>
        </div>
      </div>

      {/* Screen simulator canvas */}
      <div className="relative border-2 border-slate-300 rounded-xl overflow-hidden bg-slate-100 min-h-[300px] flex items-center justify-center">
        {isCapturing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs z-30 flex flex-col items-center justify-center text-white animate-pulse">
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-white/20 text-center">
              <Scissors className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-bounce" />
              <div className="font-bold text-sm">حدد المنطقة المطلوب التقاطها بالفأرة...</div>
              <div className="text-xs text-slate-400 mt-1">النمط النشط: {snipMode}</div>
            </div>
          </div>
        )}

        {/* Captured Result Canvas */}
        {captured ? (
          <div className="w-full p-6 space-y-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">شريط أدوات المحرر:</span>
                <button
                  onClick={() => setActivePen('yellow')}
                  className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                    activePen === 'yellow' ? 'bg-amber-200 text-amber-900 border border-amber-400' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                  <span>قلم تمييز أصفر</span>
                </button>
                <button
                  onClick={() => setActivePen('red')}
                  className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                    activePen === 'red' ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
                  <span>قلم توضيحي أحمر</span>
                </button>
                <button
                  onClick={() => setHighlightsCount(prev => prev + 1)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-700"
                >
                  + إضافة تظليل
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  تم النسخ تلقائياً للحافظة (Clipboard)
                </span>
                <button
                  onClick={() => alert('تم حفظ اللقطة بنجاح باسم "Capture_2025.png"')}
                  className="flex items-center gap-1 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-lg hover:bg-red-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>حفظ اللقطة (Ctrl+S)</span>
                </button>
              </div>
            </div>

            {/* Simulated Snapped Document with user annotations */}
            <div className="bg-white p-6 rounded-xl border-2 border-red-400 shadow-md max-w-xl mx-auto relative select-none">
              <div className="flex items-center justify-between border-b pb-3 mb-3">
                <div className="font-extrabold text-sm text-slate-900">تقرير إنجاز المهام الرقمية</div>
                <div className="text-[10px] text-slate-400">مؤسسة التدريب المهني</div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                تم بنجاح تثبيت وتحديث البرامج التطبيقية وتخصيص إعدادات العرض والصوت، مع تفعيل أحدث أنماط الحماية في نظام ويندوز.
              </p>

              {/* Dynamic highlights on the captured content */}
              {Array.from({ length: highlightsCount }).map((_, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded text-xs font-bold my-1 ${
                    activePen === 'yellow'
                      ? 'bg-amber-200/80 text-amber-950 border border-amber-300'
                      : 'bg-red-100/80 text-red-950 border border-red-400'
                  }`}
                >
                  ✓ لقطة موثقة بواسطة م. تامر مستريحي - مؤشر {idx + 1}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-8 space-y-2">
            <Scissors className="w-12 h-12 text-slate-400 mx-auto" />
            <div className="text-sm font-bold text-slate-700">اضغط على زر &quot;التقاط الشاشة الآن&quot; بالأعلى لتجربة الأداة</div>
            <div className="text-xs text-slate-400">ستشاهد كيف تعتّم الشاشة ويتم اقتصاص المحتوى وتظليله فورياً</div>
          </div>
        )}
      </div>

    </div>
  );
};

/* =========================================================================
   LAB 3: COMPRESSION & EXTRACTION SIMULATOR
   ========================================================================= */
const CompressionSimulator: React.FC = () => {
  const [stage, setStage] = useState<'original' | 'compressing' | 'zipped' | 'extracting' | 'extracted'>('original');

  const handleCompress = () => {
    setStage('compressing');
    setTimeout(() => {
      setStage('zipped');
    }, 1500);
  };

  const handleExtract = () => {
    setStage('extracting');
    setTimeout(() => {
      setStage('extracted');
    }, 1500);
  };

  const handleReset = () => {
    setStage('original');
  };

  return (
    <div className="space-y-6">
      
      {/* Intro Box */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 leading-relaxed flex items-center justify-between">
        <div>
          <strong className="text-slate-900">محاكي ضغط الملفات وفكها (ZIP): </strong>
          شاهد بالعين المجردة كيف يتقلص حجم مجموعة من 5 ملفات من 24 ميغابايت إلى 6.8 ميغابايت في حزمة واحدة، وكيف تتم عملية فك الضغط (Extract All).
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-slate-700 font-bold hover:bg-slate-100 text-xs shrink-0 mr-3"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة تعيين المحاكاة</span>
        </button>
      </div>

      {/* Workflow Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Step 1: Original Files */}
        <div className={`p-5 rounded-2xl border transition-all ${
          stage === 'original' || stage === 'compressing'
            ? 'bg-white border-red-500 shadow-md ring-2 ring-red-400/20'
            : 'bg-slate-50 border-slate-200 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs text-slate-800">1. الملفات غير المضغوطة</span>
            <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
              الحجم: 24.0 MB
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="truncate">خطة_التدريب_السنوية.docx</span>
              <span className="text-[10px] text-slate-400 mr-auto">6.5 MB</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span className="truncate">جداول_المتدربين_المعتمدة.xlsx</span>
              <span className="text-[10px] text-slate-400 mr-auto">4.8 MB</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-white rounded border border-slate-200">
              <FileText className="w-4 h-4 text-red-600" />
              <span className="truncate">دليل_المهارات_الرقمية.pdf</span>
              <span className="text-[10px] text-slate-400 mr-auto">12.7 MB</span>
            </div>
          </div>

          <button
            onClick={handleCompress}
            disabled={stage !== 'original'}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
          >
            <Archive className="w-4 h-4" />
            <span>{stage === 'compressing' ? 'جارٍ الضغط...' : 'ضغط إلى ZIP (Compress)'}</span>
          </button>
        </div>

        {/* Step 2: The ZIP Package */}
        <div className={`p-5 rounded-2xl border transition-all ${
          stage === 'zipped' || stage === 'extracting'
            ? 'bg-amber-50/70 border-amber-500 shadow-md ring-2 ring-amber-400/20'
            : 'bg-slate-50 border-slate-200 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs text-slate-800">2. ملف الأرشيف المضغوط (ZIP)</span>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              وفرت 72% مساحة!
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-amber-200 text-center space-y-2 mb-4">
            <Archive className="w-12 h-12 text-amber-600 mx-auto" />
            <div className="font-extrabold text-xs text-slate-900 truncate">
              حقيبة_التدريب_المهني_2025.zip
            </div>
            <div className="text-[11px] text-emerald-700 font-bold">
              الحجم الجديد: 6.8 MB فقط!
            </div>
            <div className="text-[10px] text-slate-500">
              حزمة واحدة مدمجة جاهزة للإرسال بالإيميل
            </div>
          </div>

          <button
            onClick={handleExtract}
            disabled={stage !== 'zipped'}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>{stage === 'extracting' ? 'جارٍ فك الضغط...' : 'فك الضغط (Extract All)'}</span>
          </button>
        </div>

        {/* Step 3: Extracted Normal Folder */}
        <div className={`p-5 rounded-2xl border transition-all ${
          stage === 'extracted'
            ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-400/20'
            : 'bg-slate-50 border-slate-200 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs text-slate-800">3. المجلد المستخرج بالكامل</span>
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              جاهز للاستخدام ✓
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-emerald-200 text-center space-y-2 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
              <Check className="w-6 h-6" />
            </div>
            <div className="font-bold text-xs text-slate-900">
              تم استخراج الملفات بكامل جودتها الأصلية!
            </div>
            <div className="text-[10px] text-slate-500">
              المسار: C:\Desktop\حقيبة_التدريب_المستخرجة\
            </div>
          </div>

          <div className="p-2.5 bg-emerald-100/60 rounded-xl text-emerald-950 text-[11px] leading-relaxed">
            تمت العملية بنجاح! يمكن للمتدرب الآن تشغيل أو تعديل الملفات دون أي عوائق.
          </div>
        </div>

      </div>

    </div>
  );
};

/* =========================================================================
   LAB 4: INSTALLER & UNINSTALLER SIMULATOR
   ========================================================================= */
const InstallerSimulator: React.FC = () => {
  const [appStatus, setAppStatus] = useState<'not_installed' | 'wizard_1' | 'wizard_2' | 'installing' | 'installed'>('not_installed');
  const [installedSize] = useState('184 MB');

  const startInstall = () => setAppStatus('wizard_1');
  const nextWizard = () => setAppStatus('wizard_2');
  const runInstall = () => {
    setAppStatus('installing');
    setTimeout(() => {
      setAppStatus('installed');
    }, 1800);
  };

  const handleUninstall = () => {
    if (confirm('هل أنت متأكد من رغبتك في إلغاء تثبيت التطبيق بالطريقة النظامية الآمنة؟')) {
      setAppStatus('not_installed');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Intro info */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 leading-relaxed">
        <strong>محاكي معالج التثبيت والإلغاء (Setup & Uninstall Wizard): </strong>
        عش تجربة تثبيت البرامج الاحترافية من خلال ملف .exe ومراحل معالج الإعداد، ثم تجربة إلغاء التثبيت بالطريقة الصحيحة عبر إعدادات ويندوز لمنع تراكم الملفات التالفة.
      </div>

      <div className="max-w-2xl mx-auto border border-slate-300 rounded-2xl overflow-hidden shadow-sm bg-white">
        
        {/* Mock OS Window Title */}
        <div className="bg-slate-800 text-white p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <HardDriveDownload className="w-4 h-4 text-amber-400" />
            <span className="font-bold">معالج إعداد البرامج - Setup Wizard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-600 inline-block" />
            <span className="w-3 h-3 rounded-full bg-slate-600 inline-block" />
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          </div>
        </div>

        {/* Wizard Stages */}
        <div className="p-6">
          
          {appStatus === 'not_installed' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600">
                <HardDriveDownload className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">برنامج المهارات الرقمية المتقدم (VTC Trainer Pro)</h3>
                <p className="text-xs text-slate-500 mt-1">الملف: VTC_Trainer_Setup_v2.exe (الحجم: 65 MB)</p>
              </div>

              <button
                onClick={startInstall}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                <HardDriveDownload className="w-4 h-4" />
                <span>تشغيل معالج التثبيت (Run as administrator)</span>
              </button>
            </div>
          )}

          {appStatus === 'wizard_1' && (
            <div className="space-y-4">
              <h4 className="font-black text-sm text-slate-800 border-b pb-2">
                الخطوة 1: اتفاقية ترخيص المستخدم النهائي (EULA)
              </h4>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 h-28 overflow-y-auto leading-relaxed">
                مرحباً بك في برنامج التدريب المهني. يُشترط لاستخدام هذا البرنامج الموافقة على شروط الاستخدام الآمن، وعدم إعادة هندسة البرمجيات أو توزيعها تجارياً دون ترخيص رسمي من مؤسسة التدريب المهني...
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-red-600" />
                <span>أوافق على كافة بنود اتفاقية الترخيص والشروط</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setAppStatus('not_installed')}
                  className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  onClick={nextWizard}
                  className="px-5 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
                >
                  التالي &gt;
                </button>
              </div>
            </div>
          )}

          {appStatus === 'wizard_2' && (
            <div className="space-y-4">
              <h4 className="font-black text-sm text-slate-800 border-b pb-2">
                الخطوة 2: تحديد مسار التثبيت والمكونات
              </h4>
              <div className="space-y-2 text-xs">
                <label className="font-bold text-slate-700 block">مسار المجلد الوجهة على القرص:</label>
                <input
                  type="text"
                  readOnly
                  value="C:\Program Files\VTC\DigitalSkillsTrainer\"
                  className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-mono text-slate-700 text-xs"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                المساحة المطلوبة على القرص: 184 MB | المساحة المتوفرة: 120 GB
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  onClick={() => setAppStatus('wizard_1')}
                  className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  &lt; السابق
                </button>
                <button
                  onClick={runInstall}
                  className="px-5 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs"
                >
                  بدء التثبيت (Install)
                </button>
              </div>
            </div>
          )}

          {appStatus === 'installing' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="font-bold text-sm text-slate-800">جارٍ نسخ الملفات وتسجيل المفاتيح في ويندوز...</div>
              <div className="w-full bg-slate-200 rounded-full h-3 max-w-md mx-auto overflow-hidden">
                <div className="bg-red-600 h-3 rounded-full animate-pulse w-3/4" />
              </div>
              <div className="text-xs text-slate-500 font-mono">C:\Program Files\VTC\bin\core.dll</div>
            </div>
          )}

          {appStatus === 'installed' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-black text-emerald-900 text-sm">تم تثبيت البرنامج بنجاح على جهازك!</div>
                  <div className="text-emerald-700 mt-1">البرنامج مسجل الآن في النظام وجاهز للاستخدام ومضاف في قائمة ابدأ.</div>
                </div>
              </div>

              {/* Windows Settings uninstaller simulator */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>محاكاة إلغاء التثبيت من: Settings &gt; Apps &gt; Installed apps</span>
                  <span className="text-[10px] text-slate-400">الحجم: {installedSize}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 text-xs">
                  <div>
                    <div className="font-bold text-slate-800">VTC Trainer Pro</div>
                    <div className="text-[10px] text-slate-400">الإصدار 2.4.0 | مؤسسة التدريب المهني</div>
                  </div>

                  <button
                    onClick={handleUninstall}
                    className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg border border-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>إلغاء التثبيت الآمن (Uninstall)</span>
                  </button>
                </div>

                <div className="flex items-start gap-2 text-[11px] text-amber-800 bg-amber-100/60 p-2 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    تذكر دائماً: إزالة التثبيت عبر هذا الزر تضمن حذف كافة ملفات التسجيل والمجلدات الفرعية بأمان دون الإضرار بالنظام.
                  </span>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => setAppStatus('not_installed')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  إعادة تجربة التثبيت من البداية
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
