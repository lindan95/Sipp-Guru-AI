import { SchoolProfile, TeacherProfile, ClassRoom, Subject, CapaianPembelajaran, AlurTujuanPembelajaran } from "../types";

export const SYSTEM_PROMPT_DEFAULT = `Anda adalah AI GURU ASSISTANT profesional untuk guru di Indonesia yang merancang perangkat pembelajaran berbasis Kurikulum Merdeka (dan Kurikulum Nasional).
Prinsip kerja:
1. Gunakan Bahasa Indonesia baku, formal, sistematis, jelas, dan sesuai konteks pedagogik modern di Indonesia.
2. Integrasikan Profil Pelajar Pancasila (Beriman/Bertakwa, Berkebinekaan Global, Gotong Royong, Mandiri, Bernalar Kritis, Kreatif).
3. Gunakan pendekatan Student-Centered Learning (Pembelajaran Berdiferensiasi, Problem-Based Learning, Project-Based Learning, Inkuiri).
4. Jangan mengarang identitas sekolah/guru di luar konteks yang diberikan.
5. Format keluaran harus rapi, terstruktur dan mudah dimasukkan ke dalam dokumen resmi perangkat pembelajaran.`;

export interface AIContext {
  school?: SchoolProfile;
  teacher?: TeacherProfile;
  classroom?: ClassRoom;
  classInfo?: ClassRoom;
  subject?: Subject;
  cpList?: CapaianPembelajaran[];
  atpList?: AlurTujuanPembelajaran[];
  topic?: string;
  gradeLevel?: string;
  phase?: string;
  notes?: string;
}

export function buildContextString(ctx: AIContext): string {
  const cls = ctx.classroom || ctx.classInfo;
  return `
[KONTEKS DATA TERINTEGRASI]:
- Satuan Pendidikan: ${ctx.school?.name || "SMA/SMP/SD Negeri"} (NPSN: ${ctx.school?.npsn || "-"})
- Guru Pengampu: ${ctx.teacher?.fullName || "Guru Mata Pelajaran"} (NIP: ${ctx.teacher?.nip || "-"})
- Mata Pelajaran: ${ctx.subject?.name || "Informatika"} (Kode: ${ctx.subject?.code || "-"})
- Kelas / Fase: ${cls?.name || "Kelas X"} / ${ctx.phase || cls?.phase || "Fase E"}
- Alokasi JP per Minggu: ${ctx.subject?.hoursPerWeek || 2} JP
- Topik / Materi Utama: ${ctx.topic || "Konsep Dasar"}
`;
}

