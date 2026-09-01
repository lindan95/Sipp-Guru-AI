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

const STORAGE_KEY_PREFIX = "sipp_guru_db_";

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  id: "sch-001",
  name: "SMA NEGERI 1 NUSANTARA",
  npsn: "20104567",
  nss: "301016001001",
  level: "SMA",
  status: "Negeri",
  address: "Jl. Pendidikan Karakter No. 45",
  village: "Merdeka Belajar",
  district: "Cilandak",
  regency: "Jakarta Selatan",
  province: "DKI Jakarta",
  postalCode: "12430",
  email: "info@sman1nusantara.sch.id",
  website: "https://sman1nusantara.sch.id",
  phone: "(021) 7501234",
  headmasterName: "Drs. H. Bambang Suryanto, M.Pd.",
  headmasterNip: "196803151993031004",
  vision: "Terwujudnya peserta didik yang beriman, cerdas, berkarakter Profil Pelajar Pancasila, unggul dalam IPTEK, dan berwawasan lingkungan global.",
  mission: "1. Menyelenggarakan pembelajaran berkualitas dan berpusat pada murid.\n2. Mengintegrasikan teknologi informasi dan komunikasi dalam seluruh proses pembelajaran.\n3. Membiasakan budaya bernalar kritis, kreatif, dan gotong royong.",
  logoKemdikbudUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/512px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png",
  logoSchoolUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80",
  logo1Url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg/512px-Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg.png",
  logo2Url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&auto=format&fit=crop&q=80",
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  id: "tch-001",
  fullName: "Sudirman Danasaputra, S.Kom., Gr.",
  nip: "199508122022211005",
  nuptk: "8451763665200003",
  niPppk: "199508122022211005",
  nrg: "2201089901",
  birthPlace: "Jakarta",
  birthDate: "1995-08-12",
  gender: "Laki-laki",
  lastEducation: "S1 Pendidikan Ilmu Komputer (Universitas Negeri Jakarta)",
  rank: "Penata Muda / IX (PPPK Guru Ahli Pertama)",
  position: "Guru Mata Pelajaran & Pembina Ekstrakurikuler Robotik",
  mainSubject: "Informatika",
  phone: "0812-9876-5432",
  email: "sudirmand1995@gmail.com",
  address: "Kompleks Guru Sejahtera Blok C No. 12, Jakarta",
  photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  signaturePlace: "Jakarta",
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_CLASSES: ClassRoom[] = [
  { id: "cls-10a", name: "X-A (Sepuluh A)", gradeLevel: "10", phase: "Fase E", academicYear: "2024/2025", homeroomTeacher: "Sudirman Danasaputra, S.Kom., Gr.", totalStudents: 32 },
  { id: "cls-10b", name: "X-B (Sepuluh B)", gradeLevel: "10", phase: "Fase E", academicYear: "2024/2025", homeroomTeacher: "Dra. Siti Aminah, M.Pd.", totalStudents: 30 },
  { id: "cls-11a", name: "XI-1 (Sebelas 1)", gradeLevel: "11", phase: "Fase F", academicYear: "2024/2025", homeroomTeacher: "Rudi Hartono, S.Pd.", totalStudents: 34 },
];

export const DEFAULT_STUDENTS: Student[] = [
  { id: "std-001", classId: "cls-10a", nis: "241001", nisn: "0071234501", name: "Achmad Fauzan", gender: "L", phone: "08121111001", status: "Aktif", parentName: "Fauzi" },
  { id: "std-002", classId: "cls-10a", nis: "241002", nisn: "0071234502", name: "Adelia Rahmawati", gender: "P", phone: "08121111002", status: "Aktif", parentName: "Rahmat" },
  { id: "std-003", classId: "cls-10a", nis: "241003", nisn: "0071234503", name: "Bagus Pratama", gender: "L", phone: "08121111003", status: "Aktif", parentName: "Bambang" },
  { id: "std-004", classId: "cls-10a", nis: "241004", nisn: "0071234504", name: "Clarissa Putri", gender: "P", phone: "08121111004", status: "Aktif", parentName: "Iwan" },
  { id: "std-005", classId: "cls-10a", nis: "241005", nisn: "0071234505", name: "Dimas Arya Wijaya", gender: "L", phone: "08121111005", status: "Aktif", parentName: "Wijaya" },
  { id: "std-006", classId: "cls-10a", nis: "241006", nisn: "0071234506", name: "Eka Nurul Fadilah", gender: "P", phone: "08121111006", status: "Aktif", parentName: "Fadli" },
  { id: "std-007", classId: "cls-10a", nis: "241007", nisn: "0071234507", name: "Farhan Maulana", gender: "L", phone: "08121111007", status: "Aktif", parentName: "Maulana" },
  { id: "std-008", classId: "cls-10a", nis: "241008", nisn: "0071234508", name: "Gita Permata", gender: "P", phone: "08121111008", status: "Aktif", parentName: "Permadi" },
  { id: "std-009", classId: "cls-10b", nis: "241009", nisn: "0071234509", name: "Hafiz Ridwan", gender: "L", phone: "08121111009", status: "Aktif", parentName: "Ridwan" },
  { id: "std-010", classId: "cls-10b", nis: "241010", nisn: "0071234510", name: "Indah Cahyani", gender: "P", phone: "08121111010", status: "Aktif", parentName: "Cahyo" },
];

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: "sbj-inf", name: "Informatika", code: "INF-10", phase: "Fase E", gradeLevel: "10", hoursPerWeek: 2, kktpStandard: 75 },
  { id: "sbj-mat", name: "Matematika", code: "MAT-10", phase: "Fase E", gradeLevel: "10", hoursPerWeek: 4, kktpStandard: 70 },
  { id: "sbj-bin", name: "Bahasa Indonesia", code: "BIN-10", phase: "Fase E", gradeLevel: "10", hoursPerWeek: 3, kktpStandard: 75 },
];

export const DEFAULT_SCHEDULES: ScheduleItem[] = [
  { id: "schd-1", day: "Senin", startTime: "07:30", endTime: "09:00", classId: "cls-10a", subjectId: "sbj-inf", room: "Lab Komputer 1", notes: "Membawa modul praktikum" },
  { id: "schd-2", day: "Selasa", startTime: "09:15", endTime: "10:45", classId: "cls-10b", subjectId: "sbj-inf", room: "Lab Komputer 2" },
  { id: "schd-3", day: "Kamis", startTime: "10:45", endTime: "12:15", classId: "cls-11a", subjectId: "sbj-inf", room: "Lab Komputer 1" },
];

