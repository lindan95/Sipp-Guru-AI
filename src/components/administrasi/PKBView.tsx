import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { PKBRecord } from "../../types";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  ExternalLink,
  Award,
  Calendar,
} from "lucide-react";

export const PKBView: React.FC = () => {
  const { pkbList, savePKB, deletePKB, schoolProfile, teacherProfile, setPreviewDoc } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PKBRecord | null>(null);

  const [formData, setFormData] = useState<PKBRecord>({
    id: "",
    activityName: "Pelatihan Mandiri PMM: Merancang Pembelajaran Berdiferensiasi",
    organizer: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (PMM)",
    role: "Peserta",
    durationHours: 32,
    startDate: "2024-07-10",
    endDate: "2024-07-25",
    certificateNumber: "PMM-DIF-2024-88912",
    certificateUrl: "",
    impactSummary: "Menguasai teknik pemetaan kebutuhan belajar dan asesmen awal siswa.",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: "pkb-" + Date.now(),
      activityName: "Webinar / Pelatihan / Workshop Guru",
      organizer: "Platform Merdeka Mengajar (PMM) / MGMP",
      role: "Peserta",
      durationHours: 32,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      certificateNumber: "NOMOR-SERTIFIKAT",
      certificateUrl: "",
      impactSummary: "Peningkatan kompetensi pedagogik dan profesional...",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PKBRecord) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    savePKB(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Rekap Portofolio Pengembangan Keprofesian Berkelanjutan (PKB)",
      docType: "PKB_DOCUMENT",
      dataObj: {
        pkbList,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  const totalJP = pkbList.reduce((acc, curr) => acc + (curr.durationHours || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Pengembangan Keprofesian Berkelanjutan (PKB)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Portofolio sertifikasi, pelatihan mandiri PMM, workshop MGMP, webinar nasional, dan karya inovasi guru.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Rekap PKB
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Riwayat Pelatihan
          </button>
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">Total Kegiatan Diikuti:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {pkbList.length}
            </span>
            <span className="text-xs text-slate-400">Pelatihan / Webinar</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">Total Akumulasi Jam Pelatihan:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {totalJP}
            </span>
            <span className="text-xs text-slate-400">Jam Pelajaran (JP)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">Sertifikat Resmi PMM / Kemdikbud:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {pkbList.filter((p) => p.certificateNumber).length}
            </span>
            <span className="text-xs text-slate-400">Dokumen Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Table PKB */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">Nama Kegiatan Pengembangan Diri</th>
                <th className="px-4 py-3">Penyelenggara</th>
                <th className="px-4 py-3 text-center">Peran & Durasi</th>
                <th className="px-4 py-3">Waktu Pelaksanaan</th>
                <th className="px-4 py-3">No. Sertifikat</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {pkbList.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                  <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                    {item.activityName}
                  </td>
                  <td className="px-4 py-3">{item.organizer}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {item.role} ({item.durationHours} JP)
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {item.startDate} s/d {item.endDate}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                    {item.certificateNumber || "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus kegiatan ${item.activityName}?`)) deletePKB(item.id);
                        }}
                        className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
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

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingItem ? "Edit Riwayat PKB" : "Tambah Riwayat Pelatihan Guru"}
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
                  Nama Kegiatan / Topik Pelatihan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.activityName}
                  onChange={(e) => setFormData({ ...formData, activityName: e.target.value })}
                  placeholder="Contoh: Bimbingan Teknis Kurikulum Merdeka Berbasis AI"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Penyelenggara Kegiatan
                </label>
                <input
                  type="text"
                  required
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="Contoh: BBGP Jawa Barat / Ditjen GTK Kemdikbud"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Peran Guru</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Peserta">Peserta</option>
                    <option value="Narasumber">Narasumber / Pemateri</option>
                    <option value="Fasilitator">Fasilitator / Mentor</option>
                    <option value="Panitia">Panitia</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Durasi (JP)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Tanggal Mulai</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Tanggal Selesai</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Nomor Sertifikat (Jika Ada)
                </label>
                <input
                  type="text"
                  value={formData.certificateNumber || ""}
                  onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                  placeholder="Contoh: 0451/B2/GTK.02.00/2024"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Dampak bagi Peningkatan Mutu Pembelajaran
                </label>
                <textarea
                  rows={2}
                  value={formData.impactSummary}
                  onChange={(e) => setFormData({ ...formData, impactSummary: e.target.value })}
                  placeholder="Ringkasan kompetensi baru yang diterapkan di kelas..."
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
                  Simpan Riwayat PKB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
