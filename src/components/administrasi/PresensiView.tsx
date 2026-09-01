import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { AttendanceRecord } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  CalendarCheck,
  Save,
  Printer,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertCircle,
  HelpCircle,
  XCircle,
  CalendarCheck2,
  Calendar,
} from "lucide-react";

export const PresensiView: React.FC = () => {
  const {
    attendanceRecords,
    saveAttendance,
    classes,
    students,
    activeClassId,
    setActiveClassId,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
    addToast,
    setActiveMenu,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(activeClassId || classes[0]?.id || "cls-10a");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    if (activeClassId && activeClassId !== "all") {
      setSelectedClassId(activeClassId);
    }
  }, [activeClassId]);

  const currentStudents = students.filter((s) => s.classId === selectedClassId);

  // Local state for today's attendance entries
  const [dailyStatus, setDailyStatus] = useState<{
    [studentId: string]: { status: "H" | "S" | "I" | "A" | "T" | "B"; notes?: string };
  }>({});

  // Sync dailyStatus whenever selectedClassId or selectedDate changes or attendanceRecords update
  useEffect(() => {
    const map: { [id: string]: { status: "H" | "S" | "I" | "A" | "T" | "B"; notes?: string } } = {};
    const existingDayRecord = attendanceRecords.find(
      (r) => r.classId === selectedClassId && r.date === selectedDate
    );

    currentStudents.forEach((std) => {
      const entry = existingDayRecord?.entries?.find((e) => e.studentId === std.id);
      map[std.id] = {
        status: (entry?.status as any) || "H",
        notes: entry?.note || "",
      };
    });

    setDailyStatus(map);
  }, [selectedClassId, selectedDate, students, attendanceRecords]);

  const handleStatusChange = (studentId: string, status: "H" | "S" | "I" | "A" | "T" | "B") => {
    setDailyStatus((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleSetAllPresent = () => {
    const map: { [id: string]: { status: "H" | "S" | "I" | "A" | "T" | "B"; notes?: string } } = {};
    currentStudents.forEach((std) => {
      map[std.id] = {
        status: "H",
        notes: dailyStatus[std.id]?.notes || "",
      };
    });
    setDailyStatus(map);
    addToast("info", "Presensi Cepat", "Semua siswa ditandai HADIR (H).");
  };

  const handleSaveAll = () => {
    const newRecord: AttendanceRecord = {
      id: `att-${selectedClassId}-${selectedDate}`,
      classId: selectedClassId,
      date: selectedDate,
      entries: currentStudents.map((std) => ({
        studentId: std.id,
        status: (dailyStatus[std.id]?.status || "H") as any,
        note: dailyStatus[std.id]?.notes || "",
      })),
      createdAt: new Date().toISOString(),
    };

    saveAttendance(newRecord);
    addToast("success", "Presensi Tersimpan", `Kehadiran kelas ${classes.find(c => c.id === selectedClassId)?.name} tanggal ${selectedDate} disimpan.`);
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: `Daftar Presensi Harian Siswa - Kelas ${classes.find((c) => c.id === selectedClassId)?.name} (${selectedDate})`,
      docType: "PRESENSI_DOCUMENT",
      dataObj: {
        date: selectedDate,
        classInfo: classes.find((c) => c.id === selectedClassId),
        students: currentStudents,
        dailyStatus,
        attendances: attendanceRecords.filter((a) => a.classId === selectedClassId),
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  // Stats calculation
  const total = currentStudents.length;
  const hadir = currentStudents.filter((s) => (dailyStatus[s.id]?.status || "H") === "H").length;
  const sakit = currentStudents.filter((s) => dailyStatus[s.id]?.status === "S").length;
  const izin = currentStudents.filter((s) => dailyStatus[s.id]?.status === "I").length;
  const alpa = currentStudents.filter((s) => dailyStatus[s.id]?.status === "A").length;
  const terlambat = currentStudents.filter((s) => dailyStatus[s.id]?.status === "T").length;
  const bolos = currentStudents.filter((s) => dailyStatus[s.id]?.status === "B").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="h-5 w-5 text-blue-600" />
            Presensi & Kehadiran Harian Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pencatatan absensi harian per pertemuan: Hadir (H), Sakit (S), Izin (I), Alpa (A), Terlambat (T), dan Bolos (B).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveMenu("rekap_kehadiran")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <CalendarCheck2 className="h-3.5 w-3.5 text-blue-600" />
            Lihat Rekap Bulanan
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-3.5 w-3.5 text-blue-600" />
            Cetak Presensi Hari Ini
          </button>
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Save className="h-4 w-4" />
            Simpan Presensi
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
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Tanggal:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-750 dark:bg-slate-850 dark:text-slate-200"
              />
            </div>
            <button
              onClick={handleSetAllPresent}
              className="rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300"
            >
              ✓ Set Semua Hadir (H)
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Hadir (H)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-emerald-600">{hadir}</span>
            <span className="text-xs text-slate-400">/{total}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Sakit (S)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-amber-600">{sakit}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Izin (I)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-blue-600">{izin}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Alpa (A)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-rose-600">{alpa}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Terlambat (T)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-purple-600">{terlambat}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Bolos (B)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-orange-600">{bolos}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center w-12">No</th>
                <th className="px-4 py-3 w-24">NIS</th>
                <th className="px-4 py-3 min-w-[200px]">Nama Lengkap Siswa</th>
                <th className="px-4 py-3 text-center w-56">Status Kehadiran</th>
                <th className="px-4 py-3">Keterangan Khusus / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {currentStudents.map((std, idx) => {
                const current = dailyStatus[std.id]?.status || "H";
                return (
                  <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{std.nis || "-"}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{std.name}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
                        {[
                          { key: "H", label: "H", bg: "bg-emerald-500 text-white shadow-xs", title: "Hadir" },
                          { key: "S", label: "S", bg: "bg-amber-500 text-white shadow-xs", title: "Sakit" },
                          { key: "I", label: "I", bg: "bg-blue-500 text-white shadow-xs", title: "Izin" },
                          { key: "A", label: "A", bg: "bg-rose-500 text-white shadow-xs", title: "Alpa" },
                          { key: "T", label: "T", bg: "bg-purple-500 text-white shadow-xs", title: "Terlambat" },
                          { key: "B", label: "B", bg: "bg-orange-500 text-white shadow-xs", title: "Bolos (Meninggalkan KBM Tanpa Izin)" },
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            type="button"
                            title={btn.title}
                            onClick={() => handleStatusChange(std.id, btn.key as any)}
                            className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                              current === btn.key
                                ? btn.bg
                                : "text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-750"
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Contoh: Sakit demam berdarah / Meninggalkan kelas jam ke-3..."
                        value={dailyStatus[std.id]?.notes || ""}
                        onChange={(e) =>
                          setDailyStatus((prev) => ({
                            ...prev,
                            [std.id]: { ...prev[std.id], notes: e.target.value },
                          }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
