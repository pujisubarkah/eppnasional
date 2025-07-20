"use client";

import { useEffect, useState } from "react";

type Option = { id: number; option_text: string };
type Question = { id: number; text: string; options: Option[] };

export default function ReviewEvaluasiPage() {
  const [likertQuestions, setLikertQuestions] = useState<Question[]>([]);
  const [likertAnswers, setLikertAnswers] = useState<string[]>([]);
  const [openQuestion, setOpenQuestion] = useState<Question | null>(null);
  const [saran, setSaran] = useState("");

  useEffect(() => {
    // Fetch Likert questions
    const ids = [16, 17, 18, 19];
    Promise.all(
      ids.map((id) => fetch(`/api/pertanyaan/${id}`).then((r) => r.json()))
    ).then((results) => {
      setLikertQuestions(results);
      setLikertAnswers(Array(results.length).fill(""));
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit logic
    alert("Jawaban berhasil disimpan (dummy)");
  };

  return (
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
            className="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 flex flex-col gap-3 hover:shadow-lg transition"
          >
            <label className="block font-semibold text-[#1976D2] text-base mb-2">
              {idx + 1}. {q.text}
            </label>
            <div className="flex justify-between gap-4 mt-2">
              {q.options?.map((opt) => (
                <label
                  key={opt.id}
                  className="flex flex-col items-center text-xs font-medium"
                >
                  <input
                    type="radio"
                    name={`likert-${q.id}`}
                    value={opt.option_text}
                    checked={likertAnswers[idx] === opt.option_text}
                    onChange={() => handleLikertChange(idx, opt.option_text)}
                    required
                    className="accent-[#2196F3] scale-125 mb-1"
                  />
                  <span className="text-[#1976D2] font-bold">
                    {opt.option_text.split(" ")[0]}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-between gap-2 mt-1 text-xs text-gray-500">
              {q.options?.map((opt) => (
                <span key={opt.id}>{opt.option_text}</span>
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
            onChange={(e) => setSaran(e.target.value)}
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
          className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition"
        >
          Simpan
        </button>
      </div>
    </form>
  );
}