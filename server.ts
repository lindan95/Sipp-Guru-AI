import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Generation Endpoint
app.post("/api/ai/generate", async (req, res) => {
  try {
    const { prompt, systemInstruction, temperature = 0.7, jsonMode = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "API Key Gemini belum terkonfigurasi. Pastikan GEMINI_API_KEY tersedia di Secrets/Environment.",
      });
    }

    const config: any = {
      temperature: Number(temperature) || 0.7,
      systemInstruction:
        systemInstruction ||
        "Anda adalah AI Guru Assistant profesional untuk guru di Indonesia. Anda menguasai Kurikulum Merdeka dan Kurikulum Nasional. Berikan respons terstruktur, rapi, formal, kontekstual, dan siap pakai.",
    };

    if (jsonMode) {
      config.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config,
    });

    const outputText = response.text || "";

    res.json({
      success: true,
      text: outputText,
      data: jsonMode ? tryParseJSON(outputText) : null,
    });
  } catch (error: any) {
    console.error("AI Generation error:", error);
    res.status(500).json({
      error: error.message || "Gagal menghasilkan konten AI",
      success: false,
    });
  }
});

// AI Student Diagnosis Analysis Endpoint (Kurikulum Merdeka)
app.post("/api/ai/analyze-diagnosis", async (req, res) => {
  try {
    const {
      classInfo = {},
      subjectInfo = {},
      diagnostics = [],
      students = [],
      focusArea = "komprehensif",
      customInstruction = "",
    } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "API Key Gemini belum terkonfigurasi di Secrets/Environment.",
      });
    }

    // Format students and diagnostic input for AI prompt
    const diagnosticSummaryText = diagnostics.map((d: any, idx: number) => {
      const student = students.find((s: any) => s.id === d.studentId) || {};
      const stdName = student.name || d.studentName || `Siswa ${idx + 1}`;
      return `${idx + 1}. ${stdName}:
   - Gaya Belajar Dominan: ${d.learningStyle || "Belum ditentukan"}
   - Kesiapan Awal: ${d.readinessLevel || "Siap"}
   - Minat/Bakat: ${d.interest || "Umum"}
   - Skor Kognitif Awal: ${d.cognitiveScore ?? "Tidak ada data"}
   - Catatan Khusus: ${d.notes || "-"}`;
    }).join("\n");

    const prompt = `Anda adalah Ahli Pedagogik & Kurikulum Merdeka Indonesia (Spesialis Asesmen Diagnostik & Pembelajaran Berdiferensiasi).
Lakukan ANALISIS DIAGNOSIS SISWA secara mendalam, berbasis data hasil asesmen diagnostik kognitif dan non-kognitif (Gaya Belajar VAK, Kesiapan Belajar, Minat Siswa) untuk kelas berikut:

[DATA KELAS & MATA PELAJARAN]:
- Kelas: ${classInfo.name || "Kelas 10"} (${classInfo.phase || "Fase E"})
- Mata Pelajaran: ${subjectInfo.name || "Informatika"}
- Fokus Analisis: ${focusArea}
${customInstruction ? `- Catatan Guru Tambahan: ${customInstruction}` : ""}

[DATA HASIL ASESMEN DIAGNOSTIK SISWA]:
${diagnosticSummaryText || "Tidak ada data siswa individual spesifik, gunakan sampel 8 siswa standar fase ini."}

TUGAS ANDA:
Kembalikan JSON murni (valid JSON format) yang memuat struktur analisis diagnosis berikut:
{
  "overview": {
    "executiveSummary": "Ringkasan eksekutif komprehensif mengenai profil kesiapan kognitif dan gaya belajar siswa di kelas ini.",
    "readinessSummary": "Ringkasan temuan tingkat kesiapan siswa (perlu bimbingan, siap, mahir).",
    "learningStyleSummary": "Ringkasan dominasi gaya belajar (Visual, Auditori, Kinestetik) dan dampaknya terhadap metode mengajar.",
    "interestSummary": "Ringkasan klaster minat dan hobi siswa yang dapat dikaitkan dengan konteks materi.",
    "averageScore": 79.5,
    "highestScore": 94,
    "lowestScore": 68
  },
  "learningStyleDistribution": {
    "visual": 3,
    "auditory": 2,
    "kinesthetic": 3,
    "pedagogicalImplication": "Penjelasan implikasi pedagogik bagaimana guru harus merancang variasi stimulus visual, diskusi auditori, dan aktivitas kinestetik hands-on."
  },
  "readinessLevels": {
    "perluBimbinganCount": 2,
    "siapCount": 4,
    "mahirCount": 2,
    "pedagogicalImplication": "Strategi penanganan siswa yang perlu bimbingan dasar vs siswa yang siap diberikan pengayaan mandiri."
  },
  "differentiationStrategies": {
    "content": {
      "perluBimbingan": "Bahan ajar disederhanakan dengan infografis, glosarium konsep prasyarat, dan panduan langkah demi langkah.",
      "siap": "Bahan ajar standar sesuai Buku Teks Utama dan studi kasus aplikatif.",
      "mahir": "Materi pengayaan, artikel riset terbaru, dan tantangan analisis algoritma tingkat lanjut."
    },
    "process": {
      "perluBimbingan": "Pendampingan terbimbing langsung (scaffolding), kelompok kecil, dan demonstrasi bertahap.",
      "siap": "Diskusi kelompok terarah, eksplorasi mandiri dengan LKPD panduan terstruktur.",
      "mahir": "Investigasi mandiri, open-ended problem solving, dan peran sebagai tutor sebaya."
    },
    "product": {
      "perluBimbingan": "Menghasilkan rangkuman bagan alur sederhana atau lembar jawaban terpandu.",
      "siap": "Laporan tertulis/presentasi standar atau artefak proyek fungsional.",
      "mahir": "Produk inovatif, prototipe aplikasi mini, atau presentasi komparatif mendalam."
    },
    "learningEnvironment": "Penataan ruang kelas yang fleksibel: area pojok visual grafis, meja kolaborasi diskusi, dan sudut simulasi/praktik langsung."
  },
  "groupingRecommendations": [
    {
      "groupType": "Kelompok Homogen (Kesiapan Belajar Selevel)",
      "description": "Pengelompokan siswa berdasarkan tingkat kesiapan kognitif untuk mempermudah pemberian materi bertingkat (Tiered Instruction).",
      "groups": [
        {
          "name": "Kelompok Intervensi & Pondasi",
          "targetLevelOrStyle": "Paham Sebagian / Perlu Bimbingan",
          "studentNames": ["Bagus Pratama", "Dimas Arya Wijaya"],
          "strategy": "Mendapat pendampingan langsung oleh guru dengan LKPD terpandu bertahap."
        },
        {
          "name": "Kelompok Eksplorasi Mandiri",
          "targetLevelOrStyle": "Siap",
          "studentNames": ["Achmad Fauzan", "Adelia Rahmawati", "Farhan Maulana", "Gita Permata"],
          "strategy": "Mengerjakan proyek kelompok dengan instruksi terstruktur."
        },
        {
          "name": "Kelompok Pengayaan & Inovasi",
          "targetLevelOrStyle": "Mahir",
          "studentNames": ["Clarissa Putri", "Eka Nurul Fadilah"],
          "strategy": "Menyelesaikan tantangan studi kasus terbuka dan riset mini."
        }
      ]
    },
    {
      "groupType": "Kelompok Heterogen (Tutor Sebaya & Kolaboratif)",
      "description": "Pengelompokan silang yang memadukan siswa mahir dan perlu bimbingan dengan ragam gaya belajar berbeda.",
      "groups": [
        {
          "name": "Tim Kolaborasi Alpha",
          "targetLevelOrStyle": "Multi-Kesiapan & VAK",
          "studentNames": ["Clarissa Putri (Mahir/Visual)", "Bagus Pratama (Bimbingan/Kinestetik)", "Adelia Rahmawati (Siap/Auditori)"],
          "strategy": "Clarissa berperan sebagai fasilitator konsep, Adelia memimpin diskusi dan Bagus menangani aspek implementasi teknis/praktik."
        }
      ]
    }
  ],
  "individualStudentProfiles": [
    {
      "studentId": "std-001",
      "studentName": "Achmad Fauzan",
      "learningStyle": "Visual",
      "readinessLevel": "Siap",
      "cognitiveScore": 88,
      "interest": "Robotik & Web",
      "aiRecommendation": "Berikan tugas proyek pembuatan diagram sistem otomasi web. Sangat efektif dengan stimulus diagram dan flowchart.",
      "interventionCategory": "Reguler / Penguatan"
    }
  ],
  "actionPlanForModulAjar": [
    "Integrasikan diagram alir dan video animasi pada Kegiatan Pendahuluan Modul Ajar untuk memfasilitasi 3 siswa Visual dan 2 siswa Auditori.",
    "Siapkan 2 variasi LKPD (LKPD Scaffolding untuk Bagus & Dimas, LKPD Challenge untuk Clarissa & Eka).",
    "Gunakan metode demonstrasi interaktif pada Pertemuan 1 agar siswa Kinestetik langsung terlibat aktif.",
    "Bentuk kelompok kerja fleksibel pada saat kegiatan eksplorasi laboratorium komputer."
  ]
}
Pastikan seluruh nama siswa yang dianalisis sesuai dengan daftar data yang dikirimkan. Gunakan bahasa Indonesia profesional dan edukatif.`;

    const config: any = {
      temperature: 0.4,
      responseMimeType: "application/json",
      systemInstruction:
        "Anda adalah pakar asesmen dan kurikulum merdeka Indonesia. Hasilkan output JSON murni tanpa markdown pembungkus di luar JSON yang valid.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config,
    });

    const outputText = response.text || "";
    const parsedData = tryParseJSON(outputText);

    res.json({
      success: true,
      data: parsedData,
      rawText: outputText,
    });
  } catch (error: any) {
    console.error("AI Diagnosis Analysis error:", error);
    res.status(500).json({
      error: error.message || "Gagal melakukan analisis diagnosis AI",
      success: false,
    });
  }
});

