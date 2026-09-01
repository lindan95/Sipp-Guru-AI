import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { DiagnosticAssessment } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  BrainCircuit,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Filter,
  Users,
  CheckCircle2,
  Printer,
  Sparkles,
} from "lucide-react";

export const AsesmenDiagnostikView: React.FC = () => {
  const {
    diagnosticList,
    saveDiagnostic,
    deleteDiagnostic,
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
  const [editingDiag, setEditingDiag] = useState<DiagnosticAssessment | null>(null);

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

  const [formData, setFormData] = useState<DiagnosticAssessment>({
    id: "",
    studentId: currentStudents[0]?.id || "",
    classId: selectedClassId,
    learningStyle: "Visual",
    readinessLevel: "Siap",
    interest: "Teknologi & Desain",
    cognitiveScore: 80,
    notes: "Mampu berpikir logis dan suka visualisasi diagram.",
    date: new Date().toISOString().split("T")[0],
  });

  const handleOpenAdd = (stdId?: string) => {
    setEditingDiag(null);
    setFormData({
      id: "diag-" + Date.now(),
      studentId: stdId || currentStudents[0]?.id || "",
      classId: selectedClassId,
      learningStyle: "Visual",
      readinessLevel: "Siap",
      interest: "Sains & Teknologi",
      cognitiveScore: 75,
      notes: "Kesiapan belajar baik, responsif terhadap stimulus.",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: DiagnosticAssessment) => {
    setEditingDiag(d);
    setFormData({ ...d });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDiagnostic(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Laporan Asesmen Diagnostik Awal Pembelajaran",
      docType: "DIAGNOSTIK_DOCUMENT",
      dataObj: {
        diagnostics: diagnosticList.filter((d) => d.classId === selectedClassId),
        students: currentStudents,
        classInfo: classes.find((c) => c.id === selectedClassId),
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  // Stats calculation
  const classDiagnostics = diagnosticList.filter((d) => d.classId === selectedClassId);
  const visualCount = classDiagnostics.filter((d) => d.learningStyle === "Visual").length;
  const auditoryCount = classDiagnostics.filter((d) => d.learningStyle === "Auditori").length;
  const kinestheticCount = classDiagnostics.filter((d) => d.learningStyle === "Kinestetik").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Asesmen Diagnostik (Kognitif & Non-Kognitif)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pemetaan gaya belajar (VAK), minat bakat, dan tingkat kesiapan awal siswa sebagai dasar diferensiasi pembelajaran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Pemetaan
          </button>
          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Input Diagnostik Siswa
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">Gaya Belajar Visual:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {visualCount}
            </span>
            <span className="text-xs text-slate-400">Siswa ({classDiagnostics.length > 0 ? Math.round((visualCount/classDiagnostics.length)*100) : 0}%)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">Gaya Belajar Auditori:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {auditoryCount}
            </span>
            <span className="text-xs text-slate-400">Siswa ({classDiagnostics.length > 0 ? Math.round((auditoryCount/classDiagnostics.length)*100) : 0}%)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">Gaya Belajar Kinestetik:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {kinestheticCount}
            </span>
            <span className="text-xs text-slate-400">Siswa ({classDiagnostics.length > 0 ? Math.round((kinestheticCount/classDiagnostics.length)*100) : 0}%)</span>
          </div>
        </div>
      </div>

      {/* Table Data Diagnostik */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Gaya Belajar (Non-Kognitif)</th>
                <th className="px-4 py-3">Kesiapan Awal</th>
                <th className="px-4 py-3">Minat Belajar</th>
                <th className="px-4 py-3 text-center">Skor Kognitif Awal</th>
                <th className="px-4 py-3">Catatan / Rekomendasi Diferensiasi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentStudents.map((std, idx) => {
                const diag = diagnosticList.find((d) => d.studentId === std.id);
                return (
                  <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {std.name}
                    </td>
                    <td className="px-4 py-3">
                      {diag ? (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            diag.learningStyle === "Visual"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                              : diag.learningStyle === "Auditori"
                              ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                          }`}
                        >
                          {diag.learningStyle}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Belum Diases</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {diag ? (
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {diag.readinessLevel}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">{diag?.interest || "-"}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600">
                      {diag?.cognitiveScore ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                      {diag?.notes || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {diag ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(diag)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Hapus data diagnostik siswa?")) deleteDiagnostic(diag.id);
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
                          + Input
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
                {editingDiag ? "Edit Hasil Diagnostik" : "Input Asesmen Diagnostik Siswa"}
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
                      {s.name} ({s.nis || "NIS"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Gaya Belajar Dominan
                  </label>
                  <select
                    value={formData.learningStyle}
                    onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Visual">Visual (Gambar/Grafis)</option>
                    <option value="Auditori">Auditori (Suara/Penjelasan)</option>
                    <option value="Kinestetik">Kinestetik (Praktik/Gerak)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Tingkat Kesiapan Awal
                  </label>
                  <select
                    value={formData.readinessLevel}
                    onChange={(e) => setFormData({ ...formData, readinessLevel: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Paham Sebagian">Paham Sebagian (Perlu Bimbingan)</option>
                    <option value="Siap">Siap (Pemahaman Standar)</option>
                    <option value="Mahir">Mahir (Siap Pengayaan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Minat / Hobi Siswa
                  </label>
                  <input
                    type="text"
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    placeholder="Contoh: Robotik, Musik, Olahraga"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Skor Tes Kognitif Awal (0-100)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.cognitiveScore || 0}
                    onChange={(e) => setFormData({ ...formData, cognitiveScore: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Rekomendasi Diferensiasi Pembelajaran
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Contoh: Berikan bahan ajar infografis bergambar dan scaffolding bertahap..."
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
                  Simpan Diagnostik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