export const DEFAULT_CALENDAR_EVENTS: CalendarEvent[] = [
  // Semester 1 (Ganjil 2024)
  { id: "cal-1", title: "Awal Semester Ganjil TA 2024/2025", type: "semester_start", startDate: "2024-07-15", endDate: "2024-07-15", semester: "1", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-2", title: "Masa Pengenalan Lingkungan Sekolah (MPLS)", type: "school_activity", startDate: "2024-07-15", endDate: "2024-07-17", semester: "1", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-3", title: "Hari Kemerdekaan Republik Indonesia Ke-79", type: "holiday", startDate: "2024-08-17", endDate: "2024-08-17", semester: "1", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-4", title: "Maulid Nabi Muhammad SAW", type: "holiday", startDate: "2024-09-16", endDate: "2024-09-16", semester: "1", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-5", title: "Asesmen Sumatif Tengah Semester (ASTS) Ganjil", type: "exam", startDate: "2024-09-23", endDate: "2024-09-27", semester: "1", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-6", title: "Asesmen Sumatif Akhir Semester (ASAS) Ganjil", type: "exam", startDate: "2024-12-02", endDate: "2024-12-10", semester: "1", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-7", title: "Pengolahan Nilai & Rapat Pleno Rapor Ganjil", type: "school_activity", startDate: "2024-12-16", endDate: "2024-12-19", semester: "1", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-8", title: "Pembagian Buku Laporan Hasil Belajar (Rapor Ganjil)", type: "school_activity", startDate: "2024-12-20", endDate: "2024-12-20", semester: "1", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-9", title: "Libur Akhir Semester Ganjil & Libur Hari Raya Natal", type: "holiday", startDate: "2024-12-23", endDate: "2025-01-04", semester: "1", academicYear: "2024/2025", isEffectiveDay: false },
  
  // Semester 2 (Genap 2025)
  { id: "cal-10", title: "Awal Semester Genap TA 2024/2025", type: "semester_start", startDate: "2025-01-06", endDate: "2025-01-06", semester: "2", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-11", title: "Isra Mi'raj Nabi Muhammad SAW", type: "holiday", startDate: "2025-01-27", endDate: "2025-01-27", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-12", title: "Tahun Baru Imlek 2576 Kongzili", type: "holiday", startDate: "2025-01-29", endDate: "2025-01-29", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-13", title: "Asesmen Sumatif Tengah Semester (ASTS) Genap", type: "exam", startDate: "2025-03-10", endDate: "2025-03-14", semester: "2", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-14", title: "Hari Suci Nyepi Tahun Baru Saka 1947", type: "holiday", startDate: "2025-03-29", endDate: "2025-03-29", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-15", title: "Libur Hari Raya Idul Fitri 1446 H & Cuti Bersama", type: "holiday", startDate: "2025-03-31", endDate: "2025-04-08", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-16", title: "Wafat Yesus Kristus & Paskah", type: "holiday", startDate: "2025-04-18", endDate: "2025-04-20", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-17", title: "Hari Buruh Internasional", type: "holiday", startDate: "2025-05-01", endDate: "2025-05-01", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-18", title: "Hari Raya Waisak 2569 BE", type: "holiday", startDate: "2025-05-12", endDate: "2025-05-12", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-19", title: "Kenaikan Yesus Kristus", type: "holiday", startDate: "2025-05-29", endDate: "2025-05-29", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-20", title: "Hari Lahir Pancasila", type: "holiday", startDate: "2025-06-01", endDate: "2025-06-01", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-21", title: "Hari Raya Idul Adha 1446 H", type: "holiday", startDate: "2025-06-06", endDate: "2025-06-06", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
  { id: "cal-22", title: "Asesmen Sumatif Akhir Tahun (ASAT / ASAS Genap)", type: "exam", startDate: "2025-06-09", endDate: "2025-06-17", semester: "2", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-23", title: "Pembagian Rapor Semester Genap (Kenaikan Kelas)", type: "school_activity", startDate: "2025-06-20", endDate: "2025-06-20", semester: "2", academicYear: "2024/2025", isEffectiveDay: true },
  { id: "cal-24", title: "Libur Akhir Tahun Pelajaran", type: "holiday", startDate: "2025-06-23", endDate: "2025-07-12", semester: "2", academicYear: "2024/2025", isEffectiveDay: false },
];

export const DEFAULT_SETTINGS: AppSettings = {
  isPinLocked: false,
  pinCode: "1234",
  gasDeploymentUrl: "",
  googleSheetsId: "",
  googleDriveFolderId: "",
  geminiApiKeyConfigured: true,
  aiSystemPrompt: "Anda adalah AI Guru Assistant profesional untuk guru di Indonesia yang merancang perangkat pembelajaran berbasis Kurikulum Merdeka dan Kurikulum Nasional. Berikan respons terstruktur, rapi, formal, kontekstual, dan siap pakai.",
  aiModel: "gemini-3.7-flash",
  aiTemperature: 0.7,
  darkMode: false,
  activeAcademicYear: "2024/2025",
  activeSemester: "1",
};

export const DEFAULT_CP: CapaianPembelajaran[] = [
  {
    id: "cp-001",
    subjectId: "sbj-inf",
    phase: "Fase E",
    element: "Berpikir Komputasional (BK)",
    description: "Pada akhir fase E, peserta didik mampu menerapkan strategi algoritmik standar untuk memecahkan masalah sehari-hari dan menghasilkan beberapa solusi alternatif menggunakan struktur data list, stack, queue, dan tree.",
    academicYear: "2024/2025",
    createdAt: new Date().toISOString(),
  },
  {
    id: "cp-002",
    subjectId: "sbj-inf",
    phase: "Fase E",
    element: "Algoritma dan Pemrograman (AP)",
    description: "Pada akhir fase E, peserta didik mampu merancang dan mengimplementasikan program prosedural modular yang mengandung struktur sekuensial, percabangan, perulangan, dan fungsi dalam bahasa pemrograman tekstual.",
    academicYear: "2024/2025",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_ATP: AlurTujuanPembelajaran[] = [
  {
    id: "atp-001",
    cpId: "cp-001",
    subjectId: "sbj-inf",
    phase: "Fase E",
    element: "Berpikir Komputasional (BK)",
    learningObjective: "Menjelaskan konsep abstraksi, dekomposisi, pengenalan pola, dan perancangan algoritma dalam pemecahan masalah.",
    topic: "Fondasi Berpikir Komputasional & Optimasi",
    allocatedHours: 4,
    orderNumber: 1,
    learningFlowSummary: "Eksplorasi konsep studi kasus kehidupan sehari-hari, simulasi logika.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "atp-002",
    cpId: "cp-001",
    subjectId: "sbj-inf",
    phase: "Fase E",
    element: "Berpikir Komputasional (BK)",
    learningObjective: "Menerapkan struktur data Stack (Tumpukan) dan Queue (Antrean) dalam simulasi proses komputasi.",
    topic: "Struktur Data Linier: Stack & Queue",
    allocatedHours: 6,
    orderNumber: 2,
    learningFlowSummary: "Praktik visualisasi operasi Push, Pop, Enqueue, Dequeue dan studi kasus antrean printer/undo-redo.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "atp-003",
    cpId: "cp-002",
    subjectId: "sbj-inf",
    phase: "Fase E",
    element: "Algoritma dan Pemrograman (AP)",
    learningObjective: "Menulis kode program Python dasar menggunakan tipe data, operator, variabel, dan percabangan (if-else).",
    topic: "Dasar Pemrograman Python & Logika Percabangan",
    allocatedHours: 8,
    orderNumber: 3,
    learningFlowSummary: "Hands-on coding di Lab Komputer, pemecahan tantangan logika interaktif.",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_MODUL_AJAR: ModulAjar[] = [
  {
    id: "mod-001",
    title: "Hakikat Fisika & Metode Ilmiah",
    subTopik: "Hakikat Fisika, Metode Ilmiah, Keselamatan Kerja di Laboratorium, & Peran Fisika dalam Kehidupan",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "E",
    semester: "Ganjil",
    tahunPenyusunan: "2026/2027",
    duration: "14 JP (14 × 45 menit) / 5 kali Pertemuan",
    allocatedHours: "14 JP (14 × 45 menit) / 5 kali Pertemuan",
    meetingCount: "5 kali Pertemuan",

    // IDENTITAS
    topikPembelajaran: "Hakikat Fisika & Metode Ilmiah",

    // 1. IDENTIFIKASI
    kesiapanMuridList: [
      "Murid telah mempelajari konsep IPA terpadu di tingkat SMP.",
      "Murid memiliki rasa ingin tahu terhadap fenomena alam di sekitarnya.",
      "Sebagian besar murid telah terbiasa menggunakan perangkat digital (HP/Laptop).",
      "Murid membutuhkan pemahaman dasar mengenai prosedur keamanan sebelum melakukan praktikum di Laboratorium."
    ],
    identifikasiPesertaDidik: "Murid telah mempelajari konsep IPA terpadu di tingkat SMP. Murid memiliki rasa ingin tahu terhadap fenomena alam di sekitarnya. Sebagian besar murid telah terbiasa menggunakan perangkat digital (HP/Laptop). Murid membutuhkan pemahaman dasar mengenai prosedur keamanan sebelum melakukan praktikum di Laboratorium.",
    
    karakteristikMateriList: [
      "Materi ini bersifat pengetahuan dasar (fondasi) yang mendasari seluruh pembelajaran fisika.",
      "Materi mengombinasikan aspek kognitif (hakikat fisika) dan psikomotorik (metode ilmiah dan keselamatan kerja).",
      "Materi sangat relevan dengan etika ilmiah dan tanggung jawab terhadap lingkungan serta ketuhanan."
    ],
    identifikasiMateri: "Materi ini bersifat pengetahuan dasar (fondasi) yang mendasari seluruh pembelajaran fisika. Materi mengombinasikan aspek kognitif (hakikat fisika) dan psikomotorik (metode ilmiah dan keselamatan kerja). Materi sangat relevan dengan etika ilmiah dan tanggung jawab terhadap lingkungan serta ketuhanan.",

    dimensiProfilLulusan: [
      "Keimanan dan Ketakwaan terhadap Tuhan YME",
      "Penalaran Kritis",
      "Kolaborasi",
      "Kemandirian",
      "Komunikasi"
    ],
    dimensiProfilLulusanDetail: [
      {
        nama: "Keimanan dan Ketakwaan terhadap Tuhan YME",
        deskripsi: "Murid menyadari keteraturan alam sebagai ciptaan Tuhan melalui pengamatan hakikat fisika."
      },
      {
        nama: "Penalaran Kritis",
        deskripsi: "Murid mampu menganalisis fenomena alam menggunakan langkah-langkah metode ilmiah yang sistematis."
      },
      {
        nama: "Kolaborasi",
        deskripsi: "Murid bekerja sama dalam kelompok saat melakukan observasi dan diskusi mengenai peran fisika."
      },
      {
        nama: "Kemandirian",
        deskripsi: "Murid bertanggung jawab atas keselamatan diri dan alat saat berada di Laboratorium."
      },
      {
        nama: "Komunikasi",
        deskripsi: "Murid menyampaikan hasil pengamatan dan analisis peran fisika secara lisan maupun tertulis."
      }
    ],

    // 2. DESAIN PEMBELAJARAN
    capaianPembelajaran: "Pada akhir fase E, murid memiliki kemampuan untuk menggunakan sistem pengukuran dalam kerja ilmiah; menganalisis pemanfaatan energi alternatif untuk mengatasi permasalahan ketersediaan energi; dan menerapkan konsep IPA Fisika untuk mengatasi permasalahan berkaitan dengan perubahan iklim.",
    tujuanPembelajaran: [
      "Murid dapat mendeskripsikan hakikat fisika (sebagai produk, proses, dan sikap).",
      "Murid dapat mendeskripsikan dan menerapkan langkah-langkah metode ilmiah.",
      "Murid dapat mendeskripsikan prosedur keselamatan kerja di Laboratorium.",
      "Murid dapat menjelaskan peran fisika dalam berbagai bidang kehidupan."
    ],
    praktikPedagogis: "Inquiry Learning dan Discovery Learning",
    pendekatan: "Contextual Teaching and Learning (CTL), diferensiasi",
    metodePembelajaran: "Observasi, diskusi kelompok, simulasi, dan presentasi",
    model: "Inquiry Learning & Discovery Learning",
    
    lingkunganPembelajaranList: [
      "Ruang kelas dan laboratorium fisika.",
      "Lingkungan sekitar sekolah untuk observasi fenomena.",
      "Media berupa proyektor, poster simbol bahaya, alat laboratorium dasar."
    ],
    lingkunganPembelajaran: "Ruang kelas dan laboratorium fisika, lingkungan sekitar sekolah untuk observasi fenomena, media berupa proyektor, poster simbol bahaya, alat laboratorium dasar.",

    pemanfaatanDigitalList: [
      { kategori: "Platform Asesmen", detail: "Wayground atau Kahoot." },
      { kategori: "Sumber Belajar", detail: "Video YouTube tentang sejarah fisika dan kecelakaan kerja di Laboratorium." },
      { kategori: "Virtual Lab", detail: "Simulasi sederhana atau video demonstrasi prosedur laboratorium." }
    ],
    pemanfaatanDigital: "Platform Asesmen: Wayground atau Kahoot. Sumber Belajar: Video YouTube tentang sejarah fisika dan kecelakaan kerja di Laboratorium. Virtual Lab: Simulasi sederhana atau video demonstrasi prosedur laboratorium.",
    saranaPrasarana: "Proyektor, poster simbol bahaya, alat laboratorium dasar, HP/Laptop",

    // 3. PENGALAMAN BELAJAR
    kegiatanPendahuluanSteps: [
      "Guru membuka kegiatan pembelajaran dengan mengucapkan salam dan menanyakan kabar murid.",
      "Guru mengajak murid untuk berdoa sebelum memulai pembelajaran.",
      "Guru mengecek kehadiran murid.",
      "Guru bersama dengan murid menyanyikan salah satu lagu nasional.",
      "Guru mengingatkan kembali kesepakatan kelas yang telah disepakati bersama. (Kesadaran diri – PSE)",
      "Guru melakukan apersepsi dengan pertanyaan pemantik kepada murid: 'Mengapa benda jatuh ke bawah?' atau 'Bagaimana ilmuwan menemukan obat/teknologi baru?'.",
      "Guru memberikan motivasi kepada murid tentang manfaat mempelajari materi tersebut.",
      "Guru menyampaikan tujuan pembelajaran yang akan dicapai.",
      "Guru menyampaikan dimensi profil lulusan yang akan diterapkan saat proses belajar nanti.",
      "Guru melakukan Asesmen Awal Kognitif melalui aplikasi Wayground/Kahoot. (Pengambilan keputusan yang bertanggung jawab – PSE)"
    ],
    kegiatanAwal: "1. Guru membuka kegiatan dengan salam dan menanyakan kabar.\n2. Berdoa bersama.\n3. Presensi kehadiran murid.\n4. Menyanyikan lagu nasional.\n5. Mengingatkan kesepakatan kelas (Kesadaran diri – PSE).\n6. Apersepsi pertanyaan pemantik.\n7. Motivasi manfaat materi.\n8. Menyampaikan Tujuan Pembelajaran.\n9. Menyampaikan Dimensi Profil Lulusan.\n10. Asesmen Awal Kognitif melalui aplikasi Wayground/Kahoot.",
    prinsipKegiatanAwal: "Berkesadaran, Bermakna, Menggembirakan",
    asesmenAwalUrl: "https://wayground.com/join?gc=56808833",

    // KEGIATAN INTI PERTEMUAN (Multi-Meeting)
    kegiatanIntiPertemuan: [
      {
        pertemuan: "Pertemuan 1: Hakikat Fisika",
        topik: "Hakikat Fisika (Produk, Proses, Sikap)",
        steps: [
          {
            no: 1,
            judul: "Stimulasi & Berkesadaran",
            deskripsi: "Guru mengajak murid melakukan teknik STOP (Stop, Take a breath, Observe, Proceed) sejenak agar murid hadir seutuhnya (berkesadaran). Setelah itu, guru memberikan stimulasi berupa demonstrasi sederhana yang menggembirakan (misal: menjatuhkan dua benda berbeda massa secara bersamaan).",
            prinsip: "Berkesadaran & Menggembirakan"
          },
          {
            no: 2,
            judul: "Identifikasi Masalah (Memahami)",
            deskripsi: "Murid dirangsang untuk bertanya, 'Mengapa keduanya jatuh bersamaan? Bagaimana ilmuwan zaman dahulu membuktikan hal ini?' Murid mulai memahami bahwa fisika bermula dari rasa ingin tahu.",
            prinsip: "Memahami"
          },
          {
            no: 3,
            judul: "Pengumpulan & Pengolahan Data (Mengaplikasi)",
            deskripsi: "Murid dibagi dalam kelompok. Mereka berkeliling lingkungan sekolah untuk mengamati berbagai fenomena atau alat teknologi, lalu mengaplikasi pemahaman mereka dengan mengklasifikasikan hasil temuan ke dalam tiga hakikat fisika (mana yang wujud produk, mana yang butuh proses pengamatan, dan sikap ilmiah apa yang dibutuhkan).",
            prinsip: "Mengaplikasi"
          },
          {
            no: 4,
            judul: "Pembuktian & Menarik Kesimpulan",
            deskripsi: "Perwakilan kelompok mempresentasikan hasil klasifikasinya. Guru dan murid menyimpulkan bersama apa itu hakikat fisika.",
            prinsip: "Berkesadaran"
          },
          {
            no: 5,
            judul: "Merefleksi & Bermakna",
            deskripsi: "Murid menulis di sticky note mengenai satu hal dari alam ciptaan Tuhan yang baru mereka sadari kehebatannya hari ini. Pembelajaran menjadi bermakna karena murid menyadari bahwa mempelajari fisika adalah bentuk rasa syukur dan upaya mengenali keteraturan alam.",
            prinsip: "Bermakna & Merefleksi"
          }
        ]
      },
      {
        pertemuan: "Pertemuan 2 & 3: Metode Ilmiah",
        topik: "Langkah-Langkah Metode Ilmiah & Eksperimen",
        steps: [
          {
            no: 1,
            judul: "Stimulasi & Menggembirakan",
            deskripsi: "Guru menampilkan video atau cerita misteri fiksi ilmiah yang menggembirakan dan menantang (misal: 'Misteri Es yang Cepat Mencair di Gelas A dibanding Gelas B').",
            prinsip: "Menggembirakan"
          },
          {
            no: 2,
            judul: "Identifikasi Masalah & Hipotesis (Memahami)",
            deskripsi: "Murid membedah video tersebut dan merumuskan masalah serta dugaan sementara (hipotesis). Di sini murid memahami konsep variabel bebas, terikat, dan kontrol.",
            prinsip: "Memahami"
          },
          {
            no: 3,
            judul: "Pengumpulan Data / Eksperimen (Mengaplikasi & Berkesadaran)",
            deskripsi: "Secara berkelompok, murid merancang dan melakukan eksperimen sederhana (misal: menguji pengaruh suhu air terhadap kecepatan pelarutan garam/gula). Saat mengambil bahan dan mengukur suhu, guru menekankan praktik berkesadaran (fokus, teliti, jujur pada data yang terbaca, tidak dimanipulasi).",
            prinsip: "Mengaplikasi & Berkesadaran"
          },
          {
            no: 4,
            judul: "Pengolahan Data & Pembuktian",
            deskripsi: "Murid mengolah data hasil eksperimen ke dalam grafik atau tabel, kemudian membandingkannya dengan hipotesis awal mereka (terbukti atau tidak).",
            prinsip: "Mengaplikasi"
          },
          {
            no: 5,
            judul: "Menarik Kesimpulan & Merefleksi (Bermakna)",
            deskripsi: "Murid menyusun kesimpulan akhir. Guru mengajak murid merefleksi: 'Bagaimana jika kita mengambil kesimpulan dalam hidup tanpa metode yang jelas/hanya berasumsi?' Pembelajaran menjadi bermakna karena murid belajar bahwa pola pikir ilmiah penting diterapkan dalam kehidupan sehari-hari untuk menghindari hoaks atau pengambilan keputusan yang salah.",
            prinsip: "Bermakna & Merefleksi"
          }
        ]
      },
      {
        pertemuan: "Pertemuan 4: Keselamatan Kerja di Laboratorium",
        topik: "Prosedur Keamanan & Simbol Bahaya Laboratorium",
        steps: [
          {
            no: 1,
            judul: "Stimulasi & Menggembirakan",
            deskripsi: "Guru mengajak murid melakukan 'Tur Detektif' di dalam Laboratorium. Ini adalah aktivitas menggembirakan di mana murid mencari letak alat pemadam api, kotak P3K, dan stiker simbol-simbol bahaya yang telah disebar guru.",
            prinsip: "Menggembirakan"
          },
          {
            no: 2,
            judul: "Identifikasi Masalah (Memahami)",
            deskripsi: "Murid disajikan studi kasus (berita/artikel pendek) tentang kecelakaan kerja di laboratorium. Murid menganalisis mengapa hal tersebut bisa terjadi untuk memahami pentingnya aturan.",
            prinsip: "Memahami"
          },
          {
            no: 3,
            judul: "Pengumpulan & Pengolahan Data (Mengaplikasi)",
            deskripsi: "Murid mengaplikasi pengetahuannya dengan mencocokkan simbol-simbol bahan kimia (mudah terbakar, korosif, beracun, dll) dengan tindakan pencegahan yang tepat.",
            prinsip: "Mengaplikasi"
          },
          {
            no: 4,
            judul: "Pembuktian & Kesimpulan",
            deskripsi: "Murid secara kolaboratif menyusun 'Kontrak Keselamatan Laboratorium Kelas X' di atas karton besar dan ditandatangani bersama.",
            prinsip: "Kolaborasi"
          },
          {
            no: 5,
            judul: "Merefleksi & Berkesadaran (Bermakna)",
            deskripsi: "Murid diajak hening sejenak membangun komitmen dalam diri (berkesadaran) bahwa keselamatan diri sendiri dan teman adalah tanggung jawab moral bersama. Pembelajaran ini bermakna karena menumbuhkan sikap kemandirian dan peduli keselamatan (safety awareness).",
            prinsip: "Berkesadaran & Bermakna"
          }
        ]
      },
      {
        pertemuan: "Pertemuan 5: Peran Fisika dalam Kehidupan",
        topik: "Inovasi Fisika & Kontribusi Peradaban",
        steps: [
          {
            no: 1,
            judul: "Stimulasi & Memahami",
            deskripsi: "Guru menayangkan gambar perbandingan kehidupan manusia 100 tahun lalu dengan masa kini (misal: dari berkuda hingga kereta maglev, dari operasi manual hingga laser/MRI). Murid memahami peran krusial fisika dalam peradaban.",
            prinsip: "Memahami"
          },
          {
            no: 2,
            judul: "Pengumpulan Data & Pengolahan (Mengaplikasi)",
            deskripsi: "Murid melakukan Discovery literatur di perpustakaan atau internet mengenai inovasi fisika spesifik (misal kelompok 1 bidang kedokteran, kelompok 2 bidang energi terbarukan). Murid mengaplikasi temuannya dengan membuat produk kreatif seperti infografis, poster, atau mind-map digital.",
            prinsip: "Mengaplikasi"
          },
          {
            no: 3,
            judul: "Pembuktian & Menggembirakan",
            deskripsi: "Murid melakukan presentasi dengan metode Gallery Walk atau Marketplace. Setengah anggota kelompok menjaga 'stan' karya mereka, setengah lagi berkeliling berbelanja informasi ke stan kelompok lain. Ini menciptakan suasana yang sangat menggembirakan dan interaktif.",
            prinsip: "Menggembirakan"
          },
          {
            no: 4,
            judul: "Kesimpulan, Merefleksi & Berkesadaran (Bermakna)",
            deskripsi: "Guru memimpin diskusi kelas merangkum seluruh peran fisika. Sebagai penutup, guru mengajak murid bernapas perlahan, menyadari segala kemudahan hidup saat ini (berkesadaran), dan merefleksi peran apa yang ingin mereka ambil di masa depan. Kegiatan ini sangat bermakna karena menghubungkan fisika langsung dengan cita-cita dan kebermanfaatan hidup bagi alam semesta (dimensi beriman dan bertakwa).",
            prinsip: "Bermakna & Berkesadaran"
          }
        ]
      }
    ],

    // KEGIATAN PENUTUP
    kegiatanPenutupSteps: [
      "Guru memberikan asesmen akhir (evaluasi) kepada murid yang dikerjakan secara individu menggunakan aplikasi Wayground/Kahoot.",
      "Guru bersama murid menyimpulkan materi pembelajaran pada hari ini.",
      "Murid melakukan refleksi terhadap kegiatan pembelajaran yang telah dilakukan (Perasaan, Makna, Tantangan).",
      "Guru menyampaikan materi pembelajaran selanjutnya.",
      "Guru bersama dengan murid mengakhiri kegiatan pembelajaran dengan berdoa dan mengucapkan salam penutup."
    ],
    kegiatanPenutup: "1. Guru memberikan asesmen akhir (evaluasi) individu via Wayground/Kahoot.\n2. Guru bersama murid menyimpulkan materi.\n3. Murid melakukan refleksi pembelajaran (Perasaan, Makna, Tantangan).\n4. Guru menyampaikan materi selanjutnya.\n5. Berdoa dan salam penutup.",
    prinsipKegiatanPenutup: "Bermakna dan Menggembirakan",
    asesmenAkhirUrl: "https://wayground.com/join?gc=04898881&source=liveDashboard",

    // 4. ASESMEN PEMBELAJARAN (TABLE)
    asesmenTable: {
      awal: {
        jenis: "Tes diagnostik kognitif",
        instrumen: "Pertanyaan tertulis",
        deskripsi: "Disajikan lima soal pilihan ganda tentang konsep IPA di SMP."
      },
      proses: {
        jenis: "Observasi",
        instrumen: "Lembar observasi kinerja",
        deskripsi: "Menilai kolaborasi, penalaran kritis, dan komunikasi saat diskusi dan praktikum."
      },
      akhir: {
        jenis: "Tes tertulis",
        instrumen: "Soal pilihan ganda",
        deskripsi: "Soal pilihan ganda (10 soal) untuk menguji pemahaman murid."
      }
    },
    asesmenAwal: "Tes diagnostik kognitif: Pertanyaan tertulis (5 soal pilihan ganda tentang konsep IPA di SMP).",
    asesmenProses: "Observasi: Lembar observasi kinerja (Menilai kolaborasi, penalaran kritis, dan komunikasi saat diskusi dan praktikum).",
    asesmenAkhir: "Tes tertulis: Soal pilihan ganda (10 soal untuk menguji pemahaman murid).",

    // 5. REFLEKSI
    refleksiMuridTable: [
      {
        no: 1,
        aspek: "Perasaan dalam belajar",
        refleksi: "Bagaimana perasaan Anda setelah melakukan kegiatan pembelajaran hari ini?",
        jawaban: ""
      },
      {
        no: 2,
        aspek: "Makna",
        refleksi: "Apa yang telah Anda ketahui/pahami tentang materi fisika hari ini?",
        jawaban: ""
      },
      {
        no: 3,
        aspek: "Tantangan",
        refleksi: "Apa saja tantangan pembelajaran hari ini?",
        jawaban: ""
      }
    ],
    refleksiGuruTable: [
      {
        no: 1,
        aspek: "Penguasaan materi",
        refleksi: "Apakah saya sudah memahami dengan baik materi dan aktivitas pembelajaran hari ini?",
        jawaban: ""
      },
      {
        no: 2,
        aspek: "Penyampaian materi",
        refleksi: "Apakah materi hari ini sudah tersampaikan dengan cukup baik kepada murid?",
        jawaban: ""
      },
      {
        no: 3,
        aspek: "Umpan balik",
        refleksi: "Apakah 100% murid telah mencapai penguasaan tujuan pembelajaran yang ingin dicapai?",
        jawaban: ""
      }
    ],

    // 6. REMEDIAL & PENGAYAAN
    remedialText: "Pembimbingan perorangan bagi murid yang belum memahami urutan metode ilmiah atau simbol keselamatan kerja.",
    pengayaanText: "Pengayaan dilaksanakan bagi murid yang telah mencapai KKTP dengan belajar mandiri untuk lebih mendalami dan mengembangkan materi lebih lanjut. Murid dapat membuat karya tulis singkat/vlog mengenai tokoh fisika dunia dan bagaimana metode ilmiah mengubah hidup mereka.",

    // 7. GLOSARIUM
    glosariumItems: [
      { istilah: "Hakikat Fisika", definisi: "Fisika sebagai kumpulan pengetahuan (produk), cara penyelidikan (proses), dan cara berpikir (sikap)." },
      { istilah: "Metode Ilmiah", definisi: "Prosedur sistematis dalam memecahkan masalah melalui observasi dan eksperimen." },
      { istilah: "Hipotesis", definisi: "Dugaan sementara yang harus diuji kebenarannya." },
      { istilah: "MSDS (Material Safety Data Sheet)", definisi: "Lembar data keselamatan bahan di laboratorium." }
    ],

    // 8. DAFTAR PUSTAKA
    daftarPustakaList: [
      "Lasmi, Ketut. (2021). Buku Fisika untuk SMA/MA Kelas XI. Jakarta: Erlangga.",
      "Lasmi, Ketut. (2023). Buku Mandiri Plus Fisika untuk SMA/MA Kelas XI. Jakarta: Erlangga.",
      "Sunardi, dkk. (2024). Praktikum Fisika untuk SMA/MA Kelas X. Jakarta: Yrama Widya."
    ],

    // 9. LAMPIRAN TAUTAN
    lampiranLinks: {
      lkm: "https://drive.google.com/drive/folders/1iZNsY6oYGrAVgUvdPegxUf6xKxD1zxz?usp=sharing",
      instrumenPenilaian: "https://drive.google.com/drive/folders/1URILz6TeuhrHtexKe0Vi9N-oYCZsWlx6?usp=sharing",
      bahanAjar: "https://drive.google.com/drive/folders/1BedmI_d3evoQLjQoqnxpVEWCt9Qe1sj5?usp=sharing",
      mediaAjar: "https://drive.google.com/drive/folders/1QaWIpe55QhBQIIu-Pb6hM1RmEaMUuf1-?usp=sharing"
    },

    // 10. TANDA TANGAN
    titimangsa: {
      tempat: "Dongkala",
      tanggal: "Juli 2026",
      kepalaSekolahNama: "ASMAR, S.Pd., M.Pd.",
      kepalaSekolahNip: "19760604 200604 1 017",
      guruNama: "SUDIRMAN, S.Pd.",
      guruNip: "19951231 202521 2 023",
      guruJabatan: "Guru Mapel Fisika X-2, X-3 dan X-4"
    },

    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_LKPD: LKPD[] = [
  {
    id: "lkpd-001",
    title: "LKPD 01: Menyelidiki Logika Struktur Data Stack vs Queue",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    topic: "Struktur Data Linier (Stack & Queue)",
    learningObjective: "Mampu membedakan karakteristik prinsip LIFO dan FIFO serta menyelesaikan studi kasus antrean data.",
    duration: "45 Menit",
    groupType: "Kelompok",
    instructions: [
      "Tuliskan nama anggota kelompok dan kelas pada kolom yang tersedia.",
      "Bacalah pengantar stimulus kasus dengan teliti sebelum memulai diskusi.",
      "Gunakan kartu simulasi atau diagram alur untuk membantu penalaran.",
      "Tuliskan kesimpulan akhir dan serahkan kepada guru tepat waktu."
    ],
    stimulus: "Sebuah platform tiket konser daring mengalami keluhan pelanggan karena pengguna yang baru masuk justru dilayani lebih dahulu daripada yang sudah antre 1 jam. Tim engineer harus memperbaiki antrean server.",
    summaryMaterial: "Stack bekerja dengan prinsip LIFO (Last In First Out) seperti tumpukan buku, di mana elemen terakhir yang masuk akan pertama dikeluarkan. Queue bekerja dengan prinsip FIFO (First In First Out) seperti antrean loket kasir.",
    activities: [
      {
        title: "Aktivitas 1: Simulasi Riwayat Pencarian Browser (History/Undo)",
        steps: [
          "Buka 4 halaman web berturut-turut: Halaman A, B, C, lalu D.",
          "Ketika Anda menekan tombol 'Back' sebanyak 2 kali, halaman apa yang saat ini tampil?",
          "Jelaskan mengapa mekanisme tombol Back ini menggunakan struktur Stack (LIFO)!"
        ]
      },
      {
        title: "Aktivitas 2: Studi Kasus Antrean Printer Jaringan",
        steps: [
          "Tiga pengguna mengirim dokumen cetak secara simultan: Dokumen 1 (Jam 08:00), Dokumen 2 (Jam 08:01), Dokumen 3 (Jam 08:02).",
          "Tentukan urutan pencetakan oleh printer dan sebutkan operasi Queue yang terjadi (Enqueue/Dequeue)!"
        ]
      }
    ],
    tasks: [
      "Identifikasi masalah utama antrean server konser pada stimulus di atas!",
      "Gambarlah diagram alur tumpukan data saat operasi Push(5), Push(8), Pop(), Push(12) dilakukan!",
      "Lengkapi tabel perbandingan perbedaan Stack vs Queue berdasarkan operasi dan contoh aplikasi dunia nyata."
    ],
    questions: [
      { number: 1, question: "Jika sebuah antrean Queue memiliki elemen [10, 20, 30] lalu dilakukan Enqueue(40) dilanjutkan Dequeue(), berapakah elemen yang tersisa di dalam antrean?", spaceForAnswer: true },
      { number: 2, question: "Mengapa sistem operasi komputer memerlukan struktur data Queue dalam manajemen tugas CPU (CPU Task Scheduling)?", spaceForAnswer: true }
    ],
    reflection: "Setelah menyelesaikan LKPD ini, apa bagian yang paling menantang dan bagaimana kerja sama kelompok Anda?",
    rubricCriteria: [
      { name: "Ketepatan Analisis Kasus", maxScore: 40 },
      { name: "Desain Solusi Struktur Data", maxScore: 40 },
      { name: "Kolaborasi & Presentasi", maxScore: 20 },
    ],
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_ASSESSMENT_PLANS: AssessmentPlan[] = [
  {
    id: "plan-001",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    name: "Sumatif Lingkup Materi 01: Berpikir Komputasional & Struktur Data",
    technique: "Tes Tertulis",
    form: "Pilihan Ganda & Uraian Analisis Kasus",
    timing: "Minggu ke-4 Agustus 2024",
    instrument: "Kisi-kisi, naskah soal HOTS, rubrik pedoman penskoran",
    kktpValue: 75,
    academicYear: "2024/2025",
    semester: "1",
    plans: [
      {
        type: "Sumatif",
        technique: "Tes Tertulis",
        instrument: "Soal Pilihan Ganda & Studi Kasus",
        topic: "Struktur Data Stack dan Queue",
        weight: 40,
        timing: "Minggu ke-4 Agustus",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "plan-002",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    name: "Asesmen Formatif Unjuk Kerja: Proyek Coding Algoritma Python",
    technique: "Kinerja / Performa",
    form: "Rubrik Observasi Praktik & Portofolio Program",
    timing: "Minggu ke-2 Oktober 2024",
    instrument: "Lembar penilaian unjuk kerja pemrograman & rubrik efisiensi kode",
    kktpValue: 75,
    academicYear: "2024/2025",
    semester: "1",
    plans: [
      {
        type: "Formatif",
        technique: "Kinerja / Performa",
        instrument: "Rubrik Observasi Praktik Lab",
        topic: "Percabangan dan Perulangan Python",
        weight: 30,
        timing: "Minggu ke-2 Oktober",
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "plan-003",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    name: "Asesmen Sumatif Akhir Semester (ASAS) Ganjil",
    technique: "Tes Tertulis",
    form: "Pilihan Ganda Kompleks & Isian Singkat Terkomputerisasi",
    timing: "Minggu ke-1 Desember 2024",
    instrument: "Naskah Soal Terstandar CBT & Kisi-kisi Semester",
    kktpValue: 75,
    academicYear: "2024/2025",
    semester: "1",
    plans: [
      {
        type: "Sumatif",
        technique: "Tes Tertulis",
        instrument: "CBT / Naskah Soal Digital",
        topic: "Seluruh Lingkup Materi Semester 1",
        weight: 30,
        timing: "Minggu ke-1 Desember",
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_BAHAN_AJAR: BahanAjar[] = [
  {
    id: "mat-001",
    title: "Handout Konsep: Struktur Data Linier (Stack & Queue)",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    topic: "Struktur Data Stack dan Queue",
    type: "Ringkasan Materi",
    learningObjective: "Memahami karakteristik prinsip LIFO dan FIFO serta implementasinya.",
    summary: "Ringkasan konsep perbedaan fundamental mekanisme LIFO (Stack) dan FIFO (Queue) dilengkapi diagram ilustrasi alur memori.",
    content: "1. Pengertian Stack:\nStack adalah struktur data linier yang mengikuti prinsip LIFO (Last In First Out). Elemen yang terakhir dimasukkan akan menjadi elemen pertama yang diambil.\nOperasi Utama: Push (menambahkan data ke puncak), Pop (menghapus data dari puncak), Peek (melihat data teratas).\n\n2. Pengertian Queue:\nQueue adalah struktur data linier yang berprinsip FIFO (First In First Out). Elemen yang masuk pertama akan dilayani pertama kali.\nOperasi Utama: Enqueue (menambah data di bagian belakang/rear), Dequeue (menghapus data di bagian depan/front).\n\n3. Penerapan Nyata:\n- Fitur Undo/Redo pada software editor (Stack)\n- Sistem antrean transaksi loket kasir / printer (Queue)",
    fullContent: "Modul komprehensif struktur data linier...",
    source: "Buku Teks Siswa Informatika Kelas X Kemendikbudristek",
    fileUrl: "https://drive.google.com",
    examples: ["Undo/Redo Text Editor", "Antrean Tiket Bioskop"],
    practiceProblems: ["Jelaskan apa yang terjadi jika operasi Pop dilakukan pada Stack kosong!"],
    glossary: [
      { term: "LIFO", definition: "Last In First Out" },
      { term: "FIFO", definition: "First In First Out" }
    ],
    conclusion: "Pemilihan struktur data yang tepat menentukan efisiensi memori dan kecepatan pemrosesan program.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mat-002",
    title: "Modul Praktikum: Dasar Pemrograman Python & Percabangan",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    topic: "Algoritma Pemrograman Python",
    type: "Modul Digital",
    learningObjective: "Menulis dan mengeksekusi program percabangan logika if-elif-else di Python.",
    summary: "Panduan langkah demi langkah sintaks dasar bahasa Python, variabel, tipe data, dan struktur kontrol percabangan.",
    content: "Sintaks Dasar Percabangan Python:\n```python\nnilai = int(input('Masukkan Nilai: '))\nif nilai >= 80:\n    print('Predikat: Sangat Baik')\nelif nilai >= 70:\n    print('Predikat: Baik')\nelse:\n    print('Predikat: Perlu Bimbingan')\n```\nPanduan praktikum terarah di Lab Komputer.",
    fullContent: "Panduan praktikum lengkap...",
    source: "Modul Praktik Guru Informatika",
    fileUrl: "https://drive.google.com",
    examples: ["Kalkulator Sederhana", "Program Cek Kelulusan"],
    practiceProblems: ["Buatlah program yang menentukan apakah suatu bilangan ganjil atau genap!"],
    glossary: [{ term: "Indentation", definition: "Spasi penjorokan blok kode dalam Python" }],
    conclusion: "Python menggunakan indentasi sebagai penanda blok logika percabangan.",
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_MEDIA_AJAR: MediaAjar[] = [
  {
    id: "med-001",
    title: "Slide Presentasi Interaktif: Visualisasi Stack & Queue",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    topic: "Struktur Data Linier",
    type: "Slide Presentasi",
    mediaType: "Presentasi Canva/PPT",
    url: "https://www.canva.com/design/DAFexample/view",
    urlOrFile: "https://www.canva.com/design/DAFexample/view",
    description: "Slide presentasi Canva modern dengan animasi interaktif cara kerja Push/Pop dan Enqueue/Dequeue.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "med-002",
    title: "Video Animasi YouTube: Cara Komputer Mengatur Antrean Data",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    topic: "Struktur Data Linier",
    type: "Video Pembelajaran",
    mediaType: "Video YouTube",
    url: "https://www.youtube.com/watch?v=example123",
    urlOrFile: "https://www.youtube.com/watch?v=example123",
    description: "Video animasi edukatif berdurasi 7 menit yang menjelaskan penerapan algoritma antrean pada sistem operasi.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "med-003",
    title: "Kuis Interaktif Quizizz: Cek Pemahaman Logika Algoritma",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    topic: "Algoritma dan Pemrograman",
    type: "Kuis Interaktif",
    mediaType: "Simulasi/Game",
    url: "https://quizizz.com/join?gc=123456",
    urlOrFile: "https://quizizz.com/join?gc=123456",
    description: "Kuis gamifikasi berisikan 15 soal cepat untuk asesmen formatif interaktif di kelas.",
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_QUESTIONS: QuestionBankItem[] = [
  {
    id: "q-001",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    topic: "Struktur Data",
    learningObjective: "Membedakan karakteristik LIFO dan FIFO",
    questionType: "Pilihan Ganda",
    difficulty: "Sedang (MOTS)",
    cognitiveLevel: "C4",
    indicator: "Disajikan skenario aplikasi, siswa dapat mengidentifikasi jenis struktur data yang paling tepat digunakan.",
    questionText: "Sebuah aplikasi editor teks memiliki fitur 'Undo' yang memungkinkan pengguna membatalkan ketikan kata terakhir yang baru saja diketik. Struktur data manakah yang paling efisien digunakan untuk mengimplementasikan fitur tersebut beserta alasan logisnya?",
    options: [
      { key: "A", text: "Queue, karena kata yang pertama diketik harus dibatalkan terlebih dahulu." },
      { key: "B", text: "Stack, karena operasi pembatalan mengikuti prinsip Last-In-First-Out (LIFO)." },
      { key: "C", text: "Array acak, karena kata disimpan secara statis tanpa perlu urutan penghapusan." },
      { key: "D", text: "Tree, karena setiap kata membentuk percabangan hierarki kalimat." },
      { key: "E", text: "Graph, karena setiap kata saling terhubung dengan relasi kompleks non-linier." }
    ],
    correctAnswer: "B",
    explanation: "Fitur Undo pada editor teks membutuhkan pemanggilan kembali aksi terakhir yang dilakukan pengguna. Prinsip pengambilan data terakhir yang pertama diproses adalah definisi tepat dari LIFO (Last In First Out), yang merupakan karakteristik utama struktur data Stack.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-002",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    topic: "Algoritma & Pemrograman",
    learningObjective: "Menganalisis hasil eksekusi logika percabangan kondisional",
    questionType: "Pilihan Ganda",
    difficulty: "Sukar (HOTS)",
    cognitiveLevel: "C4",
    indicator: "Disajikan potongan kode Python dengan kondisi bersarang, siswa dapat menganalisis output nilai akhir.",
    questionText: "Perhatikan potongan kode Python berikut:\n```python\nnilai = 82\nkehadiran = 90\nif nilai >= 80:\n    if kehadiran >= 85:\n        hasil = 'Sangat Memuaskan'\n    else:\n        hasil = 'Memuaskan'\nelse:\n    hasil = 'Cukup'\nprint(hasil)\n```\nApakah output yang akan tercetak pada layar terminal saat program dijalankan?",
    options: [
      { key: "A", text: "Sangat Memuaskan" },
      { key: "B", text: "Memuaskan" },
      { key: "C", text: "Cukup" },
      { key: "D", text: "Syntax Error" },
      { key: "E", text: "None" }
    ],
    correctAnswer: "A",
    explanation: "Nilai awal variabel `nilai` adalah 82 (memenuhi `nilai >= 80` bernilai True), sehingga eksekusi masuk ke blok `if` dalam. Pada kondisi kedua `kehadiran >= 85`, nilai `kehadiran` adalah 90 (True), sehingga variabel `hasil` bernilai 'Sangat Memuaskan'.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-003",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    topic: "Algoritma Pencarian & Kompleksitas",
    learningObjective: "Menghitung efisiensi algoritma Binary Search",
    questionType: "Pilihan Ganda",
    difficulty: "Sukar (HOTS)",
    cognitiveLevel: "C5",
    indicator: "Disajikan data terurut berjumlah 128 elemen, siswa dapat menentukan jumlah langkah pencarian maksimum biner.",
    questionText: "Sebuah daftar berisi 128 data angka telah terurut dari nilai terkecil hingga terbesar. Jika dilakukan pencarian sebuah angka menggunakan algoritma Binary Search, berapakah jumlah langkah perbandingan maksimum (worst case) yang dibutuhkan hingga data ditemukan atau dipastikan tidak ada?",
    options: [
      { key: "A", text: "7 langkah, karena log2(128) = 7" },
      { key: "B", text: "8 langkah, karena log2(128) + 1" },
      { key: "C", text: "64 langkah, karena membagi dua data" },
      { key: "D", text: "128 langkah, karena harus memeriksa tiap elemen" },
      { key: "E", text: "14 langkah, karena 2 × 7" }
    ],
    correctAnswer: "A",
    explanation: "Kompleksitas waktu terburuk dari Binary Search pada data terurut adalah O(log2 N). Untuk N = 128 elemen: log2(128) = log2(2^7) = 7 langkah perbandingan maksimum.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-004",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    topic: "Problem Solving & Navigasi Web",
    learningObjective: "Merancang solusi kombinasi struktur data untuk browser",
    questionType: "Uraian",
    difficulty: "Sukar (HOTS)",
    cognitiveLevel: "C6",
    indicator: "Disajikan skenario tombol Back dan Forward browser web, siswa dapat merancang mekanisme implementasi struktur data Stack ganda.",
    questionText: "Jelaskan bagaimana mekanisme tombol 'Back' dan 'Forward' pada aplikasi peramban web (web browser) dapat diimplementasikan menggunakan kombinasi 2 (dua) buah Stack (misal: Stack A dan Stack B)! Sertakan alur ketika pengguna membuka halaman baru, menekan Back, dan menekan Forward.",
    options: [],
    correctAnswer: "Uraian Terbuka",
    explanation: "1. Ketika membuka URL baru: URL lama di-push ke Stack Back, halaman saat ini ditampilkan, Stack Forward dikosongkan.\n2. Ketika menekan Back: Halaman saat ini di-push ke Stack Forward, dan URL teratas dari Stack Back di-pop untuk ditampilkan.\n3. Ketika menekan Forward: Halaman saat ini di-push ke Stack Back, dan URL teratas dari Stack Forward di-pop untuk ditampilkan.",
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_DIAGNOSTIC: DiagnosticAssessment[] = [
  {
    id: "diag-001",
    studentId: "std-001",
    classId: "cls-10a",
    learningStyle: "Visual",
    readinessLevel: "Siap",
    interest: "Robotik & Pemrograman Web",
    cognitiveScore: 88,
    notes: "Mampu memahami diagram alir dan visualisasi logika dengan cepat.",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "diag-002",
    studentId: "std-002",
    classId: "cls-10a",
    learningStyle: "Auditori",
    readinessLevel: "Siap",
    interest: "Desain Grafis & Multimedia",
    cognitiveScore: 82,
    notes: "Lebih cepat menangkap materi melalui diskusi dan penjelasan verbal.",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "diag-003",
    studentId: "std-003",
    classId: "cls-10a",
    learningStyle: "Kinestetik",
    readinessLevel: "Paham Sebagian",
    interest: "Game Development & Perakitan PC",
    cognitiveScore: 70,
    notes: "Perlu bimbingan langsung berbasis praktik komputer dan simulasi interaktif.",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "diag-004",
    studentId: "std-004",
    classId: "cls-10a",
    learningStyle: "Visual",
    readinessLevel: "Mahir",
    interest: "Kecerdasan Buatan & Sains",
    cognitiveScore: 94,
    notes: "Sangat mandiri dan siap diberikan materi pengayaan analisis algoritma.",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "diag-005",
    studentId: "std-005",
    classId: "cls-10a",
    learningStyle: "Kinestetik",
    readinessLevel: "Paham Sebagian",
    interest: "Olahraga & Animasi",
    cognitiveScore: 68,
    notes: "Memerlukan pendampingan bertahap (scaffolding) dan LKPD berbantuan visual.",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "diag-006",
    studentId: "std-006",
    classId: "cls-10a",
    learningStyle: "Visual",
    readinessLevel: "Mahir",
    interest: "Sains Komputasi & Logika Matematika",
    cognitiveScore: 92,
    notes: "Pemahaman abstrak sangat kuat, berbakat sebagai fasilitator kelompok tutor sebaya.",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "diag-007",
    studentId: "std-007",
    classId: "cls-10a",
    learningStyle: "Auditori",
    readinessLevel: "Siap",
    interest: "Cyber Security & Jaringan Komputer",
    cognitiveScore: 84,
    notes: "Aktif bertanya saat apersepsi dan memahami konsep jaringan secara komparatif.",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "diag-008",
    studentId: "std-008",
    classId: "cls-10a",
    learningStyle: "Kinestetik",
    readinessLevel: "Siap",
    interest: "UI/UX & Desain Interaktif",
    cognitiveScore: 78,
    notes: "Lebih menyukai pembelajaran berbasis proyek pembuatan antarmuka digital.",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "diag-009",
    studentId: "std-009",
    classId: "cls-10b",
    learningStyle: "Visual",
    readinessLevel: "Siap",
    interest: "Animasi & Grafika Komputer",
    cognitiveScore: 85,
    notes: "Respon positif terhadap infografis materi dan ilustrasi visual.",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "diag-010",
    studentId: "std-010",
    classId: "cls-10b",
    learningStyle: "Auditori",
    readinessLevel: "Mahir",
    interest: "Data Science & Statistika",
    cognitiveScore: 90,
    notes: "Mampu menjelaskan kembali alur logika algoritma kepada rekan sekelas.",
    date: new Date().toISOString().split("T")[0],
  }
];

export const DEFAULT_DIAGNOSTIC_ANALYSES: StudentDiagnosticAnalysis[] = [
  {
    id: "diag-analysis-001",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    academicYear: "2024/2025",
    semester: "Ganjil",
    topicOrElement: "Berpikir Komputasional & Struktur Data (Stack, Queue, Algoritma)",
    date: new Date().toISOString().split("T")[0],
    totalStudents: 8,
    assessedStudents: 8,
    overview: {
      executiveSummary: "Hasil asesmen diagnostik awal Fase E Kelas X-A menunjukkan kesiapan belajar yang heterogen dengan rata-rata skor kognitif 82.0. Terdapat 3 siswa bergaya Visual (37.5%), 2 siswa Auditori (25%), dan 3 siswa Kinestetik (37.5%). Diperlukan pembelajaran berdiferensiasi berbasis modul ajar berjenjang (tiered assignment) dan integrasi media multimodal.",
      readinessSummary: "Sebanyak 2 siswa (25%) berada pada tingkat 'Mahir' (Clarissa & Eka), 4 siswa (50%) berada pada tingkat 'Siap' (Achmad, Adelia, Farhan, Gita), dan 2 siswa (25%) pada kategori 'Paham Sebagian / Perlu Bimbingan' (Bagus & Dimas).",
      learningStyleSummary: "Distribusi gaya belajar seimbang antara Visual dan Kinestetik, diikuti Auditori. Pendekatan pembelajaran harus memadukan flowchart visual, pemodelan interaktif lab komputer, dan dialog reflektif.",
      interestSummary: "Minat dominan terkonsentrasi pada Robotik & Web (25%), Desain UI/UX & Grafis (37.5%), Sains & AI (25%), dan Game/Perakitan PC (12.5%).",
      averageScore: 82.0,
      highestScore: 94,
      lowestScore: 68,
    },
    learningStyleDistribution: {
      visual: 3,
      auditory: 2,
      kinesthetic: 3,
      pedagogicalImplication: "Guru disarankan menyiapkan bahan ajar berupa diagram alur logika berwarna untuk siswa Visual, rekaman penjelasan & diskusi kelompok untuk siswa Auditori, serta simulasi praktik langsung di Lab Komputer untuk siswa Kinestetik."
    },
    readinessLevels: {
      perluBimbinganCount: 2,
      siapCount: 4,
      mahirCount: 2,
      pedagogicalImplication: "Kelompok Mahir membutuhkan materi pengayaan analisis kompleksitas algoritma (HOTS). Kelompok Perlu Bimbingan membutuhkan pendampingan langsung (scaffolding) dengan analogi dunia nyata."
    },
    differentiationStrategies: {
      content: {
        perluBimbingan: "Bahan ajar dilengkapi analogi konkret (misal: tumpukan piring untuk Stack, antrean kasir untuk Queue) dan panduan visual langkah-demi-langkah.",
        siap: "Bahan ajar standar sesuai Capaian Pembelajaran Fase E dengan studi kasus sistem perangkat lunak umum.",
        mahir: "Materi pengayaan analisis waktu eksekusi (Big-O notation) dan implementasi struktur data bersarang dalam pemrograman Python."
      },
      process: {
        perluBimbingan: "Bimbingan langsung dalam kelompok kecil bersama guru dengan bantuan manipulasi kartu fisik/simulasi visual.",
        siap: "Diskusi kelompok terarah dengan LKPD terstruktur dan uji coba lab mandiri.",
        mahir: "Eksplorasi mandiri, pemecahan masalah algoritma terbuka, dan bertindak sebagai tutor sebaya bagi rekan sekelompok."
      },
      product: {
        perluBimbingan: "Laporan pemetaan konsep berupa diagram alur sederhana atau lembar kerja terisi yang menjelaskan cara kerja Push dan Pop.",
        siap: "Demonstrasi program simulasi Stack/Queue dan penjelasan solusi kasus Undo-Redo.",
        mahir: "Aplikasi mini/kode program interaktif lengkap dengan analisis kasus uji ekstrem (edge cases)."
      },
      learningEnvironment: "Pengaturan tata ruang fleksibel di Lab Komputer: area pojok diskusi konsep, meja kerja praktik individu berpasangan, dan papan presentasi kelompok."
    },
    groupingRecommendations: [
      {
        groupType: "Kelompok Homogen (Berdasarkan Kesiapan Belajar)",
        description: "Pengelompokan berjenjang saat fase pendalaman materi agar guru dapat memberikan intervensi intensif ke kelompok fondasi.",
        groups: [
          {
            name: "Kelompok 1 - Fondasi & Intervensi",
            targetLevelOrStyle: "Paham Sebagian (Skor 68-70)",
            studentNames: ["Bagus Pratama", "Dimas Arya Wijaya"],
            strategy: "Diberikan scaffolding terarah oleh guru dengan media simulasi kartu fisik."
          },
          {
            name: "Kelompok 2 - Reguler Eksplorasi A",
            targetLevelOrStyle: "Siap (Skor 78-84)",
            studentNames: ["Adelia Rahmawati", "Gita Permata"],
            strategy: "Mengerjakan LKPD standar dan praktikum mandiri dengan arahan terstruktur."
          },
          {
            name: "Kelompok 3 - Reguler Eksplorasi B",
            targetLevelOrStyle: "Siap (Skor 84-88)",
            studentNames: ["Achmad Fauzan", "Farhan Maulana"],
            strategy: "Mengerjakan implementasi program dan analisis studi kasus terapan."
          },
          {
            name: "Kelompok 4 - Pengayaan & Inovasi",
            targetLevelOrStyle: "Mahir (Skor 92-94)",
            studentNames: ["Clarissa Putri", "Eka Nurul Fadilah"],
            strategy: "Menyelesaikan studi kasus tingkat olimpiade/pengayaan dan menyusun media presentasi."
          }
        ]
      },
      {
        groupType: "Kelompok Heterogen (Tutor Sebaya Kolaboratif)",
        description: "Pengelompokan silang saat sesi praktikum proyek besar untuk memacu kolaborasi antar siswa dengan kelebihan berbeda.",
        groups: [
          {
            name: "Tim Kolaboratif Garuda",
            targetLevelOrStyle: "Multi-Kesiapan & Gaya Belajar",
            studentNames: ["Clarissa Putri (Mahir/Visual)", "Bagus Pratama (Bimbingan/Kinestetik)", "Adelia Rahmawati (Siap/Auditori)", "Farhan Maulana (Siap/Auditori)"],
            strategy: "Clarissa memandu desain algoritma logika, Adelia & Farhan menyusun narasi dokumentasi, Bagus melakukan uji coba teknis modul."
          },
          {
            name: "Tim Kolaboratif Rajawali",
            targetLevelOrStyle: "Multi-Kesiapan & Gaya Belajar",
            studentNames: ["Eka Nurul Fadilah (Mahir/Visual)", "Dimas Arya Wijaya (Bimbingan/Kinestetik)", "Achmad Fauzan (Siap/Visual)", "Gita Permata (Siap/Kinestetik)"],
            strategy: "Eka bertindak sebagai lead architect logika, Achmad membuat representasi grafis, Dimas & Gita memvalidasi eksekusi simulasi."
          }
        ]
      }
    ],
    individualStudentProfiles: [
      {
        studentId: "std-001",
        studentName: "Achmad Fauzan",
        learningStyle: "Visual",
        readinessLevel: "Siap",
        cognitiveScore: 88,
        interest: "Robotik & Pemrograman Web",
        aiRecommendation: "Dukung dengan visual diagram alir dan modul pemrograman berbasis web. Sangat responsif dengan representasi grafis.",
        interventionCategory: "Reguler / Penguatan"
      },
      {
        studentId: "std-002",
        studentName: "Adelia Rahmawati",
        learningStyle: "Auditori",
        readinessLevel: "Siap",
        cognitiveScore: 82,
        interest: "Desain Grafis & Multimedia",
        aiRecommendation: "Ajak mempresentasikan hasil diskusi kelompok; optimal saat materi diiringi penjelasan lisan dan tanya jawab interaktif.",
        interventionCategory: "Reguler / Penguatan"
      },
      {
        studentId: "std-003",
        studentName: "Bagus Pratama",
        learningStyle: "Kinestetik",
        readinessLevel: "Paham Sebagian",
        cognitiveScore: 70,
        interest: "Game Development & Perakitan PC",
        aiRecommendation: "Berikan lembar kerja scaffolding dengan analogi visual permainan/game dan libatkan dalam demonstrasi fisik alat peraga.",
        interventionCategory: "Intervensi Khusus"
      },
      {
        studentId: "std-004",
        studentName: "Clarissa Putri",
        learningStyle: "Visual",
        readinessLevel: "Mahir",
        cognitiveScore: 94,
        interest: "Kecerdasan Buatan & Sains",
        aiRecommendation: "Beri tantangan pengayaan algoritma tingkat lanjut (HOTS) dan libatkan sebagai ketua fasilitator tutor sebaya.",
        interventionCategory: "Pengayaan"
      },
      {
        studentId: "std-005",
        studentName: "Dimas Arya Wijaya",
        learningStyle: "Kinestetik",
        readinessLevel: "Paham Sebagian",
        cognitiveScore: 68,
        interest: "Olahraga & Animasi",
        aiRecommendation: "Perlu pendampingan khusus konsep abstrak dasar dengan bantuan simulasi gerak interaktif di komputer.",
        interventionCategory: "Intervensi Khusus"
      },
      {
        studentId: "std-006",
        studentName: "Eka Nurul Fadilah",
        learningStyle: "Visual",
        readinessLevel: "Mahir",
        cognitiveScore: 92,
        interest: "Sains Komputasi & Logika",
        aiRecommendation: "Siap dengan materi pemecahan masalah algoritma kompleks dan integrasi struktur data pohon/graf.",
        interventionCategory: "Pengayaan"
      },
      {
        studentId: "std-007",
        studentName: "Farhan Maulana",
        learningStyle: "Auditori",
        readinessLevel: "Siap",
        cognitiveScore: 84,
        interest: "Cyber Security & Jaringan",
        aiRecommendation: "Kaitkan materi struktur data dengan protokol antrean paket data jaringan untuk meningkatkan antusiasme belajarnya.",
        interventionCategory: "Reguler / Penguatan"
      },
      {
        studentId: "std-008",
        studentName: "Gita Permata",
        learningStyle: "Kinestetik",
        readinessLevel: "Siap",
        cognitiveScore: 78,
        interest: "UI/UX & Desain Interaktif",
        aiRecommendation: "Fasilitasi pembuatan antarmuka prototipe interaktif saat penugasan produk pembelajaran.",
        interventionCategory: "Reguler / Penguatan"
      }
    ],
    actionPlanForModulAjar: [
      "Modul Ajar Pertemuan 1: Tambahkan apersepsi visual video animasi cara kerja Stack dan analogi tumpukan benda nyata.",
      "LKPD Diferensiasi: Buat LKPD A (Tingkat Dasar - Scaffolding) dan LKPD B (Tingkat Lanjut - Problem Solving Kompleks).",
      "Kegiatan Inti: Alokasikan 20 menit khusus untuk bimbingan kelompok kecil (Bagus & Dimas) saat siswa lain melakukan eksplorasi mandiri.",
      "Asesmen Formatif: Gunakan rubrik berjenjang yang menilai proses bernalar kritis dan efisiensi algoritma sesuai kesiapan siswa."
    ],
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_TEST_SPECS: TestSpecification[] = [
  {
    id: "spec-001",
    title: "Kisi-Kisi Asesmen Sumatif Lingkup Materi: Berpikir Komputasional & Struktur Data",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    academicYear: "2024/2025",
    semester: "1",
    testType: "Asesmen Sumatif Lingkup Materi",
    totalQuestions: 5,
    items: [
      {
        number: 1,
        tp: "Menganalisis prinsip dan operasi Last In First Out (LIFO) pada struktur data Stack",
        topic: "Struktur Data Linier (Stack)",
        indicator: "Disajikan studi kasus aplikasi nyata (fitur Undo), peserta didik dapat menentukan struktur data yang relevan beserta alasannya.",
        cognitiveLevel: "C4 (Menganalisis)",
        questionType: "Pilihan Ganda",
        scoreWeight: 20,
      },
      {
        number: 2,
        tp: "Membedakan alur kerja First In First Out (FIFO) pada antrean (Queue)",
        topic: "Struktur Data Linier (Queue)",
        indicator: "Disajikan ilustrasi antrean pemrosesan dokumen printer (print spooler), peserta didik dapat menganalisis urutan penyelesaian tugas.",
        cognitiveLevel: "C3 (Menerapkan)",
        questionType: "Pilihan Ganda",
        scoreWeight: 20,
      },
      {
        number: 3,
        tp: "Menelusuri jalannya eksekusi kode algoritma percabangan bersarang",
        topic: "Algoritma Pemrograman",
        indicator: "Disajikan potongan program Python dengan kondisi bersarang bertingkat, peserta didik dapat memprediksi output nilai akhir dengan tepat.",
        cognitiveLevel: "C4 (HOTS)",
        questionType: "Pilihan Ganda",
        scoreWeight: 20,
      },
      {
        number: 4,
        tp: "Mengevaluasi efisiensi kompleksitas waktu algoritma pencarian biner (Binary Search)",
        topic: "Algoritma Pencarian & Pengurutan",
        indicator: "Disajikan kumpulan data terurut 100 elemen, peserta didik dapat menghitung jumlah langkah perbandingan maksimum pencarian biner.",
        cognitiveLevel: "C5 (Mengevaluasi)",
        questionType: "Pilihan Ganda",
        scoreWeight: 20,
      },
      {
        number: 5,
        tp: "Merancang skema penyelesaian masalah dengan struktur data kombinasi",
        topic: "Problem Solving Komputasional",
        indicator: "Disajikan skenario sistem navigasi browser web (Back/Forward history), peserta didik dapat merancang mekanisme dua Stack.",
        cognitiveLevel: "C6 (Mencipta)",
        questionType: "Uraian / Esai",
        scoreWeight: 20,
      }
    ],
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_QUESTION_ANALYSIS: QuestionItemAnalysis[] = [
  {
    id: "qa-001",
    testTitle: "Analisis Butir Soal: Sumatif LM 1 Struktur Data & Algoritma",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    totalStudents: 32,
    analyzedQuestions: [
      {
        questionNumber: 1,
        correctCount: 26,
        wrongCount: 6,
        difficultyIndex: 0.81,
        difficultyCategory: "Mudah",
        discriminationIndex: 0.44,
        discriminationCategory: "Sangat Baik",
        distractorValidity: "Berfungsi Baik",
        recommendation: "Sangat Baik",
      },
      {
        questionNumber: 2,
        correctCount: 20,
        wrongCount: 12,
        difficultyIndex: 0.62,
        difficultyCategory: "Sedang",
        discriminationIndex: 0.52,
        discriminationCategory: "Sangat Baik",
        distractorValidity: "Berfungsi Baik",
        recommendation: "Sangat Baik",
      },
      {
        questionNumber: 3,
        correctCount: 16,
        wrongCount: 16,
        difficultyIndex: 0.50,
        difficultyCategory: "Sedang",
        discriminationIndex: 0.48,
        discriminationCategory: "Sangat Baik",
        distractorValidity: "Berfungsi Baik",
        recommendation: "Sangat Baik",
      },
      {
        questionNumber: 4,
        correctCount: 11,
        wrongCount: 21,
        difficultyIndex: 0.34,
        difficultyCategory: "Sukar",
        discriminationIndex: 0.38,
        discriminationCategory: "Baik",
        distractorValidity: "Berfungsi Baik",
        recommendation: "Baik",
      },
      {
        questionNumber: 5,
        correctCount: 8,
        wrongCount: 24,
        difficultyIndex: 0.25,
        difficultyCategory: "Sangat Sukar",
        discriminationIndex: 0.28,
        discriminationCategory: "Cukup",
        distractorValidity: "Perlu Revisi Pengecoh",
        recommendation: "Perlu Revisi",
      }
    ],
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att-001",
    date: new Date().toISOString().split("T")[0],
    classId: "cls-10a",
    subjectId: "sbj-inf",
    entries: [
      { studentId: "std-001", status: "H" },
      { studentId: "std-002", status: "H" },
      { studentId: "std-003", status: "H" },
      { studentId: "std-004", status: "S", note: "Flu dan demam" },
      { studentId: "std-005", status: "H" },
      { studentId: "std-006", status: "H" },
      { studentId: "std-007", status: "I", note: "Izin acara keluarga" },
      { studentId: "std-008", status: "H" },
    ],
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_GRADES: GradeRecord[] = [
  {
    id: "grd-001",
    date: new Date().toISOString().split("T")[0],
    classId: "cls-10a",
    subjectId: "sbj-inf",
    assessmentType: "Formatif",
    topic: "Struktur Data Stack & Queue",
    kktpStandard: 75,
    scores: [
      { studentId: "std-001", score: 88, note: "Sangat aktif dalam simulasi" },
      { studentId: "std-002", score: 92, note: "Paham logika LIFO/FIFO sempurna" },
      { studentId: "std-003", score: 78, note: "Tuntas standar" },
      { studentId: "std-004", score: 85, note: "Tuntas" },
      { studentId: "std-005", score: 70, note: "Perlu penguatan konsep Dequeue" },
      { studentId: "std-006", score: 95, note: "Excellent" },
      { studentId: "std-007", score: 80, note: "Tuntas" },
      { studentId: "std-008", score: 86, note: "Tuntas" },
    ],
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_ACTIVITY_LOGS: ActivityLog[] = [
  { id: "log-1", action: "Sistem Dimuat", module: "Inisialisasi", details: "Database terintegrasi Kurikulum Merdeka siap digunakan", timestamp: new Date().toISOString() },
  { id: "log-2", action: "Modul Ajar Dibuat", module: "Modul Ajar", details: "Modul Ajar Struktur Data Stack & Queue berhasil disimpan", timestamp: new Date().toISOString() },
  { id: "log-3", action: "Bank Soal Diperbarui", module: "Bank Soal", details: "2 Butir soal HOTS Informatika ditambahkan", timestamp: new Date().toISOString() },
  { id: "log-4", action: "Presensi Harian", module: "Absensi", details: "Presensi Kelas X-A berhasil dicatat", timestamp: new Date().toISOString() },
];

export const DEFAULT_KKTP: KKTPItem[] = [
  {
    id: "kktp-001",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    learningObjective: "1.1 Murid dapat mendeskripsikan hakikat ilmu pengetahuan, metode ilmiah, dan keselamatan kerja dalam penyelidikan.",
    criteriaType: "Interval Nilai",
    indicators: [
      "Mendeskripsikan hakikat sains dan fisika dalam kehidupan sehari-hari.",
      "Menerapkan langkah-langkah metode ilmiah dalam pemecahan masalah.",
      "Mengidentifikasi prosedur keselamatan kerja di laboratorium."
    ],
    intervals: [
      {
        label: "Belum Berkembang (0 - 60)",
        min: 0,
        max: 60,
        description: "Belum mampu mendeskripsikan hakikat ilmu dan langkah metode ilmiah secara tepat.",
        followUp: "Belum mencapai ketuntasan, remedial di seluruh bagian dengan bimbingan tutor sebaya."
      },
      {
        label: "Cukup (61 - 70)",
        min: 61,
        max: 70,
        description: "Mampu mendeskripsikan hakikat ilmu namun masih membutuhkan bimbingan pada prosedur metode ilmiah.",
        followUp: "Belum mencapai ketuntasan, remedial pada bagian langkah metode ilmiah."
      },
      {
        label: "Baik (71 - 87)",
        min: 71,
        max: 87,
        description: "Mampu mendeskripsikan hakikat ilmu, menerapkan metode ilmiah, dan memahami keselamatan kerja mandiri.",
        followUp: "Sudah mencapai ketuntasan, tidak perlu remedial, lanjut ke materi berikutnya."
      },
      {
        label: "Sangat Baik (88 - 100)",
        min: 88,
        max: 100,
        description: "Sangat mahir mendeskripsikan secara komprehensif, merancang prosedur penyelidikan, dan memberi contoh analitis.",
        followUp: "Sudah mencapai ketuntasan, diberikan program pengayaan atau tantangan proyek riset."
      }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "kktp-002",
    subjectId: "sbj-inf",
    classId: "cls-10a",
    phase: "Fase E",
    learningObjective: "1.2 Murid dapat menerapkan konsep struktur data (Stack & Queue) dalam menyelesaikan persoalan komputasi.",
    criteriaType: "Interval Nilai",
    indicators: [
      "Mendefinisikan prinsip kerja LIFO dan FIFO dengan tepat.",
      "Melakukan simulasi operasi Push, Pop, Enqueue, dan Dequeue.",
      "Menganalisis pemilihan struktur data yang optimal pada studi kasus nyata."
    ],
    intervals: [
      {
        label: "Belum Berkembang (0 - 60)",
        min: 0,
        max: 60,
        description: "Belum memahami prinsip LIFO/FIFO dan salah dalam operasi dasar stack/queue.",
        followUp: "Belum mencapai ketuntasan, remedial konsep dasar dengan alat peraga visual."
      },
      {
        label: "Cukup (61 - 70)",
        min: 61,
        max: 70,
        description: "Memahami konsep dasar namun masih ragu dalam menentukan alur operasi pada studi kasus.",
        followUp: "Belum mencapai ketuntasan, remedial latihan soal studi kasus terbimbing."
      },
      {
        label: "Baik (71 - 87)",
        min: 71,
        max: 87,
        description: "Mampu menjelaskan dan mensimulasikan operasi Stack dan Queue secara mandiri dan benar.",
        followUp: "Sudah mencapai ketuntasan, tidak perlu remedial."
      },
      {
        label: "Sangat Baik (88 - 100)",
        min: 88,
        max: 100,
        description: "Sangat mahir merancang algoritma implementasi struktur data dan mampu memecahkan masalah kompleks.",
        followUp: "Sudah mencapai ketuntasan, diberikan pengayaan coding implementasi tingkat lanjut."
      }
    ],
    createdAt: new Date().toISOString(),
  }
];

export const DEFAULT_RUBRICS: RubricItem[] = [
  {
    id: "rub-001",
    title: "Rubrik Penilaian Proyek Program Modular Berpikir Komputasional",
    subjectId: "sbj-inf",
    type: "Proyek",
    criteria: [
      {
        aspect: "Desain dan Perencanaan Algoritma",
        weight: 30,
        descriptors: [
          { level: "Sangat Baik (4)", scoreRange: "86-100", description: "Perencanaan dan flowchart sangat runtut, modular, dan efisien." },
          { level: "Baik (3)", scoreRange: "76-85", description: "Perencanaan terstruktur dengan baik dan alur logika jelas." },
          { level: "Cukup (2)", scoreRange: "66-75", description: "Perencanaan cukup memadai namun belum modular." },
          { level: "Perlu Bimbingan (1)", scoreRange: "0-65", description: "Belum mampu membuat perancangan alur logika yang tepat." },
        ],
      },
      {
        aspect: "Implementasi Kode & Fungsionalitas",
        weight: 50,
        descriptors: [
          { level: "Sangat Baik (4)", scoreRange: "86-100", description: "Program berjalan sempurna, bebas bug, dan mampu menangani kasus uji batas." },
          { level: "Baik (3)", scoreRange: "76-85", description: "Program berfungsi baik dengan sedikit kesalahan minor yang tidak fatal." },
          { level: "Cukup (2)", scoreRange: "66-75", description: "Program hanya berjalan pada kasus dasar." },
          { level: "Perlu Bimbingan (1)", scoreRange: "0-65", description: "Program mengalami error fatal saat dieksekusi." },
        ],
      },
      {
        aspect: "Presentasi & Kolaborasi Kelompok",
        weight: 20,
        descriptors: [
          { level: "Sangat Baik (4)", scoreRange: "86-100", description: "Menjelaskan logika program dengan sangat komunikatif dan kerja tim solid." },
          { level: "Baik (3)", scoreRange: "76-85", description: "Penjelasan baik dan kolaborasi merata." },
          { level: "Cukup (2)", scoreRange: "66-75", description: "Penjelasan kurang percaya diri dan dominasi satu anggota." },
          { level: "Perlu Bimbingan (1)", scoreRange: "0-65", description: "Tidak mampu menjelaskan logika program yang dibuat." },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_FORMATIVE: FormativeAssessment[] = [
  {
    id: "fmt-001",
    studentId: "std-001",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    learningObjective: "Memahami struktur data array & antrean",
    activity: "Diskusi LKPD & Simulasi Praktik",
    masteryLevel: "Tuntas",
    feedback: "Sangat aktif dan mampu menjelaskan kembali kepada teman sebaya.",
    score: 88,
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "fmt-002",
    studentId: "std-002",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    learningObjective: "Memahami struktur data array & antrean",
    activity: "Diskusi LKPD & Simulasi Praktik",
    masteryLevel: "Tuntas",
    feedback: "Menguasai konsep LIFO/FIFO dengan sempurna.",
    score: 92,
    date: new Date().toISOString().split("T")[0],
  },
];

export const DEFAULT_SUMMATIVE: SummativeAssessment[] = [
  {
    id: "sum-001",
    studentId: "std-001",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    assessmentName: "Sumatif LM 1 (Berpikir Komputasional)",
    scopeTopic: "Struktur Data Linier",
    score: 88,
    finalScore: 88,
    status: "Tuntas",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "sum-002",
    studentId: "std-005",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    assessmentName: "Sumatif LM 1 (Berpikir Komputasional)",
    scopeTopic: "Struktur Data Linier",
    score: 68,
    remedialScore: 78,
    finalScore: 78,
    status: "Tuntas",
    date: new Date().toISOString().split("T")[0],
  },
];

export const DEFAULT_P5: P5Assessment[] = [
  {
    id: "p5-001",
    studentId: "std-001",
    classId: "cls-10a",
    theme: "Rekayasa dan Teknologi",
    projectName: "Pengembangan Solusi Otomasi Sekolah",
    dimension: "Bernalar Kritis",
    element: "Memperoleh dan memproses informasi dan gagasan",
    scoreScale: "BSH",
    description: "Mampu menganalisis masalah kontekstual dan menyusun solusi komputasional secara terstruktur.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p5-002",
    studentId: "std-002",
    classId: "cls-10a",
    theme: "Rekayasa dan Teknologi",
    projectName: "Pengembangan Solusi Otomasi Sekolah",
    dimension: "Kreatif",
    element: "Menghasilkan karya dan tindakan yang orisinal",
    scoreScale: "SAB",
    description: "Menghasilkan ide prototipe antarmuka yang sangat inovatif dan berorientasi pengguna.",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_JOURNALS: TeachingJournalItem[] = [
  {
    id: "jrn-001",
    date: new Date().toISOString().split("T")[0],
    classId: "cls-10a",
    subjectId: "sbj-inf",
    timeSlot: "07.30 - 09.00 (Jam 1-2)",
    topic: "Algoritma Pemrograman: Struktur Data Stack & Queue",
    learningObjective: "Siswa mampu menyimulasikan operasi LIFO dan FIFO dalam studi kasus komputasi.",
    activities: "Apersepsi tumpukan buku dan loket antrean, simulasi roleplay kartu indeks, pengerjaan LKPD, refleksi bersama.",
    attendanceSummary: "32 Hadir, 0 Absen",
    classroomNotes: "Seluruh siswa antusias dan aktif berdiskusi dalam kelompok.",
    reflection: "Alokasi waktu simulasi 60 menit cukup optimal. Perlu tambahan tantangan pemrograman untuk kelompok yang cepat tuntas.",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_CASES: CaseRecord[] = [
  {
    id: "case-001",
    date: new Date().toISOString().split("T")[0],
    studentId: "std-004",
    classId: "cls-10a",
    incidentDescription: "Mengalami kesulitan fokus saat pembelajaran jam ke-7 karena kurang fit.",
    followUpAction: "Diberikan istirahat sejenak di UKS dan bimbingan tugas susulan terpandu.",
    resultNotes: "Siswa telah pulih dan menyelesaikan penugasan mandiri dengan baik.",
    status: "Selesai",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_REMEDIAL: RemedialEnrichmentItem[] = [
  {
    id: "rem-001",
    type: "Remedial",
    studentId: "std-005",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    topic: "Struktur Data Linier: Queue & Dequeue",
    initialScore: 68,
    activityForm: "Bimbingan perorangan konsep antrean dan penugasan lembar kerja terpandu",
    finalScore: 78,
    status: "Tuntas",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "rem-002",
    type: "Pengayaan",
    studentId: "std-006",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    topic: "Struktur Data Linier: Stack & Queue",
    initialScore: 95,
    activityForm: "Tantangan pembuatan implementasi Stack dan Queue dalam kode Python",
    finalScore: 98,
    status: "Tuntas",
    date: new Date().toISOString().split("T")[0],
  },
];

export const DEFAULT_SUPERVISION: SupervisionRecord[] = [
  {
    id: "sup-001",
    date: "2024-08-15",
    supervisorName: "Drs. H. Bambang Suryanto, M.Pd.",
    supervisorRole: "Kepala Sekolah",
    aspectsObserved: "Perencanaan Pembelajaran (Modul Ajar) & Pelaksanaan Pembelajaran Berdiferensiasi",
    findings: "Modul Ajar terstruktur lengkap sesuai panduan Kurikulum Merdeka. Pengelolaan kelas interaktif.",
    recommendations: "Pertahankan pemanfaatan media digital interaktif dan berikan diferensiasi produk yang lebih variatif.",
    score: 94,
    predicate: "Amat Baik (A)",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_PKB: PKBRecord[] = [
  {
    id: "pkb-001",
    activityName: "Pelatihan Mandiri PMM: Merancang Pembelajaran Berdiferensiasi",
    organizer: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (PMM)",
    role: "Peserta",
    durationHours: 32,
    startDate: "2024-07-10",
    endDate: "2024-07-25",
    certificateNumber: "PMM-DIF-2024-88912",
    certificateUrl: "",
    impactSummary: "Menguasai teknik pemetaan kebutuhan belajar dan asesmen awal siswa.",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_CHAPTER_NOTES: ChapterNote[] = [
  {
    id: "chn-001",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    semester: "Ganjil",
    academicYear: "2024/2025",
    chapterNumber: 1,
    chapterTitle: "Bab 1: Berpikir Komputasional (Computational Thinking)",
    mainTopic: "Dekomposisi, Pengenalan Pola, Abstraksi, dan Perancangan Algoritma Sederhana",
    tpList: [
      "TP 1.1 Memahami 4 pilar dasar berpikir komputasional dalam pemecahan masalah.",
      "TP 1.2 Menerapkan strategi algoritmik standar pada masalah pencarian (searching) dan pengurutan (sorting).",
      "TP 1.3 Menyajikan representasi data menggunakan struktur tumpukan (stack) dan antrean (queue)."
    ],
    teacherReflection: "Secara umum murid sangat antusias dengan simulasi analog logika sorting. Murid yang perlu pendampingan difasilitasi dengan media kartu visual.",
    createdAt: new Date().toISOString(),
    entries: [
      { studentId: "std-001", learningProgress: "Sangat Berkembang", attitudeObservation: "Sangat aktif bertanya dan membantu rekan sekelompok dalam simulasi sorting.", notes: "Dapat dijadikan tutor sebaya pada materi struktur data.", masteryScore: 92 },
      { studentId: "std-002", learningProgress: "Sangat Berkembang", attitudeObservation: "Kreatif dalam menemukan pola algoritma alternatif.", notes: "Kinerja sangat konsisten dan rapi dalam dokumentasi.", masteryScore: 95 },
      { studentId: "std-003", learningProgress: "Berkembang Sesuai Harapan", attitudeObservation: "Fokus dan tekun menyelesaikan LKPD.", notes: "Memerlukan latihan ekstra pada kasus konseptual antrean (queue).", masteryScore: 78 },
      { studentId: "std-004", learningProgress: "Berkembang Sesuai Harapan", attitudeObservation: "Kerjasama kelompok sangat baik, komunikasi santun.", notes: "Mampu menjelaskan konsep dekomposisi dengan runtut.", masteryScore: 85 },
      { studentId: "std-005", learningProgress: "Perlu Bimbingan", attitudeObservation: "Kurang percaya diri saat mempraktikkan simulasi trace table algoritma.", notes: "Diberikan pendampingan individual dan bahan ajar berbasis infografis sederhana.", masteryScore: 68 },
      { studentId: "std-006", learningProgress: "Sangat Berkembang", attitudeObservation: "Menunjukkan nalar kritis tinggi dan kemampuan abstraksi cepat.", notes: "Diberikan materi pengayaan pemecahan masalah berbasis rekursif.", masteryScore: 96 },
      { studentId: "std-007", learningProgress: "Berkembang Sesuai Harapan", attitudeObservation: "Disiplin mengumpulkan catatan dan aktif dalam diskusi.", notes: "Penguasaan konsep dasar sudah tuntas.", masteryScore: 82 },
      { studentId: "std-008", learningProgress: "Berkembang Sesuai Harapan", attitudeObservation: "Cermat dan teliti dalam menganalisis kesalahan langkah (debugging).", notes: "Kemampuan logika algoritma berkembang baik.", masteryScore: 86 },
    ]
  },
  {
    id: "chn-002",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    semester: "Ganjil",
    academicYear: "2024/2025",
    chapterNumber: 2,
    chapterTitle: "Bab 2: Teknologi Informasi dan Komunikasi (TIK)",
    mainTopic: "Integrasi Aplikasi Perkantoran, Fitur Lanjut Pengolah Kata & Spreadsheet, dan Cloud Storage",
    tpList: [
      "TP 2.1 Mengintegrasikan konten aplikasi perkantoran (word processor, spreadsheet, presentasi) secara otomatis.",
      "TP 2.2 Memanfaatkan fungsi logika kompleks dan visualisasi data spreadsheet.",
      "TP 2.3 Mengelola kolaborasi dokumen bersama secara daring menggunakan penyimpanan awan."
    ],
    teacherReflection: "Praktik langsung di Lab Komputer berjalan lancar. Seluruh siswa berhasil membuat dokumen terintegrasi.",
    createdAt: new Date().toISOString(),
    entries: [
      { studentId: "std-001", learningProgress: "Sangat Berkembang", attitudeObservation: "Cepat menguasai fungsi Mail Merge dan VLOOKUP.", notes: "Hasil lembar kerja spreadsheet sangat terstruktur.", masteryScore: 90 },
      { studentId: "std-002", learningProgress: "Sangat Berkembang", attitudeObservation: "Mahir memanfaatkan cloud drive kolaborasi.", notes: "Mendesain dashboard data visualisasi dengan sangat menarik.", masteryScore: 94 },
      { studentId: "std-003", learningProgress: "Berkembang Sesuai Harapan", attitudeObservation: "Tertib dan memperhatikan instruksi praktik.", notes: "Sudah menguasai teknik pemformatan data tabel dasar.", masteryScore: 76 },
      { studentId: "std-004", learningProgress: "Berkembang Sesuai Harapan", attitudeObservation: "Aktif bertanya jika ada formula formula spreadsheet yang error.", notes: "Daya juang belajar tinggi.", masteryScore: 84 },
      { studentId: "std-005", learningProgress: "Mulai Berkembang", attitudeObservation: "Mulai menunjukkan peningkatan dalam mengoperasikan spreadsheet.", notes: "Perlu bimbingan langkah rumus nested IF.", masteryScore: 72 },
      { studentId: "std-006", learningProgress: "Sangat Berkembang", attitudeObservation: "Sangat mandiri dan mampu mengeksplorasi conditional formatting lanjutan.", notes: "Pengerjaan tugas paling awal dan sempurna.", masteryScore: 98 },
      { studentId: "std-007", learningProgress: "Berkembang Sesuai Harapan", attitudeObservation: "Kooperatif dalam tugas kelompok terpadu.", notes: "Tuntas pada seluruh kriteria instrumen.", masteryScore: 80 },
      { studentId: "std-008", learningProgress: "Berkembang Sesuai Harapan", attitudeObservation: "Kerapian dokumen kerja sangat baik.", notes: "Pemahaman integrasi chart dinamis sangat memuaskan.", masteryScore: 88 },
    ]
  }
];

export const DEFAULT_TASK_ASSIGNMENTS: TaskAssignment[] = [
  {
    id: "tsk-001",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    semester: "Ganjil",
    academicYear: "2024/2025",
    chapterNumber: 1,
    chapterTitle: "Bab 1: Berpikir Komputasional",
    taskNumber: 1,
    title: "Tugas 1: Peta Konsep 4 Pilar Berpikir Komputasional & Contoh Kasus",
    taskType: "Individu",
    dueDate: "2024-08-05",
    maxScore: 100,
    kktpStandard: 75,
    instructions: "Buatlah ringkasan ilustratif pemecahan masalah nyata di sekitar sekolah menggunakan 4 pilar Berpikir Komputasional (Dekomposisi, Pola, Abstraksi, Algoritma).",
    createdAt: new Date().toISOString(),
    scores: [
      { studentId: "std-001", score: 90, status: "Tepat Waktu", submissionDate: "2024-08-04", feedback: "Peta konsep sangat sistematis dan contoh kasus relevan." },
      { studentId: "std-002", score: 95, status: "Tepat Waktu", submissionDate: "2024-08-03", feedback: "Desain visual dan penjelasan pilar sangat mendalam." },
      { studentId: "std-003", score: 78, status: "Tepat Waktu", submissionDate: "2024-08-05", feedback: "Lengkap, perlu sedikit detail pada aspek abstraksi." },
      { studentId: "std-004", score: 85, status: "Tepat Waktu", submissionDate: "2024-08-04", feedback: "Contoh algoritma langkah demi langkah sudah sangat jelas." },
      { studentId: "std-005", score: 70, status: "Terlambat", submissionDate: "2024-08-06", feedback: "Tugas diterima, perlu perbaikan contoh pada pilar dekomposisi." },
      { studentId: "std-006", score: 98, status: "Tepat Waktu", submissionDate: "2024-08-03", feedback: "Analisis luar biasa kreatif dan aplikatif!" },
      { studentId: "std-007", score: 80, status: "Tepat Waktu", submissionDate: "2024-08-05", feedback: "Tuntas dan memenuhi seluruh rubrik penilaian." },
      { studentId: "std-008", score: 88, status: "Tepat Waktu", submissionDate: "2024-08-04", feedback: "Penyusunan flowchart contoh masalah sangat rapi." },
    ]
  },
  {
    id: "tsk-002",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    semester: "Ganjil",
    academicYear: "2024/2025",
    chapterNumber: 1,
    chapterTitle: "Bab 1: Berpikir Komputasional",
    taskNumber: 2,
    title: "Tugas 2: Analisis Perbandingan Algoritma Bubble Sort vs Selection Sort",
    taskType: "PR / Latihan",
    dueDate: "2024-08-19",
    maxScore: 100,
    kktpStandard: 75,
    instructions: "Lakukan tracing manual langkah pengurutan deret angka acak dengan Bubble Sort dan Selection Sort, lalu hitung jumlah pertukaran (swap) masing-masing.",
    createdAt: new Date().toISOString(),
    scores: [
      { studentId: "std-001", score: 88, status: "Tepat Waktu", submissionDate: "2024-08-18", feedback: "Tabel trace akurat dan perhitungan swap benar." },
      { studentId: "std-002", score: 92, status: "Tepat Waktu", submissionDate: "2024-08-17", feedback: "Penjelasan perbedaan efisiensi kedua metode sangat tajam." },
      { studentId: "std-003", score: 75, status: "Tepat Waktu", submissionDate: "2024-08-19", feedback: "Ada sedikit keliru pada iterasi ke-3 bubble sort, sudah diperbaiki." },
      { studentId: "std-004", score: 86, status: "Tepat Waktu", submissionDate: "2024-08-18", feedback: "Pengerjaan rapi dan sistematis." },
      { studentId: "std-005", score: 72, status: "Tepat Waktu", submissionDate: "2024-08-19", feedback: "Perlu pendalaman konsep selection sort." },
      { studentId: "std-006", score: 95, status: "Tepat Waktu", submissionDate: "2024-08-17", feedback: "Disertai perbandingan kompleksitas waktu yang sangat baik." },
      { studentId: "std-007", score: 82, status: "Tepat Waktu", submissionDate: "2024-08-19", feedback: "Latihan terselesaikan dengan baik." },
      { studentId: "std-008", score: 85, status: "Tepat Waktu", submissionDate: "2024-08-18", feedback: "Lengkap dan sesuai dengan format standar." },
    ]
  },
  {
    id: "tsk-003",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    semester: "Ganjil",
    academicYear: "2024/2025",
    chapterNumber: 2,
    chapterTitle: "Bab 2: Teknologi Informasi dan Komunikasi",
    taskNumber: 1,
    title: "Tugas 1: Pembuatan Dokumen Surat Massal (Mail Merge) & Rekap Nilai",
    taskType: "Proyek Mini",
    dueDate: "2024-09-09",
    maxScore: 100,
    kktpStandard: 75,
    instructions: "Buat file template surat pengumuman di pengolah kata yang terhubung otomatis dengan basis data spreadsheet berisi minimal 10 baris data siswa.",
    createdAt: new Date().toISOString(),
    scores: [
      { studentId: "std-001", score: 92, status: "Tepat Waktu", submissionDate: "2024-09-08", feedback: "Integrasi database berjalan mulus dan tata letak surat formal." },
      { studentId: "std-002", score: 96, status: "Tepat Waktu", submissionDate: "2024-09-07", feedback: "Template surat dan formatting data sangat profesional." },
      { studentId: "std-003", score: 78, status: "Tepat Waktu", submissionDate: "2024-09-09", feedback: "Berhasil terhubung, perhatikan kerapian margin." },
      { studentId: "std-004", score: 88, status: "Tepat Waktu", submissionDate: "2024-09-08", feedback: "Fungsi Mail Merge bekerja tanpa kendala." },
      { studentId: "std-005", score: 74, status: "Tepat Waktu", submissionDate: "2024-09-09", feedback: "Tuntas standar minimal, tingkatkan kerapian data source." },
      { studentId: "std-006", score: 96, status: "Tepat Waktu", submissionDate: "2024-09-07", feedback: "Eksplorasi filter penerima bersyarat sangat memuaskan." },
      { studentId: "std-007", score: 82, status: "Tepat Waktu", submissionDate: "2024-09-09", feedback: "Dokumen teruji dengan baik." },
      { studentId: "std-008", score: 88, status: "Tepat Waktu", submissionDate: "2024-09-08", feedback: "Sangat baik dan lengkap." },
    ]
  }
];

export const DEFAULT_CHAPTER_ASSESSMENTS: ChapterAssessment[] = [
  {
    id: "cas-001",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    semester: "Ganjil",
    academicYear: "2024/2025",
    chapterNumber: 1,
    chapterTitle: "Bab 1: Berpikir Komputasional",
    assessmentType: "Sumatif Lingkup Materi (SLM)",
    kktpStandard: 75,
    date: "2024-08-26",
    tpBreakdown: [
      { tpCode: "TP1.1", tpName: "4 Pilar Berpikir Komputasional", weight: 30 },
      { tpCode: "TP1.2", tpName: "Algoritma Searching & Sorting", weight: 40 },
      { tpCode: "TP1.3", tpName: "Struktur Data Stack & Queue", weight: 30 }
    ],
    generalAnalysis: "Ketuntasan klasikal mencapai 87.5%. Mayoritas siswa unggul pada pemahaman pilar dan struktur data. Soal analisis kompleksitas sorting memerlukan penguatan berkelanjutan.",
    createdAt: new Date().toISOString(),
    studentScores: [
      { studentId: "std-001", tpScores: { "TP1.1": 90, "TP1.2": 88, "TP1.3": 92 }, finalScore: 90, isPass: true, remedialNotes: "Tuntas mandiri" },
      { studentId: "std-002", tpScores: { "TP1.1": 95, "TP1.2": 92, "TP1.3": 96 }, finalScore: 94, isPass: true, remedialNotes: "Tuntas istimewa - Rekomendasi Pengayaan" },
      { studentId: "std-003", tpScores: { "TP1.1": 80, "TP1.2": 75, "TP1.3": 76 }, finalScore: 77, isPass: true, remedialNotes: "Tuntas KKTP" },
      { studentId: "std-004", tpScores: { "TP1.1": 85, "TP1.2": 86, "TP1.3": 82 }, finalScore: 85, isPass: true, remedialNotes: "Tuntas baik" },
      { studentId: "std-005", tpScores: { "TP1.1": 70, "TP1.2": 68, "TP1.3": 72 }, finalScore: 70, isPass: false, remedialNotes: "Perlu Remedial TP 1.2 (Algoritma Sorting)" },
      { studentId: "std-006", tpScores: { "TP1.1": 98, "TP1.2": 96, "TP1.3": 96 }, finalScore: 97, isPass: true, remedialNotes: "Tuntas istimewa - Rekomendasi Pengayaan" },
      { studentId: "std-007", tpScores: { "TP1.1": 82, "TP1.2": 80, "TP1.3": 82 }, finalScore: 81, isPass: true, remedialNotes: "Tuntas baik" },
      { studentId: "std-008", tpScores: { "TP1.1": 88, "TP1.2": 85, "TP1.3": 88 }, finalScore: 87, isPass: true, remedialNotes: "Tuntas baik" },
    ]
  },
  {
    id: "cas-002",
    classId: "cls-10a",
    subjectId: "sbj-inf",
    semester: "Ganjil",
    academicYear: "2024/2025",
    chapterNumber: 2,
    chapterTitle: "Bab 2: Teknologi Informasi dan Komunikasi (TIK)",
    assessmentType: "Sumatif Lingkup Materi (SLM)",
    kktpStandard: 75,
    date: "2024-09-20",
    tpBreakdown: [
      { tpCode: "TP2.1", tpName: "Integrasi Aplikasi Perkantoran", weight: 35 },
      { tpCode: "TP2.2", tpName: "Fungsi Logika Spreadsheet", weight: 35 },
      { tpCode: "TP2.3", tpName: "Kolaborasi Daring Cloud Storage", weight: 30 }
    ],
    generalAnalysis: "Praktik langsung menunjukkan seluruh siswa mampu menghubungkan data mail merge dan menerapkan formula spreadsheet dasar.",
    createdAt: new Date().toISOString(),
    studentScores: [
      { studentId: "std-001", tpScores: { "TP2.1": 92, "TP2.2": 90, "TP2.3": 94 }, finalScore: 92, isPass: true, remedialNotes: "Tuntas sangat baik" },
      { studentId: "std-002", tpScores: { "TP2.1": 96, "TP2.2": 95, "TP2.3": 98 }, finalScore: 96, isPass: true, remedialNotes: "Tuntas sangat baik" },
      { studentId: "std-003", tpScores: { "TP2.1": 80, "TP2.2": 76, "TP2.3": 82 }, finalScore: 79, isPass: true, remedialNotes: "Tuntas KKTP" },
      { studentId: "std-004", tpScores: { "TP2.1": 88, "TP2.2": 86, "TP2.3": 90 }, finalScore: 88, isPass: true, remedialNotes: "Tuntas baik" },
      { studentId: "std-005", tpScores: { "TP2.1": 75, "TP2.2": 72, "TP2.3": 78 }, finalScore: 75, isPass: true, remedialNotes: "Tuntas batas KKTP" },
      { studentId: "std-006", tpScores: { "TP2.1": 98, "TP2.2": 98, "TP2.3": 98 }, finalScore: 98, isPass: true, remedialNotes: "Tuntas istimewa" },
      { studentId: "std-007", tpScores: { "TP2.1": 84, "TP2.2": 82, "TP2.3": 86 }, finalScore: 84, isPass: true, remedialNotes: "Tuntas baik" },
      { studentId: "std-008", tpScores: { "TP2.1": 88, "TP2.2": 86, "TP2.3": 90 }, finalScore: 88, isPass: true, remedialNotes: "Tuntas baik" },
    ]
  }
];

// Local Storage Helper Engine

export const db = {
  get<T>(key: string, defaultVal: T): T {
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (!item) return defaultVal;
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return defaultVal;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving ${key} to storage:`, e);
    }
  },

  resetAll(): void {
    localStorage.clear();
  },

  exportFullBackup(): string {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        data[key.replace(STORAGE_KEY_PREFIX, "")] = JSON.parse(localStorage.getItem(key) || "null");
      }
    }
    return JSON.stringify(data, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      for (const [key, val] of Object.entries(parsed)) {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
      }
      return true;
    } catch (e) {
      console.error("Failed to import backup:", e);
      return false;
    }
  }
};