// AI Chatbot Assistant Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages = [], contextData = {} } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "API Key Gemini belum terkonfigurasi di Secrets/Environment.",
      });
    }

    const contextSummary = `
[KONTEKS GURU & SEKOLAH SAAT INI]:
- Nama Guru: ${contextData.teacherName || "Guru"}
- Sekolah: ${contextData.schoolName || "Sekolah"}
- Mata Pelajaran Aktif: ${contextData.activeSubject || "-"}
- Kelas/Fase Aktif: ${contextData.activeClass || "-"} / ${contextData.activePhase || "-"}
- Tahun Ajaran / Semester: ${contextData.academicYear || "2024/2025"} / ${contextData.semester || "Ganjil"}
`;

    const chat = ai.chats.create({
      model: "gemini-3.7-flash",
      config: {
        systemInstruction: `Anda adalah AI GURU ASSISTANT terintegrasi untuk Web App Perangkat Pembelajaran Guru.
Tugas Anda:
1. Membantu guru menyusun CP, ATP, Modul Ajar, LKPD, Kisi-Kisi, Soal, Asesmen Diagnosis, Bahan Ajar, Media, dan Analisis Soal.
2. Memberikan saran pedagogik, diferensiasi pembelajaran, dan asesmen autentik.
3. Menghasilkan draf yang terstruktur sehingga guru bisa langsung mengklik "Masukkan ke Modul Ajar / LKPD / Soal".
Gunakan Bahasa Indonesia baku, santun, dan profesional.
${contextSummary}`,
      },
    });

    // Send the last message
    const lastUserMessage = messages[messages.length - 1]?.text || "Halo AI Assistant";
    const response = await chat.sendMessage({ message: lastUserMessage });

    res.json({
      success: true,
      reply: response.text || "",
    });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: error.message || "Gagal merespons chat" });
  }
});

