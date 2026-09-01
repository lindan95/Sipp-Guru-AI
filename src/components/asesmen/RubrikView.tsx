import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { RubricItem } from "../../types";
import { createRubricPrompt } from "../../services/aiPromptEngine";
import {
  ListChecks,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Save,
  X,
  Loader2,
  Printer,
} from "lucide-react";

export const RubrikView: React.FC = () => {
  const {
    rubricList,
    saveRubric,
    deleteRubric,
    subjects,
    schoolProfile,
    teacherProfile,
    addToast,
    setPreviewDoc,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingRubric, setEditingRubric] = useState<RubricItem | null>(null);

  const [formData, setFormData] = useState<RubricItem>({
    id: "",
    title: "",
    subjectId: subjects[0]?.id || "sbj-inf",
    type: "Proyek",
    criteria: [
      {
        aspect: "Desain dan Perencanaan",
        weight: 30,
        descriptors: [
          { level: "Sangat Baik (4)", scoreRange: "86-100", description: "Perencanaan sangat terstruktur dan inovatif." },
          { level: "Baik (3)", scoreRange: "76-85", description: "Perencanaan terstruktur dengan baik." },
          { level: "Cukup (2)", scoreRange: "66-75", description: "Perencanaan cukup memadai." },
          { level: "Perlu Bimbingan (1)", scoreRange: "0-65", description: "Belum membuat perencanaan terstruktur." },
        ],
      },
      {
        aspect: "Implementasi & Hasil Karya",
        weight: 50,
        descriptors: [
          { level: "Sangat Baik (4)", scoreRange: "86-100", description: "Karya berfungsi sempurna tanpa error." },
          { level: "Baik (3)", scoreRange: "76-85", description: "Karya berfungsi baik dengan sedikit catatan." },
          { level: "Cukup (2)", scoreRange: "66-75", description: "Karya berfungsi sebagian." },
          { level: "Perlu Bimbingan (1)", scoreRange: "0-65", description: "Karya belum berfungsi." },
        ],
      },
      {
        aspect: "Presentasi & Kolaborasi",
        weight: 20,
        descriptors: [
          { level: "Sangat Baik (4)", scoreRange: "86-100", description: "Menjelaskan dengan sangat komunikatif." },
          { level: "Baik (3)", scoreRange: "76-85", description: "Komunikatif dan percaya diri." },
          { level: "Cukup (2)", scoreRange: "66-75", description: "Cukup mampu menyampaikan poin." },
          { level: "Perlu Bimbingan (1)", scoreRange: "0-65", description: "Kurang percaya diri dan pasif." },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingRubric(null);
    setFormData({
      id: "rub-" + Date.now(),
      title: "Rubrik Penilaian Unjuk Kerja",
      subjectId: subjects[0]?.id || "sbj-inf",
      type: "Kinerja",
      criteria: [
        {
          aspect: "Keterampilan Praktik",
          weight: 60,
          descriptors: [
            { level: "Sangat Baik (4)", scoreRange: "86-100", description: "Sangat terampil dan mandiri." },
            { level: "Baik (3)", scoreRange: "76-85", description: "Terampil sesuai SOP." },
            { level: "Cukup (2)", scoreRange: "66-75", description: "Cukup terampil dengan arahan." },
            { level: "Perlu Bimbingan (1)", scoreRange: "0-65", description: "Membutuhkan bimbingan intensif." },
          ],
        },
        {
          aspect: "Sikap Kerja & Ketepatan Waktu",
          weight: 40,
          descriptors: [
            { level: "Sangat Baik (4)", scoreRange: "86-100", description: "Disiplin tinggi dan tuntas tepat waktu." },
            { level: "Baik (3)", scoreRange: "76-85", description: "Disiplin dan tepat waktu." },
            { level: "Cukup (2)", scoreRange: "66-75", description: "Cukup disiplin." },
            { level: "Perlu Bimbingan (1)", scoreRange: "0-65", description: "Kurang tertib dan terlambat." },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rub: RubricItem) => {
    setEditingRubric(rub);
    setFormData({ ...rub });
    setIsModalOpen(true);
  };

  const handleAiGenerate = async () => {
    if (!formData.title) {
      addToast("warning", "Judul Diperlukan", "Isi judul tugas/proyek untuk diproses AI.");
      return;
    }

    setIsAiLoading(true);
    try {
      const { prompt, systemInstruction } = createRubricPrompt(
        { school: schoolProfile, teacher: teacherProfile },
        formData.title,
        formData.type
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
            criteria: parsed.criteria || prev.criteria,
          }));
          addToast("success", "Rubrik Berhasil Disusun", "Kriteria dan deskriptor performa 4 level siap digunakan.");
        } catch {
          addToast("info", "Respons AI", data.text.slice(0, 100));
        }
      }
    } catch (e) {
      console.error(e);
      addToast("error", "AI Gagal", "Gagal merancang rubrik.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveRubric(formData);
    setIsModalOpen(false);
  };

  const handlePrint = (rub: RubricItem) => {
    setPreviewDoc({
      title: `Instrumen Rubrik Penilaian: ${rub.title}`,
      docType: "RUBRIK_DOCUMENT",
      dataObj: {
        rubric: rub,
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
            Rubrik Penilaian Autentik & Portofolio
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pedoman penilaian kinerja unjuk kerja, presentasi lisan, produk karya, dan asesmen proyek berbasis kriteria 4 tingkat capaian.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          Buat Rubrik Baru
        </button>
      </div>

      {/* Grid of Rubrics */}
      <div className="space-y-4">
        {rubricList.map((rub) => (
          <div
            key={rub.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Jenis: {rub.type}
                </span>
                <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
                  {rub.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePrint(rub)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Cetak Lembar Rubrik
                </button>
                <button
                  onClick={() => handleOpenEdit(rub)}
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Hapus rubrik ${rub.title}?`)) deleteRubric(rub.id);
                  }}
                  className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Criteria Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-100 dark:border-slate-800">
                <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 dark:bg-slate-850 dark:text-slate-400">
                  <tr>
                    <th className="p-3 border-r border-slate-200 dark:border-slate-800 w-1/4">Aspek & Bobot</th>
                    <th className="p-3 border-r border-slate-200 dark:border-slate-800">Sangat Baik (4)</th>
                    <th className="p-3 border-r border-slate-200 dark:border-slate-800">Baik (3)</th>
                    <th className="p-3 border-r border-slate-200 dark:border-slate-800">Cukup (2)</th>
                    <th className="p-3">Perlu Bimbingan (1)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {rub.criteria.map((cr, cIdx) => (
                    <tr key={cIdx}>
                      <td className="p-3 border-r border-slate-100 dark:border-slate-800 font-bold bg-slate-50/40 dark:bg-slate-850/40">
                        <div>{cr.aspect}</div>
                        <span className="text-[10px] text-blue-600">Bobot: {cr.weight}%</span>
                      </td>
                      {cr.descriptors.map((desc, dIdx) => (
                        <td key={dIdx} className="p-3 border-r border-slate-100 dark:border-slate-800 align-top text-[11px] leading-relaxed">
                          {desc.description}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingRubric ? "Edit Rubrik Penilaian" : "Buat Rubrik Baru"}
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
                    Judul Tugas / Proyek *
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
                    Generate Rubrik via AI
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rubrik Penilaian Proyek Pemrograman Web Sederhana"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Jenis Rubrik</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Proyek">Rubrik Proyek</option>
                    <option value="Kinerja">Rubrik Kinerja / Praktik</option>
                    <option value="Presentasi">Rubrik Presentasi</option>
                    <option value="Portofolio">Rubrik Portofolio</option>
                    <option value="Sikap / Pancasila">Rubrik Observasi Sikap</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Aspek & Deskriptor Capaian</h4>
                {formData.criteria.map((cr, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 p-3 space-y-2 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={cr.aspect}
                        onChange={(e) => {
                          const updated = [...formData.criteria];
                          updated[idx].aspect = e.target.value;
                          setFormData({ ...formData, criteria: updated });
                        }}
                        placeholder="Nama Aspek Penilaian"
                        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                      <input
                        type="number"
                        value={cr.weight}
                        onChange={(e) => {
                          const updated = [...formData.criteria];
                          updated[idx].weight = Number(e.target.value);
                          setFormData({ ...formData, criteria: updated });
                        }}
                        placeholder="Bobot %"
                        className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>
                ))}
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
                  Simpan Rubrik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
