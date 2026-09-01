import React, { useState } from "react";
import { useApp, NavMenu } from "../../context/AppContext";
import {
  LayoutDashboard,
  Building2,
  User,
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  CalendarCheck,
  ClipboardList,
  Award,
  FileSpreadsheet,
  Layers,
  Clock,
  CalendarRange,
  Target,
  FileCode2,
  FileCheck2,
  Library,
  Video,
  HelpCircle,
  MessageSquareQuote,
  TableProperties,
  BarChart3,
  CreditCard,
  UserCheck2,
  PieChart,
  Bot,
  Settings,
  ChevronDown,
  ChevronRight,
  Sparkles,
  X,
  Database,
  BookMarked,
  ClipboardCheck,
  FileCheck,
} from "lucide-react";

interface MenuGroup {
  title: string;
  items: {
    id: NavMenu;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const Sidebar: React.FC = () => {
  const { activeMenu, setActiveMenu, sidebarOpen, setSidebarOpen, schoolProfile, teacherProfile } = useApp();

  // Collapsible accordion group states
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    utama: true,
    siswa: true,
    pembelajaran: true,
    perangkat: true,
    banksoal: true,
    absensi: true,
    ai: true,
    sistem: true,
  });

  const toggleGroup = (groupKey: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const menuGroups: { key: string; group: MenuGroup }[] = [
    {
      key: "utama",
      group: {
        title: "DASHBOARD & PROFIL",
        items: [
          { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
          { id: "profil_sekolah", label: "Profil Sekolah", icon: Building2 },
          { id: "profil_guru", label: "Profil Guru", icon: User },
        ],
      },
    },
    {
      key: "siswa",
      group: {
        title: "DATA SISWA & KELAS",
        items: [
          { id: "kelas", label: "Data Kelas", icon: GraduationCap },
          { id: "siswa", label: "Data Siswa", icon: Users },
        ],
      },
    },
    {
      key: "pembelajaran",
      group: {
        title: "PEMBELAJARAN & JADWAL",
        items: [
          { id: "mata_pelajaran", label: "Mata Pelajaran", icon: BookOpen },
          { id: "jadwal", label: "Jadwal Mengajar", icon: CalendarDays },
          { id: "kalender_pendidikan", label: "Kalender Pendidikan", icon: CalendarCheck },
        ],
      },
    },
    {
      key: "perangkat",
      group: {
        title: "PERANGKAT PEMBELAJARAN",
        items: [
          { id: "cp", label: "Capaian Pembelajaran (CP)", icon: FileSpreadsheet },
          { id: "atp", label: "Alur Tujuan (ATP)", icon: Layers },
          { id: "alokasi_waktu", label: "Alokasi Waktu", icon: Clock },
          { id: "program_semester", label: "Promes & Prota (Semester & Tahunan)", icon: CalendarRange },
          { id: "kktp", label: "Kriteria Ketuntasan (KKTP)", icon: Target },
          { id: "modul_ajar", label: "Modul Ajar (RPP)", icon: FileCode2, badge: "AI" },
          { id: "lkpd", label: "Lembar Kerja (LKPD)", icon: FileCheck2, badge: "AI" },
          { id: "program_penilaian", label: "Program Penilaian", icon: ClipboardList },
          { id: "bahan_ajar", label: "Bahan Ajar", icon: Library },
          { id: "media_ajar", label: "Media Ajar", icon: Video },
        ],
      },
    },
    {
      key: "banksoal",
      group: {
        title: "ASESMEN & BANK SOAL",
        items: [
          { id: "asesmen_diagnosis", label: "Asesmen Diagnosis", icon: ClipboardList, badge: "AI" },
          { id: "bank_soal", label: "Bank Soal & Asesmen", icon: HelpCircle, badge: "AI" },
          { id: "rubrik", label: "Rubrik Penilaian", icon: Award, badge: "AI" },
          { id: "asesmen_formatif", label: "Asesmen Formatif", icon: Target },
          { id: "asesmen_sumatif", label: "Asesmen Sumatif", icon: BarChart3 },
          { id: "p5", label: "Projek P5 (Profil Pancasila)", icon: Sparkles },
          { id: "pembahasan", label: "Pembahasan Soal", icon: MessageSquareQuote },
          { id: "kisi_kisi", label: "Kisi-Kisi Soal", icon: TableProperties },
          { id: "analisis_soal", label: "Analisis Butir Soal", icon: BarChart3 },
          { id: "kartu_soal", label: "Kartu Soal", icon: CreditCard },
        ],
      },
    },
    {
      key: "absensi",
      group: {
        title: "ADMINISTRASI & PRESENSI",
        items: [
          { id: "absensi", label: "Presensi & Kehadiran", icon: UserCheck2 },
          { id: "jurnal_mengajar", label: "Jurnal Mengajar Harian", icon: BookOpen },
          { id: "penilaian", label: "Buku Nilai Siswa", icon: Award },
          { id: "buku_catatan_bab", label: "Buku Catatan per Bab", icon: BookMarked },
          { id: "penilaian_tugas", label: "Penilaian Tugas", icon: ClipboardCheck },
          { id: "asesmen_perbab", label: "Asesmen per Bab", icon: FileCheck },
          { id: "buku_kasus", label: "Buku Catatan Kasus", icon: ClipboardList },
          { id: "remedial_pengayaan", label: "Remedial & Pengayaan", icon: Layers },
          { id: "supervisi", label: "Supervisi Akademik", icon: Award },
          { id: "pkb", label: "Pengembangan Diri (PKB)", icon: GraduationCap },
          { id: "rekap_kehadiran", label: "Rekap Kehadiran", icon: PieChart },
          { id: "rekap_siswa", label: "Rekap Hasil Belajar", icon: BarChart3 },
        ],
      },
    },
    {
      key: "ai",
      group: {
        title: "AI ASSISTANT",
        items: [
          { id: "ai_assistant", label: "AI Guru Assistant", icon: Bot, badge: "PRO" },
        ],
      },
    },
    {
      key: "sistem",
      group: {
        title: "PENGATURAN",
        items: [
          { id: "pengaturan", label: "Pengaturan & Backup", icon: Settings },
        ],
      },
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
                SIPP GURU <span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Perangkat Pembelajaran Terpadu
              </span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="border-b border-slate-100 bg-slate-50/70 p-3.5 dark:border-slate-800/80 dark:bg-slate-850/50">
          <div className="flex items-center gap-3">
            <img
              src={teacherProfile.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
              alt={teacherProfile.fullName}
              className="h-10 w-10 rounded-full border border-blue-300 object-cover dark:border-blue-700"
            />
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                {teacherProfile.fullName}
              </span>
              <span className="truncate text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                {teacherProfile.mainSubject} • {teacherProfile.position.split("&")[0]}
              </span>
              <span className="text-[10px] text-slate-400">
                NIP. {teacherProfile.nip}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {menuGroups.map(({ key, group }) => (
            <div key={key} className="space-y-1">
              <button
                onClick={() => toggleGroup(key)}
                className="flex w-full items-center justify-between px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
              >
                <span>{group.title}</span>
                {openGroups[key] ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>

              {openGroups[key] && (
                <div className="space-y-0.5 pt-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`menu-${item.id}`}
                        onClick={() => {
                          setActiveMenu(item.id);
                          if (window.innerWidth < 1024) setSidebarOpen(false);
                        }}
                        className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white shadow-xs font-semibold"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive
                                ? "text-white"
                                : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer info & Google Sheets status */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-3 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <Database className="h-3.5 w-3.5 text-emerald-500" />
            <span>30 Tabel Google Sheets Aktif</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-400">
            Kurikulum Merdeka • Single User
          </p>
        </div>
      </aside>
    </>
  );
};