// 1. Modul Ajar / RPP Pembelajaran Mendalam (Deep Learning) Prompt
export function createModulAjarPrompt(
  ctx: AIContext,
  topicOrObjectives: string,
  modelOrModelName: string = "Problem Based Learning",
  duration?: string
): { prompt: string; systemInstruction: string } {
  const topic = ctx.topic || topicOrObjectives || "Hakikat Fisika & Metode Ilmiah";
  const model = modelOrModelName || "Inquiry Learning dan Discovery Learning";
  const allocatedTime = duration || "14 JP (14 × 45 menit) / 5 kali Pertemuan";

  const prompt = `${buildContextString(ctx)}
Tolong buatkan draf LENGKAP RENCANA PEMBELAJARAN MENDALAM (DEEP LEARNING RPP) Kurikulum Merdeka topik "${topic}" dengan model "${model}" (${allocatedTime}).
Tujuan Pembelajaran: ${topicOrObjectives || "Murid mampu memahami secara mendalam hakikat materi, mengaplikasikan metode ilmiah, dan merefleksikan proses belajar secara bermakna"}.

FORMAT RPP PEMBELAJARAN MENDALAM WAJIB MENCAKUP 10 BAGIAN UTAMA PERSIS:
1. IDENTITAS (Nama Penyusun, Satuan Pendidikan, Tahun Ajaran, Mapel, Fase/Kelas/Semester, Topik, Sub Topik, Alokasi Waktu)
2. IDENTIFIKASI:
   - A. KESIAPAN MURID (poin-poin pengetahuan awal, minat, digital readiness, prosedur keamanan/praktikum)
   - B. KARAKTERISTIK MATERI PELAJARAN (fondasi dasar, kognitif/psikomotorik, relevansi etika/lingkungan/ketuhanan)
   - C. DIMENSI PROFIL LULUSAN (Daftar nama dimensi dan deskripsi capaian: Keimanan & Ketakwaan thd Tuhan YME, Penalaran Kritis, Kolaborasi, Kemandirian, Komunikasi)
3. DESAIN PEMBELAJARAN:
   - A. Capaian Pembelajaran (CP)
   - B. Tujuan Pembelajaran (TP terukur 1-4)
   - C. Praktik Pedagogis (Model Pembelajaran, Pendekatan CTL & Diferensiasi, Metode Pembelajaran)
   - D. Lingkungan Pembelajaran (Ruang kelas & lab, lingkungan sekitar, media proyektor & alat laboratorium)
   - E. Pemanfaatan Digital (Platform Asesmen Wayground/Kahoot, Sumber Belajar Video YouTube, Virtual Lab/Simulasi)
4. PENGALAMAN BELAJAR (Prinsip: Berkesadaran, Bermakna, Menggembirakan):
   - A. Kegiatan Pendahuluan (10 langkah: Salam/Kabar, Doa, Presensi, Lagu Nasional, Kesepakatan Kelas PSE, Apersepsi Pemantik, Motivasi, TP, Dimensi Profil Lulusan, Asesmen Awal Kognitif + Link)
   - B. Kegiatan Inti (Rincian per Pertemuan lengkap dengan 5 sintaks 3M: Stimulasi & Berkesadaran/Menggembirakan, Identifikasi Masalah/Memahami, Pengumpulan & Pengolahan Data/Mengaplikasi & Berkesadaran, Pembuktian & Kesimpulan, Merefleksi & Bermakna)
   - C. Kegiatan Penutup (5 langkah: Asesmen akhir evaluasi + link, simpulan bersama, refleksi murid [Perasaan, Makna, Tantangan], materi berikutnya, doa & salam)
5. ASESMEN PEMBELAJARAN (Tabel dengan kolom Jenis | Instrumen | Deskripsi untuk Asesmen Awal, Proses, dan Akhir)
6. REFLEKSI:
   - A. Refleksi Murid (Tabel No, Aspek [Perasaan dalam belajar, Makna, Tantangan], Refleksi Murid)
   - B. Refleksi Guru (Tabel No, Aspek [Penguasaan materi, Penyampaian materi, Umpan balik], Refleksi Guru)
7. REMEDIAL & PENGAYAAN (Program pembimbingan dan pengayaan mandiri KKTP)
8. GLOSARIUM (Daftar istilah penting & definisi)
9. DAFTAR PUSTAKA (Buku teks, rujukan, modul praktikum)
10. LAMPIRAN TAUTAN (LKM, Instrumen Penilaian, Bahan Ajar, Media Ajar)

Keluarkan dalam format JSON terstruktur persis dengan schema berikut:
{
  "title": "${topic}",
  "subTopik": "${topic}, Metode Ilmiah, Keselamatan Kerja di Laboratorium, & Peran dalam Kehidupan",
  "phase": "${ctx.phase || "E"}",
  "semester": "Ganjil",
  "tahunPenyusunan": "2026/2027",
  "allocatedHours": "${allocatedTime}",
  "duration": "${allocatedTime}",
  "meetingCount": "5 kali Pertemuan",
  "topikPembelajaran": "${topic}",
  "kesiapanMuridList": [
    "Murid telah mempelajari konsep dasar terkait di jenjang sebelumnya.",
    "Murid memiliki rasa ingin tahu terhadap fenomena alam di sekitarnya.",
    "Sebagian besar murid telah terbiasa menggunakan perangkat digital (HP/Laptop).",
    "Murid membutuhkan pemahaman dasar mengenai prosedur keamanan sebelum melakukan praktikum di Laboratorium."
  ],
  "identifikasiPesertaDidik": "Murid telah mempelajari konsep dasar terkait di jenjang sebelumnya, memiliki rasa ingin tahu terhadap fenomena alam di sekitarnya, terbiasa menggunakan perangkat digital, dan memerlukan pemahaman prosedur keamanan praktikum.",
  "karakteristikMateriList": [
    "Materi ini bersifat pengetahuan dasar (fondasi) yang mendasari seluruh pembelajaran lanjutan.",
    "Materi mengombinasikan aspek kognitif (pemahaman konsep) dan psikomotorik (metode ilmiah dan keselamatan kerja).",
    "Materi sangat relevan dengan etika ilmiah dan tanggung jawab terhadap lingkungan serta ketuhanan."
  ],
  "identifikasiMateri": "Materi bersifat fondasi dasar yang mengombinasikan aspek kognitif dan psikomotorik serta relevan dengan etika ilmiah dan tanggung jawab terhadap lingkungan dan ketuhanan.",
  "dimensiProfilLulusan": [
    "Keimanan dan Ketakwaan terhadap Tuhan YME",
    "Penalaran Kritis",
    "Kolaborasi",
    "Kemandirian",
    "Komunikasi"
  ],
  "dimensiProfilLulusanDetail": [
    { "nama": "Keimanan dan Ketakwaan terhadap Tuhan YME", "deskripsi": "Murid menyadari keteraturan alam sebagai ciptaan Tuhan melalui pengamatan materi." },
    { "nama": "Penalaran Kritis", "deskripsi": "Murid mampu menganalisis fenomena menggunakan langkah-langkah metode ilmiah yang sistematis." },
    { "nama": "Kolaborasi", "deskripsi": "Murid bekerja sama dalam kelompok saat melakukan observasi dan diskusi." },
    { "nama": "Kemandirian", "deskripsi": "Murid bertanggung jawab atas keselamatan diri dan alat saat berada di laboratorium." },
    { "nama": "Komunikasi", "deskripsi": "Murid menyampaikan hasil pengamatan dan analisis secara lisan maupun tertulis." }
  ],
  "capaianPembelajaran": "Pada akhir fase, murid memiliki kemampuan untuk menggunakan sistem pengukuran dalam kerja ilmiah; menganalisis pemanfaatan konsep esensial; dan memecahkan permasalahan kontekstual nyata.",
  "tujuanPembelajaran": [
    "Murid dapat mendeskripsikan hakikat dan konsep esensial materi.",
    "Murid dapat mendeskripsikan dan menerapkan langkah-langkah metode ilmiah.",
    "Murid dapat mendeskripsikan prosedur keselamatan kerja di Laboratorium.",
    "Murid dapat menjelaskan peran materi dalam berbagai bidang kehidupan."
  ],
  "praktikPedagogis": "${model}",
  "pendekatan": "Contextual Teaching and Learning (CTL), diferensiasi",
  "metodePembelajaran": "Observasi, diskusi kelompok, simulasi, dan presentasi",
  "lingkunganPembelajaranList": [
    "Ruang kelas dan laboratorium.",
    "Lingkungan sekitar sekolah untuk observasi fenomena.",
    "Media berupa proyektor, poster simbol bahaya, alat laboratorium dasar."
  ],
  "lingkunganPembelajaran": "Ruang kelas dan laboratorium, lingkungan sekitar sekolah untuk observasi fenomena, media berupa proyektor, poster simbol bahaya, alat laboratorium dasar.",
  "pemanfaatanDigitalList": [
    { "kategori": "Platform Asesmen", "detail": "Wayground atau Kahoot." },
    { "kategori": "Sumber Belajar", "detail": "Video YouTube tentang sejarah sains dan kecelakaan kerja di Laboratorium." },
    { "kategori": "Virtual Lab", "detail": "Simulasi sederhana atau video demonstrasi prosedur laboratorium." }
  ],
  "pemanfaatanDigital": "Platform Asesmen: Wayground atau Kahoot. Sumber Belajar: Video YouTube. Virtual Lab: Simulasi sederhana laboratorium.",
  "saranaPrasarana": "Ruang kelas, Lab, Proyektor, Laptop/HP, Alat Praktikum Dasar",
  "kegiatanPendahuluanSteps": [
    "Guru membuka kegiatan pembelajaran dengan mengucapkan salam dan menanyakan kabar murid.",
    "Guru mengajak murid untuk berdoa sebelum memulai pembelajaran.",
    "Guru mengecek kehadiran murid.",
    "Guru bersama dengan murid menyanyikan salah satu lagu nasional.",
    "Guru mengingatkan kembali kesepakatan kelas yang telah disepakati bersama. (Kesadaran diri – PSE)",
    "Guru melakukan apersepsi dengan pertanyaan pemantik kepada murid.",
    "Guru memberikan motivasi kepada murid tentang manfaat mempelajari materi tersebut.",
    "Guru menyampaikan tujuan pembelajaran yang akan dicapai.",
    "Guru menyampaikan dimensi profil lulusan yang akan diterapkan saat proses belajar nanti.",
    "Guru melakukan Asesmen Awal Kognitif melalui aplikasi Wayground/Kahoot. (Pengambilan keputusan yang bertanggung jawab – PSE)"
  ],
  "kegiatanAwal": "1. Salam dan kabar\n2. Berdoa bersama\n3. Presensi\n4. Menyanyikan lagu nasional\n5. Kesepakatan kelas (PSE)\n6. Apersepsi pemantik\n7. Motivasi\n8. Menyampaikan TP\n9. Menyampaikan Dimensi Profil Lulusan\n10. Asesmen Awal Kognitif.",
  "prinsipKegiatanAwal": "Berkesadaran, Bermakna, Menggembirakan",
  "asesmenAwalUrl": "https://wayground.com/join?gc=56808833",
  "kegiatanIntiPertemuan": [
    {
      "pertemuan": "Pertemuan 1: Hakikat dan Fondasi Konsep",
      "topik": "Hakikat Konsep (Produk, Proses, Sikap)",
      "steps": [
        {
          "no": 1,
          "judul": "Stimulasi & Berkesadaran",
          "deskripsi": "Guru mengajak murid melakukan teknik STOP sejenak agar murid hadir seutuhnya (berkesadaran), dilanjutkan demonstrasi sederhana yang menggembirakan.",
          "prinsip": "Berkesadaran & Menggembirakan"
        },
        {
          "no": 2,
          "judul": "Identifikasi Masalah (Memahami)",
          "deskripsi": "Murid dirangsang untuk bertanya dan membedah fenomena untuk memahami bahwa sains bermula dari rasa ingin tahu.",
          "prinsip": "Memahami"
        },
        {
          "no": 3,
          "judul": "Pengumpulan & Pengolahan Data (Mengaplikasi)",
          "deskripsi": "Murid berkeliling mengamati fenomena di lingkungan sekolah dan mengaplikasi pemahaman dengan mengklasifikasikan temuan.",
          "prinsip": "Mengaplikasi"
        },
        {
          "no": 4,
          "judul": "Pembuktian & Menarik Kesimpulan",
          "deskripsi": "Perwakilan kelompok mempresentasikan hasil klasifikasinya dan menyimpulkan bersama guru.",
          "prinsip": "Berkesadaran"
        },
        {
          "no": 5,
          "judul": "Merefleksi & Bermakna",
          "deskripsi": "Murid menulis refleksi mengenai keteraturan ciptaan Tuhan dan menyadari bahwa belajar adalah wujud rasa syukur.",
          "prinsip": "Bermakna & Merefleksi"
        }
      ]
    },
    {
      "pertemuan": "Pertemuan 2 & 3: Metode Ilmiah",
      "topik": "Langkah-Langkah Metode Ilmiah & Eksperimen",
      "steps": [
        {
          "no": 1,
          "judul": "Stimulasi & Menggembirakan",
          "deskripsi": "Guru menampilkan video atau cerita misteri fiksi ilmiah yang menggembirakan dan menantang.",
          "prinsip": "Menggembirakan"
        },
        {
          "no": 2,
          "judul": "Identifikasi Masalah & Hipotesis (Memahami)",
          "deskripsi": "Murid merumuskan masalah dan hipotesis serta memahami variabel bebas, terikat, dan kontrol.",
          "prinsip": "Memahami"
        },
        {
          "no": 3,
          "judul": "Pengumpulan Data / Eksperimen (Mengaplikasi & Berkesadaran)",
          "deskripsi": "Secara berkelompok merancang dan melakukan eksperimen sederhana dengan fokus, teliti, dan jujur.",
          "prinsip": "Mengaplikasi & Berkesadaran"
        },
        {
          "no": 4,
          "judul": "Pengolahan Data & Pembuktian",
          "deskripsi": "Murid mengolah data ke dalam grafik atau tabel dan membandingkannya dengan hipotesis awal.",
          "prinsip": "Mengaplikasi"
        },
        {
          "no": 5,
          "judul": "Menarik Kesimpulan & Merefleksi (Bermakna)",
          "deskripsi": "Murid menyusun kesimpulan akhir dan merefleksikan pentingnya pola pikir ilmiah untuk menghindari hoaks.",
          "prinsip": "Bermakna & Merefleksi"
        }
      ]
    },
    {
      "pertemuan": "Pertemuan 4: Keselamatan Kerja di Laboratorium",
      "topik": "Prosedur Keamanan & Simbol Bahaya",
      "steps": [
        {
          "no": 1,
          "judul": "Stimulasi & Menggembirakan",
          "deskripsi": "Guru mengajak murid melakukan 'Tur Detektif' di dalam laboratorium mencari simbol bahaya dan alat keselamatan.",
          "prinsip": "Menggembirakan"
        },
        {
          "no": 2,
          "judul": "Identifikasi Masalah (Memahami)",
          "deskripsi": "Murid disajikan studi kasus kecelakaan kerja untuk memahami pentingnya aturan laboratorium.",
          "prinsip": "Memahami"
        },
        {
          "no": 3,
          "judul": "Pengumpulan & Pengolahan Data (Mengaplikasi)",
          "deskripsi": "Murid mencocokkan simbol bahan kimia dengan tindakan pencegahan yang tepat.",
          "prinsip": "Mengaplikasi"
        },
        {
          "no": 4,
          "judul": "Pembuktian & Kesimpulan",
          "deskripsi": "Murid secara kolaboratif menyusun dan menandatangani Kontrak Keselamatan Laboratorium.",
          "prinsip": "Kolaborasi"
        },
        {
          "no": 5,
          "judul": "Merefleksi & Berkesadaran (Bermakna)",
          "deskripsi": "Murid diajak hening membangun komitmen bahwa keselamatan diri dan teman adalah tanggung jawab moral bersama.",
          "prinsip": "Berkesadaran & Bermakna"
        }
      ]
    },
    {
      "pertemuan": "Pertemuan 5: Peran dalam Kehidupan",
      "topik": "Aplikasi & Manfaat dalam Peradaban",
      "steps": [
        {
          "no": 1,
          "judul": "Stimulasi & Memahami",
          "deskripsi": "Guru menayangkan gambar perbandingan peradaban dahulu dan kini untuk memahami peran krusial ilmu.",
          "prinsip": "Memahami"
        },
        {
          "no": 2,
          "judul": "Pengumpulan Data & Pengolahan (Mengaplikasi)",
          "deskripsi": "Murid melakukan eksplorasi inovasi dan membuat produk kreatif seperti infografis atau poster.",
          "prinsip": "Mengaplikasi"
        },
        {
          "no": 3,
          "judul": "Pembuktian & Menggembirakan",
          "deskripsi": "Murid melakukan presentasi interaktif dengan metode Gallery Walk atau Marketplace.",
          "prinsip": "Menggembirakan"
        },
        {
          "no": 4,
          "judul": "Kesimpulan, Merefleksi & Berkesadaran (Bermakna)",
          "deskripsi": "Guru memimpin refleksi bagaimana menghubungkan ilmu dengan cita-cita dan kebermanfaatan bagi alam semesta.",
          "prinsip": "Bermakna & Berkesadaran"
        }
      ]
    }
  ],
  "pengalamanMemahami": "Murid terlibat aktif mengonstruksi pengetahuan esensial, aplikatif, dan nilai karakter melalui observasi dan penelaahan mendalam.",
  "pengalamanMengaplikasi": "Murid mengaplikasikan konsep dalam eksperimen nyata, analisis kasus, dan pembuatan produk kreatif.",
  "pengalamanMerefleksi": "Murid mengevaluasi hasil belajar, merefleksikan makna kehidupan, dan mengelola proses belajar mandiri.",
  "kegiatanPenutupSteps": [
    "Guru memberikan asesmen akhir (evaluasi) kepada murid yang dikerjakan secara individu menggunakan aplikasi Wayground/Kahoot.",
    "Guru bersama murid menyimpulkan materi pembelajaran pada hari ini.",
    "Murid melakukan refleksi terhadap kegiatan pembelajaran yang telah dilakukan (Perasaan, Makna, Tantangan).",
    "Guru menyampaikan materi pembelajaran selanjutnya.",
    "Guru bersama dengan murid mengakhiri kegiatan pembelajaran dengan berdoa dan mengucapkan salam penutup."
  ],
  "kegiatanPenutup": "1. Evaluasi individu via Wayground/Kahoot\n2. Guru & murid menyimpulkan materi\n3. Refleksi (Perasaan, Makna, Tantangan)\n4. Info materi selanjutnya\n5. Doa dan salam penutup.",
  "prinsipKegiatanPenutup": "Bermakna dan Menggembirakan",
  "asesmenAkhirUrl": "https://wayground.com/join?gc=04898881&source=liveDashboard",
  "asesmenTable": {
    "awal": {
      "jenis": "Tes diagnostik kognitif",
      "instrumen": "Pertanyaan tertulis",
      "deskripsi": "Disajikan lima soal pilihan ganda tentang konsep dasar di jenjang sebelumnya."
    },
    "proses": {
      "jenis": "Observasi",
      "instrumen": "Lembar observasi kinerja",
      "deskripsi": "Menilai kolaborasi, penalaran kritis, dan komunikasi saat diskusi dan praktikum."
    },
    "akhir": {
      "jenis": "Tes tertulis",
      "instrumen": "Soal pilihan ganda",
      "deskripsi": "Soal pilihan ganda (10 soal) untuk menguji pemahaman murid."
    }
  },
  "asesmenAwal": "Tes diagnostik kognitif: Pertanyaan tertulis (5 soal pilihan ganda).",
  "asesmenProses": "Observasi: Lembar observasi kinerja (Menilai kolaborasi, penalaran kritis, dan komunikasi).",
  "asesmenAkhir": "Tes tertulis: Soal pilihan ganda (10 soal).",
  "refleksiMuridTable": [
    {
      "no": 1,
      "aspek": "Perasaan dalam belajar",
      "refleksi": "Bagaimana perasaan Anda setelah melakukan kegiatan pembelajaran hari ini?",
      "jawaban": ""
    },
    {
      "no": 2,
      "aspek": "Makna",
      "refleksi": "Apa yang telah Anda ketahui/pahami tentang materi hari ini?",
      "jawaban": ""
    },
    {
      "no": 3,
      "aspek": "Tantangan",
      "refleksi": "Apa saja tantangan pembelajaran hari ini?",
      "jawaban": ""
    }
  ],
  "refleksiGuruTable": [
    {
      "no": 1,
      "aspek": "Penguasaan materi",
      "refleksi": "Apakah saya sudah memahami dengan baik materi dan aktivitas pembelajaran hari ini?",
      "jawaban": ""
    },
    {
      "no": 2,
      "aspek": "Penyampaian materi",
      "refleksi": "Apakah materi hari ini sudah tersampaikan dengan cukup baik kepada murid?",
      "jawaban": ""
    },
    {
      "no": 3,
      "aspek": "Umpan balik",
      "refleksi": "Apakah 100% murid telah mencapai penguasaan tujuan pembelajaran yang ingin dicapai?",
      "jawaban": ""
    }
  ],
  "remedialText": "Pembimbingan perorangan bagi murid yang belum memahami urutan metode ilmiah atau simbol keselamatan kerja.",
  "pengayaanText": "Pengayaan dilaksanakan bagi murid yang telah mencapai KKTP dengan belajar mandiri untuk lebih mendalami dan mengembangkan materi lebih lanjut.",
  "glosariumItems": [
    { "istilah": "Hakikat Sains/Fisika", "definisi": "Sains sebagai kumpulan pengetahuan (produk), cara penyelidikan (proses), dan cara berpikir (sikap)." },
    { "istilah": "Metode Ilmiah", "definisi": "Prosedur sistematis dalam memecahkan masalah melalui observasi dan eksperimen." },
    { "istilah": "Hipotesis", "definisi": "Dugaan sementara yang harus diuji kebenarannya." },
    { "istilah": "MSDS (Material Safety Data Sheet)", "definisi": "Lembar data keselamatan bahan di laboratorium." }
  ],
  "daftarPustakaList": [
    "Lasmi, Ketut. (2021). Buku Fisika untuk SMA/MA Kelas XI. Jakarta: Erlangga.",
    "Lasmi, Ketut. (2023). Buku Mandiri Plus Fisika untuk SMA/MA Kelas XI. Jakarta: Erlangga.",
    "Sunardi, dkk. (2024). Praktikum Fisika untuk SMA/MA Kelas X. Jakarta: Yrama Widya."
  ],
  "lampiranLinks": {
    "lkm": "https://drive.google.com/drive/folders/sample-lkm",
    "instrumenPenilaian": "https://drive.google.com/drive/folders/sample-instrumen",
    "bahanAjar": "https://drive.google.com/drive/folders/sample-bahan",
    "mediaAjar": "https://drive.google.com/drive/folders/sample-media"
  }
}`;

  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}

