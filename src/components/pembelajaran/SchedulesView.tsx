import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ScheduleItem } from "../../types";
import {
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  Save,
  X,
  LayoutGrid,
  Table as TableIcon,
  Printer,
  FileText,
} from "lucide-react";

const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export const SchedulesView: React.FC = () => {
  const {
    schedules,
    classes,
    subjects,
    saveSchedule,
    deleteSchedule,
    schoolProfile,
    teacherProfile,
    settings,
    setPreviewDoc,
  } = useApp();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);

  const [formData, setFormData] = useState<ScheduleItem>({
    id: "",
    day: "Senin",
    startTime: "07:30",
    endTime: "09:00",
    classId: classes[0]?.id || "cls-10a",
    subjectId: subjects[0]?.id || "sbj-inf",
    room: "Lab Komputer 1",
    notes: "",
  });

  const handleOpenAdd = (defaultDay?: string) => {
    setEditingSchedule(null);
    setFormData({
      id: "schd-" + Date.now(),
      day: defaultDay || "Senin",
      startTime: "07:30",
      endTime: "09:00",
      classId: classes[0]?.id || "cls-10a",
      subjectId: subjects[0]?.id || "sbj-inf",
      room: "Ruang Kelas / Lab",
      notes: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: ScheduleItem) => {
    setEditingSchedule(s);
    setFormData({ ...s });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSchedule(formData);
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Jadwal Mengajar Tatap Muka Guru",
      docType: "JADWAL_MENGAJAR_DOCUMENT",
      dataObj: {
        schedules,
        classes,
        subjects,
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
            Jadwal Mengajar Tatap Muka
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jadwal rutin mingguan guru yang terhubung dengan modul absensi harian dan perencanaan pembelajaran.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Matriks Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${
                viewMode === "table"
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              Tabel
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Cetak Jadwal / PDF
          </button>

          <button
            onClick={() => handleOpenAdd()}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Jadwal
          </button>
        </div>
      </div>

      {/* Grid Mode View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {DAYS.map((day) => {
            const daySchedules = schedules.filter((s) => s.day === day);
            return (
              <div
                key={day}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">{day}</h3>
                  <button
                    onClick={() => handleOpenAdd(day)}
                    className="rounded p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-800"
                    title="Tambah jam"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex-1 space-y-2.5">
                  {daySchedules.length === 0 ? (
                    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-slate-100 p-2 text-center text-[11px] text-slate-400 dark:border-slate-800">
                      Tidak ada jam mengajar
                    </div>
                  ) : (
                    daySchedules.map((sch) => {
                      const cls = classes.find((c) => c.id === sch.classId);
                      const sbj = subjects.find((s) => s.id === sch.subjectId);
                      return (
                        <div
                          key={sch.id}
                          className="group relative rounded-xl border border-blue-100 bg-blue-50/50 p-2.5 text-xs transition-all hover:border-blue-300 dark:border-blue-900/40 dark:bg-blue-950/20"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-blue-300">
                              {sch.startTime} - {sch.endTime}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleOpenEdit(sch)}
                                className="text-slate-400 hover:text-blue-600"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Hapus jadwal ini?")) deleteSchedule(sch.id);
                                }}
                                className="text-slate-400 hover:text-rose-600"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          <h4 className="mt-1 font-bold text-slate-900 dark:text-white">
                            {cls?.name || "Kelas"}
                          </h4>
                          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                            {sbj?.name || "Mata Pelajaran"}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">{sch.room || "Ruang Kelas"}</p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode View */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Hari</th>
                <th className="px-4 py-3">Waktu / Jam</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3">Mata Pelajaran</th>
                <th className="px-4 py-3">Ruangan</th>
                <th className="px-4 py-3">Catatan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {schedules.map((sch) => {
                const cls = classes.find((c) => c.id === sch.classId);
                const sbj = subjects.find((s) => s.id === sch.subjectId);
                return (
                  <tr key={sch.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{sch.day}</td>
                    <td className="px-4 py-3 font-mono">
                      {sch.startTime} - {sch.endTime}
                    </td>
                    <td className="px-4 py-3 font-semibold">{cls?.name}</td>
                    <td className="px-4 py-3">{sbj?.name}</td>
                    <td className="px-4 py-3">{sch.room}</td>
                    <td className="px-4 py-3 text-slate-400">{sch.notes || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(sch)}
                          className="rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Hapus jadwal ini?")) deleteSchedule(sch.id);
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
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingSchedule ? "Edit Jadwal Mengajar" : "Tambah Jadwal Mengajar"}
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
                  Hari *
                </label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Jam Mulai *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Jam Selesai *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kelas *
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mata Pelajaran *
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ruangan / Lab
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lab Komputer 1"
                  value={formData.room || ""}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