// AI Text Editor Transformation
app.post("/api/ai/editor", async (req, res) => {
  try {
    const { text, action, customInstruction, targetGrade } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Teks tidak boleh kosong" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key tidak ditemukan." });
    }

    let instruction = "";
    switch (action) {
      case "fix_grammar":
        instruction = "Perbaiki ejaan, tanda baca, tata bahasa sesuai PUEBI/EYD V, dan rapikan susunan kalimat tanpa mengubah arti.";
        break;
      case "expand":
        instruction = "Perluas dan elaborasi teks berikut dengan penjelasan mendalam, contoh kontekstual, dan rincian langkah pembelajaran.";
        break;
      case "summarize":
        instruction = "Ringkas teks berikut secara padat, jelas, menggunakan poin-poin utama yang mudah dipahami.";
        break;
      case "simplify":
        instruction = `Sederhanakan bahasa dan istilah agar sangat mudah dipahami oleh peserta didik tingkat ${targetGrade || "sekolah"}.`;
        break;
      case "add_trigger_questions":
        instruction = "Buat 3-5 pertanyaan pemantik (essential/trigger questions) yang memicu daya nalar kritis dan rasa ingin tahu siswa berdasarkan teks ini.";
        break;
      case "generate_activity":
        instruction = "Berdasarkan materi ini, rancang 2 variasi aktivitas pembelajaran interaktif berbasis Student-Centered Learning (Problem Based / Project Based Learning).";
        break;
      default:
        instruction = customInstruction || "Perbaiki dan optimalkan teks ini untuk perangkat pembelajaran guru.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Instruksi: ${instruction}\n\nTeks Asli:\n"""\n${text}\n"""`,
    });

    res.json({
      success: true,
      result: response.text || "",
    });
  } catch (error: any) {
    console.error("AI Editor error:", error);
    res.status(500).json({ error: error.message || "Gagal memproses editor AI" });
  }
});

function tryParseJSON(text: string) {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

// Start Server with Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 SIPP Guru AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
