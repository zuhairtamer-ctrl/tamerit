import React from 'react';
import { 
  MonitorCheck, 
  Cpu, 
  Keyboard as KeyboardIcon, 
  Layers, 
  Settings, 
  AppWindow, 
  FolderGit2, 
  Archive, 
  Scissors, 
  HardDriveDownload,
  CheckCircle2,
  Circle,
  Clock,
  Award
} from 'lucide-react';
import { CourseUnit, COURSE_METADATA } from '../data/courseData';

interface SidebarProps {
  units: CourseUnit[];
  activeUnitId: number;
  setActiveUnitId: (id: number) => void;
  completedUnitIds: number[];
  searchQuery: string;
  onOpenCertificate: () => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MonitorCheck,
  Cpu,
  Keyboard: KeyboardIcon,
  Layers,
  Settings,
  AppWindow,
  FolderGit2,
  Archive,
  Scissors,
  HardDriveDownload,
};

export const Sidebar: React.FC<SidebarProps> = ({
  units,
  activeUnitId,
  setActiveUnitId,
  completedUnitIds,
  searchQuery,
  onOpenCertificate,
}) => {
  const filteredUnits = units.filter((unit) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      unit.title.toLowerCase().includes(q) ||
      unit.subtitle.toLowerCase().includes(q) ||
      unit.sections.some(s => 
        s.title.toLowerCase().includes(q) || 
        (s.content && s.content.some(c => c.toLowerCase().includes(q)))
      )
    );
  });

  const progressPercentage = Math.round((completedUnitIds.length / units.length) * 100);

  return (
    <aside className="w-full lg:w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 h-[calc(100vh-5.5rem)] sticky top-[5.5rem] overflow-hidden">
      
      {/* Course stats banner */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-slate-700">نسبة إنجاز المادة التدريبية</span>
          <span className="font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-600 to-amber-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {progressPercentage === 100 && (
          <button
            onClick={onOpenCertificate}
            className="mt-3 w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all animate-pulse"
          >
            <Award className="w-4 h-4" />
            <span>عرض وتحميل الشهادة المعتمدة</span>
          </button>
        )}
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 px-2 py-1 tracking-wider uppercase">
          فهرس المحاور التدريبية (10 محاور)
        </div>

        {filteredUnits.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500">
            لا توجد محاور مطابقة لبحثك &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredUnits.map((unit) => {
            const IconComponent = iconMap[unit.iconName] || MonitorCheck;
            const isActive = unit.id === activeUnitId;
            const isCompleted = completedUnitIds.includes(unit.id);

            return (
              <button
                key={unit.id}
                onClick={() => setActiveUnitId(unit.id)}
                className={`w-full text-right p-3 rounded-xl transition-all flex items-start gap-3 border ${
                  isActive
                    ? 'bg-red-50/80 border-red-200 shadow-2xs ring-1 ring-red-400/30'
                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-700'
                }`}
              >
                {/* Icon box */}
                <div
                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center mt-0.5 transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-black text-slate-400">
                      الوحدة {unit.id}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{unit.duration.split(' ')[0]} س</span>
                    </span>
                  </div>

                  <h3
                    className={`text-xs font-bold leading-snug truncate ${
                      isActive ? 'text-red-900 font-extrabold' : 'text-slate-800'
                    }`}
                  >
                    {unit.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {unit.subtitle}
                  </p>
                </div>

                {/* Completed status check */}
                <div className="shrink-0 mt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Instructor info footnote */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-red-100 border border-red-200 flex items-center justify-center font-black text-red-700 text-xs shrink-0">
            م.ت
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-800 truncate">{COURSE_METADATA.instructor}</div>
            <div className="text-[10px] text-slate-400 truncate">مؤسسة التدريب المهني</div>
          </div>
        </div>
      </div>

    </aside>
  );
};
