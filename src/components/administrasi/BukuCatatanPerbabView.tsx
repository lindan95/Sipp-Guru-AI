import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { ChapterNote, ChapterNoteStudentEntry } from "../../types";
import { ContextFilterBanner } from "../common/ContextFilterBanner";
import {
  BookMarked,
  Plus,
  Edit,
  Trash2,
  Printer,
  FileSpreadsheet,
  Sparkles,
  Save,
  CheckCircle2,
  Search,
  Filter,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  X,
  GraduationCap,
  MessageSquare,
  Award,
  BookOpen,
} from "lucide-react";

export const BukuCatatanPerbabView: React.FC = () => {
  const {
    chapterNotes,
    saveChapterNote,
    deleteChapterNote,
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
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");
  const [searchStudent, setSearchStudent] = useState<string>("");
  const [progressFilter, setProgressFilter] = useState<string>("ALL");

  // Modal States
  const [isChapterModalOpen, setIsChapterModalOpen] = useState<boolean>(false);
  const [editingChapter, setEditingChapter] = useState<Partial<ChapterNote> | null>(null);

  // Quick Inline edits state
  const [activeEntries, setActiveEntries] = useState<{ [studentId: string]: ChapterNoteStudentEntry }>({});

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

  // Filtered notes by Class and Subject
  const filteredNotes = useMemo(() => {
    return chapterNotes.filter(
      (n) =>
        (selectedClassId === "all" || n.classId === selectedClassId) &&
        (selectedSubjectId === "all" || n.subjectId === selectedSubjectId)
    );
  }, [chapterNotes, selectedClassId, selectedSubjectId]);

  // Set active chapter
  useEffect(() => {
    if (filteredNotes.length > 0) {
      if (!selectedChapterId || !filteredNotes.some((n) => n.id === selectedChapterId)) {
        setSelectedChapterId(filteredNotes[0].id);
      }
    } else {
      setSelectedChapterId("");
    }
  }, [filteredNotes, selectedChapterId]);

  const currentChapter = useMemo(() => {
    return filteredNotes.find((n) => n.id === selectedChapterId) || null;
  }, [filteredNotes, selectedChapterId]);

  // Sync active entries whenever currentChapter or classStudents changes
  useEffect(() => {
    if (!currentChapter) {
      setActiveEntries({});
      return;
    }

    const map: { [studentId: string]: ChapterNoteStudentEntry } = {};
    classStudents.forEach((std) => {
      const existing = currentChapter.entries?.find((e) => e.studentId === std.id);
      map[std.id] = {
        studentId: std.id,
        learningProgress: existing?.learningProgress || "Berkembang Sesuai Harapan",
        attitudeObservation: existing?.attitudeObservation || "Menunjukkan keaktifan yang baik dalam KBM.",
        notes: existing?.notes || "Tuntas menguasai konsep bab.",
        masteryScore: existing?.masteryScore !== undefined ? existing.masteryScore : 80,
      };
    });
    setActiveEntries(map);
  }, [currentChapter, classStudents]);

  const handleEntryChange = (
    studentId: string,
    field: keyof ChapterNoteStudentEntry,
    value: any
  ) => {
    setActiveEntries((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSaveCurrentChapterEntries = () => {
    if (!currentChapter) return;

    const updatedEntries: ChapterNoteStudentEntry[] = classStudents.map((std) => {
      return (
        activeEntries[std.id] || {
          studentId: std.id,
          learningProgress: "Berkembang Sesuai Harapan",
          attitudeObservation: "",
          notes: "",
          masteryScore: 80,
        }
      );
    });

    const updated: ChapterNote = {
      ...currentChapter,
      entries: updatedEntries,
      updatedAt: new Date().toISOString(),
    };

    saveChapterNote(updated);
    addToast("success", "Tersimpan", "Catatan perkembangan bab berhasil disimpan.");
  };

  const handleOpenCreateChapter = () => {
    const nextNum = filteredNotes.length + 1;
    setEditingChapter({
      id: `chn-${Date.now()}`,
      classId: selectedClassId === "all" ? classes[0]?.id || "cls-10a" : selectedClassId,
      subjectId: selectedSubjectId === "all" ? subjects[0]?.id || "sbj-inf" : selectedSubjectId,
      semester: selectedSemester,
      academicYear: "2024/2025",
      chapterNumber: nextNum,
      chapterTitle: `Bab ${nextNum}: Materi Baru Pembelajaran`,
      mainTopic: "",
      tpList: [
        `TP ${nextNum}.1 Memahami konsep dasar bab ${nextNum}`,
        `TP ${nextNum}.2 Mengaplikasikan konsep dalam latihan dan tugas terstruktur`,
      ],
      teacherReflection: "Pembelajaran berlangsung interaktif dengan penguatan konsep mendalam.",
      entries: [],
      createdAt: new Date().toISOString(),
    });
    setIsChapterModalOpen(true);
  };

  const handleOpenEditChapter = () => {
    if (!currentChapter) return;
    setEditingChapter({ ...currentChapter });
    setIsChapterModalOpen(true);
  };

  const handleSaveChapterModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChapter || !editingChapter.chapterTitle) return;

    // populate initial student entries if empty
    const initialEntries =
      editingChapter.entries && editingChapter.entries.length > 0
        ? editingChapter.entries
        : classStudents.map((std) => ({
            studentId: std.id,
            learningProgress: "Berkembang Sesuai Harapan" as const,
            attitudeObservation: "Mengikuti proses pembelajaran dengan tertib.",
            notes: "Tuntas dalam pemahaman materi.",
            masteryScore: 80,
          }));

    const chapterToSave: ChapterNote = {
      id: editingChapter.id || `chn-${Date.now()}`,
      classId: editingChapter.classId || selectedClassId,
      subjectId: editingChapter.subjectId || selectedSubjectId,
      semester: (editingChapter.semester as any) || selectedSemester,
      academicYear: editingChapter.academicYear || "2024/2025",
      chapterNumber: Number(editingChapter.chapterNumber) || 1,
      chapterTitle: editingChapter.chapterTitle,
      mainTopic: editingChapter.mainTopic || "",
      tpList: editingChapter.tpList || [],
      teacherReflection: editingChapter.teacherReflection || "",
      entries: initialEntries,
      createdAt: editingChapter.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveChapterNote(chapterToSave);
    setSelectedChapterId(chapterToSave.id);
    setIsChapterModalOpen(false);
    setEditingChapter(null);
  };

  const handleDeleteCurrentChapter = () => {
    if (!currentChapter) return;
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus catatan "${currentChapter.chapterTitle}"?`
      )
    ) {
      deleteChapterNote(currentChapter.id);
    }
  };

  const handlePrint = () => {
    if (!currentChapter) {
      addToast("warning", "Pilih Bab", "Silakan pilih bab catatan terlebih dahulu.");
      return;
    }

    const currentClass = classes.find((c) => c.id === currentChapter.classId);
    const currentSubject = subjects.find((s) => s.id === currentChapter.subjectId);

    setPreviewDoc({
      title: `Buku Catatan Perkembangan Siswa per Bab - ${currentChapter.chapterTitle}`,
      docType: "BUKU_CATATAN_BAB_DOCUMENT",
      dataObj: {
        chapter: currentChapter,
        classInfo: currentClass,
        subject: currentSubject,
        students: classStudents,
        activeEntries,
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  const handleExportCSV = () => {
    if (!currentChapter) return;
    const currentClass = classes.find((c) => c.id === currentChapter.classId);
    const currentSubject = subjects.find((s) => s.id === currentChapter.subjectId);

    let csvContent = `BUKU CATATAN PEMBELAJARAN & PERKEMBANGAN SISWA PER BAB\n`;
    csvContent += `Mata Pelajaran: ${currentSubject?.name || "-"}\n`;
    csvContent += `Kelas: ${currentClass?.name || "-"}\n`;
    csvContent += `Bab: ${currentChapter.chapterTitle}\n`;
    csvContent += `Topik Utama: ${currentChapter.mainTopic}\n\n`;
    csvContent += `No,NIS,Nama Lengkap,Progres Belajar,Skor Penguasaan,Observasi Sikap & Keaktifan,Catatan Khusus Guru\n`;

    classStudents.forEach((std, idx) => {
      const entry = activeEntries[std.id];
      const progress = entry?.learningProgress || "-";
      const score = entry?.masteryScore || 0;
      const att = (entry?.attitudeObservation || "").replace(/"/g, '""');
      const note = (entry?.notes || "").replace(/"/g, '""');
      csvContent += `${idx + 1},${std.nis || "-"},"${std.name}","${progress}",${score},"${att}","${note}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Catatan_Bab_${currentChapter.chapterNumber}_${currentClass?.name || "Kelas"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("success", "Export CSV Berhasil", "Data catatan bab telah diunduh.");
  };

  // AI Generator helper for reflections and notes
  const handleGenerateAIReflection = () => {
    if (!currentChapter) return;
    const scores = (Object.values(activeEntries) as ChapterNoteStudentEntry[]).map((e) => e.masteryScore || 0);
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 80;
    const reflectionText = `Pada pembelajaran ${currentChapter.chapterTitle} (${currentChapter.mainTopic || "Topik Inti"}), rata-rata penguasaan kompetensi kelas mencapai ${avg}/100. Sebagian besar peserta didik mampu menyelesaikan tugas terstruktur dengan baik. Diferensiasi proses diterapkan melalui pendampingan intensif bagi murid yang memerlukan bimbingan tambahan, serta penugasan mandiri berbasis proyek untuk murid dengan pencapaian sangat berkembang.`;

    const updated = {
      ...currentChapter,
      teacherReflection: reflectionText,
    };
    saveChapterNote(updated);
    addToast("success", "AI Refleksi Dibuat", "Refleksi pembelajaran guru telah diperbarui secara otomatis.");
  };

  // Filter student rows
  const displayedStudents = classStudents.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      (std.nis && std.nis.includes(searchStudent));

    const entry = activeEntries[std.id];
    const matchesFilter =
      progressFilter === "ALL" || entry?.learningProgress === progressFilter;

    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalStudents = classStudents.length;
  const entriesArray = Object.values(activeEntries) as ChapterNoteStudentEntry[];
  const sangatBerkembangCount = entriesArray.filter(
    (e) => e.learningProgress === "Sangat Berkembang"
  ).length;
  const berkembangHarapanCount = entriesArray.filter(
    (e) => e.learningProgress === "Berkembang Sesuai Harapan"
  ).length;
  const mulaiBerkembangCount = entriesArray.filter(
    (e) => e.learningProgress === "Mulai Berkembang"
  ).length;
  const perluBimbinganCount = entriesArray.filter(
    (e) => e.learningProgress === "Perlu Bimbingan"
  ).length;

  const avgMastery =
    entriesArray.length > 0
      ? Math.round(
          entriesArray.reduce((acc, curr) => acc + (curr.masteryScore || 0), 0) /
            entriesArray.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-100 p-1.5 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              <BookMarked className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Buku Catatan Perkembangan Siswa per Bab
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Pencatatan rekam kemajuan belajar, observasi sikap, penguasaan materi, dan tindak lanjut per Bab / Lingkup Materi.
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
            Cetak Catatan Bab
          </button>
          <button
            onClick={handleOpenCreateChapter}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Bab Baru
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
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
        >
          <BookMarked className="h-3.5 w-3.5" />
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

      {/* Chapter Selector Ribbon */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Pilih Bab:</span>
            {filteredNotes.length === 0 ? (
              <span className="text-xs italic text-slate-400">
                Belum ada bab untuk kelas/mata pelajaran ini. Klik "Tambah Bab Baru".
              </span>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = note.id === selectedChapterId;
                return (
                  <button
                    key={note.id}
                    onClick={() => setSelectedChapterId(note.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-300"
                    }`}
                  >
                    <span>Bab {note.chapterNumber}</span>
                    <span className="max-w-[140px] truncate text-[11px] font-normal opacity-90">
                      - {note.chapterTitle.replace(/^Bab\s*\d+\s*:\s*/i, "")}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {currentChapter && (
            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={handleOpenEditChapter}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                title="Ubah Detail Bab & TP"
              >
                <Edit className="h-3.5 w-3.5 text-slate-500" />
                Edit Bab
              </button>
              <button
                onClick={handleDeleteCurrentChapter}
                className="flex items-center gap-1 rounded-xl border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950"
                title="Hapus Bab Ini"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Chapter Details Box */}
        {currentChapter && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                    Bab {currentChapter.chapterNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentChapter.chapterTitle}
                  </h3>
                </div>
                {currentChapter.mainTopic && (
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Topik Inti:</span> {currentChapter.mainTopic}
                  </p>
                )}
                {currentChapter.tpList && currentChapter.tpList.length > 0 && (
                  <div className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Tujuan Pembelajaran (TP):
                    </span>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                      {currentChapter.tpList.map((tp, idx) => (
                        <li key={idx}>{tp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* AI Reflection Widget */}
              <div className="w-full md:w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-850">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    Refleksi Pembelajaran Guru
                  </span>
                  <button
                    onClick={handleGenerateAIReflection}
                    className="text-[10px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    AI Generator
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3">
                  {currentChapter.teacherReflection ||
                    "Belum ada catatan refleksi guru. Klik 'AI Generator' untuk menyusun refleksi otomatis."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-500">Rata-rata Penguasaan</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-600">{avgMastery}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-emerald-600">Sangat Berkembang</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-600">{sangatBerkembangCount}</span>
            <span className="text-xs text-slate-400">/{totalStudents}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-blue-600">Sesuai Harapan</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-blue-600">{berkembangHarapanCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-amber-600">Mulai Berkembang</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-amber-600">{mulaiBerkembangCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-rose-600">Perlu Bimbingan</span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-rose-600">{perluBimbinganCount}</span>
            <span className="text-xs text-slate-400">Siswa</span>
          </div>
        </div>
      </div>

      {/* Student Notes Interactive Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Table Search & Filter Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama atau NIS siswa..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-56 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="ALL">Semua Tingkat Progres</option>
                <option value="Sangat Berkembang">Sangat Berkembang</option>
                <option value="Berkembang Sesuai Harapan">Berkembang Sesuai Harapan</option>
                <option value="Mulai Berkembang">Mulai Berkembang</option>
                <option value="Perlu Bimbingan">Perlu Bimbingan</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrentChapterEntries}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              Simpan Semua Catatan
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-center w-10">No</th>
                <th className="px-4 py-3 w-48">Nama Siswa</th>
                <th className="px-4 py-3 w-44">Tingkat Kemajuan</th>
                <th className="px-4 py-3 text-center w-24">Skor</th>
                <th className="px-4 py-3 min-w-[220px]">Observasi Sikap & Keterlibatan</th>
                <th className="px-4 py-3 min-w-[240px]">Catatan Khusus / Tindak Lanjut Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {displayedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-xs text-slate-400">
                    Tidak ada siswa yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                displayedStudents.map((std, idx) => {
                  const entry = activeEntries[std.id] || {
                    studentId: std.id,
                    learningProgress: "Berkembang Sesuai Harapan",
                    attitudeObservation: "",
                    notes: "",
                    masteryScore: 80,
                  };

                  return (
                    <tr key={std.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50">
                      <td className="px-4 py-3 text-center font-medium text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-white">{std.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">NIS: {std.nis || "-"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={entry.learningProgress}
                          onChange={(e) =>
                            handleEntryChange(std.id, "learningProgress", e.target.value)
                          }
                          className={`w-full rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none ${
                            entry.learningProgress === "Sangat Berkembang"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950 dark:text-emerald-300"
                              : entry.learningProgress === "Berkembang Sesuai Harapan"
                              ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950 dark:text-blue-300"
                              : entry.learningProgress === "Mulai Berkembang"
                              ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950 dark:text-amber-300"
                              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          <option value="Sangat Berkembang">Sangat Berkembang</option>
                          <option value="Berkembang Sesuai Harapan">Berkembang Sesuai Harapan</option>
                          <option value="Mulai Berkembang">Mulai Berkembang</option>
                          <option value="Perlu Bimbingan">Perlu Bimbingan</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={entry.masteryScore}
                          onChange={(e) =>
                            handleEntryChange(std.id, "masteryScore", Number(e.target.value) || 0)
                          }
                          className="w-16 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-center font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Observasi partisipasi, keaktifan diskusi, kemandirian..."
                          value={entry.attitudeObservation}
                          onChange={(e) =>
                            handleEntryChange(std.id, "attitudeObservation", e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Rekomendasi materi pengayaan, pendampingan khusus..."
                          value={entry.notes}
                          onChange={(e) => handleEntryChange(std.id, "notes", e.target.value)}
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

      {/* Modal Dialog: Add / Edit Chapter */}
      {isChapterModalOpen && editingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-blue-600" />
                {editingChapter.id && filteredNotes.some((n) => n.id === editingChapter.id)
                  ? "Edit Detail Bab Catatan"
                  : "Tambah Bab Catatan Baru"}
              </h3>
              <button
                onClick={() => setIsChapterModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveChapterModal} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Bab:
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editingChapter.chapterNumber || 1}
                    onChange={(e) =>
                      setEditingChapter((prev) => ({
                        ...prev,
                        chapterNumber: Number(e.target.value) || 1,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Semester:
                  </label>
                  <select
                    value={editingChapter.semester || selectedSemester}
                    onChange={(e) =>
                      setEditingChapter((prev) => ({
                        ...prev,
                        semester: e.target.value as any,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <option value="Ganjil">Semester Ganjil (1)</option>
                    <option value="Genap">Semester Genap (2)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Bab Lengkap:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Bab 1: Berpikir Komputasional"
                  value={editingChapter.chapterTitle || ""}
                  onChange={(e) =>
                    setEditingChapter((prev) => ({
                      ...prev,
                      chapterTitle: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Materi Pokok / Topik Inti:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dekomposisi, Abstraksi, Algoritma Searching & Sorting"
                  value={editingChapter.mainTopic || ""}
                  onChange={(e) =>
                    setEditingChapter((prev) => ({
                      ...prev,
                      mainTopic: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tujuan Pembelajaran (Pisahkan baris per TP):
                </label>
                <textarea
                  rows={3}
                  placeholder="TP 1.1 Memahami 4 pilar berpikir komputasional&#10;TP 1.2 Menerapkan strategi pencarian dan pengurutan"
                  value={(editingChapter.tpList || []).join("\n")}
                  onChange={(e) =>
                    setEditingChapter((prev) => ({
                      ...prev,
                      tpList: e.target.value.split("\n").filter((t) => t.trim().length > 0),
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Refleksi KBM Guru Awal:
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan refleksi pelaksanaan KBM bab ini..."
                  value={editingChapter.teacherReflection || ""}
                  onChange={(e) =>
                    setEditingChapter((prev) => ({
                      ...prev,
                      teacherReflection: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChapterModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
                >
                  Simpan Bab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
