import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CaseRecord } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  Calendar,
  CheckCircle,
} from "lucide-react";

export const BukuKasusView: React.FC = () => {
  const {
    caseList,
    saveCaseRecord,
    deleteCaseRecord,
    students,
    classes,
    activeClassId,
    setActiveClassId,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
  } = useApp();

  const [filterClassId, setFilterClassId] = useState<string>(activeClassId || "all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<CaseRecord | null>(null);

  const filteredCases = (caseList || []).filter((cs) => {
    return filterClassId === "all" || cs.classId === filterClassId;
  });

  const [formData, setFormData] = useState<CaseRecord>({
    id: "",
    date: new Date().toISOString().split("T")[0],
    studentId: students[0]?.id || "",
    classId: filterClassId !== "all" ? filterClassId : (classes[0]?.id || "cls-10a"),
    incidentDescription: "Terlambat masuk kelas selama 3 kali berturut-turut pada jam pertama.",
    followUpAction: "Bimbingan pribadi dan koordinasi dengan orang tua via telepon.",
    resultNotes: "Siswa berjanji mengatur waktu istirahat malam lebih awal dan tidak terlambat lagi.",
    status: "Selesai",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingCase(null);
    setFormData({
      id: "case-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      studentId: students[0]?.id || "",
      classId: filterClassId !== "all" ? filterClassId : (classes[0]?.id || "cls-10a"),
      incidentDescription: "Uraian kejadian / pelanggaran / kendala belajar siswa...",
      followUpAction: "Tindakan pembinaan atau konsultasi guru...",
      resultNotes: "Hasil kesepakatan bimbingan...",
      status: "Dalam Proses",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CaseRecord) => {
    setEditingCase(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCaseRecord(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Buku Catatan Kasus & Konseling Siswa",
      docType: "BUKU_KASUS_DOCUMENT",
      dataObj: {
        cases: caseList,
        students,
        classes,
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
            Buku Catatan Kasus & Bimbingan Konseling Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pencatatan rekam jejak perilaku khusus, kendala disiplin, bimbingan konseling pedagogik, dan tindak lanjut komunikasi orang tua.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Buku Kasus
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Catatan Kasus
          </button>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedClassId={filterClassId}
        onClassChange={(id) => setFilterClassId(id)}
        extraControls={
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan <b>{filteredCases.length}</b> catatan kasus
          </span>
        }
      />

      {/* Grid of Cases */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center bg-white dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Belum ada catatan kasus / pembinaan untuk rombel ini.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Catat Kasus Baru
            </button>
          </div>
        ) : (
          filteredCases.map((cs) => {
          const std = students.find((s) => s.id === cs.studentId);
          const cls = classes.find((c) => c.id === cs.classId);
          return (
            <div
              key={cs.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <Calendar className="h-3.5 w-3.5" />
                    {cs.date}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {std?.name || "Nama Siswa"} ({cls?.name})
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      cs.status === "Selesai"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {cs.status}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cs)}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Hapus catatan kasus ini?")) deleteCaseRecord(cs.id);
                    }}
                    className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-800 dark:bg-slate-850 dark:text-slate-200">
                <strong>Deskripsi Permasalahan:</strong>
                <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">{cs.incidentDescription}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <strong className="text-slate-800 dark:text-slate-200">Penanganan / Tindak Lanjut:</strong>
                  <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">{cs.followUpAction}</p>
                </div>

                <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <strong className="text-slate-800 dark:text-slate-200">Hasil & Kesepakatan:</strong>
                  <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">{cs.resultNotes}</p>
                </div>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingCase ? "Edit Catatan Kasus" : "Tambah Catatan Kasus Siswa"}
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
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Tanggal Kejadian</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Peserta Didik *</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => {
                      const std = students.find((s) => s.id === e.target.value);
                      setFormData({
                        ...formData,
                        studentId: e.target.value,
                        classId: std?.classId || formData.classId,
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Deskripsi Masalah / Kejadian *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.incidentDescription}
                  onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
                  placeholder="Uraikan fakta kejadian secara objektif..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Tindakan Pembinaan & Penanganan
                </label>
                <textarea
                  rows={2}
                  value={formData.followUpAction}
                  onChange={(e) => setFormData({ ...formData, followUpAction: e.target.value })}
                  placeholder="Konsultasi tatap muka, pemanggilan orang tua..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Hasil & Solusi
                  </label>
                  <input
                    type="text"
                    value={formData.resultNotes}
                    onChange={(e) => setFormData({ ...formData, resultNotes: e.target.value })}
                    placeholder="Siswa sepakat memperbaiki..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Status Kasus
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Dalam Proses">Dalam Proses Bimbingan</option>
                    <option value="Selesai">Selesai (Tuntas)</option>
                  </select>
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
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
