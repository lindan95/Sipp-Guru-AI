export interface SchoolProfile {
  id: string;
  name: string;
  npsn: string;
  nss: string;
  level: string; // SD, SMP, SMA, SMK
  status: "Negeri" | "Swasta";
  address: string;
  village: string;
  district: string;
  regency: string;
  province: string;
  postalCode: string;
  email: string;
  website: string;
  phone: string;
  headmasterName: string;
  headmasterNip: string;
  principalName?: string;
  principalNip?: string;
  vision: string;
  mission: string;
  logoKemdikbudUrl?: string;
  logoSchoolUrl?: string;
  logo1Url?: string;
  logo2Url?: string;
  updatedAt: string;
}

export interface TeacherProfile {
  id: string;
  fullName: string;
  name?: string;
  nip: string;
  nuptk: string;
  niPppk?: string;
  nrg?: string;
  birthPlace: string;
  birthDate: string;
  gender: "Laki-laki" | "Perempuan";
  lastEducation: string;
  rank: string; // Penata Tk.I / III/d dsb
  position: string; // Guru Mata Pelajaran / Wali Kelas
  mainSubject: string;
  phone: string;
  email: string;
  address: string;
  photoUrl?: string;
  signaturePlace: string; // Contoh: "Jakarta" atau "Bandung"
  updatedAt: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  gradeLevel: string; // 10, 11, 12 / 7, 8, 9 / 1-6
  phase: "Fase A" | "Fase B" | "Fase C" | "Fase D" | "Fase E" | "Fase F" | string;
  academicYear: string;
  homeroomTeacher: string;
  totalStudents: number;
}

export interface Student {
  id: string;
  classId: string;
  nis: string;
  nisn: string;
  name: string;
  gender: "L" | "P";
  phone?: string;
  email?: string;
  parentName?: string;
  status: "Aktif" | "Mutasi" | "Lulus";
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  phase: string;
  gradeLevel: string;
  hoursPerWeek: number; // JP per minggu
  kktpStandard: number; // Nilai ambang KKTP default misal 75
  kktpValue?: number;
}

export interface ScheduleItem {
  id: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu";
  startTime: string;
  endTime: string;
  classId: string;
  subjectId: string;
  room: string;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: "effective_day" | "holiday" | "exam" | "assessment" | "school_activity" | "semester_start" | "semester_end";
  startDate: string;
  endDate: string;
  semester: "1" | "2";
  academicYear: string;
  description?: string;
  isEffectiveDay: boolean;
}

// 9. Asesmen Diagnosis
export interface DiagnosticAssessment {
  id: string;
  classId: string;
  studentId?: string;
  learningStyle?: "Visual" | "Auditori" | "Kinestetik" | string;
  readinessLevel?: "Paham Sebagian" | "Siap" | "Mahir" | string;
  interest?: string;
  cognitiveScore?: number;
  notes?: string;
  date?: string;

  // Instrument / Test level fields (optional)
  title?: string;
  subjectId?: string;
  phase?: string;
  topic?: string;
  learningObjectives?: string;
  questionsCount?: number;
  questionTypes?: string[];
  questions?: DiagnosticQuestion[];
  resultsSummary?: string;
  createdAt?: string;
}

export interface DiagnosticQuestion {
  id: string;
  number: number;
  type: "Pilihan Ganda" | "Pilihan Ganda Kompleks" | "Benar/Salah" | "Menjodohkan" | "Isian" | "Uraian";
  question: string;
  options?: { key: string; text: string; isCorrect?: boolean }[];
  answerKey: string;
  rubricExplanation: string;
  category: "Non-Kognitif" | "Kognitif Prasyarat" | "Kognitif Materi";
}

