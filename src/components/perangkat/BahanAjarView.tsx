import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { TeachingMaterial } from "../../types";
import {
  BookMarked,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  Sparkles,
  ExternalLink,
  FileText,
} from "lucide-react";

export const BahanAjarView: React.FC = () => {
  const {
    teachingMaterials,
    saveTeachingMaterial,
    deleteTeachingMaterial,
    subjects,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
    addToast,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<TeachingMaterial | null>(null);

  const [formData, setFormData] = useState<TeachingMaterial>({
    id: "",
    title: "",
    subjectId: subjects[0]?.id || "sbj-inf",
    phase: "Fase E",
    topic: "",
    type: "Ringkasan Materi",
    content: "",
    source: "",
    fileUrl: "",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingMaterial(null);
    setFormData({
      id: "mat-" + Date.now(),
      title: "Bahan Ajar: Handout Konsep",
      subjectId: subjects[0]?.id || "sbj-inf",
      phase: "Fase E",
      topic: "Topik Materi Pokok",
      type: "Ringkasan Materi",
      content: "Uraian materi inti, poin penting, contoh aplikasi dalam industri...",
      source: "Buku Guru & Siswa Kurikulum Merdeka",
      fileUrl: "",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: TeachingMaterial) => {
    setEditingMaterial(m);
    setFormData({ ...m });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTeachingMaterial(formData);
    setIsModalOpen(false);
  };

  const handlePrint = (m: TeachingMaterial) => {
    setPreviewDoc({
      title: `Bahan Ajar / Handout: ${m.title}`,
      docType: "BAHAN_AJAR_DOCUMENT",
      dataObj: {
        material: m,
        school: schoolProfile,
        teacher: teacherProfile,
        subject: subjects.find((s) => s.id === m.subjectId),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Bahan Ajar & Handout Materi
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kumpulan rangkuman materi ringkas, modul digital, infografis, dan referensi bacaan peserta didik.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Bahan Ajar
        </button>
      </div>

      {/* Grid of Materials */}
      {(!teachingMaterials || teachingMaterials.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <BookMarked className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada Bahan Ajar</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            Klik tombol "Tambah Bahan Ajar" di atas untuk menambahkan handout atau rangkuman materi pembelajaran baru.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachingMaterials.map((m) => {
            const sbj = subjects.find((s) => s.id === m.subjectId);
            return (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {m.type || "Ringkasan Materi"}
                    </span>
                    <span className="text-[10px] text-slate-400">{m.phase || "Fase E"}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{m.title}</h3>
                    <p className="text-xs text-slate-500">{m.topic || "-"} • {sbj?.name || "Semua Mapel"}</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:bg-slate-850 dark:text-slate-300 line-clamp-4">
                    {m.content || m.summary || m.fullContent || "Rincian bahan ajar..."}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    onClick={() => handlePrint(m)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Cetak Handout
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus bahan ajar ${m.title}?`)) deleteTeachingMaterial(m.id);
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

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingMaterial ? "Edit Bahan Ajar" : "Tambah Bahan Ajar Baru"}
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
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Judul Bahan Ajar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rangkuman Logika Boolean & Gerbang Logika"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Bentuk Bahan Ajar
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Ringkasan Materi">Ringkasan Materi</option>
                    <option value="Handout">Handout</option>
                    <option value="Modul Digital">Modul Digital</option>
                    <option value="Infografis">Infografis Ringkas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Topik / Bab
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sistem Komputer"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Uraian Isi Bahan Ajar *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Ketik rangkuman poin-poin materi pembelajaran di sini..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Sumber Referensi / Link Modul
                </label>
                <input
                  type="text"
                  placeholder="Contoh: https://drive.google.com/... atau Buku Siswa Hal. 45"
                  value={formData.source || ""}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
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
                  Simpan Bahan Ajar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
