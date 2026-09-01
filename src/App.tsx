import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";

// Views
import { DashboardView } from "./components/dashboard/DashboardView";
import { SchoolProfileView } from "./components/profil/SchoolProfileView";
import { TeacherProfileView } from "./components/profil/TeacherProfileView";
import { ClassesView } from "./components/siswa/ClassesView";
import { StudentsView } from "./components/siswa/StudentsView";
import { SubjectsView } from "./components/pembelajaran/SubjectsView";
import { SchedulesView } from "./components/pembelajaran/SchedulesView";
import { CalendarView } from "./components/pembelajaran/CalendarView";

// Perangkat Pembelajaran
import { CPView } from "./components/perangkat/CPView";
import { ATPView } from "./components/perangkat/ATPView";
import { AlokasiWaktuView } from "./components/perangkat/AlokasiWaktuView";
import { PromesProtaView } from "./components/perangkat/PromesProtaView";
import { KKTPView } from "./components/perangkat/KKTPView";
import { ModulAjarView } from "./components/perangkat/ModulAjarView";
import { LKPDView } from "./components/perangkat/LKPDView";
import { ProgramPenilaianView } from "./components/perangkat/ProgramPenilaianView";
import { BahanAjarView } from "./components/perangkat/BahanAjarView";
import { MediaAjarView } from "./components/perangkat/MediaAjarView";

// Asesmen
import { AsesmenDiagnostikView } from "./components/asesmen/AsesmenDiagnostikView";
import { BankSoalView } from "./components/asesmen/BankSoalView";
import { PembahasanSoalView } from "./components/asesmen/PembahasanSoalView";
import { KisiKisiSoalView } from "./components/asesmen/KisiKisiSoalView";
import { AnalisisSoalView } from "./components/asesmen/AnalisisSoalView";
import { KartuSoalView } from "./components/asesmen/KartuSoalView";
import { RubrikView } from "./components/asesmen/RubrikView";
import { AsesmenFormatifView } from "./components/asesmen/AsesmenFormatifView";
import { AsesmenSumatifView } from "./components/asesmen/AsesmenSumatifView";
import { P5View } from "./components/asesmen/P5View";

// Administrasi Guru
import { PresensiView } from "./components/administrasi/PresensiView";
import { RekapKehadiranView } from "./components/administrasi/RekapKehadiranView";
import { BukuNilaiView } from "./components/administrasi/BukuNilaiView";
import { BukuCatatanPerbabView } from "./components/administrasi/BukuCatatanPerbabView";
import { PenilaianTugasView } from "./components/administrasi/PenilaianTugasView";
import { AsesmenPerbabView } from "./components/administrasi/AsesmenPerbabView";
import { RekapHasilBelajarView } from "./components/administrasi/RekapHasilBelajarView";
import { JurnalMengajarView } from "./components/administrasi/JurnalMengajarView";
import { BukuKasusView } from "./components/administrasi/BukuKasusView";
import { RemedialPengayaanView } from "./components/administrasi/RemedialPengayaanView";
import { SupervisiView } from "./components/administrasi/SupervisiView";
import { PKBView } from "./components/administrasi/PKBView";

// AI & Dokumen & Pengaturan
import { AIAssistantView } from "./components/ai/AIAssistantView";
import { DocumentExportModal } from "./components/dokumen/DocumentExportModal";
import { SettingsView } from "./components/pengaturan/SettingsView";

// Icons & Notifications
import {
  Lock,
  Unlock,
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  X,
  Sparkles,
} from "lucide-react";

