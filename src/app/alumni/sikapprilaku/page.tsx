"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, Send } from "lucide-react";
import { useProfileStore } from "@/lib/store/profileStore";
import { useSikapPrilakuStore } from "@/lib/store/sikapprilaku";

type Option = { id: number; option_text: string; ordering?: number; sub_pertanyaan?: { id: number; text: string }[] };
type Question = { id: number; text: string; options: Option[] };

export default function SikapPrilakuPage() {
  const profile = useProfileStore();
  const [pertanyaanSikap, setPertanyaanSikap] = useState<Question | null>(null);
  const [pertanyaanKinerja, setPertanyaanKinerja] = useState<Question | null>(null);
  const [pertanyaanEkonomi, setPertanyaanEkonomi] = useState<Question | null>(null);
  const [pertanyaanDampak, setPertanyaanDampak] = useState<Question | null>(null);
  const [pertanyaanTransformasi, setPertanyaanTransformasi] = useState<Question | null>(null);
  const [selectedTransformasi, setSelectedTransformasi] = useState<number | null>(null);
  const [selectedSubTransformasi, setSelectedSubTransformasi] = useState<number | null>(null);

  const {
    sikap, setSikap,
    kinerja, setKinerja,
    ekonomi, setEkonomi,
    dampak, setDampak,
    dampakLain, setDampakLain,
    tema, setTema
  } = useSikapPrilakuStore();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const { id: user_id } = useProfileStore();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const [resSikap, resKinerja, resEkonomi, resDampak, resTransformasi] = await Promise.all([
          fetch("/api/pertanyaan/8").then((r) => r.json()),
          fetch("/api/pertanyaan/11").then((r) => r.json()),
          fetch("/api/pertanyaan/9").then((r) => r.json()),
          fetch("/api/pertanyaan/10").then((r) => r.json()),
          fetch("/api/pertanyaan/26").then((r) => r.json()),
        ]);
        setPertanyaanSikap(resSikap);
        setPertanyaanKinerja(resKinerja);
        setPertanyaanEkonomi(resEkonomi);
        setPertanyaanDampak(resDampak);
        setPertanyaanTransformasi(resTransformasi);
      } catch {
        toast.error("Gagal memuat pertanyaan!");
      }
    }
    fetchQuestions();
  }, []);

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
    if (
      !sikap ||
      kinerja.length !== 3 ||
      !ekonomi ||
      dampak.length === 0
    ) {
      toast.error("Mohon isi semua pertanyaan dengan lengkap!");
      return;
    }
    try {
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaanSikap?.id,
          user_id,
          answer: sikap,
        }),
      });
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
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaanEkonomi?.id,
          user_id,
          answer: ekonomi,
        }),
      });
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
      // Removed POST for tema
      toast.success("Jawaban berhasil disimpan! Silakan klik tombol lanjut untuk melanjutkan.");
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
      {/* Tampilkan data profile dari zustand */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow border border-[#B3E5FC]">
        <div className="font-bold text-[#1976D2] mb-2">Profil Alumni (Zustand)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold">ID:</span> {profile.id}</div>
          <div><span className="font-semibold">Nama:</span> {profile.nama}</div>
          <div><span className="font-semibold">Pelatihan:</span> {profile.pelatihan_id}</div>
        </div>
      </div>
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
          {pertanyaanSikap?.options
            ?.filter((opt) => {
              if (profile.pelatihan_id === 5) {
                return opt.ordering === 5;
              } else {
                return opt.ordering !== 5;
              }
            })
            .map((opt) => (
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
          2. {pertanyaanKinerja?.text || "Memuat pertanyaan..."}
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

      {/* 4. Dampak (checkbox, bisa lebih dari satu) */}
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
        <label className="block font-semibold text-[#1976D2] mb-4">
          4. {pertanyaanDampak?.text || "Memuat pertanyaan..."}
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
                  handleCheckbox(dampak, setDampak, opt.option_text, 5)
                }
                className="accent-[#2196F3] scale-125"
              />
              <span className="text-[#1976D2] font-medium">{opt.option_text}</span>
            </label>
          ))}
        </div>
        {dampak.includes("Yang lain:") && (
          <input
            type="text"
            value={dampakLain}
            onChange={(e) => setDampakLain(e.target.value)}
            placeholder="Sebutkan dampak lain..."
            className="mt-2 p-2 border rounded w-full"
          />
        )}
      </div>


      {/* 5. Penerapan hasil pelatihan mendukung transformasi (api/pertanyaan/26) */}
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
        <label className="block font-semibold text-[#1976D2] mb-4">
          5. {pertanyaanTransformasi?.text || "Memuat pertanyaan..."}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pertanyaanTransformasi?.options?.map((opt: Option & { sub_pertanyaan?: { id: number; text: string }[] }) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
            >
              <input
                type="radio"
                value={opt.id}
                checked={selectedTransformasi === opt.id}
                onChange={() => {
                  setSelectedTransformasi(opt.id);
                  setSelectedSubTransformasi(null);
                }}
                className="accent-[#2196F3] scale-125"
              />
              <span className="text-[#1976D2] font-medium">{opt.option_text}</span>
            </label>
          ))}
        </div>
        {/* Sub pertanyaan muncul jika ada dan option dipilih */}
        {selectedTransformasi && (
          <div className="mt-4">
            <div className="font-semibold text-[#1976D2] mb-2">Sub Bidang:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pertanyaanTransformasi?.options
                ?.find((opt: Option) => opt.id === selectedTransformasi)?.sub_pertanyaan?.map((sub: { id: number; text: string }) => (
                  <label
                    key={sub.id}
                    className="flex items-center gap-3 bg-blue-100 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-200 transition cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={sub.id}
                      checked={selectedSubTransformasi === sub.id}
                      onChange={() => setSelectedSubTransformasi(sub.id)}
                      className="accent-[#1976D2] scale-125"
                    />
                    <span className="text-[#1976D2] font-medium">{sub.text}</span>
                  </label>
                ))}
            </div>
          </div>
        )}
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
        <>
          {isSubmitted ? (
            <button
              type="button"
              onClick={handleLanjut}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg font-bold text-lg tracking-wide transition"
            >
              Lanjut <ArrowRight size={20} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg font-bold text-lg tracking-wide transition"
            >
              <Send size={20} /> Submit
            </button>
          )}
        </>
      </div>
    </div>
    );
  }
