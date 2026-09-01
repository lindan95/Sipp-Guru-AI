import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { QuestionItem } from "../../types";
import { createQuestionBankPrompt } from "../../services/aiPromptEngine";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Save,
  X,
  Loader2,
  Printer,
  CheckCircle2,
  Filter,
  Search,
} from "lucide-react";

export const BankSoalView: React.FC = () => {
  const {
    questionBank,
    saveQuestion,
    deleteQuestion,
    subjects,
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
  const [selectedType, setSelectedType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);

  useEffect(() => {
    if (activeSubjectId) {
      setSelectedSubjectId(activeSubjectId);
    }
  }, [activeSubjectId]);

  // AI Generator Parameters
  const [aiTopic, setAiTopic] = useState("");
  const [aiBloomLevel, setAiBloomLevel] = useState("C4 (Menganalisis)");
  const [aiQuestionType, setAiQuestionType] = useState<"PG" | "Esai">("PG");
  const [aiCount, setAiCount] = useState(3);

  const [formData, setFormData] = useState<QuestionItem>({
    id: "",
    subjectId: activeSubjectId || subjects[0]?.id || "sbj-inf",
    topic: "",
    bloomLevel: "C4",
    type: "PG",
    stimulus: "",
    questionText: "",
    options: ["A. Pilihan 1", "B. Pilihan 2", "C. Pilihan 3", "D. Pilihan 4"],
    correctAnswer: "A",
    explanation: "Penjelasan kunci jawaban secara ilmiah...",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormData({
      id: "q-" + Date.now(),
      subjectId: (selectedSubjectId !== "all" ? selectedSubjectId : activeSubjectId) || subjects[0]?.id || "sbj-inf",
      topic: "Topik Materi",
      bloomLevel: "C4",
      type: "PG",
      stimulus: "",
      questionText: "Rumusan butir soal...",
      options: ["A. Opsi Satu", "B. Opsi Dua", "C. Opsi Tiga", "D. Opsi Empat"],
      correctAnswer: "A",
      explanation: "Pembahasan lengkap...",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: QuestionItem) => {
    setEditingQuestion(q);
    setFormData({ ...q });
    setIsModalOpen(true);
  };

  const handleAiBatchGenerate = async () => {
    if (!aiTopic.trim()) {
      addToast("warning", "Topik Wajib Diisi", "Tuliskan topik soal yang ingin dibuat AI.");
      return;
    }

    setIsAiLoading(true);
    try {
      const { prompt, systemInstruction } = createQuestionBankPrompt(
        { school: schoolProfile, teacher: teacherProfile, subject: subjects.find((s) => s.id === formData.subjectId) },
        aiTopic,
        aiBloomLevel,
        aiQuestionType,
        aiCount
      );

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, temperature: 0.7 }),
      });
      const data = await res.json();
      if (data.text) {
        try {
          const parsed = JSON.parse(data.text.replace(/```json|```/g, "").trim());
          if (Array.isArray(parsed)) {
            parsed.forEach((q) => {
              saveQuestion({
                id: "q-" + Date.now() + "-" + Math.random().toString(36).substr(2, 5),
                subjectId: subjects[0]?.id || "sbj-inf",
                topic: aiTopic,
                bloomLevel: q.bloomLevel || aiBloomLevel,
                type: q.type || aiQuestionType,
                stimulus: q.stimulus || "",
                questionText: q.questionText || "",
                options: q.options || [],
                correctAnswer: q.correctAnswer || "A",
                explanation: q.explanation || "",
                createdAt: new Date().toISOString(),
              });
            });
            setIsAiModalOpen(false);
            addToast("success", "AI Bank Soal Selesai", `Berhasil membuat ${parsed.length} butir soal ${aiQuestionType} berbasis HOTS.`);
          }
        } catch {
          addToast("info", "Respons AI", data.text.slice(0, 100));
        }
      }
    } catch (e) {
      console.error(e);
      addToast("error", "AI Gagal", "Gagal merumuskan bank soal.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveQuestion(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Naskah Soal & Kisi-Kisi Bank Soal Lengkap",
      docType: "BANK_SOAL_DOCUMENT",
      dataObj: {
        questions: filteredQuestions,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  const filteredQuestions = questionBank.filter((q) => {
    const matchSubject = selectedSubjectId === "all" || q.subjectId === selectedSubjectId;
    const matchType = selectedType === "all" || q.type === selectedType;
    const matchSearch =
      q.questionText.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Bank Soal & Kisi-Kisi Asesmen Berbasis AI
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pusat perbendaharaan instrumen evaluasi, soal HOTS berstimulus kontekstual, klasifikasi Taksonomi Bloom (C1-C6), dan kunci pembahasan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAiTopic("");
              setIsAiModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            AI Generator Soal HOTS
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Naskah Soal
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Manual
          </button>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedSubjectId={selectedSubjectId}
        onSubjectChange={(id) => setSelectedSubjectId(id)}
        extraControls={
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-750 dark:bg-slate-850 dark:text-slate-200"
            >
              <option value="all">Semua Jenis Soal</option>
              <option value="PG">Pilihan Ganda (PG)</option>
              <option value="Esai">Uraian / Esai</option>
              <option value="BenarSalah">Benar / Salah</option>
              <option value="Menjodohkan">Menjodohkan</option>
            </select>
          </div>
        }
      />

      {/* Filter Bar with Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari butir soal atau topik..."
            className="w-full text-xs text-slate-800 focus:outline-none dark:text-slate-200 dark:bg-transparent"
          />
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Menampilkan <b>{filteredQuestions.length}</b> Soal
        </span>
      </div>

      {/* List of Questions */}
      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                  {idx + 1}
                </span>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {q.type} • {q.bloomLevel}
                </span>
                <span className="text-xs font-semibold text-slate-500">{q.topic}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(q)}
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Hapus butir soal ini?")) deleteQuestion(q.id);
                  }}
                  className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {q.stimulus && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">Stimulus / Kasus:</strong>
                <p className="mt-1 leading-relaxed">{q.stimulus}</p>
              </div>
            )}

            <div className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
              {q.questionText}
            </div>

            {q.type === "PG" && q.options && q.options.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = opt.startsWith(q.correctAnswer) || opt === q.correctAnswer;
                  return (
                    <div
                      key={oIdx}
                      className={`rounded-xl border p-2.5 ${
                        isCorrect
                          ? "border-emerald-300 bg-emerald-50/60 font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
                          : "border-slate-100 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
                      }`}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            )}

            {q.explanation && (
              <div className="rounded-xl bg-blue-50/50 p-3 text-[11px] text-blue-900 dark:bg-blue-950/20 dark:text-blue-300">
                <strong>Kunci & Pembahasan:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal AI Batch Generator */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Generator Soal HOTS & Stimulus
                </h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Materi Pokok / Topik Soal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Keamanan Siber & Enkripsi Data"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Bentuk Soal
                  </label>
                  <select
                    value={aiQuestionType}
                    onChange={(e) => setAiQuestionType(e.target.value as "PG" | "Esai")}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="PG">Pilihan Ganda (PG)</option>
                    <option value="Esai">Uraian / Kasus Esai</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Level Taksonomi Bloom
                  </label>
                  <select
                    value={aiBloomLevel}
                    onChange={(e) => setAiBloomLevel(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="C3 (Menerapkan)">C3 - Menerapkan</option>
                    <option value="C4 (Menganalisis)">C4 - Menganalisis (HOTS)</option>
                    <option value="C5 (Mengevaluasi)">C5 - Mengevaluasi (HOTS)</option>
                    <option value="C6 (Mencipta)">C6 - Mencipta (HOTS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Jumlah Butir Soal yang Digenerate
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={aiCount}
                  onChange={(e) => setAiCount(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAiBatchGenerate}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {isAiLoading ? "Merancang Soal..." : "Generate Butir Soal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add/Edit Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingQuestion ? "Edit Butir Soal" : "Tambah Soal Bank"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Bentuk Soal</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="PG">Pilihan Ganda (PG)</option>
                    <option value="Esai">Uraian / Esai</option>
                    <option value="BenarSalah">Benar / Salah</option>
                    <option value="Menjodohkan">Menjodohkan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Level Kognitif</label>
                  <select
                    value={formData.bloomLevel}
                    onChange={(e) => setFormData({ ...formData, bloomLevel: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="C1">C1 - Mengingat</option>
                    <option value="C2">C2 - Memahami</option>
                    <option value="C3">C3 - Menerapkan</option>
                    <option value="C4">C4 - Menganalisis (HOTS)</option>
                    <option value="C5">C5 - Mengevaluasi (HOTS)</option>
                    <option value="C6">C6 - Mencipta (HOTS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Topik / Bab</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Stimulus / Wacana / Kasus
                </label>
                <textarea
                  rows={2}
                  value={formData.stimulus || ""}
                  onChange={(e) => setFormData({ ...formData, stimulus: e.target.value })}
                  placeholder="Teks atau data stimulus (opsional)..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Pertanyaan / Butir Soal *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              {formData.type === "PG" && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Opsi Pilihan Ganda (Pisahkan dengan baris baru)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.options?.join("\n") || ""}
                    onChange={(e) => setFormData({ ...formData, options: e.target.value.split("\n") })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Kunci Jawaban Singkat
                  </label>
                  <input
                    type="text"
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    placeholder="Contoh: A atau Kata Kunci"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Pembahasan Soal
                  </label>
                  <input
                    type="text"
                    value={formData.explanation || ""}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Uraian alasan kunci..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  Simpan Soal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