// 9b. Analisis Diagnosis Siswa (AI-Powered)
export interface StudentDiagnosticAnalysis {
  id: string;
  classId: string;
  subjectId: string;
  academicYear?: string;
  semester?: "1" | "2" | "Ganjil" | "Genap" | string;
  topicOrElement?: string;
  date: string;
  totalStudents: number;
  assessedStudents: number;
  overview: {
    executiveSummary: string;
    readinessSummary: string;
    learningStyleSummary: string;
    interestSummary: string;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
  learningStyleDistribution: {
    visual: number;
    auditory: number;
    kinesthetic: number;
    pedagogicalImplication: string;
  };
  readinessLevels: {
    perluBimbinganCount: number;
    siapCount: number;
    mahirCount: number;
    pedagogicalImplication: string;
  };
  differentiationStrategies: {
    content: {
      perluBimbingan: string;
      siap: string;
      mahir: string;
    };
    process: {
      perluBimbingan: string;
      siap: string;
      mahir: string;
    };
    product: {
      perluBimbingan: string;
      siap: string;
      mahir: string;
    };
    learningEnvironment: string;
  };
  groupingRecommendations: {
    groupType: string; // e.g. "Kelompok Homogen (Tingkat Kesiapan)" | "Kelompok Heterogen (Tutor Sebaya)" | "Kelompok Minat Proyek"
    description: string;
    groups: {
      name: string;
      targetLevelOrStyle: string;
      studentNames: string[];
      strategy: string;
    }[];
  }[];
  individualStudentProfiles: {
    studentId: string;
    studentName: string;
    learningStyle: string;
    readinessLevel: string;
    cognitiveScore: number;
    interest: string;
    aiRecommendation: string;
    interventionCategory: "Intervensi Khusus" | "Reguler / Penguatan" | "Pengayaan";
  }[];
  actionPlanForModulAjar: string[];
  rawAiResponse?: string;
  createdAt: string;
}

// 10. CP (Capaian Pembelajaran)
export interface CapaianPembelajaran {
  id: string;
  subjectId: string;
  phase: string;
  element: string; // e.g. "Pemahaman Konsep", "Keterampilan Proses"
  description: string;
  academicYear: string;
  createdAt: string;
}

// 11. ATP (Alur Tujuan Pembelajaran)
export interface AlurTujuanPembelajaran {
  id: string;
  cpId?: string;
  subjectId: string;
  phase: string;
  element: string;
  learningObjective: string; // TP
  topic: string;
  allocatedHours: number; // JP
  orderNumber: number;
  learningFlowSummary?: string;
  createdAt: string;
}

// 12. Alokasi Waktu
export interface TimeAllocation {
  id: string;
  subjectId: string;
  classId: string;
  academicYear: string;
  semester: "1" | "2";
  totalEffectiveWeeks: number;
  hoursPerWeek: number;
  totalAllocatedHours: number;
  breakdown: {
    topic: string;
    tp: string;
    allocatedJP: number;
    meetingsCount: number;
  }[];
  createdAt: string;
}

// 13. Program Semester (Promes)
export interface ProgramSemester {
  id: string;
  subjectId: string;
  classId: string;
  academicYear: string;
  semester: "1" | "2";
  effectiveWeeks: number;
  items: {
    tp: string;
    topic: string;
    allocatedJP: number;
    monthDistribution: { [monthKey: string]: number[] }; // month -> week array [1,2,3,4]
  }[];
  createdAt: string;
}

// 14. Program Tahunan (Prota)
export interface ProgramTahunan {
  id: string;
  subjectId: string;
  classId: string;
  academicYear: string;
  semester1Hours: number;
  semester2Hours: number;
  totalHours: number;
  items: {
    semester: "1" | "2";
    element: string;
    tp: string;
    topic: string;
    allocatedJP: number;
  }[];
  createdAt: string;
}

// 15. KKTP
export interface KKTPItem {
  id: string;
  subjectId: string;
  classId: string;
  phase: string;
  learningObjective: string;
  indicators: string[];
  criteriaType: "Rubrik" | "Interval Nilai" | "Deskripsi Kriteria";
  intervals: {
    label: string; // "Belum Mencapai (0-60)", "Cukup (61-75)", "Baik (76-85)", "Sangat Baik (86-100)"
    min: number;
    max: number;
    description: string;
    followUp: string;
  }[];
  createdAt: string;
}

// 16. Modul Ajar / RPP Pembelajaran Mendalam (Deep Learning)
export interface ModulAjar {
  id: string;
  title: string;
  subjectId: string;
  classId: string;
  phase: string;
  duration?: string;
  allocatedHours?: string; // e.g. "14 JP (14 × 45 menit) / 5 kali Pertemuan"
  meetingCount?: string; // e.g. "5 kali Pertemuan"
  tahunPenyusunan?: string; // e.g. "2026/2027"
  semester?: string; // e.g. "Ganjil" | "Genap"
  subTopik?: string; // e.g. "Hakikat Fisika, Metode Ilmiah, Keselamatan Kerja di Laboratorium, & Peran Fisika dalam Kehidupan"

