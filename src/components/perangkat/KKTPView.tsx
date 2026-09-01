import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { KKTPItem } from "../../types";
import { createKKTPPrompt } from "../../services/aiPromptEngine";
import { Target, Plus, Edit2, Trash2, Sparkles, Save, X, Loader2, Printer, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { ContextFilterBanner } from "../common/ContextFilterBanner";

export const KKTPView: React.FC = () => {
  const {
    kktpList,
    saveKKTP,
    deleteKKTP,
    atpList,
    subjects,
    classes,
    activeSubjectId,
    setActiveSubjectId,
    activeClassId,
    setActiveClassId,
    addToast,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
  } = useApp();
  const [filterSubjectId, setFilterSubjectId] = useState<string>(activeSubjectId || "all");
  const [filterClassId, setFilterClassId] = useState<string>(activeClassId || "all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [editingKKTP, setEditingKKTP] = useState<KKTPItem | null>(null);

  const filteredKKTPList = kktpList.filter((item) => {
    const matchSub = filterSubjectId === "all" || item.subjectId === filterSubjectId;
    const matchCls = filterClassId === "all" || !item.classId || item.classId === filterClassId;
    return matchSub && matchCls;
  });

  const [formData, setFormData] = useState<KKTPItem>({
    id: "",
    subjectId: activeSubjectId || subjects[0]?.id || "sbj-inf",
    classId: activeClassId || classes[0]?.id || "cls-10a",
    phase: "Fase E",
    learningObjective: atpList[0]?.learningObjective || "1.1 Murid dapat mendeskripsikan hakikat ilmu pengetahuan, metode ilmiah, dan keselamatan kerja.",
    criteriaType: "Interval Nilai",
    indicators: [
      "Mendeskripsikan hakikat sains dan fisika dalam kehidupan sehari-hari.",
      "Menerapkan langkah-langkah metode ilmiah dalam penyelidikan.",
      "Mengidentifikasi prosedur keselamatan kerja di laboratorium."
    ],
    intervals: [
      {
        label: "Belum Berkembang (0 - 60)",
        min: 0,
        max: 60,
        description: "Belum mampu mendeskripsikan hakikat ilmu dan langkah metode ilmiah secara tepat.",
        followUp: "Belum mencapai ketuntasan, remedial di seluruh bagian dengan bimbingan intensif guru."
      },
      {
        label: "Cukup (61 - 70)",
        min: 61,
        max: 70,
        description: "Mampu mendeskripsikan konsep dasar namun masih membutuhkan bantuan dalam prosedur metode ilmiah.",
        followUp: "Belum mencapai ketuntasan, remedial pada bagian indikator yang belum tuntas."
      },
      {
        label: "Baik (71 - 87)",
        min: 71,
        max: 87,
        description: "Mampu mendeskripsikan konsep dan menerapkan metode ilmiah secara mandiri dan benar.",
        followUp: "Sudah mencapai ketuntasan, tidak perlu remedial, lanjut ke materi berikutnya."
      },
      {
        label: "Sangat Baik (88 - 100)",
        min: 88,
        max: 100,
        description: "Sangat mahir mendeskripsikan secara komprehensif, merancang prosedur penyelidikan, dan berinovasi.",
        followUp: "Sudah mencapai ketuntasan, diberikan program pengayaan atau tantangan eksplorasi lebih."
      },
    ],
    createdAt: new Date().toISOString(),
  });

  const handleOpenAdd = () => {
    setEditingKKTP(null);
    setFormData({
      id: "kktp-" + Date.now(),
      subjectId: (filterSubjectId !== "all" ? filterSubjectId : activeSubjectId) || subjects[0]?.id || "sbj-inf",
      classId: (filterClassId !== "all" ? filterClassId : activeClassId) || classes[0]?.id || "cls-10a",
      phase: "Fase E",
      learningObjective: atpList[0]?.learningObjective ? `1.${kktpList.length + 1} ${atpList[0]?.learningObjective}` : `1.${kktpList.length + 1} Murid dapat mendeskripsikan konsep pembelajaran secara terstruktur.`,
      criteriaType: "Interval Nilai",
      indicators: [
        "Mendeskripsikan konsep dan prinsip dasar secara tepat.",
        "Menerapkan prosedur pemecahan masalah dengan langkah sistematis.",
        "Menganalisis hasil penerapan konsep dalam situasi kontekstual."
      ],
      intervals: [
        {
          label: "Belum Berkembang (0 - 60)",
          min: 0,
          max: 60,
          description: "Belum mampu mendeskripsikan dan menerapkan konsep secara mandiri.",
          followUp: "Belum mencapai ketuntasan, remedial di seluruh bagian."
        },
        {
          label: "Cukup (61 - 70)",
          min: 61,
          max: 70,
          description: "Mampu mendeskripsikan konsep dasar namun masih membutuhkan bantuan penerapan.",
          followUp: "Belum mencapai ketuntasan, remedial pada indikator tertentu."
        },
        {
          label: "Baik (71 - 87)",
          min: 71,
          max: 87,
          description: "Mampu mendeskripsikan dan menerapkan konsep secara mandiri dan tepat.",
          followUp: "Sudah mencapai ketuntasan, tidak perlu remedial."
        },
        {
          label: "Sangat Baik (88 - 100)",
          min: 88,
          max: 100,
          description: "Sangat mahir menganalisis mendalam dan mampu berinovasi mandiri.",
          followUp: "Sudah mencapai ketuntasan, diberikan program pengayaan."
        },
      ],
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (k: KKTPItem) => {
    setEditingKKTP(k);
    setFormData({ ...k });
    setIsModalOpen(true);
  };

  const handleAddIndicator = () => {
    setFormData((prev) => ({
      ...prev,
      indicators: [...(prev.indicators || []), ""],
    }));
  };

  const handleUpdateIndicator = (index: number, val: string) => {
    setFormData((prev) => {
      const next = [...(prev.indicators || [])];
      next[index] = val;
      return { ...prev, indicators: next };
    });
  };

  const handleRemoveIndicator = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      indicators: prev.indicators?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleAiGenerate = async () => {
    if (!formData.learningObjective) {
      addToast("warning", "Tujuan Pembelajaran Kosong", "Tuliskan tujuan pembelajaran untuk dirumuskan KKTP-nya.");
      return;
    }

    setIsAiLoading(true);
    try {
      const { prompt, systemInstruction } = createKKTPPrompt(
        { school: schoolProfile, teacher: teacherProfile },
        formData.learningObjective
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
          setFormData((prev) => ({
            ...prev,
            indicators: parsed.indicators || prev.indicators,
            intervals: parsed.intervals || prev.intervals,
          }));
          addToast("success", "KKTP Berhasil Dirumuskan", "Indikator IKTP dan 4 interval nilai telah disesuaikan otomatis.");
        } catch {
          addToast("info", "Respons AI", data.text.slice(0, 100));
        }
      }
    } catch (e) {
      console.error(e);
      addToast("error", "AI Gagal", "Gagal merumuskan KKTP.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveKKTP(formData);
    setIsModalOpen(false);
    addToast("success", "KKTP Disimpan", "Format Kriteria Ketercapaian Tujuan Pembelajaran berhasil diperbarui.");
  };

  const handlePrint = () => {
    setPreviewDoc({
      title: "Dokumen Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)",
      docType: "KKTP_DOCUMENT",
      dataObj: {
        kktpList,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penetapan Indikator Ketercapaian Tujuan Pembelajaran (IKTP) dan Skala Interval Nilai (0-60, 61-70, 71-87, 88-100) Kurikulum Merdeka.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            Cetak KKTP / PDF
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-800 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah KKTP Baru
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
            Menampilkan <b>{filteredKKTPList.length}</b> KKTP
          </span>
        }
      />

      {/* Main KKTP Table styled matching the uploaded format */}
      <div className="rounded-2xl border border-red-200 bg-white shadow-xs overflow-hidden dark:border-red-950 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              {/* Header Baris 1: Merah Pekat Sesuai Template Resmi */}
              <tr className="bg-red-700 text-white font-bold text-center tracking-wide">
                <th
                  rowSpan={2}
                  className="border border-red-800 px-4 py-3.5 text-center font-extrabold uppercase w-1/4 min-w-[200px]"
                >
                  TUJUAN PEMBELAJARAN
                </th>
                <th
                  rowSpan={2}
                  className="border border-red-800 px-4 py-3.5 text-center font-extrabold uppercase w-1/3 min-w-[240px]"
                >
                  INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN (IKTP)
                </th>
                <th
                  colSpan={4}
                  className="border border-red-800 px-4 py-2 text-center font-extrabold uppercase"
                >
                  SKALA ATAU INTERVAL NILAI
                </th>
                <th
                  rowSpan={2}
                  className="border border-red-800 px-3 py-3.5 text-center font-extrabold uppercase w-20"
                >
                  AKSI
                </th>
              </tr>
              {/* Header Baris 2: Sub-Kolom Interval Nilai 0-60, 61-70, 71-87, 88-100 */}
              <tr className="bg-red-800 text-white font-bold text-center text-[11px]">
                <th className="border border-red-900 px-3 py-2 min-w-[130px]">
                  <div className="text-xs font-black">0 - 60</div>
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-red-100">BELUM BERKEMBANG</div>
                </th>
                <th className="border border-red-900 px-3 py-2 min-w-[130px]">
                  <div className="text-xs font-black">61 - 70</div>
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-red-100">CUKUP</div>
                </th>
                <th className="border border-red-900 px-3 py-2 min-w-[130px]">
                  <div className="text-xs font-black">71 - 87</div>
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-red-100">BAIK</div>
                </th>
                <th className="border border-red-900 px-3 py-2 min-w-[130px]">
                  <div className="text-xs font-black">88 - 100</div>
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-red-100">SANGAT BAIK</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredKKTPList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Belum ada rumusan KKTP untuk filter ini. Klik "Tambah KKTP Baru" untuk membuat Kriteria Ketercapaian Tujuan Pembelajaran.
                  </td>
                </tr>
              ) : (
                filteredKKTPList.map((item, idx) => {
                  const inv0 = item.intervals?.find((i) => i.max <= 65) || item.intervals?.[0];
                  const inv1 = item.intervals?.find((i) => i.min >= 61 && i.max <= 75) || item.intervals?.[1];
                  const inv2 = item.intervals?.find((i) => i.min >= 71 && i.max <= 87) || item.intervals?.[2];
                  const inv3 = item.intervals?.find((i) => i.min >= 86) || item.intervals?.[3];

                  return (
                    <tr
                      key={item.id || idx}
                      className="hover:bg-red-50/20 transition-colors align-top"
                    >
                      {/* 1. Tujuan Pembelajaran */}
                      <td className="border border-slate-200 dark:border-slate-800 p-3.5 font-medium leading-relaxed">
                        <div className="text-slate-900 dark:text-white font-semibold">
                          {item.learningObjective}
                        </div>
                        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {item.phase || "Fase E"}
                          </span>
                        </div>
                      </td>

                      {/* 2. Indikator Ketercapaian Tujuan Pembelajaran (IKTP) */}
                      <td className="border border-slate-200 dark:border-slate-800 p-3.5">
                        <ul className="space-y-1.5 text-[11px] leading-relaxed">
                          {(item.indicators || []).map((ind, iIdx) => (
                            <li key={iIdx} className="flex items-start gap-1.5">
                              <span className="text-red-700 dark:text-red-400 font-bold leading-none select-none">•</span>
                              <span className="text-slate-700 dark:text-slate-300">{ind}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* 3. Kolom 0 - 60 (Belum Berkembang) */}
                      <td className="border border-slate-200 dark:border-slate-800 p-3 text-[11px] leading-relaxed bg-red-50/10">
                        <p className="text-slate-700 dark:text-slate-300">
                          {inv0?.description || "Belum mampu mendeskripsikan dan menerapkan konsep secara tepat."}
                        </p>
                      </td>

                      {/* 4. Kolom 61 - 70 (Cukup) */}
                      <td className="border border-slate-200 dark:border-slate-800 p-3 text-[11px] leading-relaxed">
                        <p className="text-slate-700 dark:text-slate-300">
                          {inv1?.description || "Mampu mendeskripsikan konsep dasar namun masih membutuhkan bantuan."}
                        </p>
                      </td>

                      {/* 5. Kolom 71 - 87 (Baik) */}
                      <td className="border border-slate-200 dark:border-slate-800 p-3 text-[11px] leading-relaxed bg-emerald-50/10">
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          {inv2?.description || "Mampu mendeskripsikan dan menerapkan konsep secara mandiri dan benar."}
                        </p>
                      </td>

                      {/* 6. Kolom 88 - 100 (Sangat Baik) */}
                      <td className="border border-slate-200 dark:border-slate-800 p-3 text-[11px] leading-relaxed bg-blue-50/10">
                        <p className="text-slate-700 dark:text-slate-300 font-medium">
                          {inv3?.description || "Sangat mahir mendeskripsikan komprehensif serta mampu berinovasi mandiri."}
                        </p>
                      </td>

                      {/* 7. Kolom Aksi */}
                      <td className="border border-slate-200 dark:border-slate-800 p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit KKTP"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Hapus rumusan KKTP ini?")) deleteKKTP(item.id);
                            }}
                            title="Hapus KKTP"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card Panduan & Tindak Lanjut Interval Ketercapaian */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-red-600" />
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Pedoman Intervensi & Tindak Lanjut Hasil Penilaian KKTP
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-xl border border-red-200 bg-red-50/60 p-3 dark:border-red-950 dark:bg-red-950/30">
            <div className="font-bold text-red-900 dark:text-red-200 flex items-center justify-between">
              <span>0 - 60</span>
              <span className="text-[10px] uppercase font-extrabold bg-red-200/70 text-red-800 px-1.5 py-0.5 rounded">Belum Berkembang</span>
            </div>
            <p className="mt-1.5 text-[11px] text-red-800 dark:text-red-300 leading-relaxed">
              <strong>Tindak Lanjut:</strong> Belum mencapai ketuntasan, diberikan <em>remedial di seluruh bagian</em> dengan pendampingan intensif guru/tutor sebaya.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 dark:border-amber-950 dark:bg-amber-950/30">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>61 - 70</span>
              <span className="text-[10px] uppercase font-extrabold bg-amber-200/70 text-amber-800 px-1.5 py-0.5 rounded">Cukup</span>
            </div>
            <p className="mt-1.5 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Tindak Lanjut:</strong> Belum mencapai ketuntasan, diberikan <em>remedial pada indikator yang belum tuntas</em> melalui latihan soal terarah.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-950 dark:bg-emerald-950/30">
            <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
              <span>71 - 87</span>
              <span className="text-[10px] uppercase font-extrabold bg-emerald-200/70 text-emerald-800 px-1.5 py-0.5 rounded">Baik</span>
            </div>
            <p className="mt-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
              <strong>Tindak Lanjut:</strong> Sudah mencapai ketuntasan minimal, <em>tidak perlu remedial</em> dan dapat melanjutkan ke materi/TP berikutnya.
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3 dark:border-blue-950 dark:bg-blue-950/30">
            <div className="font-bold text-blue-900 dark:text-blue-200 flex items-center justify-between">
              <span>88 - 100</span>
              <span className="text-[10px] uppercase font-extrabold bg-blue-200/70 text-blue-800 px-1.5 py-0.5 rounded">Sangat Baik</span>
            </div>
            <p className="mt-1.5 text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
              <strong>Tindak Lanjut:</strong> Sudah mencapai ketuntasan optimal, diberikan <em>program pengayaan atau tantangan eksplorasi proyek mandiri</em>.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit KKTP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingKKTP ? "Edit Rumusan KKTP" : "Tambah Rumusan KKTP Baru"}
                </h3>
                <p className="text-xs text-slate-500">Format Standar Kurikulum Merdeka (Tujuan Pembelajaran, IKTP & 4 Skala Interval)</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tujuan Pembelajaran (TP) */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tujuan Pembelajaran (TP) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAiGenerate}
                    disabled={isAiLoading}
                    className="flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300"
                  >
                    {isAiLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-red-600" />
                    )}
                    Generate IKTP & 4 Interval AI
                  </button>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Contoh: 1.1 Murid dapat mendeskripsikan hakikat fisika..."
                  value={formData.learningObjective}
                  onChange={(e) => setFormData({ ...formData, learningObjective: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-900 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Indikator Ketercapaian Tujuan Pembelajaran (IKTP) */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-850 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>Indikator Ketercapaian Tujuan Pembelajaran (IKTP)</span>
                    <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] text-red-800 font-semibold dark:bg-red-950 dark:text-red-300">
                      Poin-poin Bullet
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddIndicator}
                    className="flex items-center gap-1 text-xs font-bold text-red-700 hover:text-red-800 dark:text-red-400"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah Indikator
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.indicators || []).map((ind, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-red-700 font-bold text-sm">•</span>
                      <input
                        type="text"
                        required
                        value={ind}
                        onChange={(e) => handleUpdateIndicator(idx, e.target.value)}
                        placeholder={`Indikator ${idx + 1}...`}
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-red-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                      />
                      {(formData.indicators?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIndicator(idx)}
                          className="rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Skala Interval Nilai */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Rincian Deskripsi Kriteria 4 Interval Nilai
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {formData.intervals.map((inv, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 bg-white dark:bg-slate-800 space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 dark:border-slate-700">
                        <span className="text-xs font-extrabold text-red-700 dark:text-red-400">
                          {idx === 0 ? "0 - 60 (Belum Berkembang)" : idx === 1 ? "61 - 70 (Cukup)" : idx === 2 ? "71 - 87 (Baik)" : "88 - 100 (Sangat Baik)"}
                        </span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Deskripsi Ketercapaian:</label>
                        <textarea
                          rows={2}
                          value={inv.description}
                          onChange={(e) => {
                            const updated = [...formData.intervals];
                            updated[idx].description = e.target.value;
                            setFormData({ ...formData, intervals: updated });
                          }}
                          placeholder="Deskripsi kemampuan siswa pada interval ini..."
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Tindak Lanjut:</label>
                        <input
                          type="text"
                          value={inv.followUp}
                          onChange={(e) => {
                            const updated = [...formData.intervals];
                            updated[idx].followUp = e.target.value;
                            setFormData({ ...formData, intervals: updated });
                          }}
                          placeholder="Tindak lanjut intervensi..."
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-red-700 px-4 py-2 text-xs font-bold text-white hover:bg-red-800"
                >
                  <Save className="h-4 w-4" />
                  Simpan KKTP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

