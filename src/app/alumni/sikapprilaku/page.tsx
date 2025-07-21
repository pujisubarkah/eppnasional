"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Send } from "lucide-react";
import { useProfileStore } from "@/lib/store/profileStore";
import { useSikapPrilakuStore } from "@/lib/store/sikapprilaku";

type Option = { id: number; option_text: string };
type Question = { id: number; text: string; options: Option[] };

export default function SikapPrilakuPage() {
  const [pertanyaanSikap, setPertanyaanSikap] = useState<Question | null>(null);
  const [pertanyaanKinerja, setPertanyaanKinerja] = useState<Question | null>(null);
  const [pertanyaanEkonomi, setPertanyaanEkonomi] = useState<Question | null>(null);
  const [pertanyaanDampak, setPertanyaanDampak] = useState<Question | null>(null);
  const [pertanyaanTema, setPertanyaanTema] = useState<Question | null>(null);

  const {
    sikap, setSikap,
    kinerja, setKinerja,
    ekonomi, setEkonomi,
    dampak, setDampak,
    dampakLain, setDampakLain,
    tema, setTema,
    clear
  } = useSikapPrilakuStore();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();
  const {  id: user_id } = useProfileStore();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const [resSikap, resKinerja, resEkonomi, resDampak, resTema] = await Promise.all([
          fetch("/api/pertanyaan/8").then((r) => r.json()),
          fetch("/api/pertanyaan/11").then((r) => r.json()),
          fetch("/api/pertanyaan/9").then((r) => r.json()),
          fetch("/api/pertanyaan/12").then((r) => r.json()),
          fetch("/api/pertanyaan/10").then((r) => r.json()),
        ]);
        setPertanyaanSikap(resSikap);
        setPertanyaanKinerja(resKinerja);
        setPertanyaanEkonomi(resEkonomi);
        setPertanyaanDampak(resDampak);
        setPertanyaanTema(resTema);
      } catch {
        // handle error, optionally show toast
      }
    }
    fetchQuestions();
  }, []);

  // Handler untuk checkbox maksimal 3 pilihan
  const handleCheckbox = (
    arr: string[],
    setArr: (v: string[]) => void,
    value: string,
    max: number
  ) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else if (arr.length < max) {
      setArr([...arr, value]);
    }
  };

  const handleSubmit = async () => {
    // Validasi semua pertanyaan terisi
    if (
      !sikap ||
      kinerja.length !== 3 ||
      !ekonomi ||
      dampak.length === 0 ||
      !tema
    ) {
      toast.error("Mohon isi semua pertanyaan dengan lengkap!");
      return;
    }

    try {
      // POST sikap
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaanSikap?.id,
          user_id,
          answer: sikap,
        }),
      });

      // POST kinerja (array, kirim satu per satu)
      for (const ans of kinerja) {
        await fetch("/api/answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_id: pertanyaanKinerja?.id,
            user_id,
            answer: ans,
          }),
        });
      }

      // POST ekonomi
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaanEkonomi?.id,
          user_id,
          answer: ekonomi,
        }),
      });

      // POST dampak (array, kirim satu per satu)
      for (const ans of dampak) {
        await fetch("/api/answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_id: pertanyaanDampak?.id,
            user_id,
            answer: ans === "Yang lain:" ? dampakLain : ans,
          }),
        });
      }

      // POST tema
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaanTema?.id,
          user_id,
          answer: tema,
        }),
      });

      toast.success(
        `Jawaban berhasil disimpan! Silakan klik tombol lanjut untuk melanjutkan.`
      );
      setIsSubmitted(true);
    } catch {
      toast.error("Gagal menyimpan jawaban!");
    }
  };

  const handleLanjut = () => {
    router.push("/alumni/sesuaiwaktu");
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
      <h2 className="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
        Sikap & Perilaku Pasca Pelatihan
      </h2>
      <div className="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
        <span className="font-bold">Petunjuk:</span> Silahkan centang pada poin yang sesuai dengan pernyataan berikut.
      </div>

      {/* 1. Pilihan perubahan sikap perilaku (radio) */}
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
        <label className="block font-semibold text-[#1976D2] mb-4">
          1. {pertanyaanSikap?.text || "Memuat pertanyaan..."}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pertanyaanSikap?.options?.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
            >
              <input
                type="radio"
                value={opt.option_text}
                checked={sikap === opt.option_text}
                onChange={() => setSikap(opt.option_text)}
                className="accent-[#2196F3] scale-125"
              />
              <span className="text-[#1976D2] font-medium">{opt.option_text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Pilih 3 dari 7+ opsi */}
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
        <label className="block font-semibold text-[#1976D2] mb-4">
          2. {pertanyaanKinerja?.text || "Memuat pertanyaan..."}{" "}
          <span className="text-[#2196F3]">(pilih 3)</span>:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pertanyaanKinerja?.options?.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
            >
              <input
                type="checkbox"
                value={opt.option_text}
                checked={kinerja.includes(opt.option_text)}
                onChange={() =>
                  handleCheckbox(kinerja, setKinerja, opt.option_text, 3)
                }
                disabled={
                  kinerja.length >= 3 && !kinerja.includes(opt.option_text)
                }
                className="accent-[#2196F3] scale-125"
              />
              <span className="text-[#1976D2] font-medium">{opt.option_text}</span>
            </label>
          ))}
        </div>
        {kinerja.length > 3 && (
          <div className="text-red-500 text-xs mt-2">Maksimal 3 pilihan.</div>
        )}
      </div>

      {/* 3. Pilih salah satu nilai ekonomi */}
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
        <label className="block font-semibold text-[#1976D2] mb-4">
          3. {pertanyaanEkonomi?.text || "Memuat pertanyaan..."}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pertanyaanEkonomi?.options?.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
            >
              <input
                type="radio"
                value={opt.option_text}
                checked={ekonomi === opt.option_text}
                onChange={() => setEkonomi(opt.option_text)}
                className="accent-[#2196F3] scale-125"
              />
              <span className="text-[#1976D2] font-medium">{opt.option_text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 4. Dampak keberlanjutan, pilih max 3, ada input lain */}
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
        <label className="block font-semibold text-[#1976D2] mb-4">
          4. {pertanyaanDampak?.text || "Memuat pertanyaan..."}{" "}
          <span className="text-[#2196F3]">(pilih maksimal 3)</span>:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pertanyaanDampak?.options?.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
            >
              <input
                type="checkbox"
                value={opt.option_text}
                checked={dampak.includes(opt.option_text)}
                onChange={() =>
                  handleCheckbox(
                    dampak,
                    setDampak,
                    opt.option_text,
                    3
                  )
                }
                disabled={
                  dampak.length >= 3 &&
                  !dampak.includes(opt.option_text) &&
                  opt.option_text !== "Yang lain:"
                }
                className="accent-[#2196F3] scale-125"
              />
              <span className="text-[#1976D2] font-medium">{opt.option_text}</span>
            </label>
          ))}
        </div>
        {dampak.includes("Yang lain:") && (
          <div className="mt-2">
            <Input
              type="text"
              value={dampakLain}
              onChange={(e) => setDampakLain(e.target.value)}
              className="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
              placeholder="Tuliskan dampak lain..."
            />
          </div>
        )}
        {dampak.length > 3 && (
          <div className="text-red-500 text-xs mt-2">Maksimal 3 pilihan.</div>
        )}
      </div>

      {/* 5. Tema RB Tematik, radio */}
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
        <label className="block font-semibold text-[#1976D2] mb-4">
          5. {pertanyaanTema?.text || "Memuat pertanyaan..."}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pertanyaanTema?.options?.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
            >
              <input
                type="radio"
                value={opt.option_text}
                checked={tema === opt.option_text}
                onChange={() => setTema(opt.option_text)}
                className="accent-[#2196F3] scale-125"
              />
              <span className="text-[#1976D2] font-medium">{opt.option_text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="pt-8 flex justify-between">
        <button
          type="button"
          onClick={() => router.push("/alumni/dukunganlingkungan")}
          className="flex items-center gap-2 bg-white border border-[#B3E5FC] text-[#1976D2] px-8 py-3 rounded-xl shadow font-bold text-lg tracking-wide hover:bg-[#E3F2FD] transition"
        >
          <ArrowLeft size={20} />
          Sebelumnya
        </button>
        {!isSubmitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg font-bold text-lg tracking-wide transition"
          >
            <Send size={20} /> Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleLanjut}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg font-bold text-lg tracking-wide transition"
          >
            Lanjut <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}