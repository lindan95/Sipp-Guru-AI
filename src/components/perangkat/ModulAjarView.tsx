import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ModulAjar } from "../../types";
import { createModulAjarPrompt } from "../../services/aiPromptEngine";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Save,
  X,
  Loader2,
  Copy,
  Printer,
  FileText,
  Clock,
  Layers,
  ChevronRight,
  CheckSquare,
  Square,
  Users,
  Compass,
  Lightbulb,
  Target,
  BrainCircuit,
  Smile,
  ShieldCheck,
  Globe,
  HeartHandshake,
  Activity,
  MessageSquareShare,
  HelpCircle,
} from "lucide-react";

const DIMENSI_PROFIL_OPTIONS = [
  { id: "Keimanan dan Ketakwaan terhadap Tuhan YME", label: "Keimanan & Ketakwaan thd Tuhan YME", icon: ShieldCheck, color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300" },
  { id: "Kewargaan", label: "Kewargaan", icon: Globe, color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300" },
  { id: "Penalaran Kritis", label: "Penalaran Kritis", icon: BrainCircuit, color: "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300" },
  { id: "Kreativitas", label: "Kreativitas", icon: Lightbulb, color: "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300" },
  { id: "Kolaborasi", label: "Kolaborasi", icon: Users, color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300" },
  { id: "Kemandirian", label: "Kemandirian", icon: Compass, color: "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300" },
  { id: "Kesehatan", label: "Kesehatan", icon: Activity, color: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300" },
  { id: "Komunikasi", label: "Komunikasi", icon: MessageSquareShare, color: "text-cyan-600 bg-cyan-50 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300" },
];

export const ModulAjarView: React.FC = () => {
  const {
    modulAjarList,
    saveModulAjar,
    deleteModulAjar,
    subjects,
    classes,
    activeSubjectId,
    setActiveSubjectId,
    activeClassId,
    setActiveClassId,
    schoolProfile,
    teacherProfile,
    addToast,
    setPreviewDoc,
  } = useApp();

  const [filterSubjectId, setFilterSubjectId] = useState<string>(activeSubjectId || "all");
  const [filterClassId, setFilterClassId] = useState<string>(activeClassId || "all");

  const filteredModulList = modulAjarList.filter((mod) => {
    const matchSub = filterSubjectId === "all" || mod.subjectId === filterSubjectId;
    const matchCls = filterClassId === "all" || !mod.classId || mod.classId === filterClassId;
    return matchSub && matchCls;
  });

  const [selectedModul, setSelectedModul] = useState<ModulAjar | null>(filteredModulList[0] || modulAjarList[0] || null);

  useEffect(() => {
    if (filteredModulList.length > 0 && !filteredModulList.some((m) => m.id === selectedModul?.id)) {
      setSelectedModul(filteredModulList[0]);
    }
  }, [filterSubjectId, filterClassId, modulAjarList]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"identifikasi" | "desain" | "pengalaman" | "asesmen" | "referensi">("identifikasi");

  // AI Generator Parameters Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiModel, setAiModel] = useState("Problem Based Learning (PBL)");
  const [aiDuration, setAiDuration] = useState("2 JP (2 x 45 menit)");
  const [aiTargetClass, setAiTargetClass] = useState("Kelas X (Fase E)");

  const [formData, setFormData] = useState<ModulAjar>({
    id: "",
    title: "",
    subjectId: activeSubjectId || subjects[0]?.id || "sbj-inf",
    classId: activeClassId || classes[0]?.id || "cls-10a",
    phase: "Fase E",
    duration: "2 JP (2 x 45 menit)",
    
    // 1. Identifikasi
    identifikasiPesertaDidik: "Sebagian besar peserta didik telah menguasai konsep prasyarat dan memiliki minat tinggi pada studi kasus nyata.",
    identifikasiMateri: "Materi pengetahuan esensial dan aplikatif terintegrasi dengan pemecahan masalah kontekstual kehidupan nyata.",
    dimensiProfilLulusan: ["Penalaran Kritis", "Kreativitas", "Kolaborasi", "Komunikasi"],

    // 2. Desain Pembelajaran
    capaianPembelajaran: "Peserta didik mampu menganalisis dan menerapkan solusi pemecahan masalah secara terstruktur.",
    lintasDisiplinIlmu: "Matematika & Bahasa Indonesia",
    tujuanPembelajaran: [
      "Peserta didik mampu mengidentifikasi dan mengonstruksi pemahaman konsep esensial.",
      "Peserta didik mampu mengaplikasikan konsep dalam memecahkan masalah kontekstual.",
      "Peserta didik mampu merefleksikan proses belajar dan menentukan tindak lanjut mandiri."
    ],
    topikPembelajaran: "Topik Pembelajaran Kontekstual",
    praktikPedagogis: "Problem Based Learning (PBL)",
    kemitraanPembelajaran: "Kolaborasi kelompok kerja antarmurid di kelas dan diskusi rekan sejawat.",
    lingkunganPembelajaran: "Iklim belajar yang aman, nyaman, dan saling memuliakan bagi seluruh siswa.",
    pemanfaatanDigital: "Video apersepsi interaktif, LKPD digital, dan aplikasi asesmen daring.",
    saranaPrasarana: "Laptop, Proyektor, Akses Internet, LKPD",

    // 3. Pengalaman Belajar
    kegiatanAwal: "1. Orientasi Bermakna: Guru membuka dengan salam, doa bersama, dan presensi.\n2. Apersepsi Kontekstual: Mengaitkan materi dengan pengalaman nyata sehari-hari siswa.\n3. Motivasi Menggembirakan: Menyampaikan tujuan belajar dan tantangan positif.",
    prinsipKegiatanAwal: "Berkesadaran, Bermakna, dan Menggembirakan",

    pengalamanMemahami: "Peserta didik secara aktif mengamati stimulus kasus dan mengonstruksi pemahaman materi esensial secara mandiri maupun berpasangan.",
    prinsipMemahami: "Berkesadaran dan Bermakna",

    pengalamanMengaplikasi: "Peserta didik berkolaborasi dalam kelompok mengaplikasikan pemahaman konsep untuk memecahkan skenario masalah nyata pada LKPD.",
    prinsipMengaplikasi: "Bermakna dan Menggembirakan",

    pengalamanMerefleksi: "1. Peserta didik mempresentasikan karya dan menerima umpan balik apresiatif.\n2. Peserta didik mengevaluasi kekuatan serta rencana tindak lanjut mandiri.",
    prinsipMerefleksi: "Berkesadaran dan Menggembirakan",

    kegiatanPenutup: "1. Guru bersama siswa menyimpulkan intisari pembelajaran.\n2. Guru memberikan apresiasi dan umpan balik konstruktif.\n3. Refleksi dan penutupan dengan doa.",
    prinsipKegiatanPenutup: "Bermakna dan Menggembirakan",

    // 4. Asesmen Pembelajaran
    asesmenAwal: "Asesmen Kesiapan: Pertanyaan lisan diagnostik kognitif & non-kognitif di awal kelas.",
    asesmenProses: "Assessment as & for learning: Penilaian Diri (Self-Assessment), Penilaian Sejawat (Peer-Assessment), dan observasi unjuk kerja.",
    asesmenAkhir: "Assessment of learning: Penilaian produk/proyek lembar kerja dan tes tertulis pemahaman konsep.",

    diferensiasi: "Diferensiasi proses dengan scaffolding bertahap bagi siswa yang memerlukan penguatan.",
    refleksiGuru: "Apakah seluruh alur memahami, mengaplikasi, dan merefleksi berjalan berkesadaran, bermakna, dan menggembirakan?",
    refleksiSiswa: "Pengalaman belajar bagian mana yang paling menarik dan apa wawasan baru yang kamu dapatkan?",
    lampiranLKPD: "Lembar Kerja Peserta Didik (LKPD) terlampir.",
    bahanBacaan: "Buku Siswa Kemdikbudristek, Modul Digital Pembelajaran Mendalam.",
    glosarium: "Daftar istilah penting terkait topik.",
    daftarPustaka: "Kemdikbudristek (2024). Panduan Pembelajaran Mendalam.",
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    const newModul: ModulAjar = {
      id: "modul-" + Date.now(),
      title: "RPP Pembelajaran Mendalam Baru",
      subjectId: subjects[0]?.id || "sbj-inf",
      classId: classes[0]?.id || "cls-10a",
      phase: "Fase E",
      duration: "2 JP (2 x 45 menit)",
      
      identifikasiPesertaDidik: "Identifikasi kesiapan peserta didik sebelum belajar, seperti pengetahuan awal, minat, latar belakang, dan kebutuhan belajar.",
      identifikasiMateri: "Analisis materi pelajaran seperti jenis pengetahuan yang akan dicapai, relevansi dengan kehidupan nyata, tingkat kesulitan, struktur materi, dan integrasi karakter.",
      dimensiProfilLulusan: ["Penalaran Kritis", "Kreativitas", "Kolaborasi", "Komunikasi"],

      capaianPembelajaran: "Capaian pembelajaran sesuai fase.",
      lintasDisiplinIlmu: "Disiplin ilmu dan/atau mata pelajaran yang relevan.",
      tujuanPembelajaran: ["Peserta didik mampu mengonstruksi pemahaman, mengaplikasikan konsep, dan merefleksikan proses belajar."],
      topikPembelajaran: "Topik Pembelajaran",
      praktikPedagogis: "Problem Based Learning (PBL)",
      kemitraanPembelajaran: "Kemitraan antarmurid, antarguru lintas mapel, atau komunitas terkait.",
      lingkunganPembelajaran: "Iklim belajar aman, nyaman, dan saling memuliakan di kelas dan platform daring.",
      pemanfaatanDigital: "Video pembelajaran, platform daring, dan aplikasi penilaian interaktif.",
      saranaPrasarana: "Laptop, Proyektor, LKPD",

      kegiatanAwal: "Orientasi bermakna, apersepsi kontekstual, dan motivasi menggembirakan (15 Menit).",
      prinsipKegiatanAwal: "Berkesadaran, Bermakna, Menggembirakan",
      pengalamanMemahami: "Aktivitas memfasilitasi peserta didik aktif mengonstruksi pengetahuan esensial, aplikatif, dan nilai karakter.",
      prinsipMemahami: "Berkesadaran dan Bermakna",
      pengalamanMengaplikasi: "Aktivitas mengondisikan peserta didik mengaplikasikan pemahaman secara kontekstual pada skenario nyata.",
      prinsipMengaplikasi: "Bermakna dan Menggembirakan",
      pengalamanMerefleksi: "Aktivitas mengevaluasi proses/hasil tindakan nyata, menentukan tindak lanjut, dan mengelola belajar mandiri.",
      prinsipMerefleksi: "Berkesadaran dan Menggembirakan",
      kegiatanPenutup: "Memberikan umpan balik konstruktif, menyimpulkan pembelajaran, dan merencanakan pembelajaran selanjutnya (15 Menit).",
      prinsipKegiatanPenutup: "Bermakna dan Menggembirakan",

      asesmenAwal: "Asesmen pada awal pembelajaran (kesiapan / diagnostik kognitif & non-kognitif).",
      asesmenProses: "Asesmen pada proses (Assessment as & for learning: penilaian diri, penilaian sejawat, observasi, kinerja).",
      asesmenAkhir: "Asesmen pada akhir pembelajaran (Assessment of learning: penilaian produk/proyek/portofolio/tes tertulis).",

      diferensiasi: "Diferensiasi proses dan konten sesuai profil belajar siswa.",
      refleksiGuru: "Refleksi pencapaian tujuan pembelajaran dan efektivitas sintaks.",
      refleksiSiswa: "Refleksi pengalaman belajar siswa.",
      lampiranLKPD: "LKPD terlampir.",
      bahanBacaan: "Buku Teks & Modul Digital.",
      glosarium: "Istilah kunci.",
      daftarPustaka: "Kemdikbudristek (2024).",
      createdAt: new Date().toISOString(),
    };
    setFormData(newModul);
    setActiveTab("identifikasi");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mod: ModulAjar) => {
    setFormData({
      ...mod,
      dimensiProfilLulusan: mod.dimensiProfilLulusan || mod.profilPelajarPancasila || ["Penalaran Kritis", "Kolaborasi"],
      tujuanPembelajaran: mod.tujuanPembelajaran || mod.learningObjectives || ["Peserta didik mampu..."],
      topikPembelajaran: mod.topikPembelajaran || mod.title,
      praktikPedagogis: mod.praktikPedagogis || mod.model || mod.learningModel || "Problem Based Learning (PBL)",
      pengalamanMemahami: mod.pengalamanMemahami || (Array.isArray(mod.kegiatanInti) ? mod.kegiatanInti[0] : "Mengonstruksi pengetahuan esensial."),
      pengalamanMengaplikasi: mod.pengalamanMengaplikasi || (Array.isArray(mod.kegiatanInti) ? mod.kegiatanInti[1] : "Mengaplikasikan pemahaman secara kontekstual."),
      pengalamanMerefleksi: mod.pengalamanMerefleksi || (Array.isArray(mod.kegiatanInti) ? mod.kegiatanInti[2] : "Mengevaluasi hasil dan menentukan tindak lanjut."),
      kegiatanAwal: mod.kegiatanAwal || (Array.isArray(mod.kegiatanPendahuluan) ? mod.kegiatanPendahuluan.join("\n") : "Orientasi, apersepsi, dan motivasi."),
      kegiatanPenutup: mod.kegiatanPenutup || (Array.isArray(mod.kegiatanPenutupList) ? mod.kegiatanPenutupList.join("\n") : "Umpan balik konstruktif dan kesimpulan."),
      asesmenProses: mod.asesmenProses || mod.asesmenFormatif || mod.assessmentPlan?.formative || "-",
      asesmenAkhir: mod.asesmenAkhir || mod.asesmenSumatif || mod.assessmentPlan?.summative || "-",
    });
    setActiveTab("identifikasi");
    setIsModalOpen(true);
  };

  const handleDuplicate = (mod: ModulAjar) => {
    const dup: ModulAjar = {
      ...mod,
      id: "modul-" + Date.now(),
      title: `${mod.title} (Salinan)`,
      createdAt: new Date().toISOString(),
    };
    saveModulAjar(dup);
    setSelectedModul(dup);
    addToast("success", "RPP Diduplikasi", `Berhasil menyalin "${mod.title}".`);
  };

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) {
      addToast("warning", "Topik Wajib Diisi", "Tuliskan topik / materi yang ingin dibuatkan RPP Pembelajaran Mendalam.");
      return;
    }

    setIsAiLoading(true);
    try {
      const { prompt, systemInstruction } = createModulAjarPrompt(
        {
          school: schoolProfile,
          teacher: teacherProfile,
          subject: subjects.find((s) => s.id === formData.subjectId),
          classInfo: classes.find((c) => c.id === formData.classId),
        },
        aiTopic,
        aiModel,
        aiDuration
      );

      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction, temperature: 0.7 }),
      });
      const data = await res.json();
      if (data.text) {
        try {
          const parsed = JSON.parse(data.text.replace(/```json|```/g, "").trim());
          const generatedModul: ModulAjar = {
            ...formData,
            id: formData.id || "modul-" + Date.now(),
            title: parsed.title || `RPP Pembelajaran Mendalam: ${aiTopic}`,
            phase: parsed.phase || formData.phase,
            duration: parsed.duration || aiDuration,
            
            // 1. Identifikasi
            identifikasiPesertaDidik: parsed.identifikasiPesertaDidik || formData.identifikasiPesertaDidik,
            identifikasiMateri: parsed.identifikasiMateri || formData.identifikasiMateri,
            dimensiProfilLulusan: parsed.dimensiProfilLulusan || formData.dimensiProfilLulusan,

            // 2. Desain Pembelajaran
            capaianPembelajaran: parsed.capaianPembelajaran || formData.capaianPembelajaran,
            lintasDisiplinIlmu: parsed.lintasDisiplinIlmu || formData.lintasDisiplinIlmu,
            tujuanPembelajaran: parsed.tujuanPembelajaran || formData.tujuanPembelajaran,
            topikPembelajaran: parsed.topikPembelajaran || aiTopic,
            praktikPedagogis: parsed.praktikPedagogis || aiModel,
            model: parsed.praktikPedagogis || aiModel,
            kemitraanPembelajaran: parsed.kemitraanPembelajaran || formData.kemitraanPembelajaran,
            lingkunganPembelajaran: parsed.lingkunganPembelajaran || formData.lingkunganPembelajaran,
            pemanfaatanDigital: parsed.pemanfaatanDigital || formData.pemanfaatanDigital,
            saranaPrasarana: parsed.saranaPrasarana || formData.saranaPrasarana,

            // 3. Pengalaman Belajar
            kegiatanAwal: parsed.kegiatanAwal || formData.kegiatanAwal,
            prinsipKegiatanAwal: parsed.prinsipKegiatanAwal || "Berkesadaran, Bermakna, Menggembirakan",
            pengalamanMemahami: parsed.pengalamanMemahami || formData.pengalamanMemahami,
            prinsipMemahami: parsed.prinsipMemahami || "Berkesadaran dan Bermakna",
            pengalamanMengaplikasi: parsed.pengalamanMengaplikasi || formData.pengalamanMengaplikasi,
            prinsipMengaplikasi: parsed.prinsipMengaplikasi || "Bermakna dan Menggembirakan",
            pengalamanMerefleksi: parsed.pengalamanMerefleksi || formData.pengalamanMerefleksi,
            prinsipMerefleksi: parsed.prinsipMerefleksi || "Berkesadaran dan Menggembirakan",
            kegiatanPenutup: parsed.kegiatanPenutup || formData.kegiatanPenutup,
            prinsipKegiatanPenutup: parsed.prinsipKegiatanPenutup || "Bermakna dan Menggembirakan",

            // 4. Asesmen
            asesmenAwal: parsed.asesmenAwal || formData.asesmenAwal,
            asesmenProses: parsed.asesmenProses || formData.asesmenProses,
            asesmenAkhir: parsed.asesmenAkhir || formData.asesmenAkhir,

            diferensiasi: parsed.diferensiasi || formData.diferensiasi,
            refleksiGuru: parsed.refleksiGuru || formData.refleksiGuru,
            refleksiSiswa: parsed.refleksiSiswa || formData.refleksiSiswa,
            lampiranLKPD: parsed.lampiranLKPD || formData.lampiranLKPD,
            bahanBacaan: parsed.bahanBacaan || formData.bahanBacaan,
            glosarium: parsed.glosarium || formData.glosarium,
            daftarPustaka: parsed.daftarPustaka || formData.daftarPustaka,
          };
          setFormData(generatedModul);
          setIsAiModalOpen(false);
          setIsModalOpen(true);
          addToast("success", "RPP Pembelajaran Mendalam Dirancang", "Draf RPP berhasil disusun oleh AI sesuai format Pembelajaran Mendalam.");
        } catch {
          addToast("info", "Respons AI Diterima", data.text.slice(0, 120));
        }
      }
    } catch (e) {
      console.error(e);
      addToast("error", "AI Gagal", "Gagal merancang RPP Pembelajaran Mendalam.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveModulAjar(formData);
    setSelectedModul(formData);
    setIsModalOpen(false);
  };

  const toggleDimensi = (dimensiId: string) => {
    const cur = formData.dimensiProfilLulusan || [];
    if (cur.includes(dimensiId)) {
      setFormData({ ...formData, dimensiProfilLulusan: cur.filter((d) => d !== dimensiId) });
    } else {
      setFormData({ ...formData, dimensiProfilLulusan: [...cur, dimensiId] });
    }
  };

  const handlePrint = (mod: ModulAjar) => {
    const cleanTopic = (mod.topikPembelajaran || mod.title || "").replace(/^(?:(?:RPP|Modul Ajar|Rencana Pelaksanaan Pembelajaran)(?:\s+Pembelajaran\s+Mendalam)?\s*:\s*)+/gi, "");
    setPreviewDoc({
      title: cleanTopic || mod.title,
      docType: "MODUL_AJAR_DOCUMENT",
      dataObj: {
        modul: {
          ...mod,
          title: cleanTopic || mod.title,
        },
        school: schoolProfile,
        teacher: teacherProfile,
        subject: subjects.find((s) => s.id === mod.subjectId),
        classInfo: classes.find((c) => c.id === mod.classId),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              RPP Pembelajaran Mendalam (Deep Learning)
            </h2>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Format Resmi 4 Pilar
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perencanaan Pembelajaran Mendalam: Identifikasi, Desain Pembelajaran, Pengalaman Belajar (Memahami-Mengaplikasi-Merefleksi), dan Asesmen Autentik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAiTopic("");
              setIsAiModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            AI Generator RPP Mendalam
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah RPP Manual
          </button>
        </div>
      </div>

      {/* 4 Pilar Pembelajaran Mendalam Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 dark:border-blue-900 dark:bg-blue-950/30">
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">1</span>
            Identifikasi
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
            Kesiapan peserta didik, karakteristik materi, dan 8 dimensi profil lulusan.
          </p>
        </div>

        <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3.5 dark:border-indigo-900 dark:bg-indigo-950/30">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px]">2</span>
            Desain Pembelajaran
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
            CP, Lintas Disiplin, TP, Topik, Praktik Pedagogis, Kemitraan, Lingkungan & Digital.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">3</span>
            Pengalaman Belajar
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
            Prinsip Berkesadaran, Bermakna, Menggembirakan: <strong>Memahami, Mengaplikasi, Merefleksi</strong>.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 dark:border-amber-900 dark:bg-amber-950/30">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white text-[10px]">4</span>
            Asesmen Pembelajaran
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
            Asesmen Awal (Diagnostik), Proses (<em>As & For Learning</em>), dan Akhir (<em>Of Learning</em>).
          </p>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedClassId={filterClassId}
        onClassChange={(id) => setFilterClassId(id)}
        selectedSubjectId={filterSubjectId}
        onSubjectChange={(id) => setFilterSubjectId(id)}
        extraControls={
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Menampilkan <b>{filteredModulList.length}</b> RPP Pembelajaran Mendalam
          </span>
        }
      />

      {/* Main Layout: List & Reader */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: List of RPP */}
        <div className="space-y-3 lg:col-span-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Daftar RPP Pembelajaran Mendalam ({filteredModulList.length})
          </h3>

          <div className="space-y-2">
            {filteredModulList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 dark:border-slate-700">
                Tidak ada RPP yang sesuai filter mata pelajaran/kelas ini.
              </div>
            ) : (
              filteredModulList.map((mod) => {
              const isSelected = selectedModul?.id === mod.id;
              const sbj = subjects.find((s) => s.id === mod.subjectId);
              return (
                <div
                  key={mod.id}
                  onClick={() => setSelectedModul(mod)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/40 shadow-xs dark:border-blue-500 dark:bg-blue-950/30"
                      : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                      {mod.phase}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">{mod.duration || mod.allocatedHours || "2 JP"}</span>
                  </div>

                  <h4 className="mt-2 text-xs font-bold text-slate-900 line-clamp-2 dark:text-white">
                    {mod.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500">{sbj?.name || "Mata Pelajaran"}</p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400">{mod.praktikPedagogis || mod.model || "Problem Based Learning"}</span>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDuplicate(mod)}
                        className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Duplikat RPP"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(mod)}
                        className="rounded p-1 text-slate-400 hover:text-blue-600"
                        title="Edit RPP"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus ${mod.title}?`)) deleteModulAjar(mod.id);
                        }}
                        className="rounded p-1 text-slate-400 hover:text-rose-600"
                        title="Hapus RPP"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        {/* Right Column: Detailed RPP Reader */}
        <div className="lg:col-span-8">
          {selectedModul ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
              {/* Top Bar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {selectedModul.phase}
                    </span>
                    <span className="text-xs text-slate-400">Alokasi: {selectedModul.duration || selectedModul.allocatedHours || "2 JP"}</span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    {selectedModul.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedModul)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit RPP
                  </button>
                  <button
                    onClick={() => handlePrint(selectedModul)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Cetak / Export PDF
                  </button>
                </div>
              </div>

              {/* RPP Pembelajaran Mendalam Full Breakdown */}
              <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
                {/* 1. IDENTIFIKASI */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-950 dark:bg-blue-950/20 space-y-3">
                  <div className="flex items-center gap-2 border-b border-blue-200 pb-2 dark:border-blue-900">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-[10px]">1</span>
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider text-xs">
                      IDENTIFIKASI
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Peserta Didik (Kesiapan & Kebutuhan):</span>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {selectedModul.identifikasiPesertaDidik || selectedModul.initialCompetency || "Identifikasi kesiapan, pengetahuan awal, minat, dan kebutuhan belajar peserta didik."}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Materi Pelajaran (Analisis & Karakteristik):</span>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        {selectedModul.identifikasiMateri || "Analisis jenis pengetahuan (esensial, aplikatif, nilai/karakter), relevansi kehidupan nyata, dan tingkat kesulitan."}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">Dimensi Profil Lulusan:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {(selectedModul.dimensiProfilLulusan || selectedModul.profilPelajarPancasila || ["Penalaran Kritis", "Kolaborasi"]).map((dim, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                          >
                            ✓ {dim}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. DESAIN PEMBELAJARAN */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-950 dark:bg-indigo-950/20 space-y-3">
                  <div className="flex items-center gap-2 border-b border-indigo-200 pb-2 dark:border-indigo-900">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px]">2</span>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider text-xs">
                      DESAIN PEMBELAJARAN
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2 bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white">Capaian Pembelajaran (CP):</span>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300">{selectedModul.capaianPembelajaran || selectedModul.cpReference || "-"}</p>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white">Topik Pembelajaran:</span>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300">{selectedModul.topikPembelajaran || selectedModul.title}</p>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white">Lintas Disiplin Ilmu:</span>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300">{selectedModul.lintasDisiplinIlmu || "-"}</p>
                    </div>

                    <div className="sm:col-span-2 bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="font-semibold text-slate-900 dark:text-white">Tujuan Pembelajaran (TP):</span>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                        {(selectedModul.tujuanPembelajaran || selectedModul.learningObjectives || []).map((tp, idx) => (
                          <li key={idx}>{tp}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white">Praktik Pedagogis (Model/Metode):</span>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300 font-medium">{selectedModul.praktikPedagogis || selectedModul.model || selectedModul.learningModel || "Problem Based Learning (PBL)"}</p>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white">Kemitraan Pembelajaran:</span>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300">{selectedModul.kemitraanPembelajaran || "-"}</p>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white">Lingkungan Pembelajaran:</span>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300">{selectedModul.lingkunganPembelajaran || "Budaya belajar aman, nyaman, dan saling memuliakan."}</p>
                    </div>

                    <div className="bg-white/70 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white">Pemanfaatan Digital:</span>
                      <p className="mt-0.5 text-slate-700 dark:text-slate-300">{selectedModul.pemanfaatanDigital || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* 3. PENGALAMAN BELAJAR (LANGKAH-LANGKAH) */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-950 dark:bg-emerald-950/20 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-200 pb-2 dark:border-emerald-900">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">3</span>
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider text-xs">
                        PENGALAMAN BELAJAR (LANGKAH-LANGKAH)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                      Prinsip: Berkesadaran • Bermakna • Menggembirakan
                    </span>
                  </div>

                  {/* AWAL */}
                  <div className="rounded-xl bg-white dark:bg-slate-850 p-3.5 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700 dark:text-blue-300 text-[11px] uppercase">
                        A. Kegiatan Awal (Pembuka)
                      </span>
                      <span className="text-[10px] text-slate-400 italic">
                        Prinsip: {selectedModul.prinsipKegiatanAwal || "Berkesadaran, Bermakna, Menggembirakan"}
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedModul.kegiatanAwal || (Array.isArray(selectedModul.kegiatanPendahuluan) ? selectedModul.kegiatanPendahuluan.join("\n") : "Orientasi yang bermakna, apersepsi yang kontekstual, dan motivasi yang menggembirakan.")}
                    </p>
                  </div>

                  {/* INTI: Memahami, Mengaplikasi, Merefleksi */}
                  <div className="space-y-2.5">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      B. Kegiatan Inti (Pengalaman Belajar 3M):
                    </span>

                    {/* Memahami */}
                    <div className="rounded-xl bg-white dark:bg-slate-850 p-3.5 border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-700 dark:text-indigo-300 text-[11px]">
                          1. Memahami (Konstruksi Pengetahuan Mendalam)
                        </span>
                        <span className="text-[10px] text-indigo-500 italic">
                          Prinsip: {selectedModul.prinsipMemahami || "Berkesadaran dan Bermakna"}
                        </span>
                      </div>
                      <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedModul.pengalamanMemahami || "Peserta didik aktif mengonstruksi pemahaman esensial dan aplikatif."}
                      </p>
                    </div>

                    {/* Mengaplikasi */}
                    <div className="rounded-xl bg-white dark:bg-slate-850 p-3.5 border-l-4 border-l-emerald-500 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px]">
                          2. Mengaplikasi (Aktivitas Kontekstual / Masalah Nyata)
                        </span>
                        <span className="text-[10px] text-emerald-500 italic">
                          Prinsip: {selectedModul.prinsipMengaplikasi || "Bermakna dan Menggembirakan"}
                        </span>
                      </div>
                      <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedModul.pengalamanMengaplikasi || "Peserta didik mengaplikasikan konsep dalam memecahkan masalah kontekstual pada skenario nyata."}
                      </p>
                    </div>

                    {/* Merefleksi */}
                    <div className="rounded-xl bg-white dark:bg-slate-850 p-3.5 border-l-4 border-l-purple-500 border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-700 dark:text-purple-300 text-[11px]">
                          3. Merefleksi (Evaluasi, Pemaknaan & Pengelolaan Diri)
                        </span>
                        <span className="text-[10px] text-purple-500 italic">
                          Prinsip: {selectedModul.prinsipMerefleksi || "Berkesadaran dan Menggembirakan"}
                        </span>
                      </div>
                      <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedModul.pengalamanMerefleksi || "Mengevaluasi proses & hasil tindakan serta menentukan strategi tindak lanjut belajar mandiri."}
                      </p>
                    </div>
                  </div>

                  {/* PENUTUP */}
                  <div className="rounded-xl bg-white dark:bg-slate-850 p-3.5 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px] uppercase">
                        C. Kegiatan Penutup
                      </span>
                      <span className="text-[10px] text-slate-400 italic">
                        Prinsip: {selectedModul.prinsipKegiatanPenutup || "Bermakna dan Menggembirakan"}
                      </span>
                    </div>
                    <p className="whitespace-pre-line text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedModul.kegiatanPenutup || (Array.isArray(selectedModul.kegiatanPenutupList) ? selectedModul.kegiatanPenutupList.join("\n") : "Memberikan umpan balik konstruktif, menyimpulkan pembelajaran, dan perencanaan tindak lanjut.")}
                    </p>
                  </div>
                </div>

                {/* 4. ASESMEN PEMBELAJARAN */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 dark:border-amber-950 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-200 pb-2 dark:border-amber-900">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-[10px]">4</span>
                    <h4 className="font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider text-xs">
                      ASESMEN PEMBELAJARAN
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">
                        A. Asesmen Awal:
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedModul.asesmenAwal || selectedModul.assessmentPlan?.diagnostic || "Asesmen kesiapan belajar / diagnostik kognitif & non-kognitif."}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">
                        B. Asesmen Proses (As & For Learning):
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedModul.asesmenProses || selectedModul.asesmenFormatif || selectedModul.assessmentPlan?.formative || "Penilaian Diri, Penilaian Sejawat, Observasi Kinerja."}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white text-[11px] block">
                        C. Asesmen Akhir (Of Learning):
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {selectedModul.asesmenAkhir || selectedModul.asesmenSumatif || selectedModul.assessmentPlan?.summative || "Penilaian Produk/Proyek, Portofolio, Tes Tertulis."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Diferensiasi, Refleksi & Referensi */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-slate-600">
                    Diferensiasi & Referensi Pembelajaran
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                    <p><strong>Diferensiasi:</strong> {selectedModul.diferensiasi || "-"}</p>
                    <p><strong>Refleksi Guru:</strong> {selectedModul.refleksiGuru || "-"}</p>
                    <p><strong>Bahan Bacaan:</strong> {selectedModul.bahanBacaan || "-"}</p>
                    <p><strong>Daftar Pustaka:</strong> {selectedModul.daftarPustaka || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400">
              Pilih salah satu RPP Pembelajaran Mendalam di sebelah kiri untuk melihat rincian lengkap.
            </div>
          )}
        </div>
      </div>

      {/* Modal AI Generator Setup */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    AI Generator RPP Pembelajaran Mendalam
                  </h3>
                  <span className="text-[10px] text-slate-400">Deep Learning Kurikulum Merdeka</span>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Topik / Materi Pokok Pembelajaran *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Algoritma Pencarian & Optimasi Logika"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Model / Strategi Pedagogis
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
                  <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
                  <option value="Discovery Learning (DL)">Discovery Learning (DL)</option>
                  <option value="Inquiry Learning">Inquiry Learning</option>
                  <option value="Kontekstual (Contextual Teaching & Learning)">Kontekstual (CTL)</option>
                  <option value="Teaching at The Right Level (TaRL)">Teaching at The Right Level (TaRL)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Alokasi Waktu
                  </label>
                  <input
                    type="text"
                    value={aiDuration}
                    onChange={(e) => setAiDuration(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300">
                    Target Fase / Kelas
                  </label>
                  <input
                    type="text"
                    value={aiTargetClass}
                    onChange={(e) => setAiTargetClass(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-indigo-50 p-3 text-[11px] text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                AI akan merancang RPP Pembelajaran Mendalam mencakup <strong>Identifikasi Kesiapan & Karakteristik Materi</strong>, <strong>8 Dimensi Profil Lulusan</strong>, <strong>Desain Pembelajaran</strong>, <strong>Pengalaman Belajar 3M (Memahami, Mengaplikasi, Merefleksi)</strong>, dan <strong>Asesmen Awal, Proses, serta Akhir</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isAiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {isAiLoading ? "Merancang RPP..." : "Mulai Rancang RPP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Manual / Full Edit RPP Pembelajaran Mendalam */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Formulir RPP Pembelajaran Mendalam (Deep Learning)
                </h3>
                <span className="text-[10px] text-slate-400">Kurikulum Merdeka Menuju Pendidikan Bermutu untuk Semua</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Tabs: 4 Pillars of Deep Learning */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("identifikasi")}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  activeTab === "identifikasi"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                }`}
              >
                1. Identifikasi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("desain")}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  activeTab === "desain"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                }`}
              >
                2. Desain Pembelajaran
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("pengalaman")}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  activeTab === "pengalaman"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                }`}
              >
                3. Pengalaman Belajar (3M)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("asesmen")}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  activeTab === "asesmen"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                }`}
              >
                4. Asesmen Pembelajaran
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("referensi")}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  activeTab === "referensi"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
                }`}
              >
                5. Lampiran & Referensi
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
              {/* TAB 1: IDENTIFIKASI */}
              {activeTab === "identifikasi" && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-blue-50/70 p-3 text-[11px] text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
                    <strong>Pilar 1 - Identifikasi:</strong> Memetakan kesiapan dan latar belakang peserta didik, analisis karakteristik materi pelajaran, dan penentuan dimensi profil lulusan yang ditargetkan.
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Peserta Didik (opsional) - Kesiapan & Latar Belakang
                    </label>
                    <span className="text-[10px] text-slate-400 block mb-1">
                      Identifikasi kesiapan peserta didik sebelum belajar, seperti pengetahuan awal, minat, latar belakang, dan kebutuhan belajar.
                    </span>
                    <textarea
                      rows={3}
                      value={formData.identifikasiPesertaDidik || ""}
                      onChange={(e) => setFormData({ ...formData, identifikasiPesertaDidik: e.target.value })}
                      placeholder="Tuliskan analisis kesiapan peserta didik..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Materi Pelajaran (opsional) - Karakteristik & Analisis
                    </label>
                    <span className="text-[10px] text-slate-400 block mb-1">
                      Tuliskan analisis materi seperti jenis pengetahuan yang akan dicapai, relevansi kehidupan nyata, tingkat kesulitan, dan integrasi nilai karakter.
                    </span>
                    <textarea
                      rows={3}
                      value={formData.identifikasiMateri || ""}
                      onChange={(e) => setFormData({ ...formData, identifikasiMateri: e.target.value })}
                      placeholder="Tuliskan analisis karakteristik materi pelajaran..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Dimensi Profil Lulusan (Pilih dimensi yang akan dicapai dalam pembelajaran)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {DIMENSI_PROFIL_OPTIONS.map((dim) => {
                        const isChecked = (formData.dimensiProfilLulusan || []).includes(dim.id);
                        const Icon = dim.icon;
                        return (
                          <div
                            key={dim.id}
                            onClick={() => toggleDimensi(dim.id)}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                              isChecked
                                ? "border-blue-500 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200 font-bold"
                                : "border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            }`}
                          >
                            <div className={`p-1 rounded-md ${isChecked ? "text-blue-600" : "text-slate-400"}`}>
                              {isChecked ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                            </div>
                            <span className="text-xs">{dim.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DESAIN PEMBELAJARAN */}
              {activeTab === "desain" && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 dark:text-slate-300">Judul RPP Pembelajaran Mendalam *</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300">Alokasi Waktu</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Capaian Pembelajaran (opsional)</label>
                    <textarea
                      rows={2}
                      value={formData.capaianPembelajaran || ""}
                      onChange={(e) => setFormData({ ...formData, capaianPembelajaran: e.target.value })}
                      placeholder="Tuliskan capaian pembelajaran sesuai fase..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300">Topik Pembelajaran (opsional)</label>
                      <input
                        type="text"
                        value={formData.topikPembelajaran || ""}
                        onChange={(e) => setFormData({ ...formData, topikPembelajaran: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300">Lintas Disiplin Ilmu (opsional)</label>
                      <input
                        type="text"
                        value={formData.lintasDisiplinIlmu || ""}
                        onChange={(e) => setFormData({ ...formData, lintasDisiplinIlmu: e.target.value })}
                        placeholder="Disiplin ilmu / mapel yang relevan"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Tujuan Pembelajaran * (Tuliskan per baris dengan KKO operasional)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={(formData.tujuanPembelajaran || []).join("\n")}
                      onChange={(e) => setFormData({ ...formData, tujuanPembelajaran: e.target.value.split("\n").filter((t) => t.trim()) })}
                      placeholder="Tuliskan tujuan pembelajaran mencakup kompetensi dan konten..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Praktik Pedagogis (Model / Strategi / Metode Pembelajaran)
                    </label>
                    <input
                      type="text"
                      value={formData.praktikPedagogis || ""}
                      onChange={(e) => setFormData({ ...formData, praktikPedagogis: e.target.value, model: e.target.value })}
                      placeholder="Contoh: Problem Based Learning, Project Based Learning, Inkuiri, dll."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300">Kemitraan Pembelajaran (opsional)</label>
                      <input
                        type="text"
                        value={formData.kemitraanPembelajaran || ""}
                        onChange={(e) => setFormData({ ...formData, kemitraanPembelajaran: e.target.value })}
                        placeholder="Kemitraan antar guru, murid, orang tua, DUDI, komunitas"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300">Pemanfaatan Digital (opsional)</label>
                      <input
                        type="text"
                        value={formData.pemanfaatanDigital || ""}
                        onChange={(e) => setFormData({ ...formData, pemanfaatanDigital: e.target.value })}
                        placeholder="Video interaktif, platform daring, aplikasi penilaian"
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Lingkungan Pembelajaran</label>
                    <input
                      type="text"
                      value={formData.lingkunganPembelajaran || ""}
                      onChange={(e) => setFormData({ ...formData, lingkunganPembelajaran: e.target.value })}
                      placeholder="Budaya belajar aman, nyaman, dan saling memuliakan"
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: PENGALAMAN BELAJAR */}
              {activeTab === "pengalaman" && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-emerald-50/70 p-3 text-[11px] text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                    <strong>Pilar 3 - Pengalaman Belajar:</strong> Dirancang dengan prinsip <em>berkesadaran (mindful)</em>, <em>bermakna (meaningful)</em>, dan <em>menggembirakan (joyful)</em> melalui tahapan Awal, Inti (<strong>Memahami, Mengaplikasi, Merefleksi</strong>), dan Penutup.
                  </div>

                  {/* AWAL */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-blue-100 bg-blue-50/20 dark:border-blue-900">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-blue-800 dark:text-blue-300">
                        A. Kegiatan AWAL (Pembuka)
                      </label>
                      <input
                        type="text"
                        placeholder="Prinsip (misal: Berkesadaran, Bermakna, Menggembirakan)"
                        value={formData.prinsipKegiatanAwal || ""}
                        onChange={(e) => setFormData({ ...formData, prinsipKegiatanAwal: e.target.value })}
                        className="text-[10px] rounded px-2 py-0.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Orientasi yang bermakna, apersepsi yang kontekstual, dan motivasi yang menggembirakan.
                    </span>
                    <textarea
                      rows={3}
                      value={formData.kegiatanAwal || ""}
                      onChange={(e) => setFormData({ ...formData, kegiatanAwal: e.target.value })}
                      placeholder="Tuliskan kegiatan awal pembelajaran..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  {/* INTI: Memahami */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-indigo-100 bg-indigo-50/20 dark:border-indigo-900">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-indigo-800 dark:text-indigo-300">
                        B.1. Memahami (Konstruksi Pengetahuan Mendalam)
                      </label>
                      <input
                        type="text"
                        placeholder="Prinsip (misal: Berkesadaran dan Bermakna)"
                        value={formData.prinsipMemahami || ""}
                        onChange={(e) => setFormData({ ...formData, prinsipMemahami: e.target.value })}
                        className="text-[10px] rounded px-2 py-0.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Kegiatan yang memfasilitasi peserta didik aktif mengonstruksi pemahaman esensial, aplikatif, dan nilai karakter.
                    </span>
                    <textarea
                      rows={3}
                      value={formData.pengalamanMemahami || ""}
                      onChange={(e) => setFormData({ ...formData, pengalamanMemahami: e.target.value })}
                      placeholder="Tuliskan kegiatan memahami konsep materi..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  {/* INTI: Mengaplikasi */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 dark:border-emerald-900">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-emerald-800 dark:text-emerald-300">
                        B.2. Mengaplikasi (Aktivitas Kontekstual & Kasus Nyata)
                      </label>
                      <input
                        type="text"
                        placeholder="Prinsip (misal: Bermakna dan Menggembirakan)"
                        value={formData.prinsipMengaplikasi || ""}
                        onChange={(e) => setFormData({ ...formData, prinsipMengaplikasi: e.target.value })}
                        className="text-[10px] rounded px-2 py-0.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Kegiatan yang mengondisikan peserta didik mengaplikasikan pemahaman secara kontekstual atau kehidupan nyata.
                    </span>
                    <textarea
                      rows={3}
                      value={formData.pengalamanMengaplikasi || ""}
                      onChange={(e) => setFormData({ ...formData, pengalamanMengaplikasi: e.target.value })}
                      placeholder="Tuliskan kegiatan pengaplikasian materi..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  {/* INTI: Merefleksi */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-purple-100 bg-purple-50/20 dark:border-purple-900">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-purple-800 dark:text-purple-300">
                        B.3. Merefleksi (Evaluasi, Pemaknaan & Pengelolaan Diri)
                      </label>
                      <input
                        type="text"
                        placeholder="Prinsip (misal: Berkesadaran dan Menggembirakan)"
                        value={formData.prinsipMerefleksi || ""}
                        onChange={(e) => setFormData({ ...formData, prinsipMerefleksi: e.target.value })}
                        className="text-[10px] rounded px-2 py-0.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Mengevaluasi hasil/tindakan nyata, menentukan tindak lanjut, dan mengelola proses belajar mandiri.
                    </span>
                    <textarea
                      rows={3}
                      value={formData.pengalamanMerefleksi || ""}
                      onChange={(e) => setFormData({ ...formData, pengalamanMerefleksi: e.target.value })}
                      placeholder="Tuliskan kegiatan refleksi peserta didik..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  {/* PENUTUP */}
                  <div className="space-y-1.5 p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 dark:border-emerald-900">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-emerald-800 dark:text-emerald-300">
                        C. Kegiatan PENUTUP
                      </label>
                      <input
                        type="text"
                        placeholder="Prinsip (misal: Bermakna dan Menggembirakan)"
                        value={formData.prinsipKegiatanPenutup || ""}
                        onChange={(e) => setFormData({ ...formData, prinsipKegiatanPenutup: e.target.value })}
                        className="text-[10px] rounded px-2 py-0.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      Memberikan umpan balik konstruktif, menyimpulkan pembelajaran, dan merencanakan pembelajaran selanjutnya.
                    </span>
                    <textarea
                      rows={3}
                      value={formData.kegiatanPenutup || ""}
                      onChange={(e) => setFormData({ ...formData, kegiatanPenutup: e.target.value })}
                      placeholder="Tuliskan kegiatan penutup pembelajaran..."
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: ASESMEN PEMBELAJARAN */}
              {activeTab === "asesmen" && (
                <div className="space-y-4">
                  <div className="rounded-xl bg-amber-50/70 p-3 text-[11px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                    <strong>Pilar 4 - Asesmen Pembelajaran:</strong> Meliputi Asesmen sebagai Pembelajaran (<em>Assessment as learning</em>), Asesmen untuk Pembelajaran (<em>Assessment for learning</em>), dan Asesmen Hasil Pembelajaran (<em>Assessment of learning</em>).
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Asesmen pada AWAL Pembelajaran (Kesiapan / Diagnostik)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.asesmenAwal || ""}
                      onChange={(e) => setFormData({ ...formData, asesmenAwal: e.target.value })}
                      placeholder="Contoh: Kuis lisan pemantik awal, tes diagnostik kognitif & non-kognitif..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Asesmen pada PROSES Pembelajaran (Assessment as & for learning)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.asesmenProses || formData.asesmenFormatif || ""}
                      onChange={(e) => setFormData({ ...formData, asesmenProses: e.target.value, asesmenFormatif: e.target.value })}
                      placeholder="Contoh: Penilaian Diri, Penilaian Sejawat, Observasi kinerja, Lembar pengamatan diskusi..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">
                      Asesmen pada AKHIR Pembelajaran (Assessment of learning)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.asesmenAkhir || formData.asesmenSumatif || ""}
                      onChange={(e) => setFormData({ ...formData, asesmenAkhir: e.target.value, asesmenSumatif: e.target.value })}
                      placeholder="Contoh: Penilaian Proyek, Penilaian Produk, Portofolio, Tes Tertulis/Lisan..."
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300">Diferensiasi & Remedial</label>
                      <textarea
                        rows={2}
                        value={formData.diferensiasi || ""}
                        onChange={(e) => setFormData({ ...formData, diferensiasi: e.target.value })}
                        placeholder="Strategi diferensiasi proses/konten dan remedial..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300">Refleksi Guru</label>
                      <textarea
                        rows={2}
                        value={formData.refleksiGuru || ""}
                        onChange={(e) => setFormData({ ...formData, refleksiGuru: e.target.value })}
                        placeholder="Refleksi ketercapaian tujuan belajar..."
                        className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: LAMPIRAN & REFERENSI */}
              {activeTab === "referensi" && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Bahan Bacaan Guru & Siswa</label>
                    <input
                      type="text"
                      value={formData.bahanBacaan || ""}
                      onChange={(e) => setFormData({ ...formData, bahanBacaan: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Glosarium</label>
                    <input
                      type="text"
                      value={formData.glosarium || ""}
                      onChange={(e) => setFormData({ ...formData, glosarium: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300">Daftar Pustaka</label>
                    <input
                      type="text"
                      value={formData.daftarPustaka || ""}
                      onChange={(e) => setFormData({ ...formData, daftarPustaka: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Form Bottom Actions */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="text-[11px] text-slate-400">
                  {activeTab === "identifikasi" && "Langkah 1/5: Identifikasi Kesiapan & Karakteristik"}
                  {activeTab === "desain" && "Langkah 2/5: Desain & Kerangka Pembelajaran"}
                  {activeTab === "pengalaman" && "Langkah 3/5: Pengalaman Belajar 3M"}
                  {activeTab === "asesmen" && "Langkah 4/5: Asesmen Awal, Proses & Akhir"}
                  {activeTab === "referensi" && "Langkah 5/5: Lampiran & Referensi"}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4" />
                    Simpan RPP Pembelajaran Mendalam
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
