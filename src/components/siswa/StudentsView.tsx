import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Student } from "../../types";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Search,
  Upload,
  Download,
  Filter,
  Save,
  X,
  FileSpreadsheet,
} from "lucide-react";

export const StudentsView: React.FC = () => {
  const { students, classes, saveStudent, deleteStudent, bulkImportStudents, addToast } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [csvText, setCsvText] = useState("");

  const [formData, setFormData] = useState<Student>({
    id: "",
    classId: classes[0]?.id || "cls-10a",
    nis: "",
    nisn: "",
    name: "",
    gender: "L",
    phone: "",
    status: "Aktif",
    parentName: "",
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      id: "std-" + Date.now(),
      classId: selectedClassId !== "all" ? selectedClassId : classes[0]?.id || "cls-10a",
      nis: "",
      nisn: "",
      name: "",
      gender: "L",
      phone: "",
      status: "Aktif",
      parentName: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStudent(formData);
    setIsModalOpen(false);
  };

  const handleBulkImport = () => {
    if (!csvText.trim()) return;
    const lines = csvText.trim().split("\n");
    const targetClass = selectedClassId !== "all" ? selectedClassId : classes[0]?.id || "cls-10a";
    const parsed: Partial<Student>[] = [];

    lines.forEach((line) => {
      // Split by comma or semicolon or tab
      const cols = line.split(/[,;\t]/).map((c) => c.trim().replace(/^"|"$/g, ""));
      if (cols.length >= 2) {
        // Skip header if looks like header
        if (cols[0].toLowerCase().includes("nama") || cols[1]?.toLowerCase().includes("nama")) return;
        parsed.push({
          name: cols[0] || "Nama Siswa",
          nis: cols[1] || "",
          nisn: cols[2] || "",
          gender: cols[3]?.toUpperCase() === "P" ? "P" : "L",
          parentName: cols[4] || "",
          phone: cols[5] || "",
        });
      }
    });

    if (parsed.length > 0) {
      bulkImportStudents(targetClass, parsed);
      setIsImportModalOpen(false);
      setCsvText("");
    } else {
      addToast("warning", "Format CSV Tidak Dikenali", "Pastikan format: Nama, NIS, NISN, Gender(L/P), Orang Tua, HP");
    }
  };

  const handleExportCSV = () => {
    const targetStudents = filteredStudents;
    const header = "Nama,NIS,NISN,Jenis Kelamin,Kelas,Nama Orang Tua,Nomor Kontak\n";
    const rows = targetStudents
      .map((s) => {
        const cls = classes.find((c) => c.id === s.classId)?.name || "-";
        return `"${s.name}","${s.nis}","${s.nisn}","${s.gender}","${cls}","${s.parentName || ""}","${s.phone || ""}"`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Data_Siswa_${selectedClassId !== "all" ? selectedClassId : "Semua"}.csv`;
    a.click();
  };

  const filteredStudents = students.filter((s) => {
    const matchClass = selectedClassId === "all" || s.classId === selectedClassId;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.nis.includes(search) ||
      s.nisn.includes(search);
    return matchClass && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Data Induk Peserta Didik
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar seluruh siswa untuk administrasi presensi, buku nilai, dan rapor belajar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Upload className="h-4 w-4 text-emerald-600" />
            Import CSV / Excel
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Download className="h-4 w-4 text-indigo-600" />
            Export CSV
          </button>

          <button
            id="btn-add-student"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Siswa
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari berdasarkan nama siswa, NIS, atau NISN..."
            className="w-full text-xs text-slate-800 focus:outline-none dark:text-slate-200 dark:bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="all">Semua Kelas ({students.length} Siswa)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({students.filter((s) => s.classId === c.id).length} Siswa)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Data Siswa */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3">Nama Lengkap</th>
                <th className="px-4 py-3">NIS / NISN</th>
                <th className="px-4 py-3">L/P</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Nama Orang Tua</th>
                <th className="px-4 py-3">Kontak / WA</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    Tidak ada data siswa yang cocok.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std, idx) => {
                  const cls = classes.find((c) => c.id === std.classId);
                  return (
                    <tr
                      key={std.id}
                      className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-850/50"
                    >
                      <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                        {std.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px]">
                        {std.nis || "-"} / {std.nisn || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            std.gender === "L"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                              : "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300"
                          }`}
                        >
                          {std.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {cls?.name || "Tanpa Kelas"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{std.parentName || "-"}</td>
                      <td className="px-4 py-3 font-mono text-[11px]">{std.phone || "-"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(std)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Siswa"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data siswa ${std.name}?`)) {
                                deleteStudent(std.id);
                              }
                            }}
                            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Siswa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingStudent ? "Edit Data Siswa" : "Tambah Siswa Baru"}
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
                  Nama Lengkap Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Achmad Fauzan"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kelas / Rombel *
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phase})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Jenis Kelamin *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "L" | "P" })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    NIS (Nomor Induk Sekolah)
                  </label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="241001"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    NISN (Nasional)
                  </label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="0071234567"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={formData.parentName || ""}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Nama Orang Tua"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nomor WhatsApp Siswa/Ortu
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812..."
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Bulk Import */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Import Data Siswa (CSV / Excel Copy-Paste)
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <p>
                Salin dan tempel baris data siswa dari Excel atau file CSV Anda dengan urutan kolom:
              </p>
              <div className="rounded-lg bg-slate-100 p-2.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Nama Siswa, NIS, NISN, L/P, Nama Ortu, No HP
              </div>

              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="Budi Santoso, 241011, 0071234511, L, Santoso, 0812999901&#10;Citra Lestari, 241012, 0071234512, P, Hendra, 0812999902"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleBulkImport}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  <Upload className="h-4 w-4" />
                  Proses Import Siswa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
