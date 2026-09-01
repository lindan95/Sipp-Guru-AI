import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { TeachingJournalItem } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  Calendar,
  Sparkles,
} from "lucide-react";

export const JurnalMengajarView: React.FC = () => {
  const {
    journalList,
    saveJournal,
    deleteJournal,
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

  const [filterClassId, setFilterClassId] = useState<string>(activeClassId || "all");
  const [filterSubjectId, setFilterSubjectId] = useState<string>(activeSubjectId || "all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<TeachingJournalItem | null>(null);

  const filteredJournals = (journalList || []).filter((jrn) => {
    const matchClass = filterClassId === "all" || jrn.classId === filterClassId;
    const matchSubject = filterSubjectId === "all" || jrn.subjectId === filterSubjectId;
    return matchClass && matchSubject;
  });

  const [formData, setFormData] = useState<TeachingJournalItem>({
    id: "",
    date: new Date().toISOString().split("T")[0],
    classId: filterClassId !== "all" ? filterClassId : (classes[0]?.id || "cls-10a"),
    subjectId: filterSubjectId !== "all" ? filterSubjectId : (subjects[0]?.id || "sbj-inf"),
    timeSlot: "07.30 - 09.00 (Jam 1-2)",
    topic: "Algoritma Pemrograman: Percabangan Kondisi IF-ELSE",
    learningObjective: "Siswa mampu mengimplementasikan logika percabangan bercabang dalam bahasa C++.",
    activities: "Apersepsi masalah lampu lalu lintas, penugasan studi kasus LKPD, sesi coding berpasangan, dan presentasi.",
    attendanceSummary: "32 Hadir, 0 Absen",
    classroomNotes: "Siswa sangat antusias saat simulasi flowchart lampu lalu lintas.",
    reflection: "Perlu menambahkan tantangan coding tingkat lanjut bagi 5 siswa yang selesai lebih awal (diferensiasi proses).",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingJournal(null);
    setFormData({
      id: "jrn-" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      classId: filterClassId !== "all" ? filterClassId : (classes[0]?.id || "cls-10a"),
      subjectId: filterSubjectId !== "all" ? filterSubjectId : (subjects[0]?.id || "sbj-inf"),
      timeSlot: "07.30 - 09.00",
      topic: "Materi Pembelajaran Hari Ini",
      learningObjective: "Tujuan pembelajaran pertemuan...",
      activities: "Pendahuluan, Inti Eksplorasi, dan Penutup Refleksi.",
      attendanceSummary: "32 Hadir",
      classroomNotes: "Kondisi kelas kondusif dan interaktif.",
      reflection: "Refleksi pencapaian tujuan pembelajaran hari ini...",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (jrn: TeachingJournalItem) => {
    setEditingJournal(jrn);
    setFormData({ ...jrn });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveJournal(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Jurnal Mengajar & Agenda Pembelajaran Harian Guru",
      docType: "JURNAL_DOCUMENT",
      dataObj: {
        journals: journalList,
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
            Jurnal Mengajar & Catatan Refleksi Guru
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dokumentasi harian pelaksanaan pembelajaran, capaian TP, kejadian penting kelas, dan refleksi pedagogik guru.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Jurnal Mengajar
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tulis Jurnal Baru
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
            Menampilkan <b>{filteredJournals.length}</b> catatan jurnal
          </span>
        }
      />

      {/* Grid of Journal Entries */}
      <div className="space-y-4">
        {filteredJournals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center bg-white dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Belum ada catatan jurnal mengajar untuk filter kelas & mata pelajaran ini.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" /> Tulis Jurnal Baru
            </button>
          </div>
        ) : (
          filteredJournals.map((jrn) => {
          const cls = classes.find((c) => c.id === jrn.classId);
          const sbj = subjects.find((s) => s.id === jrn.subjectId);
          return (
            <div
              key={jrn.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Calendar className="h-3.5 w-3.5" />
                    {jrn.date}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {cls?.name} • {jrn.timeSlot}
                  </span>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {sbj?.name}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(jrn)}
                    className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Hapus catatan jurnal ini?")) deleteJournal(jrn.id);
                    }}
                    className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{jrn.topic}</h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Tujuan Pembelajaran:</strong> {jrn.learningObjective}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-850">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Aktivitas Pembelajaran:</span>
                  <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">{jrn.activities}</p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-850">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Catatan Kejadian Kelas:</span>
                  <p className="mt-1 text-slate-600 dark:text-slate-400 leading-relaxed">{jrn.classroomNotes}</p>
                </div>
              </div>

              {jrn.reflection && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-300">
                  <strong>Refleksi & Rencana Tindak Lanjut Guru:</strong> {jrn.reflection}
                </div>
              )}
            </div>
          );
        }))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingJournal ? "Edit Jurnal Mengajar" : "Tulis Jurnal Mengajar Harian"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Tanggal Mengajar</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Kelas</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">Jam Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    placeholder="07.30 - 09.00"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Materi Pokok / Pokok Bahasan *
                </label>
                <input
                  type="text"
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="Contoh: Logika Algoritma Dasar"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Tujuan Pembelajaran (TP)
                </label>
                <textarea
                  rows={2}
                  value={formData.learningObjective}
                  onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Ringkasan Aktivitas / Pelaksanaan Pembelajaran
                </label>
                <textarea
                  rows={3}
                  value={formData.activities}
                  onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Catatan Kejadian di Kelas
                  </label>
                  <textarea
                    rows={2}
                    value={formData.classroomNotes}
                    onChange={(e) => setFormData({ ...formData, classroomNotes: e.target.value })}
                    placeholder="Kondisi kelas, siswa izin, dll."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Refleksi & Tindak Lanjut Guru
                  </label>
                  <textarea
                    rows={2}
                    value={formData.reflection}
                    onChange={(e) => setFormData({ ...formData, reflection: e.target.value })}
                    placeholder="Evaluasi pembelajaran hari ini..."
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
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
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
