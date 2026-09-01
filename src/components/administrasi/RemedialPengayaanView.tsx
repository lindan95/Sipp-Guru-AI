import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { RemedialEnrichmentItem } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  TrendingUp,
  Award,
} from "lucide-react";

export const RemedialPengayaanView: React.FC = () => {
  const {
    remedialList,
    saveRemedial,
    deleteRemedial,
    students,
    classes,
    subjects,
    activeClassId,
    setActiveClassId,
    activeSubjectId,
    setActiveSubjectId,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"Remedial" | "Pengayaan">("Remedial");
  const [filterClassId, setFilterClassId] = useState<string>(activeClassId || "all");
  const [filterSubjectId, setFilterSubjectId] = useState<string>(activeSubjectId || "all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RemedialEnrichmentItem | null>(null);

  const currentList = (remedialList || []).filter((r) => {
    const matchType = r.type === activeTab;
    const matchClass = filterClassId === "all" || r.classId === filterClassId;
    const matchSubject = filterSubjectId === "all" || r.subjectId === filterSubjectId;
    return matchType && matchClass && matchSubject;
  });

  const [formData, setFormData] = useState<RemedialEnrichmentItem>({
    id: "",
    type: activeTab,
    studentId: students[0]?.id || "",
    classId: filterClassId !== "all" ? filterClassId : (classes[0]?.id || "cls-10a"),
    subjectId: filterSubjectId !== "all" ? filterSubjectId : (subjects[0]?.id || "sbj-inf"),
    topic: "Algoritma Pemrograman",
    initialScore: 60,
    activityForm: "Bimbingan perorangan dan penugasan latihan bertahap",
    finalScore: 80,
    status: "Tuntas",
    date: new Date().toISOString().split("T")[0],
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: "rem-" + Date.now(),
      type: activeTab,
      studentId: students[0]?.id || "",
      classId: filterClassId !== "all" ? filterClassId : (classes[0]?.id || "cls-10a"),
      subjectId: filterSubjectId !== "all" ? filterSubjectId : (subjects[0]?.id || "sbj-inf"),
      topic: "Materi Pembelajaran",
      initialScore: activeTab === "Remedial" ? 65 : 88,
      activityForm:
        activeTab === "Remedial"
          ? "Pembelajaran ulang dengan tutor sebaya"
          : "Pembuatan proyek studi kasus kompleks mandiri",
      finalScore: activeTab === "Remedial" ? 80 : 95,
      status: "Tuntas",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: RemedialEnrichmentItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveRemedial(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: `Program & Laporan Pelaksanaan ${activeTab} Siswa`,
      docType: "REMEDIAL_DOCUMENT",
      dataObj: {
        type: activeTab,
        items: currentList,
        students,
        classes,
        subjects,
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
            Program Remedial & Pengayaan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pendampingan belajar tuntas bagi siswa yang belum mencapai KKTP dan pemberian materi tantangan (enrichment) bagi siswa mahir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Laporan {activeTab}
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Data {activeTab}
          </button>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedClassId={filterClassId}
        onClassChange={(id) => setFilterClassId(id)}
        selectedSubjectId={filterSubjectId}
        onSubjectChange={(id) => setFilterSubjectId(id)}
        extraControls={
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan <b>{currentList.length}</b> siswa
          </span>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("Remedial")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "Remedial"
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Program Remedial (Perbaikan)
        </button>

        <button
          onClick={() => setActiveTab("Pengayaan")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "Pengayaan"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Award className="h-4 w-4" />
          Program Pengayaan (Tantangan Mahir)
        </button>
      </div>

      {/* Table of Items */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Materi Pokok</th>
                <th className="px-4 py-3 text-center">Nilai Awal</th>
                <th className="px-4 py-3">Bentuk Kegiatan</th>
                <th className="px-4 py-3 text-center">Nilai Akhir</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentList.map((item, idx) => {
                const std = students.find((s) => s.id === item.studentId);
                const cls = classes.find((c) => c.id === item.classId);
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {std?.name} <span className="text-[11px] font-normal text-slate-400">({cls?.name})</span>
                    </td>
                    <td className="px-4 py-3">{item.topic}</td>
                    <td className="px-4 py-3 text-center font-semibold text-rose-600">{item.initialScore}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{item.activityForm}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-600">{item.finalScore}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {item.status}
                      </span>
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
                            if (confirm("Hapus data ini?")) deleteRemedial(item.id);
                          }}
                          className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                {editingItem ? `Edit Data ${activeTab}` : `Input Data ${activeTab}`}
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

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Mata Pelajaran</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Materi Pokok / KD / TP
                </label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Nilai Awal
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.initialScore}
                    onChange={(e) => setFormData({ ...formData, initialScore: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Nilai Akhir
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.finalScore}
                    onChange={(e) => setFormData({ ...formData, finalScore: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Bentuk Kegiatan & Penugasan
                </label>
                <textarea
                  rows={2}
                  value={formData.activityForm}
                  onChange={(e) => setFormData({ ...formData, activityForm: e.target.value })}
                  placeholder="Bimbingan khusus, tutor sebaya, latihan soal bertingkat..."
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
