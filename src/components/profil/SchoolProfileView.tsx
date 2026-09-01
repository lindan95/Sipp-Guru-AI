import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { SchoolProfile } from "../../types";
import {
  Building2,
  Save,
  Image as ImageIcon,
  MapPin,
  Mail,
  Globe,
  Phone,
  UserCheck,
  Eye,
  RotateCcw,
  Upload,
  Trash2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const SchoolProfileView: React.FC = () => {
  const { schoolProfile, saveSchoolProfile, setPreviewDoc, addToast } = useApp();
  const [formData, setFormData] = useState<SchoolProfile>({ ...schoolProfile });

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);

  const PRESET_LOGOS = {
    tutwuri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/512px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png",
    kemenag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Logo_Kementerian_Agama_Indonesia.png/512px-Logo_Kementerian_Agama_Indonesia.png",
    schoolDefault: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80",
    provinsi: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Coat_of_arms_of_Jakarta.svg/512px-Coat_of_arms_of_Jakarta.svg.png",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "logo1" | "logo2") => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        addToast("error", "File Terlalu Besar", "Ukuran logo maksimal 3 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (target === "logo1") {
          setFormData((prev) => ({
            ...prev,
            logo1Url: result,
            logoKemdikbudUrl: result,
          }));
          addToast("success", "Logo 1 Diunggah", "Logo 1 (Kiri) berhasil diperbarui.");
        } else {
          setFormData((prev) => ({
            ...prev,
            logo2Url: result,
            logoSchoolUrl: result,
          }));
          addToast("success", "Logo 2 Diunggah", "Logo 2 (Kanan) berhasil diperbarui.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPreset = (target: "logo1" | "logo2", url: string, label: string) => {
    if (target === "logo1") {
      setFormData((prev) => ({
        ...prev,
        logo1Url: url,
        logoKemdikbudUrl: url,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        logo2Url: url,
        logoSchoolUrl: url,
      }));
    }
    addToast("info", "Preset Diterapkan", `Berhasil memilih ${label}`);
  };

  const handleRemoveLogo = (target: "logo1" | "logo2") => {
    if (target === "logo1") {
      setFormData((prev) => ({
        ...prev,
        logo1Url: "",
        logoKemdikbudUrl: "",
      }));
      addToast("info", "Logo 1 Dihapus", "Logo 1 telah dikosongkan.");
    } else {
      setFormData((prev) => ({
        ...prev,
        logo2Url: "",
        logoSchoolUrl: "",
      }));
      addToast("info", "Logo 2 Dihapus", "Logo 2 telah dikosongkan.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSchoolProfile({ ...formData, updatedAt: new Date().toISOString() });
  };

  const handlePreviewKop = () => {
    setPreviewDoc({
      title: "Kop Surat & Profil Satuan Pendidikan",
      docType: "KOP_SURAT",
      dataObj: formData,
    });
  };

  const currentLogo1 = formData.logo1Url || formData.logoKemdikbudUrl || "";
  const currentLogo2 = formData.logo2Url || formData.logoSchoolUrl || "";

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Profil Satuan Pendidikan
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Data identitas resmi dan pengaturan Logo 1 & Logo 2 yang otomatis tercetak pada Kop Surat kedinasan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreviewKop}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Eye className="h-4 w-4 text-blue-600" />
            Pratinjau Kop Surat
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef1}
        onChange={(e) => handleLogoUpload(e, "logo1")}
        accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef2}
        onChange={(e) => handleLogoUpload(e, "logo2")}
        accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
        className="hidden"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PENGATURAN LOGO 1 & LOGO 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
              <ImageIcon className="h-4 w-4 text-indigo-600" />
              Logo Dokumen & Kop Surat (Logo 1 & Logo 2)
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Format: PNG, JPG, SVG, WebP (Maks 3MB)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* KARTU LOGO 1 (KIRI) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                    1
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Logo 1 (Posisi Kiri Kop)
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Logo Tut Wuri Handayani / Pemda / Dinas / Yayasan
                    </p>
                  </div>
                </div>
                {currentLogo1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLogo("logo1")}
                    className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 dark:text-rose-400"
                    title="Hapus Logo 1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                )}
              </div>

              {/* Preview Box & Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-2 shadow-xs dark:border-slate-700 dark:bg-slate-900">
                  {currentLogo1 ? (
                    <img
                      src={currentLogo1}
                      alt="Logo 1 Preview"
                      className="h-full w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-6 w-6 text-slate-400" />
                      <span className="text-[9px] font-medium text-slate-400">Belum Ada</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  {/* Tombol Utama Unggah Logo 1 */}
                  <button
                    type="button"
                    id="btn-upload-logo-1"
                    onClick={() => fileInputRef1.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    Tombol Unggah Logo 1
                  </button>

                  {/* Preset Options */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 self-center">Pilihan Cepat:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("logo1", PRESET_LOGOS.tutwuri, "Tut Wuri Handayani")}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Tut Wuri
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("logo1", PRESET_LOGOS.kemenag, "Kemenag RI")}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Kemenag
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("logo1", PRESET_LOGOS.provinsi, "Pemda")}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Pemda
                    </button>
                  </div>
                </div>
              </div>

              {/* Input URL Alternatif */}
              <div className="mt-3">
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Atau masukkan URL gambar Logo 1:
                </label>
                <input
                  type="text"
                  name="logo1Url"
                  value={formData.logo1Url || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      logo1Url: e.target.value,
                      logoKemdikbudUrl: e.target.value,
                    }));
                  }}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* KARTU LOGO 2 (KANAN) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                    2
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Logo 2 (Posisi Kanan Kop)
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Logo Resmi Satuan Pendidikan / Lambang Sekolah
                    </p>
                  </div>
                </div>
                {currentLogo2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLogo("logo2")}
                    className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 dark:text-rose-400"
                    title="Hapus Logo 2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                )}
              </div>

              {/* Preview Box & Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-2 shadow-xs dark:border-slate-700 dark:bg-slate-900">
                  {currentLogo2 ? (
                    <img
                      src={currentLogo2}
                      alt="Logo 2 Preview"
                      className="h-full w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-6 w-6 text-slate-400" />
                      <span className="text-[9px] font-medium text-slate-400">Belum Ada</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  {/* Tombol Utama Unggah Logo 2 */}
                  <button
                    type="button"
                    id="btn-upload-logo-2"
                    onClick={() => fileInputRef2.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
                  >
                    <Upload className="h-4 w-4" />
                    Tombol Unggah Logo 2
                  </button>

                  {/* Preset Options */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 self-center">Pilihan Cepat:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("logo2", PRESET_LOGOS.schoolDefault, "Logo Sekolah Default")}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Logo Sekolah
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset("logo2", PRESET_LOGOS.tutwuri, "Logo Tut Wuri")}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Tut Wuri
                    </button>
                  </div>
                </div>
              </div>

              {/* Input URL Alternatif */}
              <div className="mt-3">
                <label className="block text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  Atau masukkan URL gambar Logo 2:
                </label>
                <input
                  type="text"
                  name="logo2Url"
                  value={formData.logo2Url || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      logo2Url: e.target.value,
                      logoSchoolUrl: e.target.value,
                    }));
                  }}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* SIMULASI LANGSUNG TAMPILAN KOP SURAT */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-100/70 p-4 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Simulasi Langsung Kop Surat (Logo 1 & Logo 2):
              </span>
              <span className="text-[10px] text-slate-500">Tampilan Pratinjau Dokumen Resmi</span>
            </div>
            
            <div className="rounded-lg border border-slate-300 bg-white p-4 text-slate-900 shadow-xs dark:border-slate-700">
              <div className="flex items-center justify-between gap-3 border-b-2 border-double border-slate-800 pb-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                  {currentLogo1 ? (
                    <img src={currentLogo1} alt="Logo 1" className="max-h-12 max-w-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[8px] text-slate-400">[Logo 1]</span>
                  )}
                </div>

                <div className="flex-1 text-center">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    PEMERINTAH DAERAH PROVINSI / KABUPATEN
                  </h4>
                  <h3 className="text-xs font-extrabold uppercase text-slate-900">
                    {formData.name || "NAMA SEKOLAH / SATUAN PENDIDIKAN"}
                  </h3>
                  <p className="text-[9px] text-slate-600">
                    {formData.address || "Alamat Sekolah"} • Telp: {formData.phone || "-"} • Email: {formData.email || "-"}
                  </p>
                </div>

                <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                  {currentLogo2 ? (
                    <img src={currentLogo2} alt="Logo 2" className="max-h-12 max-w-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-[8px] text-slate-400">[Logo 2]</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Identitas Utama */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Building2 className="h-4 w-4 text-blue-600" />
            Identitas Utama Sekolah
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nama Lengkap Sekolah / Satuan Pendidikan *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Contoh: SMA NEGERI 1 NUSANTARA"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Jenjang Pendidikan
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="SD">SD / MI</option>
                <option value="SMP">SMP / MTs</option>
                <option value="SMA">SMA / MA</option>
                <option value="SMK">SMK / MAK</option>
                <option value="SLB">SLB</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                NPSN (Nomor Pokok Sekolah Nasional) *
              </label>
              <input
                type="text"
                name="npsn"
                value={formData.npsn}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                NSS (Nomor Statistik Sekolah)
              </label>
              <input
                type="text"
                name="nss"
                value={formData.nss || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Status Sekolah
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Negeri">Negeri</option>
                <option value="Swasta">Swasta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Kepala Sekolah & Tanda Tangan */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            Kepala Sekolah & Pengesahan
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nama Lengkap Kepala Sekolah (beserta gelar) *
              </label>
              <input
                type="text"
                name="headmasterName"
                value={formData.headmasterName}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                NIP Kepala Sekolah *
              </label>
              <input
                type="text"
                name="headmasterNip"
                value={formData.headmasterNip}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Alamat & Kontak */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <MapPin className="h-4 w-4 text-rose-600" />
            Alamat & Kontak Resmi
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Alamat Jalan & Nomor *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kelurahan / Desa
              </label>
              <input
                type="text"
                name="village"
                value={formData.village || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kecamatan
              </label>
              <input
                type="text"
                name="district"
                value={formData.district || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kabupaten / Kota *
              </label>
              <input
                type="text"
                name="regency"
                value={formData.regency}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Provinsi *
              </label>
              <input
                type="text"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nomor Telepon
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Sekolah
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Globe className="h-4 w-4 text-indigo-600" />
            Visi & Misi Satuan Pendidikan
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Visi Sekolah
              </label>
              <textarea
                name="vision"
                rows={4}
                value={formData.vision || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Misi Sekolah
              </label>
              <textarea
                name="mission"
                rows={4}
                value={formData.mission || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            id="btn-save-school-profile"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
          >
            <Save className="h-4 w-4" />
            Simpan Perubahan Profil Sekolah
          </button>
        </div>
      </form>
    </div>
  );
};
