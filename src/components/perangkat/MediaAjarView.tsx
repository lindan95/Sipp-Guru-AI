import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { TeachingMedia } from "../../types";
import {
  Presentation,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink,
  Video,
  FileCode,
  Layers,
} from "lucide-react";

export const MediaAjarView: React.FC = () => {
  const { teachingMedia, saveTeachingMedia, deleteTeachingMedia, subjects, classes } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<TeachingMedia | null>(null);

  const [formData, setFormData] = useState<TeachingMedia>({
    id: "",
    title: "",
    subjectId: subjects[0]?.id || "sbj-inf",
    type: "Slide Presentasi",
    url: "https://canva.com/...",
    description: "Slide presentasi interaktif dengan animasi visual konsep.",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingMedia(null);
    setFormData({
      id: "med-" + Date.now(),
      title: "Media Ajar: Presentasi Konsep",
      subjectId: subjects[0]?.id || "sbj-inf",
      type: "Slide Presentasi",
      url: "https://canva.com/...",
      description: "Slide presentasi materi pembelajaran.",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (med: TeachingMedia) => {
    setEditingMedia(med);
    setFormData({ ...med });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTeachingMedia(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Media Pembelajaran & Sumber Digital
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Koleksi slide PPT/Canva, video interaktif YouTube, kuis Quizizz/Kahoot, dan simulasi lab virtual.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Media
        </button>
      </div>

      {/* Grid of Media */}
      {(!teachingMedia || teachingMedia.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Presentation className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada Media Pembelajaran</h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            Klik tombol "Tambah Media" di atas untuk menambahkan tautan materi Canva, slide PPT, video YouTube, atau simulasi game interaktif.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teachingMedia.map((med) => {
            const sbj = subjects.find((s) => s.id === med.subjectId);
            const mediaType = med.type || med.mediaType || "Slide Presentasi";
            const mediaUrl = med.url || med.urlOrFile || "";
            return (
              <div
                key={med.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                        mediaType.includes("Video")
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : mediaType.includes("Kuis") || mediaType.includes("Game")
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {mediaType}
                    </span>
                    <span className="text-[10px] text-slate-400">{sbj?.name || "Semua Mapel"}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{med.title}</h3>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{med.description || "-"}</p>
                  </div>

                  {mediaUrl && (
                    <a
                      href={mediaUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline dark:text-blue-400 truncate max-w-full"
                    >
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{mediaUrl}</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenEdit(med)}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus media ${med.title}?`)) deleteTeachingMedia(med.id);
                    }}
                    className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingMedia ? "Edit Media Pembelajaran" : "Tambah Media Baru"}
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
                  Judul Media Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Canva Slide Presentasi Logika Gerbang"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Jenis Media
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="Slide Presentasi">Slide Presentasi (PPT / Canva)</option>
                  <option value="Video Pembelajaran">Video Pembelajaran (YouTube / MP4)</option>
                  <option value="Kuis Interaktif">Kuis Interaktif (Quizizz / Wordwall)</option>
                  <option value="Simulasi Virtual">Simulasi Virtual / Web App</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Tautan / URL Media
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Keterangan Singkat
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
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
                  Simpan Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