  // 1. IDENTIFIKASI
  kesiapanMuridList?: string[];
  identifikasiPesertaDidik?: string;
  karakteristikMateriList?: string[];
  identifikasiMateri?: string;
  dimensiProfilLulusan?: string[]; // 8 Dimensi Profil Lulusan
  dimensiProfilLulusanDetail?: { nama: string; deskripsi: string; }[];
  // Legacy / PPP fallbacks
  profilPelajarPancasila?: string[];
  pancasilaProfile?: string[];
  initialCompetency?: string;
  targetPesertaDidik?: string;
  studentTarget?: string;

  // 2. DESAIN PEMBELAJARAN
  capaianPembelajaran?: string;
  lintasDisiplinIlmu?: string;
  tujuanPembelajaran?: string[];
  learningObjectives?: string[];
  topikPembelajaran?: string;
  praktikPedagogis?: string; // e.g. "Inquiry Learning dan Discovery Learning"
  pendekatan?: string; // e.g. "Contextual Teaching and Learning (CTL), diferensiasi"
  metodePembelajaran?: string; // e.g. "Observasi, diskusi kelompok, simulasi, dan presentasi"
  model?: string;
  learningModel?: string;
  learningMethod?: string[];
  kemitraanPembelajaran?: string;
  lingkunganPembelajaran?: string;
  lingkunganPembelajaranList?: string[];
  pemanfaatanDigital?: string;
  pemanfaatanDigitalList?: { kategori: string; detail: string; }[];
  saranaPrasarana?: string;
  facilities?: string;
  pemahamanBermakna?: string;
  meaningfulUnderstanding?: string;
  pertanyaanPemantik?: string[];
  triggerQuestions?: string[];

  // 3. PENGALAMAN BELAJAR (Langkah-Langkah: Berkesadaran, Bermakna, Menggembirakan)
  kegiatanAwal?: string;
  kegiatanPendahuluanSteps?: string[];
  prinsipKegiatanAwal?: string;
  asesmenAwalUrl?: string;
  kegiatanPendahuluan?: string[];

  // INTI: Pertemuan Breakdown (Memahami, Mengaplikasi, Merefleksi)
  kegiatanIntiPertemuan?: {
    pertemuan: string; // e.g. "Pertemuan 1: Hakikat Fisika" or "Pertemuan 2 & 3: Metode Ilmiah"
    topik?: string;
    steps: {
      no: number;
      judul: string; // e.g. "Stimulasi & Berkesadaran", "Identifikasi Masalah (Memahami)", etc.
      deskripsi: string;
      prinsip?: string; // "Berkesadaran" | "Memahami" | "Mengaplikasi" | "Bermakna" | "Menggembirakan" | string;
    }[];
  }[];

  pengalamanMemahami?: string;
  prinsipMemahami?: string;
  pengalamanMengaplikasi?: string;
  prinsipMengaplikasi?: string;
  pengalamanMerefleksi?: string;
  prinsipMerefleksi?: string;
  kegiatanInti?: string[];

  kegiatanPenutup?: string;
  kegiatanPenutupSteps?: string[];
  prinsipKegiatanPenutup?: string;
  kegiatanPenutupList?: string[];
  asesmenAkhirUrl?: string;

  // 4. ASESMEN PEMBELAJARAN
  asesmenAwal?: string;
  asesmenProses?: string;
  asesmenAkhir?: string;
  asesmenTable?: {
    awal: { jenis: string; instrumen: string; deskripsi: string; };
    proses: { jenis: string; instrumen: string; deskripsi: string; };
    akhir: { jenis: string; instrumen: string; deskripsi: string; };
  };
  asesmenFormatif?: string;
  asesmenSumatif?: string;
  assessmentPlan?: {
    diagnostic: string;
    formative: string;
    summative: string;
  };

  // 5. REFLEKSI
  refleksiMuridTable?: {
    no: number;
    aspek: string;
    refleksi: string;
    jawaban?: string;
  }[];
  refleksiGuruTable?: {
    no: number;
    aspek: string;
    refleksi: string;
    jawaban?: string;
  }[];
  refleksiGuru?: string;
  refleksiSiswa?: string;
  teacherReflection?: string[];
  studentReflection?: string[];

  // 6. REMEDIAL & PENGAYAAN
  remedialText?: string;
  pengayaanText?: string;
  remedial?: string;
  enrichment?: string;
  diferensiasi?: string;

  // 7. GLOSARIUM
  glosariumItems?: {
    istilah: string;
    definisi: string;
  }[];
  glosarium?: string;

