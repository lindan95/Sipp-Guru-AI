import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Printer,
  Search,
  ChevronLeft,
  ChevronRight,
  Save,
  Layers,
  BookOpen,
  CheckCircle2,
  FileText,
  Filter,
  Check,
  HelpCircle
} from "lucide-react";

export const KartuSoalView: React.FC = () => {
  const {
    questionBank,
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

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(activeSubjectId || "all");
  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassId || "all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (activeSubjectId) {
      setSelectedSubjectId(activeSubjectId);
    }
  }, [activeSubjectId]);

  const filteredQuestions = (questionBank || []).filter((q: any) => {
    const matchSub = selectedSubjectId === "all" || q.subjectId === selectedSubjectId;
    return matchSub;
  });

  const activeQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  const getSubjectName = (id: string) => {
    return subjects.find((s) => s.id === id)?.name || "Mata Pelajaran";
  };

  const handlePrintSingleCard = (q: any, idx: number) => {
    if (!q) return;
    const subName = getSubjectName(q.subjectId);
    const rawOptions = q.options || [];
    const optionsList = Array.isArray(rawOptions)
      ? rawOptions.map((opt: any) => (typeof opt === "string" ? opt : `${opt.key}. ${opt.text}`))
      : [];

    const content = `
      <div style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.35; font-size: 11pt;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
          <h2 style="margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold;">${schoolProfile?.name || "SMA NEGERI 1 NUSANTARA"}</h2>
          <h3 style="margin: 4px 0 0 0; font-size: 12pt; text-transform: uppercase; text-decoration: underline;">KARTU SOAL ASESMEN KURIKULUM MERDEKA</h3>
          <p style="margin: 2px 0 0 0; font-size: 9.5pt;">Tahun Ajaran ${schoolProfile?.academicYear || "2024/2025"}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10pt;" border="1" cellpadding="5">
          <tr>
            <td style="width: 22%; font-weight: bold; background: #f2f2f2;">Satuan Pendidikan</td>
            <td style="width: 28%;">${schoolProfile?.name || "SMA Negeri 1"}</td>
            <td style="width: 22%; font-weight: bold; background: #f2f2f2;">Penyusun</td>
            <td style="width: 28%;">${teacherProfile?.fullName || "Guru Mapel"}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background: #f2f2f2;">Mata Pelajaran</td>
            <td>${subName}</td>
            <td style="font-weight: bold; background: #f2f2f2;">Tahun Ajaran</td>
            <td>${schoolProfile?.academicYear || "2024/2025"}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background: #f2f2f2;">Kelas / Fase</td>
            <td>Kelas X / Fase E</td>
            <td style="font-weight: bold; background: #f2f2f2;">Bentuk Soal</td>
            <td>${q.questionType || q.type || "Pilihan Ganda"}</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10pt;" border="1" cellpadding="6">
          <tr>
            <td style="width: 30%; font-weight: bold; background: #f2f2f2;">Capaian Pembelajaran (CP)</td>
            <td style="width: 70%;">${q.cp || "Peserta didik mampu memahami dan menganalisis konsep materi secara mendalam serta memecahkan masalah kontekstual."}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background: #f2f2f2;">Materi / Konten</td>
            <td><strong>${q.topic || "Konsep Dasar"}</strong></td>
          </tr>
          <tr>
            <td style="font-weight: bold; background: #f2f2f2;">Indikator Soal</td>
            <td>${q.indicator || "Disajikan ilustrasi konteks nyata, peserta didik dapat menentukan solusi yang tepat."}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; background: #f2f2f2;">Level Kognitif</td>
            <td><strong>${q.cognitiveLevel || q.bloomLevel || "C4 (Menganalisis - HOTS)"}</strong></td>
          </tr>
          <tr>
            <td style="font-weight: bold; background: #f2f2f2;">Buku Sumber / Referensi</td>
            <td>Buku Panduan Guru & Siswa Kemendikbudristek RI</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 10pt;" border="1" cellpadding="8">
          <tr style="background: #e9ecef;">
            <th style="width: 15%; text-align: center;">Nomor Soal</th>
            <th style="width: 70%; text-align: left;">Rumusan Butir Soal</th>
            <th style="width: 15%; text-align: center;">Kunci Jawaban</th>
          </tr>
          <tr>
            <td style="text-align: center; vertical-align: top; font-weight: bold; font-size: 14pt;">${idx + 1}</td>
            <td style="vertical-align: top;">
              ${q.stimulus ? `<div style="font-style: italic; background: #f9f9f9; padding: 6px; border-left: 3px solid #888; margin-bottom: 8px;">${q.stimulus}</div>` : ""}
              <div style="font-weight: bold; margin-bottom: 8px;">${q.questionText}</div>
              ${
                optionsList.length > 0
                  ? `<div style="margin-left: 10px;">${optionsList.map((opt: string) => `<div style="margin-bottom: 3px;">${opt}</div>`).join("")}</div>`
                  : ""
              }
              <div style="margin-top: 10px; padding-top: 6px; border-top: 1px dashed #ccc; font-size: 9.5pt;">
                <strong>Pedoman Penskoran / Pembahasan:</strong><br/>
                ${q.explanation || "Jawaban benar diberikan skor 1, salah skor 0."}
              </div>
            </td>
            <td style="text-align: center; vertical-align: top; font-weight: bold; font-size: 16pt; color: #1b5e20;">
              ${q.correctAnswer || "A"}
            </td>
          </tr>
        </table>

        <div style="margin-top: 28px; display: flex; justify-content: space-between; page-break-inside: avoid;">
          <div style="text-align: center; width: 200px;">
            <p style="margin-bottom: 50px;">Mengetahui,<br/>Kepala Sekolah</p>
            <strong>${schoolProfile?.headmasterName || "Drs. H. Bambang Suryanto, M.Pd."}</strong>
            <p style="margin: 0; font-size: 8.5pt;">NIP. ${schoolProfile?.headmasterNip || "-"}</p>
          </div>
          <div style="text-align: center; width: 200px;">
            <p style="margin-bottom: 50px;">${schoolProfile?.district || "Jakarta"}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br/>Guru Mata Pelajaran</p>
            <strong>${teacherProfile?.fullName || "Sudirman Danasaputra, S.Kom."}</strong>
            <p style="margin: 0; font-size: 8.5pt;">NIP. ${teacherProfile?.nip || "-"}</p>
          </div>
        </div>
      </div>
    `;

    setPreviewDoc({
      title: `Kartu Soal No.${idx + 1} - ${subName}`,
      htmlContent: content,
      type: "KARTU_SOAL",
    });
  };

  const handlePrintAllCards = () => {
    const subTitle = selectedSubjectId === "all" ? "Semua Mata Pelajaran" : getSubjectName(selectedSubjectId);

    const cardsHtml = filteredQuestions
      .map((q: any, idx: number) => {
        const subName = getSubjectName(q.subjectId);
        const rawOptions = q.options || [];
        const optionsList = Array.isArray(rawOptions)
          ? rawOptions.map((opt: any) => (typeof opt === "string" ? opt : `${opt.key}. ${opt.text}`))
          : [];

        return `
          <div style="page-break-after: always; padding: 10px 0;">
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
              <h2 style="margin: 0; font-size: 13pt; text-transform: uppercase; font-weight: bold;">${schoolProfile?.name || "SMA NEGERI 1 NUSANTARA"}</h2>
              <h3 style="margin: 4px 0 0 0; font-size: 12pt; text-transform: uppercase; text-decoration: underline;">KARTU SOAL ASESMEN KURIKULUM MERDEKA</h3>
              <p style="margin: 2px 0 0 0; font-size: 9.5pt;">Tahun Ajaran ${schoolProfile?.academicYear || "2024/2025"}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10pt;" border="1" cellpadding="5">
              <tr>
                <td style="width: 22%; font-weight: bold; background: #f2f2f2;">Satuan Pendidikan</td>
                <td style="width: 28%;">${schoolProfile?.name || "SMA Negeri 1"}</td>
                <td style="width: 22%; font-weight: bold; background: #f2f2f2;">Penyusun</td>
                <td style="width: 28%;">${teacherProfile?.fullName || "Guru Mapel"}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; background: #f2f2f2;">Mata Pelajaran</td>
                <td>${subName}</td>
                <td style="font-weight: bold; background: #f2f2f2;">Tahun Ajaran</td>
                <td>${schoolProfile?.academicYear || "2024/2025"}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; background: #f2f2f2;">Kelas / Fase</td>
                <td>Kelas X / Fase E</td>
                <td style="font-weight: bold; background: #f2f2f2;">Bentuk Soal</td>
                <td>${q.questionType || q.type || "Pilihan Ganda"}</td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10pt;" border="1" cellpadding="6">
              <tr>
                <td style="width: 30%; font-weight: bold; background: #f2f2f2;">Capaian Pembelajaran (CP)</td>
                <td style="width: 70%;">${q.cp || "Peserta didik mampu memahami dan menganalisis konsep materi secara mendalam serta memecahkan masalah kontekstual."}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; background: #f2f2f2;">Materi / Konten</td>
                <td><strong>${q.topic || "Konsep Dasar"}</strong></td>
              </tr>
              <tr>
                <td style="font-weight: bold; background: #f2f2f2;">Indikator Soal</td>
                <td>${q.indicator || "Disajikan ilustrasi konteks nyata, peserta didik dapat menentukan solusi yang tepat."}</td>
              </tr>
              <tr>
                <td style="font-weight: bold; background: #f2f2f2;">Level Kognitif</td>
                <td><strong>${q.cognitiveLevel || q.bloomLevel || "C4 (Menganalisis - HOTS)"}</strong></td>
              </tr>
              <tr>
                <td style="font-weight: bold; background: #f2f2f2;">Buku Sumber / Referensi</td>
                <td>Buku Panduan Guru & Siswa Kemendikbudristek RI</td>
              </tr>
            </table>

            <table style="width: 100%; border-collapse: collapse; font-size: 10pt;" border="1" cellpadding="8">
              <tr style="background: #e9ecef;">
                <th style="width: 15%; text-align: center;">Nomor Soal</th>
                <th style="width: 70%; text-align: left;">Rumusan Butir Soal</th>
                <th style="width: 15%; text-align: center;">Kunci Jawaban</th>
              </tr>
              <tr>
                <td style="text-align: center; vertical-align: top; font-weight: bold; font-size: 14pt;">${idx + 1}</td>
                <td style="vertical-align: top;">
                  ${q.stimulus ? `<div style="font-style: italic; background: #f9f9f9; padding: 6px; border-left: 3px solid #888; margin-bottom: 8px;">${q.stimulus}</div>` : ""}
                  <div style="font-weight: bold; margin-bottom: 8px;">${q.questionText}</div>
                  ${
                    optionsList.length > 0
                      ? `<div style="margin-left: 10px;">${optionsList.map((opt: string) => `<div style="margin-bottom: 3px;">${opt}</div>`).join("")}</div>`
                      : ""
                  }
                  <div style="margin-top: 10px; padding-top: 6px; border-top: 1px dashed #ccc; font-size: 9.5pt;">
                    <strong>Pedoman Penskoran / Pembahasan:</strong><br/>
                    ${q.explanation || "Jawaban benar skor 1, salah skor 0."}
                  </div>
                </td>
                <td style="text-align: center; vertical-align: top; font-weight: bold; font-size: 16pt; color: #1b5e20;">
                  ${q.correctAnswer || "A"}
                </td>
              </tr>
            </table>

            <div style="margin-top: 28px; display: flex; justify-content: space-between; page-break-inside: avoid;">
              <div style="text-align: center; width: 200px;">
                <p style="margin-bottom: 50px;">Mengetahui,<br/>Kepala Sekolah</p>
                <strong>${schoolProfile?.headmasterName || "Drs. H. Bambang Suryanto, M.Pd."}</strong>
                <p style="margin: 0; font-size: 8.5pt;">NIP. ${schoolProfile?.headmasterNip || "-"}</p>
              </div>
              <div style="text-align: center; width: 200px;">
                <p style="margin-bottom: 50px;">${schoolProfile?.district || "Jakarta"}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br/>Guru Mata Pelajaran</p>
                <strong>${teacherProfile?.fullName || "Sudirman Danasaputra, S.Kom."}</strong>
                <p style="margin: 0; font-size: 8.5pt;">NIP. ${teacherProfile?.nip || "-"}</p>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    setPreviewDoc({
      title: `Kumpulan Kartu Soal - ${subTitle}`,
      htmlContent: `<div style="font-family: 'Times New Roman', serif;">${cardsHtml}</div>`,
      type: "KUMPULAN_KARTU_SOAL",
    });
  };

  return (
    <div className="space-y-6 pb-12" id="kartu-soal-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-rose-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-amber-100 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Standar Dokumen Ujian
            </span>
            <span className="px-2.5 py-0.5 bg-amber-500/40 rounded-full text-xs font-medium text-amber-200">
              Format Resmi BSNP / Kurikulum Merdeka
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kartu Soal Asesmen</h1>
          <p className="text-amber-100 text-sm mt-1 max-w-2xl">
            Penyusunan kartu telaah butir soal lengkap dengan Capaian Pembelajaran, Indikator ABCD, Level Kognitif, Pedoman Penskoran, dan Kunci Jawaban.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrintAllCards}
            className="px-4 py-2.5 bg-white text-amber-950 hover:bg-amber-50 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4 text-amber-800" />
            Cetak Seluruh Kartu Soal
          </button>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedSubjectId={selectedSubjectId}
        onSubjectChange={(id) => {
          setSelectedSubjectId(id);
          setCurrentIndex(0);
        }}
        extraControls={
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan <b>{filteredQuestions.length}</b> Kartu Soal
          </span>
        }
      />

      {/* Navigation Carousel Bar */}
      {filteredQuestions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              disabled={currentIndex <= 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Kartu Soal {currentIndex + 1} dari {filteredQuestions.length}
            </span>
            <button
              disabled={currentIndex >= filteredQuestions.length - 1}
              onClick={() => setCurrentIndex((prev) => Math.min(filteredQuestions.length - 1, prev + 1))}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 disabled:opacity-30 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Materi: <strong className="text-slate-800 dark:text-slate-200">{activeQuestion?.topic || "-"}</strong>
          </span>
        </div>
      )}

      {/* Main Single Card Display */}
      {activeQuestion ? (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-md overflow-hidden max-w-4xl mx-auto">
          {/* Card Header */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-300 dark:border-slate-700 text-center relative">
            <div className="absolute right-6 top-6 flex items-center gap-2">
              <button
                onClick={() => handlePrintSingleCard(activeQuestion, currentIndex)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Kartu Ini
              </button>
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              {schoolProfile?.name || "SMA NEGERI 1 NUSANTARA"}
            </h2>
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 uppercase mt-0.5">
              Kartu Soal Asesmen Standar Kurikulum Merdeka
            </h3>
            <p className="text-xs text-slate-500 mt-1">Tahun Ajaran {schoolProfile?.academicYear || "2024/2025"}</p>
          </div>

          {/* Grid Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-slate-800 text-xs border-b border-slate-300 dark:border-slate-700">
            <div className="p-3.5 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-slate-400 block mb-0.5 font-medium">Mata Pelajaran:</span>
              <strong className="text-slate-800 dark:text-slate-200">{getSubjectName(activeQuestion.subjectId)}</strong>
            </div>
            <div className="p-3.5 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-slate-400 block mb-0.5 font-medium">Kelas / Fase:</span>
              <strong className="text-slate-800 dark:text-slate-200">Kelas X (Fase E)</strong>
            </div>
            <div className="p-3.5 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-slate-400 block mb-0.5 font-medium">Bentuk Soal:</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {activeQuestion.questionType || activeQuestion.type || "Pilihan Ganda"}
              </strong>
            </div>
            <div className="p-3.5 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-slate-400 block mb-0.5 font-medium">Penyusun:</span>
              <strong className="text-slate-800 dark:text-slate-200">
                {teacherProfile?.fullName || "Guru Pengampu"}
              </strong>
            </div>
          </div>

          {/* Core Specification Grid */}
          <div className="p-6 space-y-4 border-b border-slate-300 dark:border-slate-700 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Materi / Konten:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  {activeQuestion.topic || "Konsep Dasar"}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Level Kognitif:</span>
                <p className="font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60">
                  {activeQuestion.cognitiveLevel || activeQuestion.bloomLevel || "C4 (Menganalisis - HOTS)"}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Buku Sumber:</span>
                <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  Buku Panduan Guru & Siswa Kurikulum Merdeka
                </p>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Indikator Soal (ABCD):</span>
              <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 leading-relaxed">
                {activeQuestion.indicator ||
                  "Disajikan wacana / masalah kontekstual, peserta didik dapat menentukan penalaran ilmiah yang akurat."}
              </p>
            </div>
          </div>

          {/* Question & Solution Section */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left Question Body */}
            <div className="md:col-span-9 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold text-sm flex items-center justify-center">
                  {currentIndex + 1}
                </span>
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Rumusan Butir Soal
                </span>
              </div>

              {activeQuestion.stimulus && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border-l-4 border-amber-500 rounded-r-xl text-xs text-slate-700 dark:text-slate-300 italic">
                  <strong>Stimulus:</strong> {activeQuestion.stimulus}
                </div>
              )}

              <div className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                {activeQuestion.questionText}
              </div>

              {/* Options */}
              {activeQuestion.options && activeQuestion.options.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  {activeQuestion.options.map((opt: any, optIdx: number) => {
                    const optText = typeof opt === "string" ? opt : `${opt.key}. ${opt.text}`;
                    const isKey =
                      optText.trim().startsWith(activeQuestion.correctAnswer) ||
                      optText.trim().startsWith(`${activeQuestion.correctAnswer}.`);

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl text-xs flex items-center gap-2.5 border ${
                          isKey
                            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-semibold"
                            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isKey ? "bg-emerald-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optText}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Scoring guide */}
              <div className="p-3.5 bg-amber-50/50 dark:bg-slate-800/40 border border-amber-200 dark:border-slate-700 rounded-xl text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">
                  Pedoman Penskoran & Pembahasan:
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeQuestion.explanation || "Jawaban benar mendapatkan poin penuh, jawaban salah poin 0."}
                </p>
              </div>
            </div>

            {/* Right Key Box */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl text-center">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase mb-2">
                Kunci Jawaban
              </span>
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-emerald-600/30">
                {activeQuestion.correctAnswer || "A"}
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 mt-3">
                Validasi Asesmen
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">Belum ada butir soal</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Tambahkan soal di menu <strong>Bank Soal</strong> terlebih dahulu untuk menelaah kartu soal.
          </p>
        </div>
      )}
    </div>
  );
};
