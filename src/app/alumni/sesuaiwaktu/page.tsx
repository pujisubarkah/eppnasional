"use client";

import { useEffect, useState } from "react";
import { useProfileFormStore } from '@/lib/store/globalStore';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft } from "lucide-react";


type Option = { id: number; option_text: string };
type Question = { id: number; text: string; options: Option[] };

export default function PenilaianInvestasiWaktuPage() {
  const [pertanyaan, setPertanyaan] = useState<Question | null>(null);
  const [jawaban, setJawaban] = useState<string>("");
  const profileStore = useProfileFormStore();
  const [userId, setUserId] = useState<string>("");
  const nama = profileStore.nama;
  const router = useRouter();

  // Hydrate user_id dari Zustand, alumni_profile_form, alumni_evaluasi_user_id, atau user_id di localStorage
  useEffect(() => {
    let id = profileStore.id;
    if (!id && typeof window !== "undefined") {
      // alumni_profile_form
      const savedProfile = localStorage.getItem("alumni_profile_form");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.id) id = parsed.id;
        } catch {}
      }
      // alumni_evaluasi_user_id
      if (!id) {
        const saved = localStorage.getItem("alumni_evaluasi_user_id");
        if (saved) id = saved;
      }
      // global user_id
      if (!id) {
        const globalId = localStorage.getItem("user_id");
        if (globalId) id = globalId;
      }
    }
    if (!id) {
      router.replace("/alumni/profile");
      return;
    }
    setUserId(String(id));
    if (typeof window !== "undefined") {
      localStorage.setItem("user_id", String(id));
      localStorage.setItem("alumni_evaluasi_user_id", String(id));
    }
  }, [profileStore.id, router]);

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



  return (
    <div className="max-w-3xl mx-auto mt-24 bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-4 md:p-10 space-y-8 md:space-y-10 border border-[#B3E5FC]">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
        Penilaian Investasi Waktu
      </h2>
      <div className="mb-6 md:mb-8 p-3 md:p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-sm md:text-base shadow">
        <span className="font-bold">Petunjuk:</span> Beri penilaian pada pernyataan berikut dengan menggunakan skala <b>1</b> hingga <b>4</b>, di mana <b>1</b> berarti <b>Sangat Tidak Setuju</b> dan <b>4</b> berarti <b>Sangat Setuju</b>.
      </div>
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 flex flex-col gap-2 md:gap-3 hover:shadow-lg transition">
        <label className="block font-semibold text-[#1976D2] text-sm md:text-base mb-2 md:mb-4">
          {pertanyaan?.text || "Memuat pertanyaan..."}
        </label>
        <div className="flex flex-row justify-between gap-4 mt-2">
          {pertanyaan?.options?.map((opt, idx) => (
            <label
              key={opt.id}
              className="flex flex-col items-center text-xs font-medium cursor-pointer gap-2 px-2"
            >
              <input
                type="radio"
                value={opt.option_text}
                checked={jawaban === opt.option_text}
                onChange={() => setJawaban(opt.option_text)}
                className="accent-[#2196F3] scale-110 md:scale-125 mb-0 sm:mb-1"
              />
              <span className="text-[#1976D2] font-bold text-xs md:text-sm">
                {opt.option_text.split(" ")[0]}
              </span>
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
      <div className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between gap-3 md:gap-6">
        <button
          type="button"
          onClick={() => router.push("/alumni/sikapprilaku")}
          className="flex items-center gap-2 bg-white border border-[#B3E5FC] text-[#1976D2] px-6 md:px-8 py-2 md:py-3 rounded-xl shadow font-bold text-base md:text-lg tracking-wide hover:bg-[#E3F2FD] transition w-full md:w-auto justify-center"
        >
          <ArrowLeft size={20} />
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={async () => {
            if (!jawaban) {
              toast.error("Mohon pilih salah satu jawaban terlebih dahulu!");
              return;
            }
            try {
              // Gabungkan jawaban ke format JSON
              const answersJson: Record<string, string> = {};
              if (pertanyaan?.id) {
                answersJson[`q1`] = jawaban;
              }
              const res = await fetch("/api/jawaban", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  user_id: userId,
                  answers: answersJson,
                  category_id: 4,
                }),
              });
              if (res.ok) {
                toast.success(`Jawaban berhasil disimpan! Terima kasih ${nama ? nama : ""}, tinggal satu tahap lagi terkait saran dan masukan pelatihan!`);
                router.push("/alumni/saranmasukan");
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