  // 8. DAFTAR PUSTAKA
  daftarPustakaList?: string[];
  daftarPustaka?: string;
  bahanBacaan?: string;
  learningSources?: string[];
  lampiranLKPD?: string;

  // 9. LAMPIRAN TAUTAN
  lampiranLinks?: {
    lkm?: string;
    instrumenPenilaian?: string;
    bahanAjar?: string;
    mediaAjar?: string;
  };

  // 10. TANDA TANGAN & PENGESAHAN
  titimangsa?: {
    tempat?: string;
    tanggal?: string;
    kepalaSekolahNama?: string;
    kepalaSekolahNip?: string;
    guruNama?: string;
    guruNip?: string;
    guruJabatan?: string;
  };

  createdAt: string;
}

// 17. LKPD (Lembar Kerja Peserta Didik)
export interface LKPD {
  id: string;
  title: string;
  subjectId: string;
  classId?: string;
  phase?: string;
  topic?: string;
  learningObjective?: string;
  duration?: string;
  groupType?: "Individu" | "Kelompok" | string;
  instructions?: string[];
  stimulus?: string;
  summaryMaterial?: string;
  activities?: {
    title: string;
    steps: string[];
  }[];
  tasks?: string[];
  questions?: {
    number: number;
    question: string;
    spaceForAnswer: boolean;
  }[];
  rubricCriteria?: any;
  reflection?: string;
  createdAt: string;
}

// 18. Program Penilaian
export interface AssessmentPlan {
  id: string;
  subjectId: string;
  classId?: string;
  name?: string;
  title?: string;
  technique?: string;
  form?: string;
  timing?: string;
  instrument?: string;
  kktpValue?: number;
  academicYear?: string;
  semester?: "1" | "2" | string;
  plans?: {
    type: "Diagnostik" | "Formatif" | "Sumatif" | "Sikap" | "Pengetahuan" | "Keterampilan" | string;
    technique: string; // Tes Tulis, Observasi, Unjuk Kerja, Portofolio
    instrument: string; // Soal PG, Rubrik, Lembar Pengamatan
    topic: string;
    weight: number;
    timing: string;
  }[];
  createdAt: string;
}

// 19. Bahan Ajar
export interface BahanAjar {
  id: string;
  title: string;
  subjectId: string;
  classId?: string;
  phase?: string;
  topic?: string;
  type?: string;
  learningObjective?: string;
  summary?: string;
  content?: string;
  fullContent?: string;
  source?: string;
  fileUrl?: string;
  examples?: string[];
  practiceProblems?: string[];
  glossary?: { term: string; definition: string }[];
  conclusion?: string;
  createdAt: string;
}

// 20. Media Ajar
export interface MediaAjar {
  id: string;
  title: string;
  subjectId: string;
  classId?: string;
  topic?: string;
  type?: string;
  mediaType?: "Video YouTube" | "Presentasi Canva/PPT" | "Website/Link" | "PDF/E-Book" | "Gambar/Infografis" | "Simulasi/Game" | string;
  url?: string;
  urlOrFile?: string;
  description?: string;
  createdAt: string;
}

// 21. Bank Soal
export interface QuestionBankItem {
  id: string;
  subjectId: string;
  classId?: string;
  phase: string;
  topic: string;
  learningObjective: string;
  questionType: "Pilihan Ganda" | "Pilihan Ganda Kompleks" | "Benar/Salah" | "Menjodohkan" | "Isian" | "Uraian";
  difficulty: "Mudah (LOTS)" | "Sedang (MOTS)" | "Sukar (HOTS)";
  cognitiveLevel: "C1" | "C2" | "C3" | "C4" | "C5" | "C6";
  indicator: string;
  questionText: string;
  options?: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  createdAt: string;
}

// 23. Kisi-Kisi
export interface TestSpecification {
  id: string;
  title: string;
  subjectId: string;
  classId: string;
  phase: string;
  academicYear: string;
  semester: "1" | "2";
  testType: "Sumatif Tengah Semester" | "Sumatif Akhir Semester" | "Ulangan Harian" | "Asesmen Sumatif Lingkup Materi";
  totalQuestions: number;
  items: {
    number: number;
    tp: string;
    topic: string;
    indicator: string;
    cognitiveLevel: string;
    questionType: string;
    scoreWeight: number;
  }[];
  createdAt: string;
}

// 24. Analisis Soal
export interface QuestionItemAnalysis {
  id: string;
  testTitle: string;
  subjectId: string;
  classId: string;
  totalStudents: number;
  analyzedQuestions: {
    questionNumber: number;
    correctCount: number;
    wrongCount: number;
    difficultyIndex: number; // Tingkat Kesukaran (P) 0.0 - 1.0
    difficultyCategory: "Sangat Sukar" | "Sukar" | "Sedang" | "Mudah" | "Sangat Mudah";
    discriminationIndex: number; // Daya Pembeda (D) -1.0 s.d +1.0
    discriminationCategory: "Sangat Baik" | "Baik" | "Cukup" | "Jelek";
    distractorValidity: "Berfungsi Baik" | "Perlu Revisi Pengecoh" | "Tidak Efektif";
    recommendation: "Sangat Baik" | "Baik" | "Perlu Revisi" | "Tidak Layak";
  }[];
  createdAt: string;
}

// 26. Absensi Siswa
export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  classId: string;
  subjectId?: string;
  entries: {
    studentId: string;
    status: "H" | "S" | "I" | "A" | "T" | "B"; // Hadir, Sakit, Izin, Alpa, Terlambat, Bolos
    note?: string;
  }[];
  createdAt: string;
}