// 2. LKPD Prompt
export function createLKPDPrompt(
  ctx: AIContext,
  titleOrTp: string,
  phaseOrDuration: string = "45 Menit",
  activityType?: string
): { prompt: string; systemInstruction: string } {
  const prompt = `${buildContextString(ctx)}
Buatkan draf LEMBAR KERJA PESERTA DIDIK (LKPD) yang menarik, interaktif, dan aplikatif untuk materi "${titleOrTp || ctx.topic || 'Materi'}" (Fase / Durasi: ${phaseOrDuration}) ${activityType ? `Fokus: ${activityType}` : ''}.

Keluarkan dalam format JSON terstruktur persis seperti ini:
{
  "title": "LKPD: ${titleOrTp || ctx.topic || 'Materi Pembelajaran'}",
  "topic": "${titleOrTp || ctx.topic || 'Materi'}",
  "learningObjective": "Peserta didik mampu memahami, menganalisis, dan memecahkan permasalahan terkait materi secara kolaboratif.",
  "duration": "${phaseOrDuration}",
  "groupType": "Kelompok",
  "instructions": [
    "Tuliskan nama anggota kelompok pada kolom identitas yang tersedia.",
    "Bacalah ringkasan materi dan petunjuk pengerjaan dengan cermat.",
    "Diskusikan setiap instruksi kerja bersama kelompok Anda.",
    "Tanyakan kepada guru jika terdapat hal yang belum dipahami."
  ],
  "stimulus": "Studi kasus kontekstual dan ilustrasi permasalahan dunia nyata.",
  "summaryMaterial": "Ringkasan konsep esensial materi yang ringkas, padat, dan mudah dipahami sebagai referensi awal pengerjaan tugas.",
  "activities": [
    {
      "title": "Aktivitas 1: Eksplorasi & Identifikasi Masalah",
      "steps": [
        "Amati studi kasus yang disajikan di bawah ini.",
        "Identifikasi 3 faktor penyebab utama masalah tersebut."
      ]
    },
    {
      "title": "Aktivitas 2: Analisis Solusi Kolaboratif",
      "steps": [
        "Rancang langkah pemecahan masalah terbaik menurut kelompok Anda.",
        "Tuangkan argumentasi logis Anda ke dalam tabel hasil kerja."
      ]
    }
  ],
  "tasks": [
    "Lengkapi tabel analisis perbandingan.",
    "Buat kesimpulan bersama kelompok dalam 2 paragraf."
  ],
  "questions": [
    {
      "number": 1,
      "question": "Jelaskan mengapa konsep ini sangat penting dalam pemecahan masalah nyata?",
      "spaceForAnswer": true
    },
    {
      "number": 2,
      "question": "Analisis apa kelebihan dan kelemahan dari solusi yang Anda tawarkan?",
      "spaceForAnswer": true
    },
    {
      "number": 3,
      "question": "Tuliskan refleksi kelompok: kendala apa yang Anda hadapi dan bagaimana mengatasinya?",
      "spaceForAnswer": true
    }
  ],
  "reflection": "Lembar refleksi mandiri untuk mengukur pemahaman peserta didik."
}`;

  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}

