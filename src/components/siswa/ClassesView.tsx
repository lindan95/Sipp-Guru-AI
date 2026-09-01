import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ClassRoom } from "../../types";
import { GraduationCap, Plus, Edit2, Trash2, Users, Search, Save, X } from "lucide-react";

export const ClassesView: React.FC = () => {
  const { classes, saveClass, deleteClass, students, setActiveMenu } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState<ClassRoom>({
    id: "",
    name: "",
    gradeLevel: "10",
    phase: "Fase E",
    academicYear: "2024/2025",
    homeroomTeacher: "",
    totalStudents: 0,
  });

  const handleOpenAdd = () => {
    setEditingClass(null);
    setFormData({
      id: "cls-" + Date.now(),
      name: "",
      gradeLevel: "10",
      phase: "Fase E",
      academicYear: "2024/2025",
      homeroomTeacher: "",
      totalStudents: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: ClassRoom) => {
    setEditingClass(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Count real students attached
    const realCount = students.filter((s) => s.classId === formData.id).length;
    saveClass({ ...formData, totalStudents: realCount || formData.totalStudents });
    setIsModalOpen(false);
  };

  const filteredClasses = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.homeroomTeacher?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Manajemen Data Kelas / Rombel
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar rombongan belajar yang diampu untuk penetapan jadwal, modul ajar, dan administrasi nilai.
          </p>
        </div>
        <button
          id="btn-add-class"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah Kelas Baru
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kelas atau wali kelas..."
            className="w-full text-xs text-slate-800 focus:outline-none dark:text-slate-200 dark:bg-transparent"
          />
        </div>
        <span className="text-xs text-slate-400">{filteredClasses.length} Kelas Terdaftar</span>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClasses.map((cls) => {
          const studentCount = students.filter((s) => s.classId === cls.id).length;
          return (
            <div
              key={cls.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {cls.phase}
                  </span>
                  <span className="text-xs text-slate-400">Tingkat {cls.gradeLevel}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{cls.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Wali Kelas: {cls.homeroomTeacher || "-"}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span>
                    <strong>{studentCount}</strong> Siswa Terdaftar
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  onClick={() => setActiveMenu("siswa")}
                  className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                >
                  Kelola Siswa &rarr;
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Kelas"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus kelas ${cls.name}? Data siswa terkait akan tetap ada.`)) {
                        deleteClass(cls.id);
                      }
                    }}
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Hapus Kelas"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingClass ? "Edit Data Kelas" : "Tambah Kelas Baru"}
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
                  Nama Kelas / Rombel *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: X-A atau XI IPA 1"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tingkat
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="1">Kelas 1 (Fase A)</option>
                    <option value="2">Kelas 2 (Fase A)</option>
                    <option value="3">Kelas 3 (Fase B)</option>
                    <option value="4">Kelas 4 (Fase B)</option>
                    <option value="5">Kelas 5 (Fase C)</option>
                    <option value="6">Kelas 6 (Fase C)</option>
                    <option value="7">Kelas 7 (Fase D)</option>
                    <option value="8">Kelas 8 (Fase D)</option>
                    <option value="9">Kelas 9 (Fase D)</option>
                    <option value="10">Kelas 10 (Fase E)</option>
                    <option value="11">Kelas 11 (Fase F)</option>
                    <option value="12">Kelas 12 (Fase F)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Fase Kurikulum Merdeka
                  </label>
                  <select
                    value={formData.phase}
                    onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Fase A">Fase A (SD Kelas 1-2)</option>
                    <option value="Fase B">Fase B (SD Kelas 3-4)</option>
                    <option value="Fase C">Fase C (SD Kelas 5-6)</option>
                    <option value="Fase D">Fase D (SMP Kelas 7-9)</option>
                    <option value="Fase E">Fase E (SMA Kelas 10)</option>
                    <option value="Fase F">Fase F (SMA Kelas 11-12)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Nama Wali Kelas
                </label>
                <input
                  type="text"
                  placeholder="Nama Wali Kelas beserta Gelar"
                  value={formData.homeroomTeacher || ""}
                  onChange={(e) => setFormData({ ...formData, homeroomTeacher: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
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
