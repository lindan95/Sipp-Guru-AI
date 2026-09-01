import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { LKPDItem } from "../../types";
import { createLKPDPrompt } from "../../services/aiPromptEngine";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  FileCheck2,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Save,
  X,
  Loader2,
  Printer,
  FileSpreadsheet,
} from "lucide-react";

export const LKPDView: React.FC = () => {
  const {
    lkpdList,
    saveLKPD,
    deleteLKPD,
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingLKPD, setEditingLKPD] = useState<LKPDItem | null>(null);

  const filteredLKPDList = lkpdList.filter((lk) => {
    const matchSub = filterSubjectId === "all" || lk.subjectId === filterSubjectId;
    const matchCls = filterClassId === "all" || !lk.classId || lk.classId === filterClassId;
    return matchSub && matchCls;
  });

  const [formData, setFormData] = useState<LKPDItem>({
    id: "",
    title: "",
    subjectId: activeSubjectId || subjects[0]?.id || "sbj-inf",
    classId: activeClassId || classes[0]?.id || "cls-10a",
    phase: "Fase E",
    instructions: "1. Bentuk kelompok 3-4 siswa.\n2. Amati studi kasus yang disajikan.\n3. Diskusikan dan jawab pertanyaan analisis.",
    stimulus: "Sebuah perusahaan e-commerce membutuhkan algoritma rekomendasi produk yang efisien saat volume transaksi meningkat ribuan kali lipat setiap detiknya.",
    tasks: [
      "Identifikasi masalah utama dalam kasus di atas!",
      "Rancang struktur data yang paling tepat untuk menangani antrean transaksi!",
      "Simulasikan perbandingan kinerja antara Array vs Queue!",
    ],
    reflection: "Bagaimana kelompok Anda membagi peran dan menyelesaikan tantangan ini?",
    rubricCriteria: [
      { name: "Ketepatan Analisis Kasus", maxScore: 40 },
      { name: "Desain Solusi Struktur Data", maxScore: 40 },
      { name: "Kolaborasi & Presentasi", maxScore: 20 },
    ],
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingLKPD(null);
    setFormData({
      id: "lkpd-" + Date.now(),
      title: "LKPD 01: Analisis Masalah",
      subjectId: (filterSubjectId !== "all" ? filterSubjectId : activeSubjectId) || subjects[0]?.id || "sbj-inf",
      classId: (filterClassId !== "all" ? filterClassId : activeClassId) || classes[0]?.id || "cls-10a",
      phase: "Fase E",
      instructions: "1. Bacalah petunjuk secara seksama.\n2. Diskusikan bersama anggota tim.",
      stimulus: "Deskripsi kasus studi atau teks bacaan pemantik...",
      tasks: ["Tugas 1: Analisis awal", "Tugas 2: Eksperimen mandiri", "Tugas 3: Kesimpulan"],
      reflection: "Apa tantangan terbesar selama pengerjaan LKPD?",
      rubricCriteria: [
        { name: "Pemahaman Konsep", maxScore: 50 },
        { name: "Kerapian & Keteraturan", maxScore: 50 },
      ],
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lk: LKPDItem) => {
    setEditingLKPD(lk);
    setFormData({ ...lk });
    setIsModalOpen(true);
  };

  const handleAiGenerate = async () => {
    if (!formData.title) {
      addToast("warning", "Judul Diperlukan", "Isi judul materi LKPD untuk diproses AI.");
      return;
    }

    setIsAiLoading(true);
    try {
      const { prompt, systemInstruction } = createLKPDPrompt(
        { school: schoolProfile, teacher: teacherProfile, subject: subjects.find((s) => s.id === formData.subjectId) },
        formData.title,
        formData.phase,
        "Aktivitas Diskusi & Penyelidikan Masalah"
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
          setFormData((prev) => ({
            ...prev,
            title: parsed.title || prev.title,
            instructions: parsed.instructions || prev.instructions,
            stimulus: parsed.stimulus || prev.stimulus,
            tasks: parsed.tasks || prev.tasks,
            reflection: parsed.reflection || prev.reflection,
            rubricCriteria: parsed.rubricCriteria || prev.rubricCriteria,
          }));
          addToast("success", "LKPD Siap", "Struktur lembar kerja peserta didik berhasil disusun.");
        } catch {
          setFormData((prev) => ({ ...prev, stimulus: data.text }));
        }
      }
    } catch (e) {
      console.error(e);
      addToast("error", "AI Gagal", "Gagal merancang LKPD.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveLKPD(formData);
    setIsModalOpen(false);
  };

  const handlePrint = (lk: LKPDItem) => {
    setPreviewDoc({
      title: `Lembar Kerja Peserta Didik (LKPD): ${lk.title}`,
      docType: "LKPD_DOCUMENT",
      dataObj: {
        lkpd: lk,
        school: schoolProfile,
        teacher: teacherProfile,
        subject: subjects.find((s) => s.id === lk.subjectId),
        classInfo: classes.find((c) => c.id === lk.classId),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Lembar Kerja Peserta Didik (LKPD)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penyusunan instrumen lembar aktivitas siswa berorientasi stimulus kontekstual, pertanyaan berpikir kritis (HOTS), dan rubrik penilaian kerja.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          Buat LKPD Baru
        </button>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedClassId={filterClassId}
        onClassChange={(id) => setFilterClassId(id)}
        selectedSubjectId={filterSubjectId}
        onSubjectChange={(id) => setFilterSubjectId(id)}
        extraControls={
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan <b>{filteredLKPDList.length}</b> Lembar Kerja Peserta Didik
          </span>
        }
      />

      {/* Grid of LKPDs */}
      {filteredLKPDList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-xs text-slate-500 dark:border-slate-700">
          Belum ada LKPD yang sesuai filter kelas/mata pelajaran ini. Klik "Buat LKPD Baru" untuk menambahkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredLKPDList.map((lk) => {
            const sbj = subjects.find((s) => s.id === lk.subjectId);
            const cls = classes.find((c) => c.id === lk.classId);
            return (
            <div
              key={lk.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {lk.phase} • {cls?.name || "Semua Kelas"}
                  </span>
                  <span className="text-[11px] text-slate-400">{sbj?.name}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{lk.title}</h3>
                  <div className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-850 dark:text-slate-300 line-clamp-3">
                    <strong>Stimulus:</strong> {lk.stimulus}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                    Daftar Tugas / Aktivitas Siswa ({(lk.tasks || []).length}):
                  </span>
                  <ul className="mt-1 list-decimal pl-5 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    {(lk.tasks || []).slice(0, 3).map((t, idx) => (
                      <li key={idx} className="line-clamp-1">{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  onClick={() => handlePrint(lk)}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Cetak Lembar Kerja Siswa
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(lk)}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus LKPD ${lk.title}?`)) deleteLKPD(lk.id);
                    }}
                    className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingLKPD ? "Edit Lembar Kerja Siswa" : "Buat LKPD Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Judul LKPD & Pokok Bahasan *
                  </label>
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isAiLoading}
                    className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    {isAiLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Generate Kasus & Soal via AI
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: LKPD 02 - Eksplorasi Antrean Queue pada Sistem Tiket"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Petunjuk Pengerjaan
                </label>
                <textarea
                  rows={2}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Stimulus / Studi Kasus / Bacaan Masalah *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.stimulus}
                  onChange={(e) => setFormData({ ...formData, stimulus: e.target.value })}
                  placeholder="Cerita atau fenomena kontekstual yang harus diamati siswa..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Daftar Pertanyaan / Tugas Siswa (Pisahkan dengan baris baru)
                </label>
                <textarea
                  rows={4}
                  value={formData.tasks.join("\n")}
                  onChange={(e) => setFormData({ ...formData, tasks: e.target.value.split("\n") })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Pertanyaan Refleksi Siswa
                </label>
                <input
                  type="text"
                  value={formData.reflection}
                  onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
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
                  Simpan LKPD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
