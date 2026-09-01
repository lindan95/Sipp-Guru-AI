import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { SupervisionRecord } from "../../types";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export const SupervisiView: React.FC = () => {
  const {
    supervisionList,
    saveSupervision,
    deleteSupervision,
    schoolProfile,
    teacherProfile,
    setPreviewDoc,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SupervisionRecord | null>(null);

  const [formData, setFormData] = useState<SupervisionRecord>({
    id: "",
    date: new Date().toISOString().split("T")[0],
    supervisorName: schoolProfile.principalName || schoolProfile.headmasterName || "Dr. H. Ahmad Dahlan, M.Pd.",
    supervisorRole: "Kepala Sekolah",
    aspectsObserved: "Perencanaan Pembelajaran (Modul Ajar) & Pelaksanaan Pembelajaran Berdiferensiasi",
    findings: "Modul Ajar sangat lengkap dan mengintegrasikan diferensiasi konten & proses dengan baik.",
    recommendations: "Pertahankan pemanfaatan media interaktif dan optimalkan waktu refleksi penutup.",
    score: 92,
    predicate: "Amat Baik (A)",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: "sup-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      supervisorName: schoolProfile.principalName || schoolProfile.headmasterName || "Kepala Sekolah",
      supervisorRole: "Kepala Sekolah",
      aspectsObserved: "Supervisi Akademik & Administrasi Guru",
      findings: "Kelengkapan administrasi guru dan perangkat ajar tersusun rapi.",
      recommendations: "Tingkatkan inovasi pembelajaran berbasis proyek.",
      score: 90,
      predicate: "Amat Baik (A)",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: SupervisionRecord) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sc = formData.score;
    const pred = sc >= 90 ? "Amat Baik (A)" : sc >= 80 ? "Baik (B)" : sc >= 70 ? "Cukup (C)" : "Perlu Bimbingan (D)";
    saveSupervision({
      ...formData,
      predicate: pred,
    });
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Rekap Hasil Supervisi Akademik & Kinerja Guru",
      docType: "SUPERVISI_DOCUMENT",
      dataObj: {
        supervisions: supervisionList,
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
            Supervisi Akademik & Evaluasi Kinerja
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rekam jejak supervisi perencanaan pembelajaran, observasi kelas oleh Kepala Sekolah / Pengawas Pembina, dan tindak lanjut rekomendasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Laporan Supervisi
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Catatan Supervisi
          </button>
        </div>
      </div>

      {/* Grid of Supervisions */}
      <div className="space-y-4">
        {supervisionList.map((sup) => (
          <div
            key={sup.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Calendar className="h-3.5 w-3.5" />
                  {sup.date}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Supervisor: {sup.supervisorName} ({sup.supervisorRole})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Skor: {sup.score} ({sup.predicate})
                </span>
                <button
                  onClick={() => handleOpenEdit(sup)}
                  className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("Hapus catatan supervisi ini?")) deleteSupervision(sup.id);
                  }}
                  className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="text-xs">
              <strong className="text-slate-800 dark:text-slate-200">Aspek yang Diamati:</strong>
              <p className="mt-0.5 text-slate-600 dark:text-slate-400">{sup.aspectsObserved}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-850">
                <strong className="text-slate-800 dark:text-slate-200">Temuan / Catatan Observasi:</strong>
                <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">{sup.findings}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-850">
                <strong className="text-slate-800 dark:text-slate-200">Rekomendasi & Tindak Lanjut:</strong>
                <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">{sup.recommendations}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingItem ? "Edit Hasil Supervisi" : "Input Catatan Supervisi Guru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Tanggal Supervisi</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Nama Supervisor</label>
                  <input
                    type="text"
                    required
                    value={formData.supervisorName}
                    onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Jabatan Supervisor</label>
                  <select
                    value={formData.supervisorRole}
                    onChange={(e) => setFormData({ ...formData, supervisorRole: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Pengawas Sekolah">Pengawas Sekolah</option>
                    <option value="Guru Senior / Mentor">Guru Senior / Mentor</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Skor Evaluasi (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Aspek / Fokus Pengamatan
                </label>
                <input
                  type="text"
                  required
                  value={formData.aspectsObserved}
                  onChange={(e) => setFormData({ ...formData, aspectsObserved: e.target.value })}
                  placeholder="Contoh: Pembelajaran Berdiferensiasi & Manajemen Kelas"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Temuan & Catatan Khusus
                </label>
                <textarea
                  rows={2}
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  placeholder="Catatan kelebihan dan hal yang perlu ditingkatkan..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Rekomendasi Tindak Lanjut
                </label>
                <textarea
                  rows={2}
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  placeholder="Langkah peningkatan kualitas mengajar..."
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
                  Simpan Supervisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