// 3. Bank Soal & Asesmen Prompt
export function createQuestionBankPrompt(
  ctx: AIContext,
  topic: string,
  bloomLevel: string = "C4",
  type: string = "PG",
  count: number = 5
): { prompt: string; systemInstruction: string } {
  const prompt = `${buildContextString({ ...ctx, topic })}
Buatkan ${count} butir SOAL evaluasi berkualitas tinggi untuk materi "${topic}" dengan kriteria:
- Bentuk Soal: ${type}
- Tingkat Kognitif Bloom: ${bloomLevel}
- Lengkapi dengan Stimulus Kasus/Teks, Kunci Jawaban, dan Pembahasan Komprehensif.

Keluarkan dalam format JSON array terstruktur:
[
  {
    "topic": "${topic}",
    "bloomLevel": "${bloomLevel}",
    "type": "${type}",
    "stimulus": "Teks pengantar kontekstual atau studi kasus...",
    "questionText": "Pertanyaan butir soal...",
    "options": ["A. Opsi Satu", "B. Opsi Dua", "C. Opsi Tiga", "D. Opsi Empat"],
    "correctAnswer": "A",
    "explanation": "Penjelasan alasan ilmiah jawaban benar."
  }
]`;
  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}

export function createQuestionsPrompt(
  ctx: AIContext,
  count: number = 5,
  difficulty: string = "Sedang (MOTS)",
  type: string = "Pilihan Ganda",
  tp: string = ""
): { prompt: string; systemInstruction: string } {
  const prompt = `${buildContextString(ctx)}
Buatkan ${count} butir SOAL evaluasi berkualitas tinggi untuk materi "${ctx.topic || 'Materi'}" dengan kriteria:
- Bentuk Soal: ${type}
- Tingkat Kesukaran: ${difficulty}
- Tujuan Pembelajaran / Indikator: ${tp || 'Mampu menganalisis dan memecahkan masalah materi'}
- Lengkapi dengan Kunci Jawaban, Pembahasan Komprehensif, dan Level Kognitif Bloom (C1-C6).

Keluarkan dalam format JSON array terstruktur:
[
  {
    "questionText": "Teks soal yang kontekstual, memiliki stimulus gambar/kasus jika relevan...",
    "questionType": "${type}",
    "difficulty": "${difficulty}",
    "cognitiveLevel": "C4",
    "indicator": "Disajikan ilustrasi kasus, siswa dapat menganalisis solusi yang tepat",
    "options": [
      { "key": "A", "text": "Pilihan opsi A" },
      { "key": "B", "text": "Pilihan opsi B" },
      { "key": "C", "text": "Pilihan opsi C" },
      { "key": "D", "text": "Pilihan opsi D" },
      { "key": "E", "text": "Pilihan opsi E" }
    ],
    "correctAnswer": "A",
    "explanation": "Penjelasan ilmiah dan logis mengapa jawaban A benar dan opsi lainnya salah."
  }
]`;

  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}

