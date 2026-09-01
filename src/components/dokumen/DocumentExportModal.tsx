import React, { useRef, useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Printer,
  FileDown,
  X,
  Copy,
  ExternalLink,
  CheckCircle,
  School,
  FileText,
  RotateCcw,
  LayoutTemplate,
} from "lucide-react";

export const DocumentExportModal: React.FC = () => {
  const { previewDoc, setPreviewDoc, schoolProfile, teacherProfile, addToast } = useApp();
  const printRef = useRef<HTMLDivElement>(null);

  const isWideDocDefault = React.useMemo(() => {
    const wideTypes = [
      "BUKU_NILAI_DOCUMENT",
      "REKAP_KEHADIRAN_DOCUMENT",
      "REKAP_BELAJAR_DOCUMENT",
      "PENILAIAN_TUGAS_DOCUMENT",
      "ASESMEN_PERBAB_DOCUMENT",
      "BUKU_CATATAN_BAB_DOCUMENT",
      "JADWAL_MENGAJAR_DOCUMENT",
    ];
    return wideTypes.includes(previewDoc?.docType || "") || previewDoc?.dataObj?.orientation === "landscape";
  }, [previewDoc]);

  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    isWideDocDefault ? "landscape" : "portrait"
  );

  useEffect(() => {
    if (previewDoc) {
      setOrientation(isWideDocDefault ? "landscape" : "portrait");
    }
  }, [previewDoc, isWideDocDefault]);

  if (!previewDoc) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (printRef.current) {
      navigator.clipboard.writeText(printRef.current.innerText);
      addToast("success", "Teks Disalin", "Seluruh teks dokumen berhasil disalin ke clipboard.");
    }
  };

  const todayStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { title, docType, dataObj } = previewDoc;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-2 sm:p-4 backdrop-blur-xs">
      {/* Dynamic Print CSS for Page Orientation */}
      <style>{`
        @media print {
          @page {
            size: A4 ${orientation};
            margin: ${orientation === "landscape" ? "8mm 10mm" : "12mm 15mm"};
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
          }
          .print-doc-container {
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>

      <div className={`flex h-[95vh] w-full ${orientation === "landscape" ? "max-w-6xl xl:max-w-7xl" : "max-w-4xl"} flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-200`}>
        {/* Modal Toolbar (Non-printed) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-3 dark:border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pratinjau Dokumen Resmi & Cetak PDF
                </h3>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {orientation === "landscape" ? "Kertas Landscape (Mendatar)" : "Kertas Portrait (Tegak)"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Orientation Switcher */}
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-0.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setOrientation("portrait")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors ${
                  orientation === "portrait"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
                title="Cetak Kertas Tegak (Portrait)"
              >
                <span className="inline-block h-3.5 w-2.5 rounded-[1px] border border-current" />
                Portrait
              </button>
              <button
                type="button"
                onClick={() => setOrientation("landscape")}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-colors ${
                  orientation === "landscape"
                    ? "bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
                title="Cetak Kertas Mendatar (Landscape) - Direkomendasikan untuk Buku Nilai"
              >
                <span className="inline-block h-2.5 w-3.5 rounded-[1px] border border-current" />
                Landscape
              </button>
            </div>

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200"
            >
              <Copy className="h-3.5 w-3.5" />
              Salin Teks
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Cetak / Simpan PDF
            </button>

            <button
              onClick={() => setPreviewDoc(null)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 dark:bg-slate-950">
          <div
            ref={printRef}
            className={`mx-auto ${
              orientation === "landscape"
                ? "w-full max-w-[1120px] min-h-[720px] p-6 sm:p-10 text-[11px]"
                : "w-full max-w-[800px] min-h-[1050px] p-8 sm:p-12 text-[12px]"
            } bg-white text-slate-900 shadow-lg print:m-0 print:w-full print:max-w-none print:p-0 print:shadow-none font-serif leading-relaxed print-doc-container transition-all duration-200`}
          >
            {/* Kop Surat Sekolah Standar Kedinasan */}
            <div className="border-b-[3px] border-double border-slate-900 pb-3 mb-6">
              <div className="flex items-center justify-between gap-3">
                {/* Logo 1 (Kiri) */}
                <div className="w-16 sm:w-20 shrink-0 flex items-center justify-center">
                  {(schoolProfile.logo1Url || schoolProfile.logoKemdikbudUrl) ? (
                    <img
                      src={schoolProfile.logo1Url || schoolProfile.logoKemdikbudUrl}
                      alt="Logo 1"
                      className="max-h-16 sm:max-h-20 max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 border border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400 font-sans">
                      Logo 1
                    </div>
                  )}
                </div>

                {/* Teks Kop Surat Tengah */}
                <div className="flex-1 text-center">
                  <h4 className="text-[11px] uppercase tracking-wider font-bold">
                    PEMERINTAH DAERAH PROVINSI / KABUPATEN / KOTA
                  </h4>
                  <h4 className="text-[11px] uppercase tracking-wider font-bold">
                    DINAS PENDIDIKAN DAN KEBUDAYAAN
                  </h4>
                  <h2 className="text-base sm:text-lg uppercase tracking-wider font-extrabold text-slate-900 mt-0.5">
                    {schoolProfile.name}
                  </h2>
                  <p className="text-[10px] text-slate-700 font-sans mt-0.5">
                    {schoolProfile.address} • Telp: {schoolProfile.phone || "-"} • Email: {schoolProfile.email || "-"} • Website: {schoolProfile.website || "-"}
                  </p>
                  <p className="text-[9px] text-slate-500 font-sans">
                    NPSN: {schoolProfile.npsn} • NSS: {schoolProfile.nss || "-"} • Kode Pos: {schoolProfile.postalCode || "-"}
                  </p>
                </div>

                {/* Logo 2 (Kanan) */}
                <div className="w-16 sm:w-20 shrink-0 flex items-center justify-center">
                  {(schoolProfile.logo2Url || schoolProfile.logoSchoolUrl) ? (
                    <img
                      src={schoolProfile.logo2Url || schoolProfile.logoSchoolUrl}
                      alt="Logo 2"
                      className="max-h-16 sm:max-h-20 max-w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 border border-dashed border-slate-300 rounded flex items-center justify-center text-[9px] text-slate-400 font-sans">
                      Logo 2
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Title Header (Hidden for MODUL_AJAR_DOCUMENT which has its own official header banner & identity table) */}
            {docType !== "MODUL_AJAR_DOCUMENT" && (
              <div className="text-center my-4 font-sans">
                <h1 className="text-sm font-extrabold uppercase tracking-wide underline underline-offset-4">
                  {title}
                </h1>
                <p className="text-[11px] font-semibold text-slate-600 mt-1">
                  Tahun Ajaran: {dataObj?.academicYear || "2024/2025"} • Semester: {dataObj?.semester || "Ganjil"}
                </p>
              </div>
            )}

            {/* Document Dynamic Body Content Based on Type */}
            <div className="my-6 space-y-4 font-sans text-xs">
              {/* RPP / MODUL AJAR PEMBELAJARAN MENDALAM PREVIEW */}
              {docType === "MODUL_AJAR_DOCUMENT" && dataObj?.modul && (
                <div className="space-y-6 text-xs font-sans print:text-black">
                  {/* Title Banner */}
                  <div className="text-center space-y-1 mb-4">
                    <h2 className="text-base font-bold text-red-700 uppercase tracking-wide">
                      RENCANA PEMBELAJARAN MENDALAM
                    </h2>
                    <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide">
                      {(dataObj.modul.topikPembelajaran || dataObj.modul.title || "").replace(/^(?:(?:RPP|Modul Ajar|Rencana Pelaksanaan Pembelajaran)(?:\s+Pembelajaran\s+Mendalam)?\s*:\s*)+/gi, "")}
                    </h3>
                  </div>

                  {/* IDENTITAS */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      IDENTITAS
                    </div>
                    <table className="w-full text-[11px] border-collapse">
                      <tbody>
                        <tr>
                          <td className="py-0.5 w-40 font-semibold text-slate-800">Nama Penyusun</td>
                          <td className="py-0.5 w-4 text-center">:</td>
                          <td className="py-0.5 text-slate-900 font-medium">{teacherProfile.fullName || "SUDIRMAN, S.Pd."}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-800">Satuan Pendidikan</td>
                          <td className="py-0.5 text-center">:</td>
                          <td className="py-0.5 text-slate-900">{schoolProfile.name || "SMA Negeri 05 Bombana"}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-800">Tahun Penyusunan</td>
                          <td className="py-0.5 text-center">:</td>
                          <td className="py-0.5 text-slate-900">{dataObj.modul.tahunPenyusunan || "2026/2027"}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-800">Mata Pelajaran</td>
                          <td className="py-0.5 text-center">:</td>
                          <td className="py-0.5 text-slate-900">{dataObj.subject?.name || "Fisika"}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-800">Fase/Kelas/Semester</td>
                          <td className="py-0.5 text-center">:</td>
                          <td className="py-0.5 text-slate-900">
                            {dataObj.modul.phase || "E"} / {dataObj.classInfo?.name || "X (sepuluh)"} / {dataObj.modul.semester || "Ganjil"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-800">Topik</td>
                          <td className="py-0.5 text-center">:</td>
                          <td className="py-0.5 text-slate-900 font-semibold">{dataObj.modul.topikPembelajaran || dataObj.modul.title}</td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-800">Sub Topik</td>
                          <td className="py-0.5 text-center">:</td>
                          <td className="py-0.5 text-slate-900">
                            {dataObj.modul.subTopik || `${dataObj.modul.title}, Metode Ilmiah, Keselamatan Kerja di Laboratorium, & Peran dalam Kehidupan`}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-0.5 font-semibold text-slate-800">Alokasi Waktu</td>
                          <td className="py-0.5 text-center">:</td>
                          <td className="py-0.5 text-slate-900 font-semibold">
                            {dataObj.modul.allocatedHours || dataObj.modul.duration || "14 JP (14 × 45 menit) / 5 kali Pertemuan"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* IDENTIFIKASI */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      IDENTIFIKASI
                    </div>
                    <div className="space-y-3 text-[11px] leading-relaxed">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">A. KESIAPAN MURID</h4>
                        {dataObj.modul.kesiapanMuridList && dataObj.modul.kesiapanMuridList.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {dataObj.modul.kesiapanMuridList.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="whitespace-pre-line">{dataObj.modul.identifikasiPesertaDidik || "Murid telah mempelajari konsep dasar IPA di jenjang sebelumnya dan terbiasa menggunakan perangkat digital."}</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">B. KARAKTERISTIK MATERI PELAJARAN</h4>
                        {dataObj.modul.karakteristikMateriList && dataObj.modul.karakteristikMateriList.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {dataObj.modul.karakteristikMateriList.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="whitespace-pre-line">{dataObj.modul.identifikasiMateri || "Materi bersifat fondasi dasar yang mengombinasikan aspek kognitif dan psikomotorik keselamatan kerja."}</p>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">C. DIMENSI PROFIL LULUSAN</h4>
                        <p className="mb-1 text-slate-700">Dimensi profil lulusan yang akan dicapai yaitu sebagai berikut:</p>
                        {dataObj.modul.dimensiProfilLulusanDetail && dataObj.modul.dimensiProfilLulusanDetail.length > 0 ? (
                          <ol className="list-decimal pl-5 space-y-1.5">
                            {dataObj.modul.dimensiProfilLulusanDetail.map((dim: any, idx: number) => (
                              <li key={idx}>
                                <strong>{dim.nama}:</strong> {dim.deskripsi}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <ol className="list-decimal pl-5 space-y-1.5">
                            {(dataObj.modul.dimensiProfilLulusan || [
                              "Keimanan dan Ketakwaan terhadap Tuhan YME",
                              "Penalaran Kritis",
                              "Kolaborasi",
                              "Kemandirian",
                              "Komunikasi"
                            ]).map((dim: string, idx: number) => (
                              <li key={idx}>
                                <strong>{dim}:</strong> Murid mampu menginternalisasi dan mengaplikasikan nilai {dim.toLowerCase()} dalam proses penyelidikan dan pembelajaran.
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DESAIN PEMBELAJARAN */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      DESAIN PEMBELAJARAN
                    </div>
                    <div className="space-y-3 text-[11px] leading-relaxed">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-0.5">A. CAPAIAN PEMBELAJARAN</h4>
                        <p>{dataObj.modul.capaianPembelajaran || "Pada akhir fase E, murid memiliki kemampuan untuk menggunakan sistem pengukuran dalam kerja ilmiah; menganalisis pemanfaatan energi alternatif; dan menerapkan konsep IPA Fisika."}</p>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-0.5">B. TUJUAN PEMBELAJARAN</h4>
                        <ol className="list-decimal pl-5 space-y-1">
                          {(dataObj.modul.tujuanPembelajaran || [
                            "Murid dapat mendeskripsikan hakikat fisika (sebagai produk, proses, dan sikap).",
                            "Murid dapat mendeskripsikan dan menerapkan langkah-langkah metode ilmiah.",
                            "Murid dapat mendeskripsikan prosedur keselamatan kerja di Laboratorium.",
                            "Murid dapat menjelaskan peran fisika dalam berbagai bidang kehidupan."
                          ]).map((tp: string, idx: number) => (
                            <li key={idx}>{tp}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-0.5">C. PRAKTIK PEDAGOGIS</h4>
                        <ul className="list-disc pl-5 space-y-0.5">
                          <li><strong>Model Pembelajaran:</strong> {dataObj.modul.praktikPedagogis || dataObj.modul.model || "Inquiry Learning dan Discovery Learning"}</li>
                          <li><strong>Pendekatan:</strong> {dataObj.modul.pendekatan || "Contextual Teaching and Learning (CTL), diferensiasi"}</li>
                          <li><strong>Metode Pembelajaran:</strong> {dataObj.modul.metodePembelajaran || "Observasi, diskusi kelompok, simulasi, dan presentasi"}</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-0.5">D. LINGKUNGAN PEMBELAJARAN</h4>
                        {dataObj.modul.lingkunganPembelajaranList && dataObj.modul.lingkunganPembelajaranList.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-0.5">
                            {dataObj.modul.lingkunganPembelajaranList.map((item: string, idx: number) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <ul className="list-disc pl-5 space-y-0.5">
                            <li>Ruang kelas dan laboratorium fisika.</li>
                            <li>Lingkungan sekitar sekolah untuk observasi fenomena.</li>
                            <li>Media berupa proyektor, poster simbol bahaya, alat laboratorium dasar.</li>
                          </ul>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-0.5">E. PEMANFAATAN DIGITAL</h4>
                        {dataObj.modul.pemanfaatanDigitalList && dataObj.modul.pemanfaatanDigitalList.length > 0 ? (
                          <ul className="list-disc pl-5 space-y-0.5">
                            {dataObj.modul.pemanfaatanDigitalList.map((item: any, idx: number) => (
                              <li key={idx}><strong>{item.kategori}:</strong> {item.detail}</li>
                            ))}
                          </ul>
                        ) : (
                          <ul className="list-disc pl-5 space-y-0.5">
                            <li><strong>Platform Asesmen:</strong> Wayground atau Kahoot.</li>
                            <li><strong>Sumber Belajar:</strong> Video YouTube tentang sejarah fisika dan kecelakaan kerja di Laboratorium.</li>
                            <li><strong>Virtual Lab:</strong> Simulasi sederhana atau video demonstrasi prosedur laboratorium.</li>
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PENGALAMAN BELAJAR */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      PENGALAMAN BELAJAR
                    </div>
                    <div className="space-y-4 text-[11px] leading-relaxed">
                      {/* Kegiatan Pendahuluan */}
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">A. KEGIATAN PENDAHULUAN</h4>
                        {dataObj.modul.kegiatanPendahuluanSteps && dataObj.modul.kegiatanPendahuluanSteps.length > 0 ? (
                          <ol className="list-decimal pl-5 space-y-1.5">
                            {dataObj.modul.kegiatanPendahuluanSteps.map((step: string, idx: number) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        ) : (
                          <p className="whitespace-pre-line pl-2">{dataObj.modul.kegiatanAwal}</p>
                        )}
                        {dataObj.modul.asesmenAwalUrl && (
                          <div className="mt-2 pl-5 text-blue-700 text-[10px] break-all font-mono">
                            {dataObj.modul.asesmenAwalUrl}
                          </div>
                        )}
                      </div>

                      {/* Kegiatan Inti (Per-Meeting) */}
                      <div>
                        <h4 className="font-bold text-slate-900 mb-2">B. KEGIATAN INTI</h4>
                        {dataObj.modul.kegiatanIntiPertemuan && dataObj.modul.kegiatanIntiPertemuan.length > 0 ? (
                          <div className="space-y-4">
                            {dataObj.modul.kegiatanIntiPertemuan.map((meet: any, mIdx: number) => (
                              <div key={mIdx} className="space-y-2 border-l-2 border-red-700 pl-3">
                                <h5 className="font-bold text-red-800 text-xs">{meet.pertemuan}</h5>
                                <ol className="list-decimal pl-4 space-y-1.5">
                                  {meet.steps?.map((st: any, sIdx: number) => (
                                    <li key={sIdx}>
                                      <strong>{st.judul}:</strong> {st.deskripsi}
                                    </li>
                                  ))}
                                </ol>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2 pl-2">
                            <p><strong>1. Memahami:</strong> {dataObj.modul.pengalamanMemahami}</p>
                            <p><strong>2. Mengaplikasi:</strong> {dataObj.modul.pengalamanMengaplikasi}</p>
                            <p><strong>3. Merefleksi:</strong> {dataObj.modul.pengalamanMerefleksi}</p>
                          </div>
                        )}
                      </div>

                      {/* Kegiatan Penutup */}
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">C. KEGIATAN PENUTUP</h4>
                        {dataObj.modul.kegiatanPenutupSteps && dataObj.modul.kegiatanPenutupSteps.length > 0 ? (
                          <ol className="list-decimal pl-5 space-y-1.5">
                            {dataObj.modul.kegiatanPenutupSteps.map((step: string, idx: number) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        ) : (
                          <p className="whitespace-pre-line pl-2">{dataObj.modul.kegiatanPenutup}</p>
                        )}
                        {dataObj.modul.asesmenAkhirUrl && (
                          <div className="mt-2 pl-5 text-blue-700 text-[10px] break-all font-mono">
                            {dataObj.modul.asesmenAkhirUrl}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ASESMEN PEMBELAJARAN */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      ASESMEN PEMBELAJARAN
                    </div>
                    <div className="space-y-4 text-[11px]">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">A. Asesmen Awal (Assessment for Learning)</h4>
                        <table className="w-full border-collapse border border-slate-400">
                          <thead>
                            <tr className="bg-red-700 text-white font-bold text-center">
                              <th className="border border-slate-400 py-1 px-2 w-1/4">Jenis</th>
                              <th className="border border-slate-400 py-1 px-2 w-1/3">Instrumen</th>
                              <th className="border border-slate-400 py-1 px-2">Deskripsi</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-slate-400 p-2 align-top font-medium">{dataObj.modul.asesmenTable?.awal?.jenis || "Tes diagnostik kognitif"}</td>
                              <td className="border border-slate-400 p-2 align-top">{dataObj.modul.asesmenTable?.awal?.instrumen || "Pertanyaan tertulis"}</td>
                              <td className="border border-slate-400 p-2 align-top">{dataObj.modul.asesmenTable?.awal?.deskripsi || "Disajikan lima soal pilihan ganda tentang konsep IPA di SMP."}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">B. Asesmen Proses (Assessment as Learning)</h4>
                        <table className="w-full border-collapse border border-slate-400">
                          <thead>
                            <tr className="bg-red-700 text-white font-bold text-center">
                              <th className="border border-slate-400 py-1 px-2 w-1/4">Jenis</th>
                              <th className="border border-slate-400 py-1 px-2 w-1/3">Instrumen</th>
                              <th className="border border-slate-400 py-1 px-2">Deskripsi</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-slate-400 p-2 align-top font-medium">{dataObj.modul.asesmenTable?.proses?.jenis || "Observasi"}</td>
                              <td className="border border-slate-400 p-2 align-top">{dataObj.modul.asesmenTable?.proses?.instrumen || "Lembar observasi kinerja"}</td>
                              <td className="border border-slate-400 p-2 align-top">{dataObj.modul.asesmenTable?.proses?.deskripsi || "Menilai kolaborasi, penalaran kritis, dan komunikasi saat diskusi dan praktikum."}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">C. Asesmen Akhir (Assessment of Learning)</h4>
                        <table className="w-full border-collapse border border-slate-400">
                          <thead>
                            <tr className="bg-red-700 text-white font-bold text-center">
                              <th className="border border-slate-400 py-1 px-2 w-1/4">Jenis</th>
                              <th className="border border-slate-400 py-1 px-2 w-1/3">Instrumen</th>
                              <th className="border border-slate-400 py-1 px-2">Deskripsi</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-slate-400 p-2 align-top font-medium">{dataObj.modul.asesmenTable?.akhir?.jenis || "Tes tertulis"}</td>
                              <td className="border border-slate-400 p-2 align-top">{dataObj.modul.asesmenTable?.akhir?.instrumen || "Soal pilihan ganda"}</td>
                              <td className="border border-slate-400 p-2 align-top">{dataObj.modul.asesmenTable?.akhir?.deskripsi || "Soal pilihan ganda (10 soal) untuk menguji pemahaman murid."}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* REFLEKSI */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      REFLEKSI
                    </div>
                    <div className="space-y-4 text-[11px]">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">A. Refleksi Murid</h4>
                        <table className="w-full border-collapse border border-slate-400">
                          <thead>
                            <tr className="bg-red-700 text-white font-bold text-center">
                              <th className="border border-slate-400 py-1 px-2 w-10">No.</th>
                              <th className="border border-slate-400 py-1 px-2 w-44">Aspek</th>
                              <th className="border border-slate-400 py-1 px-2">Refleksi Murid</th>
                              <th className="border border-slate-400 py-1 px-2 w-32">Jawaban</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(dataObj.modul.refleksiMuridTable || [
                              { no: 1, aspek: "Perasaan dalam belajar", refleksi: "Bagaimana perasaan Anda setelah melakukan kegiatan pembelajaran hari ini?" },
                              { no: 2, aspek: "Makna", refleksi: "Apa yang telah Anda ketahui/pahami tentang materi fisika hari ini?" },
                              { no: 3, aspek: "Tantangan", refleksi: "Apa saja tantangan pembelajaran hari ini?" }
                            ]).map((row: any, idx: number) => (
                              <tr key={idx}>
                                <td className="border border-slate-400 p-2 text-center">{row.no || idx + 1}</td>
                                <td className="border border-slate-400 p-2 font-medium">{row.aspek}</td>
                                <td className="border border-slate-400 p-2">{row.refleksi}</td>
                                <td className="border border-slate-400 p-2 text-slate-400 italic text-center">{row.jawaban || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">B. Refleksi Guru</h4>
                        <table className="w-full border-collapse border border-slate-400">
                          <thead>
                            <tr className="bg-red-700 text-white font-bold text-center">
                              <th className="border border-slate-400 py-1 px-2 w-10">No.</th>
                              <th className="border border-slate-400 py-1 px-2 w-44">Aspek</th>
                              <th className="border border-slate-400 py-1 px-2">Refleksi Guru</th>
                              <th className="border border-slate-400 py-1 px-2 w-32">Jawaban</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(dataObj.modul.refleksiGuruTable || [
                              { no: 1, aspek: "Penguasaan materi", refleksi: "Apakah saya sudah memahami dengan baik materi dan aktivitas pembelajaran hari ini?" },
                              { no: 2, aspek: "Penyampaian materi", refleksi: "Apakah materi hari ini sudah tersampaikan dengan cukup baik kepada murid?" },
                              { no: 3, aspek: "Umpan balik", refleksi: "Apakah 100% murid telah mencapai penguasaan tujuan pembelajaran yang ingin dicapai?" }
                            ]).map((row: any, idx: number) => (
                              <tr key={idx}>
                                <td className="border border-slate-400 p-2 text-center">{row.no || idx + 1}</td>
                                <td className="border border-slate-400 p-2 font-medium">{row.aspek}</td>
                                <td className="border border-slate-400 p-2">{row.refleksi}</td>
                                <td className="border border-slate-400 p-2 text-slate-400 italic text-center">{row.jawaban || "-"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* REMEDIAL & PENGAYAAN */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      REMEDIAL & PENGAYAAN
                    </div>
                    <div className="space-y-3 text-[11px] leading-relaxed">
                      <div>
                        <h4 className="font-bold text-slate-900 mb-0.5">A. Remedial</h4>
                        <p>{dataObj.modul.remedialText || "Pembimbingan perorangan bagi murid yang belum memahami urutan metode ilmiah atau simbol keselamatan kerja."}</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-0.5">B. Pengayaan</h4>
                        <p>{dataObj.modul.pengayaanText || "Pengayaan dilaksanakan bagi murid yang telah mencapai KKTP dengan belajar mandiri untuk lebih mendalami dan mengembangkan materi lebih lanjut. Murid dapat membuat karya tulis singkat/vlog mengenai tokoh fisika dunia dan bagaimana metode ilmiah mengubah hidup mereka."}</p>
                      </div>
                    </div>
                  </div>

                  {/* GLOSARIUM */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      GLOSARIUM
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      {dataObj.modul.glosariumItems && dataObj.modul.glosariumItems.length > 0 ? (
                        dataObj.modul.glosariumItems.map((item: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-12 gap-2">
                            <span className="col-span-4 font-semibold text-slate-900">{item.istilah}</span>
                            <span className="col-span-1 text-center">:</span>
                            <span className="col-span-7">{item.definisi}</span>
                          </div>
                        ))
                      ) : (
                        <p className="whitespace-pre-line">{dataObj.modul.glosarium || "Hakikat Fisika : Fisika sebagai kumpulan pengetahuan (produk), cara penyelidikan (proses), dan cara berpikir (sikap)."}</p>
                      )}
                    </div>
                  </div>

                  {/* DAFTAR PUSTAKA */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      DAFTAR PUSTAKA
                    </div>
                    {dataObj.modul.daftarPustakaList && dataObj.modul.daftarPustakaList.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-[11px]">
                        {dataObj.modul.daftarPustakaList.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="space-y-1 text-[11px]">
                        <p>Lasmi, Ketut. (2021). <em>Buku Fisika untuk SMA/MA Kelas XI</em>. Jakarta: Erlangga.</p>
                        <p>Lasmi, Ketut. (2023). <em>Buku Mandiri Plus Fisika untuk SMA/MA Kelas XI</em>. Jakarta: Erlangga.</p>
                        <p>Sunardi, dkk. (2024). <em>Praktikum Fisika untuk SMA/MA Kelas X</em>. Jakarta: Yrama Widya.</p>
                      </div>
                    )}
                  </div>

                  {/* LAMPIRAN TAUTAN */}
                  <div>
                    <div className="bg-red-700 text-white font-bold text-xs py-1 px-3 text-center uppercase tracking-wider mb-3">
                      LAMPIRAN
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-4 font-semibold text-slate-800">Lembar Kerja Murid (LKM)</span>
                        <span className="col-span-1 text-center">:</span>
                        <span className="col-span-7 text-blue-700 underline font-mono text-[10px] break-all">
                          {dataObj.modul.lampiranLinks?.lkm || "https://drive.google.com/drive/folders/1iZNsY6oYGrAVgUvdPegxUf6xKxD1zxz?usp=sharing"}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-4 font-semibold text-slate-800">Instrumen Penilaian</span>
                        <span className="col-span-1 text-center">:</span>
                        <span className="col-span-7 text-blue-700 underline font-mono text-[10px] break-all">
                          {dataObj.modul.lampiranLinks?.instrumenPenilaian || "https://drive.google.com/drive/folders/1URILz6TeuhrHtexKe0Vi9N-oYCZsWlx6?usp=sharing"}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-4 font-semibold text-slate-800">Bahan Ajar</span>
                        <span className="col-span-1 text-center">:</span>
                        <span className="col-span-7 text-blue-700 underline font-mono text-[10px] break-all">
                          {dataObj.modul.lampiranLinks?.bahanAjar || "https://drive.google.com/drive/folders/1BedmI_d3evoQLjQoqnxpVEWCt9Qe1sj5?usp=sharing"}
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <span className="col-span-4 font-semibold text-slate-800">Media Ajar</span>
                        <span className="col-span-1 text-center">:</span>
                        <span className="col-span-7 text-blue-700 underline font-mono text-[10px] break-all">
                          {dataObj.modul.lampiranLinks?.mediaAjar || "https://drive.google.com/drive/folders/1QaWIpe55QhBQIIu-Pb6hM1RmEaMUuf1-?usp=sharing"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TANDA TANGAN */}
                  <div className="pt-8 grid grid-cols-2 gap-8 text-[11px]">
                    <div>
                      <p>Mengetahui,</p>
                      <p className="font-semibold">Kepala Sekolah</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline uppercase">{schoolProfile.principalName || dataObj.modul.titimangsa?.kepalaSekolahNama || "ASMAR, S.Pd., M.Pd."}</p>
                      <p>NIP. {schoolProfile.principalNip || dataObj.modul.titimangsa?.kepalaSekolahNip || "19760604 200604 1 017"}</p>
                    </div>
                    <div className="text-right">
                      <p>{schoolProfile.district || dataObj.modul.titimangsa?.tempat || "Dongkala"}, {dataObj.modul.titimangsa?.tanggal || "Juli 2026"}</p>
                      <p className="font-semibold">{dataObj.modul.titimangsa?.guruJabatan || "Guru Mapel Fisika X-2, X-3 dan X-4"}</p>
                      <div className="h-16"></div>
                      <p className="font-bold underline uppercase">{teacherProfile.fullName || dataObj.modul.titimangsa?.guruNama || "SUDIRMAN, S.Pd."}</p>
                      <p>NIP. {teacherProfile.nip || dataObj.modul.titimangsa?.guruNip || "19951231 202521 2 023"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* LKPD DOCUMENT PREVIEW */}
              {docType === "LKPD_DOCUMENT" && dataObj?.lkpd && (
                <div className="space-y-4 text-xs">
                  <div className="border p-3 rounded-lg bg-slate-50">
                    <p><strong>Mata Pelajaran:</strong> {dataObj.subject?.name}</p>
                    <p><strong>Fase / Kelas:</strong> {dataObj.lkpd.phase} / {dataObj.classInfo?.name}</p>
                    <p><strong>Petunjuk:</strong> {dataObj.lkpd.instructions}</p>
                  </div>

                  <div className="border p-3 rounded-lg">
                    <strong className="block text-slate-900 mb-1">Stimulus / Kasus Nyata:</strong>
                    <p className="leading-relaxed">{dataObj.lkpd.stimulus}</p>
                  </div>

                  <div>
                    <strong className="block text-slate-900 mb-2">Tugas / Aktivitas Siswa:</strong>
                    <ol className="list-decimal pl-5 space-y-2">
                      {dataObj.lkpd.tasks?.map((t: string, idx: number) => (
                        <li key={idx} className="leading-relaxed">{t}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="border-t pt-2">
                    <p><strong>Refleksi Siswa:</strong> {dataObj.lkpd.reflection}</p>
                  </div>
                </div>
              )}

              {/* JADWAL MENGAJAR DOCUMENT PREVIEW */}
              {docType === "JADWAL_MENGAJAR_DOCUMENT" && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50/50">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><strong>Nama Guru:</strong> {teacherProfile.fullName}</div>
                      <div><strong>NIP:</strong> {teacherProfile.nip || "-"}</div>
                      <div><strong>Satuan Pendidikan:</strong> {schoolProfile.name}</div>
                      <div><strong>Tahun Ajaran / Sem:</strong> {dataObj?.academicYear || "2024/2025"} / {dataObj?.semester || "Ganjil"}</div>
                    </div>
                  </div>

                  {/* Summary Beban Kerja */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-[11px]">
                    <span className="font-bold text-slate-900">
                      Rincian Jadwal Pelajaran Mingguan:
                    </span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 font-bold text-blue-800 border border-blue-200">
                      Total: {dataObj?.schedules?.length || 0} Sesi Pembelajaran Tatap Muka
                    </span>
                  </div>

                  {/* Table View */}
                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead className="bg-slate-100 font-bold text-center">
                      <tr>
                        <th className="border border-slate-300 p-1.5 w-8">No</th>
                        <th className="border border-slate-300 p-1.5 w-20">Hari</th>
                        <th className="border border-slate-300 p-1.5 w-28">Waktu (Jam)</th>
                        <th className="border border-slate-300 p-1.5 w-24">Kelas</th>
                        <th className="border border-slate-300 p-1.5 text-left">Mata Pelajaran</th>
                        <th className="border border-slate-300 p-1.5 w-28">Ruangan / Lab</th>
                        <th className="border border-slate-300 p-1.5 text-left">Catatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
                        const sorted = [...(dataObj?.schedules || [])].sort((a, b) => {
                          const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
                          if (dayDiff !== 0) return dayDiff;
                          return (a.startTime || "").localeCompare(b.startTime || "");
                        });

                        if (sorted.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="border border-slate-300 p-4 text-center text-slate-400">
                                Tidak ada data jadwal mengajar.
                              </td>
                            </tr>
                          );
                        }

                        return sorted.map((sch: any, idx: number) => {
                          const cls = dataObj?.classes?.find((c: any) => c.id === sch.classId);
                          const sbj = dataObj?.subjects?.find((s: any) => s.id === sch.subjectId);
                          return (
                            <tr key={sch.id || idx}>
                              <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                              <td className="border border-slate-300 p-1.5 text-center font-bold">{sch.day}</td>
                              <td className="border border-slate-300 p-1.5 text-center font-mono">{sch.startTime} - {sch.endTime}</td>
                              <td className="border border-slate-300 p-1.5 text-center font-semibold">{cls?.name || sch.classId}</td>
                              <td className="border border-slate-300 p-1.5">{sbj?.name || sch.subjectId}</td>
                              <td className="border border-slate-300 p-1.5 text-center">{sch.room || "-"}</td>
                              <td className="border border-slate-300 p-1.5 text-slate-600">{sch.notes || "-"}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              )}

              {/* KALENDER PENDIDIKAN & HARI EFEKTIF DOCUMENT PREVIEW */}
              {docType === "KALENDER_PENDIDIKAN_DOCUMENT" && (
                <div className="space-y-4 text-xs font-sans">
                  {/* Identitas Dokumen */}
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50/50 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Satuan Pendidikan:</strong> {schoolProfile.name}</div>
                      <div><strong>Tahun Pelajaran:</strong> {dataObj?.academicYear || "2024/2025"}</div>
                      <div><strong>Dokumen:</strong> {dataObj?.mode === "semester" ? `Analisis Rincian Pekan & Hari Efektif (${dataObj?.semesterLabel})` : `Kalender Pendidikan (${dataObj?.monthName} ${dataObj?.selectedYear})`}</div>
                      <div><strong>Mata Pelajaran:</strong> {dataObj?.subject ? `${dataObj.subject.name} (${dataObj.jpPerWeek || 2} JP/Pekan)` : "Semua Mata Pelajaran"}</div>
                      {dataObj?.schoolDaysType && (
                        <div><strong>Sistem Kerja:</strong> {dataObj.schoolDaysType} Hari Sekolah (Senin - {dataObj.schoolDaysType === 5 ? "Jumat" : "Sabtu"})</div>
                      )}
                    </div>
                  </div>

                  {/* Mode SEMESTER ANALYSIS TABLE */}
                  {dataObj?.mode === "semester" && dataObj?.analysisData ? (
                    <>
                      {/* Summary Cards */}
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                        <div className="border border-slate-300 rounded p-2 bg-slate-50">
                          <span className="text-slate-500 font-semibold block">Hari Kalender (HK)</span>
                          <strong className="text-sm text-slate-900">{dataObj.totals?.totalCalendarDays || 0} Hari</strong>
                        </div>
                        <div className="border border-blue-300 rounded p-2 bg-blue-50">
                          <span className="text-blue-700 font-semibold block">Hari Efektif Sekolah (HES)</span>
                          <strong className="text-sm text-blue-800">{dataObj.totals?.effectiveSchoolDays || 0} Hari</strong>
                        </div>
                        <div className="border border-emerald-300 rounded p-2 bg-emerald-50">
                          <span className="text-emerald-700 font-semibold block">Hari Efektif Belajar (HEB)</span>
                          <strong className="text-sm text-emerald-800">{dataObj.totals?.effectiveLearningDays || 0} Hari</strong>
                        </div>
                        <div className="border border-indigo-300 rounded p-2 bg-indigo-50">
                          <span className="text-indigo-700 font-semibold block">Minggu Efektif (MEB)</span>
                          <strong className="text-sm text-indigo-800">{dataObj.totalWeeksExact || 0} Pekan</strong>
                        </div>
                      </div>

                      {/* Tabel Rincian Hari Efektif Semester */}
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1.5 text-[11px]">Tabel Analisis Rincian Hari Efektif Per Bulan:</h4>
                        <table className="w-full border-collapse border border-slate-300 text-[10px]">
                          <thead className="bg-slate-100 font-bold text-center">
                            <tr>
                              <th className="border border-slate-300 p-1 w-6">No</th>
                              <th className="border border-slate-300 p-1 text-left w-24">Bulan & Tahun</th>
                              <th className="border border-slate-300 p-1 w-10">HK</th>
                              <th className="border border-slate-300 p-1 w-8 text-rose-700">HM</th>
                              {dataObj.schoolDaysType === 5 && (
                                <th className="border border-slate-300 p-1 w-8 text-indigo-700">HS</th>
                              )}
                              <th className="border border-slate-300 p-1 w-10 text-rose-700">HLN</th>
                              <th className="border border-slate-300 p-1 w-10 text-rose-700">LKS</th>
                              <th className="border border-slate-300 p-1 w-10 bg-blue-50 text-blue-900 font-bold">HES</th>
                              <th className="border border-slate-300 p-1 w-12 text-amber-800">Non-KBM</th>
                              <th className="border border-slate-300 p-1 w-10 bg-emerald-50 text-emerald-900 font-extrabold">HEB</th>
                              <th className="border border-slate-300 p-1 w-10 bg-indigo-50 text-indigo-900 font-extrabold">MEB</th>
                              <th className="border border-slate-300 p-1 w-10 bg-amber-50 text-amber-900 font-extrabold">JP</th>
                              <th className="border border-slate-300 p-1 text-left">Keterangan Agenda</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dataObj.analysisData.map((m: any, idx: number) => (
                              <tr key={idx}>
                                <td className="border border-slate-300 p-1 text-center font-medium">{idx + 1}</td>
                                <td className="border border-slate-300 p-1 font-bold">{m.monthName} {m.year}</td>
                                <td className="border border-slate-300 p-1 text-center">{m.totalCalendarDays}</td>
                                <td className="border border-slate-300 p-1 text-center text-rose-700">{m.sundayCount}</td>
                                {dataObj.schoolDaysType === 5 && (
                                  <td className="border border-slate-300 p-1 text-center text-indigo-700">{m.saturdayCount}</td>
                                )}
                                <td className="border border-slate-300 p-1 text-center text-rose-700">{m.nationalHolidayCount}</td>
                                <td className="border border-slate-300 p-1 text-center text-rose-700">{m.semesterHolidayCount}</td>
                                <td className="border border-slate-300 p-1 text-center font-bold bg-blue-50 text-blue-900">{m.effectiveSchoolDays}</td>
                                <td className="border border-slate-300 p-1 text-center text-amber-800">{m.nonKbmDays}</td>
                                <td className="border border-slate-300 p-1 text-center font-extrabold bg-emerald-50 text-emerald-900">{m.effectiveLearningDays}</td>
                                <td className="border border-slate-300 p-1 text-center font-extrabold bg-indigo-50 text-indigo-900">{m.effectiveWeeks}</td>
                                <td className="border border-slate-300 p-1 text-center font-extrabold bg-amber-50 text-amber-900">{m.effectiveHours}</td>
                                <td className="border border-slate-300 p-1 text-[9px] leading-tight">{m.agendaSummary}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-slate-100 font-bold text-center border-t-2 border-slate-400">
                              <td colSpan={2} className="border border-slate-300 p-1 text-left font-extrabold">JUMLAH / TOTAL</td>
                              <td className="border border-slate-300 p-1">{dataObj.totals?.totalCalendarDays}</td>
                              <td className="border border-slate-300 p-1 text-rose-700">{dataObj.totals?.sundayCount}</td>
                              {dataObj.schoolDaysType === 5 && (
                                <td className="border border-slate-300 p-1 text-indigo-700">{dataObj.totals?.saturdayCount}</td>
                              )}
                              <td className="border border-slate-300 p-1 text-rose-700">{dataObj.totals?.nationalHolidayCount}</td>
                              <td className="border border-slate-300 p-1 text-rose-700">{dataObj.totals?.semesterHolidayCount}</td>
                              <td className="border border-slate-300 p-1 bg-blue-100 text-blue-900 font-extrabold">{dataObj.totals?.effectiveSchoolDays}</td>
                              <td className="border border-slate-300 p-1 text-amber-800">{dataObj.totals?.nonKbmDays}</td>
                              <td className="border border-slate-300 p-1 bg-emerald-100 text-emerald-900 font-extrabold">{dataObj.totals?.effectiveLearningDays}</td>
                              <td className="border border-slate-300 p-1 bg-indigo-100 text-indigo-900 font-extrabold">{dataObj.totalWeeksExact}</td>
                              <td className="border border-slate-300 p-1 bg-amber-100 text-amber-900 font-extrabold">{dataObj.totalLessonHours}</td>
                              <td className="border border-slate-300 p-1 text-left font-bold text-[9px]">Total {dataObj.totalWeeksExact} Pekan Efektif</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      {/* Distribusi Jam Pelajaran (JP) */}
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1.5 text-[11px]">Distribusi Alokasi Waktu Jam Pelajaran (JP):</h4>
                        <table className="w-full border-collapse border border-slate-300 text-[10px]">
                          <thead>
                            <tr className="bg-slate-100 font-bold">
                              <th className="border border-slate-300 p-1.5 text-left">Komponen Kegiatan Pembelajaran</th>
                              <th className="border border-slate-300 p-1.5 text-center w-28">Alokasi Waktu</th>
                              <th className="border border-slate-300 p-1.5 text-left">Keterangan</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-slate-300 p-1.5 font-medium">1. Jam Tatap Muka Pokok (Materi & Formatif)</td>
                              <td className="border border-slate-300 p-1.5 text-center font-bold text-blue-800">{dataObj.tatapMukaHours || 0} JP</td>
                              <td className="border border-slate-300 p-1.5 text-slate-600">Penyampaian Alur Tujuan Pembelajaran (ATP) reguler</td>
                            </tr>
                            <tr>
                              <td className="border border-slate-300 p-1.5 font-medium">2. Jam Asesmen Sumatif (ASTS & ASAS)</td>
                              <td className="border border-slate-300 p-1.5 text-center font-bold text-amber-800">{dataObj.asesmenHours || 0} JP</td>
                              <td className="border border-slate-300 p-1.5 text-slate-600">Pelaksanaan Asesmen Tengah & Akhir Semester</td>
                            </tr>
                            <tr>
                              <td className="border border-slate-300 p-1.5 font-medium">3. Jam Cadangan & Tindak Lanjut Remedial</td>
                              <td className="border border-slate-300 p-1.5 text-center font-bold text-emerald-800">{dataObj.cadanganHours || 0} JP</td>
                              <td className="border border-slate-300 p-1.5 text-slate-600">Remedial, pengayaan, dan penyesuaian kegiatan sekolah</td>
                            </tr>
                            <tr className="bg-slate-100 font-extrabold">
                              <td className="border border-slate-300 p-1.5">TOTAL ALOKASI WAKTU SEMESTER</td>
                              <td className="border border-slate-300 p-1.5 text-center text-indigo-900">{dataObj.totalLessonHours || 0} JP</td>
                              <td className="border border-slate-300 p-1.5">{dataObj.totalWeeksExact} Pekan Efektif × {dataObj.jpPerWeek || 2} JP/Pekan</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Rekapitulasi Analisis Hari Efektif Bulanan */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="border border-slate-300 rounded p-2 text-center bg-slate-50">
                          <span className="block text-[10px] text-slate-500 font-semibold">Total Hari Kalender</span>
                          <strong className="text-sm text-slate-900">{dataObj?.daysInMonth || 30} Hari</strong>
                        </div>
                        <div className="border border-emerald-300 rounded p-2 text-center bg-emerald-50">
                          <span className="block text-[10px] text-emerald-700 font-semibold">Hari Efektif Belajar (HBE)</span>
                          <strong className="text-sm text-emerald-800">{dataObj?.effectiveDaysCount || 0} Hari</strong>
                        </div>
                        <div className="border border-indigo-300 rounded p-2 text-center bg-indigo-50">
                          <span className="block text-[10px] text-indigo-700 font-semibold">Minggu Efektif Belajar (MEB)</span>
                          <strong className="text-sm text-indigo-800">{dataObj?.effectiveWeeksCount || 0} Pekan</strong>
                        </div>
                      </div>

                      {/* Matriks Kalender Sederhana */}
                      {dataObj?.daysInMonth && (
                        <div>
                          <h4 className="font-bold text-slate-900 mb-1.5 text-[11px]">Matriks Kalender {dataObj?.monthName} {dataObj?.selectedYear}:</h4>
                          <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d, i) => (
                              <div key={d} className={`font-bold p-1 border border-slate-300 ${i === 0 ? "bg-rose-100 text-rose-800" : "bg-slate-100 text-slate-700"}`}>
                                {d}
                              </div>
                            ))}
                            {Array.from({ length: dataObj.firstDayOfWeek || 0 }).map((_, i) => (
                              <div key={`emp-${i}`} className="p-1 border border-dashed border-slate-200 bg-slate-50/50" />
                            ))}
                            {Array.from({ length: dataObj.daysInMonth }).map((_, i) => {
                              const dayNum = i + 1;
                              const dateStr = `${dataObj.selectedYear}-${String(dataObj.selectedMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                              const events = (dataObj.events || []).filter((e: any) => e.startDate <= dateStr && e.endDate >= dateStr);
                              const isHoliday = events.some((e: any) => e.type === "holiday");
                              const isExam = events.some((e: any) => e.type === "exam");
                              const isSun = new Date(dataObj.selectedYear, dataObj.selectedMonth, dayNum).getDay() === 0;

                              return (
                                <div
                                  key={dayNum}
                                  className={`p-1 min-h-[32px] border text-left flex flex-col justify-between ${
                                    isHoliday || isSun
                                      ? "border-rose-300 bg-rose-50 text-rose-800 font-bold"
                                      : isExam
                                      ? "border-amber-300 bg-amber-50 text-amber-800 font-medium"
                                      : "border-slate-300 bg-white text-slate-800"
                                  }`}
                                >
                                  <span className="text-[10px] leading-none">{dayNum}</span>
                                  {events.length > 0 && (
                                    <span className="text-[8px] truncate leading-tight block font-semibold">
                                      {events[0].title}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Agenda Table */}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5 text-[11px]">Daftar Agenda Kegiatan & Libur Akademik:</h4>
                    <table className="w-full border-collapse border border-slate-300 text-[11px]">
                      <thead className="bg-slate-100 font-bold text-center">
                        <tr>
                          <th className="border border-slate-300 p-1.5 w-8">No</th>
                          <th className="border border-slate-300 p-1.5 text-left">Nama Agenda / Kegiatan</th>
                          <th className="border border-slate-300 p-1.5 w-40">Rentang Tanggal</th>
                          <th className="border border-slate-300 p-1.5 w-28">Kategori</th>
                          <th className="border border-slate-300 p-1.5 w-28">Status Hari</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(!dataObj?.events || dataObj.events.length === 0) ? (
                          <tr>
                            <td colSpan={5} className="border border-slate-300 p-3 text-center text-slate-400">
                              Tidak ada agenda khusus pada semester ini.
                            </td>
                          </tr>
                        ) : (
                          dataObj.events.map((ev: any, idx: number) => (
                            <tr key={ev.id || idx}>
                              <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                              <td className="border border-slate-300 p-1.5 font-semibold text-slate-900">{ev.title}</td>
                              <td className="border border-slate-300 p-1.5 text-center font-mono">{ev.startDate} s.d. {ev.endDate}</td>
                              <td className="border border-slate-300 p-1.5 text-center capitalize">
                                {ev.type === "holiday" ? "Libur Resmi" : ev.type === "exam" ? "Asesmen / Ujian" : "Kegiatan Sekolah"}
                              </td>
                              <td className="border border-slate-300 p-1.5 text-center font-bold">
                                {ev.isEffectiveDay ? (
                                  <span className="text-emerald-700">Hari Efektif</span>
                                ) : (
                                  <span className="text-rose-700">Non-Efektif / Libur</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* JURNAL MENGAJAR PREVIEW */}
              {docType === "JURNAL_DOCUMENT" && (
                <div className="space-y-2 font-sans">
                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead className="bg-slate-100 font-bold">
                      <tr>
                        <th className="border border-slate-300 p-2">Tgl / Jam</th>
                        <th className="border border-slate-300 p-2">Kelas</th>
                        <th className="border border-slate-300 p-2">Materi Pokok & TP</th>
                        <th className="border border-slate-300 p-2">Aktivitas Pembelajaran</th>
                        <th className="border border-slate-300 p-2">Catatan / Refleksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataObj.journals?.map((j: any, idx: number) => (
                        <tr key={idx}>
                          <td className="border border-slate-300 p-2 font-medium">{j.date}<br/>{j.timeSlot}</td>
                          <td className="border border-slate-300 p-2">{dataObj.classes?.find((c: any) => c.id === j.classId)?.name}</td>
                          <td className="border border-slate-300 p-2"><strong>{j.topic}</strong><br/>{j.learningObjective}</td>
                          <td className="border border-slate-300 p-2">{j.activities}</td>
                          <td className="border border-slate-300 p-2">{j.classroomNotes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PRESENSI / ABSENSI PREVIEW */}
              {docType === "PRESENSI_DOCUMENT" && (
                <div className="space-y-2 font-sans">
                  <p className="text-[11px]"><strong>Kelas:</strong> {dataObj.classInfo?.name} | <strong>Tanggal:</strong> {dataObj.date}</p>
                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead className="bg-slate-100 font-bold text-center">
                      <tr>
                        <th className="border border-slate-300 p-1 w-8">No</th>
                        <th className="border border-slate-300 p-1">NIS</th>
                        <th className="border border-slate-300 p-1 text-left">Nama Siswa</th>
                        <th className="border border-slate-300 p-1 w-16">Status</th>
                        <th className="border border-slate-300 p-1">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataObj.students?.map((s: any, idx: number) => {
                        const att = dataObj.attendances?.find((a: any) => a.studentId === s.id && a.date === dataObj.date);
                        return (
                          <tr key={s.id}>
                            <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                            <td className="border border-slate-300 p-1.5 text-center font-mono">{s.nis || "-"}</td>
                            <td className="border border-slate-300 p-1.5">{s.name}</td>
                            <td className="border border-slate-300 p-1.5 text-center font-bold">{att?.status || "H"}</td>
                            <td className="border border-slate-300 p-1.5">{att?.notes || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ALOKASI WAKTU DOCUMENT PREVIEW */}
              {docType === "ALOKASI_WAKTU" && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50/50">
                    <p><strong>Mata Pelajaran:</strong> {dataObj?.subject?.name} ({dataObj?.jpPerWeek} JP/Minggu)</p>
                    <p><strong>Tahun Ajaran / Semester:</strong> {dataObj?.academicYear} / {dataObj?.semester}</p>
                  </div>
                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead className="bg-slate-100 font-bold">
                      <tr>
                        <th className="border border-slate-300 p-2 text-left">Komponen Analisis</th>
                        <th className="border border-slate-300 p-2 text-center w-32">Jumlah</th>
                        <th className="border border-slate-300 p-2 text-left">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2 font-medium">1. Jumlah Minggu dalam 1 Semester</td>
                        <td className="border border-slate-300 p-2 text-center font-bold">{dataObj?.totalWeeks} Minggu</td>
                        <td className="border border-slate-300 p-2 text-slate-600">Berdasarkan Kalender Pendidikan</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-medium">2. Jumlah Minggu Tidak Efektif</td>
                        <td className="border border-slate-300 p-2 text-center font-bold text-rose-600">{dataObj?.nonEffectiveWeeks} Minggu</td>
                        <td className="border border-slate-300 p-2 text-slate-600">MPLS, Libur Semester, Hari Libur Nasional</td>
                      </tr>
                      <tr className="bg-emerald-50">
                        <td className="border border-slate-300 p-2 font-bold text-emerald-900">3. Jumlah Minggu Efektif (Rill)</td>
                        <td className="border border-slate-300 p-2 text-center font-extrabold text-emerald-700">{dataObj?.effectiveWeeks} Minggu</td>
                        <td className="border border-slate-300 p-2 text-emerald-800">Minggu Efektif Belajar (MEB)</td>
                      </tr>
                      <tr className="bg-blue-50">
                        <td className="border border-slate-300 p-2 font-bold text-blue-900">4. Total Jam Pelajaran Efektif</td>
                        <td className="border border-slate-300 p-2 text-center font-extrabold text-blue-700">{dataObj?.totalEffectiveHours} JP</td>
                        <td className="border border-slate-300 p-2 text-blue-800">{dataObj?.effectiveWeeks} Minggu × {dataObj?.jpPerWeek} JP</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-medium pl-6">a. Jam Pembelajaran Tatap Muka</td>
                        <td className="border border-slate-300 p-2 text-center font-bold">{dataObj?.pureTeachingHours} JP</td>
                        <td className="border border-slate-300 p-2 text-slate-600">Penyampaian Materi & Asesmen Formatif</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 font-medium pl-6">b. Jam Asesmen Sumatif & Remedial</td>
                        <td className="border border-slate-300 p-2 text-center font-bold">{dataObj?.examAndRemedialHours} JP</td>
                        <td className="border border-slate-300 p-2 text-slate-600">ASTS, ASAS, dan Tindak Lanjut</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* PROMES & PROTA DOCUMENT PREVIEW */}
              {(docType === "PROMES_DOCUMENT" || docType === "PROTA_DOCUMENT") && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50/50 flex justify-between">
                    <div>
                      <p><strong>Program:</strong> {docType === "PROMES_DOCUMENT" ? "Program Semester (Promes)" : "Program Tahunan (Prota)"}</p>
                      <p><strong>Tahun Ajaran / Semester:</strong> {dataObj?.academicYear} / {dataObj?.semester}</p>
                    </div>
                    <div className="text-right">
                      <p><strong>Total Alokasi Waktu:</strong> {dataObj?.totalJP || 0} JP</p>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead className="bg-slate-100 font-bold text-center">
                      <tr>
                        <th className="border border-slate-300 p-1.5 w-8">No</th>
                        <th className="border border-slate-300 p-1.5 text-left">Alur Tujuan Pembelajaran (ATP) / Materi</th>
                        <th className="border border-slate-300 p-1.5 w-16">JP</th>
                        <th className="border border-slate-300 p-1.5 w-24">Target Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dataObj?.atpList || []).map((item: any, idx: number) => (
                        <tr key={item.id || idx}>
                          <td className="border border-slate-300 p-1.5 text-center">{idx + 1}</td>
                          <td className="border border-slate-300 p-1.5">
                            <strong className="block text-slate-900">{item.code || `ATP-${idx+1}`}: {item.title || item.name}</strong>
                            <span className="text-[10px] text-slate-600">{item.description || item.scope}</span>
                          </td>
                          <td className="border border-slate-300 p-1.5 text-center font-bold">{item.allocatedHours || item.jp || 4} JP</td>
                          <td className="border border-slate-300 p-1.5 text-center text-slate-600">{item.semester ? `Sem ${item.semester}` : "Bulan 1-6"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* KKTP DOCUMENT PREVIEW */}
              {docType === "KKTP_DOCUMENT" && (
                <div className="space-y-4 text-xs font-sans">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50/50">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><strong>Satuan Pendidikan:</strong> {schoolProfile.name}</div>
                      <div><strong>Nama Guru:</strong> {teacherProfile.fullName}</div>
                      <div><strong>NIP:</strong> {teacherProfile.nip || "-"}</div>
                      <div><strong>Fase / Jenjang:</strong> {dataObj?.kktpList?.[0]?.phase || "Fase E"} / {schoolProfile.level || "SMA/SMK"}</div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <thead>
                      <tr className="bg-red-800 text-white font-bold text-center">
                        <th rowSpan={2} className="border border-slate-300 p-2 w-1/4">
                          TUJUAN PEMBELAJARAN
                        </th>
                        <th rowSpan={2} className="border border-slate-300 p-2 w-1/3">
                          INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN (IKTP)
                        </th>
                        <th colSpan={4} className="border border-slate-300 p-1.5 text-center font-extrabold">
                          SKALA ATAU INTERVAL NILAI
                        </th>
                      </tr>
                      <tr className="bg-red-800 text-white font-bold text-center text-[10px]">
                        <th className="border border-slate-300 p-1.5 w-24">
                          <div>0 - 60</div>
                          <div className="font-semibold text-[8px] uppercase">BELUM BERKEMBANG</div>
                        </th>
                        <th className="border border-slate-300 p-1.5 w-24">
                          <div>61 - 70</div>
                          <div className="font-semibold text-[8px] uppercase">CUKUP</div>
                        </th>
                        <th className="border border-slate-300 p-1.5 w-24">
                          <div>71 - 87</div>
                          <div className="font-semibold text-[8px] uppercase">BAIK</div>
                        </th>
                        <th className="border border-slate-300 p-1.5 w-24">
                          <div>88 - 100</div>
                          <div className="font-semibold text-[8px] uppercase">SANGAT BAIK</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!dataObj?.kktpList || dataObj.kktpList.length === 0) ? (
                        <tr>
                          <td colSpan={6} className="border border-slate-300 p-4 text-center text-slate-400">
                            Tidak ada data KKTP.
                          </td>
                        </tr>
                      ) : (
                        dataObj.kktpList.map((item: any, idx: number) => {
                          const inv0 = item.intervals?.find((i: any) => i.max <= 65) || item.intervals?.[0];
                          const inv1 = item.intervals?.find((i: any) => i.min >= 61 && i.max <= 75) || item.intervals?.[1];
                          const inv2 = item.intervals?.find((i: any) => i.min >= 71 && i.max <= 87) || item.intervals?.[2];
                          const inv3 = item.intervals?.find((i: any) => i.min >= 86) || item.intervals?.[3];

                          return (
                            <tr key={item.id || idx} className="align-top">
                              <td className="border border-slate-300 p-2 font-medium">
                                {item.learningObjective}
                              </td>
                              <td className="border border-slate-300 p-2">
                                <ul className="space-y-1">
                                  {(item.indicators || []).map((ind: string, iIdx: number) => (
                                    <li key={iIdx} className="flex items-start gap-1">
                                      <span className="font-bold select-none">•</span>
                                      <span>{ind}</span>
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="border border-slate-300 p-2 text-[10px]">
                                {inv0?.description || "Belum mampu mendeskripsikan dan menerapkan konsep secara mandiri."}
                              </td>
                              <td className="border border-slate-300 p-2 text-[10px]">
                                {inv1?.description || "Mampu mendeskripsikan konsep dasar namun butuh bantuan."}
                              </td>
                              <td className="border border-slate-300 p-2 text-[10px]">
                                {inv2?.description || "Mampu mendeskripsikan dan menerapkan konsep mandiri."}
                              </td>
                              <td className="border border-slate-300 p-2 text-[10px]">
                                {inv3?.description || "Sangat mahir mendeskripsikan dan mampu berinovasi mandiri."}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>

                  {/* Keterangan Interval */}
                  <div className="rounded border border-slate-300 p-3 bg-slate-50 space-y-1.5 text-[11px]">
                    <div className="font-bold text-slate-900">Keterangan Interval & Tindak Lanjut:</div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      <li><strong>0 - 60 (Belum Berkembang):</strong> Belum mencapai ketuntasan, remedial di seluruh bagian.</li>
                      <li><strong>61 - 70 (Cukup):</strong> Belum mencapai ketuntasan, remedial di bagian yang diperlukan.</li>
                      <li><strong>71 - 87 (Baik):</strong> Sudah mencapai ketuntasan, tidak perlu remedial.</li>
                      <li><strong>88 - 100 (Sangat Baik):</strong> Sudah mencapai ketuntasan, perlu pengayaan atau tantangan lebih.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* BUKU NILAI GURU */}
              {docType === "BUKU_NILAI_DOCUMENT" && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Mata Pelajaran:</strong> {dataObj.subjectInfo?.name || "Informatika"}</div>
                      <div><strong>Kelas / Fase:</strong> {dataObj.classInfo?.name || "-"} ({dataObj.classInfo?.phase || "Fase E"})</div>
                      <div><strong>Semester / Tahun:</strong> {dataObj.semester || "1 (Ganjil)"} / {dataObj.academicYear || "2024/2025"}</div>
                      <div><strong>Standar KKTP:</strong> {dataObj.kktp || dataObj.kktpStandard || 75} | <strong>Bobot:</strong> Formatif {dataObj.weights?.fmt ?? 40}%, Sumatif {dataObj.weights?.sum ?? 40}%, SAS {dataObj.weights?.sas ?? 20}%</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-400 text-[9px]">
                      <thead>
                        <tr className="bg-slate-200 text-center font-bold">
                          <th rowSpan={2} className="border border-slate-400 p-1 w-6">No</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-14">NIS</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 text-left min-w-[120px]">Nama Siswa</th>
                          <th colSpan={11} className="border border-slate-400 p-1 bg-blue-100/70">Formatif (TP 1 - TP 10)</th>
                          <th colSpan={11} className="border border-slate-400 p-1 bg-purple-100/70">Sumatif (LM 1 - LM 10)</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-8 bg-amber-100/60">SAS</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-8 bg-emerald-200/80 font-black">NA</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-7">Pred</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 w-12">Status</th>
                          <th rowSpan={2} className="border border-slate-400 p-1 text-left min-w-[140px]">Deskripsi Capaian</th>
                        </tr>
                        <tr className="bg-slate-100 text-center font-semibold text-[8px]">
                          <th className="border border-slate-400 p-0.5 w-5">T1</th>
                          <th className="border border-slate-400 p-0.5 w-5">T2</th>
                          <th className="border border-slate-400 p-0.5 w-5">T3</th>
                          <th className="border border-slate-400 p-0.5 w-5">T4</th>
                          <th className="border border-slate-400 p-0.5 w-5">T5</th>
                          <th className="border border-slate-400 p-0.5 w-5">T6</th>
                          <th className="border border-slate-400 p-0.5 w-5">T7</th>
                          <th className="border border-slate-400 p-0.5 w-5">T8</th>
                          <th className="border border-slate-400 p-0.5 w-5">T9</th>
                          <th className="border border-slate-400 p-0.5 w-5">T10</th>
                          <th className="border border-slate-400 p-0.5 w-6 font-bold bg-blue-200/60">NF</th>
                          <th className="border border-slate-400 p-0.5 w-5">L1</th>
                          <th className="border border-slate-400 p-0.5 w-5">L2</th>
                          <th className="border border-slate-400 p-0.5 w-5">L3</th>
                          <th className="border border-slate-400 p-0.5 w-5">L4</th>
                          <th className="border border-slate-400 p-0.5 w-5">L5</th>
                          <th className="border border-slate-400 p-0.5 w-5">L6</th>
                          <th className="border border-slate-400 p-0.5 w-5">L7</th>
                          <th className="border border-slate-400 p-0.5 w-5">L8</th>
                          <th className="border border-slate-400 p-0.5 w-5">L9</th>
                          <th className="border border-slate-400 p-0.5 w-5">L10</th>
                          <th className="border border-slate-400 p-0.5 w-6 font-bold bg-purple-200/60">NS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataObj.students?.map((s: any, idx: number) => {
                          const sc = s.scores || {};
                          return (
                            <tr key={s.id || idx} className="hover:bg-slate-50">
                              <td className="border border-slate-400 p-0.5 text-center">{idx + 1}</td>
                              <td className="border border-slate-400 p-0.5 font-mono text-center">{s.nis || "-"}</td>
                              <td className="border border-slate-400 p-0.5 font-bold">{s.name}</td>
                              {/* TP 1-10 */}
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp1 ?? s.tp1 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp2 ?? s.tp2 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp3 ?? s.tp3 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp4 ?? s.tp4 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp5 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp6 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp7 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp8 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp9 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.tp10 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center font-bold bg-blue-50">{s.avgFmt ?? s.formatif ?? "-"}</td>
                              {/* LM 1-10 */}
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm1 ?? s.lm1 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm2 ?? s.lm2 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm3 ?? s.lm3 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm4 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm5 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm6 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm7 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm8 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm9 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{sc.lm10 ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center font-bold bg-purple-50">{s.avgSum ?? s.sumatifLM ?? "-"}</td>
                              {/* SAS, NA, Pred, Status, Deskripsi */}
                              <td className="border border-slate-400 p-0.5 text-center bg-amber-50/50">{s.sas ?? "-"}</td>
                              <td className="border border-slate-400 p-0.5 text-center font-bold bg-slate-100">{s.finalScore}</td>
                              <td className="border border-slate-400 p-0.5 text-center font-bold">{s.predicate}</td>
                              <td className="border border-slate-400 p-0.5 text-center">{s.isPassed ? "Tuntas" : "Remedial"}</td>
                              <td className="border border-slate-400 p-0.5 text-[8px] leading-tight">{s.deskripsi || s.capaianTertinggi || s.notes || "-"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* REKAPITULASI PRESENSI / KEHADIRAN */}
              {docType === "REKAP_KEHADIRAN_DOCUMENT" && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Kelas / Rombel:</strong> {dataObj.classInfo?.name || "-"}</div>
                      <div><strong>Bulan & Tahun:</strong> {dataObj.monthName || "Agustus"} {dataObj.year || "2024"}</div>
                      <div><strong>Hari Belajar Efektif:</strong> {dataObj.effectiveDaysCount || 22} Hari</div>
                      <div><strong>Rata-rata Kehadiran:</strong> {dataObj.stats?.avgPercent || 96}%</div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-400 text-[10px]">
                    <thead>
                      <tr className="bg-slate-200 text-center font-bold">
                        <th className="border border-slate-400 p-1.5 w-8">No</th>
                        <th className="border border-slate-400 p-1.5 w-16">NIS</th>
                        <th className="border border-slate-400 p-1.5 text-left">Nama Siswa</th>
                        <th className="border border-slate-400 p-1.5 w-10">Hadir</th>
                        <th className="border border-slate-400 p-1.5 w-10">Sakit</th>
                        <th className="border border-slate-400 p-1.5 w-10">Izin</th>
                        <th className="border border-slate-400 p-1.5 w-10">Alpa</th>
                        <th className="border border-slate-400 p-1.5 w-10">Terlambat</th>
                        <th className="border border-slate-400 p-1.5 w-10">Bolos</th>
                        <th className="border border-slate-400 p-1.5 w-16 bg-slate-300">% Kehadiran</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataObj.students?.map((s: any, idx: number) => (
                        <tr key={s.id || idx}>
                          <td className="border border-slate-400 p-1 text-center">{idx + 1}</td>
                          <td className="border border-slate-400 p-1 font-mono">{s.nis || "-"}</td>
                          <td className="border border-slate-400 p-1 font-bold">{s.name}</td>
                          <td className="border border-slate-400 p-1 text-center">{s.h}</td>
                          <td className="border border-slate-400 p-1 text-center">{s.s}</td>
                          <td className="border border-slate-400 p-1 text-center">{s.i}</td>
                          <td className="border border-slate-400 p-1 text-center">{s.a}</td>
                          <td className="border border-slate-400 p-1 text-center">{s.t}</td>
                          <td className="border border-slate-400 p-1 text-center font-bold text-orange-700">{s.b || 0}</td>
                          <td className="border border-slate-400 p-1 text-center font-bold bg-slate-100">{s.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* REKAP HASIL BELAJAR / LEGER */}
              {docType === "REKAP_BELAJAR_DOCUMENT" && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Mata Pelajaran:</strong> {dataObj.subjectInfo?.name || "Informatika"}</div>
                      <div><strong>Kelas / Rombel:</strong> {dataObj.classInfo?.name || "-"}</div>
                      <div><strong>Semester / Tahun:</strong> {dataObj.semester || "Ganjil"} / {dataObj.academicYear || "2024/2025"}</div>
                      <div><strong>Ketuntasan Klasikal:</strong> {dataObj.stats?.passPercent || 90}% ({dataObj.stats?.passCount || 0} Siswa Tuntas)</div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-400 text-[10px]">
                    <thead>
                      <tr className="bg-slate-200 text-center font-bold">
                        <th className="border border-slate-400 p-1.5 w-10">Rank</th>
                        <th className="border border-slate-400 p-1.5 w-16">NIS</th>
                        <th className="border border-slate-400 p-1.5 text-left">Nama Siswa</th>
                        <th className="border border-slate-400 p-1.5 w-10">NF</th>
                        <th className="border border-slate-400 p-1.5 w-10">NS</th>
                        <th className="border border-slate-400 p-1.5 w-10">SAS</th>
                        <th className="border border-slate-400 p-1.5 w-12 bg-slate-300">NA</th>
                        <th className="border border-slate-400 p-1.5 w-10">Pred</th>
                        <th className="border border-slate-400 p-1.5 w-16">Status</th>
                        <th className="border border-slate-400 p-1.5 text-left">Capaian Kompetensi Tertinggi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataObj.students?.map((s: any) => (
                        <tr key={s.id || s.rank}>
                          <td className="border border-slate-400 p-1 text-center font-bold">#{s.rank}</td>
                          <td className="border border-slate-400 p-1 font-mono">{s.nis || "-"}</td>
                          <td className="border border-slate-400 p-1 font-bold">{s.name}</td>
                          <td className="border border-slate-400 p-1 text-center">{s.formatif}</td>
                          <td className="border border-slate-400 p-1 text-center">{s.sumatifLM}</td>
                          <td className="border border-slate-400 p-1 text-center">{s.sas}</td>
                          <td className="border border-slate-400 p-1 text-center font-bold bg-slate-100">{s.finalScore}</td>
                          <td className="border border-slate-400 p-1 text-center font-bold">{s.predicate}</td>
                          <td className="border border-slate-400 p-1 text-center">{s.isPassed ? "Tuntas" : "Remedial"}</td>
                          <td className="border border-slate-400 p-1 text-[9px] leading-tight">{s.capaianTertinggi || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* BUKU KASUS SISWA */}
              {docType === "BUKU_KASUS_DOCUMENT" && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Jenis Dokumen:</strong> Buku Catatan Bimbingan & Kasus Khusus Siswa</div>
                      <div><strong>Tahun Pelajaran:</strong> 2024/2025</div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-400 text-[10px]">
                    <thead>
                      <tr className="bg-slate-200 text-center font-bold">
                        <th className="border border-slate-400 p-1.5 w-8">No</th>
                        <th className="border border-slate-400 p-1.5 w-20">Tanggal</th>
                        <th className="border border-slate-400 p-1.5 text-left w-36">Nama Siswa / Kelas</th>
                        <th className="border border-slate-400 p-1.5 text-left">Uraian Kasus / Permasalahan</th>
                        <th className="border border-slate-400 p-1.5 text-left">Tindakan / Solusi Guru</th>
                        <th className="border border-slate-400 p-1.5 w-20">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataObj.cases?.map((c: any, idx: number) => (
                        <tr key={c.id || idx}>
                          <td className="border border-slate-400 p-1 text-center">{idx + 1}</td>
                          <td className="border border-slate-400 p-1 text-center font-mono">{c.date}</td>
                          <td className="border border-slate-400 p-1"><strong>{c.studentName}</strong> ({c.className})</td>
                          <td className="border border-slate-400 p-1 text-[9px] leading-tight">{c.description}</td>
                          <td className="border border-slate-400 p-1 text-[9px] leading-tight">{c.actionTaken}</td>
                          <td className="border border-slate-400 p-1 text-center font-bold">{c.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* REMEDIAL & PENGAYAAN */}
              {docType === "REMEDIAL_DOCUMENT" && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Program:</strong> Pelaksanaan Remedial & Pengayaan</div>
                      <div><strong>Tahun Pelajaran:</strong> 2024/2025</div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-400 text-[10px]">
                    <thead>
                      <tr className="bg-slate-200 text-center font-bold">
                        <th className="border border-slate-400 p-1.5 w-8">No</th>
                        <th className="border border-slate-400 p-1.5 w-20">Tanggal</th>
                        <th className="border border-slate-400 p-1.5 text-left w-36">Nama Siswa / Kelas</th>
                        <th className="border border-slate-400 p-1.5 w-16">Tipe</th>
                        <th className="border border-slate-400 p-1.5 text-left">Materi / Kompetensi</th>
                        <th className="border border-slate-400 p-1.5 w-12">Nilai Awal</th>
                        <th className="border border-slate-400 p-1.5 w-12">Nilai Akhir</th>
                        <th className="border border-slate-400 p-1.5 w-16">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataObj.programs?.map((p: any, idx: number) => (
                        <tr key={p.id || idx}>
                          <td className="border border-slate-400 p-1 text-center">{idx + 1}</td>
                          <td className="border border-slate-400 p-1 text-center font-mono">{p.date}</td>
                          <td className="border border-slate-400 p-1"><strong>{p.studentName}</strong> ({p.className})</td>
                          <td className="border border-slate-400 p-1 text-center font-bold">{p.type}</td>
                          <td className="border border-slate-400 p-1 text-[9px] leading-tight">{p.material}</td>
                          <td className="border border-slate-400 p-1 text-center">{p.initialScore}</td>
                          <td className="border border-slate-400 p-1 text-center font-bold">{p.finalScore}</td>
                          <td className="border border-slate-400 p-1 text-center">{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SUPERVISI AKADEMIK */}
              {docType === "SUPERVISI_DOCUMENT" && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Dokumen:</strong> Instrumen Supervisi Pembelajaran Akademik Guru</div>
                      <div><strong>Tahun Pelajaran:</strong> 2024/2025</div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-400 text-[10px]">
                    <thead>
                      <tr className="bg-slate-200 text-center font-bold">
                        <th className="border border-slate-400 p-1.5 w-8">No</th>
                        <th className="border border-slate-400 p-1.5 w-20">Tanggal</th>
                        <th className="border border-slate-400 p-1.5 text-left">Supervisor</th>
                        <th className="border border-slate-400 p-1.5 text-left">Fokus / Aspek Supervisi</th>
                        <th className="border border-slate-400 p-1.5 w-12">Skor</th>
                        <th className="border border-slate-400 p-1.5 w-12">Predikat</th>
                        <th className="border border-slate-400 p-1.5 text-left">Catatan Rekomendasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataObj.sessions?.map((s: any, idx: number) => (
                        <tr key={s.id || idx}>
                          <td className="border border-slate-400 p-1 text-center">{idx + 1}</td>
                          <td className="border border-slate-400 p-1 text-center font-mono">{s.date}</td>
                          <td className="border border-slate-400 p-1 font-bold">{s.supervisorName}</td>
                          <td className="border border-slate-400 p-1 text-[9px] leading-tight">{s.aspect}</td>
                          <td className="border border-slate-400 p-1 text-center font-bold">{s.score}</td>
                          <td className="border border-slate-400 p-1 text-center font-bold">{s.predicate}</td>
                          <td className="border border-slate-400 p-1 text-[9px] leading-tight">{s.recommendation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PKB GURU */}
              {docType === "PKB_DOCUMENT" && (
                <div className="space-y-4 font-sans text-xs">
                  <div className="rounded-lg border border-slate-300 p-3 bg-slate-50 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>Dokumen:</strong> Portofolio Pengembangan Keprofesian Berkelanjutan (PKB)</div>
                      <div><strong>Tahun Pelajaran:</strong> 2024/2025</div>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-400 text-[10px]">
                    <thead>
                      <tr className="bg-slate-200 text-center font-bold">
                        <th className="border border-slate-400 p-1.5 w-8">No</th>
                        <th className="border border-slate-400 p-1.5 w-20">Tanggal</th>
                        <th className="border border-slate-400 p-1.5 text-left">Nama Kegiatan / Diklat</th>
                        <th className="border border-slate-400 p-1.5 text-left">Penyelenggara</th>
                        <th className="border border-slate-400 p-1.5 w-12">Durasi (JP)</th>
                        <th className="border border-slate-400 p-1.5 w-16">Bukti Fisik</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataObj.activities?.map((a: any, idx: number) => (
                        <tr key={a.id || idx}>
                          <td className="border border-slate-400 p-1 text-center">{idx + 1}</td>
                          <td className="border border-slate-400 p-1 text-center font-mono">{a.date}</td>
                          <td className="border border-slate-400 p-1 font-bold">{a.title}</td>
                          <td className="border border-slate-400 p-1 text-[9px]">{a.organizer}</td>
                          <td className="border border-slate-400 p-1 text-center font-bold">{a.jp} JP</td>
                          <td className="border border-slate-400 p-1 text-center text-[9px]">{a.certificateNo ? "Sertifikat Ada" : "Dokumentasi"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* BUKU CATATAN PER BAB DOCUMENT */}
              {docType === "BUKU_CATATAN_BAB_DOCUMENT" && dataObj && (
                <div className="space-y-4 font-sans text-[11px]">
                  <div className="text-center font-bold font-serif mb-4">
                    <h3 className="text-sm uppercase tracking-wide">
                      BUKU CATATAN PERKEMBANGAN & OBSERVASI SISWA PER BAB
                    </h3>
                    <p className="text-xs font-normal">
                      Mata Pelajaran: {dataObj.subject?.name || "-"} | Kelas: {dataObj.classInfo?.name || "-"} | Semester: {dataObj.chapter?.semester || "Ganjil"}
                    </p>
                  </div>

                  <div className="rounded border border-slate-300 bg-slate-50/50 p-2.5 space-y-1 text-[11px]">
                    <div className="grid grid-cols-2 gap-2">
                      <p><b>Nomor & Judul Bab:</b> {dataObj.chapter?.chapterTitle || "-"}</p>
                      <p><b>Topik Inti:</b> {dataObj.chapter?.mainTopic || "-"}</p>
                    </div>
                    {dataObj.chapter?.tpList && dataObj.chapter.tpList.length > 0 && (
                      <div>
                        <b>Tujuan Pembelajaran:</b>
                        <ul className="list-disc pl-4 mt-0.5 space-y-0.5 text-[10px]">
                          {dataObj.chapter.tpList.map((tp: string, i: number) => (
                            <li key={i}>{tp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {dataObj.chapter?.teacherReflection && (
                      <p className="text-[10px] italic text-slate-700 pt-1 border-t border-slate-200">
                        <b>Refleksi KBM Guru:</b> {dataObj.chapter.teacherReflection}
                      </p>
                    )}
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-300 p-1.5 w-8">No</th>
                        <th className="border border-slate-300 p-1.5 w-20">NIS</th>
                        <th className="border border-slate-300 p-1.5 text-left w-36">Nama Siswa</th>
                        <th className="border border-slate-300 p-1.5 w-28">Tingkat Progres</th>
                        <th className="border border-slate-300 p-1.5 w-12">Skor</th>
                        <th className="border border-slate-300 p-1.5 text-left">Observasi Sikap & KBM</th>
                        <th className="border border-slate-300 p-1.5 text-left">Catatan Guru</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dataObj.students || []).map((std: any, idx: number) => {
                        const entry = dataObj.activeEntries?.[std.id] || {};
                        return (
                          <tr key={std.id} className="hover:bg-slate-50">
                            <td className="border border-slate-300 p-1 text-center">{idx + 1}</td>
                            <td className="border border-slate-300 p-1 text-center font-mono">{std.nis || "-"}</td>
                            <td className="border border-slate-300 p-1 font-bold">{std.name}</td>
                            <td className="border border-slate-300 p-1 text-center">{entry.learningProgress || "-"}</td>
                            <td className="border border-slate-300 p-1 text-center font-bold">{entry.masteryScore || 80}</td>
                            <td className="border border-slate-300 p-1 text-[9px]">{entry.attitudeObservation || "-"}</td>
                            <td className="border border-slate-300 p-1 text-[9px]">{entry.notes || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PENILAIAN TUGAS DOCUMENT */}
              {docType === "PENILAIAN_TUGAS_DOCUMENT" && dataObj && (
                <div className="space-y-4 font-sans text-[11px]">
                  <div className="text-center font-bold font-serif mb-4">
                    <h3 className="text-sm uppercase tracking-wide">
                      DAFTAR PENILAIAN TUGAS TERSTRUKTUR & PORTOFOLIO
                    </h3>
                    <p className="text-xs font-normal">
                      Mata Pelajaran: {dataObj.subject?.name || "-"} | Kelas: {dataObj.classInfo?.name || "-"} | Semester: {dataObj.task?.semester || "Ganjil"}
                    </p>
                  </div>

                  <div className="rounded border border-slate-300 bg-slate-50/50 p-2.5 text-[11px] grid grid-cols-2 gap-2">
                    <div>
                      <p><b>Judul Tugas:</b> {dataObj.task?.title || "-"}</p>
                      <p><b>Bab:</b> {dataObj.task?.chapterTitle || "-"}</p>
                    </div>
                    <div>
                      <p><b>Jenis Tugas:</b> {dataObj.task?.taskType || "Individu"}</p>
                      <p><b>Batas KKTP:</b> {dataObj.task?.kktpStandard || 75} / 100 | <b>Tenggat:</b> {dataObj.task?.dueDate || "-"}</p>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-300 p-1.5 w-8">No</th>
                        <th className="border border-slate-300 p-1.5 w-20">NIS</th>
                        <th className="border border-slate-300 p-1.5 text-left w-40">Nama Siswa</th>
                        <th className="border border-slate-300 p-1.5 w-16">Nilai (/100)</th>
                        <th className="border border-slate-300 p-1.5 w-20">Ketuntasan</th>
                        <th className="border border-slate-300 p-1.5 w-24">Status Kumpul</th>
                        <th className="border border-slate-300 p-1.5 text-left">Umpan Balik Guru</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dataObj.students || []).map((std: any, idx: number) => {
                        const s = dataObj.activeScores?.[std.id] || {};
                        const kktp = dataObj.task?.kktpStandard || 75;
                        const isPass = (s.score || 0) >= kktp;
                        return (
                          <tr key={std.id} className="hover:bg-slate-50">
                            <td className="border border-slate-300 p-1 text-center">{idx + 1}</td>
                            <td className="border border-slate-300 p-1 text-center font-mono">{std.nis || "-"}</td>
                            <td className="border border-slate-300 p-1 font-bold">{std.name}</td>
                            <td className="border border-slate-300 p-1 text-center font-bold">{s.score || 0}</td>
                            <td className="border border-slate-300 p-1 text-center font-bold">{isPass ? "Tuntas" : "Remedial"}</td>
                            <td className="border border-slate-300 p-1 text-center">{s.status || "-"}</td>
                            <td className="border border-slate-300 p-1 text-[9px]">{s.feedback || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ASESMEN PER BAB DOCUMENT */}
              {docType === "ASESMEN_PERBAB_DOCUMENT" && dataObj && (
                <div className="space-y-4 font-sans text-[11px]">
                  <div className="text-center font-bold font-serif mb-4">
                    <h3 className="text-sm uppercase tracking-wide">
                      REKAPITULASI ASESMEN SUMATIF LINGKUP MATERI / PER BAB
                    </h3>
                    <p className="text-xs font-normal">
                      Mata Pelajaran: {dataObj.subject?.name || "-"} | Kelas: {dataObj.classInfo?.name || "-"} | Semester: {dataObj.assessment?.semester || "Ganjil"}
                    </p>
                  </div>

                  <div className="rounded border border-slate-300 bg-slate-50/50 p-2.5 text-[11px] grid grid-cols-2 gap-2">
                    <div>
                      <p><b>Bab / Lingkup Materi:</b> {dataObj.assessment?.chapterTitle || "-"}</p>
                      <p><b>Tipe Evaluasi:</b> {dataObj.assessment?.assessmentType || "Campuran"}</p>
                    </div>
                    <div>
                      <p><b>Standar KKTP:</b> {dataObj.assessment?.kktpThreshold || 75} / 100</p>
                      <p><b>Bobot Nilai:</b> Formatif ({dataObj.assessment?.weightFormative}%) | Tes Tulis ({dataObj.assessment?.weightTest}%) | Praktik ({dataObj.assessment?.weightPractice}%)</p>
                    </div>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 font-bold text-center">
                        <th className="border border-slate-300 p-1.5 w-8">No</th>
                        <th className="border border-slate-300 p-1.5 w-20">NIS</th>
                        <th className="border border-slate-300 p-1.5 text-left w-36">Nama Siswa</th>
                        <th className="border border-slate-300 p-1.5 w-14">Formatif</th>
                        <th className="border border-slate-300 p-1.5 w-14">Tes Tulis</th>
                        <th className="border border-slate-300 p-1.5 w-14">Praktik</th>
                        <th className="border border-slate-300 p-1.5 w-16">Nilai Bab</th>
                        <th className="border border-slate-300 p-1.5 w-20">Tindak Lanjut</th>
                        <th className="border border-slate-300 p-1.5 text-left">Deskripsi Capaian Rapor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(dataObj.students || []).map((std: any, idx: number) => {
                        const r = dataObj.activeResults?.[std.id] || {};
                        return (
                          <tr key={std.id} className="hover:bg-slate-50">
                            <td className="border border-slate-300 p-1 text-center">{idx + 1}</td>
                            <td className="border border-slate-300 p-1 text-center font-mono">{std.nis || "-"}</td>
                            <td className="border border-slate-300 p-1 font-bold">{std.name}</td>
                            <td className="border border-slate-300 p-1 text-center">{r.formativeScore || 0}</td>
                            <td className="border border-slate-300 p-1 text-center">{r.testScore || 0}</td>
                            <td className="border border-slate-300 p-1 text-center">{r.practiceScore || 0}</td>
                            <td className="border border-slate-300 p-1 text-center font-bold">{r.finalChapterScore || 0}</td>
                            <td className="border border-slate-300 p-1 text-center font-semibold">{r.recommendedAction || "Tuntas"}</td>
                            <td className="border border-slate-300 p-1 text-[9px]">{r.descriptorNote || "-"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* DEFAULT / GENERIC DOCUMENT LISTING */}
              {![
                "MODUL_AJAR_DOCUMENT",
                "LKPD_DOCUMENT",
                "JURNAL_DOCUMENT",
                "PRESENSI_DOCUMENT",
                "JADWAL_MENGAJAR_DOCUMENT",
                "KALENDER_PENDIDIKAN_DOCUMENT",
                "ALOKASI_WAKTU",
                "PROMES_DOCUMENT",
                "PROTA_DOCUMENT",
                "KKTP_DOCUMENT",
                "BUKU_NILAI_DOCUMENT",
                "REKAP_KEHADIRAN_DOCUMENT",
                "REKAP_BELAJAR_DOCUMENT",
                "BUKU_KASUS_DOCUMENT",
                "REMEDIAL_DOCUMENT",
                "SUPERVISI_DOCUMENT",
                "PKB_DOCUMENT",
                "BUKU_CATATAN_BAB_DOCUMENT",
                "PENILAIAN_TUGAS_DOCUMENT",
                "ASESMEN_PERBAB_DOCUMENT"
              ].includes(docType) && (
                <div className="space-y-3 font-sans">
                  <div className="rounded-lg border border-slate-300 p-4 bg-slate-50 text-[11px] leading-relaxed">
                    <p className="font-bold text-slate-900 mb-2">Dokumen Administrasi Pembelajaran:</p>
                    <table className="w-full border-collapse border border-slate-300 text-[11px]">
                      <tbody>
                        {Object.entries(dataObj || {}).map(([k, v]: [string, any]) => {
                          if (typeof v === "object" && v !== null && !Array.isArray(v)) {
                            return (
                              <tr key={k}>
                                <td className="border border-slate-300 p-2 font-bold capitalize bg-slate-100 w-44">{k}</td>
                                <td className="border border-slate-300 p-2">
                                  <pre className="whitespace-pre-wrap font-sans text-[11px]">{JSON.stringify(v, null, 2)}</pre>
                                </td>
                              </tr>
                            );
                          }
                          if (Array.isArray(v)) {
                            return (
                              <tr key={k}>
                                <td className="border border-slate-300 p-2 font-bold capitalize bg-slate-100 w-44">{k} ({v.length} item)</td>
                                <td className="border border-slate-300 p-2">
                                  <ul className="list-disc pl-4 space-y-1">
                                    {v.map((item: any, i: number) => (
                                      <li key={i}>{typeof item === "object" ? (item.name || item.title || JSON.stringify(item)) : String(item)}</li>
                                    ))}
                                  </ul>
                                </td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={k}>
                              <td className="border border-slate-300 p-2 font-bold capitalize bg-slate-100 w-44">{k}</td>
                              <td className="border border-slate-300 p-2">{String(v)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Official Signature Area (Tanda Tangan Mengetahui Kepala Sekolah & Guru) */}
            <div className="mt-12 pt-6 font-sans text-xs">
              <div className="flex justify-between items-start">
                <div className="text-center w-56">
                  <p>Mengetahui,</p>
                  <p>Kepala {schoolProfile.name}</p>
                  <div className="h-20" />
                  <p className="font-bold underline uppercase">{schoolProfile.principalName || "Dr. H. Ahmad Dahlan, M.Pd."}</p>
                  <p className="text-[10px]">NIP. {schoolProfile.principalNIP || "19720512 199802 1 003"}</p>
                </div>

                <div className="text-center w-56">
                  <p>{schoolProfile.city || "Jakarta"}, {todayStr}</p>
                  <p>Guru Mata Pelajaran,</p>
                  <div className="h-20" />
                  <p className="font-bold underline uppercase">{teacherProfile.fullName}</p>
                  <p className="text-[10px]">NIP. {teacherProfile.nip || "19850615 201001 1 018"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
