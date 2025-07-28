"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProfileFormStore } from "@/lib/store/alumni_profile";
import { CheckCircle } from "lucide-react";

type Option = { id: number; option_text: string };
type Question = { id: number; text: string; options: Option[] };

export default function ReviewEvaluasiPage() {
  const router = useRouter();
  const { form } = useProfileFormStore();
  const [showModal, setShowModal] = useState(false);
  const [likertQuestions, setLikertQuestions] = useState<Question[]>([]);
  const [likertAnswers, setLikertAnswers] = useState<string[]>([]);
  const [openQuestion, setOpenQuestion] = useState<Question | null>(null);
  const [saran, setSaran] = useState("");

  // Hydrate answers from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('review_evaluasi_answers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.likertAnswers)) setLikertAnswers(parsed.likertAnswers);
          if (typeof parsed.saran === 'string') setSaran(parsed.saran);
        } catch {}
      }
    }
  }, []);
  // Removed unused isSubmitted state
  // Toast sonner
  // Gunakan id dari zustand sebagai user_id (langsung ambil form.id)
  const user_id = form.id;

  useEffect(() => {
    // Fetch Likert questions
    const ids = [16, 17, 18, 19];
    Promise.all(
      ids.map((id) => fetch(`/api/pertanyaan/${id}`).then((r) => r.json()))
    ).then((results) => {
      setLikertQuestions(results);
      // Only set empty answers if not already hydrated
      setLikertAnswers(prev => prev.length === results.length ? prev : Array(results.length).fill(""));
    });

    // Fetch open question
    fetch("/api/pertanyaan/20")
      .then((r) => r.json())
      .then(setOpenQuestion);
  }, []);

  const handleLikertChange = (idx: number, value: string) => {
    const updated = [...likertAnswers];
    updated[idx] = value;
    setLikertAnswers(updated);
    // Auto-save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('review_evaluasi_answers', JSON.stringify({ likertAnswers: updated, saran }));
    }
  };

  // Auto-save saran to localStorage
  const handleSaranChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSaran(e.target.value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('review_evaluasi_answers', JSON.stringify({ likertAnswers, saran: e.target.value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Gabungkan semua pertanyaan dan jawaban
      const pertanyaanList = openQuestion
        ? [...likertQuestions, openQuestion]
        : [...likertQuestions];
      const answers = openQuestion
        ? [...likertAnswers, saran]
        : [...likertAnswers];
      if (answers.some((ans) => !ans)) {
        setDialogError("Mohon isi semua pertanyaan terlebih dahulu!");
        return;
      }
      // Debug: cek user_id
      console.log('DEBUG user_id before submit:', user_id);
      // Gabungkan jawaban ke format JSON
      const answersJson: Record<string, string> = {};
      pertanyaanList.forEach((q, i) => {
        answersJson[`q${i + 1}`] = answers[i] ?? "";
      });
      const res = await fetch("/api/jawaban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          answers: answersJson,
          category_id: 6,
        }),
      });
      if (res.ok) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('review_evaluasi_answers');
        }
        setShowModal(true);
      } else {
        const errorData = await res.json();
        setDialogError(errorData.message || "Gagal menyimpan jawaban!");
      }
    } catch {
      setDialogError("Gagal menyimpan jawaban!");
    }
  };

  // Dialog error state
  const [dialogError, setDialogError] = useState<string | null>(null);

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-[#B3E5FC]">
            <h3 className="text-2xl font-bold text-[#1976D2] mb-4">Terima Kasih!</h3>
            <p className="mb-6 text-gray-700">
              Terima kasih atas partisipasi Anda.<br />
              Pendapat <span className="font-semibold">{form.namaAnda}</span> sangat berarti dan akan menjadi bagian penting dari upaya perubahan yang berkelanjutan.
            </p>
            <button
              className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-8 py-3 rounded-xl shadow-lg font-bold text-lg tracking-wide transition flex items-center justify-center gap-2"
              onClick={() => {
                setShowModal(false);
                router.push("/");
              }}
            >
              Selesai
            </button>
          </div>
        </div>
      )}
      {dialogError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-[#EF9A9A]">
            <h3 className="text-2xl font-bold text-[#D32F2F] mb-4">Gagal</h3>
            <p className="mb-6 text-gray-700">{dialogError}</p>
            <button
              className="bg-gradient-to-r from-[#EF5350] to-[#D32F2F] text-white px-8 py-3 rounded-xl shadow-lg font-bold text-lg tracking-wide transition flex items-center justify-center gap-2"
              onClick={() => setDialogError(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      <form
        className="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]"
        onSubmit={handleSubmit}
      >
      <h2 className="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
        Evaluasi Alumni oleh Atasan/Rekan/Bawahan
      </h2>
      <div className="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
        <span className="font-bold">Petunjuk:</span> Beri penilaian pada
        pernyataan berikut dengan menggunakan skala <b>1 hingga 4</b>, di mana{" "}
        <b>1</b> berarti <b>Sangat Tidak Setuju</b> dan <b>4</b> berarti{" "}
        <b>Sangat Setuju</b>.
      </div>
      <div className="space-y-8">
        {likertQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 flex flex-col gap-3 hover:shadow-lg transition"
          >
            <label className="block font-semibold text-[#1976D2] text-base mb-2">
              {idx + 1}. {q.text}
            </label>
            <div className="flex flex-col xs:flex-row md:flex-row justify-between gap-2 md:gap-4 mt-2 w-full">
              {q.options?.map((opt, optIdx) => (
                <label
                  key={opt.id}
                  className="flex flex-col items-center text-xs font-medium cursor-pointer gap-1 md:gap-2 px-1 md:px-2 w-full"
                  style={{ minWidth: 0 }}
                >
                  <input
                    type="radio"
                    name={`likert-${q.id}`}
                    value={opt.option_text}
                    checked={likertAnswers[idx] === opt.option_text}
                    onChange={() => handleLikertChange(idx, opt.option_text)}
                    required
                    className="accent-[#2196F3] scale-110 md:scale-125 mb-0 sm:mb-1"
                  />
                  <span className="text-[#1976D2] font-bold text-xs md:text-sm">
                    {opt.option_text.split(" ")[0]}
                  </span>
                  <span className="text-gray-500 text-[10px] md:text-xs mt-1 text-center font-normal">
                    {(() => {
                      if (optIdx === 0) return "Sangat Tidak Setuju";
                      if (optIdx === 1) return "Tidak Setuju";
                      if (optIdx === 2) return "Setuju";
                      if (optIdx === 3) return "Sangat Setuju";
                      return opt.option_text;
                    })()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      {openQuestion && (
        <div className="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 flex flex-col gap-3 hover:shadow-lg transition">
          <label className="block font-semibold text-[#1976D2] mb-2">
            {openQuestion.text}{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={saran}
            onChange={handleSaranChange}
            required
            className="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
            rows={3}
            placeholder="Tulis saran, masukan, atau harapan Anda..."
          />
        </div>
      )}
      <div className="text-center pt-2">
        <button
          type="submit"
          className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition flex items-center justify-center gap-2"
        >
          <CheckCircle size={20} className="mr-1" /> Simpan
        </button>
      </div>
      {/* Data dari Store (Zustand) section removed as requested */}
      </form>
    </>
  );
}