// 27. Penilaian Siswa
export interface GradeRecord {
  id: string;
  date: string;
  classId: string;
  subjectId: string;
  assessmentType: "Tugas" | "Formatif" | "Sumatif" | "Ulangan" | "Proyek" | "Praktik" | "Portofolio";
  topic: string;
  kktpStandard: number;
  scores: {
    studentId: string;
    score: number;
    note?: string;
  }[];
  createdAt: string;
}

// 30. Log Aktivitas
export interface ActivityLog {
  id: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

// App Settings & Single User Security
export interface AppSettings {
  isPinLocked: boolean;
  pinCode: string; // e.g. "1234"
  gasDeploymentUrl?: string;
  googleSheetsId?: string;
  googleDriveFolderId?: string;
  geminiApiKeyConfigured: boolean;
  aiSystemPrompt: string;
  aiModel: string;
  aiTemperature: number;
  darkMode: boolean;
  activeAcademicYear: string;
  activeSemester: "1" | "2";
}

// 31-36: Administrasi & Jurnal Guru
export interface CaseRecord {
  id: string;
  date: string;
  studentId: string;
  classId: string;
  incidentDescription: string;
  followUpAction: string;
  resultNotes: string;
  status: "Dalam Proses" | "Selesai";
  createdAt: string;
}

export interface TeachingJournalItem {
  id: string;
  date: string;
  classId: string;
  subjectId: string;
  timeSlot: string;
  topic: string;
  learningObjective: string;
  activities: string;
  attendanceSummary: string;
  classroomNotes: string;
  reflection: string;
  createdAt: string;
}

export interface PKBRecord {
  id: string;
  activityName: string;
  organizer: string;
  role: "Peserta" | "Narasumber" | "Fasilitator" | "Panitia";
  durationHours: number;
  startDate: string;
  endDate: string;
  certificateNumber?: string;
  certificateUrl?: string;
  impactSummary?: string;
  createdAt: string;
}

export interface RemedialEnrichmentItem {
  id: string;
  type: "Remedial" | "Pengayaan";
  studentId: string;
  classId: string;
  subjectId: string;
  topic: string;
  initialScore: number;
  activityForm: string;
  finalScore: number;
  status: string;
  date: string;
}

export interface SupervisionRecord {
  id: string;
  date: string;
  supervisorName: string;
  supervisorRole: string;
  aspectsObserved: string;
  findings: string;
  recommendations: string;
  score: number;
  predicate: string;
  createdAt: string;
}

// Asesmen Aliases & Types
export interface FormativeAssessment {
  id: string;
  date: string;
  classId: string;
  subjectId: string;
  studentId?: string;
  tpCode?: string;
  learningObjective?: string;
  activity?: string;
  technique?: "Observasi" | "Penilaian Diri" | "Penilaian Antarteman" | "Kuis Singkat" | "Tanya Jawab" | "Unjuk Kerja" | string;
  masteryLevel?: "Tuntas" | "Belum Tuntas" | "Perlu Bimbingan" | string;
  feedback?: string;
  score?: number;
  scores?: {
    studentId: string;
    score: number;
    notes?: string;
  }[];
}

export interface SummativeAssessment {
  id: string;
  title?: string;
  assessmentName?: string;
  classId: string;
  subjectId: string;
  studentId?: string;
  scopeTopic?: string;
  scopeType?: "Lingkup Materi" | "Akhir Semester" | string;
  score?: number;
  remedialScore?: number;
  finalScore?: number;
  status?: "Tuntas" | "Remedial" | string;
  isPass?: boolean;
  date?: string;
  scores?: {
    studentId: string;
    rawScore: number;
    finalScore: number;
    isPass: boolean;
  }[];
}

export interface P5Assessment {
  id: string;
  theme: string;
  projectName?: string;
  projectTitle?: string;
  classId: string;
  studentId?: string;
  dimension?: string;
  dimensions?: string[];
  element?: string;
  scoreScale?: "MB" | "SB" | "BSH" | "SAB" | string;
  description?: string;
  createdAt?: string;
  ratings?: {
    studentId: string;
    dimension: string;
    level: "MB" | "SB" | "BSH" | "SAB" | string;
  }[];
}

export interface RubricItem {
  id: string;
  title: string;
  subjectId: string;
  type: "Kinerja" | "Proyek" | "Portofolio" | "Presentasi" | "Produk";
  criteria: {
    aspect: string;
    weight: number;
    descriptors: {
      level: string;
      scoreRange: string;
      description: string;
    }[];
  }[];
  createdAt: string;
}

export type TeachingMaterial = BahanAjar;
export type LKPDItem = LKPD;
export type TeachingMedia = MediaAjar;
export type QuestionItem = QuestionBankItem;

// Penilaian Tambahan Administrasi & Presensi
export interface ChapterNoteStudentEntry {
  studentId: string;
  learningProgress: "Sangat Berkembang" | "Berkembang Sesuai Harapan" | "Mulai Berkembang" | "Perlu Bimbingan";
  attitudeObservation: string;
  notes: string;
  masteryScore: number; // 0 - 100
}

export interface ChapterNote {
  id: string;
  classId: string;
  subjectId: string;
  semester: "1" | "2" | "Ganjil" | "Genap";
  academicYear?: string;
  chapterNumber: number;
  chapterTitle: string;
  mainTopic: string;
  tpList: string[];
  entries: ChapterNoteStudentEntry[];
  teacherReflection: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskAssignmentStudentScore {
  studentId: string;
  score: number;
  submissionDate?: string;
  status: "Tepat Waktu" | "Terlambat" | "Belum Mengumpulkan";
  feedback?: string;
}

export interface TaskAssignment {
  id: string;
  classId: string;
  subjectId: string;
  semester: "1" | "2" | "Ganjil" | "Genap";
  academicYear?: string;
  chapterNumber: number;
  chapterTitle: string;
  taskNumber: number;
  title: string;
  taskType: "Individu" | "Kelompok" | "Proyek Mini" | "Portofolio" | "PR / Latihan";
  dueDate: string;
  maxScore: number;
  kktpStandard: number;
  instructions: string;
  scores: TaskAssignmentStudentScore[];
  createdAt: string;
  updatedAt?: string;
}

export interface ChapterAssessmentStudentScore {
  studentId: string;
  tpScores?: { [tpCode: string]: number };
  formativeScore?: number;
  testScore?: number;
  practiceScore?: number;
  finalChapterScore?: number;
  finalScore?: number;
  isPass?: boolean;
  tpAchieved?: string;
  tpNeedImprovement?: string;
  recommendedAction?: "Tuntas" | "Remedial" | "Pengayaan";
  descriptorNote?: string;
  remedialNotes?: string;
}

export type ChapterAssessmentStudentResult = ChapterAssessmentStudentScore;

export interface ChapterAssessment {
  id: string;
  classId: string;
  subjectId: string;
  semester: "1" | "2" | "Ganjil" | "Genap";
  academicYear?: string;
  chapterNumber: number;
  chapterTitle: string;
  assessmentType: "Formatif Akhir Bab" | "Sumatif Lingkup Materi (SLM)" | "Kuis Bab" | "Praktik Bab" | "Campuran" | string;
  kktpStandard?: number;
  kktpThreshold?: number;
  weightFormative?: number;
  weightTest?: number;
  weightPractice?: number;
  date?: string;
  assessmentDate?: string;
  tpBreakdown?: { tpCode: string; tpName: string; weight?: number }[];
  studentScores?: ChapterAssessmentStudentScore[];
  results?: ChapterAssessmentStudentScore[];
  generalAnalysis?: string;
  createdAt: string;
  updatedAt?: string;
}

