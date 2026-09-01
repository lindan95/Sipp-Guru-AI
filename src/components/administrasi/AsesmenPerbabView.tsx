import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { ChapterAssessment, ChapterAssessmentStudentResult } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  FileCheck,
  Plus,
  Edit,
  Trash2,
  Printer,
  FileSpreadsheet,
  Save,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Sparkles,
  X,
  Award,
  TrendingUp,
  Sliders,
  Layers,
  BookOpen,
} from "lucide-react";

export const AsesmenPerbabView: React.FC = () => {
  const {
    chapterAssessments,
    saveChapterAssessment,
    deleteChapterAssessment,
    classes,
    students,
    subjects,
    activeClassId,
    setActiveClassId,
    activeSubjectId,
    setActiveSubjectId,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
    addToast,
    setActiveMenu,
  } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>(
    activeClassId || classes[0]?.id || "cls-10a"
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    activeSubjectId || subjects[0]?.id || "sbj-inf"
  );
  const [selectedSemester, setSelectedSemester] = useState<"Ganjil" | "Genap">("Ganjil");
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [filterAction, setFilterAction] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingAssessment, setEditingAssessment] = useState<Partial<ChapterAssessment> | null>(null);

  // Active student results for selected chapter assessment
  const [activeResults, setActiveResults] = useState<{
    [studentId: string]: ChapterAssessmentStudentResult;
  }>({});

  useEffect(() => {
    if (activeClassId && activeClassId !== "all") {
      setSelectedClassId(activeClassId);
    }
  }, [activeClassId]);

  useEffect(() => {
    if (activeSubjectId && activeSubjectId !== "all") {
      setSelectedSubjectId(activeSubjectId);
    }
  }, [activeSubjectId]);

  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === selectedClassId);
  }, [students, selectedClassId]);

  // Filtered chapter assessments
  const filteredAssessments = useMemo(() => {
    return chapterAssessments.filter(
      (a) =>
        (selectedClassId === "all" || a.classId === selectedClassId) &&
        (selectedSubjectId === "all" || a.subjectId === selectedSubjectId)
    );
  }, [chapterAssessments, selectedClassId, selectedSubjectId]);

  // Set active assessment
  useEffect(() => {
    if (filteredAssessments.length > 0) {
      if (!selectedAssessmentId || !filteredAssessments.some((a) => a.id === selectedAssessmentId)) {
        setSelectedAssessmentId(filteredAssessments[0].id);
      }
    } else {
      setSelectedAssessmentId("");
    }
  }, [filteredAssessments, selectedAssessmentId]);

  const currentAssessment = useMemo(() => {
    return filteredAssessments.find((a) => a.id === selectedAssessmentId) || null;
  }, [filteredAssessments, selectedAssessmentId]);

  // Sync activeResults
  useEffect(() => {
    if (!currentAssessment) {
      setActiveResults({});
      return;
    }

    const map: { [studentId: string]: ChapterAssessmentStudentResult } = {};
    classStudents.forEach((std) => {
      const existing = currentAssessment.results?.find((r) => r.studentId === std.id);
      const formativeScore = existing?.formativeScore !== undefined ? existing.formativeScore : 82;
      const testScore = existing?.testScore !== undefined ? existing.testScore : 84;
      const practiceScore = existing?.practiceScore !== undefined ? existing.practiceScore : 85;

      const finalScore =
        existing?.finalChapterScore !== undefined
          ? existing.finalChapterScore
          : Math.round(formativeScore * 0.3 + testScore * 0.4 + practiceScore * 0.3);

      const kktp = currentAssessment.kktpThreshold || 75;
      const action =
        existing?.recommendedAction ||
        (finalScore >= 90 ? "Pengayaan" : finalScore >= kktp ? "Tuntas" : "Remedial");

      map[std.id] = {
        studentId: std.id,
        formativeScore,
        testScore,
        practiceScore,
        finalChapterScore: finalScore,
        tpAchieved: existing?.tpAchieved || "Memahami dan menguasai konsep inti dengan baik",
        tpNeedImprovement: existing?.tpNeedImprovement || "-",
        recommendedAction: action,
        descriptorNote:
          existing?.descriptorNote ||
          `Menunjukkan penguasaan sangat baik dalam capaian materi ${currentAssessment.chapterTitle}.`,
      };
    });
    setActiveResults(map);
  }, [currentAssessment, classStudents]);

  const handleResultChange = (
    studentId: string,
    field: keyof ChapterAssessmentStudentResult,
    value: any
  ) => {
    setActiveResults((prev) => {
      const current = prev[studentId] || {
        studentId,
        formativeScore: 80,
        testScore: 80,
        practiceScore: 80,
        finalChapterScore: 80,
        tpAchieved: "",
        tpNeedImprovement: "",
        recommendedAction: "Tuntas",
        descriptorNote: "",
      };

      const updated = { ...current, [field]: value };

      // Auto recalculate finalChapterScore if component scores change
      if (field === "formativeScore" || field === "testScore" || field === "practiceScore") {
        const form = field === "formativeScore" ? Number(value) || 0 : current.formativeScore || 0;
        const tst = field === "testScore" ? Number(value) || 0 : current.testScore || 0;
        const prc = field === "practiceScore" ? Number(value) || 0 : current.practiceScore || 0;

        const kktp = currentAssessment?.kktpThreshold || 75;
        const finalCalc = Math.round(form * 0.3 + tst * 0.4 + prc * 0.3);
        updated.finalChapterScore = finalCalc;
        updated.recommendedAction =
          finalCalc >= 90 ? "Pengayaan" : finalCalc >= kktp ? "Tuntas" : "Remedial";
      }

      return {
        ...prev,
        [studentId]: updated,
      };
    });
  };

  const handleSaveCurrentAssessmentResults = () => {
    if (!currentAssessment) return;

    const updatedResults: ChapterAssessmentStudentResult[] = classStudents.map((std) => {
      return (
        activeResults[std.id] || {
          studentId: std.id,
          formativeScore: 80,
          testScore: 80,
          practiceScore: 80,
          finalChapterScore: 80,
          tpAchieved: "",
          tpNeedImprovement: "",
          recommendedAction: "Tuntas",
          descriptorNote: "",
        }
      );
    });

    const updated: ChapterAssessment = {
      ...currentAssessment,
      results: updatedResults,
      updatedAt: new Date().toISOString(),
    };

    saveChapterAssessment(updated);
    addToast(
      "success",
      "Asesmen Bab Tersimpan",
      `Rekap hasil penilaian "${currentAssessment.chapterTitle}" berhasil disimpan.`
    );
  };

  const handleOpenCreateAssessment = () => {
    const nextNum = filteredAssessments.length + 1;
    setEditingAssessment({
      id: `cha-${Date.now()}`,
      classId: selectedClassId === "all" ? classes[0]?.id || "cls-10a" : selectedClassId,
      subjectId: selectedSubjectId === "all" ? subjects[0]?.id || "sbj-inf" : selectedSubjectId,
      semester: selectedSemester,
      academicYear: "2024/2025",
      chapterNumber: nextNum,
      chapterTitle: `Bab ${nextNum}: Capaian Pembelajaran & Lingkup Materi ${nextNum}`,
      assessmentType: "Campuran",
      kktpThreshold: 75,
      weightFormative: 30,
      weightTest: 40,
      weightPractice: 30,
      assessmentDate: new Date().toISOString().split("T")[0],
      results: [],
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEditAssessment = () => {
    if (!currentAssessment) return;
    setEditingAssessment({ ...currentAssessment });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssessment || !editingAssessment.chapterTitle) return;

    const initialResults =
      editingAssessment.results && editingAssessment.results.length > 0
        ? editingAssessment.results
        : classStudents.map((std) => ({
            studentId: std.id,
            formativeScore: 82,
            testScore: 84,
            practiceScore: 85,
            finalChapterScore: 84,
            tpAchieved: "Menguasai capaian pembelajaran bab dengan sangat baik",
            tpNeedImprovement: "-",
            recommendedAction: "Tuntas" as const,
            descriptorNote: `Tuntas dalam memahami materi ${editingAssessment.chapterTitle}.`,
          }));

    const toSave: ChapterAssessment = {
      id: editingAssessment.id || `cha-${Date.now()}`,
      classId: editingAssessment.classId || selectedClassId,
      subjectId: editingAssessment.subjectId || selectedSubjectId,
      semester: (editingAssessment.semester as any) || selectedSemester,
      academicYear: editingAssessment.academicYear || "2024/2025",
      chapterNumber: Number(editingAssessment.chapterNumber) || 1,
      chapterTitle: editingAssessment.chapterTitle,
      assessmentType: (editingAssessment.assessmentType as any) || "Campuran",
      kktpThreshold: Number(editingAssessment.kktpThreshold) || 75,
      weightFormative: Number(editingAssessment.weightFormative) || 30,
      weightTest: Number(editingAssessment.weightTest) || 40,
      weightPractice: Number(editingAssessment.weightPractice) || 30,
      assessmentDate: editingAssessment.assessmentDate || new Date().toISOString().split("T")[0],
      results: initialResults,
      createdAt: editingAssessment.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveChapterAssessment(toSave);
    setSelectedAssessmentId(toSave.id);
    setIsModalOpen(false);
    setEditingAssessment(null);
  };

  const handleDeleteCurrentAssessment = () => {
    if (!currentAssessment) return;
    if (
      window.confirm(
        `Hapus rekap asesmen per bab "${currentAssessment.chapterTitle}" beserta seluruh nilainya?`
      )
    ) {
      deleteChapterAssessment(currentAssessment.id);
    }
  };

  // AI Descriptor generator for Kurikulum Merdeka
  const handleGenerateAIDescriptors = () => {
    if (!currentAssessment) return;
    const kktp = currentAssessment.kktpThreshold || 75;

    setActiveResults((prev) => {
      const next = { ...prev };
      classStudents.forEach((std) => {
        const item = next[std.id];
        if (item) {
          const finalScore = item.finalChapterScore || 0;
          if (finalScore >= 90) {
            item.descriptorNote = `Sangat mahir dan konsisten dalam menguasai seluruh TP ${currentAssessment.chapterTitle}, bernalar kritis tinggi serta mampu menyajikan solusi komprehensif.`;
            item.recommendedAction = "Pengayaan";
            item.tpAchieved = "Seluruh TP dikuasai optimal";
            item.tpNeedImprovement = "-";
          } else if (finalScore >= kktp) {
            item.descriptorNote = `Menunjukkan pemahaman yang baik dalam capaian materi ${currentAssessment.chapterTitle} dan tuntas menyelesaikan tugas evaluasi terstruktur.`;
            item.recommendedAction = "Tuntas";
            item.tpAchieved = "TP Inti dikuasai sesuai KKTP";
            item.tpNeedImprovement = "-";
          } else {
            item.descriptorNote = `Perlu bimbingan dan penguatan konsep dalam beberapa TP ${currentAssessment.chapterTitle} terutama saat penerapan latihan mandiri.`;
            item.recommendedAction = "Remedial";
            item.tpAchieved = "Memahami konsep dasar awal";
            item.tpNeedImprovement = "Analisis dan aplikasi soal terapan";
          }
        }
      });
      return next;
    });
    addToast(
      "success",
      "AI Deskripsi Otomatis",
      "Deskripsi capaian rapor Kurikulum Merdeka dan rekomendasi tindak lanjut telah disintesis."
    );
  };

  const handlePrint = () => {
    if (!currentAssessment) {
      addToast("warning", "Pilih Asesmen", "Silakan pilih asesmen per bab terlebih dahulu.");
      return;
    }

    const currentClass = classes.find((c) => c.id === currentAssessment.classId);
    const currentSubject = subjects.find((s) => s.id === currentAssessment.subjectId);

    setPreviewDoc({
      title: `Rekapitulasi Asesmen Sumatif Lingkup Materi / Per Bab - ${currentAssessment.chapterTitle}`,
      docType: "ASESMEN_PERBAB_DOCUMENT",
      dataObj: {
        assessment: currentAssessment,
        classInfo: currentClass,
        subject: currentSubject,
        students: classStudents,
        activeResults,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  const handleExportCSV = () => {
    if (!currentAssessment) return;
    const currentClass = classes.find((c) => c.id === currentAssessment.classId);
    const currentSubject = subjects.find((s) => s.id === currentAssessment.subjectId);

    let csv = `REKAPITULASI PENILAIAN ASESMEN SUMATIF PER BAB\n`;
    csv += `Mata Pelajaran: ${currentSubject?.name || "-"}\n`;
    csv += `Kelas: ${currentClass?.name || "-"}\n`;
    csv += `Bab / Lingkup Materi: ${currentAssessment.chapterTitle}\n`;
    csv += `KKTP Minimum: ${currentAssessment.kktpThreshold}\n`;
    csv += `Tanggal Pelaksanaan: ${currentAssessment.assessmentDate}\n\n`;
    csv += `No,NIS,Nama Siswa,Nilai Formatif (30%),Nilai Tes Tulis (40%),Nilai Praktik (30%),Nilai Akhir Bab,Status KKTP,Rekomendasi,Deskripsi Capaian Kompetensi\n`;

    classStudents.forEach((std, idx) => {
      const r = activeResults[std.id];
      const form = r?.formativeScore || 0;
      const tst = r?.testScore || 0;
      const prc = r?.practiceScore || 0;
      const finalVal = r?.finalChapterScore || 0;
      const status = finalVal >= currentAssessment.kktpThreshold ? "Tuntas" : "Belum Tuntas";
      const rec = r?.recommendedAction || "Tuntas";
      const desc = (r?.descriptorNote || "").replace(/"/g, '""');

      csv += `${idx + 1},${std.nis || "-"},"${std.name}",${form},${tst},${prc},${finalVal},"${status}","${rec}","${desc}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Asesmen_Bab_${currentAssessment.chapterNumber}_${currentClass?.name || "Kelas"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("success", "Export CSV Berhasil", "Data rekap asesmen bab berhasil diunduh.");
  };

  // Filtered rows
  const displayedStudents = classStudents.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      (std.nis && std.nis.includes(searchStudent));

    const r = activeResults[std.id];
    const matchesFilter = filterAction === "ALL" || r?.recommendedAction === filterAction;

    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalStudents = classStudents.length;
  const resultsArray = Object.values(activeResults) as ChapterAssessmentStudentResult[];
  const kktp = currentAssessment?.kktpThreshold || 75;

  const tuntasCount = resultsArray.filter((r) => (r.finalChapterScore || 0) >= kktp).length;
  const remedialCount = resultsArray.filter((r) => r.recommendedAction === "Remedial").length;
  const pengayaanCount = resultsArray.filter((r) => r.recommendedAction === "Pengayaan").length;

  const scoresOnly = resultsArray.map((r) => r.finalChapterScore || 0);
  const avgFinalScore =
    scoresOnly.length > 0
      ? Math.round(scoresOnly.reduce((a, b) => a + b, 0) / scoresOnly.length)
      : 0;
  const maxScore = scoresOnly.length > 0 ? Math.max(...scoresOnly) : 0;
  const minScore = scoresOnly.length > 0 ? Math.min(...scoresOnly) : 0;
  const tuntasPct = totalStudents > 0 ? Math.round((tuntasCount / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-indigo-100 p-1.5 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              <FileCheck className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Asesmen & Nilai Akhir per Bab
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Kompilasi nilai formatif, tes tulis sumatif bab, unjuk kerja praktik, dan perumusan deskripsi capaian rapor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-3.5 w-3.5 text-indigo-600" />
            Cetak Asesmen Bab
          </button>
          <button
            onClick={handleOpenCreateAssessment}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Asesmen Bab
          </button>
        </div>
      </div>

      {/* Penilaian Sub-navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          onClick={() => setActiveMenu("penilaian")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          <Award className="h-3.5 w-3.5" />
          Buku Nilai Terpadu
        </button>
        <button
          onClick={() => setActiveMenu("buku_catatan_bab")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Buku Catatan per Bab
        </button>
        <button
          onClick={() => setActiveMenu("penilaian_tugas")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
          Penilaian Tugas
        </button>
        <button
          onClick={() => setActiveMenu("asesmen_perbab")}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <FileCheck className="h-3.5 w-3.5" />
          Asesmen per Bab
        </button>
      </div>

      {/* Global Filter Bar */}
      <ContextFilterBanner
        selectedClassId={selectedClassId}
        onClassChange={(id) => {
          setSelectedClassId(id);
          if (id !== "all") setActiveClassId(id);
        }}
        selectedSubjectId={selectedSubjectId}
        onSubjectChange={(id) => {
          setSelectedSubjectId(id);
          if (id !== "all") setActiveSubjectId(id);
        }}
        extraControls={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-750 dark:bg-slate-850 dark:text-slate-200"
            >
              <option value="Ganjil">Semester Ganjil (1)</option>
              <option value="Genap">Semester Genap (2)</option>
            </select>
          </div>
        }
      />

      {/* Assessment Selector Ribbon */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pilih Bab:</span>
            {filteredAssessments.length === 0 ? (
              <span className="text-xs italic text-slate-400">
                Belum ada data asesmen bab. Klik "Tambah Asesmen Bab".
              </span>
            ) : (
              filteredAssessments.map((a) => {
                const isSelected = a.id === selectedAssessmentId;
                return (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAssessmentId(a.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
                    }`}
                  >
                    <span>Bab {a.chapterNumber}</span>
                    <span className="max-w-[140px] truncate text-[11px] font-normal opacity-90">
                      - {a.chapterTitle.replace(/^Bab\s*\d+\s*:\s*/i, "")}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {currentAssessment && (
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handleOpenEditAssessment}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
              >
                <Edit className="h-3.5 w-3.5 text-slate-500" />
                Edit Bobot & Info
              </button>
              <button
                onClick={handleDeleteCurrentAssessment}
                className="flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Assessment Weighting & Info Card */}
        {currentAssessment && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-900/40 dark:bg-indigo-950/20 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                  {currentAssessment.assessmentType}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Bab {currentAssessment.chapterNumber}
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                {currentAssessment.chapterTitle}
              </h4>
              <p className="text-[11px] text-slate-500">
                Tanggal Evaluasi: {currentAssessment.assessmentDate || "-"}
              </p>
            </div>

            <div className="space-y-1 border-l border-indigo-200/60 pl-3 dark:border-indigo-900/60">
              <span className="font-bold text-slate-800 dark:text-white">Bobot Komponen Nilai:</span>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
                <span>Formatif: <b>{currentAssessment.weightFormative}%</b></span>
                <span>Tes Tulis: <b>{currentAssessment.weightTest}%</b></span>
                <span>Praktik: <b>{currentAssessment.weightPractice}%</b></span>
              </div>
              <p className="text-[11px] text-slate-500">
                Formula: (F × {currentAssessment.weightFormative}% + T × {currentAssessment.weightTest}% + P × {currentAssessment.weightPractice}%)
              </p>
            </div>

            <div className="border-l border-indigo-200/60 pl-3 dark:border-indigo-900/60">
              <span className="font-bold text-slate-800 dark:text-white">Batas Ketuntasan KKTP:</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-black text-indigo-700 dark:text-indigo-400">
                  {currentAssessment.kktpThreshold}
                </span>
                <span className="text-xs text-slate-500">Nilai Minimum Kelulusan</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* KPI Stats Banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Rata-rata Nilai Bab</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-600">{avgFinalScore}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-emerald-600">Ketuntasan Klasikal</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{tuntasPct}%</span>
            <span className="text-xs text-slate-400">({tuntasCount}/{totalStudents})</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-indigo-600">Pengayaan (≥90)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-indigo-600">{pengayaanCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-rose-600">Perlu Remedial (&lt;KKTP)</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600">{remedialCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Rentang Skor</span>
          <div className="mt-1 flex items-baseline gap-1 text-sm font-bold text-slate-800 dark:text-slate-200">
            <span>Min: <b className="text-rose-600">{minScore}</b></span>
            <span> | Max: <b className="text-emerald-600">{maxScore}</b></span>
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama atau NIS siswa..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-52 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="ALL">Semua Tindak Lanjut</option>
                <option value="Pengayaan">Pengayaan</option>
                <option value="Tuntas">Tuntas</option>
                <option value="Remedial">Remedial</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGenerateAIDescriptors}
              className="flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Generate Deskripsi Rapor
            </button>
            <button
              onClick={handleSaveCurrentAssessmentResults}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Hasil Asesmen
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-3 py-3 text-center w-10">No</th>
                <th className="px-3 py-3 w-40">Nama Siswa</th>
                <th className="px-2 py-3 text-center w-20">Formatif (30%)</th>
                <th className="px-2 py-3 text-center w-20">Tes Tulis (40%)</th>
                <th className="px-2 py-3 text-center w-20">Praktik (30%)</th>
                <th className="px-3 py-3 text-center w-24">Nilai Akhir Bab</th>
                <th className="px-3 py-3 text-center w-28">Tindak Lanjut</th>
                <th className="px-4 py-3 min-w-[240px]">Deskripsi Capaian Rapor Kurikulum Merdeka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-xs text-slate-400">
                    Tidak ada siswa yang sesuai filter.
                  </td>
                </tr>
              ) : (
                displayedStudents.map((std, idx) => {
                  const r = activeResults[std.id] || {
                    studentId: std.id,
                    formativeScore: 80,
                    testScore: 80,
                    practiceScore: 80,
                    finalChapterScore: 80,
                    tpAchieved: "",
                    tpNeedImprovement: "",
                    recommendedAction: "Tuntas",
                    descriptorNote: "",
                  };

                  const isPass = (r.finalChapterScore || 0) >= kktp;

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50">
                      <td className="px-3 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                      <td className="px-3 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">NIS: {std.nis || "-"}</div>
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={r.formativeScore}
                          onChange={(e) =>
                            handleResultChange(std.id, "formativeScore", e.target.value)
                          }
                          className="w-14 rounded-lg border border-slate-200 bg-slate-50 px-1 py-1 text-center font-bold dark:border-slate-700 dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={r.testScore}
                          onChange={(e) =>
                            handleResultChange(std.id, "testScore", e.target.value)
                          }
                          className="w-14 rounded-lg border border-slate-200 bg-slate-50 px-1 py-1 text-center font-bold dark:border-slate-700 dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-2 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={r.practiceScore}
                          onChange={(e) =>
                            handleResultChange(std.id, "practiceScore", e.target.value)
                          }
                          className="w-14 rounded-lg border border-slate-200 bg-slate-50 px-1 py-1 text-center font-bold dark:border-slate-700 dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`inline-block rounded-lg px-2.5 py-1 font-mono text-xs font-black ${
                            isPass
                              ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {r.finalChapterScore}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <select
                          value={r.recommendedAction}
                          onChange={(e) =>
                            handleResultChange(std.id, "recommendedAction", e.target.value)
                          }
                          className={`w-full rounded-lg border px-2 py-1 text-xs font-bold ${
                            r.recommendedAction === "Pengayaan"
                              ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
                              : r.recommendedAction === "Tuntas"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          <option value="Pengayaan">Pengayaan</option>
                          <option value="Tuntas">Tuntas</option>
                          <option value="Remedial">Remedial</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Deskripsi capaian rapor..."
                          value={r.descriptorNote || ""}
                          onChange={(e) =>
                            handleResultChange(std.id, "descriptorNote", e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog: Add / Edit Assessment */}
      {isModalOpen && editingAssessment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-indigo-600" />
                {editingAssessment.id && filteredAssessments.some((a) => a.id === editingAssessment.id)
                  ? "Edit Info Asesmen Bab"
                  : "Buat Asesmen Bab Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Bab:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingAssessment.chapterNumber || 1}
                    onChange={(e) =>
                      setEditingAssessment((prev) => ({
                        ...prev,
                        chapterNumber: Number(e.target.value) || 1,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Asesmen:
                  </label>
                  <select
                    value={editingAssessment.assessmentType || "Campuran"}
                    onChange={(e) =>
                      setEditingAssessment((prev) => ({
                        ...prev,
                        assessmentType: e.target.value as any,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="Campuran">Campuran (Tes Tulis + Praktik)</option>
                    <option value="Tes Tulis">Tes Tulis (Ulangan Harian)</option>
                    <option value="Praktik / Kinerja">Praktik / Kinerja</option>
                    <option value="Portofolio">Portofolio / Proyek</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Bab / Lingkup Materi:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bab 1: Berpikir Komputasional dan Algoritma"
                  value={editingAssessment.chapterTitle || ""}
                  onChange={(e) =>
                    setEditingAssessment((prev) => ({
                      ...prev,
                      chapterTitle: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    KKTP Minimum Kelulusan:
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingAssessment.kktpThreshold || 75}
                    onChange={(e) =>
                      setEditingAssessment((prev) => ({
                        ...prev,
                        kktpThreshold: Number(e.target.value) || 75,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Pelaksanaan:
                  </label>
                  <input
                    type="date"
                    value={editingAssessment.assessmentDate || ""}
                    onChange={(e) =>
                      setEditingAssessment((prev) => ({
                        ...prev,
                        assessmentDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pengaturan Bobot Nilai Akhir (%):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500">Formatif (%)</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingAssessment.weightFormative || 30}
                      onChange={(e) =>
                        setEditingAssessment((prev) => ({
                          ...prev,
                          weightFormative: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-center font-bold dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Tes Tulis (%)</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingAssessment.weightTest || 40}
                      onChange={(e) =>
                        setEditingAssessment((prev) => ({
                          ...prev,
                          weightTest: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-center font-bold dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500">Praktik (%)</span>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editingAssessment.weightPractice || 30}
                      onChange={(e) =>
                        setEditingAssessment((prev) => ({
                          ...prev,
                          weightPractice: Number(e.target.value) || 0,
                        }))
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-center font-bold dark:border-slate-700 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  Simpan Asesmen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