const MainContent: React.FC = () => {
  const {
    activeMenu,
    setActiveMenu,
    isLocked,
    unlockWithPin,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    toasts,
    removeToast,
    students,
    subjects,
    modulAjarList,
    questionBank,
    darkMode,
  } = useApp();

  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockWithPin(pinInput)) {
      setPinInput("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // View Switcher
  const renderView = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardView />;
      case "profil_sekolah":
        return <SchoolProfileView />;
      case "profil_guru":
        return <TeacherProfileView />;
      case "kelas":
        return <ClassesView />;
      case "siswa":
        return <StudentsView />;
      case "mata_pelajaran":
        return <SubjectsView />;
      case "jadwal":
        return <SchedulesView />;
      case "kalender_pendidikan":
        return <CalendarView />;

      // Perangkat Pembelajaran
      case "cp":
        return <CPView />;
      case "atp":
        return <ATPView />;
      case "alokasi_waktu":
        return <AlokasiWaktuView />;
      case "program_semester":
      case "program_tahunan":
        return <PromesProtaView />;
      case "kktp":
        return <KKTPView />;
      case "modul_ajar":
        return <ModulAjarView />;
      case "lkpd":
        return <LKPDView />;
      case "program_penilaian":
        return <ProgramPenilaianView />;
      case "bahan_ajar":
        return <BahanAjarView />;
      case "media_ajar":
        return <MediaAjarView />;

      // Asesmen & Bank Soal
      case "asesmen_diagnosis":
        return <AsesmenDiagnostikView />;
      case "bank_soal":
        return <BankSoalView />;
      case "pembahasan":
        return <PembahasanSoalView />;
      case "kisi_kisi":
        return <KisiKisiSoalView />;
      case "analisis_soal":
        return <AnalisisSoalView />;
      case "kartu_soal":
        return <KartuSoalView />;
      case "rubrik":
        return <RubrikView />;
      case "asesmen_formatif":
        return <AsesmenFormatifView />;
      case "penilaian":
        return <BukuNilaiView />;
      case "asesmen_sumatif":
        return <AsesmenSumatifView />;
      case "rekap_siswa":
        return <RekapHasilBelajarView />;
      case "p5":
        return <P5View />;

      // Administrasi Guru & Absensi
      case "absensi":
        return <PresensiView />;
      case "rekap_kehadiran":
        return <RekapKehadiranView />;
      case "penilaian":
        return <BukuNilaiView />;
      case "buku_catatan_bab":
        return <BukuCatatanPerbabView />;
      case "penilaian_tugas":
        return <PenilaianTugasView />;
      case "asesmen_perbab":
        return <AsesmenPerbabView />;
      case "jurnal_mengajar":
        return <JurnalMengajarView />;
      case "buku_kasus":
        return <BukuKasusView />;
      case "remedial_pengayaan":
        return <RemedialPengayaanView />;
      case "supervisi":
        return <SupervisiView />;
      case "pkb":
        return <PKBView />;

      // AI Assistant & Pengaturan
      case "ai_assistant":
        return <AIAssistantView />;
      case "pengaturan":
        return <SettingsView />;

      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""} flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100`}>
      {/* PIN Security Lock Screen */}
      {isLocked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center text-white shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-lg font-extrabold tracking-tight">Sistem Terkunci</h2>
            <p className="mt-1 text-xs text-slate-400">
              Masukkan PIN Keamanan Guru untuk membuka aplikasi. (Default: 123456)
            </p>

            <form onSubmit={handleUnlock} className="mt-6 space-y-4">
              <input
                type="password"
                maxLength={6}
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="******"
                className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-center text-xl font-black tracking-widest text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />

              {pinError && (
                <p className="text-xs font-semibold text-rose-400">PIN Salah, silakan coba lagi.</p>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
              >
                <Unlock className="h-4 w-4" />
                Buka Aplikasi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Quick Search Modal (Ctrl+K) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 pt-20 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari siswa, modul ajar, soal, menu..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 max-h-60 overflow-y-auto space-y-1 text-xs">
              <div className="p-1 font-bold text-slate-400 uppercase text-[10px]">Aksi Cepat Menu</div>
              {[
                { id: "modul_ajar", label: "Modul Ajar (RPP Merdeka)" },
                { id: "bank_soal", label: "Bank Soal & Asesmen HOTS" },
                { id: "absensi", label: "Presensi & Kehadiran Siswa" },
                { id: "jurnal_mengajar", label: "Jurnal Mengajar Guru" },
                { id: "ai_assistant", label: "AI Guru Assistant" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id as any);
                    setIsSearchOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl p-2 text-left hover:bg-blue-50 text-slate-700 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-slate-400">Buka Menu</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar />

      {/* Center Layout Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />

        {/* Dynamic View Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{renderView()}</div>
        </main>
      </div>

      {/* Document Export & Print Modal */}
      <DocumentExportModal />

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-80 items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-900"
          >
            {t.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />}
            {t.type === "error" && <XCircle className="h-5 w-5 text-rose-500 shrink-0" />}
            {t.type === "warning" && <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />}
            {t.type === "info" && <Info className="h-5 w-5 text-blue-500 shrink-0" />}

            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.message}</p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
