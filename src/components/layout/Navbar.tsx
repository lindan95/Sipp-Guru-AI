import React from "react";
import { useApp } from "../../context/AppContext";
import {
  Menu,
  Moon,
  Sun,
  Search,
  Lock,
  CloudUpload,
  Sparkles,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    activeMenu,
    setActiveMenu,
    sidebarOpen,
    setSidebarOpen,
    darkMode,
    toggleDarkMode,
    setIsLocked,
    setIsSearchOpen,
    setIsGasDeployOpen,
    settings,
    teacherProfile,
    schoolProfile,
  } = useApp();

  const getMenuTitle = () => {
    switch (activeMenu) {
      case "dashboard": return "Dashboard Utama";
      case "profil_sekolah": return "Profil Satuan Pendidikan";
      case "profil_guru": return "Profil Guru Pendidik";
      case "kelas": return "Manajemen Data Kelas";
      case "siswa": return "Data Induk Peserta Didik";
      case "mata_pelajaran": return "Mata Pelajaran";
      case "jadwal": return "Jadwal Mengajar";
      case "kalender_pendidikan": return "Kalender Pendidikan";
      case "asesmen_diagnosis": return "Asesmen Diagnostik";
      case "penilaian": return "Buku Nilai Siswa";
      case "cp": return "Capaian Pembelajaran (CP)";
      case "atp": return "Alur Tujuan Pembelajaran (ATP)";
      case "alokasi_waktu": return "Alokasi Waktu Pembelajaran";
      case "program_semester":
      case "program_tahunan": return "Promes & Prota (Semester & Tahunan)";
      case "kktp": return "Kriteria Ketuntasan (KKTP)";
      case "modul_ajar": return "Modul Ajar (RPP Merdeka)";
      case "lkpd": return "Lembar Kerja Siswa (LKPD)";
      case "program_penilaian": return "Rencana Program Penilaian";
      case "bahan_ajar": return "Bahan Ajar & Diktat";
      case "media_ajar": return "Media Pembelajaran";
      case "bank_soal": return "Bank Soal & Asesmen";
      case "pembahasan": return "Pembahasan Soal Berbasis AI";
      case "kisi_kisi": return "Kisi-Kisi Asesmen";
      case "analisis_soal": return "Analisis Butir Soal";
      case "kartu_soal": return "Format Kartu Soal";
      case "absensi": return "Presensi Harian Siswa";
      case "rekap_kehadiran": return "Rekapitulasi Kehadiran";
      case "rekap_siswa": return "Rekap Hasil Belajar";
      case "jurnal_mengajar": return "Jurnal Mengajar Guru";
      case "buku_kasus": return "Buku Catatan Kasus";
      case "remedial_pengayaan": return "Remedial & Pengayaan";
      case "supervisi": return "Supervisi Akademik";
      case "pkb": return "Pengembangan Keprofesian (PKB)";
      case "p5": return "Projek Penguatan Profil Pancasila (P5)";
      case "rubrik": return "Rubrik Asesmen";
      case "asesmen_formatif": return "Asesmen Formatif";
      case "asesmen_sumatif": return "Asesmen Sumatif";
      case "ai_assistant": return "AI Guru Assistant";
      case "pengaturan": return "Pengaturan & Database Sheets";
      default: return "SIPP Guru AI";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-3 sm:px-5 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95 gap-3">
      {/* Left Section: Hamburger & Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          id="btn-toggle-sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors shrink-0"
          title="Buka/Tutup Navigasi"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate whitespace-nowrap tracking-tight">
              {getMenuTitle()}
            </h1>
            <span className="hidden 2xl:inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shrink-0">
              TA {settings.activeAcademicYear} • Sem {settings.activeSemester}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate whitespace-nowrap hidden sm:block">
            {schoolProfile.name} • TA {settings.activeAcademicYear} (Sem {settings.activeSemester})
          </p>
        </div>
      </div>

      {/* Right Section: Quick Actions, Tools */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Quick Search Shortcut */}
        <button
          id="btn-search-trigger"
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-750 dark:bg-slate-850 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Cari data atau menu (Ctrl+K)"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="hidden xl:inline text-xs">Cari...</span>
          <kbd className="hidden 2xl:inline-block rounded bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            Ctrl+K
          </kbd>
        </button>

        {/* Quick Action: AI Assistant */}
        <button
          id="btn-nav-ai-assist"
          onClick={() => setActiveMenu("ai_assistant")}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs font-bold text-white shadow-xs transition-colors shrink-0"
          title="Buka AI Guru Assistant"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">AI Guru</span>
        </button>

        {/* GAS & Cloud Deploy Button */}
        <button
          id="btn-nav-gas-deploy"
          onClick={() => setIsGasDeployOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300 transition-colors shrink-0"
          title="Integrasi & Ekspor Google Sheets"
        >
          <CloudUpload className="h-3.5 w-3.5" />
          <span className="hidden 2xl:inline">Google Sheets</span>
        </button>

        {/* Subtle Divider */}
        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5 hidden sm:block" />

        {/* Action Icons: Theme, Lock & Profile */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            id="btn-theme-toggle"
            onClick={toggleDarkMode}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? "Mode Terang" : "Mode Gelap"}
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>

          <button
            id="btn-lock-screen"
            onClick={() => setIsLocked(true)}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Kunci Aplikasi (PIN)"
          >
            <Lock className="h-4 w-4" />
          </button>

          <div
            onClick={() => setActiveMenu("profil_guru")}
            className="flex cursor-pointer items-center rounded-full p-0.5 hover:ring-2 hover:ring-blue-400 transition-all ml-1"
            title={`Profil Guru: ${teacherProfile.fullName}`}
          >
            <img
              src={teacherProfile.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
              alt={teacherProfile.fullName}
              className="h-8 w-8 rounded-full border border-blue-400 object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