// 4. Asesmen Diagnosis Prompt
export function createDiagnosticPrompt(ctx: AIContext, topic: string, totalQuestions: number = 5): { prompt: string; systemInstruction: string } {
  const prompt = `${buildContextString(ctx)}
Buatkan instrumen ASESMEN DIAGNOSIS LENGKAP untuk topik "${topic}" sebanyak ${totalQuestions} butir soal, mencakup:
1. Asesmen Non-Kognitif (gaya belajar, kesiapan mental, minat)
2. Asesmen Kognitif Prasyarat (pemahaman materi prasyarat)
3. Asesmen Kognitif Materi Pokok (pemahaman awal materi baru)

Keluarkan dalam format JSON:
{
  "title": "Asesmen Diagnosis: ${topic}",
  "topic": "${topic}",
  "learningObjectives": "Memetakan kesiapan belajar, gaya belajar, dan pemahaman awal siswa.",
  "questionsCount": ${totalQuestions},
  "questions": [
    {
      "number": 1,
      "category": "Non-Kognitif",
      "type": "Pilihan Ganda",
      "question": "Bagaimana cara belajar yang paling membuat Anda nyaman saat mempelajari materi baru?",
      "options": [
        { "key": "A", "text": "Melihat video visual dan diagram grafis" },
        { "key": "B", "text": "Mendengarkan penjelasan guru dan berdiskusi" },
        { "key": "C", "text": "Langsung mencoba mempraktikkan secara mandiri" }
      ],
      "answerKey": "Tidak ada kunci (Pemetaan Gaya Belajar)",
      "rubricExplanation": "A: Visual, B: Auditori, C: Kinestetik"
    },
    {
      "number": 2,
      "category": "Kognitif Prasyarat",
      "type": "Pilihan Ganda",
      "question": "Soal pemahaman materi dasar prasyarat...",
      "options": [
        { "key": "A", "text": "Opsi A" },
        { "key": "B", "text": "Opsi B" },
        { "key": "C", "text": "Opsi C" },
        { "key": "D", "text": "Opsi D" }
      ],
      "answerKey": "B",
      "rubricExplanation": "Mengukur kesiapan pondasi materi sebelum masuk ke topik utama."
    }
  ],
  "resultsSummary": "Pedoman tindak lanjut guru berdasarkan hasil asesmen diagnosis."
}`;

  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}

