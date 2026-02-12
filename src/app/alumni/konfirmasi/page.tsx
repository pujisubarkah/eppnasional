"use client";

import { useState } from "react";
import { useProfileFormStore } from '@/lib/store/globalStore';
import { Send, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function KonfirmasiPage() {
  const [setuju, setSetuju] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  // Ambil id, nama, pelatihan_id dari globalStore
  const profileStore = useProfileFormStore();
  const nama = profileStore.nama;
  const router = useRouter();
  // Handler for checkbox (no popup here)
  const handleSetujuChange = (checked: boolean) => {
    setSetuju(checked);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulasi submit sukses, lalu tampilkan popup dan clear localStorage
    setTimeout(() => {
      // Clear semua localStorage terkait alumni
      if (typeof window !== "undefined") {
        localStorage.removeItem("alumni_profile_form");
        localStorage.removeItem("alumni_evaluasi_pelatihan_id");
        localStorage.removeItem("alumni_evaluasi_nama");
        localStorage.removeItem("alumni_evaluasi_user_id");
        localStorage.removeItem("alumni_evaluasi_jawaban_id");
        localStorage.removeItem("alumni_evaluasi_relevan");
        localStorage.removeItem("alumni_evaluasi_tidakRelevan");
        localStorage.removeItem("alumni_dukunganlingkungan_answers");
        // Tambahkan key lain jika ada step survey lain
      }
      setShowPopup(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 1800);
    }, 800);
  };

  return (
    <>
      {/* ...existing code... */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: 'transparent'}}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center border-2 border-[#B3E5FC] animate-fadeIn" style={{boxShadow: '0 8px 32px 0 rgba(33,150,243,0.15)'}}>
            <div className="flex gap-2 mb-4">
              <span className="text-[#1976D2]">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#E3F2FD"/><path d="M8 12l2 2 4-4" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span className="text-[#2196F3]">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#C2E7F6"/><path d="M12 8v4l3 3" stroke="#2196F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <span className="text-[#43A047]">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#C8E6C9"/><path d="M9 12l2 2 4-4" stroke="#43A047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#1976D2] mb-2 text-center">Terima Kasih {nama ? nama : ''}!</h3>
            <p className="text-[#1976D2] text-center mb-4">Telah mengisi survei yang telah kami lakukan.<br/>Masukan Anda sangat berarti bagi perbaikan pelatihan ke depan.</p>
            <button
              className="mt-2 px-6 py-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white rounded-xl font-bold shadow hover:scale-105 transition"
              onClick={() => setShowPopup(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      <div className="max-w-xl mx-auto mt-24 bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-4 md:p-8 space-y-6 md:space-y-8 border border-[#B3E5FC]">
        <h2 className="text-xl md:text-2xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
          Pernyataan Konfirmasi
        </h2>
        <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 mb-4 md:mb-6">
          <p className="text-[#1976D2] font-medium text-sm md:text-base mb-2 md:mb-4">
            Dengan ini, saya menyatakan bahwa seluruh jawaban yang saya berikan dalam
            formulir ini benar berdasarkan pengalaman dan penilaian saya secara
            jujur.
          </p>
          <label className="flex items-center gap-2 md:gap-3 mt-2">
            <input
              type="checkbox"
              checked={setuju}
              onChange={(e) => handleSetujuChange(e.target.checked)}
              className="accent-[#2196F3] scale-110 md:scale-125"
            />
            <span className="text-[#1976D2] font-semibold text-xs md:text-base">
              Saya setuju dan menyatakan kebenaran jawaban di atas.
            </span>
          </label>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-white border border-[#B3E5FC] text-[#1976D2] px-6 md:px-8 py-2 md:py-3 rounded-xl shadow font-bold text-base md:text-lg tracking-wide hover:bg-[#E3F2FD] transition w-full md:w-auto justify-center"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <button
            type="button"
            disabled={!setuju || loading}
            onClick={handleSubmit}
            className={`bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-6 md:px-8 py-2 md:py-3 rounded-xl shadow-lg font-bold text-base md:text-lg tracking-wide transition w-full md:w-auto justify-center ${
              (!setuju || loading) ? "opacity-60 cursor-not-allowed" : ""
            } flex items-center gap-2`}
          >
            {loading ? "Menyimpan..." : "Kirim"}
            {!loading && <Send size={20} />}
          </button>
        </div>
      </div>
    </>
  );
}