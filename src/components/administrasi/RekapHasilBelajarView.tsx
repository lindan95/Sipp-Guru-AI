import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  Award,
  Printer,
  Download,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Search,
  Sliders,
  Sparkles,
  Trophy,
  Medal,
  ChevronRight,
  UserCheck,
  UserX,
  BookOpen,
  ArrowRight,
} from "lucide-react";

export const RekapHasilBelajarView: React.FC = () => {
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
    setActiveMenu,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassId || classes[0]?.id || "cls-10a");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(activeSubjectId || subjects[0]?.id || "sbj-inf");
  const [selectedSemester, setSelectedSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [kktpStandard, setKktpStandard] = useState<number>(75);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any | null>(null);

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

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Compute student achievement, grades, rankings, and mastery status
  const evaluatedStudents = useMemo(() => {
    const studentGrades = [
      { id: "std-001", formatif: 88, sumatifLM: 90, sas: 90, sikap: "Sangat Baik" },
      { id: "std-002", formatif: 93, sumatifLM: 94, sas: 95, sikap: "Sangat Baik" },
      { id: "std-003", formatif: 77, sumatifLM: 78, sas: 78, sikap: "Baik" },
      { id: "std-004", formatif: 84, sumatifLM: 86, sas: 86, sikap: "Baik" },
      { id: "std-005", formatif: 71, sumatifLM: 72, sas: 72, sikap: "Cukup" },
      { id: "std-006", formatif: 96, sumatifLM: 97, sas: 98, sikap: "Sangat Baik" },
      { id: "std-007", formatif: 80, sumatifLM: 82, sas: 82, sikap: "Baik" },
      { id: "std-008", formatif: 86, sumatifLM: 86, sas: 87, sikap: "Baik" },
      { id: "std-009", formatif: 82, sumatifLM: 84, sas: 83, sikap: "Baik" },
      { id: "std-010", formatif: 88, sumatifLM: 89, sas: 89, sikap: "Sangat Baik" },
    ];

    const list = currentStudents.map((std, idx) => {
      const match = studentGrades.find((g) => g.id === std.id) || {
        id: std.id,
        formatif: 75 + ((idx * 7) % 20),
        sumatifLM: 76 + ((idx * 5) % 20),
        sas: 75 + ((idx * 6) % 20),
        sikap: "Baik",
      };

      // Nilai Akhir (30% Formatif + 40% Sumatif LM + 30% SAS)
      const finalScore = Math.round(
        match.formatif * 0.3 + match.sumatifLM * 0.4 + match.sas * 0.3
      );

      let predicate: "A" | "B" | "C" | "D" = "D";
      if (finalScore >= 90) predicate = "A";
      else if (finalScore >= 80) predicate = "B";
      else if (finalScore >= kktpStandard) predicate = "C";
      else predicate = "D";

      const isPassed = finalScore >= kktpStandard;

      let capaianTertinggi = `Menunjukkan pemahaman sangat baik pada materi fondasi ${selectedSubject?.name || "Informatika"}.`;
      let capaianPerluBimbingan = isPassed
        ? "Mampu menyelesaikan seluruh asesmen dengan baik."
        : "Perlu bimbingan intensif pada penyelesaian soal analisis dan algoritma.";

      if (predicate === "A") {
        capaianTertinggi = `Sangat mahir merancang solusi komputasional, penalaran kritis logis, dan presentasi mandiri.`;
      } else if (predicate === "B") {
        capaianTertinggi = `Menguasai konsep inti dengan baik dan aktif berkolaborasi dalam kelompok.`;
      }

      return {
        ...std,
        formatif: match.formatif,
        sumatifLM: match.sumatifLM,
        sas: match.sas,
        finalScore,
        predicate,
        isPassed,
        sikap: match.sikap,
        capaianTertinggi,
        capaianPerluBimbingan,
      };
    });

    // Sort by finalScore descending to assign rank
    list.sort((a, b) => b.finalScore - a.finalScore);

    return list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }, [currentStudents, selectedSubject, kktpStandard]);

  // Search Filter
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return evaluatedStudents;
    const q = searchQuery.toLowerCase();
    return evaluatedStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q)
    );
  }, [evaluatedStudents, searchQuery]);

  // Overall Class Analytics
  const stats = useMemo(() => {
    if (evaluatedStudents.length === 0) {
      return {
        total: 0,
        avg: 0,
        highest: 0,
        lowest: 0,
        passCount: 0,
        passPercent: 0,
        aCount: 0,
        bCount: 0,
        cCount: 0,
        dCount: 0,
      };
    }
    const scores = evaluatedStudents.map((s) => s.finalScore);
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passCount = evaluatedStudents.filter((s) => s.isPassed).length;
    const passPercent = Math.round((passCount / evaluatedStudents.length) * 100);

    const aCount = evaluatedStudents.filter((s) => s.predicate === "A").length;
    const bCount = evaluatedStudents.filter((s) => s.predicate === "B").length;
    const cCount = evaluatedStudents.filter((s) => s.predicate === "C").length;
    const dCount = evaluatedStudents.filter((s) => s.predicate === "D").length;

    return {
      total: evaluatedStudents.length,
      avg,
      highest,
      lowest,
      passCount,
      passPercent,
      aCount,
      bCount,
      cCount,
      dCount,
    };
  }, [evaluatedStudents]);

  const handlePrint = () => {
    setPreviewDoc({
      title: `Rekapitulasi Hasil Belajar & Ketuntasan Siswa - Kelas ${selectedClass?.name || ""} (${selectedSubject?.name || ""})`,
      docType: "REKAP_BELAJAR_DOCUMENT",
      dataObj: {
        classInfo: selectedClass,
        subjectInfo: selectedSubject,
        semester: selectedSemester,
        academicYear: "2024/2025",
        kktpStandard,
        students: evaluatedStudents,
        stats,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "Peringkat",
      "NIS",
      "Nama Siswa",
      "Nilai Formatif (NF)",
      "Sumatif Lingkup Materi (NS)",
      "SAS/SAT",
      "Nilai Akhir (NA)",
      "Predikat",
      "Status Ketuntasan",
      "Deskripsi Capaian Tertinggi",
    ];

    const rows = evaluatedStudents.map((s) => [
      s.rank,
      `"${s.nis || "-"}"`,
      `"${s.name}"`,
      s.formatif,
      s.sumatifLM,
      s.sas,
      s.finalScore,
      s.predicate,
      s.isPassed ? "Tuntas" : "Belum Tuntas (Remedial)",
      `"${s.capaianTertinggi.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Hasil_Belajar_${selectedClass?.name || "Kelas"}_${selectedSubject?.name || "Mapel"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("success", "Export Selesai", "Rekap hasil belajar berhasil diunduh.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="h-5 w-5 text-blue-600" />
            Rekap Hasil Belajar & Ketuntasan Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Analisis capaian kompetensi, ketuntasan klasikal & individual, peringkat prestasi kelas, serta rekomendasi tindak lanjut pengayaan dan remedial.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveMenu("penilaian")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
            Buku Nilai Siswa
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Download className="h-3.5 w-3.5 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Printer className="h-4 w-4" />
            Cetak Rekap Hasil Belajar
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
                value={kktpStandard}
                onChange={(e) => setKktpStandard(Number(e.target.value))}
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

      {/* Analytics Summary */}
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
          </div>
          <span className="text-[10px] text-slate-400">{stats.passCount} dari {stats.total} Siswa Tuntas</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Siswa Berprestasi (A)</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-purple-600">{stats.aCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
          <span className="text-[10px] text-purple-600 font-semibold">Tindak Lanjut: Pengayaan</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Predikat Baik (B)</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-blue-600">{stats.bCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
          <span className="text-[10px] text-slate-400">Tuntas Standar</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Predikat Cukup (C)</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-600">{stats.cCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
          <span className="text-[10px] text-amber-600">Perlu Penguatan</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Belum Tuntas (Remedial)</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className={`text-2xl font-black ${stats.dCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {stats.dCount}
            </span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
          <span className="text-[10px] text-rose-500 font-semibold">Wajib Remedial</span>
        </div>
      </div>

      {/* Ranked Performance Ledger Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Leger Hasil Belajar & Peringkat Siswa: {selectedClass?.name} - {selectedSubject?.name}
            </span>
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {filteredList.length} Siswa
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            * Klik baris siswa untuk melihat kartu detail hasil belajar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-[10px] font-black uppercase text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                <th className="border-r border-slate-200 px-3 py-2.5 text-center w-14 dark:border-slate-800">Rank</th>
                <th className="border-r border-slate-200 px-3 py-2.5 w-20 dark:border-slate-800">NIS</th>
                <th className="border-r border-slate-200 px-4 py-2.5 min-w-[150px] dark:border-slate-800">Nama Lengkap</th>
                <th className="border-r border-slate-200 px-3 py-2.5 text-center w-14 dark:border-slate-800">Formatif</th>
                <th className="border-r border-slate-200 px-3 py-2.5 text-center w-14 dark:border-slate-800">Sumatif LM</th>
                <th className="border-r border-slate-200 px-3 py-2.5 text-center w-14 dark:border-slate-800">SAS</th>
                <th className="border-r border-slate-200 px-3 py-2.5 text-center w-16 font-black bg-emerald-50 text-emerald-900 dark:border-slate-800 dark:bg-emerald-950/40 dark:text-emerald-200">Nilai Akhir</th>
                <th className="border-r border-slate-200 px-3 py-2.5 text-center w-12 dark:border-slate-800">Pred</th>
                <th className="border-r border-slate-200 px-3 py-2.5 text-center w-20 dark:border-slate-800">Ketuntasan</th>
                <th className="px-4 py-2.5 min-w-[200px]">Deskripsi Capaian Kompetensi</th>
                <th className="px-3 py-2.5 text-center w-16">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredList.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelectedStudentDetail(s)}
                  className="cursor-pointer hover:bg-blue-50/50 dark:hover:bg-slate-850/70 transition-colors"
                >
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center font-black dark:border-slate-800">
                    {s.rank === 1 ? (
                      <span className="inline-flex items-center gap-1 text-amber-500 font-bold">
                        <Trophy className="h-3.5 w-3.5 fill-amber-400 text-amber-500" /> 1
                      </span>
                    ) : s.rank === 2 ? (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-bold">
                        <Medal className="h-3.5 w-3.5 fill-slate-300 text-slate-400" /> 2
                      </span>
                    ) : s.rank === 3 ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                        <Medal className="h-3.5 w-3.5 fill-amber-600 text-amber-700" /> 3
                      </span>
                    ) : (
                      <span className="text-slate-400">#{s.rank}</span>
                    )}
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2.5 font-mono text-[11px] text-slate-500 dark:border-slate-800">{s.nis || "-"}</td>
                  <td className="border-r border-slate-200 px-4 py-2.5 font-bold text-slate-900 dark:text-white dark:border-slate-800">{s.name}</td>
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center dark:border-slate-800">{s.formatif}</td>
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center dark:border-slate-800">{s.sumatifLM}</td>
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center dark:border-slate-800">{s.sas}</td>
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center font-black text-sm text-emerald-700 bg-emerald-50/40 dark:border-slate-800 dark:bg-emerald-950/20 dark:text-emerald-300">{s.finalScore}</td>
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center font-bold dark:border-slate-800">
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
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center dark:border-slate-800">
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
                  <td className="px-4 py-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {s.capaianTertinggi}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStudentDetail(s);
                      }}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600"
                      title="Lihat Rincian Kartu Hasil Belajar"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Student Detail Modal / Progress Card */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold dark:bg-blue-950 dark:text-blue-300">
                  #{selectedStudentDetail.rank}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedStudentDetail.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    NIS: {selectedStudentDetail.nis || "-"} • Kelas {selectedClass?.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Score Summary Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">Formatif (NF)</span>
                <p className="mt-0.5 text-base font-black text-slate-800 dark:text-slate-200">{selectedStudentDetail.formatif}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">Sumatif LM</span>
                <p className="mt-0.5 text-base font-black text-slate-800 dark:text-slate-200">{selectedStudentDetail.sumatifLM}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800">
                <span className="text-[10px] text-slate-400">SAS/SAT</span>
                <p className="mt-0.5 text-base font-black text-slate-800 dark:text-slate-200">{selectedStudentDetail.sas}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-2.5 dark:bg-emerald-950/40">
                <span className="text-[10px] text-emerald-600">Nilai Akhir (NA)</span>
                <p className="mt-0.5 text-base font-black text-emerald-700 dark:text-emerald-300">{selectedStudentDetail.finalScore}</p>
              </div>
            </div>

            {/* Competency Mastery Details */}
            <div className="space-y-2 text-xs">
              <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <strong className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Capaian Kompetensi Tertinggi:
                </strong>
                <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedStudentDetail.capaianTertinggi}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                <strong className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  Catatan Evaluasi / Rekomendasi:
                </strong>
                <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedStudentDetail.capaianPerluBimbingan}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className={`text-xs font-bold ${selectedStudentDetail.isPassed ? "text-emerald-600" : "text-rose-600"}`}>
                Status: {selectedStudentDetail.isPassed ? "✓ Tuntas Standar KKTP" : "⚠ Perlu Program Remedial"}
              </span>

              <div className="flex items-center gap-2">
                {!selectedStudentDetail.isPassed ? (
                  <button
                    onClick={() => {
                      setSelectedStudentDetail(null);
                      setActiveMenu("remedial_pengayaan");
                    }}
                    className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                  >
                    Buka Remedial <ArrowRight className="h-3 w-3" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedStudentDetail(null);
                      setActiveMenu("remedial_pengayaan");
                    }}
                    className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                  >
                    Program Pengayaan <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
