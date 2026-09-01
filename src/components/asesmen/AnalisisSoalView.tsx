import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { QuestionItemAnalysis } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Calculator,
  Save,
  Loader2,
  TrendingUp,
  Award,
  Layers,
  ArrowUpRight
} from "lucide-react";

export const AnalisisSoalView: React.FC = () => {
  const {
    questionAnalysisList,
    saveQuestionAnalysis,
    deleteQuestionAnalysis,
    subjects,
    classes,
    activeSubjectId,
    setActiveSubjectId,
    activeClassId,
    setActiveClassId,
    schoolProfile,
    teacherProfile,
    addToast,
    setPreviewDoc,
  } = useApp();

  const [filterSubjectId, setFilterSubjectId] = useState<string>(activeSubjectId || "all");
  const [filterClassId, setFilterClassId] = useState<string>(activeClassId || "all");

  const filteredAnalyses = (questionAnalysisList || []).filter((item) => {
    const matchSub = filterSubjectId === "all" || item.subjectId === filterSubjectId;
    const matchCls = filterClassId === "all" || item.classId === filterClassId;
    return matchSub && matchCls;
  });

  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>(
    filteredAnalyses[0]?.id || questionAnalysisList[0]?.id || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysisSummary, setAiAnalysisSummary] = useState<string | null>(null);

  useEffect(() => {
    if (filteredAnalyses.length > 0 && !filteredAnalyses.some((a) => a.id === selectedAnalysisId)) {
      setSelectedAnalysisId(filteredAnalyses[0].id);
    }
  }, [filterSubjectId, filterClassId, questionAnalysisList]);

  const currentAnalysis =
    filteredAnalyses.find((a) => a.id === selectedAnalysisId) ||
    filteredAnalyses[0] ||
    questionAnalysisList.find((a) => a.id === selectedAnalysisId) ||
    questionAnalysisList[0];

  // Manual Form State
  const [formData, setFormData] = useState<QuestionItemAnalysis>({
    id: "",
    testTitle: "",
    subjectId: subjects[0]?.id || "sbj-inf",
    classId: classes[0]?.id || "cls-10a",
    totalStudents: 32,
    analyzedQuestions: [],
  });

  const handleOpenAdd = () => {
    setFormData({
      id: "qa-" + Date.now(),
      testTitle: "Analisis Butir Soal Asesmen Baru",
      subjectId: subjects[0]?.id || "sbj-inf",
      classId: classes[0]?.id || "cls-10a",
      totalStudents: 32,
      analyzedQuestions: [
        {
          questionNumber: 1,
          correctCount: 26,
          wrongCount: 6,
          difficultyIndex: 0.81,
          difficultyCategory: "Mudah",
          discriminationIndex: 0.44,
          discriminationCategory: "Sangat Baik",
          distractorValidity: "Berfungsi Baik",
          recommendation: "Sangat Baik",
        },
        {
          questionNumber: 2,
          correctCount: 20,
          wrongCount: 12,
          difficultyIndex: 0.62,
          difficultyCategory: "Sedang",
          discriminationIndex: 0.52,
          discriminationCategory: "Sangat Baik",
          distractorValidity: "Berfungsi Baik",
          recommendation: "Sangat Baik",
        },
        {
          questionNumber: 3,
          correctCount: 16,
          wrongCount: 16,
          difficultyIndex: 0.50,
          difficultyCategory: "Sedang",
          discriminationIndex: 0.48,
          discriminationCategory: "Sangat Baik",
          distractorValidity: "Berfungsi Baik",
          recommendation: "Sangat Baik",
        },
        {
          questionNumber: 4,
          correctCount: 10,
          wrongCount: 22,
          difficultyIndex: 0.31,
          difficultyCategory: "Sukar",
          discriminationIndex: 0.35,
          discriminationCategory: "Baik",
          distractorValidity: "Berfungsi Baik",
          recommendation: "Baik",
        },
        {
          questionNumber: 5,
          correctCount: 6,
          wrongCount: 26,
          difficultyIndex: 0.19,
          difficultyCategory: "Sangat Sukar",
          discriminationIndex: 0.18,
          discriminationCategory: "Jelek",
          distractorValidity: "Perlu Revisi Pengecoh",
          recommendation: "Perlu Revisi",
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (analysis: QuestionItemAnalysis) => {
    setFormData({ ...analysis });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.testTitle.trim()) {
      addToast("warning", "Judul Wajib Diisi", "Tuliskan judul analisis butir soal.");
      return;
    }
    saveQuestionAnalysis(formData);
    setSelectedAnalysisId(formData.id);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus data analisis soal ini?")) {
      deleteQuestionAnalysis(id);
      addToast("info", "Data Dihapus", "Analisis butir soal berhasil dihapus.");
      if (selectedAnalysisId === id) {
        const remaining = questionAnalysisList.filter((a) => a.id !== id);
        setSelectedAnalysisId(remaining[0]?.id || "");
      }
    }
  };

  const handleAddQuestionRow = () => {
    const nextNum = (formData.analyzedQuestions?.length || 0) + 1;
    const tot = formData.totalStudents || 32;
    const correct = Math.round(tot * 0.6);
    const diff = Number((correct / tot).toFixed(2));

    setFormData({
      ...formData,
      analyzedQuestions: [
        ...(formData.analyzedQuestions || []),
        {
          questionNumber: nextNum,
          correctCount: correct,
          wrongCount: tot - correct,
          difficultyIndex: diff,
          difficultyCategory: "Sedang",
          discriminationIndex: 0.4,
          discriminationCategory: "Sangat Baik",
          distractorValidity: "Berfungsi Baik",
          recommendation: "Sangat Baik",
        },
      ],
    });
  };

  const handleRemoveQuestionRow = (idx: number) => {
    const updated = (formData.analyzedQuestions || [])
      .filter((_, i) => i !== idx)
      .map((item, i) => ({
        ...item,
        questionNumber: i + 1,
      }));
    setFormData({ ...formData, analyzedQuestions: updated });
  };

  const handleQuestionScoreChange = (idx: number, correctCount: number) => {
    const tot = formData.totalStudents || 32;
    const safeCorrect = Math.min(tot, Math.max(0, correctCount));
    const wrong = tot - safeCorrect;
    const diff = Number((safeCorrect / tot).toFixed(2));

    let diffCat: QuestionItemAnalysis["analyzedQuestions"][0]["difficultyCategory"] = "Sedang";
    if (diff < 0.3) diffCat = "Sukar";
    else if (diff > 0.7) diffCat = "Mudah";

    const updated = [...(formData.analyzedQuestions || [])];
    updated[idx] = {
      ...updated[idx],
      correctCount: safeCorrect,
      wrongCount: wrong,
      difficultyIndex: diff,
      difficultyCategory: diffCat,
    };
    setFormData({ ...formData, analyzedQuestions: updated });
  };

  // AI Diagnostic / Recommendation for Question Bank
  const handleAiAudit = async () => {
    if (!currentAnalysis) return;
    setIsAiLoading(true);
    setAiAnalysisSummary(null);

    const subObj = subjects.find((s) => s.id === currentAnalysis.subjectId);

    const prompt = `Anda adalah Ahli Evaluasi Pendidikan dan Psikometrik Ujian Indonesia.
Analisis data kuantitatif butir soal berikut untuk Mata Pelajaran ${subObj?.name || "Informatika"}:

Judul Tes: ${currentAnalysis.testTitle}
Jumlah Peserta: ${currentAnalysis.totalStudents} Siswa
Data Butir Soal:
${JSON.stringify(currentAnalysis.analyzedQuestions, null, 2)}

Tolong berikan:
1. Ringkasan Diagnostik Kualitas Naskah Soal (Distribusi Kesukaran & Daya Pembeda)
2. Identifikasi Butir Soal Kritis yang Perlu Direvisi atau Dibuang beserta alasannya
3. Rekomendasi Tindak Lanjut Pedagogis Guru (Topik apa yang belum dikuasai mayoritas siswa)
4. Kesimpulan Kelayakan Bank Soal`;

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction: "Anda adalah pakar psikometrik dan asesmen pendidikan. Berikan analisis mendalam, objektif, dan solutif.",
          temperature: 0.6,
        }),
      });

      const data = await res.json();
      if (data.text) {
        setAiAnalysisSummary(data.text);
        addToast("success", "Audit AI Selesai", "Rekomendasi perbaikan butir soal berhasil disusun.");
      }
    } catch (err: any) {
      console.error(err);
      addToast("error", "Gagal Audit AI", "Terjadi kesalahan saat memanggil AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePrint = (analysis: QuestionItemAnalysis) => {
    const subObj = subjects.find((s) => s.id === analysis.subjectId);
    const clsObj = classes.find((c) => c.id === analysis.classId);

    const content = `
      <div style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.4; font-size: 11pt;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase; font-weight: bold;">${schoolProfile?.name || "SMA NEGERI 1 NUSANTARA"}</h2>
          <p style="margin: 3px 0; font-size: 9.5pt;">${schoolProfile?.address || "Jl. Pendidikan Nasional"}</p>
          <h3 style="margin: 8px 0 0 0; font-size: 12pt; text-transform: uppercase; text-decoration: underline;">LAPORAN ANALISIS KUANTITATIF BUTIR SOAL</h3>
          <p style="margin: 3px 0 0 0; font-size: 10pt; font-weight: bold;">${analysis.testTitle}</p>
        </div>

        <table style="width: 100%; margin-bottom: 14px; font-size: 10pt;">
          <tr>
            <td style="width: 20%; font-weight: bold;">Mata Pelajaran</td>
            <td style="width: 30%;">: ${subObj?.name || "Informatika"}</td>
            <td style="width: 20%; font-weight: bold;">Jumlah Siswa Diuji</td>
            <td style="width: 30%;">: ${analysis.totalStudents} Peserta</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Kelas / Rombel</td>
            <td>: ${clsObj?.name || "Kelas X"}</td>
            <td style="font-weight: bold;">Tahun Ajaran</td>
            <td>: ${schoolProfile?.academicYear || "2024/2025"}</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;" border="1" cellpadding="6">
          <thead>
            <tr style="background: #e9ecef; text-align: center; font-weight: bold;">
              <th style="width: 6%;">No</th>
              <th style="width: 12%;">Benar / Salah</th>
              <th style="width: 16%;">Tingkat Kesukaran (P)</th>
              <th style="width: 16%;">Kategori Kesukaran</th>
              <th style="width: 16%;">Daya Pembeda (D)</th>
              <th style="width: 18%;">Kategori Pembeda</th>
              <th style="width: 16%;">Keputusan / Rekomendasi</th>
            </tr>
          </thead>
          <tbody>
            ${(analysis.analyzedQuestions || [])
              .map(
                (q) => `
                <tr>
                  <td style="text-align: center; font-weight: bold;">${q.questionNumber}</td>
                  <td style="text-align: center;">${q.correctCount} / ${q.wrongCount}</td>
                  <td style="text-align: center; font-weight: bold;">${q.difficultyIndex}</td>
                  <td style="text-align: center;">${q.difficultyCategory}</td>
                  <td style="text-align: center; font-weight: bold;">${q.discriminationIndex}</td>
                  <td style="text-align: center;">${q.discriminationCategory}</td>
                  <td style="text-align: center; font-weight: bold;">${q.recommendation}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <div style="margin-top: 24px; padding: 10px; background: #f8f9fa; border: 1px solid #ddd; font-size: 9pt;">
          <strong>Keterangan Kriteria Psikometrik:</strong><br/>
          • Tingkat Kesukaran (P): P &gt; 0.70 (Mudah), 0.30 - 0.70 (Sedang/Ideal), P &lt; 0.30 (Sukar)<br/>
          • Daya Pembeda (D): D &ge; 0.40 (Sangat Baik), 0.30 - 0.39 (Baik), 0.20 - 0.29 (Cukup), D &lt; 0.20 (Jelek/Ditolak)
        </div>

        <div style="margin-top: 36px; display: flex; justify-content: space-between; page-break-inside: avoid;">
          <div style="text-align: center; width: 220px;">
            <p style="margin-bottom: 60px;">Mengetahui,<br/>Kepala Sekolah</p>
            <strong>${schoolProfile?.headmasterName || "Drs. H. Bambang Suryanto, M.Pd."}</strong>
            <p style="margin: 0; font-size: 9pt;">NIP. ${schoolProfile?.headmasterNip || "-"}</p>
          </div>
          <div style="text-align: center; width: 220px;">
            <p style="margin-bottom: 60px;">${schoolProfile?.district || "Jakarta"}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br/>Guru Mata Pelajaran</p>
            <strong>${teacherProfile?.fullName || "Sudirman Danasaputra, S.Kom."}</strong>
            <p style="margin: 0; font-size: 9pt;">NIP. ${teacherProfile?.nip || "-"}</p>
          </div>
        </div>
      </div>
    `;

    setPreviewDoc({
      title: `Analisis Soal - ${analysis.testTitle}`,
      htmlContent: content,
      type: "ANALISIS_SOAL",
    });
  };

  return (
    <div className="space-y-6 pb-12" id="analisis-soal-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-violet-100 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Evaluasi Psikometrik
            </span>
            <span className="px-2.5 py-0.5 bg-violet-500/40 rounded-full text-xs font-medium text-violet-200">
              Analisis Butir Soal
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analisis Kualitas Butir Soal</h1>
          <p className="text-violet-100 text-sm mt-1 max-w-2xl">
            Kaji tingkat kesukaran ($P$), daya pembeda ($DP$), efektivitas distraktor, serta rekomendasi revisi butir soal berbasis data empiris siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setIsAiModalOpen(true);
              handleAiAudit();
            }}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            AI Audit & Rekomendasi
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-white text-violet-900 hover:bg-violet-50 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 text-violet-700" />
            Input Analisis Baru
          </button>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedClassId={filterClassId}
        onClassChange={(id) => setFilterClassId(id)}
        selectedSubjectId={filterSubjectId}
        onSubjectChange={(id) => setFilterSubjectId(id)}
        extraControls={
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan <b>{filteredAnalyses.length}</b> Analisis Butir Soal
          </span>
        }
      />

      {/* Select Document Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-violet-600" /> Pilih Hasil Tes:
          </div>
          <select
            value={selectedAnalysisId}
            onChange={(e) => setSelectedAnalysisId(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-violet-500 min-w-[280px]"
          >
            {filteredAnalyses.length === 0 ? (
              <option value="">Tidak ada analisis untuk filter ini</option>
            ) : (
              filteredAnalyses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.testTitle} ({a.totalStudents} Siswa)
                </option>
              ))
            )}
          </select>
        </div>

        {currentAnalysis && (
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => handleOpenEdit(currentAnalysis)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Data
            </button>
            <button
              onClick={() => handlePrint(currentAnalysis)}
              className="px-3.5 py-2 bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Laporan
            </button>
            <button
              onClick={() => handleDelete(currentAnalysis.id)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
        )}
      </div>

      {/* Main Analysis Display */}
      {currentAnalysis ? (
        <div className="space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Total Peserta Tes</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {currentAnalysis.totalStudents} <span className="text-xs font-normal text-slate-500">Siswa</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Jumlah Butir Dianalisis</span>
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                {currentAnalysis.analyzedQuestions?.length || 0} Soal
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Soal Layak Pakai</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                {(currentAnalysis.analyzedQuestions || []).filter((q) => q.recommendation === "Sangat Baik" || q.recommendation === "Baik").length}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Perlu Revisi / Ditolak</span>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5" />
                {(currentAnalysis.analyzedQuestions || []).filter((q) => q.recommendation === "Perlu Revisi" || q.recommendation === "Tidak Layak").length}
              </div>
            </div>
          </div>

          {/* Detailed Question Analysis Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Tabel Distribusi Tingkat Kesukaran & Daya Pembeda
              </h3>
              <span className="text-xs text-slate-500">Standar Evaluasi Klasik (CTT)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5 text-center w-12">No</th>
                    <th className="p-3.5 text-center">Jawaban Benar</th>
                    <th className="p-3.5 text-center">Jawaban Salah</th>
                    <th className="p-3.5 text-center">Indeks Kesukaran (P)</th>
                    <th className="p-3.5 text-center">Kategori Kesukaran</th>
                    <th className="p-3.5 text-center">Daya Pembeda (DP)</th>
                    <th className="p-3.5 text-center">Status Pembeda</th>
                    <th className="p-3.5 text-center">Efektivitas Distraktor</th>
                    <th className="p-3.5 text-center">Keputusan Butir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {(currentAnalysis.analyzedQuestions || []).map((q, idx) => {
                    const isGood = q.recommendation === "Sangat Baik" || q.recommendation === "Baik";
                    const isNeedsRevision = q.recommendation === "Perlu Revisi";

                    return (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                          {q.questionNumber}
                        </td>
                        <td className="p-3.5 text-center text-emerald-600 font-semibold">{q.correctCount}</td>
                        <td className="p-3.5 text-center text-rose-600 font-semibold">{q.wrongCount}</td>
                        <td className="p-3.5 text-center font-bold text-slate-900 dark:text-slate-100">
                          {q.difficultyIndex}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              q.difficultyCategory === "Sedang"
                                ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300"
                                : q.difficultyCategory === "Mudah"
                                ? "bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300"
                                : "bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300"
                            }`}
                          >
                            {q.difficultyCategory}
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-slate-900 dark:text-slate-100">
                          {q.discriminationIndex}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              q.discriminationCategory.includes("Baik")
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {q.discriminationCategory}
                          </span>
                        </td>
                        <td className="p-3.5 text-center text-slate-600 dark:text-slate-400">
                          {q.distractorValidity}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`px-3 py-1 rounded-xl text-xs font-bold inline-flex items-center gap-1 ${
                              isGood
                                ? "bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                                : isNeedsRevision
                                ? "bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300"
                                : "bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300"
                            }`}
                          >
                            {isGood ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                            {q.recommendation}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">Belum ada data analisis soal</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Gunakan tombol <strong>Input Analisis Baru</strong> untuk mengolah hasil uji instrumen asesmen.
          </p>
        </div>
      )}

      {/* Manual Input / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-5 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">
                {formData.id ? "Edit Data Analisis Butir Soal" : "Input Analisis Butir Soal Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Naskah Asesmen / Tes:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.testTitle}
                    onChange={(e) => setFormData({ ...formData, testTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Siswa Peserta Tes:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.totalStudents}
                    onChange={(e) => setFormData({ ...formData, totalStudents: parseInt(e.target.value) || 32 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran:
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas:
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Analyzed Items Grid */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Daftar Butir Soal & Data Skor ({formData.analyzedQuestions?.length || 0} Soal)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddQuestionRow}
                    className="px-3 py-1.5 bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 hover:bg-violet-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Soal
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.analyzedQuestions || []).map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                    >
                      <div className="md:col-span-1 text-center font-bold text-xs">No {q.questionNumber}</div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-slate-500">Jumlah Siswa Benar</label>
                        <input
                          type="number"
                          min={0}
                          max={formData.totalStudents}
                          value={q.correctCount}
                          onChange={(e) => handleQuestionScoreChange(idx, parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-center"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-slate-500">Indeks Kesukaran (P)</label>
                        <div className="font-bold text-xs text-slate-800 dark:text-slate-200 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-center">
                          {q.difficultyIndex} ({q.difficultyCategory})
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-slate-500">Daya Pembeda (D)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={q.discriminationIndex}
                          onChange={(e) => {
                            const updated = [...(formData.analyzedQuestions || [])];
                            const val = parseFloat(e.target.value) || 0;
                            let cat: any = "Cukup";
                            if (val >= 0.4) cat = "Sangat Baik";
                            else if (val >= 0.3) cat = "Baik";
                            else if (val < 0.2) cat = "Jelek";
                            updated[idx] = { ...updated[idx], discriminationIndex: val, discriminationCategory: cat };
                            setFormData({ ...formData, analyzedQuestions: updated });
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs text-center"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-slate-500">Pengecoh</label>
                        <select
                          value={q.distractorValidity}
                          onChange={(e) => {
                            const updated = [...(formData.analyzedQuestions || [])];
                            updated[idx] = { ...updated[idx], distractorValidity: e.target.value as any };
                            setFormData({ ...formData, analyzedQuestions: updated });
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs"
                        >
                          <option value="Berfungsi Baik">Berfungsi Baik</option>
                          <option value="Perlu Revisi Pengecoh">Perlu Revisi</option>
                          <option value="Tidak Efektif">Tidak Efektif</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] text-slate-500">Keputusan</label>
                        <select
                          value={q.recommendation}
                          onChange={(e) => {
                            const updated = [...(formData.analyzedQuestions || [])];
                            updated[idx] = { ...updated[idx], recommendation: e.target.value as any };
                            setFormData({ ...formData, analyzedQuestions: updated });
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs"
                        >
                          <option value="Sangat Baik">Sangat Baik</option>
                          <option value="Baik">Baik</option>
                          <option value="Perlu Revisi">Perlu Revisi</option>
                          <option value="Tidak Layak">Tidak Layak</option>
                        </select>
                      </div>

                      <div className="md:col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestionRow(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 mt-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Simpan Data Analisis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Diagnostic Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">AI Audit & Bedah Kualitas Butir Soal</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {isAiLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-violet-600 mx-auto mb-3" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    AI sedang menghitung validitas psikometrik dan menyusun rekomendasi...
                  </p>
                </div>
              ) : aiAnalysisSummary ? (
                <div className="space-y-3">
                  <div className="p-4 bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-2xl text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line">
                    {aiAnalysisSummary}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center">Klik tombol di bawah untuk memulai audit.</p>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
