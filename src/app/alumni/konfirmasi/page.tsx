"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, ArrowLeft } from "lucide-react";
import { useProfileStore } from "@/lib/store/profileStore";
import { useRouter } from "next/navigation";

export default function KonfirmasiPage() {
  const [setuju, setSetuju] = useState(false);
  const [loading, setLoading] = useState(false);
  const { nama } = useProfileStore();
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    // Tidak perlu fetch ke API, langsung tampilkan toast dan redirect
    toast.success(
      `Terima Kasih ${nama ? nama : ""}, telah menjadi bagian dari perbaikan! Masukan Anda akan kami gunakan untuk menjadikan pelatihan ke depan lebih relevan, berkualitas, dan bermakna.`
    );
    setTimeout(() => {
      router.push("/");
    }, 1800);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-8 space-y-8 border border-[#B3E5FC] mt-10">
      <h2 className="text-2xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
        Pernyataan Konfirmasi
      </h2>
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
        <p className="text-[#1976D2] font-medium text-base mb-4">
          Dengan ini, saya menyatakan bahwa seluruh jawaban yang saya berikan dalam
          formulir ini benar berdasarkan pengalaman dan penilaian saya secara
          jujur.
        </p>
        <label className="flex items-center gap-3 mt-2">
          <input
            type="checkbox"
            checked={setuju}
            onChange={(e) => setSetuju(e.target.checked)}
            className="accent-[#2196F3] scale-125"
          />
          <span className="text-[#1976D2] font-semibold">
            Saya setuju dan menyatakan kebenaran jawaban di atas.
          </span>
        </label>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-white border border-[#B3E5FC] text-[#1976D2] px-6 py-3 rounded-xl shadow font-bold text-lg tracking-wide hover:bg-[#E3F2FD] transition"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>
        <button
          type="button"
          disabled={!setuju || loading}
          onClick={handleSubmit}
          className={`bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-8 py-3 rounded-xl shadow-lg font-bold text-lg tracking-wide transition ${
            (!setuju || loading) ? "opacity-60 cursor-not-allowed" : ""
          } flex items-center gap-2`}
        >
          {loading ? "Menyimpan..." : "Kirim"}
          {!loading && <Send size={20} />}
        </button>
      </div>
    </div>
  );
}