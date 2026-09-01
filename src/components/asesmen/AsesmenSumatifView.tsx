import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { SummativeAssessment } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  Download,
} from "lucide-react";

export const AsesmenSumatifView: React.FC = () => {
  const {
    summativeList,
    saveSummative,
    deleteSummative,
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
    settings,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassId || classes[0]?.id || "cls-10a");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(activeSubjectId || subjects[0]?.id || "sbj-inf");
  const [selectedAssessmentName, setSelectedAssessmentName] = useState<string>("Sumatif LM 1 (Algoritma)");

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSummative, setEditingSummative] = useState<SummativeAssessment | null>(null);

  const currentStudents = students.filter((s) => s.classId === selectedClassId);
  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
  const kktp = activeSubject?.kktpValue || 75;

  const [formData, setFormData] = useState<SummativeAssessment>({
    id: "",
    studentId: currentStudents[0]?.id || "",
    classId: selectedClassId,
    subjectId: selectedSubjectId,
    assessmentName: selectedAssessmentName,
    scopeTopic: "Algoritma & Pemrograman Dasar",
    score: 85,
    remedialScore: undefined,
    finalScore: 85,
    status: "Tuntas",
    date: new Date().toISOString().split("T")[0],
  });

  const handleOpenAdd = (stdId?: string) => {
    setEditingSummative(null);
    setFormData({
      id: "sum-" + Date.now(),
      studentId: stdId || currentStudents[0]?.id || "",
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      assessmentName: selectedAssessmentName,
      scopeTopic: "Materi Lingkup Asesmen",
      score: 80,
      finalScore: 80,
      status: "Tuntas",
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: SummativeAssessment) => {
    setEditingSummative(s);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalVal = formData.remedialScore ? Math.max(formData.score, formData.remedialScore) : formData.score;
    const finalStatus = finalVal >= kktp ? "Tuntas" : "Remedial";
    saveSummative({
      ...formData,
      finalScore: finalVal,
      status: finalStatus,
    });
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: `Daftar Nilai Asesmen Sumatif: ${selectedAssessmentName}`,
      docType: "SUMATIF_DOCUMENT",
      dataObj: {
        summatives: summativeList.filter(
          (s) => s.classId === selectedClassId && s.subjectId === selectedSubjectId
        ),
        students: currentStudents,
        classInfo: classes.find((c) => c.id === selectedClassId),
        subject: activeSubject,
        kktp,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  // Stats calculation
  const filteredSummatives = summativeList.filter(
    (s) =>
      s.classId === selectedClassId &&
      s.subjectId === selectedSubjectId &&
      s.assessmentName === selectedAssessmentName
  );

  const scores = filteredSummatives.map((s) => s.finalScore);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "0";
  const passedCount = filteredSummatives.filter((s) => s.status === "Tuntas").length;
  const remedialCount = filteredSummatives.filter((s) => s.status === "Remedial").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Asesmen Sumatif & Daftar Nilai Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pengelolaan nilai Sumatif Lingkup Materi (SLM), Sumatif Tengah Semester (STS), dan Sumatif Akhir Semester (SAS) disertai status remedial.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Rekap Nilai
          </button>
          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Input Nilai Siswa
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
        extraControls={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Lingkup:</span>
            <select
              value={selectedAssessmentName}
              onChange={(e) => setSelectedAssessmentName(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-750 dark:bg-slate-850 dark:text-slate-200"
            >
              <option value="Sumatif LM 1 (Algoritma)">Sumatif LM 1 (Algoritma)</option>
              <option value="Sumatif LM 2 (Struktur Data)">Sumatif LM 2 (Struktur Data)</option>
              <option value="Sumatif Tengah Semester (STS)">Sumatif Tengah Semester (STS)</option>
              <option value="Sumatif Akhir Semester (SAS)">Sumatif Akhir Semester (SAS)</option>
            </select>
          </div>
        }
      />

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">Nilai Rata-rata Kelas:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {avgScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">KKTP Mata Pelajaran:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {kktp}
            </span>
            <span className="text-xs text-slate-400">Batas Minimal</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">Siswa Tuntas:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {passedCount}
            </span>
            <span className="text-xs text-slate-400">Siswa ({scores.length > 0 ? Math.round((passedCount/scores.length)*100) : 0}%)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500">Perlu Remedial:</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {remedialCount}
            </span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>
      </div>

      {/* Table Data Sumatif */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">NIS</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3 text-center">Nilai Asli</th>
                <th className="px-4 py-3 text-center">Remedial</th>
                <th className="px-4 py-3 text-center">Nilai Akhir</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentStudents.map((std, idx) => {
                const sum = filteredSummatives.find((s) => s.studentId === std.id);
                return (
                  <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{std.nis || "-"}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{std.name}</td>
                    <td className="px-4 py-3 text-center font-semibold">{sum ? sum.score : "-"}</td>
                    <td className="px-4 py-3 text-center text-amber-600 font-semibold">
                      {sum?.remedialScore ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600">
                      {sum ? sum.finalScore : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {sum ? (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            sum.status === "Tuntas"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {sum.status}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Belum Dinilai</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {sum ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(sum)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Hapus data nilai sumatif siswa?")) deleteSummative(sum.id);
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
                          + Nilai
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
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingSummative ? "Edit Nilai Sumatif" : "Input Nilai Sumatif Siswa"}
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
                  Topik / Lingkup Materi
                </label>
                <input
                  type="text"
                  required
                  value={formData.scopeTopic}
                  onChange={(e) => setFormData({ ...formData, scopeTopic: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Nilai Asli (0-100) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Nilai Remedial (Jika Ada)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.remedialScore ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        remedialScore: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="Opsional"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
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
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
