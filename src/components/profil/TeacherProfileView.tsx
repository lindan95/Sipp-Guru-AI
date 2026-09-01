import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { TeacherProfile } from "../../types";
import { User, Save, Award, Mail, Phone, MapPin, Briefcase, GraduationCap, Upload, Trash2, Camera } from "lucide-react";

export const TeacherProfileView: React.FC = () => {
  const { teacherProfile, saveTeacherProfile, addToast } = useApp();
  const [formData, setFormData] = useState<TeacherProfile>({ ...teacherProfile });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        addToast("error", "File Terlalu Besar", "Ukuran foto maksimal 3 MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          photoUrl: result,
        }));
        addToast("success", "Foto Guru Berhasil Diunggah", "Foto profil guru berhasil diperbarui.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: "",
    }));
    addToast("info", "Foto Dihapus", "Foto profil guru telah dikosongkan.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTeacherProfile({ ...formData, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Profil Guru Pendidik
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Identitas pendidik yang akan digunakan dalam seluruh dokumen perangkat ajar, lembar pengesahan, dan administrasi guru.
        </p>
      </div>

      {/* Hidden File Input for Teacher Photo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Personal & Foto */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <User className="h-4 w-4 text-blue-600" />
            Identitas Personal & Foto Guru
          </h3>

          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Foto Profil Preview Card */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <img
                  src={
                    formData.photoUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                  }
                  alt={formData.fullName}
                  className="h-32 w-32 rounded-2xl border-2 border-blue-500 object-cover shadow-sm transition-transform group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-slate-950/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  title="Ganti Foto Guru"
                >
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-[10px] font-semibold">Ganti Foto</span>
                </button>
              </div>
              <span className="text-[10px] font-medium text-slate-400">Pratinjau Pas Foto</span>
            </div>

            <div className="flex-1 space-y-4">
              {/* Tombol Upload & Kontrol Foto */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                      Foto Profil Guru (Pas Foto Resmi)
                    </label>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Gunakan foto formal berlatar polos (Format: PNG, JPG, WebP - Maks 3MB)
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      id="btn-upload-foto-guru"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Foto Guru
                    </button>

                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400 transition-all"
                        title="Hapus Foto"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                {/* Input URL Alternatif (Kecil/Opsional) */}
                <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
                  <label className="block text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    Atau gunakan tautan URL foto eksternal:
                  </label>
                  <input
                    type="text"
                    name="photoUrl"
                    value={formData.photoUrl || ""}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nama Lengkap & Gelar Akademik *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Jenis Kelamin
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kepegawaian & Sertifikasi */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Award className="h-4 w-4 text-amber-500" />
            Data Kepegawaian & Sertifikasi Pendidik
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                NIP (Nomor Induk Pegawai)
              </label>
              <input
                type="text"
                name="nip"
                value={formData.nip || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                NUPTK
              </label>
              <input
                type="text"
                name="nuptk"
                value={formData.nuptk || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                NRG (Nomor Registrasi Guru)
              </label>
              <input
                type="text"
                name="nrg"
                value={formData.nrg || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pangkat / Golongan / Status
              </label>
              <input
                type="text"
                name="rank"
                value={formData.rank || ""}
                onChange={handleChange}
                placeholder="Contoh: Penata Muda / IX (PPPK)"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mata Pelajaran Utama Diampu *
              </label>
              <input
                type="text"
                name="mainSubject"
                value={formData.mainSubject}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tugas Tambahan / Jabatan
              </label>
              <input
                type="text"
                name="position"
                value={formData.position || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Pendidikan Terakhir & Kampus
              </label>
              <input
                type="text"
                name="lastEducation"
                value={formData.lastEducation || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Kota Titimangsa Tanda Tangan *
              </label>
              <input
                type="text"
                name="signaturePlace"
                value={formData.signaturePlace || "Jakarta"}
                onChange={handleChange}
                required
                placeholder="Contoh: Jakarta"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Mail className="h-4 w-4 text-emerald-600" />
            Kontak & Domisili
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nomor WhatsApp / HP
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
                Email Pribadi / Belajar.id
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Alamat Domisili
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            id="btn-save-teacher-profile"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
          >
            <Save className="h-4 w-4" />
            Simpan Perubahan Profil Guru
          </button>
        </div>
      </form>
    </div>
  );
};
