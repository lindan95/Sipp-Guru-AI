import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SchoolProfile,
  TeacherProfile,
  ClassRoom,
  Student,
  Subject,
  ScheduleItem,
  CalendarEvent,
  DiagnosticAssessment,
  StudentDiagnosticAnalysis,
  CapaianPembelajaran,
  AlurTujuanPembelajaran,
  TimeAllocation,
  ProgramSemester,
  ProgramTahunan,
  KKTPItem,
  ModulAjar,
  LKPD,
  AssessmentPlan,
  BahanAjar,
  MediaAjar,
  QuestionBankItem,
  TestSpecification,
  QuestionItemAnalysis,
  AttendanceRecord,
  GradeRecord,
  ActivityLog,
  AppSettings,
  RubricItem,
  FormativeAssessment,
  SummativeAssessment,
  P5Assessment,
  TeachingJournalItem,
  CaseRecord,
  RemedialEnrichmentItem,
  SupervisionRecord,
  PKBRecord,
  ChapterNote,
  TaskAssignment,
  ChapterAssessment,
} from "../types";
import {
  db,
  DEFAULT_SCHOOL_PROFILE,
  DEFAULT_TEACHER_PROFILE,
  DEFAULT_CLASSES,
  DEFAULT_STUDENTS,
  DEFAULT_SUBJECTS,
  DEFAULT_SCHEDULES,
  DEFAULT_CALENDAR_EVENTS,
  DEFAULT_CP,
  DEFAULT_ATP,
  DEFAULT_MODUL_AJAR,
  DEFAULT_LKPD,
  DEFAULT_ASSESSMENT_PLANS,
  DEFAULT_BAHAN_AJAR,
  DEFAULT_MEDIA_AJAR,
  DEFAULT_QUESTIONS,
  DEFAULT_TEST_SPECS,
  DEFAULT_QUESTION_ANALYSIS,
  DEFAULT_DIAGNOSTIC,
  DEFAULT_DIAGNOSTIC_ANALYSES,
  DEFAULT_ATTENDANCE,
  DEFAULT_GRADES,
  DEFAULT_ACTIVITY_LOGS,
  DEFAULT_KKTP,
  DEFAULT_SETTINGS,
  DEFAULT_RUBRICS,
  DEFAULT_FORMATIVE,
  DEFAULT_SUMMATIVE,
  DEFAULT_P5,
  DEFAULT_JOURNALS,
  DEFAULT_CASES,
  DEFAULT_REMEDIAL,
  DEFAULT_SUPERVISION,
  DEFAULT_PKB,
  DEFAULT_CHAPTER_NOTES,
  DEFAULT_TASK_ASSIGNMENTS,
  DEFAULT_CHAPTER_ASSESSMENTS,
} from "../services/db";

export type NavMenu =
  | "dashboard"
  | "profil_sekolah"
  | "profil_guru"
  | "kelas"
  | "siswa"
  | "mata_pelajaran"
  | "jadwal"
  | "kalender_pendidikan"
  | "asesmen_diagnosis"
  | "analisis_diagnosis"
  | "rubrik"
  | "asesmen_formatif"
  | "asesmen_sumatif"
  | "p5"
  | "penilaian"
  | "buku_catatan_bab"
  | "penilaian_tugas"
  | "asesmen_perbab"
  | "cp"
  | "atp"
  | "alokasi_waktu"
  | "program_semester"
  | "program_tahunan"
  | "kktp"
  | "modul_ajar"
  | "lkpd"
  | "program_penilaian"
  | "bahan_ajar"
  | "media_ajar"
  | "bank_soal"
  | "pembahasan"
  | "kisi_kisi"
  | "analisis_soal"
  | "kartu_soal"
  | "absensi"
  | "rekap_kehadiran"
  | "rekap_siswa"
  | "jurnal_mengajar"
  | "buku_kasus"
  | "remedial_pengayaan"
  | "supervisi"
  | "pkb"
  | "ai_assistant"
  | "pengaturan";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
}

export interface DocumentPreviewPayload {
  title: string;
  docType: string;
  contentHtml?: string;
  dataObj?: any;
}

interface AppContextType {
  // Navigation & UI State
  activeMenu: NavMenu;
  setActiveMenu: (menu: NavMenu) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDarkMode: () => void;
  isLocked: boolean;
  setIsLocked: (locked: boolean) => void;
  unlockWithPin: (pin: string) => boolean;

  // Search & Global Modals
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  previewDoc: DocumentPreviewPayload | null;
  setPreviewDoc: (doc: DocumentPreviewPayload | null) => void;
  isGasDeployOpen: boolean;
  setIsGasDeployOpen: (open: boolean) => void;

