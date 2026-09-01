import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { TaskAssignment, TaskAssignmentStudentScore } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  ClipboardCheck,
  Plus,
  Edit,
  Trash2,
  Printer,
  FileSpreadsheet,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Sparkles,
  X,
  FileText,
  Calendar,
  Layers,
  Award,
} from "lucide-react";

export const PenilaianTugasView: React.FC = () => {
  const {
    taskAssignments,
    saveTaskAssignment,
    deleteTaskAssignment,
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
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Partial<TaskAssignment> | null>(null);

  // Active student scores in current task
  const [activeScores, setActiveScores] = useState<{ [studentId: string]: TaskAssignmentStudentScore }>({});

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

  // Filter tasks by class and subject
  const filteredTasks = useMemo(() => {
    return taskAssignments.filter(
      (t) =>
        (selectedClassId === "all" || t.classId === selectedClassId) &&
        (selectedSubjectId === "all" || t.subjectId === selectedSubjectId)
    );
  }, [taskAssignments, selectedClassId, selectedSubjectId]);

  // Set active task
  useEffect(() => {
    if (filteredTasks.length > 0) {
      if (!selectedTaskId || !filteredTasks.some((t) => t.id === selectedTaskId)) {
        setSelectedTaskId(filteredTasks[0].id);
      }
    } else {
      setSelectedTaskId("");
    }
  }, [filteredTasks, selectedTaskId]);

  const currentTask = useMemo(() => {
    return filteredTasks.find((t) => t.id === selectedTaskId) || null;
  }, [filteredTasks, selectedTaskId]);

  // Sync activeScores whenever currentTask or classStudents changes
  useEffect(() => {
    if (!currentTask) {
      setActiveScores({});
      return;
    }

    const map: { [studentId: string]: TaskAssignmentStudentScore } = {};
    classStudents.forEach((std) => {
      const existing = currentTask.scores?.find((s) => s.studentId === std.id);
      map[std.id] = {
        studentId: std.id,
        score: existing?.score !== undefined ? existing.score : 80,
        status: existing?.status || "Tepat Waktu",
        submissionDate: existing?.submissionDate || new Date().toISOString().split("T")[0],
        feedback: existing?.feedback || "Pengerjaan tugas tuntas dan terstruktur.",
      };
    });
    setActiveScores(map);
  }, [currentTask, classStudents]);

  const handleScoreChange = (studentId: string, field: keyof TaskAssignmentStudentScore, value: any) => {
    setActiveScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSaveCurrentTaskScores = () => {
    if (!currentTask) return;

    const updatedScores: TaskAssignmentStudentScore[] = classStudents.map((std) => {
      return (
        activeScores[std.id] || {
          studentId: std.id,
          score: 80,
          status: "Tepat Waktu",
          submissionDate: new Date().toISOString().split("T")[0],
          feedback: "",
        }
      );
    });

    const updated: TaskAssignment = {
      ...currentTask,
      scores: updatedScores,
      updatedAt: new Date().toISOString(),
    };

    saveTaskAssignment(updated);
    addToast("success", "Nilai Tersimpan", `Nilai tugas "${currentTask.title}" berhasil disimpan.`);
  };

  const handleOpenCreateTask = () => {
    const nextNum = filteredTasks.length + 1;
    setEditingTask({
      id: `tsk-${Date.now()}`,
      classId: selectedClassId === "all" ? classes[0]?.id || "cls-10a" : selectedClassId,
      subjectId: selectedSubjectId === "all" ? subjects[0]?.id || "sbj-inf" : selectedSubjectId,
      semester: selectedSemester,
      academicYear: "2024/2025",
      chapterNumber: 1,
      chapterTitle: "Bab 1: Berpikir Komputasional",
      taskNumber: nextNum,
      title: `Tugas ${nextNum}: Latihan Mandiri & Analisis Kasus`,
      taskType: "Individu",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      maxScore: 100,
      kktpStandard: 75,
      instructions: "Kerjakan lembar kerja terlampir dan kumpulkan sesuai tenggat waktu.",
      scores: [],
      createdAt: new Date().toISOString(),
    });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = () => {
    if (!currentTask) return;
    setEditingTask({ ...currentTask });
    setIsTaskModalOpen(true);
  };

  const handleSaveTaskModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title) return;

    const initialScores =
      editingTask.scores && editingTask.scores.length > 0
        ? editingTask.scores
        : classStudents.map((std) => ({
            studentId: std.id,
            score: 80,
            status: "Tepat Waktu" as const,
            submissionDate: new Date().toISOString().split("T")[0],
            feedback: "Tugas dikerjakan dengan baik.",
          }));

    const taskToSave: TaskAssignment = {
      id: editingTask.id || `tsk-${Date.now()}`,
      classId: editingTask.classId || selectedClassId,
      subjectId: editingTask.subjectId || selectedSubjectId,
      semester: (editingTask.semester as any) || selectedSemester,
      academicYear: editingTask.academicYear || "2024/2025",
      chapterNumber: Number(editingTask.chapterNumber) || 1,
      chapterTitle: editingTask.chapterTitle || "Bab 1",
      taskNumber: Number(editingTask.taskNumber) || 1,
      title: editingTask.title,
      taskType: (editingTask.taskType as any) || "Individu",
      dueDate: editingTask.dueDate || new Date().toISOString().split("T")[0],
      maxScore: Number(editingTask.maxScore) || 100,
      kktpStandard: Number(editingTask.kktpStandard) || 75,
      instructions: editingTask.instructions || "",
      scores: initialScores,
      createdAt: editingTask.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveTaskAssignment(taskToSave);
    setSelectedTaskId(taskToSave.id);
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteCurrentTask = () => {
    if (!currentTask) return;
    if (window.confirm(`Hapus tugas "${currentTask.title}" beserta seluruh nilainya?`)) {
      deleteTaskAssignment(currentTask.id);
    }
  };

  // Quick bulk helpers
  const handleSetAllOnTime = () => {
    const today = new Date().toISOString().split("T")[0];
    setActiveScores((prev) => {
      const next = { ...prev };
      classStudents.forEach((std) => {
        if (next[std.id]) {
          next[std.id] = {
            ...next[std.id],
            status: "Tepat Waktu",
            submissionDate: today,
          };
        }
      });
      return next;
    });
    addToast("info", "Status Diperbarui", "Semua siswa ditandai 'Tepat Waktu'.");
  };

  const handleSetDefaultScore = (score: number) => {
    setActiveScores((prev) => {
      const next = { ...prev };
      classStudents.forEach((std) => {
        if (next[std.id]) {
          next[std.id] = {
            ...next[std.id],
            score,
          };
        }
      });
      return next;
    });
    addToast("info", "Nilai Default", `Seluruh siswa diberi nilai ${score}.`);
  };

  const handleGenerateAIFeedback = () => {
    if (!currentTask) return;
    const kktp = currentTask.kktpStandard || 75;

    setActiveScores((prev) => {
      const next = { ...prev };
      classStudents.forEach((std) => {
        const item = next[std.id];
        if (item) {
          if (item.score >= 90) {
            item.feedback = "Penguasaan materi luar biasa mendalam, analisis sangat tajam dan rapi.";
          } else if (item.score >= kktp) {
            item.feedback = "Tugas tuntas memenuhi seluruh kriteria KKTP dengan baik.";
          } else {
            item.feedback = "Perlu perbaikan pada kelengkapan langkah jawaban dan penataan format.";
          }
        }
      });
      return next;
    });
    addToast("success", "AI Feedback Selesai", "Komentar evaluasi otomatis dibuat berdasarkan pencapaian skor.");
  };

  const handlePrint = () => {
    if (!currentTask) {
      addToast("warning", "Pilih Tugas", "Silakan pilih tugas terlebih dahulu.");
      return;
    }

    const currentClass = classes.find((c) => c.id === currentTask.classId);
    const currentSubject = subjects.find((s) => s.id === currentTask.subjectId);

    setPreviewDoc({
      title: `Daftar Penilaian Tugas Siswa - ${currentTask.title}`,
      docType: "PENILAIAN_TUGAS_DOCUMENT",
      dataObj: {
        task: currentTask,
        classInfo: currentClass,
        subject: currentSubject,
        students: classStudents,
        activeScores,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  const handleExportCSV = () => {
    if (!currentTask) return;
    const currentClass = classes.find((c) => c.id === currentTask.classId);
    const currentSubject = subjects.find((s) => s.id === currentTask.subjectId);

    let csv = `DAFTAR NILAI TUGAS SISWA\n`;
    csv += `Mata Pelajaran: ${currentSubject?.name || "-"}\n`;
    csv += `Kelas: ${currentClass?.name || "-"}\n`;
    csv += `Judul Tugas: ${currentTask.title}\n`;
    csv += `Bab: ${currentTask.chapterTitle}\n`;
    csv += `Tenggat Waktu: ${currentTask.dueDate}\n`;
    csv += `Standar KKTP: ${currentTask.kktpStandard}\n\n`;
    csv += `No,NIS,Nama Lengkap,Nilai Tugas (/100),Status Ketuntasan,Status Pengumpulan,Tanggal Kumpul,Umpan Balik Guru\n`;

    classStudents.forEach((std, idx) => {
      const s = activeScores[std.id];
      const score = s?.score || 0;
      const tuntas = score >= currentTask.kktpStandard ? "Tuntas" : "Belum Tuntas";
      const status = s?.status || "Belum Mengumpulkan";
      const date = s?.submissionDate || "-";
      const feedback = (s?.feedback || "").replace(/"/g, '""');
      csv += `${idx + 1},${std.nis || "-"},"${std.name}",${score},"${tuntas}","${status}","${date}","${feedback}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Nilai_Tugas_${currentTask.taskNumber}_${currentClass?.name || "Kelas"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("success", "Export CSV Berhasil", "Daftar nilai tugas telah diunduh.");
  };

  // Filtered rows
  const displayedStudents = classStudents.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      (std.nis && std.nis.includes(searchStudent));

    const s = activeScores[std.id];
    const matchesStatus = statusFilter === "ALL" || s?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Statistics
  const totalStudents = classStudents.length;
  const scoresArray = Object.values(activeScores) as TaskAssignmentStudentScore[];
  const kktp = currentTask?.kktpStandard || 75;
  const tuntasCount = scoresArray.filter((s) => (s.score || 0) >= kktp).length;
  const belumTuntasCount = scoresArray.filter((s) => (s.score || 0) < kktp).length;
  const tepatWaktuCount = scoresArray.filter((s) => s.status === "Tepat Waktu").length;
  const terlambatCount = scoresArray.filter((s) => s.status === "Terlambat").length;
  const belumKumpulCount = scoresArray.filter((s) => s.status === "Belum Mengumpulkan").length;

  const avgScore =
    scoresArray.length > 0
      ? Math.round(scoresArray.reduce((acc, curr) => acc + (curr.score || 0), 0) / scoresArray.length)
      : 0;

  const tuntasPercentage = totalStudents > 0 ? Math.round((tuntasCount / totalStudents) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-emerald-100 p-1.5 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Penilaian & Rekap Tugas Siswa
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Pengelolaan buku nilai tugas terstruktur, portofolio, PR, dan proyek per bab dengan pemantauan ketuntasan KKTP.
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
            <Printer className="h-3.5 w-3.5 text-blue-600" />
            Cetak Rekap Tugas
          </button>
          <button
            onClick={handleOpenCreateTask}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Buat Tugas Baru
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
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <ClipboardCheck className="h-3.5 w-3.5" />
          Penilaian Tugas
        </button>
        <button
          onClick={() => setActiveMenu("asesmen_perbab")}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        >
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

      {/* Task Selector Ribbon */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Daftar Tugas:</span>
            {filteredTasks.length === 0 ? (
              <span className="text-xs italic text-slate-400">
                Belum ada tugas dibuat. Klik "Buat Tugas Baru" untuk menambahkan.
              </span>
            ) : (
              filteredTasks.map((t) => {
                const isSelected = t.id === selectedTaskId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTaskId(t.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
                    }`}
                  >
                    <span>Tugas {t.taskNumber}</span>
                    <span className="max-w-[140px] truncate text-[11px] font-normal opacity-90">
                      - {t.title.replace(/^Tugas\s*\d+\s*:\s*/i, "")}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {currentTask && (
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handleOpenEditTask}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
              >
                <Edit className="h-3.5 w-3.5 text-slate-500" />
                Edit Info Tugas
              </button>
              <button
                onClick={handleDeleteCurrentTask}
                className="flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Current Task Detail Card */}
        {currentTask && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/20 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-extrabold text-white uppercase">
                  {currentTask.taskType}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {currentTask.chapterTitle}
                </span>
              </div>
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                {currentTask.title}
              </h4>
            </div>

            <div className="space-y-1 border-l border-emerald-200/60 pl-3 dark:border-emerald-900/60">
              <p className="text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-white">Tenggat Waktu:</span>{" "}
                {currentTask.dueDate || "-"}
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                <span className="font-bold text-slate-800 dark:text-white">KKTP Minimum:</span>{" "}
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {currentTask.kktpStandard}
                </span>{" "}
                / 100
              </p>
            </div>

            <div className="border-l border-emerald-200/60 pl-3 dark:border-emerald-900/60">
              <span className="font-bold text-slate-800 dark:text-white">Instruksi Tugas:</span>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                {currentTask.instructions || "Kerjakan sesuai petunjuk LKPD dan modul ajar."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* KPI Stats Banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Rata-rata Kelas</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{avgScore}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-emerald-600">Tuntas KKTP</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{tuntasCount}</span>
            <span className="text-xs text-slate-400">({tuntasPercentage}%)</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-rose-600">Belum Tuntas</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600">{belumTuntasCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-blue-600">Tepat Waktu</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-600">{tepatWaktuCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-amber-600">Belum Mengumpulkan</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600">{belumKumpulCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>
      </div>

      {/* Interactive Gradebook Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Table Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa atau NIS..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-52 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="ALL">Semua Status Kumpul</option>
                <option value="Tepat Waktu">Tepat Waktu</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Belum Mengumpulkan">Belum Mengumpulkan</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSetAllOnTime}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              ✓ Set Tepat Waktu
            </button>
            <button
              onClick={handleGenerateAIFeedback}
              className="flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Feedback
            </button>
            <button
              onClick={handleSaveCurrentTaskScores}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Nilai
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center w-10">No</th>
                <th className="px-4 py-3 w-44">Nama Lengkap Siswa</th>
                <th className="px-4 py-3 text-center w-28">Nilai (/100)</th>
                <th className="px-4 py-3 text-center w-28">Ketuntasan</th>
                <th className="px-4 py-3 w-40">Status Kumpul</th>
                <th className="px-4 py-3 w-32">Tanggal Kumpul</th>
                <th className="px-4 py-3 min-w-[220px]">Catatan / Feedback Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-400">
                    Tidak ada siswa yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                displayedStudents.map((std, idx) => {
                  const s = activeScores[std.id] || {
                    studentId: std.id,
                    score: 80,
                    status: "Tepat Waktu",
                    submissionDate: "",
                    feedback: "",
                  };
                  const isPass = (s.score || 0) >= kktp;

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50">
                      <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">NIS: {std.nis || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={s.score}
                          onChange={(e) =>
                            handleScoreChange(std.id, "score", Number(e.target.value) || 0)
                          }
                          className={`w-16 rounded-lg border px-2 py-1 text-center font-bold focus:outline-none ${
                            isPass
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                              : "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200"
                          }`}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                            isPass
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {isPass ? "✓ Tuntas" : "✗ Remedial"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={s.status}
                          onChange={(e) => handleScoreChange(std.id, "status", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        >
                          <option value="Tepat Waktu">Tepat Waktu</option>
                          <option value="Terlambat">Terlambat</option>
                          <option value="Belum Mengumpulkan">Belum Mengumpulkan</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="date"
                          value={s.submissionDate || ""}
                          onChange={(e) =>
                            handleScoreChange(std.id, "submissionDate", e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Feedback evaluasi pengerjaan siswa..."
                          value={s.feedback || ""}
                          onChange={(e) => handleScoreChange(std.id, "feedback", e.target.value)}
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

      {/* Modal Dialog: Add / Edit Task */}
      {isTaskModalOpen && editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-emerald-600" />
                {editingTask.id && filteredTasks.some((t) => t.id === editingTask.id)
                  ? "Edit Info Tugas"
                  : "Buat Tugas Pembelajaran Baru"}
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTaskModal} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Tugas:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingTask.taskNumber || 1}
                    onChange={(e) =>
                      setEditingTask((prev) => ({
                        ...prev,
                        taskNumber: Number(e.target.value) || 1,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Tugas:
                  </label>
                  <select
                    value={editingTask.taskType || "Individu"}
                    onChange={(e) =>
                      setEditingTask((prev) => ({
                        ...prev,
                        taskType: e.target.value as any,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="Individu">Individu</option>
                    <option value="Kelompok">Kelompok</option>
                    <option value="Proyek Mini">Proyek Mini</option>
                    <option value="Portofolio">Portofolio</option>
                    <option value="PR / Latihan">PR / Latihan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bab / Lingkup Materi:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bab 1: Berpikir Komputasional"
                  value={editingTask.chapterTitle || ""}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      chapterTitle: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Tugas:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tugas 1: Peta Konsep 4 Pilar Berpikir Komputasional"
                  value={editingTask.title || ""}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tenggat Waktu (Due Date):
                  </label>
                  <input
                    type="date"
                    value={editingTask.dueDate || ""}
                    onChange={(e) =>
                      setEditingTask((prev) => ({
                        ...prev,
                        dueDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Standar KKTP (Batas Lulus):
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingTask.kktpStandard || 75}
                    onChange={(e) =>
                      setEditingTask((prev) => ({
                        ...prev,
                        kktpStandard: Number(e.target.value) || 75,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Petunjuk / Instruksi Tugas:
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan petunjuk pengerjaan tugas bagi siswa..."
                  value={editingTask.instructions || ""}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
