import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Clock, Calculator, Printer, Save, Sparkles } from "lucide-react";
import { ContextFilterBanner } from "../common/ContextFilterBanner";

export const AlokasiWaktuView: React.FC = () => {
  const {
    subjects,
    classes,
    activeSubjectId,
    setActiveSubjectId,
    activeClassId,
    setActiveClassId,
    settings,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
    addToast,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState(activeSubjectId || subjects[0]?.id || "sbj-inf");
  const [selectedClassId, setSelectedClassId] = useState(activeClassId || classes[0]?.id || "cls-10a");
  const [jpPerWeek, setJpPerWeek] = useState<number>(() => {
    const s = subjects.find((sbj) => sbj.id === (activeSubjectId || subjects[0]?.id));
    return s?.hoursPerWeek || 2;
  });
  const [totalWeeks, setTotalWeeks] = useState<number>(20);
  const [nonEffectiveWeeks, setNonEffectiveWeeks] = useState<number>(2); // MPLS, ASTS, ASAS, Libur
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (activeSubjectId) {
      setSelectedSubjectId(activeSubjectId);
      const match = subjects.find((s) => s.id === activeSubjectId);
      if (match) setJpPerWeek(match.hoursPerWeek);
    }
  }, [activeSubjectId, subjects]);

  const effectiveWeeks = Math.max(0, totalWeeks - nonEffectiveWeeks);
  const totalEffectiveHours = effectiveWeeks * jpPerWeek;
  const examAndRemedialHours = Math.round(totalEffectiveHours * 0.2); // ~20%
  const pureTeachingHours = totalEffectiveHours - examAndRemedialHours;

  const handlePrint = () => {
    setPreviewDoc({
      title: "Rincian Analisis Alokasi Waktu Efektif",
      docType: "ALOKASI_WAKTU",
      dataObj: {
        subject: subjects.find((s) => s.id === selectedSubjectId),
        classObj: classes.find((c) => c.id === selectedClassId),
        jpPerWeek,
        totalWeeks,
        nonEffectiveWeeks,
        effectiveWeeks,
        totalEffectiveHours,
        examAndRemedialHours,
        pureTeachingHours,
        school: schoolProfile,
        teacher: teacherProfile,
        academicYear: settings.activeAcademicYear,
        semester: settings.activeSemester,
      },
    });
  };

  const handleSave = () => {
    addToast("success", "Analisis Alokasi Waktu Tersimpan", `Total ${totalEffectiveHours} JP siap disinkronkan ke Promes & Prota.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Analisis Alokasi Waktu & Pekan Efektif
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perhitungan sistematis jumlah minggu kalender, minggu tidak efektif, dan jam pelajaran riil untuk penyusunan Promes dan Prota.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Dokumen
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Save className="h-4 w-4" />
            Simpan Analisis
          </button>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedClassId={selectedClassId}
        onClassChange={(id) => {
          setSelectedClassId(id);
          if (id !== "all") setActiveClassId(id);
        }}
        selectedSubjectId={selectedSubjectId}
        onSubjectChange={(id) => {
          setSelectedSubjectId(id);
          if (id !== "all") {
            setActiveSubjectId(id);
            const match = subjects.find((s) => s.id === id);
            if (match) setJpPerWeek(match.hoursPerWeek);
          }
        }}
        showAllOption={false}
      />

      {/* Input Parameters */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-1 space-y-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Calculator className="h-4 w-4 text-blue-600" />
            Parameter Perhitungan
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mata Pelajaran
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => {
                setSelectedSubjectId(e.target.value);
                const match = subjects.find((s) => s.id === e.target.value);
                if (match) setJpPerWeek(match.hoursPerWeek);
              }}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.hoursPerWeek} JP/Mgg)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Alokasi JP per Minggu
            </label>
            <input
              type="number"
              min={1}
              value={jpPerWeek}
              onChange={(e) => setJpPerWeek(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Total Minggu dalam Semester
            </label>
            <input
              type="number"
              min={1}
              value={totalWeeks}
              onChange={(e) => setTotalWeeks(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Minggu Tidak Efektif (MPLS, Ujian, Libur)
            </label>
            <input
              type="number"
              min={0}
              value={nonEffectiveWeeks}
              onChange={(e) => setNonEffectiveWeeks(Number(e.target.value))}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Calculation Result Cards */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-2 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Hasil Analisis & Distribusi Jam Pelajaran (JP)
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850">
              <span className="text-xs text-slate-500">Jumlah Minggu Efektif:</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                  {effectiveWeeks}
                </span>
                <span className="text-xs text-slate-400">Minggu (MEB)</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850">
              <span className="text-xs text-slate-500">Total Jam Efektif:</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {totalEffectiveHours}
                </span>
                <span className="text-xs text-slate-400">JP Total</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-850">
              <span className="text-xs text-slate-500">Tatap Muka Pembelajaran:</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {pureTeachingHours}
                </span>
                <span className="text-xs text-slate-400">JP Materi</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Formula Distribusi Jam Kurikulum Merdeka
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <p>• Total Jam = {effectiveWeeks} Minggu Efektif × {jpPerWeek} JP/Minggu = <strong>{totalEffectiveHours} JP</strong></p>
              <p>• Jam Pembelajaran Pokok Materi = <strong>{pureTeachingHours} JP</strong></p>
              <p>• Cadangan / Asesmen Sumatif & Remedial = <strong>{examAndRemedialHours} JP</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