  // Notification Toast
  toasts: ToastMessage[];
  addToast: (type: "success" | "error" | "info" | "warning", title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Active Context (Class & Subject Global Scope)
  activeClassId: string;
  setActiveClassId: (id: string) => void;
  activeSubjectId: string;
  setActiveSubjectId: (id: string) => void;
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  selectedSubjectId: string;
  setSelectedSubjectId: (id: string) => void;

  // Log Activity
  addActivityLog: (action: string, module: string, details: string) => void;

  // Data Stores
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  schoolProfile: SchoolProfile;
  saveSchoolProfile: (profile: SchoolProfile) => void;

  teacherProfile: TeacherProfile;
  saveTeacherProfile: (profile: TeacherProfile) => void;

  classes: ClassRoom[];
  saveClass: (c: ClassRoom) => void;
  deleteClass: (id: string) => void;

  students: Student[];
  saveStudent: (s: Student) => void;
  deleteStudent: (id: string) => void;
  bulkImportStudents: (classId: string, students: Partial<Student>[]) => void;

  subjects: Subject[];
  saveSubject: (sbj: Subject) => void;
  deleteSubject: (id: string) => void;

  schedules: ScheduleItem[];
  saveSchedule: (sch: ScheduleItem) => void;
  deleteSchedule: (id: string) => void;

  calendarEvents: CalendarEvent[];
  saveCalendarEvent: (ev: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;

  // Perangkat Pembelajaran Stores
  cpList: CapaianPembelajaran[];
  saveCP: (cp: CapaianPembelajaran) => void;
  deleteCP: (id: string) => void;

  atpList: AlurTujuanPembelajaran[];
  saveATP: (atp: AlurTujuanPembelajaran) => void;
  deleteATP: (id: string) => void;

  timeAllocations: TimeAllocation[];
  saveTimeAllocation: (t: TimeAllocation) => void;

  promesList: ProgramSemester[];
  savePromes: (p: ProgramSemester) => void;

  protaList: ProgramTahunan[];
  saveProta: (p: ProgramTahunan) => void;

  kktpList: KKTPItem[];
  saveKKTP: (k: KKTPItem) => void;
  deleteKKTP: (id: string) => void;

  modulList: ModulAjar[];
  saveModul: (m: ModulAjar) => void;
  deleteModul: (id: string) => void;
  duplicateModul: (id: string) => void;

  lkpdList: LKPD[];
  saveLKPD: (l: LKPD) => void;
  deleteLKPD: (id: string) => void;
  duplicateLKPD: (id: string) => void;

  assessmentPlans: AssessmentPlan[];
  saveAssessmentPlan: (p: AssessmentPlan) => void;
  deleteAssessmentPlan: (id: string) => void;

  bahanAjarList: BahanAjar[];
  saveBahanAjar: (b: BahanAjar) => void;
  deleteBahanAjar: (id: string) => void;

  mediaAjarList: MediaAjar[];
  saveMediaAjar: (m: MediaAjar) => void;
  deleteMediaAjar: (id: string) => void;

  questions: QuestionBankItem[];
  saveQuestion: (q: QuestionBankItem) => void;
  deleteQuestion: (id: string) => void;

  testSpecs: TestSpecification[];
  saveTestSpec: (spec: TestSpecification) => void;
  deleteTestSpec: (id: string) => void;

  questionAnalysisList: QuestionItemAnalysis[];
  saveQuestionAnalysis: (a: QuestionItemAnalysis) => void;
  deleteQuestionAnalysis: (id: string) => void;

  diagnosticAssessments: DiagnosticAssessment[];
  saveDiagnosticAssessment: (d: DiagnosticAssessment) => void;
  deleteDiagnosticAssessment: (id: string) => void;
  diagnosticList: DiagnosticAssessment[];
  saveDiagnostic: (d: DiagnosticAssessment) => void;
  deleteDiagnostic: (id: string) => void;

  // Analisis Diagnosis Siswa (AI-powered)
  diagnosticAnalyses: StudentDiagnosticAnalysis[];
  saveDiagnosticAnalysis: (a: StudentDiagnosticAnalysis) => void;
  deleteDiagnosticAnalysis: (id: string) => void;

  rubricList: RubricItem[];
  saveRubric: (r: RubricItem) => void;
  deleteRubric: (id: string) => void;

  formativeList: FormativeAssessment[];
  saveFormative: (f: FormativeAssessment) => void;
  deleteFormative: (id: string) => void;

  summativeList: SummativeAssessment[];
  saveSummative: (s: SummativeAssessment) => void;
  deleteSummative: (id: string) => void;

  p5List: P5Assessment[];
  saveP5: (p: P5Assessment) => void;
  deleteP5: (id: string) => void;

  journalList: TeachingJournalItem[];
  saveJournal: (j: TeachingJournalItem) => void;
  deleteJournal: (id: string) => void;

  caseList: CaseRecord[];
  saveCaseRecord: (c: CaseRecord) => void;
  deleteCaseRecord: (id: string) => void;

  remedialList: RemedialEnrichmentItem[];
  saveRemedial: (r: RemedialEnrichmentItem) => void;
  deleteRemedial: (id: string) => void;

  supervisionList: SupervisionRecord[];
  saveSupervision: (s: SupervisionRecord) => void;
  deleteSupervision: (id: string) => void;

  pkbList: PKBRecord[];
  savePKB: (p: PKBRecord) => void;
  deletePKB: (id: string) => void;

  // Penilaian Tambahan (Buku Catatan Per Bab, Penilaian Tugas, Asesmen Per Bab)
  chapterNotes: ChapterNote[];
  saveChapterNote: (note: ChapterNote) => void;
  deleteChapterNote: (id: string) => void;

  taskAssignments: TaskAssignment[];
  saveTaskAssignment: (task: TaskAssignment) => void;
  deleteTaskAssignment: (id: string) => void;

  chapterAssessments: ChapterAssessment[];
  saveChapterAssessment: (asmt: ChapterAssessment) => void;
  deleteChapterAssessment: (id: string) => void;

  // Convenient Aliases
  modulAjarList: ModulAjar[];
  saveModulAjar: (m: ModulAjar) => void;
  deleteModulAjar: (id: string) => void;
  duplicateModulAjar: (id: string) => void;
  teachingMaterials: BahanAjar[];
  saveTeachingMaterial: (b: BahanAjar) => void;
  deleteTeachingMaterial: (id: string) => void;
  teachingMedia: MediaAjar[];
  saveTeachingMedia: (m: MediaAjar) => void;
  deleteTeachingMedia: (id: string) => void;
  questionBank: QuestionBankItem[];
  saveQuestionBank: (q: QuestionBankItem) => void;
  deleteQuestionBank: (id: string) => void;
  teachingJournals: TeachingJournalItem[];
  saveTeachingJournal: (j: TeachingJournalItem) => void;
  deleteTeachingJournal: (id: string) => void;
  caseRecords: CaseRecord[];
  saveCase: (c: CaseRecord) => void;
  deleteCase: (id: string) => void;
  remedialEnrichments: RemedialEnrichmentItem[];
  supervisions: SupervisionRecord[];
  pkbRecords: PKBRecord[];

  attendanceRecords: AttendanceRecord[];
  saveAttendance: (att: AttendanceRecord) => void;

  gradeRecords: GradeRecord[];
  saveGrade: (grd: GradeRecord) => void;

  activityLogs: ActivityLog[];

  // Global Helpers
  resetAllDataToDefault: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeMenu, setActiveMenu] = useState<NavMenu>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(() => db.get("dark_mode", false));
  const [isLocked, setIsLocked] = useState<boolean>(false);

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentPreviewPayload | null>(null);
  const [isGasDeployOpen, setIsGasDeployOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent States
  const [settings, setSettings] = useState<AppSettings>(() => db.get("settings", DEFAULT_SETTINGS));
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => db.get("school_profile", DEFAULT_SCHOOL_PROFILE));
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>(() => db.get("teacher_profile", DEFAULT_TEACHER_PROFILE));
  const [classes, setClasses] = useState<ClassRoom[]>(() => db.get("classes", DEFAULT_CLASSES));
  const [students, setStudents] = useState<Student[]>(() => db.get("students", DEFAULT_STUDENTS));
  const [subjects, setSubjects] = useState<Subject[]>(() => db.get("subjects", DEFAULT_SUBJECTS));
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => db.get("schedules", DEFAULT_SCHEDULES));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => db.get("calendar", DEFAULT_CALENDAR_EVENTS));

  const [cpList, setCpList] = useState<CapaianPembelajaran[]>(() => db.get("cp", DEFAULT_CP));
  const [atpList, setAtpList] = useState<AlurTujuanPembelajaran[]>(() => db.get("atp", DEFAULT_ATP));
  const [timeAllocations, setTimeAllocations] = useState<TimeAllocation[]>(() => db.get("time_allocations", []));
  const [promesList, setPromesList] = useState<ProgramSemester[]>(() => db.get("promes", []));
  const [protaList, setProtaList] = useState<ProgramTahunan[]>(() => db.get("prota", []));
  const [kktpList, setKktpList] = useState<KKTPItem[]>(() => db.get("kktp", DEFAULT_KKTP));
  const [modulList, setModulList] = useState<ModulAjar[]>(() => db.get("modul_ajar", DEFAULT_MODUL_AJAR));
  const [lkpdList, setLkpdList] = useState<LKPD[]>(() => db.get("lkpd", DEFAULT_LKPD));
  const [assessmentPlans, setAssessmentPlans] = useState<AssessmentPlan[]>(() => db.get("assessment_plans", DEFAULT_ASSESSMENT_PLANS));
  const [bahanAjarList, setBahanAjarList] = useState<BahanAjar[]>(() => db.get("bahan_ajar", DEFAULT_BAHAN_AJAR));
  const [mediaAjarList, setMediaAjarList] = useState<MediaAjar[]>(() => db.get("media_ajar", DEFAULT_MEDIA_AJAR));
  const [questions, setQuestions] = useState<QuestionBankItem[]>(() => db.get("questions", DEFAULT_QUESTIONS));
  const [testSpecs, setTestSpecs] = useState<TestSpecification[]>(() => db.get("test_specs", DEFAULT_TEST_SPECS));
  const [questionAnalysisList, setQuestionAnalysisList] = useState<QuestionItemAnalysis[]>(() => db.get("question_analysis", DEFAULT_QUESTION_ANALYSIS));
  const [diagnosticAssessments, setDiagnosticAssessments] = useState<DiagnosticAssessment[]>(() => db.get("diagnostic", DEFAULT_DIAGNOSTIC));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => db.get("attendance", DEFAULT_ATTENDANCE));
  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>(() => db.get("grades", DEFAULT_GRADES));
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => db.get("activity_logs", DEFAULT_ACTIVITY_LOGS));

  // Asesmen & Administrasi Lengkap
  const [rubricList, setRubricList] = useState<RubricItem[]>(() => db.get("rubrics", DEFAULT_RUBRICS));
  const [formativeList, setFormativeList] = useState<FormativeAssessment[]>(() => db.get("formative", DEFAULT_FORMATIVE));
  const [summativeList, setSummativeList] = useState<SummativeAssessment[]>(() => db.get("summative", DEFAULT_SUMMATIVE));
  const [p5List, setP5List] = useState<P5Assessment[]>(() => db.get("p5", DEFAULT_P5));
  const [journalList, setJournalList] = useState<TeachingJournalItem[]>(() => db.get("journals", DEFAULT_JOURNALS));
  const [caseList, setCaseList] = useState<CaseRecord[]>(() => db.get("cases", DEFAULT_CASES));
  const [remedialList, setRemedialList] = useState<RemedialEnrichmentItem[]>(() => db.get("remedials", DEFAULT_REMEDIAL));
  const [supervisionList, setSupervisionList] = useState<SupervisionRecord[]>(() => db.get("supervisions", DEFAULT_SUPERVISION));
  const [pkbList, setPkbList] = useState<PKBRecord[]>(() => db.get("pkb", DEFAULT_PKB));

  // Penilaian Tambahan (Buku Catatan Per Bab, Tugas, Asesmen Per Bab)
  const [chapterNotes, setChapterNotes] = useState<ChapterNote[]>(() => db.get("chapter_notes", DEFAULT_CHAPTER_NOTES));
  const [taskAssignments, setTaskAssignments] = useState<TaskAssignment[]>(() => db.get("task_assignments", DEFAULT_TASK_ASSIGNMENTS));
  const [chapterAssessments, setChapterAssessments] = useState<ChapterAssessment[]>(() => db.get("chapter_assessments", DEFAULT_CHAPTER_ASSESSMENTS));

  // Active Scope State (Class & Subject)
  const [activeClassId, setActiveClassIdState] = useState<string>(() => {
    return db.get("active_class_id", "") || (DEFAULT_CLASSES[0]?.id || "cls-10a");
  });
  const [activeSubjectId, setActiveSubjectIdState] = useState<string>(() => {
    return db.get("active_subject_id", "") || (DEFAULT_SUBJECTS[0]?.id || "sbj-inf");
  });

  const setActiveClassId = (id: string) => {
    setActiveClassIdState(id);
    db.set("active_class_id", id);
  };

  const setActiveSubjectId = (id: string) => {
    setActiveSubjectIdState(id);
    db.set("active_subject_id", id);
  };

  // Initialize Lock status from settings
  useEffect(() => {
    if (settings.isPinLocked && settings.pinCode) {
      setIsLocked(true);
    }
  }, []);

  // Sync Dark Mode class
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      document.body.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      document.body.classList.remove("dark");
      root.style.colorScheme = "light";
    }
    db.set("dark_mode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const unlockWithPin = (pin: string): boolean => {
    if (pin === settings.pinCode || !settings.pinCode) {
      setIsLocked(false);
      addToast("success", "Kunci Terbuka", "Selamat datang kembali di SIPP Guru AI.");
      return true;
    }
    addToast("error", "PIN Salah", "PIN yang Anda masukkan tidak sesuai.");
    return false;
  };

  const addToast = (type: "success" | "error" | "info" | "warning", title: string, message: string) => {
    const id = "tst_" + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivityLog = (action: string, module: string, details: string) => {
    const newLog: ActivityLog = {
      id: "log-" + Date.now(),
      action,
      module,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => {
      const updated = [newLog, ...prev.slice(0, 49)];
      db.set("activity_logs", updated);
      return updated;
    });
  };

  // Updaters with localStorage sync
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      db.set("settings", updated);
      return updated;
    });
    addToast("success", "Pengaturan Disimpan", "Preferensi aplikasi berhasil diperbarui.");
  };

  const saveSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfile(profile);
    db.set("school_profile", profile);
    addActivityLog("Perbarui Profil Sekolah", "Profil Sekolah", profile.name);
    addToast("success", "Profil Sekolah Tersimpan", "Data identitas sekolah telah diperbarui.");
  };

  const saveTeacherProfile = (profile: TeacherProfile) => {
    setTeacherProfile(profile);
    db.set("teacher_profile", profile);
    addActivityLog("Perbarui Profil Guru", "Profil Guru", profile.fullName);
    addToast("success", "Profil Guru Tersimpan", "Data guru telah diperbarui.");
  };

  const saveClass = (c: ClassRoom) => {
    setClasses((prev) => {
      const index = prev.findIndex((item) => item.id === c.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === c.id ? c : item)) : [...prev, c];
      db.set("classes", updated);
      return updated;
    });
    addActivityLog("Simpan Data Kelas", "Kelas", c.name);
    addToast("success", "Kelas Tersimpan", `Data kelas ${c.name} berhasil disimpan.`);
  };

  const deleteClass = (id: string) => {
    setClasses((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      db.set("classes", updated);
      return updated;
    });
    addToast("info", "Kelas Dihapus", "Kelas berhasil dihapus.");
  };

  const saveStudent = (s: Student) => {
    setStudents((prev) => {
      const index = prev.findIndex((item) => item.id === s.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === s.id ? s : item)) : [...prev, s];
      db.set("students", updated);
      return updated;
    });
    addActivityLog("Simpan Data Siswa", "Siswa", s.name);
    addToast("success", "Siswa Tersimpan", `Data siswa ${s.name} berhasil disimpan.`);
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      db.set("students", updated);
      return updated;
    });
    addToast("info", "Siswa Dihapus", "Data siswa berhasil dihapus.");
  };

  const bulkImportStudents = (classId: string, newStudents: Partial<Student>[]) => {
    const formatted: Student[] = newStudents.map((s, idx) => ({
      id: "std-" + Date.now() + "-" + idx,
      classId,
      nis: s.nis || "241" + (100 + idx),
      nisn: s.nisn || "007" + Date.now().toString().slice(-7) + idx,
      name: s.name || "Siswa Baru",
      gender: s.gender || "L",
      phone: s.phone || "",
      parentName: s.parentName || "",
      status: "Aktif",
    }));
    setStudents((prev) => {
      const updated = [...prev, ...formatted];
      db.set("students", updated);
      return updated;
    });
    addActivityLog("Import Siswa", "Siswa", `${formatted.length} siswa diimport ke kelas.`);
    addToast("success", "Import Berhasil", `${formatted.length} siswa berhasil ditambahkan.`);
  };

  const saveSubject = (sbj: Subject) => {
    setSubjects((prev) => {
      const index = prev.findIndex((item) => item.id === sbj.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === sbj.id ? sbj : item)) : [...prev, sbj];
      db.set("subjects", updated);
      return updated;
    });
    addToast("success", "Mata Pelajaran Disimpan", sbj.name);
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      db.set("subjects", updated);
      return updated;
    });
  };

  const saveSchedule = (sch: ScheduleItem) => {
    setSchedules((prev) => {
      const index = prev.findIndex((item) => item.id === sch.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === sch.id ? sch : item)) : [...prev, sch];
      db.set("schedules", updated);
      return updated;
    });
    addToast("success", "Jadwal Disimpan", `${sch.day}, ${sch.startTime} - ${sch.endTime}`);
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      db.set("schedules", updated);
      return updated;
    });
  };

  const saveCalendarEvent = (ev: CalendarEvent) => {
    setCalendarEvents((prev) => {
      const index = prev.findIndex((item) => item.id === ev.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === ev.id ? ev : item)) : [...prev, ev];
      db.set("calendar", updated);
      return updated;
    });
    addToast("success", "Kalender Diperbarui", ev.title);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      db.set("calendar", updated);
      return updated;
    });
  };

  const saveCP = (cp: CapaianPembelajaran) => {
    setCpList((prev) => {
      const index = prev.findIndex((item) => item.id === cp.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === cp.id ? cp : item)) : [...prev, cp];
      db.set("cp", updated);
      return updated;
    });
    addActivityLog("Simpan CP", "Capaian Pembelajaran", cp.element);
    addToast("success", "CP Berhasil Disimpan", cp.element);
  };

  const deleteCP = (id: string) => {
    setCpList((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      db.set("cp", updated);
      return updated;
    });
  };

  const saveATP = (atp: AlurTujuanPembelajaran) => {
    setAtpList((prev) => {
      const index = prev.findIndex((item) => item.id === atp.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === atp.id ? atp : item)) : [...prev, atp];
      db.set("atp", updated);
      return updated;
    });
    addActivityLog("Simpan ATP", "Alur Tujuan Pembelajaran", atp.topic);
    addToast("success", "ATP Berhasil Disimpan", atp.topic);
  };

  const deleteATP = (id: string) => {
    setAtpList((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      db.set("atp", updated);
      return updated;
    });
  };

  const saveTimeAllocation = (t: TimeAllocation) => {
    setTimeAllocations((prev) => {
      const index = prev.findIndex((item) => item.id === t.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === t.id ? t : item)) : [...prev, t];
      db.set("time_allocations", updated);
      return updated;
    });
    addToast("success", "Alokasi Waktu Disimpan", `${t.totalAllocatedHours} JP`);
  };

  const savePromes = (p: ProgramSemester) => {
    setPromesList((prev) => {
      const index = prev.findIndex((item) => item.id === p.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === p.id ? p : item)) : [...prev, p];
      db.set("promes", updated);
      return updated;
    });
    addToast("success", "Program Semester Disimpan", `Semester ${p.semester}`);
  };

  const saveProta = (p: ProgramTahunan) => {
    setProtaList((prev) => {
      const index = prev.findIndex((item) => item.id === p.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === p.id ? p : item)) : [...prev, p];
      db.set("prota", updated);
      return updated;
    });
    addToast("success", "Program Tahunan Disimpan", `${p.totalHours} JP`);
  };

  const saveKKTP = (k: KKTPItem) => {
    setKktpList((prev) => {
      const index = prev.findIndex((item) => item.id === k.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === k.id ? k : item)) : [...prev, k];
      db.set("kktp", updated);
      return updated;
    });
    addToast("success", "KKTP Disimpan", k.learningObjective.slice(0, 40) + "...");
  };

  const deleteKKTP = (id: string) => {
    setKktpList((prev) => {
      const updated = prev.filter((k) => k.id !== id);
      db.set("kktp", updated);
      return updated;
    });
  };

  const saveModul = (m: ModulAjar) => {
    setModulList((prev) => {
      const index = prev.findIndex((item) => item.id === m.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === m.id ? m : item)) : [...prev, m];
      db.set("modul_ajar", updated);
      return updated;
    });
    addActivityLog("Simpan Modul Ajar", "Modul Ajar", m.title);
    addToast("success", "Modul Ajar Tersimpan", m.title);
  };

  const deleteModul = (id: string) => {
    setModulList((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      db.set("modul_ajar", updated);
      return updated;
    });
    addToast("info", "Modul Dihapus", "Modul ajar telah dihapus.");
  };

  const duplicateModul = (id: string) => {
    const target = modulList.find((m) => m.id === id);
    if (!target) return;
    const duplicated: ModulAjar = {
      ...target,
      id: "mod-" + Date.now(),
      title: `${target.title} (Salinan)`,
      createdAt: new Date().toISOString(),
    };
    saveModul(duplicated);
    addToast("success", "Modul Diduplikasi", "Salinan modul siap untuk diedit.");
  };

  const saveLKPD = (l: LKPD) => {
    setLkpdList((prev) => {
      const index = prev.findIndex((item) => item.id === l.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === l.id ? l : item)) : [...prev, l];
      db.set("lkpd", updated);
      return updated;
    });
    addActivityLog("Simpan LKPD", "LKPD", l.title);
    addToast("success", "LKPD Tersimpan", l.title);
  };

  const deleteLKPD = (id: string) => {
    setLkpdList((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      db.set("lkpd", updated);
      return updated;
    });
  };

  const duplicateLKPD = (id: string) => {
    const target = lkpdList.find((l) => l.id === id);
    if (!target) return;
    const duplicated: LKPD = {
      ...target,
      id: "lkpd-" + Date.now(),
      title: `${target.title} (Salinan)`,
      createdAt: new Date().toISOString(),
    };
    saveLKPD(duplicated);
    addToast("success", "LKPD Diduplikasi", "Salinan LKPD siap untuk diedit.");
  };

  const saveAssessmentPlan = (p: AssessmentPlan) => {
    setAssessmentPlans((prev) => {
      const index = prev.findIndex((item) => item.id === p.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === p.id ? p : item)) : [...prev, p];
      db.set("assessment_plans", updated);
      return updated;
    });
    addToast("success", "Program Penilaian Disimpan", "Rencana penilaian berhasil diperbarui.");
  };

  const deleteAssessmentPlan = (id: string) => {
    setAssessmentPlans((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      db.set("assessment_plans", updated);
      return updated;
    });
    addToast("info", "Program Penilaian Dihapus", "Rencana penilaian berhasil dihapus.");
  };

  const saveBahanAjar = (b: BahanAjar) => {
    setBahanAjarList((prev) => {
      const index = prev.findIndex((item) => item.id === b.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === b.id ? b : item)) : [...prev, b];
      db.set("bahan_ajar", updated);
      return updated;
    });
    addActivityLog("Simpan Bahan Ajar", "Bahan Ajar", b.title);
    addToast("success", "Bahan Ajar Tersimpan", b.title);
  };

  const deleteBahanAjar = (id: string) => {
    setBahanAjarList((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      db.set("bahan_ajar", updated);
      return updated;
    });
  };

  const saveMediaAjar = (m: MediaAjar) => {
    setMediaAjarList((prev) => {
      const index = prev.findIndex((item) => item.id === m.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === m.id ? m : item)) : [...prev, m];
      db.set("media_ajar", updated);
      return updated;
    });
    addToast("success", "Media Ajar Tersimpan", m.title);
  };

  const deleteMediaAjar = (id: string) => {
    setMediaAjarList((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      db.set("media_ajar", updated);
      return updated;
    });
  };

  const saveQuestion = (q: QuestionBankItem) => {
    setQuestions((prev) => {
      const index = prev.findIndex((item) => item.id === q.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === q.id ? q : item)) : [...prev, q];
      db.set("questions", updated);
      return updated;
    });
    addActivityLog("Simpan Soal", "Bank Soal", q.topic);
    addToast("success", "Soal Disimpan", `${q.questionType} - ${q.difficulty}`);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      db.set("questions", updated);
      return updated;
    });
  };

  const saveTestSpec = (spec: TestSpecification) => {
    setTestSpecs((prev) => {
      const index = prev.findIndex((item) => item.id === spec.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === spec.id ? spec : item)) : [...prev, spec];
      db.set("test_specs", updated);
      return updated;
    });
    addToast("success", "Kisi-Kisi Disimpan", spec.title);
  };

  const deleteTestSpec = (id: string) => {
    setTestSpecs((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      db.set("test_specs", updated);
      return updated;
    });
  };

  const saveQuestionAnalysis = (a: QuestionItemAnalysis) => {
    setQuestionAnalysisList((prev) => {
      const index = prev.findIndex((item) => item.id === a.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === a.id ? a : item)) : [...prev, a];
      db.set("question_analysis", updated);
      return updated;
    });
    addToast("success", "Analisis Soal Tersimpan", a.testTitle);
  };

  const deleteQuestionAnalysis = (id: string) => {
    setQuestionAnalysisList((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      db.set("question_analysis", updated);
      return updated;
    });
  };

  const saveDiagnosticAssessment = (d: DiagnosticAssessment) => {
    setDiagnosticAssessments((prev) => {
      const index = prev.findIndex((item) => item.id === d.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === d.id ? d : item)) : [...prev, d];
      db.set("diagnostic", updated);
      return updated;
    });
    addActivityLog("Simpan Asesmen Diagnosis", "Asesmen Diagnosis", d.title);
    addToast("success", "Asesmen Diagnosis Tersimpan", d.title);
  };

  const deleteDiagnosticAssessment = (id: string) => {
    setDiagnosticAssessments((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      db.set("diagnostic", updated);
      return updated;
    });
  };

  const saveAttendance = (att: AttendanceRecord) => {
    setAttendanceRecords((prev) => {
      const index = prev.findIndex((item) => item.id === att.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === att.id ? att : item)) : [...prev, att];
      db.set("attendance", updated);
      return updated;
    });
    addActivityLog("Input Presensi", "Absensi", `Tanggal ${att.date}`);
    addToast("success", "Presensi Berhasil Disimpan", `Data kehadiran tanggal ${att.date} tercatat.`);
  };

  const saveGrade = (grd: GradeRecord) => {
    setGradeRecords((prev) => {
      const index = prev.findIndex((item) => item.id === grd.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === grd.id ? grd : item)) : [...prev, grd];
      db.set("grades", updated);
      return updated;
    });
    addActivityLog("Input Nilai", "Penilaian", `${grd.assessmentType} - ${grd.topic}`);
    addToast("success", "Nilai Siswa Disimpan", `${grd.assessmentType} (${grd.scores.length} Siswa)`);
  };

  // Rubrik Penilaian Handlers
  const saveRubric = (r: RubricItem) => {
    setRubricList((prev) => {
      const index = prev.findIndex((item) => item.id === r.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === r.id ? r : item)) : [...prev, r];
      db.set("rubrics", updated);
      return updated;
    });
    addActivityLog("Simpan Rubrik", "Rubrik Penilaian", r.title);
    addToast("success", "Rubrik Penilaian Disimpan", r.title);
  };

  const deleteRubric = (id: string) => {
    setRubricList((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      db.set("rubrics", updated);
      return updated;
    });
  };

  // Asesmen Formatif Handlers
  const saveFormative = (f: FormativeAssessment) => {
    setFormativeList((prev) => {
      const index = prev.findIndex((item) => item.id === f.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === f.id ? f : item)) : [...prev, f];
      db.set("formative", updated);
      return updated;
    });
    addActivityLog("Simpan Asesmen Formatif", "Formatif", `Tanggal ${f.date}`);
    addToast("success", "Asesmen Formatif Disimpan", `Data asesmen formatif tercatat.`);
  };

  const deleteFormative = (id: string) => {
    setFormativeList((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      db.set("formative", updated);
      return updated;
    });
  };

  // Asesmen Sumatif Handlers
  const saveSummative = (s: SummativeAssessment) => {
    setSummativeList((prev) => {
      const index = prev.findIndex((item) => item.id === s.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === s.id ? s : item)) : [...prev, s];
      db.set("summative", updated);
      return updated;
    });
    addActivityLog("Simpan Asesmen Sumatif", "Sumatif", s.assessmentName || s.title || "Sumatif");
    addToast("success", "Asesmen Sumatif Disimpan", s.assessmentName || s.title || "Sumatif");
  };

  const deleteSummative = (id: string) => {
    setSummativeList((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      db.set("summative", updated);
      return updated;
    });
  };

  // P5 Handlers
  const saveP5 = (p: P5Assessment) => {
    setP5List((prev) => {
      const index = prev.findIndex((item) => item.id === p.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === p.id ? p : item)) : [...prev, p];
      db.set("p5", updated);
      return updated;
    });
    addActivityLog("Simpan Asesmen P5", "P5", p.projectName || p.projectTitle || p.theme);
    addToast("success", "Asesmen P5 Disimpan", p.projectName || p.projectTitle || p.theme);
  };

  const deleteP5 = (id: string) => {
    setP5List((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      db.set("p5", updated);
      return updated;
    });
  };

  // Jurnal Mengajar Handlers
  const saveJournal = (j: TeachingJournalItem) => {
    setJournalList((prev) => {
      const index = prev.findIndex((item) => item.id === j.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === j.id ? j : item)) : [...prev, j];
      db.set("journals", updated);
      return updated;
    });
    addActivityLog("Simpan Jurnal Mengajar", "Jurnal Mengajar", j.topic);
    addToast("success", "Jurnal Mengajar Disimpan", j.topic);
  };

  const deleteJournal = (id: string) => {
    setJournalList((prev) => {
      const updated = prev.filter((j) => j.id !== id);
      db.set("journals", updated);
      return updated;
    });
  };

  // Buku Kasus Handlers
  const saveCaseRecord = (c: CaseRecord) => {
    setCaseList((prev) => {
      const index = prev.findIndex((item) => item.id === c.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === c.id ? c : item)) : [...prev, c];
      db.set("cases", updated);
      return updated;
    });
    addActivityLog("Simpan Buku Kasus", "Buku Kasus Siswa", c.incidentDescription);
    addToast("success", "Catatan Kasus Siswa Disimpan", "Catatan kasus siswa berhasil diperbarui.");
  };

  const deleteCaseRecord = (id: string) => {
    setCaseList((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      db.set("cases", updated);
      return updated;
    });
  };

  // Remedial & Pengayaan Handlers
  const saveRemedial = (r: RemedialEnrichmentItem) => {
    setRemedialList((prev) => {
      const index = prev.findIndex((item) => item.id === r.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === r.id ? r : item)) : [...prev, r];
      db.set("remedials", updated);
      return updated;
    });
    addActivityLog("Simpan Remedial/Pengayaan", "Remedial & Pengayaan", `${r.type} - ${r.topic}`);
    addToast("success", `Data ${r.type} Disimpan`, r.topic);
  };

  const deleteRemedial = (id: string) => {
    setRemedialList((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      db.set("remedials", updated);
      return updated;
    });
  };

  // Supervisi Handlers
  const saveSupervision = (s: SupervisionRecord) => {
    setSupervisionList((prev) => {
      const index = prev.findIndex((item) => item.id === s.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === s.id ? s : item)) : [...prev, s];
      db.set("supervisions", updated);
      return updated;
    });
    addActivityLog("Simpan Rekam Supervisi", "Supervisi", `Nilai: ${s.score}`);
    addToast("success", "Rekam Supervisi Disimpan", `Skor ${s.score} (${s.predicate})`);
  };

  const deleteSupervision = (id: string) => {
    setSupervisionList((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      db.set("supervisions", updated);
      return updated;
    });
  };

  // PKB Handlers
  const savePKB = (p: PKBRecord) => {
    setPkbList((prev) => {
      const index = prev.findIndex((item) => item.id === p.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === p.id ? p : item)) : [...prev, p];
      db.set("pkb", updated);
      return updated;
    });
    addActivityLog("Simpan Rekam PKB", "PKB", p.activityName);
    addToast("success", "Rekam PKB Disimpan", p.activityName);
  };

  const deletePKB = (id: string) => {
    setPkbList((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      db.set("pkb", updated);
      return updated;
    });
  };

  // Chapter Notes Handlers
  const saveChapterNote = (note: ChapterNote) => {
    setChapterNotes((prev) => {
      const index = prev.findIndex((item) => item.id === note.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === note.id ? note : item)) : [note, ...prev];
      db.set("chapter_notes", updated);
      return updated;
    });
    addActivityLog("Simpan Catatan Bab", "Buku Catatan per Bab", note.chapterTitle);
    addToast("success", "Catatan Bab Tersimpan", note.chapterTitle);
  };

  const deleteChapterNote = (id: string) => {
    setChapterNotes((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      db.set("chapter_notes", updated);
      return updated;
    });
    addToast("info", "Catatan Bab Dihapus", "Catatan perkembangan per bab berhasil dihapus.");
  };

  // Task Assignment Handlers
  const saveTaskAssignment = (task: TaskAssignment) => {
    setTaskAssignments((prev) => {
      const index = prev.findIndex((item) => item.id === task.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === task.id ? task : item)) : [task, ...prev];
      db.set("task_assignments", updated);
      return updated;
    });
    addActivityLog("Simpan Penilaian Tugas", "Penilaian Tugas", task.title);
    addToast("success", "Penilaian Tugas Tersimpan", task.title);
  };

  const deleteTaskAssignment = (id: string) => {
    setTaskAssignments((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      db.set("task_assignments", updated);
      return updated;
    });
    addToast("info", "Tugas Dihapus", "Data tugas berhasil dihapus.");
  };

  // Chapter Assessment Handlers
  const saveChapterAssessment = (asmt: ChapterAssessment) => {
    setChapterAssessments((prev) => {
      const index = prev.findIndex((item) => item.id === asmt.id);
      const updated = index >= 0 ? prev.map((item) => (item.id === asmt.id ? asmt : item)) : [asmt, ...prev];
      db.set("chapter_assessments", updated);
      return updated;
    });
    addActivityLog("Simpan Asesmen Bab", "Asesmen per Bab", asmt.chapterTitle);
    addToast("success", "Asesmen Bab Tersimpan", asmt.chapterTitle);
  };

  const deleteChapterAssessment = (id: string) => {
    setChapterAssessments((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      db.set("chapter_assessments", updated);
      return updated;
    });
    addToast("info", "Asesmen Bab Dihapus", "Data asesmen per bab berhasil dihapus.");
  };

  const resetAllDataToDefault = () => {
    db.resetAll();
    setSchoolProfile(DEFAULT_SCHOOL_PROFILE);
    setTeacherProfile(DEFAULT_TEACHER_PROFILE);
    setClasses(DEFAULT_CLASSES);
    setStudents(DEFAULT_STUDENTS);
    setSubjects(DEFAULT_SUBJECTS);
    setSchedules(DEFAULT_SCHEDULES);
    setCalendarEvents(DEFAULT_CALENDAR_EVENTS);
    setCpList(DEFAULT_CP);
    setAtpList(DEFAULT_ATP);
    setTimeAllocations([]);
    setPromesList([]);
    setProtaList([]);
    setKktpList(DEFAULT_KKTP);
    setModulList(DEFAULT_MODUL_AJAR);
    setLkpdList(DEFAULT_LKPD);
    setAssessmentPlans(DEFAULT_ASSESSMENT_PLANS);
    setBahanAjarList(DEFAULT_BAHAN_AJAR);
    setMediaAjarList(DEFAULT_MEDIA_AJAR);
    setQuestions(DEFAULT_QUESTIONS);
    setTestSpecs([]);
    setQuestionAnalysisList([]);
    setDiagnosticAssessments([]);
    setAttendanceRecords(DEFAULT_ATTENDANCE);
    setGradeRecords(DEFAULT_GRADES);
    setActivityLogs(DEFAULT_ACTIVITY_LOGS);
    setSettings(DEFAULT_SETTINGS);
    setRubricList(DEFAULT_RUBRICS);
    setFormativeList(DEFAULT_FORMATIVE);
    setSummativeList(DEFAULT_SUMMATIVE);
    setP5List(DEFAULT_P5);
    setJournalList(DEFAULT_JOURNALS);
    setCaseList(DEFAULT_CASES);
    setRemedialList(DEFAULT_REMEDIAL);
    setSupervisionList(DEFAULT_SUPERVISION);
    setPkbList(DEFAULT_PKB);
    setChapterNotes(DEFAULT_CHAPTER_NOTES);
    setTaskAssignments(DEFAULT_TASK_ASSIGNMENTS);
    setChapterAssessments(DEFAULT_CHAPTER_ASSESSMENTS);
    addToast("info", "Reset Database", "Semua data telah dikembalikan ke standar awal Kurikulum Merdeka.");
  };

  const exportDatabaseJSON = () => db.exportFullBackup();

  const importDatabaseJSON = (jsonStr: string) => {
    const success = db.importBackup(jsonStr);
    if (success) {
      // Reload state from storage
      setSchoolProfile(db.get("school_profile", DEFAULT_SCHOOL_PROFILE));
      setTeacherProfile(db.get("teacher_profile", DEFAULT_TEACHER_PROFILE));
      setClasses(db.get("classes", DEFAULT_CLASSES));
      setStudents(db.get("students", DEFAULT_STUDENTS));
      setSubjects(db.get("subjects", DEFAULT_SUBJECTS));
      setSchedules(db.get("schedules", DEFAULT_SCHEDULES));
      setCalendarEvents(db.get("calendar", DEFAULT_CALENDAR_EVENTS));
      setCpList(db.get("cp", DEFAULT_CP));
      setAtpList(db.get("atp", DEFAULT_ATP));
      setTimeAllocations(db.get("time_allocations", []));
      setPromesList(db.get("promes", []));
      setProtaList(db.get("prota", []));
      setKktpList(db.get("kktp", DEFAULT_KKTP));
      setModulList(db.get("modul_ajar", DEFAULT_MODUL_AJAR));
      setLkpdList(db.get("lkpd", DEFAULT_LKPD));
      setAssessmentPlans(db.get("assessment_plans", DEFAULT_ASSESSMENT_PLANS));
      setBahanAjarList(db.get("bahan_ajar", DEFAULT_BAHAN_AJAR));
      setMediaAjarList(db.get("media_ajar", DEFAULT_MEDIA_AJAR));
      setQuestions(db.get("questions", DEFAULT_QUESTIONS));
      setTestSpecs(db.get("test_specs", []));
      setQuestionAnalysisList(db.get("question_analysis", []));
      setDiagnosticAssessments(db.get("diagnostic", []));
      setAttendanceRecords(db.get("attendance", DEFAULT_ATTENDANCE));
      setGradeRecords(db.get("grades", DEFAULT_GRADES));
      setRubricList(db.get("rubrics", DEFAULT_RUBRICS));
      setFormativeList(db.get("formative", DEFAULT_FORMATIVE));
      setSummativeList(db.get("summative", DEFAULT_SUMMATIVE));
      setP5List(db.get("p5", DEFAULT_P5));
      setJournalList(db.get("journals", DEFAULT_JOURNALS));
      setCaseList(db.get("cases", DEFAULT_CASES));
      setRemedialList(db.get("remedials", DEFAULT_REMEDIAL));
      setSupervisionList(db.get("supervisions", DEFAULT_SUPERVISION));
      setPkbList(db.get("pkb", DEFAULT_PKB));
      setChapterNotes(db.get("chapter_notes", DEFAULT_CHAPTER_NOTES));
      setTaskAssignments(db.get("task_assignments", DEFAULT_TASK_ASSIGNMENTS));
      setChapterAssessments(db.get("chapter_assessments", DEFAULT_CHAPTER_ASSESSMENTS));
      addToast("success", "Restore Selesai", "Data berhasil diimpor dan dimuat ke sistem.");
      return true;
    }
    addToast("error", "Gagal Restore", "Format data JSON backup tidak valid.");
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        sidebarOpen,
        setSidebarOpen,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        isLocked,
        setIsLocked,
        unlockWithPin,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        previewDoc,
        setPreviewDoc,
        isGasDeployOpen,
        setIsGasDeployOpen,
        toasts,
        addToast,
        removeToast,
        activeClassId,
        setActiveClassId,
        activeSubjectId,
        setActiveSubjectId,
        selectedClassId: activeClassId,
        setSelectedClassId: setActiveClassId,
        selectedSubjectId: activeSubjectId,
        setSelectedSubjectId: setActiveSubjectId,
        addActivityLog,
        settings,
        updateSettings,
        schoolProfile,
        saveSchoolProfile,
        teacherProfile,
        saveTeacherProfile,
        classes,
        saveClass,
        deleteClass,
        students,
        saveStudent,
        deleteStudent,
        bulkImportStudents,
        subjects,
        saveSubject,
        deleteSubject,
        schedules,
        saveSchedule,
        deleteSchedule,
        calendarEvents,
        saveCalendarEvent,
        deleteCalendarEvent,
        cpList,
        saveCP,
        deleteCP,
        atpList,
        saveATP,
        deleteATP,
        timeAllocations,
        saveTimeAllocation,
        promesList,
        savePromes,
        protaList,
        saveProta,
        kktpList,
        saveKKTP,
        deleteKKTP,
        modulList,
        saveModul,
        deleteModul,
        duplicateModul,
        lkpdList,
        saveLKPD,
        deleteLKPD,
        duplicateLKPD,
        assessmentPlans,
        saveAssessmentPlan,
        deleteAssessmentPlan,
        bahanAjarList,
        saveBahanAjar,
        deleteBahanAjar,
        mediaAjarList,
        saveMediaAjar,
        deleteMediaAjar,
        questions,
        saveQuestion,
        deleteQuestion,
        testSpecs,
        saveTestSpec,
        deleteTestSpec,
        questionAnalysisList,
        saveQuestionAnalysis,
        deleteQuestionAnalysis,
        diagnosticAssessments,
        saveDiagnosticAssessment,
        deleteDiagnosticAssessment,
        diagnosticList: diagnosticAssessments,
        saveDiagnostic: saveDiagnosticAssessment,
        deleteDiagnostic: deleteDiagnosticAssessment,
        rubricList,
        saveRubric,
        deleteRubric,
        formativeList,
        saveFormative,
        deleteFormative,
        summativeList,
        saveSummative,
        deleteSummative,
        p5List,
        saveP5,
        deleteP5,
        journalList,
        saveJournal,
        deleteJournal,
        caseList,
        saveCaseRecord,
        deleteCaseRecord,
        remedialList,
        saveRemedial,
        deleteRemedial,
        supervisionList,
        saveSupervision,
        deleteSupervision,
        pkbList,
        savePKB,
        deletePKB,
        // Penilaian Tambahan
        chapterNotes,
        saveChapterNote,
        deleteChapterNote,
        taskAssignments,
        saveTaskAssignment,
        deleteTaskAssignment,
        chapterAssessments,
        saveChapterAssessment,
        deleteChapterAssessment,
        // Aliases
        modulAjarList: modulList,
        saveModulAjar: saveModul,
        deleteModulAjar: deleteModul,
        duplicateModulAjar: duplicateModul,
        teachingMaterials: bahanAjarList,
        saveTeachingMaterial: saveBahanAjar,
        deleteTeachingMaterial: deleteBahanAjar,
        teachingMedia: mediaAjarList,
        saveTeachingMedia: saveMediaAjar,
        deleteTeachingMedia: deleteMediaAjar,
        questionBank: questions,
        saveQuestionBank: saveQuestion,
        deleteQuestionBank: deleteQuestion,
        teachingJournals: journalList,
        saveTeachingJournal: saveJournal,
        deleteTeachingJournal: deleteJournal,
        caseRecords: caseList,
        saveCase: saveCaseRecord,
        deleteCase: deleteCaseRecord,
        remedialEnrichments: remedialList,
        supervisions: supervisionList,
        pkbRecords: pkbList,
        attendanceRecords,
        saveAttendance,
        gradeRecords,
        saveGrade,
        activityLogs,
        resetAllDataToDefault,
        exportDatabaseJSON,
        importDatabaseJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
