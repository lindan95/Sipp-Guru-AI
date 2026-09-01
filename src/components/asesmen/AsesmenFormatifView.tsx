import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { FormativeAssessment } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  Sparkle,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Filter,
  Users,
  CheckCircle,
  Printer,
} from "lucide-react";

export const AsesmenFormatifView: React.FC = () => {
  const {
    formativeList,
    saveFormative,
    deleteFormative,
    classes,
    students,
    subjects,
    activeClassId,
    setActiveClassId,
    activeSubjectId,
    setActiveSubjectId,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassId || classes[0]?.id || "cls-10a");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(activeSubjectId || subjects[0]?.id || "sbj-inf");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormative, setEditingFormative] = useState<FormativeAssessment | null>(null);

  useEffect(() => {
    if (activeClassId && activeClassId !== "all") {
      setSelectedClassId(activeClassId);
    }
  }, [activeClassId]);

  useEffect(() => {
    if (activeSubjectId && activeSubjectId !== "all") {
      setSelectedSubjectId(activeSubjectId);
    }
  }, [activeSubjectId]);

  const currentStudents = students.filter((s) => s.classId === selectedClassId);

  const [formData, setFormData] = useState<FormativeAssessment>({
    id: "",
    studentId: currentStudents[0]?.id || "",
    classId: selectedClassId,
    subjectId: selectedSubjectId,
    learningObjective: "Memahami struktur data array & antrean",
    activity: "Diskusi LKPD & Simulasi Praktik",
    masteryLevel: "Tuntas",
    feedback: "Sangat aktif dalam pemecahan masalah algoritma.",
    score: 85,
    date: new Date().toISOString().split("T")[0],
  });

  const handleOpenAdd = (stdId?: string) => {
    setEditingFormative(null);
    setFormData({
      id: "fmt-" + Date.now(),
      studentId: stdId || currentStudents[0]?.id || "",
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      learningObjective: "Tujuan Pembelajaran Pertemuan Ini",
      activity: "Observasi Diskusi / Kuis Singkat",
      masteryLevel: "Tuntas",
      feedback: "Catatan umpan balik konstruktif...",
      score: 80,
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: FormativeAssessment) => {
    setEditingFormative(f);
    setFormData({ ...f });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveFormative(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Jurnal & Rekap Asesmen Formatif Harian",
      docType: "FORMATIF_DOCUMENT",
      dataObj: {
        formatives: formativeList.filter((f) => f.classId === selectedClassId),
        students: currentStudents,
        classInfo: classes.find((c) => c.id === selectedClassId),
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
            Asesmen Formatif & Umpan Balik Harian
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pencatatan observasi proses belajar, kuis apersepsi, unjuk kerja LKPD, dan umpan balik langsung per pertemuan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Rekap Formatif
          </button>
          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Input Formatif Siswa
          </button>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedClassId={selectedClassId}
        onClassChange={(id) => {
          setSelectedClassId(id);
          if (id !== "all") setActiveClassId(id);
        }}
        selectedSubjectId={selectedSubjectId}
        onSubjectChange={(id) => {
          setSelectedSubjectId(id);
          if (id !== "all") setActiveSubjectId(id);
        }}
        showAllOption={false}
      />

      {/* Table Data Formatif */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Aktivitas / Instrumen</th>
                <th className="px-4 py-3">Tujuan Pembelajaran</th>
                <th className="px-4 py-3 text-center">Tingkat Capaian</th>
                <th className="px-4 py-3 text-center">Skor</th>
                <th className="px-4 py-3">Umpan Balik Guru</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentStudents.map((std, idx) => {
                const form = formativeList.find(
                  (f) => f.studentId === std.id && f.classId === selectedClassId
                );
                return (
                  <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{std.name}</td>
                    <td className="px-4 py-3">{form?.activity || "-"}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{form?.learningObjective || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      {form ? (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            form.masteryLevel === "Tuntas"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          }`}
                        >
                          {form.masteryLevel}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Belum Dicatat</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600">{form?.score ?? "-"}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{form?.feedback || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      {form ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(form)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Hapus catatan formatif siswa?")) deleteFormative(form.id);
                            }}
                            className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAdd(std.id)}
                          className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                        >
                          + Catat
                        </button>
                      )}
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
                {editingFormative ? "Edit Catatan Formatif" : "Input Asesmen Formatif Siswa"}
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
                  Peserta Didik *
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {currentStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Aktivitas Pembelajaran / Bentuk Instrumen
                </label>
                <input
                  type="text"
                  required
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                  placeholder="Contoh: Diskusi LKPD 01 / Kuis Apersepsi Kahoot"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Tujuan Pembelajaran Terkait
                </label>
                <input
                  type="text"
                  required
                  value={formData.learningObjective}
                  onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Status Ketuntasan
                  </label>
                  <select
                    value={formData.masteryLevel}
                    onChange={(e) => setFormData({ ...formData, masteryLevel: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Tuntas">Tuntas / Memenuhi Kriteria</option>
                    <option value="Belum Tuntas">Belum Tuntas (Perlu Bimbingan)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Nilai / Skor (0-100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.score || 0}
                    onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Umpan Balik Guru (Feedback)
                </label>
                <textarea
                  rows={3}
                  value={formData.feedback}
                  onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                  placeholder="Catatan apresiasi atau arahan perbaikan belajar siswa..."
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
                  Simpan Formatif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
