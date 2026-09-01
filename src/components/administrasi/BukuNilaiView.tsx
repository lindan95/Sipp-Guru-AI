import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  FileSpreadsheet,
  Printer,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Award,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Save,
  Sliders,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface StudentScoreRecord {
  studentId: string;
  nis: string;
  name: string;
  tp1: number;
  tp2: number;
  tp3: number;
  tp4: number;
  tp5: number;
  tp6: number;
  tp7: number;
  tp8: number;
  tp9: number;
  tp10: number;
  lm1: number;
  lm2: number;
  lm3: number;
  lm4: number;
  lm5: number;
  lm6: number;
  lm7: number;
  lm8: number;
  lm9: number;
  lm10: number;
  sas: number;
  catatan?: string;
}

const TP_COLS = [
  { key: "tp1", label: "TP 1" },
  { key: "tp2", label: "TP 2" },
  { key: "tp3", label: "TP 3" },
  { key: "tp4", label: "TP 4" },
  { key: "tp5", label: "TP 5" },
  { key: "tp6", label: "TP 6" },
  { key: "tp7", label: "TP 7" },
  { key: "tp8", label: "TP 8" },
  { key: "tp9", label: "TP 9" },
  { key: "tp10", label: "TP 10" },
] as const;

const LM_COLS = [
  { key: "lm1", label: "LM 1" },
  { key: "lm2", label: "LM 2" },
  { key: "lm3", label: "LM 3" },
  { key: "lm4", label: "LM 4" },
  { key: "lm5", label: "LM 5" },
  { key: "lm6", label: "LM 6" },
  { key: "lm7", label: "LM 7" },
  { key: "lm8", label: "LM 8" },
  { key: "lm9", label: "LM 9" },
  { key: "lm10", label: "LM 10" },
] as const;

const getDefaultRecord = (studentId: string, nis = "", name = "", baseScore = 82): StudentScoreRecord => {
  const mod = (offset: number) => Math.min(98, Math.max(65, baseScore + ((offset * 3) % 11) - 4));
  return {
    studentId,
    nis,
    name,
    tp1: mod(1),
    tp2: mod(2),
    tp3: mod(3),
    tp4: mod(4),
    tp5: mod(5),
    tp6: mod(6),
    tp7: mod(7),
    tp8: mod(8),
    tp9: mod(9),
    tp10: mod(10),
    lm1: mod(11),
    lm2: mod(12),
    lm3: mod(13),
    lm4: mod(14),
    lm5: mod(15),
    lm6: mod(16),
    lm7: mod(17),
    lm8: mod(18),
    lm9: mod(19),
    lm10: mod(20),
    sas: mod(5),
  };
};