// 5. CP & ATP Prompt
export function createCPPrompt(subjectName: string, phase: string, element: string): { prompt: string; systemInstruction: string } {
  const prompt = `Susun Capaian Pembelajaran (CP) Kurikulum Merdeka yang komprehensif dan baku untuk:
- Mata Pelajaran: ${subjectName}
- Fase: ${phase}
- Elemen: ${element}

Keluarkan dalam format JSON:
{
  "element": "${element}",
  "description": "Uraian capaian pembelajaran mendalam yang memuat kompetensi dan lingkup materi esensial pada fase ini...",
  "keyConcepts": ["Konsep 1", "Konsep 2", "Konsep 3"]
}`;
  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}

export function createATPPrompt(ctx: AIContext, cpText: string): { prompt: string; systemInstruction: string } {
  const prompt = `${buildContextString(ctx)}
Berdasarkan Capaian Pembelajaran (CP) berikut:
"${cpText}"

Rancang Alur Tujuan Pembelajaran (ATP) terurut dan logis untuk 1 tahun ajaran (Semester 1 & 2) yang membagi materi menjadi modul-modul terukur.
Keluarkan dalam format JSON array:
[
  {
    "orderNumber": 1,
    "element": "Elemen Kompetensi",
    "topic": "Judul Materi / Modul",
    "learningObjective": "Peserta didik mampu ... (TP)",
    "allocatedHours": 6,
    "learningFlowSummary": "Uraian singkat urutan aktivitas dan asesmen"
  }
]`;
  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}

