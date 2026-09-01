import React from "react";
import { useApp } from "../../context/AppContext";
import { GraduationCap, BookOpen, Filter, CheckCircle2, Layers } from "lucide-react";

interface ContextFilterBannerProps {
  selectedClassId?: string;
  onClassChange?: (classId: string) => void;
  selectedSubjectId?: string;
  onSubjectChange?: (subjectId: string) => void;
  showAllOption?: boolean;
  className?: string;
  extraControls?: React.ReactNode;
}

export const ContextFilterBanner: React.FC<ContextFilterBannerProps> = ({
  selectedClassId,
  onClassChange,
  selectedSubjectId,
  onSubjectChange,
  showAllOption = true,
  className = "",
  extraControls,
}) => {
  const {
    classes,
    subjects,
    activeClassId,
    setActiveClassId,
    activeSubjectId,
    setActiveSubjectId,
  } = useApp();

  const currentClassId = selectedClassId !== undefined ? selectedClassId : activeClassId;
  const currentSubjectId = selectedSubjectId !== undefined ? selectedSubjectId : activeSubjectId;

  const handleClassChange = (newClassId: string) => {
    if (onClassChange) {
      onClassChange(newClassId);
    }
    if (newClassId !== "all") {
      setActiveClassId(newClassId);
    }
  };

  const handleSubjectChange = (newSubjectId: string) => {
    if (onSubjectChange) {
      onSubjectChange(newSubjectId);
    }
    if (newSubjectId !== "all") {
      setActiveSubjectId(newSubjectId);
    }
  };

  const currentClassObj = classes.find((c) => c.id === currentClassId);
  const currentSubjectObj = subjects.find((s) => s.id === currentSubjectId);

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50/70 p-4 shadow-xs dark:border-slate-800 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Filter Konteks:</span>
        </div>

        {/* Class Selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
          <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Kelas:</span>
          <select
            value={currentClassId}
            onChange={(e) => handleClassChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none dark:text-white cursor-pointer"
          >
            {showAllOption && <option value="all">Semua Kelas / Rombel</option>}
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id} className="dark:bg-slate-900">
                {cls.name} ({cls.phase})
              </option>
            ))}
          </select>
        </div>

        {/* Subject Selector */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-2xs dark:border-slate-700 dark:bg-slate-800">
          <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Mapel:</span>
          <select
            value={currentSubjectId}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none dark:text-white cursor-pointer"
          >
            {showAllOption && <option value="all">Semua Mata Pelajaran</option>}
            {subjects.map((sbj) => (
              <option key={sbj.id} value={sbj.id} className="dark:bg-slate-900">
                {sbj.name} ({sbj.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {currentClassObj && currentClassId !== "all" && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-100/80 px-2.5 py-1 text-[11px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
            <CheckCircle2 className="h-3 w-3" />
            {currentClassObj.name} • {currentClassObj.phase}
          </span>
        )}
        {currentSubjectObj && currentSubjectId !== "all" && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-100/80 px-2.5 py-1 text-[11px] font-bold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900">
            <Layers className="h-3 w-3" />
            {currentSubjectObj.name}
          </span>
        )}
        {extraControls}
      </div>
    </div>
  );
};
