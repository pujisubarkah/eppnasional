"use client";

import { useEffect, useState } from "react";
import { useProfileFormStore } from '@/lib/store/globalStore';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft } from "lucide-react";


type Option = { id: number; option_text: string };
type Question = { id: number; text: string; options: Option[] };

export default function DukunganLingkunganPage() {
  const [pertanyaanList, setPertanyaanList] = useState<Question[]>([]);
  const router = useRouter();
  const profileStore = useProfileFormStore();
  const [userId, setUserId] = useState<string>("");
  const [answers, setAnswers] = useState<(string|null)[]>([]);

  // Hydrate user_id dari Zustand, alumni_profile_form, atau user_id di localStorage
  useEffect(() => {
    let id = profileStore.id;
    if (!id && typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("alumni_profile_form");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.id) id = parsed.id;
        } catch {}
      }
      if (!id) id = localStorage.getItem("user_id") || "";
    }
    if (!id) {
      router.replace("/alumni/profile");
      return;
    }
    setUserId(id);
    // Sync ke localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user_id", id);
    }
  }, [profileStore.id, router]);

  // Hydrate answers from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alumni_dukunganlingkungan_answers");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setAnswers(parsed);
        } catch {}
      }
    }
  }, []);

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
        // Inisialisasi jawaban jika belum ada
        if (!answers.length) {
          setAnswers(Array(responses.length).fill(null));
        } else if (answers.length !== responses.length) {
          // Jika jumlah pertanyaan berubah, sesuaikan panjang array
          setAnswers((prev) => {
            const arr = Array(responses.length).fill(null);
            for (let i = 0; i < Math.min(prev.length, arr.length); i++) {
              arr[i] = prev[i];
            }
            // Auto-save to localStorage
            if (typeof window !== "undefined") {
              localStorage.setItem("alumni_dukunganlingkungan_answers", JSON.stringify(arr));
            }
            return arr;
          });
        }
      } catch {
        // handle error, optionally show toast
      }
    }
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (idx: number, value: string) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[idx] = value;
      // Auto-save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("alumni_dukunganlingkungan_answers", JSON.stringify(updated));
      }
      return updated;
    });
  };



  return (
    <div className="max-w-4xl mx-auto mt-8 bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-4 md:p-10 space-y-8 md:space-y-10 border border-[#B3E5FC]">
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
        Dukungan Lingkungan Kerja
      </h2>
      <div className="mb-6 md:mb-8 p-3 md:p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-sm md:text-base shadow">
        <span className="font-bold">Petunjuk:</span> Beri penilaian pada
        pernyataan berikut dengan menggunakan skala <b>1</b> hingga <b>4</b> di mana <b>1</b> berarti <b>Sangat Tidak Setuju</b> dan <b>4</b> berarti <b>Sangat Setuju</b>.
      </div>
      <div className="space-y-6 md:space-y-8">
        {pertanyaanList.map((q, i) => (
          <div
            key={q.id}
            className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 flex flex-col gap-3 hover:shadow-lg transition"
          >
            <label className="block font-semibold text-[#1976D2] text-base mb-2">
              {i + 1}. {q.text}
            </label>
            <div className="flex flex-row justify-between gap-4 mt-2">
              {q.options.map((opt, idx) => (
                <label
                  key={opt.id}
                  className="flex flex-col items-center text-xs font-medium cursor-pointer gap-2 px-2"
                >
                  <input
                    type="radio"
                    name={`dukungan-${i}`}
                    value={opt.option_text}
                    checked={answers[i] === opt.option_text}
                    onChange={() => handleAnswer(i, opt.option_text)}
                    className="accent-[#2196F3] scale-110 md:scale-125 mb-0 sm:mb-1"
                  />
                  <span className="text-[#1976D2] font-bold text-xs md:text-sm">
                    {opt.option_text.split(" ")[0]}
                  </span>
                  {/* Keterangan di bawah radio */}
                  <span className="text-gray-500 text-[10px] md:text-xs mt-1 text-center font-normal">
                    {(() => {
                      if (idx === 0) return "Sangat Tidak Setuju";
                      if (idx === 1) return "Tidak Setuju";
                      if (idx === 2) return "Setuju";
                      if (idx === 3) return "Sangat Setuju";
                      return opt.option_text;
                    })()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between gap-4">
        <button
          type="button"
          onClick={() => router.push("/alumni/evaluasi")}
          className="flex items-center gap-2 bg-white border border-[#B3E5FC] text-[#1976D2] px-6 md:px-8 py-2 md:py-3 rounded-xl shadow font-bold text-base md:text-lg tracking-wide hover:bg-[#E3F2FD] transition w-full md:w-auto justify-center"
        >
          <ArrowLeft size={20} />
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={async () => {
            if (answers.some((ans) => !ans)) {
              toast.error("Mohon isi semua pertanyaan terlebih dahulu!");
              return;
            }
            // Pastikan user_id selalu ada, fallback ke localStorage alumni_profile_form
            if (!userId) {
              toast.error("Data profil tidak ditemukan. Silakan lengkapi profil terlebih dahulu.");
              router.push("/alumni/profile");
              return;
            }
            try {
              // Gabungkan jawaban ke format JSON
              const answersJson: Record<string, string> = {};
              pertanyaanList.forEach((q, i) => {
                answersJson[`q${i + 1}`] = answers[i] ?? "";
              });
              const res = await fetch("/api/jawaban", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: userId,
                  answers: answersJson,
                  category_id: 2,
                }),
              });
              if (res.ok) {
                toast.success("Jawaban berhasil disimpan!");
                setAnswers(Array(pertanyaanList.length).fill(null));
                if (typeof window !== "undefined") {
                  localStorage.removeItem("alumni_dukunganlingkungan_answers");
                }
                router.push("/alumni/sikapprilaku");
              } else {
                const errorData = await res.json();
                toast.error(errorData.message || "Gagal menyimpan jawaban!");
              }
            } catch {
              toast.error("Gagal menyimpan jawaban!");
            }
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-6 md:px-10 py-2 md:py-3 rounded-xl shadow-lg font-bold text-base md:text-lg tracking-wide transition w-full md:w-auto justify-center"
        >
          Lanjut <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}