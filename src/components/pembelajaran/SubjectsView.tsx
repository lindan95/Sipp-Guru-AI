import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Subject } from "../../types";
import { BookOpen, Plus, Edit2, Trash2, Save, X, Target } from "lucide-react";

export const SubjectsView: React.FC = () => {
  const { subjects, saveSubject, deleteSubject } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [formData, setFormData] = useState<Subject>({
    id: "",
    name: "",
    code: "",
    phase: "Fase E",
    gradeLevel: "10",
    hoursPerWeek: 2,
    kktpStandard: 75,
  });

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({
      id: "sbj-" + Date.now(),
      name: "",
      code: "",
      phase: "Fase E",
      gradeLevel: "10",
      hoursPerWeek: 2,
      kktpStandard: 75,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sbj: Subject) => {
    setEditingSubject(sbj);
    setFormData({ ...sbj });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSubject(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Mata Pelajaran & Alokasi Beban JP
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar mata pelajaran yang diampu beserta alokasi Jam Pelajaran (JP) per minggu dan standar ketuntasan KKTP.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Mata Pelajaran
        </button>
      </div>

      {/* Grid Cards Mapel */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {subjects.map((sbj) => (
          <div
            key={sbj.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {sbj.code || "MAPEL"}
                </span>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {sbj.phase}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{sbj.name}</h3>
                <p className="text-xs text-slate-500">Tingkat Kelas: {sbj.gradeLevel}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-400">Beban Belajar:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {sbj.hoursPerWeek} JP / Minggu
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Standar KKTP:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{sbj.kktpStandard || 75}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-1 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                onClick={() => handleOpenEdit(sbj)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Edit Mapel"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Hapus mata pelajaran ${sbj.name}?`)) {
                    deleteSubject(sbj.id);
                  }
                }}
                className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                title="Hapus Mapel"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingSubject ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nama Mata Pelajaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Informatika"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kode Singkat
                  </label>
                  <input
                    type="text"
                    placeholder="INF-10"
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Fase
                  </label>
                  <select
                    value={formData.phase}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Fase A">Fase A</option>
                    <option value="Fase B">Fase B</option>
                    <option value="Fase C">Fase C</option>
                    <option value="Fase D">Fase D</option>
                    <option value="Fase E">Fase E</option>
                    <option value="Fase F">Fase F</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Alokasi JP / Minggu *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    required
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Standar KKTP (Nilai)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.kktpStandard || 75}
                    onChange={(e) => setFormData({ ...formData, kktpStandard: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
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
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
