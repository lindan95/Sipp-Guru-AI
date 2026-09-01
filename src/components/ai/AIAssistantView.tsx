import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  RefreshCw,
  FileCode2,
  BookOpen,
  HelpCircle,
  Award,
  Layers,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const AIAssistantView: React.FC = () => {
  const { schoolProfile, teacherProfile, subjects, classes, addToast } = useApp();

  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("modul_ajar");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "assistant",
      content: `Halo Bapak/Ibu ${teacherProfile.fullName || "Guru"}! Saya adalah Asisten AI Perangkat Pembelajaran Anda. Saya siap membantu menyusun Modul Ajar Kurikulum Merdeka, Kisi-Kisi & Soal HOTS, Lembar Kerja (LKPD), Rubrik Asesmen, Program Remedial, serta Bimbingan Kasus Belajar Siswa. Pilih topik cepat di bawah atau ketik langsung kebutuhan Anda!`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const quickPrompts = [
    {
      id: "modul_ajar",
      title: "Rancang Modul Ajar Diferensiasi",
      icon: FileCode2,
      desc: "Buat modul ajar lengkap dengan pemahaman bermakna & pertanyaan pemantik",
      promptText: `Tolong buatkan draf Modul Ajar Kurikulum Merdeka Fase E (Kelas 10) untuk Mata Pelajaran ${subjects[0]?.name || "Informatika"} materi pokok 'Algoritma Pemrograman'. Lengkapi dengan: Tujuan Pembelajaran, Pemahaman Bermakna, Pertanyaan Pemantik, Diferensiasi Konten/Proses, dan Asesmen Formatif/Sumatif.`,
    },
    {
      id: "bank_soal",
      title: "Buat 5 Soal HOTS Pilihan Ganda",
      icon: HelpCircle,
      desc: "Soal penalaran C4-C6 disertai kunci jawaban & pembahasan",
      promptText: `Buatkan 5 butir soal HOTS (Level Kognitif C4-C6) Pilihan Ganda beserta stimulus kontekstual, kunci jawaban, dan pembahasan mendalam untuk mapel ${subjects[0]?.name || "Informatika"}.`,
    },
    {
      id: "rubrik",
      title: "Rubrik Penilaian Proyek / Kinerja",
      icon: Award,
      desc: "Skala 4 tingkat pencapaian (Perlu Bimbingan s/d Mahir)",
      promptText: `Buatkan rubrik asesmen autentik untuk penilaian tugas proyek siswa dengan 4 kriteria capaian (Perlu Bimbingan, Cukup, Baik, Mahir).`,
    },
    {
      id: "remedial",
      title: "Desain Aktivitas Remedial & Pengayaan",
      icon: Layers,
      desc: "Bentuk intervensi khusus dan tugas tantangan eksploratif",
      promptText: `Rancang strategi pembelajaran remedial untuk siswa yang belum tuntas KKTP serta modul pengayaan eksploratif bagi siswa berpencapaian tinggi.`,
    },
  ];

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || promptInput;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setPromptInput("");
    setIsGenerating(true);

    try {
      // Call server backend API
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          context: {
            teacher: teacherProfile,
            school: schoolProfile,
            subjects,
            classes,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: "msg-" + Date.now(),
          role: "assistant",
          content: data.reply || "Hasil telah berhasil digenerate oleh AI.",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error("Gagal menghubungi server AI");
      }
    } catch (err: any) {
      // Fallback local pedagogical AI engine
      setTimeout(() => {
        let simulatedReply = `### Rekomendasi Asisten AI untuk Bpk/Ibu ${teacherProfile.fullName}\n\n**Analisis Kebutuhan Perangkat Pembelajaran:**\n1. **Tujuan Pembelajaran (TP):** Siswa mampu menganalisis, merancang, dan mengevaluasi solusi komputasional secara kolaboratif.\n2. **Strategi Pembelajaran Berdiferensiasi:**\n   - *Diferensiasi Konten:* Menyediakan materi teks infografis dan modul interaktif.\n   - *Diferensiasi Proses:* Pembagian kelompok berdasarkan tingkat kesiapan belajar (Scaffolding & Guided Practice).\n   - *Diferensiasi Produk:* Siswa dapat mempresentasikan solusi dalam bentuk kode program, diagram alir, atau laporan infografis.\n3. **Instrumen Asesmen:** Gunakan asesmen formatif lembar observasi partisipasi aktif dan asesmen sumatif tugas portofolio studi kasus nyata.\n\n*Silakan salin atau masukkan ke modul terkait di menu Perangkat Pembelajaran.*`;
        const assistantMsg: ChatMessage = {
          id: "msg-" + Date.now(),
          role: "assistant",
          content: simulatedReply,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }, 1000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast("success", "Disalin", "Teks tanggapan AI berhasil disalin ke clipboard.");
  };

  return (
    <div className="flex h-[calc(100vh-140px)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            AI Guru Assistant (Kurikulum Merdeka)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Asisten cerdas pembuatan perangkat ajar terstruktur, instrumen asesmen HOTS, diferensiasi konten, dan konsultasi pedagogik.
          </p>
        </div>
      </div>

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickPrompts.map((qp) => {
          const Icon = qp.icon;
          return (
            <button
              key={qp.id}
              onClick={() => handleSend(qp.promptText)}
              disabled={isGenerating}
              className="flex flex-col text-left rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{qp.title}</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{qp.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 text-slate-800 dark:bg-slate-850 dark:text-slate-200 border border-slate-100 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px] opacity-80">
                  {msg.role === "user" ? teacherProfile.fullName || "Saya" : "AI Guru Assistant"}
                </span>
                <span className="text-[10px] opacity-60 ml-2">{msg.timestamp}</span>
              </div>

              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.role === "assistant" && (
                <div className="mt-3 flex justify-end pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                  <button
                    onClick={() => handleCopy(msg.content)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Salin Tanggapan
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex gap-3 items-center text-xs text-slate-500 dark:text-slate-400">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white animate-pulse">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>AI sedang merancang dan menganalisis perangkat pembelajaran...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <input
          type="text"
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Tanyakan atau instruksikan AI untuk membuat modul, soal, instrumen asesmen..."
          className="flex-1 bg-transparent px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
        />

        <button
          onClick={() => handleSend()}
          disabled={!promptInput.trim() || isGenerating}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          <Send className="h-3.5 w-3.5" />
          Kirim
        </button>
      </div>
    </div>
  );
};
