import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AlurTujuanPembelajaran } from "../../types";
import { createATPPrompt } from "../../services/aiPromptEngine";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Save,
  X,
  Loader2,
  ArrowDownUp,
  Printer,
  Clock,
} from "lucide-react";

export const ATPView: React.FC = () => {
  const {
    atpList,
    saveATP,
    deleteATP,
    cpList,
    subjects,
    activeSubjectId,
    setActiveSubjectId,
    addToast,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
  } = useApp();
  const [filterSubjectId, setFilterSubjectId] = useState<string>(activeSubjectId || "all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingATP, setEditingATP] = useState<AlurTujuanPembelajaran | null>(null);

  const filteredATPList = atpList.filter((atp) => {
    if (filterSubjectId === "all") return true;
    return atp.subjectId === filterSubjectId;
  });

  const [formData, setFormData] = useState<AlurTujuanPembelajaran>({
    id: "",
    cpId: cpList[0]?.id || "cp-001",
    subjectId: activeSubjectId || subjects[0]?.id || "sbj-inf",
    phase: "Fase E",
    learningObjective: "",
    topic: "",
    allocatedHours: 4,
    orderNumber: atpList.length + 1,
    learningFlowSummary: "",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingATP(null);
    setFormData({
      id: "atp-" + Date.now(),
      cpId: cpList[0]?.id || "cp-001",
      subjectId: (filterSubjectId !== "all" ? filterSubjectId : activeSubjectId) || subjects[0]?.id || "sbj-inf",
      phase: "Fase E",
      learningObjective: "",
      topic: "",
      allocatedHours: 4,
      orderNumber: atpList.length + 1,
      learningFlowSummary: "",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (atp: AlurTujuanPembelajaran) => {
    setEditingATP(atp);
    setFormData({ ...atp });
    setIsModalOpen(true);
  };

  const handleAiAutoGenerate = async () => {
    const selectedCP = cpList.find((c) => c.id === formData.cpId) || cpList[0];
    if (!selectedCP) {
      addToast("warning", "Pilih CP Terlebih Dahulu", "Buat atau pilih CP sebagai acuan penurunan ATP.");
      return;
    }

    setIsAiLoading(true);
    try {
      const { prompt, systemInstruction } = createATPPrompt(
        {
          school: schoolProfile,
          teacher: teacherProfile,
          subject: subjects.find((s) => s.id === formData.subjectId),
          phase: formData.phase,
        },
        selectedCP.description
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
          if (Array.isArray(parsed) && parsed.length > 0) {
            const first = parsed[0];
            setFormData((prev) => ({
              ...prev,
              topic: first.topic || prev.topic,
              learningObjective: first.learningObjective || prev.learningObjective,
              allocatedHours: first.allocatedHours || prev.allocatedHours,
              learningFlowSummary: first.learningFlowSummary || prev.learningFlowSummary,
            }));
            addToast("success", "AI Berhasil", "ATP berhasil dirancang dari rumusan CP.");
          }
        } catch {
          setFormData((prev) => ({ ...prev, learningObjective: data.text }));
        }
      }
    } catch (e) {
      console.error(e);
      addToast("error", "AI Gagal", "Gagal merumuskan ATP.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveATP(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Dokumen Alur Tujuan Pembelajaran (ATP) Lengkap",
      docType: "ATP_DOCUMENT",
      dataObj: {
        atpList,
        cpList,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  const totalJP = atpList.reduce((acc, curr) => acc + (curr.allocatedHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Alur Tujuan Pembelajaran (ATP)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rangkaian Tujuan Pembelajaran (TP) yang disusun secara logis dan sistematis dalam satu fase untuk mencapai Capaian Pembelajaran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Dokumen ATP
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah ATP Baru
          </button>
        </div>
      </div>

      {/* Summary Alokasi Total */}
      <div className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200">
              Total Alokasi Waktu ATP
            </h4>
            <p className="text-xs text-blue-800/80 dark:text-blue-300">
              {atpList.length} Modul / Lingkup Materi Terpetakan
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">
            {filteredATPList.reduce((acc, curr) => acc + (curr.allocatedHours || 0), 0)}
          </span>
          <span className="text-xs font-semibold text-blue-600/80 dark:text-blue-400"> JP Total</span>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedSubjectId={filterSubjectId}
        onSubjectChange={(id) => setFilterSubjectId(id)}
        extraControls={
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan <b>{filteredATPList.length}</b> Alur Tujuan Pembelajaran
          </span>
        }
      />

      {/* Table Data ATP */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">Urutan</th>
                <th className="px-4 py-3">Elemen & Topik Materi</th>
                <th className="px-4 py-3">Tujuan Pembelajaran (TP)</th>
                <th className="px-4 py-3">Alur & Aktivitas</th>
                <th className="px-4 py-3 text-center">Alokasi (JP)</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredATPList.map((atp) => (
                <tr key={atp.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  <td className="px-4 py-3 text-center font-bold text-blue-600">
                    #{atp.orderNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900 dark:text-white">{atp.topic}</div>
                    <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      {atp.element || atp.phase}
                    </span>
                  </td>
                  <td className="px-4 py-3 leading-relaxed font-medium">
                    {atp.learningObjective}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {atp.learningFlowSummary || "-"}
                  </td>
                  <td className="px-4 py-3 text-center font-bold">{atp.allocatedHours} JP</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(atp)}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit ATP"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Hapus alur tujuan pembelajaran ini?")) deleteATP(atp.id);
                        }}
                        className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Hapus ATP"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingATP ? "Edit Alur Tujuan Pembelajaran" : "Tambah ATP Baru"}
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
                    Acuan Capaian (CP) *
                  </label>
                  <select
                    value={formData.cpId}
                    onChange={(e) => setFormData({ ...formData, cpId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {cpList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.element} ({c.phase})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Urutan Modul (#)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Topik / Lingkup Materi *
                  </label>
                  <button
                    type="button"
                    onClick={handleAiAutoGenerate}
                    disabled={isAiLoading}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    {isAiLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    Generate dari CP via AI
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Struktur Data Linier (Stack & Queue)"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tujuan Pembelajaran (TP) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Peserta didik mampu memahami dan menerapkan..."
                  value={formData.learningObjective}
                  onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Alokasi Waktu (JP) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.allocatedHours}
                    onChange={(e) => setFormData({ ...formData, allocatedHours: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ringkasan Alur Aktivitas
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Eksplorasi, Praktik, Asesmen"
                    value={formData.learningFlowSummary || ""}
                    onChange={(e) => setFormData({ ...formData, learningFlowSummary: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
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
                  Simpan ATP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
