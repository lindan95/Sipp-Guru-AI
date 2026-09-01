import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { TestSpecification } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  Table,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Printer,
  Search,
  Filter,
  Save,
  X,
  Loader2,
  FileSpreadsheet,
  CheckCircle2,
  Layers,
  HelpCircle,
  BarChart3,
  Calendar,
  BookOpen
} from "lucide-react";

export const KisiKisiSoalView: React.FC = () => {
  const {
    testSpecs,
    saveTestSpec,
    deleteTestSpec,
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

  const filteredTestSpecs = (testSpecs || []).filter((spec) => {
    const matchSub = filterSubjectId === "all" || spec.subjectId === filterSubjectId;
    const matchCls = filterClassId === "all" || !spec.classId || spec.classId === filterClassId;
    return matchSub && matchCls;
  });

  const [selectedSpecId, setSelectedSpecId] = useState<string>(filteredTestSpecs[0]?.id || testSpecs[0]?.id || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (filteredTestSpecs.length > 0 && !filteredTestSpecs.some((s) => s.id === selectedSpecId)) {
      setSelectedSpecId(filteredTestSpecs[0].id);
    }
  }, [filterSubjectId, filterClassId, testSpecs]);

  // Active spec
  const currentSpec = filteredTestSpecs.find((s) => s.id === selectedSpecId) || filteredTestSpecs[0] || testSpecs.find((s) => s.id === selectedSpecId) || testSpecs[0];

  // AI Generator Form
  const [aiSubjectId, setAiSubjectId] = useState(activeSubjectId || subjects[0]?.id || "sbj-inf");
  const [aiClassId, setAiClassId] = useState(activeClassId || classes[0]?.id || "cls-10a");
  const [aiTopic, setAiTopic] = useState("");
  const [aiTestType, setAiTestType] = useState<TestSpecification["testType"]>("Asesmen Sumatif Lingkup Materi");
  const [aiTotalQuestions, setAiTotalQuestions] = useState(5);
  const [aiHotsPercentage, setAiHotsPercentage] = useState("40%");

  // Manual Editor State
  const [formData, setFormData] = useState<TestSpecification>({
    id: "",
    title: "",
    subjectId: subjects[0]?.id || "sbj-inf",
    classId: classes[0]?.id || "cls-10a",
    phase: "Fase E",
    academicYear: schoolProfile?.academicYear || "2024/2025",
    semester: "1",
    testType: "Asesmen Sumatif Lingkup Materi",
    totalQuestions: 5,
    items: [],
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setFormData({
      id: "spec-" + Date.now(),
      title: "Kisi-Kisi Asesmen Sumatif Baru",
      subjectId: subjects[0]?.id || "sbj-inf",
      classId: classes[0]?.id || "cls-10a",
      phase: "Fase E",
      academicYear: schoolProfile?.academicYear || "2024/2025",
      semester: "1",
      testType: "Asesmen Sumatif Lingkup Materi",
      totalQuestions: 5,
      items: [
        {
          number: 1,
          tp: "Menganalisis konsep dasar materi",
          topic: "Topik Pembelajaran 1",
          indicator: "Disajikan studi kasus, peserta didik mampu menentukan solusi yang tepat.",
          cognitiveLevel: "C4 (Menganalisis)",
          questionType: "Pilihan Ganda",
          scoreWeight: 20,
        },
        {
          number: 2,
          tp: "Menerapkan prinsip ilmiah dalam masalah nyata",
          topic: "Topik Pembelajaran 2",
          indicator: "Disajikan ilustrasi, peserta didik mampu menghitung hasil akhir.",
          cognitiveLevel: "C3 (Menerapkan)",
          questionType: "Pilihan Ganda",
          scoreWeight: 20,
        },
      ],
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (spec: TestSpecification) => {
    setFormData({ ...spec });
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      addToast("warning", "Judul Wajib Diisi", "Tuliskan judul kisi-kisi asesmen.");
      return;
    }
    saveTestSpec(formData);
    setSelectedSpecId(formData.id);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumen Kisi-Kisi ini?")) {
      deleteTestSpec(id);
      addToast("info", "Kisi-Kisi Dihapus", "Dokumen kisi-kisi berhasil dihapus.");
      if (selectedSpecId === id) {
        const remaining = testSpecs.filter((s) => s.id !== id);
        setSelectedSpecId(remaining[0]?.id || "");
      }
    }
  };

  const handleAddItemRow = () => {
    const nextNum = (formData.items?.length || 0) + 1;
    setFormData({
      ...formData,
      items: [
        ...(formData.items || []),
        {
          number: nextNum,
          tp: "Tujuan Pembelajaran butir ke-" + nextNum,
          topic: "Materi Pokok",
          indicator: "Disajikan konteks, siswa dapat mengidentifikasi...",
          cognitiveLevel: "C4 (HOTS)",
          questionType: "Pilihan Ganda",
          scoreWeight: 20,
        },
      ],
      totalQuestions: nextNum,
    });
  };

  const handleRemoveItemRow = (idx: number) => {
    const updated = (formData.items || []).filter((_, i) => i !== idx).map((item, i) => ({
      ...item,
      number: i + 1,
    }));
    setFormData({
      ...formData,
      items: updated,
      totalQuestions: updated.length,
    });
  };

  const handleItemChange = (idx: number, field: string, value: any) => {
    const updated = [...(formData.items || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, items: updated });
  };

  // AI Generator Matrix
  const handleAiGenerateMatrix = async () => {
    if (!aiTopic.trim()) {
      addToast("warning", "Topik Materi Wajib", "Tuliskan materi pokok untuk kisi-kisi.");
      return;
    }

    setIsAiLoading(true);
    const subObj = subjects.find((s) => s.id === aiSubjectId);
    const clsObj = classes.find((c) => c.id === aiClassId);

    const prompt = `Anda adalah Tim Pengembang Kurikulum dan Asesmen Standar Nasional Indonesia.
Tolong susun MATRIKS KISI-KISI ASESMEN KURIKULUM MERDEKA LENGKAP dengan rincian:
- Mata Pelajaran: ${subObj?.name || "Informatika"} (${clsObj?.phase || "Fase E"}, ${clsObj?.name || "Kelas X"})
- Topik / Lingkup Materi: ${aiTopic}
- Jenis Tes: ${aiTestType}
- Jumlah Butir Soal: ${aiTotalQuestions} butir
- Proporsi HOTS: ${aiHotsPercentage}

HASILKAN RESPONS DALAM FORMAT JSON BERIKUT (tanpa pembungkus markdown lain):
{
  "title": "Kisi-Kisi ${aiTestType}: ${aiTopic}",
  "phase": "${clsObj?.phase || "Fase E"}",
  "semester": "1",
  "items": [
    {
      "number": 1,
      "tp": "Rumusan Tujuan Pembelajaran spesifik",
      "topic": "Sub Topik / Pokok Bahasan",
      "indicator": "Rumusan Indikator Soal berstruktur ABCD (Audience, Behavior, Condition, Degree)",
      "cognitiveLevel": "C4 (Menganalisis)",
      "questionType": "Pilihan Ganda",
      "scoreWeight": 20
    }
  ]
}`;

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction: "Anda adalah pakar pembuat kisi-kisi asesmen resmi Kurikulum Merdeka. Buat indikator operasional yang terukur.",
          jsonMode: true,
          temperature: 0.6,
        }),
      });

      const data = await res.json();
      let generatedData = data.data;

      if (!generatedData && data.text) {
        generatedData = JSON.parse(data.text.replace(/```json|```/g, "").trim());
      }

      if (generatedData && Array.isArray(generatedData.items)) {
        const newSpec: TestSpecification = {
          id: "spec-" + Date.now(),
          title: generatedData.title || `Kisi-Kisi Asesmen: ${aiTopic}`,
          subjectId: aiSubjectId,
          classId: aiClassId,
          phase: generatedData.phase || clsObj?.phase || "Fase E",
          academicYear: schoolProfile?.academicYear || "2024/2025",
          semester: generatedData.semester || "1",
          testType: aiTestType,
          totalQuestions: generatedData.items.length,
          items: generatedData.items,
          createdAt: new Date().toISOString(),
        };

        saveTestSpec(newSpec);
        setSelectedSpecId(newSpec.id);
        setIsAiModalOpen(false);
        addToast("success", "Kisi-Kisi AI Berhasil Disusun", `${newSpec.title} (${newSpec.items.length} butir)`);
      }
    } catch (err: any) {
      console.error(err);
      addToast("error", "Gagal Generate AI", "Terjadi kesalahan saat menyusun kisi-kisi.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handlePrint = (spec: TestSpecification) => {
    const subObj = subjects.find((s) => s.id === spec.subjectId);
    const clsObj = classes.find((c) => c.id === spec.classId);

    const content = `
      <div style="font-family: 'Times New Roman', serif; color: #000; line-height: 1.4; font-size: 11pt;">
        <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 14pt; text-transform: uppercase; font-weight: bold;">${schoolProfile?.name || "SMA NEGERI 1 NUSANTARA"}</h2>
          <p style="margin: 3px 0; font-size: 9.5pt;">${schoolProfile?.address || "Jl. Pendidikan Nasional"}</p>
          <h3 style="margin: 8px 0 0 0; font-size: 12pt; text-transform: uppercase; text-decoration: underline;">KISI-KISI PENYUSUNAN SOAL ASESMEN</h3>
          <p style="margin: 3px 0 0 0; font-size: 10pt; font-weight: bold;">${spec.title}</p>
        </div>

        <table style="width: 100%; margin-bottom: 14px; font-size: 10pt;">
          <tr>
            <td style="width: 20%; font-weight: bold;">Satuan Pendidikan</td>
            <td style="width: 30%;">: ${schoolProfile?.name || "SMA Negeri 1 Nusantara"}</td>
            <td style="width: 20%; font-weight: bold;">Bentuk Asesmen</td>
            <td style="width: 30%;">: ${spec.testType}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Mata Pelajaran</td>
            <td>: ${subObj?.name || "Informatika"}</td>
            <td style="font-weight: bold;">Jumlah Soal</td>
            <td>: ${spec.items?.length || 0} Butir</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Kelas / Fase / Sem.</td>
            <td>: ${clsObj?.name || "Kelas X"} / ${spec.phase} / Semester ${spec.semester}</td>
            <td style="font-weight: bold;">Tahun Ajaran</td>
            <td>: ${spec.academicYear}</td>
          </tr>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 9.5pt;" border="1" cellpadding="6">
          <thead>
            <tr style="background: #e9ecef; text-align: center; font-weight: bold;">
              <th style="width: 5%;">No</th>
              <th style="width: 25%;">Tujuan Pembelajaran (TP)</th>
              <th style="width: 18%;">Materi Pokok</th>
              <th style="width: 30%;">Indikator Soal</th>
              <th style="width: 8%;">Level</th>
              <th style="width: 8%;">Bentuk</th>
              <th style="width: 6%;">Bobot</th>
            </tr>
          </thead>
          <tbody>
            ${(spec.items || [])
              .map(
                (item) => `
                <tr>
                  <td style="text-align: center; vertical-align: top; font-weight: bold;">${item.number}</td>
                  <td style="vertical-align: top;">${item.tp}</td>
                  <td style="vertical-align: top;">${item.topic}</td>
                  <td style="vertical-align: top;">${item.indicator}</td>
                  <td style="text-align: center; vertical-align: top;">${item.cognitiveLevel}</td>
                  <td style="text-align: center; vertical-align: top;">${item.questionType}</td>
                  <td style="text-align: center; vertical-align: top;">${item.scoreWeight}%</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <div style="margin-top: 36px; display: flex; justify-content: space-between; page-break-inside: avoid;">
          <div style="text-align: center; width: 220px;">
            <p style="margin-bottom: 60px;">Mengetahui,<br/>Kepala Sekolah</p>
            <strong>${schoolProfile?.headmasterName || "Drs. H. Bambang Suryanto, M.Pd."}</strong>
            <p style="margin: 0; font-size: 9pt;">NIP. ${schoolProfile?.headmasterNip || "-"}</p>
          </div>
          <div style="text-align: center; width: 220px;">
            <p style="margin-bottom: 60px;">${schoolProfile?.district || "Jakarta"}, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br/>Guru Mata Pelajaran</p>
            <strong>${teacherProfile?.fullName || "Sudirman Danasaputra, S.Kom."}</strong>
            <p style="margin: 0; font-size: 9pt;">NIP. ${teacherProfile?.nip || "-"}</p>
          </div>
        </div>
      </div>
    `;

    setPreviewDoc({
      title: `Kisi-Kisi - ${spec.title}`,
      htmlContent: content,
      type: "KISI_KISI_SOAL",
    });
  };

  return (
    <div className="space-y-6 pb-12" id="kisi-kisi-soal-view">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-blue-100 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5" /> Matriks Asesmen
            </span>
            <span className="px-2.5 py-0.5 bg-blue-500/40 rounded-full text-xs font-medium text-blue-200">
              Kurikulum Merdeka Standard
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kisi-Kisi Naskah Soal</h1>
          <p className="text-blue-100 text-sm mt-1 max-w-2xl">
            Susun matriks spesifikasi soal asesmen dengan taksonomi Bloom (L1-L3/HOTS), distribusi indikator soal, dan proporsi bentuk tes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            AI Generator Kisi-Kisi
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 text-blue-700" />
            Tambah Kisi-Kisi
          </button>
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
            Menampilkan <b>{filteredTestSpecs.length}</b> Kisi-Kisi Soal
          </span>
        }
      />

      {/* Selector & Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" /> Pilih Dokumen:
          </div>
          <select
            value={selectedSpecId}
            onChange={(e) => setSelectedSpecId(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 min-w-[280px]"
          >
            {filteredTestSpecs.length === 0 ? (
              <option value="">Tidak ada kisi-kisi untuk filter ini</option>
            ) : (
              filteredTestSpecs.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.title} ({spec.items?.length || 0} Soal)
                </option>
              ))
            )}
          </select>
        </div>

        {currentSpec && (
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => handleOpenEdit(currentSpec)}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Matriks
            </button>
            <button
              onClick={() => handlePrint(currentSpec)}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak / Ekspor PDF
            </button>
            <button
              onClick={() => handleDelete(currentSpec.id)}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
        )}
      </div>

      {/* Main Spec Detail View */}
      {currentSpec ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          {/* Metadata Bar */}
          <div className="p-6 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{currentSpec.title}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Mata Pelajaran:</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {subjects.find((s) => s.id === currentSpec.subjectId)?.name || "Informatika"}
                </strong>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Kelas & Fase:</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  {classes.find((c) => c.id === currentSpec.classId)?.name || "Kelas X"} ({currentSpec.phase})
                </strong>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Jenis Asesmen:</span>
                <strong className="text-blue-600 dark:text-blue-400">{currentSpec.testType}</strong>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-0.5">Semester & TP:</span>
                <strong className="text-slate-800 dark:text-slate-200">
                  Semester {currentSpec.semester} • {currentSpec.academicYear}
                </strong>
              </div>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 text-center w-12">No</th>
                  <th className="p-3.5 w-1/4">Tujuan Pembelajaran (TP)</th>
                  <th className="p-3.5 w-1/5">Materi Pokok</th>
                  <th className="p-3.5 w-1/3">Indikator Soal</th>
                  <th className="p-3.5 text-center">Level</th>
                  <th className="p-3.5 text-center">Bentuk</th>
                  <th className="p-3.5 text-center">Bobot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {(currentSpec.items || []).map((item, idx) => {
                  const isHots = item.cognitiveLevel.includes("C4") || item.cognitiveLevel.includes("C5") || item.cognitiveLevel.includes("C6");

                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                        {item.number}
                      </td>
                      <td className="p-3.5 font-medium text-slate-900 dark:text-slate-100">{item.tp}</td>
                      <td className="p-3.5 text-slate-700 dark:text-slate-300">{item.topic}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400 leading-relaxed">{item.indicator}</td>
                      <td className="p-3.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            isHots
                              ? "bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300"
                              : "bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {item.cognitiveLevel}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-700 dark:text-slate-300">
                          {item.questionType}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-emerald-700 dark:text-emerald-400">
                        {item.scoreWeight}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 stroke-1" />
          <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">Belum ada kisi-kisi soal</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Klik tombol <strong>AI Generator Kisi-Kisi</strong> untuk menyusun matriks secara otomatis atau buat secara manual.
          </p>
        </div>
      )}

      {/* Manual Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">
                {formData.id ? "Edit Dokumen Kisi-Kisi Soal" : "Tambah Kisi-Kisi Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Kisi-Kisi:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran:
                  </label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas & Fase:
                  </label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phase})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bentuk Asesmen:
                  </label>
                  <select
                    value={formData.testType}
                    onChange={(e) => setFormData({ ...formData, testType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="Asesmen Sumatif Lingkup Materi">Asesmen Sumatif Lingkup Materi</option>
                    <option value="Sumatif Tengah Semester">Sumatif Tengah Semester (STS)</option>
                    <option value="Sumatif Akhir Semester">Sumatif Akhir Semester (SAS)</option>
                    <option value="Ulangan Harian">Ulangan Harian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Semester:
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                  </select>
                </div>
              </div>

              {/* Items List Builder */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Rincian Butir Matriks Kisi-Kisi ({formData.items?.length || 0} Soal)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Baris Butir
                  </button>
                </div>

                <div className="space-y-3">
                  {(formData.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        className="absolute right-3 top-3 text-rose-500 hover:text-rose-700 p-1"
                        title="Hapus baris"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-1">
                          <label className="block text-[11px] font-medium text-slate-500">No</label>
                          <input
                            type="number"
                            value={item.number}
                            onChange={(e) => handleItemChange(idx, "number", parseInt(e.target.value) || 1)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-center font-bold"
                          />
                        </div>

                        <div className="md:col-span-6">
                          <label className="block text-[11px] font-medium text-slate-500">Tujuan Pembelajaran (TP)</label>
                          <input
                            type="text"
                            value={item.tp}
                            onChange={(e) => handleItemChange(idx, "tp", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                          />
                        </div>

                        <div className="md:col-span-5">
                          <label className="block text-[11px] font-medium text-slate-500">Materi Pokok</label>
                          <input
                            type="text"
                            value={item.topic}
                            onChange={(e) => handleItemChange(idx, "topic", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                          />
                        </div>

                        <div className="md:col-span-6">
                          <label className="block text-[11px] font-medium text-slate-500">Indikator Soal</label>
                          <textarea
                            rows={2}
                            value={item.indicator}
                            onChange={(e) => handleItemChange(idx, "indicator", e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-500">Level Kognitif</label>
                          <select
                            value={item.cognitiveLevel}
                            onChange={(e) => handleItemChange(idx, "cognitiveLevel", e.target.value)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                          >
                            <option value="C1 (Mengingat)">C1</option>
                            <option value="C2 (Memahami)">C2</option>
                            <option value="C3 (Menerapkan)">C3</option>
                            <option value="C4 (Menganalisis)">C4 (HOTS)</option>
                            <option value="C5 (Mengevaluasi)">C5 (HOTS)</option>
                            <option value="C6 (Mencipta)">C6 (HOTS)</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-500">Bentuk Soal</label>
                          <select
                            value={item.questionType}
                            onChange={(e) => handleItemChange(idx, "questionType", e.target.value)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs"
                          >
                            <option value="Pilihan Ganda">Pilihan Ganda</option>
                            <option value="PG Kompleks">PG Kompleks</option>
                            <option value="Menjodohkan">Menjodohkan</option>
                            <option value="Isian Singkat">Isian Singkat</option>
                            <option value="Uraian / Esai">Uraian / Esai</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-[11px] font-medium text-slate-500">Bobot (%)</label>
                          <input
                            type="number"
                            value={item.scoreWeight}
                            onChange={(e) => handleItemChange(idx, "scoreWeight", parseInt(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-center"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Simpan Dokumen Kisi-Kisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">AI Generator Matriks Kisi-Kisi</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mata Pelajaran:
                </label>
                <select
                  value={aiSubjectId}
                  onChange={(e) => setAiSubjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kelas Sasaran:
                </label>
                <select
                  value={aiClassId}
                  onChange={(e) => setAiClassId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phase})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topik / Lingkup Materi:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Struktur Data Linier (Stack & Queue), Algoritma Pencarian"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Butir Soal:
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={aiTotalQuestions}
                    onChange={(e) => setAiTotalQuestions(parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Proporsi HOTS:
                  </label>
                  <select
                    value={aiHotsPercentage}
                    onChange={(e) => setAiHotsPercentage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="30%">30% HOTS (Level 3)</option>
                    <option value="40%">40% HOTS (Level 3)</option>
                    <option value="50%">50% HOTS (Level 3)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isAiLoading}
                  onClick={handleAiGenerateMatrix}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Menyusun Matriks AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" /> Susun Kisi-Kisi Sekarang
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
