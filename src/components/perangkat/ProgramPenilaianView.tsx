import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AssessmentPlan } from "../../types";
import {
  ClipboardCheck,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  Calendar,
  CheckCircle,
} from "lucide-react";

export const ProgramPenilaianView: React.FC = () => {
  const {
    assessmentPlans,
    saveAssessmentPlan,
    deleteAssessmentPlan,
    subjects,
    classes,
    schoolProfile,
    teacherProfile,
    settings,
    setPreviewDoc,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<AssessmentPlan | null>(null);

  const [formData, setFormData] = useState<AssessmentPlan>({
    id: "",
    subjectId: subjects[0]?.id || "sbj-inf",
    classId: classes[0]?.id || "cls-10a",
    name: "Sumatif Lingkup Materi 01",
    technique: "Tes Tertulis",
    form: "Pilihan Ganda & Uraian Analisis",
    timing: "Pertemuan ke-4 (Bulan Agustus)",
    instrument: "Kisi-kisi soal, naskah soal, rubrik pedoman penskoran",
    kktpValue: 75,
    academicYear: settings.activeAcademicYear,
    semester: settings.activeSemester,
  });

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      id: "plan-" + Date.now(),
      subjectId: subjects[0]?.id || "sbj-inf",
      classId: classes[0]?.id || "cls-10a",
      name: "Sumatif Lingkup Materi Baru",
      technique: "Tes Tertulis",
      form: "Pilihan Ganda & Soal Studi Kasus",
      timing: "Bulan Depan",
      instrument: "Naskah Soal & Rubrik Skor",
      kktpValue: 75,
      academicYear: settings.activeAcademicYear,
      semester: settings.activeSemester,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan: AssessmentPlan) => {
    setEditingPlan(plan);
    setFormData({ ...plan });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAssessmentPlan(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Dokumen Program & Jadwal Penilaian Semester",
      docType: "PROGRAM_PENILAIAN",
      dataObj: {
        plans: assessmentPlans,
        school: schoolProfile,
        teacher: teacherProfile,
        academicYear: settings.activeAcademicYear,
        semester: settings.activeSemester,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Program & Perencanaan Penilaian (Asesmen)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rancangan komprehensif teknik asesmen, bentuk instrumen, waktu pelaksanaan, dan target ketuntasan (KKTP).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Program Penilaian
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Rencana Asesmen
          </button>
        </div>
      </div>

      {/* Table of Assessment Plans */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">Nama Asesmen / Lingkup Materi</th>
                <th className="px-4 py-3">Teknik Penilaian</th>
                <th className="px-4 py-3">Bentuk Instrumen</th>
                <th className="px-4 py-3">Waktu Pelaksanaan</th>
                <th className="px-4 py-3 text-center">Target KKTP</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {assessmentPlans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Belum ada rencana program penilaian. Klik tombol "Tambah Rencana Asesmen" di atas untuk membuat.
                  </td>
                </tr>
              ) : (
                assessmentPlans.map((plan, idx) => (
                  <tr key={plan.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {plan.name || plan.title || `Rencana Penilaian ${idx + 1}`}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {plan.technique || "Tes Tertulis"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{plan.form || "-"}</td>
                    <td className="px-4 py-3 font-medium">{plan.timing || "-"}</td>
                    <td className="px-4 py-3 text-center font-bold text-emerald-600">{plan.kktpValue || 75}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(plan)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus rencana penilaian ${plan.name || plan.title}?`)) deleteAssessmentPlan(plan.id);
                          }}
                          className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                {editingPlan ? "Edit Rencana Asesmen" : "Tambah Rencana Asesmen Baru"}
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
                  Nama Asesmen / Lingkup Materi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Asesmen Sumatif Lingkup Materi 02 - Algoritma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Teknik Penilaian
                  </label>
                  <select
                    value={formData.technique}
                    onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="Tes Tertulis">Tes Tertulis</option>
                    <option value="Tes Lisan">Tes Lisan</option>
                    <option value="Penugasan Proyek">Penugasan Proyek</option>
                    <option value="Kinerja / Performa">Kinerja / Unjuk Kerja</option>
                    <option value="Portofolio">Portofolio Karya</option>
                    <option value="Observasi Sikap">Observasi Profil Pancasila</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Bentuk Instrumen
                  </label>
                  <input
                    type="text"
                    value={formData.form}
                    onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                    placeholder="Contoh: Pilihan Ganda & Esai"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                    placeholder="Contoh: Minggu ke-3 September"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Standar KKTP
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.kktpValue}
                    onChange={(e) => setFormData({ ...formData, kktpValue: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Kelengkapan Instrumen & Pedoman Skor
                </label>
                <input
                  type="text"
                  value={formData.instrument}
                  onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                  placeholder="Kisi-kisi soal, kunci jawaban, rubrik penskoran"
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
                  Simpan Rencana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
