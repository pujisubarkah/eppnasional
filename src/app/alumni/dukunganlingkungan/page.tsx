"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Send } from "lucide-react";
import { useProfileStore } from "@/lib/store/profileStore";

type Option = { id: number; option_text: string };
type Question = { id: number; text: string; options: Option[] };

export default function DukunganLingkunganPage() {
  const [pertanyaanList, setPertanyaanList] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { id: user_id } = useProfileStore();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const ids = [3, 4, 5, 6, 7];
        const responses = await Promise.all(
          ids.map((id) =>
            fetch(`/api/pertanyaan/${id}`).then((res) => res.json())
          )
        );
        setPertanyaanList(responses);
        setAnswers(Array(responses.length).fill(null));
      } catch {
        // handle error, optionally show toast
      }
    }
    fetchQuestions();
  }, []);

  const handleAnswer = (idx: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (answers.some((ans) => !ans)) {
      toast.error("Mohon isi semua pertanyaan terlebih dahulu!");
      return;
    }
    try {
      for (let i = 0; i < pertanyaanList.length; i++) {
        await fetch("/api/answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question_id: pertanyaanList[i].id,
            user_id,
            answer: answers[i],
          }),
        });
      }
      toast.success(
        "Jawaban berhasil disimpan! Silakan klik tombol lanjut untuk melanjutkan."
      );
      setIsSubmitted(true);
    } catch {
      toast.error("Gagal menyimpan jawaban!");
    }
  };

  const handleLanjut = () => {
    router.push("/alumni/sikapprilaku");
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
      <h2 className="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
        Dukungan Lingkungan Kerja
      </h2>
      <div className="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
        <span className="font-bold">Petunjuk:</span> Beri penilaian pada
        pernyataan berikut dengan menggunakan skala{" "}
        <b>1</b> hingga <b>4</b> di mana <b>1</b> berarti <b>Sangat Tidak Setuju</b>{" "}
        dan <b>4</b> berarti <b>Sangat Setuju</b>.
      </div>
      <div className="space-y-8">
        {pertanyaanList.map((q, i) => (
          <div
            key={q.id}
            className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 flex flex-col gap-3 hover:shadow-lg transition"
          >
            <label className="block font-semibold text-[#1976D2] text-base mb-2">
              {i + 1}. {q.text}
            </label>
            <div className="flex justify-between gap-4 mt-2">
              {q.options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex flex-col items-center text-xs font-medium cursor-pointer"
                >
                  <input
                    type="radio"
                    name={`dukungan-${i}`}
                    value={opt.option_text}
                    checked={answers[i] === opt.option_text}
                    onChange={() => handleAnswer(i, opt.option_text)}
                    className="accent-[#2196F3] scale-125 mb-1"
                  />
                  <span className="text-[#1976D2] font-bold">
                    {opt.option_text.split(" ")[0]}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-between gap-2 mt-1 text-xs text-gray-500">
              {q.options.map((opt) => (
                <span key={opt.id}>{opt.option_text}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-8 flex justify-between">
        <button
          type="button"
          onClick={() => router.push("/alumni/evaluasi")}
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