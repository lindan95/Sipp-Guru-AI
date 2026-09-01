import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileText,
  Sparkles,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Loader2,
  Copy,
  Check,
  Send,
  Eye,
  Plus
} from "lucide-react";

export const PembahasanSoalView: React.FC = () => {
  const {
    questionBank,
    subjects,
    schoolProfile,
    teacherProfile,
    addToast,
    setPreviewDoc,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("all");
  const [selectedBloom, setSelectedBloom] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Deep Solver Modal
  const [isAiSolverOpen, setIsAiSolverOpen] = useState(false);
  const [customQuestionInput, setCustomQuestionInput] = useState("");
  const [customSubjectId, setCustomSubjectId] = useState(subjects[0]?.id || "sbj-inf");
  const [isAiSolving, setIsAiSolving] = useState(false);
  const [aiGeneratedSolution, setAiGeneratedSolution] = useState<{
    kunci: string;
    langkahPenyelesaian: string[];
    analisisDistraktor: { opsi: string; status: string; alasan: string }[];
    konsepKunci: string;
    miskonsepsi: string;
    tipsGuru: string;
  } | null>(null);

  // Filter questions
  const filteredQuestions = (questionBank || []).filter((q: any) => {
    const matchSubject = selectedSubjectId === "all" || q.subjectId === selectedSubjectId;
    const bloom = q.cognitiveLevel || q.bloomLevel || "";
    const matchBloom = selectedBloom === "all" || bloom.includes(selectedBloom);
    const textToSearch = `${q.questionText || ""} ${q.topic || ""} ${q.explanation || ""}`.toLowerCase();
    const matchSearch = textToSearch.includes(searchQuery.toLowerCase());
    return matchSubject && matchBloom && matchSearch;
  });

  const getSubjectName = (id: string) => {
    return subjects.find((s) => s.id === id)?.name || "Mata Pelajaran";
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast("info", "Teks Disalin", "Pembahasan soal disalin ke papan klip.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAiSolve = async () => {
    if (!customQuestionInput.trim()) {
      addToast("warning", "Soal Masih Kosong", "Tulis atau tempelkan teks butir soal terlebih dahulu.");
      return;
    }

    setIsAiSolving(true);
    setAiGeneratedSolution(null);

    const subjectObj = subjects.find((s) => s.id === customSubjectId);

    const prompt = `Anda adalah Ahli Pedagogi dan Pakar Kurikulum Merdeka Mata Pelajaran ${subjectObj?.name || "Umum"}.
Tolong buatkan BEDAH DAN PEMBAHASAN MENDALAM untuk butir soal berikut:

SOAL:
"${customQuestionInput}"

HASILKAN RESPONS DALAM FORMAT JSON BERIKUT (tanpa markdown tambahan):
{
  "kunci": "Kunci Jawaban yang paling tepat beserta ringkasan singkat 1 kalimat",
  "langkahPenyelesaian": [
    "Langkah 1: Identifikasi kata kunci / premis stimulus",
    "Langkah 2: Aplikasi rumus / konsep teori relevan",
    "Langkah 3: Kesimpulan dan penentuan opsi benar"
  ],
  "analisisDistraktor": [
    { "opsi": "A / Opsi 1", "status": "Salah/Benar", "alasan": "Mengapa opsi ini salah/benar dan apa jebakannya" },
    { "opsi": "B / Opsi 2", "status": "Salah/Benar", "alasan": "Analisis pengecoh..." }
  ],
  "konsepKunci": "Ringkasan konsep inti dan materi prasyarat yang wajib dikuasai siswa",
  "miskonsepsi": "Miskonsepsi / kekeliruan umum siswa yang sering terjadi pada tipe soal ini",
  "tipsGuru": "Strategi pengajaran / scaffolding yang disarankan bagi guru jika murid kesulitan menjawab soal ini"
}`;

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction: "Anda adalah pakar pembuat soal dan asesmen pendidikan Indonesia. Selalu berikan analisis mendalam, tajam, terstruktur dalam format JSON valid.",
          jsonMode: true,
          temperature: 0.5,
        }),
      });

      const data = await res.json();
      if (data.data) {
        setAiGeneratedSolution(data.data);
        addToast("success", "Pembahasan Selesai Disusun", "AI berhasil menganalisis dan membedah butir soal.");
      } else if (data.text) {
        try {
          const parsed = JSON.parse(data.text.replace(/```json|```/g, "").trim());
          setAiGeneratedSolution(parsed);
          addToast("success", "Pembahasan Selesai Disusun", "AI berhasil menganalisis dan membedah butir soal.");
        } catch {
          addToast("warning", "Format Respons AI", "Berhasil mendapatkan analisis, silakan cek hasil.");
        }
      }
    } catch (err: any) {
      console.error(err);
      addToast("error", "Gagal Membedah Soal", "Terjadi kesalahan saat memanggil AI Gemini.");
    } finally {
      setIsAiSolving(false);
    }
  };

  const handlePrintAllSolutions = () => {
    const activeSub = subjects.find((s) => s.id === selectedSubjectId);
    const subTitle = activeSub ? activeSub.name : "Semua Mata Pelajaran";

    const content = `
      <div style="font-family: 'Times New Roman', serif; color: #111; line-height: 1.5; font-size: 12pt;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 18px;">
          <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase; font-weight: bold;">${schoolProfile?.name || "SMA NEGERI 1 NUSANTARA"}</h2>
          <p style="margin: 3px 0; font-size: 10pt;">${schoolProfile?.address || "Jl. Pendidikan Nasional"}</p>
          <h3 style="margin: 10px 0 0 0; font-size: 13pt; text-transform: uppercase; text-decoration: underline;">NASKAH KUNCI JAWABAN & PEMBAHASAN LENGKAP ASESMEN</h3>
          <p style="margin: 4px 0 0 0; font-size: 10pt;">Mata Pelajaran: <strong>${subTitle}</strong> | Tahun Ajaran: ${schoolProfile?.academicYear || "2024/2025"}</p>
        </div>

        ${filteredQuestions
          .map((q: any, idx: number) => {
            const rawOptions = q.options || [];
            const optionsList = Array.isArray(rawOptions)
              ? rawOptions.map((opt: any) => (typeof opt === "string" ? opt : `${opt.key}. ${opt.text}`))
              : [];

            return `
              <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px dashed #ccc; page-break-inside: avoid;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <strong style="font-size: 11pt;">Nomor ${idx + 1}. [${q.cognitiveLevel || q.bloomLevel || "C4"}] - Topik: ${q.topic || "-"}</strong>
                  <span style="font-size: 10pt; color: #555;">Tipe: ${q.questionType || q.type || "Pilihan Ganda"}</span>
                </div>
                ${q.stimulus ? `<div style="background: #f9f9f9; padding: 8px; border-left: 3px solid #666; margin-bottom: 8px; font-style: italic;">${q.stimulus}</div>` : ""}
                <p style="margin: 6px 0; font-weight: 500;">${q.questionText || ""}</p>
                
                ${
                  optionsList.length > 0
                    ? `<div style="margin: 6px 0 10px 16px;">
                        ${optionsList.map((opt: string) => `<div style="margin-bottom: 3px;">${opt}</div>`).join("")}
                      </div>`
                    : ""
                }

                <div style="background: #f4fbf7; border: 1px solid #c3e6cb; padding: 10px 12px; border-radius: 4px; margin-top: 8px;">
                  <div style="font-weight: bold; color: #155724; margin-bottom: 4px;">
                    ✓ KUNCI JAWABAN: ${q.correctAnswer || "A"}
                  </div>
                  <div style="color: #222; font-size: 11pt;">
                    <strong>Pembahasan Ilmiah:</strong><br/>
                    ${q.explanation || "Pembahasan belum dirinci."}
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}

        <div style="margin-top: 36px; display: flex; justify-content: space-between; page-break-inside: avoid;">
          <div style="text-align: center; width: 220px;">
            <p style="margin-bottom: 60px;">Mengetahui,<br/>Kepala Sekolah</p>
            <strong>${schoolProfile?.headmasterName || "Drs. H. Bambang Suryanto, M.Pd."}</strong>
            <p style="margin: 0; font-size: 10pt;">NIP. ${schoolProfile?.headmasterNip || "-"}</p>
          </div>
          <div style="text-align: center; width: 220px;">
            <p style="margin-bottom: 60px;">${schoolProfile?.district || "Jakarta"}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br/>Guru Mata Pelajaran</p>
            <strong>${teacherProfile?.fullName || "Sudirman Danasaputra, S.Kom."}</strong>
            <p style="margin: 0; font-size: 10pt;">NIP. ${teacherProfile?.nip || "-"}</p>
          </div>
        </div>
      </div>
    `;

    setPreviewDoc({
      title: `Naskah Pembahasan Soal - ${subTitle}`,
      htmlContent: content,
      type: "PEMBAHASAN_SOAL",
    });
  };

  return (
    <div className="space-y-6 pb-12" id="pembahasan-soal-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Modul Asesmen & Evaluasi
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/40 rounded-full text-xs font-medium text-emerald-200">
              Deep Solution Matrix
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pembahasan Soal & Kunci Jawaban</h1>
          <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
            Eksplorasi telaah butir soal, penurunan kunci jawaban resmi, analisis distraktor pengecoh, dan identifikasi miskonsepsi siswa berbantuan AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAiSolverOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            AI Bedah Butir Soal
          </button>
          <button
            onClick={handlePrintAllSolutions}
            className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-medium text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Cetak Naskah Pembahasan
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Filter className="w-4 h-4" /> Filter:
          </div>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Mata Pelajaran ({subjects.length})</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code || "-"})
              </option>
            ))}
          </select>

          <select
            value={selectedBloom}
            onChange={(e) => setSelectedBloom(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Semua Level Bloom (C1 - C6)</option>
            <option value="C1">C1 - Mengingat (LOTS)</option>
            <option value="C2">C2 - Memahami (LOTS)</option>
            <option value="C3">C3 - Menerapkan (MOTS)</option>
            <option value="C4">C4 - Menganalisis (HOTS)</option>
            <option value="C5">C5 - Mengevaluasi (HOTS)</option>
            <option value="C6">C6 - Mencipta (HOTS)</option>
          </select>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kata kunci butir soal / topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Questions Solution List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 stroke-1" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">Tidak ada butir soal ditemukan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Silakan tambahkan butir soal di menu <strong>Bank Soal</strong> atau gunakan tombol <strong>AI Bedah Butir Soal</strong> untuk menyusun pembahasan baru.
            </p>
          </div>
        ) : (
          filteredQuestions.map((q: any, index: number) => {
            const isExpanded = expandedId === q.id || (index === 0 && expandedId === null);
            const rawOptions = q.options || [];
            const optionsList = Array.isArray(rawOptions)
              ? rawOptions.map((opt: any) => (typeof opt === "string" ? opt : `${opt.key}. ${opt.text}`))
              : [];
            const bloom = q.cognitiveLevel || q.bloomLevel || "C4";
            const isHots = bloom.includes("C4") || bloom.includes("C5") || bloom.includes("C6");

            return (
              <div
                key={q.id || index}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? "" : q.id)}
                  className="p-5 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {getSubjectName(q.subjectId)}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Topik: <strong className="text-slate-700 dark:text-slate-300">{q.topic || "Umum"}</strong>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            isHots
                              ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                              : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          Level {bloom} {isHots ? "• HOTS" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                        {q.questionText || "Rumusan butir soal..."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Kunci: {q.correctAnswer || "A"}
                    </span>
                    <button
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    {/* Soal & Pilihan */}
                    <div className="space-y-3">
                      {q.stimulus && (
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border-l-4 border-emerald-500 rounded-r-xl text-xs text-slate-700 dark:text-slate-300 italic">
                          <strong>Stimulus / Wacana:</strong>
                          <p className="mt-1">{q.stimulus}</p>
                        </div>
                      )}

                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                        {q.questionText}
                      </div>

                      {optionsList.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                          {optionsList.map((opt: string, optIdx: number) => {
                            const isCorrectOpt =
                              opt.trim().startsWith(q.correctAnswer) ||
                              opt.trim().startsWith(`${q.correctAnswer}.`) ||
                              opt.trim().startsWith(`${q.correctAnswer})`);

                            return (
                              <div
                                key={optIdx}
                                className={`p-3 rounded-xl text-xs flex items-start gap-2.5 border transition-all ${
                                  isCorrectOpt
                                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/80 text-emerald-950 dark:text-emerald-200 font-semibold shadow-xs"
                                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                                    isCorrectOpt
                                      ? "bg-emerald-600 text-white"
                                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  {isCorrectOpt ? "✓" : String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="leading-snug">{opt}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Kotak Pembahasan Utama */}
                    <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-slate-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
                          <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          Telaah & Pembahasan Ilmiah
                        </div>
                        <button
                          onClick={() => handleCopyText(q.explanation || "", q.id)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-1.5 shadow-2xs"
                        >
                          {copiedId === q.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId === q.id ? "Tersalin" : "Salin"}
                        </button>
                      </div>

                      <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-line bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                        {q.explanation || "Belum ada catatan pembahasan untuk butir soal ini."}
                      </div>

                      {/* Detail Indikator & Capaian */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-white/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-teal-600" /> Indikator Soal:
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-snug">
                            {q.indicator || "Disajikan konteks materi, siswa mampu menganalisis solusi yang tepat."}
                          </p>
                        </div>

                        <div className="p-3 bg-white/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Catatan Pedagogis Guru:
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-snug">
                            Perhatikan pemahaman konsep prasyarat siswa agar tidak terjebak pada opsi pengecoh yang memiliki kemiripan istilah.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* AI Deep Solver Modal */}
      {isAiSolverOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base">AI Bedah & Pembahasan Butir Soal</h3>
                  <p className="text-xs text-emerald-100">Analisis ilmiah, langkah penyelesaian, distraktor, dan rekomendasi remedial</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiSolverOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mata Pelajaran:
                  </label>
                  <select
                    value={customSubjectId}
                    onChange={(e) => setCustomSubjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (questionBank && questionBank[0]) {
                        const sample = questionBank[0];
                        setCustomQuestionInput(
                          `${sample.questionText}\n\nPilihan:\n${(sample.options || [])
                            .map((o: any) => (typeof o === "string" ? o : `${o.key}. ${o.text}`))
                            .join("\n")}`
                        );
                      }
                    }}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium mb-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Muat Contoh Soal dari Bank Soal
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Teks Butir Soal & Pilihan Jawaban:
                </label>
                <textarea
                  rows={5}
                  value={customQuestionInput}
                  onChange={(e) => setCustomQuestionInput(e.target.value)}
                  placeholder="Tempelkan soal lengkap beserta opsi A, B, C, D di sini..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  disabled={isAiSolving}
                  onClick={handleAiSolve}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  {isAiSolving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menganalisis Butir Soal...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" /> Bedah & Susun Pembahasan AI
                    </>
                  )}
                </button>
              </div>

              {/* AI Generated Result Display */}
              {aiGeneratedSolution && (
                <div className="bg-slate-50 dark:bg-slate-800/80 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm border-b border-slate-200 dark:border-slate-700 pb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Kunci Jawaban Resmi: <span className="text-emerald-950 dark:text-emerald-100">{aiGeneratedSolution.kunci}</span>
                  </div>

                  {/* Langkah Penyelesaian */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Langkah Penyelesaian Sistematis:</h4>
                    <div className="space-y-1.5">
                      {aiGeneratedSolution.langkahPenyelesaian?.map((step: string, sIdx: number) => (
                        <div key={sIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {sIdx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analisis Distraktor */}
                  {aiGeneratedSolution.analisisDistraktor && aiGeneratedSolution.analisisDistraktor.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Analisis Pengecoh (Distractor Analysis):</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {aiGeneratedSolution.analisisDistraktor.map((d: any, dIdx: number) => (
                          <div key={dIdx} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                            <div className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5 flex items-center justify-between">
                              <span>Opsi {d.opsi}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.status.toLowerCase().includes("benar") ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                                {d.status}
                              </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400">{d.alasan}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Miskonsepsi & Tips Guru */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs">
                      <div className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Miskonsepsi Siswa yang Sering Muncul:
                      </div>
                      <p className="text-amber-950 dark:text-amber-200 leading-snug">{aiGeneratedSolution.miskonsepsi}</p>
                    </div>

                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs">
                      <div className="font-bold text-blue-900 dark:text-blue-300 mb-1 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-blue-600" /> Rekomendasi Pengajaran Guru:
                      </div>
                      <p className="text-blue-950 dark:text-blue-200 leading-snug">{aiGeneratedSolution.tipsGuru}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setIsAiSolverOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all"
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