// 6. Bahan Ajar Prompt
export function createBahanAjarPrompt(ctx: AIContext, tp: string): { prompt: string; systemInstruction: string } {
  const prompt = `${buildContextString(ctx)}
Buatkan BAHAN AJAR / MODUL BELAJAR SISWA yang komprehensif, menarik, dan mudah dipahami untuk topik "${ctx.topic}" dengan Tujuan Pembelajaran: "${tp}".

Keluarkan dalam format JSON:
{
  "title": "Bahan Ajar: ${ctx.topic}",
  "summary": "Ringkasan konsep 1-2 paragraf yang memikat",
  "fullContent": "Uraian materi lengkap, terbagi dalam sub-bab A, B, C dengan penjelasan terperinci, analogi kontekstual, dan rumus/prosedur jika ada.",
  "examples": [
    "Contoh kasus 1 beserta solusinya",
    "Contoh kasus 2 dalam kehidupan nyata"
  ],
  "practiceProblems": [
    "Soal latihan mandiri 1 untuk melatih pemahaman",
    "Soal latihan analisis 2"
  ],
  "glossary": [
    { "term": "Istilah 1", "definition": "Definisi jelas" },
    { "term": "Istilah 2", "definition": "Definisi jelas" }
  ],
  "conclusion": "Kesimpulan pembelajaran yang merangkum poin inti materi."
}`;
  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}

