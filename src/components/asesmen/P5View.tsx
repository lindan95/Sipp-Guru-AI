import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { P5Assessment } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Printer,
  Sparkles,
  Award,
} from "lucide-react";

export const P5View: React.FC = () => {
  const {
    p5List,
    saveP5,
    deleteP5,
    classes,
    students,
    activeClassId,
    setActiveClassId,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassId || classes[0]?.id || "cls-10a");
  const [selectedDimension, setSelectedDimension] = useState<string>("Bernalar Kritis");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingP5, setEditingP5] = useState<P5Assessment | null>(null);

  useEffect(() => {
    if (activeClassId && activeClassId !== "all") {
      setSelectedClassId(activeClassId);
    }
  }, [activeClassId]);

  const currentStudents = students.filter((s) => s.classId === selectedClassId);

  const dimensions = [
    "Beriman, Bertakwa kepada Tuhan YME, & Berakhlak Mulia",
    "Berkebhinekaan Global",
    "Bergotong Royong",
    "Mandiri",
    "Bernalar Kritis",
    "Kreatif",
  ];

  const [formData, setFormData] = useState<P5Assessment>({
    id: "",
    studentId: currentStudents[0]?.id || "",
    classId: selectedClassId,
    theme: "Rekayasa dan Teknologi",
    projectName: "Pengembangan Solusi Otomasi Sekolah",
    dimension: selectedDimension,
    element: "Memperoleh dan memproses informasi dan gagasan",
    scoreScale: "BSH",
    description: "Mampu menganalisis masalah kontekstual dan menyusun solusi komputasional secara terstruktur.",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = (stdId?: string) => {
    setEditingP5(null);
    setFormData({
      id: "p5-" + Date.now(),
      studentId: stdId || currentStudents[0]?.id || "",
      classId: selectedClassId,
      theme: "Kearifan Lokal / Rekayasa Teknologi",
      projectName: "Projek Penguatan Profil Pelajar Pancasila",
      dimension: selectedDimension,
      element: "Elemen Karakter Profil Pancasila",
      scoreScale: "BSH",
      description: "Menunjukkan perkembangan sesuai harapan dalam kolaborasi dan pemecahan masalah.",
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: P5Assessment) => {
    setEditingP5(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveP5(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Lembar Rekap Penilaian Projek Penguatan Profil Pelajar Pancasila (P5)",
      docType: "P5_DOCUMENT",
      dataObj: {
        p5Assessments: p5List.filter((p) => p.classId === selectedClassId),
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
            Penilaian Projek Profil Pelajar Pancasila (P5)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penilaian autentik perkembangan 6 dimensi karakter Profil Pelajar Pancasila dengan skala BB (Belum Berkembang), MB (Mulai Berkembang), BSH (Berkembang Sesuai Harapan), dan SB (Sangat Berkembang).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak Rekap P5
          </button>
          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Input Capaian Siswa
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
        showAllOption={false}
        extraControls={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Dimensi P5:</span>
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-750 dark:bg-slate-850 dark:text-slate-200"
            >
              {dimensions.map((d, idx) => (
                <option key={idx} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* Table Data P5 */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Tema & Judul Projek</th>
                <th className="px-4 py-3">Elemen / Sub-elemen</th>
                <th className="px-4 py-3 text-center">Skala Capaian</th>
                <th className="px-4 py-3">Deskripsi Capaian / Catatan Proses</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentStudents.map((std, idx) => {
                const p5 = p5List.find(
                  (p) =>
                    p.studentId === std.id &&
                    p.classId === selectedClassId &&
                    p.dimension === selectedDimension
                );
                return (
                  <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{std.name}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {p5?.projectName || "-"}
                      </div>
                      <span className="text-[10px] text-slate-400">{p5?.theme}</span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">{p5?.element || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      {p5 ? (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            p5.scoreScale === "SB"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : p5.scoreScale === "BSH"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : p5.scoreScale === "MB"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {p5.scoreScale} ({p5.scoreScale === "SB" ? "Sangat Berkembang" : p5.scoreScale === "BSH" ? "Sesuai Harapan" : p5.scoreScale === "MB" ? "Mulai Berkembang" : "Belum Berkembang"})
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Belum Dinilai</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">{p5?.description || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      {p5 ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(p5)}
                            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Hapus catatan P5 siswa?")) deleteP5(p5.id);
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
                {editingP5 ? "Edit Penilaian Projek P5" : "Input Penilaian Projek P5"}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Tema Projek P5
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                    placeholder="Contoh: Rekayasa dan Teknologi"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Judul Projek
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    placeholder="Contoh: Sistem Otomasi Ramah Lingkungan"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Elemen Karakter
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.element}
                    onChange={(e) => setFormData({ ...formData, element: e.target.value })}
                    placeholder="Contoh: Kolaborasi & Penalaran Kritis"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Skala Capaian Karakter
                  </label>
                  <select
                    value={formData.scoreScale}
                    onChange={(e) => setFormData({ ...formData, scoreScale: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold dark:border-slate-700 dark:bg-slate-800"
                  >
                    <option value="BB">BB - Belum Berkembang</option>
                    <option value="MB">MB - Mulai Berkembang</option>
                    <option value="BSH">BSH - Berkembang Sesuai Harapan</option>
                    <option value="SB">SB - Sangat Berkembang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Deskripsi Narasi Capaian Rapor
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Catatan kemajuan dan konsistensi karakter peserta didik..."
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
                  Simpan Capaian P5
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
