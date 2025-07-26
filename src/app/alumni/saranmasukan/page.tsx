"use client";

import { useState, useEffect } from "react";
import { useProfileFormStore } from '@/lib/store/globalStore';
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";


export default function SaranMasukanPage() {
  const router = useRouter();
  // Ambil id dari globalStore
  const profileStore = useProfileFormStore();
  const user_id = profileStore.id || "";
  const [materi, setMateri] = useState("");
  const [metode, setMetode] = useState("");
  const [waktu, setWaktu] = useState("");
  const [pengajar, setPengajar] = useState("");

  // If you need to get user_id, fetch from localStorage or API here
  useEffect(() => {
    // Example: setUserId(localStorage.getItem("user_id") || "");
  }, []);

  // State untuk label pertanyaan dari API
  const [pertanyaanLabels, setPertanyaanLabels] = useState({
    materi: "Terkait Materi Pelatihan",
    metode: "Terkait Metode Pelatihan",
    waktu: "Terkait Waktu Pelatihan",
    pengajar: "Terkait Pengajar Pelatihan",
  });


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

  // Jika ingin fetch text pertanyaan dari API, bisa gunakan useEffect di sini
  // Tapi karena id sudah fix dan text sudah sesuai, cukup gunakan id saja



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
          <button
            type="button"
            onClick={async () => {
              try {
                // Gabungkan jawaban ke format JSON
                const answersJson: Record<string, string> = {
                  q1: materi,
                  q2: metode,
                  q3: waktu,
                  q4: pengajar,
                };
                const res = await fetch("/api/jawaban", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user_id,
                    answers: answersJson,
                    category_id: 7,
                  }),
                });
                if (res.ok) {
                  toast.success("Saran & masukan berhasil disimpan!");
                  router.push("/alumni/konfirmasi");
                } else {
                  const errorData = await res.json();
                  toast.error(errorData.message || "Gagal menyimpan saran & masukan!");
                }
              } catch {
                toast.error("Gagal menyimpan saran & masukan!");
              }
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-6 md:px-10 py-2 md:py-3 rounded-xl shadow-lg font-bold text-base md:text-lg tracking-wide transition w-full md:w-auto justify-center"
          >
            Lanjut <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}