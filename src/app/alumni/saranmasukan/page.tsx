"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";
import { useProfileStore } from "@/lib/store/profileStore";
import { useSaranMasukanStore } from "@/lib/store/saranmasukan";

export default function SaranMasukanPage() {
  const router = useRouter();
  const { id: user_id } = useProfileStore();

  const { materi, setMateri, metode, setMetode, waktu, setWaktu, pengajar, setPengajar } = useSaranMasukanStore();

  // State untuk label pertanyaan dari API
  const [pertanyaanLabels, setPertanyaanLabels] = useState({
    materi: "Terkait Materi Pelatihan",
    metode: "Terkait Metode Pelatihan",
    waktu: "Terkait Waktu Pelatihan",
    pengajar: "Terkait Pengajar Pelatihan",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function fetchLabels() {
      try {
        const [materiRes, metodeRes, waktuRes, pengajarRes] = await Promise.all([
          fetch("/api/pertanyaan/21").then((r) => r.json()),
          fetch("/api/pertanyaan/22").then((r) => r.json()),
          fetch("/api/pertanyaan/23").then((r) => r.json()),
          fetch("/api/pertanyaan/24").then((r) => r.json()),
        ]);
        setPertanyaanLabels({
          materi: materiRes.text,
          metode: metodeRes.text,
          waktu: waktuRes.text,
          pengajar: pengajarRes.text,
        });
      } catch {
        // handle error, optionally show toast
      }
    }
    fetchLabels();
  }, []);

  // Simpan id pertanyaan dari API
  const pertanyaanIds = {
    materi: 21,
    metode: 22,
    waktu: 23,
    pengajar: 24,
  };

  // Jika ingin fetch text pertanyaan dari API, bisa gunakan useEffect di sini
  // Tapi karena id sudah fix dan text sudah sesuai, cukup gunakan id saja

  const handleSubmit = async () => {
    try {
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaanIds.materi,
          user_id,
          answer: materi ? materi : null,
        }),
      });
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaanIds.metode,
          user_id,
          answer: metode ? metode : null,
        }),
      });
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaanIds.waktu,
          user_id,
          answer: waktu ? waktu : null,
        }),
      });
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: pertanyaanIds.pengajar,
          user_id,
          answer: pengajar ? pengajar : null,
        }),
      });
      toast.success("Saran & masukan berhasil disimpan! Silakan klik tombol lanjut.");
      setIsSubmitted(true);
    } catch {
      toast.error("Gagal menyimpan saran & masukan!");
    }
  };

  const handleLanjut = () => {
    router.push("/alumni/konfirmasi");
  };

  return (
    <div className="max-w-3xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-4 md:p-10 space-y-8 md:space-y-10 border border-[#B3E5FC]">
      <h2 className="text-xl md:text-2xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
        Saran & Masukan
      </h2>
      <div className="space-y-6 md:space-y-8">
        <div>
          <label className="block font-semibold text-[#1976D2] mb-2 text-sm md:text-base">
            1. {pertanyaanLabels.materi}
          </label>
          <Textarea
            value={materi}
            onChange={(e) => setMateri(e.target.value)}
            placeholder="Tuliskan saran atau masukan terkait materi pelatihan..."
            className="w-full border border-[#90CAF9] rounded px-2 md:px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] shadow-sm transition text-sm md:text-base"
            rows={4}
          />
        </div>
        <div>
          <label className="block font-semibold text-[#1976D2] mb-2 text-sm md:text-base">
            2. {pertanyaanLabels.metode}
          </label>
          <Textarea
            value={metode}
            onChange={(e) => setMetode(e.target.value)}
            placeholder="Tuliskan saran atau masukan terkait metode pelatihan..."
            className="w-full border border-[#90CAF9] rounded px-2 md:px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] shadow-sm transition text-sm md:text-base"
            rows={4}
          />
        </div>
        <div>
          <label className="block font-semibold text-[#1976D2] mb-2 text-sm md:text-base">
            3. {pertanyaanLabels.waktu}
          </label>
          <Textarea
            value={waktu}
            onChange={(e) => setWaktu(e.target.value)}
            placeholder="Tuliskan saran atau masukan terkait waktu pelatihan..."
            className="w-full border border-[#90CAF9] rounded px-2 md:px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] shadow-sm transition text-sm md:text-base"
            rows={4}
          />
        </div>
        <div>
          <label className="block font-semibold text-[#1976D2] mb-2 text-sm md:text-base">
            4. {pertanyaanLabels.pengajar}
          </label>
          <Textarea
            value={pengajar}
            onChange={(e) => setPengajar(e.target.value)}
            placeholder="Tuliskan saran atau masukan terkait pengajar pelatihan..."
            className="w-full border border-[#90CAF9] rounded px-2 md:px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] shadow-sm transition text-sm md:text-base"
            rows={4}
          />
        </div>
        <div className="pt-4 flex flex-col md:flex-row justify-between gap-3 md:gap-6">
          <button
            type="button"
            onClick={() => router.push("/alumni/sesuaiwaktu")}
            className="flex items-center gap-2 bg-white border border-[#B3E5FC] text-[#1976D2] px-6 md:px-8 py-2 md:py-3 rounded-xl shadow font-bold text-base md:text-lg tracking-wide hover:bg-[#E3F2FD] transition w-full md:w-auto justify-center"
          >
            <ArrowLeft size={20} />
            Sebelumnya
          </button>
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-6 md:px-10 py-2 md:py-3 rounded-xl shadow-lg font-bold text-base md:text-lg tracking-wide transition w-full md:w-auto justify-center"
            >
              <Send size={20} /> Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLanjut}
              className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-6 md:px-10 py-2 md:py-3 rounded-xl shadow-lg font-bold text-base md:text-lg tracking-wide transition w-full md:w-auto justify-center"
            >
              Lanjut <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}