export const BukuNilaiView: React.FC = () => {
  const {
    classes,
    students,
    subjects,
    activeClassId,
    setActiveClassId,
    activeSubjectId,
    setActiveSubjectId,
    schoolProfile,
    teacherProfile,
    setPreviewDoc,
    addToast,
    gradeRecords,
    saveGrade,
    setActiveMenu,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassId || classes[0]?.id || "cls-10a");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(activeSubjectId || subjects[0]?.id || "sbj-inf");
  const [selectedSemester, setSelectedSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [academicYear, setAcademicYear] = useState<string>("2024/2025");
  const [kktp, setKktp] = useState<number>(75);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (activeClassId && activeClassId !== "all") {
      setSelectedClassId(activeClassId);
    }
  }, [activeClassId]);

  useEffect(() => {
    if (activeSubjectId && activeSubjectId !== "all") {
      setSelectedSubjectId(activeSubjectId);
    }
  }, [activeSubjectId]);

  // Bobot Nilai Akhir: Formatif (NF), Sumatif LM (NS), SAS
  const [weightFmt, setWeightFmt] = useState<number>(30);
  const [weightSum, setWeightSum] = useState<number>(40);
  const [weightSas, setWeightSas] = useState<number>(30);
  const [isSettingWeightOpen, setIsSettingWeightOpen] = useState(false);

  const currentStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);

  // Default initial scores state for students in selected class
  const [scoreList, setScoreList] = useState<Record<string, StudentScoreRecord>>(() => {
    const map: Record<string, StudentScoreRecord> = {};
    const baseScores: Record<string, number> = {
      "std-001": 88,
      "std-002": 93,
      "std-003": 76,
      "std-004": 85,
      "std-005": 71,
      "std-006": 96,
      "std-007": 81,
      "std-008": 86,
      "std-009": 83,
      "std-010": 89,
    };

    Object.keys(baseScores).forEach((id) => {
      map[id] = getDefaultRecord(id, "24100" + id.slice(-1), "", baseScores[id]);
    });
    return map;
  });

  // Update specific cell in score table
  const handleScoreChange = (
    studentId: string,
    field: keyof Omit<StudentScoreRecord, "studentId" | "nis" | "name" | "catatan">,
    value: number
  ) => {
    const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    setScoreList((prev) => {
      const existing = prev[studentId] || getDefaultRecord(studentId);
      return {
        ...prev,
        [studentId]: {
          ...existing,
          [field]: clamped,
        },
      };
    });
  };

  // Quick autofill all scores with a uniform base score
  const handleQuickFillAll = (baseScore: number) => {
    setScoreList((prev) => {
      const updated = { ...prev };
      currentStudents.forEach((std) => {
        updated[std.id] = getDefaultRecord(std.id, std.nis, std.name, baseScore);
      });
      return updated;
    });
    addToast("info", "Pengisian Nilai Otomatis", `Nilai TP 1-10 & LM 1-10 diisi dengan basis nilai ${baseScore}.`);
  };

  // Calculations per student
  const computedStudents = useMemo(() => {
    return currentStudents.map((std) => {
      const rec = scoreList[std.id] || getDefaultRecord(std.id, std.nis, std.name, 82);

      const tpScores = [
        rec.tp1, rec.tp2, rec.tp3, rec.tp4, rec.tp5,
        rec.tp6, rec.tp7, rec.tp8, rec.tp9, rec.tp10,
      ].map((v) => (typeof v === "number" && !isNaN(v) ? v : 0));

      const lmScores = [
        rec.lm1, rec.lm2, rec.lm3, rec.lm4, rec.lm5,
        rec.lm6, rec.lm7, rec.lm8, rec.lm9, rec.lm10,
      ].map((v) => (typeof v === "number" && !isNaN(v) ? v : 0));

      const avgFmt = Math.round(tpScores.reduce((a, b) => a + b, 0) / 10);
      const avgSum = Math.round(lmScores.reduce((a, b) => a + b, 0) / 10);
      const sas = rec.sas ?? 80;

      const totalWeight = weightFmt + weightSum + weightSas || 100;
      const finalScore = Math.round(
        (avgFmt * weightFmt + avgSum * weightSum + sas * weightSas) / totalWeight
      );

      let predicate: "A" | "B" | "C" | "D" = "D";
      if (finalScore >= 90) predicate = "A";
      else if (finalScore >= 80) predicate = "B";
      else if (finalScore >= kktp) predicate = "C";
      else predicate = "D";

      const isPassed = finalScore >= kktp;

      // Deskripsi Capaian Otomatis Kurikulum Merdeka
      let deskripsi = "";
      if (finalScore >= 90) {
        deskripsi = `Menunjukkan penguasaan yang sangat istimewa dalam seluruh TP 1 - TP 10 ${selectedSubject?.name || "Mata Pelajaran"}, berpikir kritis mandiri.`;
      } else if (finalScore >= 80) {
        deskripsi = `Menunjukkan penguasaan yang baik dalam memahami konsep materi ${selectedSubject?.name || "Mata Pelajaran"} (TP 1-10 & LM 1-10) serta terampil menyelesaikan tugas.`;
      } else if (finalScore >= kktp) {
        deskripsi = `Mencapai kriteria ketuntasan minimal, perlu penguatan pada beberapa TP/LM yang belum optimal.`;
      } else {
        deskripsi = `Perlu bimbingan dan intervensi khusus untuk materi dasar TP/LM serta pengerjaan asesmen remedial.`;
      }

      return {
        ...std,
        scores: rec,
        avgFmt,
        avgSum,
        sas,
        finalScore,
        predicate,
        isPassed,
        deskripsi,
      };
    });
  }, [
    currentStudents,
    scoreList,
    weightFmt,
    weightSum,
    weightSas,
    kktp,
    selectedSubject,
  ]);

  // Filtered by search query
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return computedStudents;
    const q = searchQuery.toLowerCase();
    return computedStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q)
    );
  }, [computedStudents, searchQuery]);

  // Overall Statistics
  const stats = useMemo(() => {
    if (computedStudents.length === 0) {
      return { avg: 0, highest: 0, lowest: 0, passCount: 0, passPercent: 0, aCount: 0, bCount: 0, cCount: 0, dCount: 0 };
    }
    const finalScores = computedStudents.map((s) => s.finalScore);
    const avg = Math.round(finalScores.reduce((a, b) => a + b, 0) / finalScores.length);
    const highest = Math.max(...finalScores);
    const lowest = Math.min(...finalScores);
    const passCount = computedStudents.filter((s) => s.isPassed).length;
    const passPercent = Math.round((passCount / computedStudents.length) * 100);

    const aCount = computedStudents.filter((s) => s.predicate === "A").length;
    const bCount = computedStudents.filter((s) => s.predicate === "B").length;
    const cCount = computedStudents.filter((s) => s.predicate === "C").length;
    const dCount = computedStudents.filter((s) => s.predicate === "D").length;

    return { avg, highest, lowest, passCount, passPercent, aCount, bCount, cCount, dCount };
  }, [computedStudents]);

  const handleSaveAll = () => {
    // Save to GradeRecord in AppContext
    saveGrade({
      id: `grd-${selectedClassId}-${selectedSubjectId}-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      assessmentType: "Sumatif",
      topic: `Buku Nilai Terpadu Semester ${selectedSemester} (${selectedSubject?.name})`,
      kktpStandard: kktp,
      scores: computedStudents.map((s) => ({
        studentId: s.id,
        score: s.finalScore,
        note: `Predikat ${s.predicate} (${s.isPassed ? "Tuntas" : "Remedial"})`,
      })),
      createdAt: new Date().toISOString(),
    });
    addToast("success", "Buku Nilai Berhasil Disimpan", `Data nilai kelas ${selectedClass?.name} tersimpan.`);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: `Buku Daftar Nilai Siswa - Kelas ${selectedClass?.name || ""} (${selectedSubject?.name || ""})`,
      docType: "BUKU_NILAI_DOCUMENT",
      dataObj: {
        orientation: "landscape",
        classInfo: selectedClass,
        subjectInfo: selectedSubject,
        semester: selectedSemester,
        academicYear,
        kktp,
        weights: { fmt: weightFmt, sum: weightSum, sas: weightSas },
        students: computedStudents,
        stats,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "No",
      "NIS",
      "Nama Siswa",
      "TP 1",
      "TP 2",
      "TP 3",
      "TP 4",
      "TP 5",
      "TP 6",
      "TP 7",
      "TP 8",
      "TP 9",
      "TP 10",
      "Rata Formatif (NF)",
      "LM 1",
      "LM 2",
      "LM 3",
      "LM 4",
      "LM 5",
      "LM 6",
      "LM 7",
      "LM 8",
      "LM 9",
      "LM 10",
      "Rata Sumatif (NS)",
      "SAS/SAT",
      "Nilai Akhir (NA)",
      "Predikat",
      "Status Ketuntasan",
      "Deskripsi Capaian",
    ];

    const rows = computedStudents.map((s, idx) => [
      idx + 1,
      `"${s.nis || "-"}"`,
      `"${s.name}"`,
      s.scores.tp1,
      s.scores.tp2,
      s.scores.tp3,
      s.scores.tp4,
      s.scores.tp5,
      s.scores.tp6,
      s.scores.tp7,
      s.scores.tp8,
      s.scores.tp9,
      s.scores.tp10,
      s.avgFmt,
      s.scores.lm1,
      s.scores.lm2,
      s.scores.lm3,
      s.scores.lm4,
      s.scores.lm5,
      s.scores.lm6,
      s.scores.lm7,
      s.scores.lm8,
      s.scores.lm9,
      s.scores.lm10,
      s.avgSum,
      s.sas,
      s.finalScore,
      s.predicate,
      s.isPassed ? "Tuntas" : "Belum Tuntas",
      `"${s.deskripsi.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Buku_Nilai_TP1-10_LM1-10_${selectedClass?.name || "Kelas"}_${selectedSubject?.name || "Mapel"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("success", "Export Selesai", "File CSV Buku Nilai (TP 1-10 & LM 1-10) berhasil diunduh.");
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            Buku Nilai Siswa (Daftar Nilai Terpadu)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pengelolaan buku nilai lengkap: Formatif (TP), Sumatif Lingkup Materi (LM), Sumatif Akhir Semester (SAS), kalkulasi Nilai Akhir (NA), dan Predikat Kurikulum Merdeka.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSettingWeightOpen(!isSettingWeightOpen)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Sliders className="h-3.5 w-3.5 text-slate-500" />
            Atur Bobot NA
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            Export CSV / Excel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            title="Cetak Buku Nilai Siswa (Format Kertas Landscape)"
          >
            <Printer className="h-3.5 w-3.5 text-blue-600" />
            Cetak Nilai (Landscape)
          </button>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Save className="h-4 w-4" />
            Simpan Buku Nilai
          </button>
        </div>
      </div>

      {/* Penilaian Sub-navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          onClick={() => setActiveMenu("penilaian")}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <Award className="h-3.5 w-3.5" />
          Buku Nilai Terpadu
        </button>
        <button
          onClick={() => setActiveMenu("buku_catatan_bab")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Buku Catatan per Bab
        </button>
        <button
          onClick={() => setActiveMenu("penilaian_tugas")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Penilaian Tugas
        </button>
        <button
          onClick={() => setActiveMenu("asesmen_perbab")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Asesmen per Bab
        </button>
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
          if (id !== "all") setActiveSubjectId(id);
        }}
        showAllOption={false}
        extraControls={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value as any)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-750 dark:bg-slate-850 dark:text-slate-200"
              >
                <option value="Ganjil">Semester 1 (Ganjil)</option>
                <option value="Genap">Semester 2 (Genap)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">KKTP:</span>
              <input
                type="number"
                min={0}
                max={100}
                value={kktp}
                onChange={(e) => setKktp(Number(e.target.value))}
                className="w-16 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-center text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-750 dark:bg-slate-850 dark:text-slate-200"
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa / NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs dark:border-slate-750 dark:bg-slate-850 dark:text-slate-200"
              />
            </div>
          </div>
        }
      />

      {/* Setting Bobot Collapsible */}
      {isSettingWeightOpen && (
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              Formulasi Pembobotan Nilai Akhir (NA) Rapor
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  Bobot Formatif / TP (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={weightFmt}
                  onChange={(e) => setWeightFmt(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  Bobot Sumatif Lingkup Materi (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={weightSum}
                  onChange={(e) => setWeightSum(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400">
                  Bobot Sumatif Akhir Semester (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={weightSas}
                  onChange={(e) => setWeightSas(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>
              <div className="flex flex-col justify-end">
                <span className="text-[11px] text-slate-500">
                  Total Bobot:{" "}
                  <strong className={weightFmt + weightSum + weightSas === 100 ? "text-emerald-600" : "text-amber-600"}>
                    {weightFmt + weightSum + weightSas}%
                  </strong>
                </span>
                <span className="text-[10px] text-slate-400">Formula: (NF×{weightFmt} + NS×{weightSum} + SAS×{weightSas}) / {weightFmt + weightSum + weightSas}</span>
              </div>
            </div>
          </div>
        )}

      {/* Analytics Highlights */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Rata-rata Kelas</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-blue-600">{stats.avg}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Ketuntasan Klasikal</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-black ${stats.passPercent >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
              {stats.passPercent}%
            </span>
            <span className="text-xs text-slate-400">({stats.passCount}/{computedStudents.length})</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Nilai Tertinggi</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-600">{stats.highest}</span>
            <span className="text-xs text-slate-400">Maks</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Nilai Terendah</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-rose-600">{stats.lowest}</span>
            <span className="text-xs text-slate-400">Min</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Predikat A & B</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-purple-600">{stats.aCount + stats.bCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Perlu Remedial</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-black ${computedStudents.length - stats.passCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {computedStudents.length - stats.passCount}
            </span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>
      </div>

      {/* Main Gradebook Spreadsheet Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Daftar Leger Nilai: {selectedClass?.name} - {selectedSubject?.name}
            </span>
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {filteredList.length} Peserta Didik
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            * Kolom nilai dapat diedit langsung secara interaktif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Top Header Grouping */}
              <tr className="border-b border-slate-200 bg-slate-100 text-[10px] font-black uppercase text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                <th rowSpan={2} className="border-r border-slate-200 px-3 py-2 text-center w-10 sticky left-0 bg-slate-100 dark:bg-slate-800 z-10 dark:border-slate-800">No</th>
                <th rowSpan={2} className="border-r border-slate-200 px-3 py-2 w-20 sticky left-10 bg-slate-100 dark:bg-slate-800 z-10 dark:border-slate-800">NIS</th>
                <th rowSpan={2} className="border-r border-slate-200 px-4 py-2 min-w-[160px] sticky left-30 bg-slate-100 dark:bg-slate-800 z-10 dark:border-slate-800">Nama Siswa</th>
                
                {/* Formatif Group: TP 1 - TP 10 + NF */}
                <th colSpan={11} className="border-r border-slate-200 px-3 py-1.5 text-center bg-blue-50/90 text-blue-900 dark:border-slate-800 dark:bg-blue-950/60 dark:text-blue-200">
                  Asesmen Formatif (Tujuan Pembelajaran: TP 1 - TP 10)
                </th>

                {/* Sumatif LM Group: LM 1 - LM 10 + NS */}
                <th colSpan={11} className="border-r border-slate-200 px-3 py-1.5 text-center bg-purple-50/90 text-purple-900 dark:border-slate-800 dark:bg-purple-950/60 dark:text-purple-200">
                  Sumatif Lingkup Materi (LM 1 - LM 10)
                </th>

                {/* SAS */}
                <th rowSpan={2} className="border-r border-slate-200 px-2.5 py-2 text-center w-14 bg-amber-50/80 text-amber-900 dark:border-slate-800 dark:bg-amber-950/40 dark:text-amber-200">
                  SAS / SAT
                </th>

                {/* Final Calculations */}
                <th colSpan={3} className="border-r border-slate-200 px-3 py-1.5 text-center bg-emerald-50/80 text-emerald-900 dark:border-slate-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                  Nilai Akhir Rapor
                </th>

                <th rowSpan={2} className="px-3 py-2 min-w-[220px]">Capaian Kompetensi</th>
              </tr>

              {/* Sub Columns */}
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                {TP_COLS.map((tp) => (
                  <th key={tp.key} className="px-1.5 py-1 text-center w-11 border-r border-slate-200 dark:border-slate-800 bg-blue-50/30">
                    {tp.label}
                  </th>
                ))}
                <th className="px-2 py-1 text-center w-12 font-black bg-blue-100/70 text-blue-800 border-r border-slate-200 dark:border-slate-800 dark:bg-blue-900/50 dark:text-blue-300">
                  NF
                </th>

                {LM_COLS.map((lm) => (
                  <th key={lm.key} className="px-1.5 py-1 text-center w-11 border-r border-slate-200 dark:border-slate-800 bg-purple-50/30">
                    {lm.label}
                  </th>
                ))}
                <th className="px-2 py-1 text-center w-12 font-black bg-purple-100/70 text-purple-800 border-r border-slate-200 dark:border-slate-800 dark:bg-purple-900/50 dark:text-purple-300">
                  NS
                </th>

                <th className="px-2.5 py-1 text-center w-14 font-black bg-emerald-100/70 text-emerald-900 border-r border-slate-200 dark:border-slate-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                  NA
                </th>
                <th className="px-2 py-1 text-center w-10 border-r border-slate-200 dark:border-slate-800">Pred</th>
                <th className="px-2.5 py-1 text-center w-16 border-r border-slate-200 dark:border-slate-800">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredList.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors">
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center font-medium text-slate-400 dark:border-slate-800 sticky left-0 bg-white dark:bg-slate-900 z-10">{idx + 1}</td>
                  <td className="border-r border-slate-200 px-3 py-2.5 font-mono text-[11px] text-slate-500 dark:border-slate-800 sticky left-10 bg-white dark:bg-slate-900 z-10">{s.nis || "-"}</td>
                  <td className="border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900 dark:text-white dark:border-slate-800 sticky left-30 bg-white dark:bg-slate-900 z-10 whitespace-nowrap">{s.name}</td>

                  {/* Formatif Inputs TP 1 - TP 10 */}
                  {TP_COLS.map((tp) => (
                    <td key={tp.key} className="border-r border-slate-200 p-0.5 text-center dark:border-slate-800 bg-blue-50/10">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={s.scores[tp.key] ?? 0}
                        onChange={(e) => handleScoreChange(s.id, tp.key, Number(e.target.value))}
                        className="w-10 text-center rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white p-1 text-xs font-semibold dark:hover:border-slate-700 dark:focus:bg-slate-800"
                      />
                    </td>
                  ))}
                  <td className="border-r border-slate-200 px-2 py-2 text-center font-bold bg-blue-50/70 text-blue-800 dark:border-slate-800 dark:bg-blue-950/40 dark:text-blue-300">
                    {s.avgFmt}
                  </td>

                  {/* Sumatif LM Inputs LM 1 - LM 10 */}
                  {LM_COLS.map((lm) => (
                    <td key={lm.key} className="border-r border-slate-200 p-0.5 text-center dark:border-slate-800 bg-purple-50/10">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={s.scores[lm.key] ?? 0}
                        onChange={(e) => handleScoreChange(s.id, lm.key, Number(e.target.value))}
                        className="w-10 text-center rounded border border-transparent hover:border-slate-300 focus:border-purple-500 focus:bg-white p-1 text-xs font-semibold dark:hover:border-slate-700 dark:focus:bg-slate-800"
                      />
                    </td>
                  ))}
                  <td className="border-r border-slate-200 px-2 py-2 text-center font-bold bg-purple-50/70 text-purple-800 dark:border-slate-800 dark:bg-purple-950/40 dark:text-purple-300">
                    {s.avgSum}
                  </td>

                  {/* SAS Input */}
                  <td className="border-r border-slate-200 p-1 text-center bg-amber-50/30 dark:border-slate-800 dark:bg-amber-950/10">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={s.sas}
                      onChange={(e) => handleScoreChange(s.id, "sas", Number(e.target.value))}
                      className="w-11 text-center rounded border border-transparent hover:border-slate-300 focus:border-amber-500 focus:bg-white p-1 text-xs font-bold text-amber-900 dark:hover:border-slate-700 dark:focus:bg-slate-800 dark:text-amber-300"
                    />
                  </td>

                  {/* Final Calculation Result */}
                  <td className="border-r border-slate-200 px-2.5 py-2.5 text-center font-black text-sm bg-emerald-50/50 text-emerald-800 dark:border-slate-800 dark:bg-emerald-950/20 dark:text-emerald-300">
                    {s.finalScore}
                  </td>
                  <td className="border-r border-slate-200 px-2 py-2.5 text-center font-black dark:border-slate-800">
                    <span
                      className={`inline-block w-6 rounded-md py-0.5 text-[11px] font-bold ${
                        s.predicate === "A"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : s.predicate === "B"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : s.predicate === "C"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {s.predicate}
                    </span>
                  </td>
                  <td className="border-r border-slate-200 px-2.5 py-2.5 text-center dark:border-slate-800">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        s.isPassed
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                      }`}
                    >
                      {s.isPassed ? "Tuntas" : "Remedial"}
                    </span>
                  </td>

                  {/* Deskripsi */}
                  <td className="px-3 py-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 min-w-[220px]">
                    {s.deskripsi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
