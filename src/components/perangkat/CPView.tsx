import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CapaianPembelajaran } from "../../types";
import { createCPPrompt } from "../../services/aiPromptEngine";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  FileSpreadsheet,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Save,
  X,
  Loader2,
  Copy,
  Printer,
} from "lucide-react";

export const CPView: React.FC = () => {
  const {
    cpList,
    saveCP,
    deleteCP,
    subjects,
    activeSubjectId,
    setActiveSubjectId,
    activeClassId,
    addToast,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
  } = useApp();
  const [filterSubjectId, setFilterSubjectId] = useState<string>(activeSubjectId || "all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingCP, setEditingCP] = useState<CapaianPembelajaran | null>(null);

  const filteredCPList = cpList.filter((cp) => {
    if (filterSubjectId === "all") return true;
    return cp.subjectId === filterSubjectId;
  });

  const [formData, setFormData] = useState<CapaianPembelajaran>({
    id: "",
    subjectId: activeSubjectId || subjects[0]?.id || "sbj-inf",
    phase: "Fase E",
    element: "",
    description: "",
    academicYear: "2024/2025",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingCP(null);
    setFormData({
      id: "cp-" + Date.now(),
      subjectId: (filterSubjectId !== "all" ? filterSubjectId : activeSubjectId) || subjects[0]?.id || "sbj-inf",
      phase: "Fase E",
      element: "",
      description: "",
      academicYear: "2024/2025",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cp: CapaianPembelajaran) => {
    setEditingCP(cp);
    setFormData({ ...cp });
    setIsModalOpen(true);
  };

  const handleAiGenerate = async () => {
    const sbj = subjects.find((s) => s.id === formData.subjectId)?.name || "Informatika";
    const element = formData.element || "Elemen Utama";

    setIsAiLoading(true);
    try {
      const { prompt, systemInstruction } = createCPPrompt(sbj, formData.phase, element);
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction,
          temperature: 0.7,
        }),
      });
      const data = await res.json();
      if (data.text) {
        try {
          const parsed = JSON.parse(data.text.replace(/```json|```/g, "").trim());
          setFormData((prev) => ({
            ...prev,
            element: parsed.element || prev.element,
            description: parsed.description || data.text,
          }));
          addToast("success", "AI Berhasil", "Capaian Pembelajaran berhasil dirumuskan AI.");
        } catch {
          setFormData((prev) => ({ ...prev, description: data.text }));
        }
      }
    } catch (e) {
      console.error(e);
      addToast("error", "Gagal Menghubungi AI", "Periksa koneksi atau konfigurasi backend.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCP(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Dokumen Capaian Pembelajaran (CP) Resmi",
      docType: "CP_DOCUMENT",
      dataObj: {
        cpList,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Capaian Pembelajaran (CP)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rumusan kompetensi dan lingkup materi pembelajaran per fase Kurikulum Merdeka yang menjadi landasan penyusunan ATP dan Modul Ajar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Dokumen CP
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah CP Baru
          </button>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedSubjectId={filterSubjectId}
        onSubjectChange={(id) => setFilterSubjectId(id)}
        extraControls={
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan <b>{filteredCPList.length}</b> elemen CP
          </span>
        }
      />

      {/* Grid CP Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredCPList.map((cp) => {
          const sbj = subjects.find((s) => s.id === cp.subjectId);
          return (
            <div
              key={cp.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {cp.phase}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {sbj?.name || "Mata Pelajaran"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">TA {cp.academicYear}</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Elemen: {cp.element}
                  </h3>
                  <div className="mt-2 rounded-xl bg-slate-50 p-3.5 text-xs leading-relaxed text-slate-700 dark:bg-slate-850 dark:text-slate-300">
                    {cp.description}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[10px] text-slate-400">
                  Dibuat: {new Date(cp.createdAt).toLocaleDateString("id-ID")}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cp.description);
                      addToast("success", "Disalin", "Teks CP disalin ke clipboard.");
                    }}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Salin Teks"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(cp)}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit CP"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Hapus Capaian Pembelajaran ini?")) deleteCP(cp.id);
                    }}
                    className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                    title="Hapus CP"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingCP ? "Edit Capaian Pembelajaran" : "Tambah Capaian Pembelajaran (CP)"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mata Pelajaran *
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Fase *
                  </label>
                  <select
                    value={formData.phase}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Fase A">Fase A</option>
                    <option value="Fase B">Fase B</option>
                    <option value="Fase C">Fase C</option>
                    <option value="Fase D">Fase D</option>
                    <option value="Fase E">Fase E</option>
                    <option value="Fase F">Fase F</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nama Elemen CP *
                  </label>
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isAiLoading}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    {isAiLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Rumuskan via AI
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Berpikir Komputasional / Aljabar / Menyimak"
                  value={formData.element}
                  onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Uraian Capaian Pembelajaran (CP) *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Pada akhir fase ini, peserta didik mampu..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
                  Simpan CP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