// 7. KKTP Prompt
export function createKKTPPrompt(ctx: AIContext, tp: string): { prompt: string; systemInstruction: string } {
  const prompt = `${buildContextString(ctx)}
Buatkan KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP) dan INDIKATOR KETERCAPAIAN TUJUAN PEMBELAJARAN (IKTP) untuk Tujuan Pembelajaran: "${tp}".
Gunakan pendekatan Skala / Interval Nilai Kurikulum Merdeka (0-60 Belum Berkembang, 61-70 Cukup, 71-87 Baik, 88-100 Sangat Baik).

Keluarkan dalam format JSON:
{
  "learningObjective": "${tp}",
  "criteriaType": "Interval Nilai",
  "indicators": [
    "Mendeskripsikan konsep dan prinsip dasar secara tepat",
    "Menerapkan prosedur dan metode ilmiah dalam pemecahan masalah",
    "Menganalisis hasil observasi dan menyusun kesimpulan logis"
  ],
  "intervals": [
    {
      "label": "0 - 60 (Belum Berkembang)",
      "min": 0,
      "max": 60,
      "description": "Belum mampu mendeskripsikan dan menerapkan konsep dasar secara mandiri.",
      "followUp": "Belum mencapai ketuntasan, remedial di seluruh bagian dengan bimbingan intensif guru."
    },
    {
      "label": "61 - 70 (Cukup)",
      "min": 61,
      "max": 70,
      "description": "Mampu mendeskripsikan konsep dasar namun masih membutuhkan bantuan dalam penerapannya.",
      "followUp": "Belum mencapai ketuntasan, remedial pada indikator yang belum tuntas."
    },
    {
      "label": "71 - 87 (Baik)",
      "min": 71,
      "max": 87,
      "description": "Mampu mendeskripsikan dan menerapkan konsep serta prosedur secara mandiri dan benar.",
      "followUp": "Sudah mencapai ketuntasan, tidak perlu remedial, lanjut ke materi berikutnya."
    },
    {
      "label": "88 - 100 (Sangat Baik)",
      "min": 88,
      "max": 100,
      "description": "Sangat mahir mendeskripsikan, menganalisis secara mendalam, serta mampu berinovasi.",
      "followUp": "Sudah mencapai ketuntasan, diberikan program pengayaan atau tantangan eksplorasi lanjutan."
    }
  ]
}`;
  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}

// 8. Rubrik Penilaian Prompt
export function createRubricPrompt(
  ctx: AIContext,
  title: string,
  type: string = "Kinerja"
): { prompt: string; systemInstruction: string } {
  const prompt = `${buildContextString(ctx)}
Buatkan RUBRIK ASESMEN AUTENTIK (${type}) untuk tugas/proyek/kegiatan: "${title}".
Gunakan skala 4 tingkatan kriteria pencapaian (Sangat Baik/4, Baik/3, Cukup/2, Perlu Bimbingan/1).

Keluarkan dalam format JSON terstruktur:
{
  "title": "${title}",
  "type": "${type}",
  "criteria": [
    {
      "aspect": "Kualitas Konten & Ketepatan Konsep",
      "weight": 50,
      "descriptors": [
        { "level": "Sangat Baik (4)", "scoreRange": "86-100", "description": "Konsep disajikan sangat tepat, mendalam, dan bebas dari miskonsepsi." },
        { "level": "Baik (3)", "scoreRange": "76-85", "description": "Konsep disajikan tepat dengan penjelasan yang jelas." },
        { "level": "Cukup (2)", "scoreRange": "66-75", "description": "Terdapat sedikit kekurangan atau miskonsepsi minor." },
        { "level": "Perlu Bimbingan (1)", "scoreRange": "0-65", "description": "Sebagian besar konsep tidak tepat dan memerlukan pendampingan." }
      ]
    },
    {
      "aspect": "Kreativitas & Keterampilan Penyajian",
      "weight": 50,
      "descriptors": [
        { "level": "Sangat Baik (4)", "scoreRange": "86-100", "description": "Karya sangat inovatif, rapi, terstruktur, dan menarik." },
        { "level": "Baik (3)", "scoreRange": "76-85", "description": "Karya rapi, menarik, dan sesuai petunjuk." },
        { "level": "Cukup (2)", "scoreRange": "66-75", "description": "Karya cukup rapi namun kurang variasi." },
        { "level": "Perlu Bimbingan (1)", "scoreRange": "0-65", "description": "Karya tidak terstruktur dan belum memenuhi standar minimal." }
      ]
    }
  ]
}`;
  return { prompt, systemInstruction: SYSTEM_PROMPT_DEFAULT };
}
