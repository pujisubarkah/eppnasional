"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Send } from "lucide-react";
import { useProfileStore } from "@/lib/store/profileStore";
import { useSesuaiWaktuStore } from "@/lib/store/sesuaiwaktu";

type Option = { id: number; option_text: string };
type Question = { id: number; text: string; options: Option[] };

export default function PenilaianInvestasiWaktuPage() {
  const [pertanyaan, setPertanyaan] = useState<Question | null>(null);
  const { jawaban, setJawaban } = useSesuaiWaktuStore();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const router = useRouter();
  const { nama, id: user_id } = useProfileStore();

  useEffect(() => {
    async function fetchPertanyaan() {
      try {
        const res = await fetch("/api/pertanyaan/13");
        const data = await res.json();
        setPertanyaan(data);
      } catch {
        // handle error, optionally show toast
      }
    }
    fetchPertanyaan();
  }, []);

  const handleSubmit = async () => {
    if (!jawaban) {
      toast.error("Mohon pilih salah satu jawaban terlebih dahulu!");
      return;
    }
    try {
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaan?.id,
          user_id,
          answer: jawaban,
        }),
      });
      toast.success(
        `Jawaban berhasil disimpan! Terima kasih ${nama ? nama : ""}, tinggal satu tahap lagi terkait saran dan masukan pelatihan!`
      );
      setIsSubmitted(true);
    } catch {
      toast.error("Gagal menyimpan jawaban!");
    }
  };

  const handleLanjut = () => {
    router.push("/alumni/saranmasukan");
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
      <h2 className="text-2xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
        Penilaian Investasi Waktu
      </h2>
      <div className="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
        <span className="font-bold">Petunjuk:</span> Beri penilaian pada pernyataan berikut dengan menggunakan skala{" "}
        <b>1</b> hingga <b>4</b>, di mana <b>1</b> berarti <b>Sangat Tidak Setuju</b> dan <b>4</b> berarti{" "}
        <b>Sangat Setuju</b>.
      </div>
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 flex flex-col gap-3 hover:shadow-lg transition">
        <label className="block font-semibold text-[#1976D2] text-base mb-4">
          {pertanyaan?.text || "Memuat pertanyaan..."}
        </label>
        <div className="flex justify-between gap-4 mt-2">
          {pertanyaan?.options?.map((opt) => (
            <label
              key={opt.id}
              className="flex flex-col items-center text-xs font-medium cursor-pointer"
            >
              <input
                type="radio"
                value={opt.option_text}
                checked={jawaban === opt.option_text}
                onChange={() => setJawaban(opt.option_text)}
                className="accent-[#2196F3] scale-125 mb-1"
              />
              <span className="text-[#1976D2] font-bold">
                {opt.option_text.split(" ")[0]}
              </span>
            </label>
          ))}
        </div>
        <div className="flex justify-between gap-2 mt-1 text-xs text-gray-500">
          {pertanyaan?.options?.map((opt) => (
            <span key={opt.id}>{opt.option_text}</span>
          ))}
        </div>
      </div>
      <div className="pt-8 flex justify-between">
        <button
          type="button"
          onClick={() => router.push("/alumni/sikapprilaku")}
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