import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Settings,
  School,
  User,
  Sliders,
  Database,
  Save,
  CheckCircle,
  Copy,
  ExternalLink,
  Code2,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react";
import { FULL_GAS_CODE_BUNDLE } from "../../services/gasCodeBundle";

export const SettingsView: React.FC = () => {
  const {
    schoolProfile,
    saveSchoolProfile,
    teacherProfile,
    saveTeacherProfile,
    settings,
    updateSettings,
    darkMode,
    setDarkMode,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"school" | "teacher" | "system" | "gas">("school");

  const [schoolForm, setSchoolForm] = useState({ ...schoolProfile });
  const [teacherForm, setTeacherForm] = useState({ ...teacherProfile });
  const [settingsForm, setSettingsForm] = useState({ ...settings });

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    saveSchoolProfile(schoolForm);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    saveTeacherProfile(teacherForm);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
  };

  const handleCopyGasCode = () => {
    navigator.clipboard.writeText(FULL_GAS_CODE_BUNDLE);
    addToast("success", "Kode Backend Disalin", "Seluruh kode Google Apps Script (Code.gs) telah disalin ke clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Pengaturan Aplikasi & Konfigurasi Sistem
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kelola profil sekolah untuk kop dinas, profil guru untuk tanda tangan dokumen, tahun ajaran aktif, dan sinkronisasi Google Sheets.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("school")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "school"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <School className="h-4 w-4" />
          Profil Sekolah & Kop
        </button>

        <button
          onClick={() => setActiveTab("teacher")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "teacher"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <User className="h-4 w-4" />
          Profil Guru Pengampu
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "system"
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Sliders className="h-4 w-4" />
          Tahun Ajaran & Preferensi
        </button>

        <button
          onClick={() => setActiveTab("gas")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeTab === "gas"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Database className="h-4 w-4" />
          Google Apps Script & Database
        </button>
      </div>

      {/* TAB 1: SCHOOL PROFILE */}
      {activeTab === "school" && (
        <form onSubmit={handleSaveSchool} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
            Identitas Sekolah & Kop Dokumen Dinas
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Nama Sekolah *</label>
              <input
                type="text"
                required
                value={schoolForm.name}
                onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">NPSN</label>
              <input
                type="text"
                value={schoolForm.npsn}
                onChange={(e) => setSchoolForm({ ...schoolForm, npsn: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Alamat Lengkap Sekolah</label>
              <input
                type="text"
                value={schoolForm.address}
                onChange={(e) => setSchoolForm({ ...schoolForm, address: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Kota / Kabupaten</label>
              <input
                type="text"
                value={schoolForm.city}
                onChange={(e) => setSchoolForm({ ...schoolForm, city: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Email Sekolah</label>
              <input
                type="email"
                value={schoolForm.email}
                onChange={(e) => setSchoolForm({ ...schoolForm, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={schoolForm.principalName}
                onChange={(e) => setSchoolForm({ ...schoolForm, principalName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={schoolForm.principalNIP}
                onChange={(e) => setSchoolForm({ ...schoolForm, principalNIP: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
            >
              <Save className="h-4 w-4" />
              Simpan Profil Sekolah
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: TEACHER PROFILE */}
      {activeTab === "teacher" && (
        <form onSubmit={handleSaveTeacher} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
            Identitas Guru Pengampu & Tanda Tangan
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Nama Lengkap & Gelar *</label>
              <input
                type="text"
                required
                value={teacherForm.fullName}
                onChange={(e) => setTeacherForm({ ...teacherForm, fullName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">NIP / NUPTK</label>
              <input
                type="text"
                value={teacherForm.nip}
                onChange={(e) => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Email Guru</label>
              <input
                type="email"
                value={teacherForm.email}
                onChange={(e) => setTeacherForm({ ...teacherForm, email: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">No. WhatsApp / HP</label>
              <input
                type="text"
                value={teacherForm.phone}
                onChange={(e) => setTeacherForm({ ...teacherForm, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
            >
              <Save className="h-4 w-4" />
              Simpan Profil Guru
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: SYSTEM SETTINGS */}
      {activeTab === "system" && (
        <form onSubmit={handleSaveSettings} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-2 dark:border-slate-800">
            Tahun Ajaran & Preferensi Global
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Tahun Ajaran Aktif</label>
              <input
                type="text"
                value={settingsForm.activeAcademicYear}
                onChange={(e) => setSettingsForm({ ...settingsForm, activeAcademicYear: e.target.value })}
                placeholder="2024/2025"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300">Semester Aktif</label>
              <select
                value={settingsForm.activeSemester}
                onChange={(e) => setSettingsForm({ ...settingsForm, activeSemester: e.target.value as any })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">Tema Antarmuka Aplikasi</label>
            <div className="grid grid-cols-2 gap-3 sm:w-80">
              <button
                type="button"
                onClick={() => setDarkMode(false)}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  !darkMode
                    ? "border-blue-600 bg-blue-50/80 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300 ring-2 ring-blue-500/20"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Sun className="h-4 w-4 text-amber-500" />
                Mode Terang (Light)
              </button>

              <button
                type="button"
                onClick={() => setDarkMode(true)}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                  darkMode
                    ? "border-blue-600 bg-blue-50/80 text-blue-700 dark:border-blue-500 dark:bg-blue-950/60 dark:text-blue-300 ring-2 ring-blue-500/20"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-750 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Moon className="h-4 w-4 text-indigo-400" />
                Mode Gelap (Dark)
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
            >
              <Save className="h-4 w-4" />
              Simpan Preferensi
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: GAS & GOOGLE SHEETS SETUP */}
      {activeTab === "gas" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Integrasi Google Apps Script & 30 Tabel Google Sheets
              </h3>
              <p className="text-[11px] text-slate-500">
                Arsitektur database cloud menggunakan Google Sheets tanpa server berbayar.
              </p>
            </div>

            <button
              onClick={handleCopyGasCode}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
            >
              <Copy className="h-4 w-4" />
              Salin Kode Code.gs Lengkap
            </button>
          </div>

          <div className="space-y-3 leading-relaxed text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-slate-900 dark:text-white">Langkah Deployment ke Google Apps Script:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Buka <a href="https://script.google.com" target="_blank" rel="noreferrer" className="text-blue-600 font-bold underline">Google Apps Script</a> dan buat proyek baru.
              </li>
              <li>
                Buka file <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-600 dark:bg-slate-800">Code.gs</code>, hapus isinya, lalu klik tombol <strong>Salin Kode Code.gs Lengkap</strong> di atas dan paste ke editor.
              </li>
              <li>
                Jalankan fungsi <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-emerald-600 dark:bg-slate-800">initializeAllSheets()</code> di editor GAS untuk membuat 30 lembar kerja secara otomatis.
              </li>
              <li>
                Klik <strong>Deploy &gt; New deployment &gt; Web app</strong>. Pilih execute as <em>Me</em> dan Who has access <em>Anyone</em>.
              </li>
            </ol>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950 font-mono text-[11px] max-h-48 overflow-y-auto">
            <pre className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{FULL_GAS_CODE_BUNDLE.slice(0, 1000)}...</pre>
          </div>
        </div>
      )}
    </div>
  );
};
