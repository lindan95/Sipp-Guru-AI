import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { CalendarEvent } from "../../types";
import {
  CalendarDays,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Printer,
  FileText,
  Download,
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Filter,
  BarChart3,
  ListOrdered,
  Settings2,
  Info,
} from "lucide-react";

export interface MonthAnalysisDetail {
  monthIndex: number; // 0-11
  monthName: string;
  year: number;
  totalCalendarDays: number; // HK
  sundayCount: number; // HM
  saturdayCount: number; // HS (jika 5 hari)
  nationalHolidayCount: number; // HLN
  semesterHolidayCount: number; // LKS
  effectiveSchoolDays: number; // HES = HK - HM - HS - HLN - LKS
  nonKbmDays: number; // KNon (MPLS, ASTS, ASAS, Rapor)
  effectiveLearningDays: number; // HEB = HES - KNon
  effectiveWeeks: number; // MEB
  effectiveHours: number; // JP
  eventsList: CalendarEvent[];
  agendaSummary: string;
}

export const CalendarView: React.FC = () => {
  const {
    calendarEvents,
    saveCalendarEvent,
    deleteCalendarEvent,
    settings,
    schoolProfile,
    teacherProfile,
    subjects,
    setPreviewDoc,
  } = useApp();

  // Active view tab
  const [activeTab, setActiveTab] = useState<"analysis" | "calendar" | "events">("analysis");

  // Semester selection: "1" (Ganjil), "2" (Genap), or "all" (1 Tahun)
  const [selectedSemester, setSelectedSemester] = useState<"1" | "2" | "all">(
    (settings.activeSemester as "1" | "2") || "1"
  );

  // School days per week: 5 (Senin-Jumat) or 6 (Senin-Sabtu)
  const [schoolDaysType, setSchoolDaysType] = useState<5 | 6>(5);

  // Selected subject for JP calculation
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id || "sbj-inf"
  );

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const [customJpPerWeek, setCustomJpPerWeek] = useState<number>(
    selectedSubject?.hoursPerWeek || 2
  );

  // Visual Calendar Month State
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());

  // Modal Add Event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<CalendarEvent>({
    id: "",
    title: "",
    type: "school_activity",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    description: "",
    isEffectiveDay: true,
    academicYear: settings.activeAcademicYear,
    semester: (selectedSemester === "all" ? "1" : selectedSemester) as "1" | "2",
  });

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  // Base academic year splitting (e.g. "2024/2025" -> 2024 & 2025)
  const [startYear, endYear] = useMemo(() => {
    const parts = (settings.activeAcademicYear || "2024/2025").split("/");
    const y1 = parseInt(parts[0], 10) || new Date().getFullYear();
    const y2 = parseInt(parts[1], 10) || y1 + 1;
    return [y1, y2];
  }, [settings.activeAcademicYear]);

  // Determine months included in analysis
  // Semester 1 (Ganjil): Juli - Desember (Month 6 - 11 in startYear)
  // Semester 2 (Genap): Januari - Juni (Month 0 - 5 in endYear)
  const analysisMonths = useMemo(() => {
    const list: { monthIndex: number; year: number }[] = [];
    if (selectedSemester === "1" || selectedSemester === "all") {
      for (let m = 6; m <= 11; m++) {
        list.push({ monthIndex: m, year: startYear });
      }
    }
    if (selectedSemester === "2" || selectedSemester === "all") {
      for (let m = 0; m <= 5; m++) {
        list.push({ monthIndex: m, year: endYear });
      }
    }
    return list;
  }, [selectedSemester, startYear, endYear]);

  // Compute detailed effective day calculation for every month
  const semesterAnalysisData: MonthAnalysisDetail[] = useMemo(() => {
    return analysisMonths.map(({ monthIndex, year }) => {
      const daysInM = new Date(year, monthIndex + 1, 0).getDate();
      let sundays = 0;
      let saturdays = 0;
      let nationalHolidays = 0;
      let semesterHolidays = 0;
      let nonKbmCount = 0;
      const matchingEvents: CalendarEvent[] = [];

      for (let d = 1; d <= daysInM; d++) {
        const dayOfWeek = new Date(year, monthIndex, d).getDay(); // 0=Sun, 6=Sat
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        // Find events on this date
        const dayEvents = calendarEvents.filter(
          (ev) => ev.startDate <= dateStr && ev.endDate >= dateStr
        );

        dayEvents.forEach((ev) => {
          if (!matchingEvents.some((me) => me.id === ev.id)) {
            matchingEvents.push(ev);
          }
        });

        if (dayOfWeek === 0) {
          sundays++;
          continue;
        }

        if (dayOfWeek === 6 && schoolDaysType === 5) {
          saturdays++;
          continue;
        }

        // Check holiday events on weekdays
        const holidayEvent = dayEvents.find((ev) => ev.type === "holiday");
        if (holidayEvent) {
          if (
            holidayEvent.title.toLowerCase().includes("semester") ||
            holidayEvent.title.toLowerCase().includes("libur akhir")
          ) {
            semesterHolidays++;
          } else {
            nationalHolidays++;
          }
          continue;
        }

        // Check non-KBM activity days (MPLS, Ujian/Asesmen, Penyerahan Rapor)
        const isExamOrActivity = dayEvents.some(
          (ev) => ev.type === "exam" || (ev.type === "school_activity" && ev.title.toLowerCase().includes("rapor"))
        );
        if (isExamOrActivity) {
          nonKbmCount++;
        }
      }

      const totalHolidays =
        sundays + (schoolDaysType === 5 ? saturdays : 0) + nationalHolidays + semesterHolidays;
      const effectiveSchoolDays = Math.max(0, daysInM - totalHolidays);
      const effectiveLearningDays = Math.max(0, effectiveSchoolDays - nonKbmCount);
      const workDaysPerWeek = schoolDaysType === 5 ? 5 : 6;
      const effectiveWeeks = Math.round((effectiveLearningDays / workDaysPerWeek) * 10) / 10;
      const effectiveHours = Math.round(effectiveWeeks * customJpPerWeek);

      // Generate brief agenda summary
      const agendaSummary = matchingEvents.length > 0
        ? matchingEvents.map((e) => e.title).join(", ")
        : "KBM Reguler Tatap Muka";

      return {
        monthIndex,
        monthName: monthNames[monthIndex],
        year,
        totalCalendarDays: daysInM,
        sundayCount: sundays,
        saturdayCount: schoolDaysType === 5 ? saturdays : 0,
        nationalHolidayCount: nationalHolidays,
        semesterHolidayCount: semesterHolidays,
        effectiveSchoolDays,
        nonKbmDays: nonKbmCount,
        effectiveLearningDays,
        effectiveWeeks,
        effectiveHours,
        eventsList: matchingEvents,
        agendaSummary,
      };
    });
  }, [analysisMonths, calendarEvents, schoolDaysType, customJpPerWeek, monthNames]);

  // Aggregated totals for the selected semester / year
  const semesterTotals = useMemo(() => {
    return semesterAnalysisData.reduce(
      (acc, m) => {
        acc.totalCalendarDays += m.totalCalendarDays;
        acc.sundayCount += m.sundayCount;
        acc.saturdayCount += m.saturdayCount;
        acc.nationalHolidayCount += m.nationalHolidayCount;
        acc.semesterHolidayCount += m.semesterHolidayCount;
        acc.effectiveSchoolDays += m.effectiveSchoolDays;
        acc.nonKbmDays += m.nonKbmDays;
        acc.effectiveLearningDays += m.effectiveLearningDays;
        acc.effectiveWeeks += m.effectiveWeeks;
        acc.effectiveHours += m.effectiveHours;
        return acc;
      },
      {
        totalCalendarDays: 0,
        sundayCount: 0,
        saturdayCount: 0,
        nationalHolidayCount: 0,
        semesterHolidayCount: 0,
        effectiveSchoolDays: 0,
        nonKbmDays: 0,
        effectiveLearningDays: 0,
        effectiveWeeks: 0,
        effectiveHours: 0,
      }
    );
  }, [semesterAnalysisData]);

  // Rounded total weeks & lesson hours distribution
  const totalWeeksExact = Math.round(semesterTotals.effectiveWeeks * 10) / 10;
  const totalWeeksRounded = Math.floor(semesterTotals.effectiveWeeks);
  const totalLessonHours = semesterTotals.effectiveHours;

  // JP Distribution allocation (Tatap Muka, Asesmen/ASTS/ASAS, Cadangan)
  const tatapMukaHours = Math.round(totalLessonHours * 0.8);
  const asesmenHours = Math.round(totalLessonHours * 0.15);
  const cadanganHours = Math.max(0, totalLessonHours - tatapMukaHours - asesmenHours);

  // Month navigation for visual calendar
  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  // Calendar visual month calculations
  const daysInVisualMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeekVisual = new Date(calendarYear, calendarMonth, 1).getDay();

  // Export CSV
  const handleExportCSV = () => {
    const semLabel =
      selectedSemester === "1"
        ? "Semester 1 (Ganjil)"
        : selectedSemester === "2"
        ? "Semester 2 (Genap)"
        : "1 Tahun Pelajaran Penuh";
    
    let csv = `ANALISIS HARI EFEKTIF PER SEMESTER - ${schoolProfile.name}\n`;
    csv += `Tahun Pelajaran: ${settings.activeAcademicYear}\n`;
    csv += `Periode: ${semLabel}\n`;
    csv += `Mata Pelajaran: ${selectedSubject?.name || "Semua"} (${customJpPerWeek} JP/Pekan)\n`;
    csv += `Sistem Hari: ${schoolDaysType} Hari Sekolah\n\n`;
    csv += "No,Bulan,Tahun,Hari Kalender (HK),Libur Minggu (HM),Libur Sabtu (HS),Libur Nasional (HLN),Libur Semester (LKS),Hari Efektif Sekolah (HES),Kegiatan Non-KBM / Ujian,Hari Efektif Belajar (HEB),Minggu Efektif (MEB),Alokasi JP,Keterangan Kegiatan\n";

    semesterAnalysisData.forEach((m, idx) => {
      const escapedSummary = `"${m.agendaSummary.replace(/"/g, '""')}"`;
      csv += `${idx + 1},${m.monthName},${m.year},${m.totalCalendarDays},${m.sundayCount},${m.saturdayCount},${m.nationalHolidayCount},${m.semesterHolidayCount},${m.effectiveSchoolDays},${m.nonKbmDays},${m.effectiveLearningDays},${m.effectiveWeeks},${m.effectiveHours},${escapedSummary}\n`;
    });

    csv += `TOTAL,-,-,${semesterTotals.totalCalendarDays},${semesterTotals.sundayCount},${semesterTotals.saturdayCount},${semesterTotals.nationalHolidayCount},${semesterTotals.semesterHolidayCount},${semesterTotals.effectiveSchoolDays},${semesterTotals.nonKbmDays},${semesterTotals.effectiveLearningDays},${totalWeeksExact},${totalLessonHours},"Distribusi JP: Tatap Muka ${tatapMukaHours} JP | Asesmen ${asesmenHours} JP | Cadangan ${cadanganHours} JP"\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Analisis_Hari_Efektif_${semLabel.replace(/\s+/g, "_")}_${settings.activeAcademicYear.replace(/\//g, "-")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Document Export Modal for printing
  const handlePrintSemesterDocument = () => {
    const semLabel =
      selectedSemester === "1"
        ? "Semester 1 (Ganjil)"
        : selectedSemester === "2"
        ? "Semester 2 (Genap)"
        : "1 Tahun Pelajaran Penuh";

    setPreviewDoc({
      title: `Analisis Hari & Pekan Efektif (${semLabel}) - ${settings.activeAcademicYear}`,
      docType: "KALENDER_PENDIDIKAN_DOCUMENT",
      dataObj: {
        mode: "semester",
        semesterLabel: semLabel,
        selectedSemester,
        academicYear: settings.activeAcademicYear,
        schoolDaysType,
        subject: selectedSubject,
        jpPerWeek: customJpPerWeek,
        analysisData: semesterAnalysisData,
        totals: semesterTotals,
        totalWeeksExact,
        totalWeeksRounded,
        totalLessonHours,
        tatapMukaHours,
        asesmenHours,
        cadanganHours,
        events: calendarEvents.filter((ev) =>
          selectedSemester === "all" ? true : ev.semester === selectedSemester
        ),
        school: schoolProfile,
        teacher: teacherProfile,
      },
    });
  };

  // Open Modal Add Event
  const handleOpenAdd = () => {
    setFormData({
      id: "cal-" + Date.now(),
      title: "",
      type: "school_activity",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      description: "",
      isEffectiveDay: true,
      academicYear: settings.activeAcademicYear,
      semester: (selectedSemester === "all" ? "1" : selectedSemester) as "1" | "2",
    });
    setIsModalOpen(true);
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    saveCalendarEvent(formData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Kalender Pendidikan & Analisis Hari Efektif
            </h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              TA {settings.activeAcademicYear}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perhitungan sistematis Rincian Pekan Efektif (RPE), Hari Efektif Belajar (HEB), dan Distribusi Alokasi Jam Pelajaran (JP) per semester.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors shadow-xs"
            title="Download Spreadsheet Excel / CSV"
          >
            <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Ekspor Excel / CSV
          </button>

          <button
            onClick={handlePrintSemesterDocument}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors shadow-xs"
            title="Cetak format resmi Berita Acara RPE & Analisis Hari Efektif"
          >
            <Printer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Cetak Dokumen PDF
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            Tambah Agenda / Libur
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
              activeTab === "analysis"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Perhitungan Hari Efektif Per Semester
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
              activeTab === "calendar"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            Matriks Kalender Bulanan
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-colors ${
              activeTab === "events"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <ListOrdered className="h-4 w-4" />
            Daftar Agenda & Libur ({calendarEvents.length})
          </button>
        </div>

        {/* Global Controls: Semester & 5/6 Days */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs font-medium dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <button
              onClick={() => setSelectedSemester("1")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                selectedSemester === "1"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Semester 1 (Ganjil)
            </button>
            <button
              onClick={() => setSelectedSemester("2")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                selectedSemester === "2"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Semester 2 (Genap)
            </button>
            <button
              onClick={() => setSelectedSemester("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
                selectedSemester === "all"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              1 Tahun Penuh
            </button>
          </div>

          <div className="flex items-center rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 mr-2">Sistem:</span>
            <select
              value={schoolDaysType}
              onChange={(e) => setSchoolDaysType(Number(e.target.value) as 5 | 6)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value={5}>5 Hari Sekolah (Sen - Jum)</option>
              <option value={6}>6 Hari Sekolah (Sen - Sab)</option>
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: PERHITUNGAN HARI EFEKTIF PER SEMESTER */}
      {activeTab === "analysis" && (
        <div className="space-y-6">
          {/* Top KPI Cards for Selected Semester */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Total Hari Kalender (HK)
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {semesterTotals.totalCalendarDays}
                </span>
                <span className="text-[11px] text-slate-500">Hari</span>
              </div>
              <span className="mt-1 block text-[10px] text-slate-400">
                {analysisMonths.length} Bulan Analisis
              </span>
            </div>

            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-xs dark:border-rose-950 dark:bg-rose-950/20">
              <span className="block text-[11px] font-medium text-rose-700 dark:text-rose-400">
                Total Hari Libur
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-rose-700 dark:text-rose-300">
                  {semesterTotals.sundayCount +
                    semesterTotals.saturdayCount +
                    semesterTotals.nationalHolidayCount +
                    semesterTotals.semesterHolidayCount}
                </span>
                <span className="text-[11px] text-rose-600">Hari</span>
              </div>
              <span className="mt-1 block text-[10px] text-rose-500 truncate">
                Minggu, {schoolDaysType === 5 ? "Sabtu, " : ""}Libur Nas & Sem
              </span>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs dark:border-blue-950 dark:bg-blue-950/20">
              <span className="block text-[11px] font-medium text-blue-700 dark:text-blue-400">
                Hari Efektif Sekolah (HES)
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-blue-700 dark:text-blue-300">
                  {semesterTotals.effectiveSchoolDays}
                </span>
                <span className="text-[11px] text-blue-600">Hari</span>
              </div>
              <span className="mt-1 block text-[10px] text-blue-500">
                Hari masuk kerja satuan pendidikan
              </span>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs dark:border-emerald-950 dark:bg-emerald-950/20">
              <span className="block text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                Hari Efektif Belajar (HEB)
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300">
                  {semesterTotals.effectiveLearningDays}
                </span>
                <span className="text-[11px] text-emerald-600">Hari</span>
              </div>
              <span className="mt-1 block text-[10px] text-emerald-600">
                KBM Tatap Muka Aktif
              </span>
            </div>

            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 shadow-xs dark:border-indigo-950 dark:bg-indigo-950/20">
              <span className="block text-[11px] font-medium text-indigo-700 dark:text-indigo-400">
                Minggu Efektif (MEB)
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300">
                  {totalWeeksExact}
                </span>
                <span className="text-[11px] text-indigo-600">Pekan</span>
              </div>
              <span className="mt-1 block text-[10px] text-indigo-500">
                ≈ {totalWeeksRounded} Minggu Efektif
              </span>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs dark:border-amber-950 dark:bg-amber-950/20">
              <span className="block text-[11px] font-medium text-amber-700 dark:text-amber-400">
                Total Alokasi JP Mapel
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-amber-700 dark:text-amber-300">
                  {totalLessonHours}
                </span>
                <span className="text-[11px] text-amber-600">JP</span>
              </div>
              <span className="mt-1 block text-[10px] text-amber-600">
                {customJpPerWeek} JP/Pekan × {totalWeeksExact} Pekan
              </span>
            </div>
          </div>

          {/* Subject & JP Parameter Customizer */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Hitung Beban Jam Pelajaran (JP) Mata Pelajaran:
                </span>
              </div>

              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  const sub = subjects.find((s) => s.id === e.target.value);
                  if (sub) setCustomJpPerWeek(sub.hoursPerWeek || 2);
                }}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.hoursPerWeek} JP/Minggu)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-600 dark:text-slate-400">
                Alokasi JP Per Pekan:
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={customJpPerWeek}
                onChange={(e) => setCustomJpPerWeek(Math.max(1, Number(e.target.value)))}
                className="w-16 rounded-xl border border-slate-300 bg-white px-2 py-1 text-center text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <span className="text-xs font-medium text-slate-500">JP / Pekan</span>
            </div>
          </div>

          {/* Detailed Monthly Calculation Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-850/50">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Tabel Rincian Analisis Hari Efektif Per Bulan (
                  {selectedSemester === "1"
                    ? "Semester 1 / Ganjil"
                    : selectedSemester === "2"
                    ? "Semester 2 / Genap"
                    : "1 Tahun Pelajaran"}
                  )
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Berdasarkan Kalender Akademik Resmi
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/75 text-center font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
                    <th className="p-3 w-10">No</th>
                    <th className="p-3 text-left w-32">Bulan / Tahun</th>
                    <th className="p-3 w-16" title="Jumlah Hari Kalender dalam sebulan">
                      Hari Kalender (HK)
                    </th>
                    <th className="p-3 w-14 text-rose-600" title="Jumlah Hari Minggu">
                      Libur Min (HM)
                    </th>
                    {schoolDaysType === 5 && (
                      <th className="p-3 w-14 text-indigo-600" title="Jumlah Hari Sabtu (5 hari sekolah)">
                        Libur Sab (HS)
                      </th>
                    )}
                    <th className="p-3 w-16 text-rose-600" title="Libur Nasional & Cuti Bersama">
                      Libur Nas (HLN)
                    </th>
                    <th className="p-3 w-16 text-rose-600" title="Libur Khusus / Libur Semester">
                      Libur Sem (LKS)
                    </th>
                    <th className="p-3 w-16 bg-blue-50/60 text-blue-900 dark:bg-blue-950/30 dark:text-blue-300 font-extrabold" title="Hari Efektif Sekolah">
                      HES
                    </th>
                    <th className="p-3 w-16 text-amber-700" title="Kegiatan Non-KBM: MPLS, ASTS, ASAS, Rapor">
                      Non-KBM / Ujian
                    </th>
                    <th className="p-3 w-16 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 font-extrabold" title="Hari Efektif Belajar (HEB)">
                      HEB
                    </th>
                    <th className="p-3 w-16 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 font-extrabold" title="Minggu Efektif Belajar (MEB)">
                      MEB
                    </th>
                    <th className="p-3 w-16 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300 font-extrabold" title="Jam Pelajaran Efektif">
                      JP
                    </th>
                    <th className="p-3 text-left">Keterangan & Rincian Agenda Kegiatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {semesterAnalysisData.map((m, idx) => (
                    <tr
                      key={`${m.year}-${m.monthIndex}`}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-colors"
                    >
                      <td className="p-3 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white">
                        {m.monthName} {m.year}
                      </td>
                      <td className="p-3 text-center font-semibold">{m.totalCalendarDays}</td>
                      <td className="p-3 text-center font-semibold text-rose-600">{m.sundayCount}</td>
                      {schoolDaysType === 5 && (
                        <td className="p-3 text-center font-semibold text-indigo-600">{m.saturdayCount}</td>
                      )}
                      <td className="p-3 text-center font-semibold text-rose-600">
                        {m.nationalHolidayCount}
                      </td>
                      <td className="p-3 text-center font-semibold text-rose-600">
                        {m.semesterHolidayCount}
                      </td>
                      <td className="p-3 text-center font-extrabold bg-blue-50/40 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300">
                        {m.effectiveSchoolDays}
                      </td>
                      <td className="p-3 text-center font-semibold text-amber-700">
                        {m.nonKbmDays}
                      </td>
                      <td className="p-3 text-center font-extrabold bg-emerald-50/70 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
                        {m.effectiveLearningDays}
                      </td>
                      <td className="p-3 text-center font-extrabold bg-indigo-50/70 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300">
                        {m.effectiveWeeks}
                      </td>
                      <td className="p-3 text-center font-extrabold bg-amber-50/70 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                        {m.effectiveHours}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {m.eventsList.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {m.eventsList.map((ev) => (
                              <span
                                key={ev.id}
                                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                  ev.type === "holiday"
                                    ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                    : ev.type === "exam"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                }`}
                              >
                                {ev.title}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">KBM Efektif Reguler</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-300 bg-slate-100 text-center font-extrabold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <td colSpan={2} className="p-3 text-left">
                      JUMLAH / TOTAL PERIODE
                    </td>
                    <td className="p-3">{semesterTotals.totalCalendarDays}</td>
                    <td className="p-3 text-rose-600">{semesterTotals.sundayCount}</td>
                    {schoolDaysType === 5 && (
                      <td className="p-3 text-indigo-600">{semesterTotals.saturdayCount}</td>
                    )}
                    <td className="p-3 text-rose-600">{semesterTotals.nationalHolidayCount}</td>
                    <td className="p-3 text-rose-600">{semesterTotals.semesterHolidayCount}</td>
                    <td className="p-3 bg-blue-100/70 text-blue-900 dark:bg-blue-900/50 dark:text-blue-200">
                      {semesterTotals.effectiveSchoolDays}
                    </td>
                    <td className="p-3 text-amber-800">{semesterTotals.nonKbmDays}</td>
                    <td className="p-3 bg-emerald-100/70 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200">
                      {semesterTotals.effectiveLearningDays}
                    </td>
                    <td className="p-3 bg-indigo-100/70 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-200">
                      {totalWeeksExact}
                    </td>
                    <td className="p-3 bg-amber-100/70 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                      {totalLessonHours}
                    </td>
                    <td className="p-3 text-left text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Total {totalWeeksExact} Pekan Efektif ({totalLessonHours} Jam Pelajaran)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Lesson Hours Distribution Plan (Distribusi Alokasi Waktu Jam Pelajaran) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Distribusi Alokasi Waktu Jam Pelajaran (JP)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Beban belajar mapel {selectedSubject?.name} semester ini
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-850">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      1. Jam Pembelajaran Tatap Muka Pokok (KBM / ATP)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Penyampaian materi dan asesmen formatif reguler (≈ 80%)
                    </span>
                  </div>
                  <span className="rounded-lg bg-blue-100 px-3 py-1 font-extrabold text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-sm">
                    {tatapMukaHours} JP
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-850">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      2. Jam Asesmen Sumatif (ASTS & ASAS)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Asesmen Tengah Semester dan Akhir Semester (≈ 15%)
                    </span>
                  </div>
                  <span className="rounded-lg bg-amber-100 px-3 py-1 font-extrabold text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-sm">
                    {asesmenHours} JP
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-850">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      3. Jam Cadangan / Remedial & Pengayaan
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Antisipasi libur mendadak, kegiatan sekolah, dan tindak lanjut (≈ 5%)
                    </span>
                  </div>
                  <span className="rounded-lg bg-emerald-100 px-3 py-1 font-extrabold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-sm">
                    {cadanganHours} JP
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border-2 border-indigo-200 bg-indigo-50/60 p-3.5 dark:border-indigo-900 dark:bg-indigo-950/40">
                  <span className="font-extrabold text-indigo-900 dark:text-indigo-200">
                    TOTAL ALOKASI WAKTU SEMESTER
                  </span>
                  <span className="text-base font-extrabold text-indigo-900 dark:text-indigo-200">
                    {totalLessonHours} JP ({totalWeeksExact} Pekan)
                  </span>
                </div>
              </div>
            </div>

            {/* Formula & Policy Guide Box */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Pedoman Rumus & Landasan Perhitungan
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Standar pengelolaan kurikulum dan kalender akademik
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-850">
                  <strong className="text-slate-900 dark:text-white block mb-1">
                    1. Hari Efektif Sekolah (HES):
                  </strong>
                  <p className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                    HES = Hari Kalender - (Hari Minggu + Hari Sabtu + Libur Nasional + Libur Semester)
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-850">
                  <strong className="text-slate-900 dark:text-white block mb-1">
                    2. Hari Efektif Belajar (HEB):
                  </strong>
                  <p className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                    HEB = HES - Kegiatan Khusus Non-KBM (MPLS, ASTS, ASAS, Rapor)
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-850">
                  <strong className="text-slate-900 dark:text-white block mb-1">
                    3. Minggu / Pekan Efektif Belajar (MEB):
                  </strong>
                  <p className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                    MEB = HEB ÷ {schoolDaysType === 5 ? "5 Hari Kerja" : "6 Hari Kerja"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500">
                    Status Sinkronisasi Kalender:
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                    <CheckCircle className="h-3.5 w-3.5" /> Terintegrasi dengan Program Semester & Alokasi Waktu
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATRIKS KALENDER BULANAN */}
      {activeTab === "calendar" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs text-slate-500">Bulan Terpilih:</span>
              <div className="mt-1 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {monthNames[calendarMonth]} {calendarYear}
                </h3>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {daysInVisualMonth} Hari
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs text-slate-500">Estimasi Hari Efektif Belajar Bulan Ini:</span>
              <div className="mt-1 flex items-baseline gap-2">
                <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {semesterAnalysisData.find((m) => m.monthIndex === calendarMonth && m.year === calendarYear)?.effectiveLearningDays || 0}
                </h3>
                <span className="text-xs text-slate-400">Hari Belajar Efektif (HBE)</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs text-slate-500">Estimasi Pekan Efektif Bulan Ini:</span>
              <div className="mt-1 flex items-baseline gap-2">
                <h3 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {semesterAnalysisData.find((m) => m.monthIndex === calendarMonth && m.year === calendarYear)?.effectiveWeeks || 0}
                </h3>
                <span className="text-xs text-slate-400">Minggu Efektif Belajar (MEB)</span>
              </div>
            </div>
          </div>

          {/* Interactive Calendar Month Grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            {/* Month Navigation */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {monthNames[calendarMonth]} {calendarYear}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">
              <div className="text-rose-500">Min</div>
              <div>Sen</div>
              <div>Sel</div>
              <div>Rab</div>
              <div>Kam</div>
              <div>Jum</div>
              <div className={schoolDaysType === 5 ? "text-rose-500" : "text-indigo-500"}>Sab</div>
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells before month start */}
              {Array.from({ length: firstDayOfWeekVisual }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 rounded-xl bg-slate-50/50 dark:bg-slate-850/30" />
              ))}

              {/* Active days */}
              {Array.from({ length: daysInVisualMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const dayEvents = calendarEvents.filter(
                  (ev) => ev.startDate <= dateStr && ev.endDate >= dateStr
                );
                const dayOfWeek = new Date(calendarYear, calendarMonth, dayNum).getDay();
                const isSunday = dayOfWeek === 0;
                const isSaturday = dayOfWeek === 6;
                const isWeekendHoliday = isSunday || (isSaturday && schoolDaysType === 5);

                return (
                  <div
                    key={dayNum}
                    className={`flex h-20 flex-col justify-between rounded-xl border p-2 text-xs transition-all ${
                      dayEvents.some((e) => e.type === "holiday") || isWeekendHoliday
                        ? "border-rose-100 bg-rose-50/40 dark:border-rose-950 dark:bg-rose-950/20"
                        : dayEvents.some((e) => e.type === "exam")
                        ? "border-amber-100 bg-amber-50/40 dark:border-amber-950 dark:bg-amber-950/20"
                        : "border-slate-100 bg-slate-50/30 hover:border-blue-200 dark:border-slate-800 dark:bg-slate-850/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold ${
                          isWeekendHoliday
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {dayNum}
                      </span>
                    </div>

                    <div className="space-y-1 overflow-hidden">
                      {dayEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className={`truncate rounded px-1.5 py-0.5 text-[9px] font-bold ${
                            ev.type === "holiday"
                              ? "bg-rose-600 text-white"
                              : ev.type === "exam"
                              ? "bg-amber-500 text-white"
                              : "bg-blue-600 text-white"
                          }`}
                          title={ev.title}
                        >
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DAFTAR AGENDA & LIBUR AKADEMIK */}
      {activeTab === "events" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Seluruh Agenda Kegiatan & Libur Kalender Pendidikan
            </h3>
            <span className="text-xs text-slate-500">
              Menampilkan {calendarEvents.length} entri agenda
            </span>
          </div>

          <div className="space-y-3">
            {calendarEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-3.5 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${
                      ev.type === "holiday"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                        : ev.type === "exam"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                    }`}
                  >
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        Semester {ev.semester || "1"}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {ev.startDate} s.d. {ev.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      ev.isEffectiveDay
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                    }`}
                  >
                    {ev.isEffectiveDay ? "Hari Efektif" : "Libur / Non-Efektif"}
                  </span>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus agenda "${ev.title}"?`)) deleteCalendarEvent(ev.id);
                    }}
                    className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Agenda / Libur */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tambah Agenda / Libur Kalender
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Judul Agenda / Nama Kegiatan / Libur *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Asesmen Sumatif Akhir Semester (ASAS)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kategori
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                        isEffectiveDay: e.target.value !== "holiday",
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="school_activity">Kegiatan Sekolah</option>
                    <option value="exam">Asesmen / Ujian (ASTS / ASAS)</option>
                    <option value="holiday">Libur Resmi / Libur Semester</option>
                    <option value="semester_start">Awal Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Semester
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        semester: e.target.value as "1" | "2",
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="1">Semester 1 (Ganjil)</option>
                    <option value="2">Semester 2 (Genap)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tanggal Mulai *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Tanggal Selesai *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isEffective"
                  checked={formData.isEffectiveDay}
                  onChange={(e) => setFormData({ ...formData, isEffectiveDay: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isEffective" className="text-xs text-slate-700 dark:text-slate-300">
                  Dihitung sebagai Hari Efektif Sekolah / Belajar
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" />
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
