import React from "react";
import { useApp } from "../../context/AppContext";
import {
  GraduationCap,
  Users,
  BookOpen,
  FileCheck,
  UserCheck,
  Award,
  Sparkles,
  PlusCircle,
  Clock,
  CalendarDays,
  FileText,
  HelpCircle,
  Printer,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    teacherProfile,
    schoolProfile,
    settings,
    classes,
    students,
    subjects,
    modulList,
    lkpdList,
    cpList,
    atpList,
    kktpList,
    promesList,
    protaList,
    questions,
    attendanceRecords,
    gradeRecords,
    activityLogs,
    setActiveMenu,
    schedules,
  } = useApp();

  // Computations
  const totalClasses = classes.length;
  const totalStudents = students.length;
  const totalSubjects = subjects.length;
  const totalDevices =
    modulList.length +
    lkpdList.length +
    cpList.length +
    atpList.length +
    kktpList.length +
    promesList.length +
    protaList.length;

  // Attendance today calculation
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAttendance = attendanceRecords.find((a) => a.date === todayStr);
  let attendanceRate = 96.5;
  if (todayAttendance && todayAttendance.entries.length > 0) {
    const presentCount = todayAttendance.entries.filter((e) => e.status === "H").length;
    attendanceRate = Math.round((presentCount / todayAttendance.entries.length) * 100);
  }

  // Average grade calculation
  let avgGrade = 84.2;
  const allScores: number[] = [];
  gradeRecords.forEach((g) => g.scores.forEach((s) => allScores.push(s.score)));
  if (allScores.length > 0) {
    avgGrade = Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10;
  }

  // Today's schedule
  const daysIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const currentDayName = daysIndo[new Date().getDay()];
  const todaySchedules = schedules.filter((s) => s.day === currentDayName);

  return (
    <div className="space-y-6">
      {/* 1. Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-500/15 sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={teacherProfile.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={teacherProfile.fullName}
              className="h-20 w-20 rounded-2xl border-2 border-white/40 object-cover shadow-md"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <span>{schoolProfile.name}</span>
                <span>•</span>
                <span>TA {settings.activeAcademicYear}</span>
                <span>•</span>
                <span>Semester {settings.activeSemester}</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Selamat Datang, {teacherProfile.fullName}
              </h2>
              <p className="text-xs text-blue-100 sm:text-sm">
                NIP. {teacherProfile.nip} • {teacherProfile.mainSubject} • {teacherProfile.rank}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-dash-ai-studio"
              onClick={() => setActiveMenu("ai_assistant")}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-blue-700 shadow-sm hover:bg-blue-50 transition-all"
            >
              <Sparkles className="h-4 w-4 text-blue-600 animate-bounce" />
              AI Guru Assistant
            </button>
            <button
              id="btn-dash-quick-modul"
              onClick={() => setActiveMenu("modul_ajar")}
              className="flex items-center gap-2 rounded-xl bg-blue-800/60 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-blue-800 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              Modul Ajar Baru
            </button>
          </div>
        </div>

        {/* Decorative background vectors */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 right-40 h-48 w-48 rounded-full bg-indigo-500/20 blur-xl" />
      </div>

      {/* 2. Key Statistics Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {/* Kelas */}
        <div
          onClick={() => setActiveMenu("kelas")}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Jumlah Kelas</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <GraduationCap className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalClasses}</span>
            <span className="text-xs text-slate-400">Rombel</span>
          </div>
        </div>

        {/* Siswa */}
        <div
          onClick={() => setActiveMenu("siswa")}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Siswa</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalStudents}</span>
            <span className="text-xs text-slate-400">Peserta</span>
          </div>
        </div>

        {/* Mata Pelajaran */}
        <div
          onClick={() => setActiveMenu("mata_pelajaran")}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Mata Pelajaran</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalSubjects}</span>
            <span className="text-xs text-slate-400">Mapel</span>
          </div>
        </div>

        {/* Perangkat Pembelajaran */}
        <div
          onClick={() => setActiveMenu("modul_ajar")}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Perangkat Ajar</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalDevices}</span>
            <span className="text-xs text-slate-400">Dokumen</span>
          </div>
        </div>

        {/* Kehadiran Hari Ini */}
        <div
          onClick={() => setActiveMenu("absensi")}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Kehadiran Hari Ini</span>
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{attendanceRate}%</span>
            <span className="text-xs text-emerald-500 font-medium">Hadir</span>
          </div>
        </div>

        {/* Rata-Rata Nilai */}
        <div
          onClick={() => setActiveMenu("penilaian")}
          className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Rata-Rata Nilai</span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{avgGrade}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
        </div>
      </div>

      {/* 3. Quick Actions Menu (Requirement #4) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Aksi Cepat Guru (Quick Actions)
          </h3>
          <span className="text-xs text-slate-500">Klik untuk langsung membuka modul</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <button
            onClick={() => setActiveMenu("modul_ajar")}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition-all hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800"
          >
            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400">
              <PlusCircle className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Tambah Perangkat</span>
          </button>

          <button
            onClick={() => setActiveMenu("ai_assistant")}
            className="flex flex-col items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 text-center transition-all hover:border-indigo-400 hover:bg-indigo-100/60 dark:border-indigo-900/60 dark:bg-indigo-950/40"
          >
            <div className="rounded-lg bg-indigo-600 p-2.5 text-white shadow-xs">
              <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">AI Generate</span>
          </button>

          <button
            onClick={() => setActiveMenu("absensi")}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition-all hover:border-teal-300 hover:bg-teal-50/50 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <div className="rounded-lg bg-teal-100 p-2.5 text-teal-600 dark:bg-teal-900/60 dark:text-teal-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Input Absensi</span>
          </button>

          <button
            onClick={() => setActiveMenu("penilaian")}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition-all hover:border-rose-300 hover:bg-rose-50/50 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <div className="rounded-lg bg-rose-100 p-2.5 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Input Nilai</span>
          </button>

          <button
            onClick={() => setActiveMenu("modul_ajar")}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition-all hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/60 dark:text-blue-400">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Buat Modul Ajar</span>
          </button>

          <button
            onClick={() => setActiveMenu("lkpd")}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition-all hover:border-amber-300 hover:bg-amber-50/50 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <div className="rounded-lg bg-amber-100 p-2.5 text-amber-600 dark:bg-amber-900/60 dark:text-amber-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Buat LKPD</span>
          </button>

          <button
            onClick={() => setActiveMenu("bank_soal")}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition-all hover:border-purple-300 hover:bg-purple-50/50 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <div className="rounded-lg bg-purple-100 p-2.5 text-purple-600 dark:bg-purple-900/60 dark:text-purple-400">
              <HelpCircle className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Buat Soal</span>
          </button>

          <button
            onClick={() => setActiveMenu("rekap_siswa")}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-center transition-all hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:bg-slate-800/60"
          >
            <div className="rounded-lg bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400">
              <Printer className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* 4. Split Section: Jadwal Mengajar Hari Ini & Timeline Aktivitas Terakhir */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Jadwal Hari Ini */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Jadwal Hari Ini ({currentDayName})
              </h3>
            </div>
            <button
              onClick={() => setActiveMenu("jadwal")}
              className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Lihat Semua
            </button>
          </div>

          {todaySchedules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
              <p className="text-xs text-slate-500">Tidak ada jadwal tatap muka hari ini.</p>
              <button
                onClick={() => setActiveMenu("jadwal")}
                className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
              >
                + Atur Jadwal Mengajar
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySchedules.map((sch) => {
                const cls = classes.find((c) => c.id === sch.classId);
                const sbj = subjects.find((s) => s.id === sch.subjectId);
                return (
                  <div
                    key={sch.id}
                    className="flex items-start justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-850"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          {sch.startTime} - {sch.endTime}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {cls?.name || "Kelas"}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {sbj?.name || "Mata Pelajaran"}
                      </p>
                      <p className="text-[11px] text-slate-400">{sch.room}</p>
                    </div>
                    <button
                      onClick={() => setActiveMenu("absensi")}
                      className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-600 shadow-xs hover:bg-blue-50 dark:bg-slate-800 dark:text-blue-400"
                    >
                      Presensi
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Aktivitas Terakhir (Requirement #4) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Log Aktivitas Terakhir
              </h3>
            </div>
            <span className="text-xs text-slate-400">Riwayat Penggunaan Sistem</span>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {log.action}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {log.module}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{log.details}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(log.timestamp).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
