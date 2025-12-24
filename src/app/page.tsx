"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import DashboardSummaryCard from "@/components/DashboardSummaryCard";
import DashboardMap from "@/components/DashboardMap";
import DashboardCharts from "@/components/DashboardCharts";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [isSurveyOpen] = useState(true); // Set ke true jika survei dibuka
  const router = useRouter();

  // Clear all relevant localStorage keys on homepage load
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("alumni_profile_form");
      localStorage.removeItem("alumni_evaluasi_pelatihan_id");
      localStorage.removeItem("alumni_evaluasi_nama");
      localStorage.removeItem("alumni_evaluasi_user_id");
      localStorage.removeItem("alumni_evaluasi_jawaban_id");
      localStorage.removeItem("alumni_evaluasi_relevan");
      localStorage.removeItem("alumni_evaluasi_tidakRelevan");
      localStorage.removeItem("alumni_dukunganlingkungan_answers");
      localStorage.removeItem("review_evaluasi_answers");
      // Tambahkan key lain jika ada step survey lain
    }
  }, []);

  const handleSurveyClick = (surveyType: 'alumni' | 'review') => {
    if (isSurveyOpen) {
      // Jika survei dibuka, arahkan ke form
      if (surveyType === 'alumni') {
        router.push('/alumni/profile');
      } else {
        router.push('/review/profile');
      }
    } else {
      // Jika survei ditutup, tampilkan modal
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 px-4 mt-24">
      {/* Navbar removed, handled in layout */}

    
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto mt-12 mb-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card Alumni */}
        <div className="bg-white/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border-2 border-[#2196F3] outline-2 outline-[#2196F3] hover:shadow-2xl transition-all duration-300">
          <Image src="/alumni.png" alt="Alumni" width={100} height={100} className="mb-4 drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-[#1976D2] mb-2">Survei Alumni</h2>
          <p className="text-gray-700 mb-4">Survei ini khusus untuk alumni pelatihan LAN RI tahun 2021–2024. Silakan isi jika Anda adalah alumni pelatihan tersebut.</p>
          <button 
            onClick={() => handleSurveyClick('alumni')}
            className="inline-block bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-8 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition cursor-pointer"
          >
            Isi Survei Alumni
          </button>
        </div>
        {/* Card Atasan/Rekan/Bawahan */}
        <div className="bg-white/90 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center border-2 border-[#2196F3] outline-2 outline-[#2196F3] hover:shadow-2xl transition-all duration-300">
          <Image src="/atasan.png" alt="Atasan/Rekan/Bawahan" width={100} height={100} className="mb-4 drop-shadow-lg" />
          <h2 className="text-2xl font-bold text-[#1976D2] mb-2">Survei Atasan/Rekan/Bawahan</h2>
          <p className="text-gray-700 mb-4">Survei ini untuk atasan, rekan kerja, atau bawahan alumni pelatihan LAN RI tahun 2021–2024. Silakan isi jika Anda ingin menilai alumni.</p>
          <button 
            onClick={() => handleSurveyClick('review')}
            className="inline-block bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-8 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition cursor-pointer"
          >
            Isi Survei Atasan/Rekan/Bawahan
          </button>
        </div>
      </section>

      {/* Scrolling Thank You Message */}
      <section className="w-full max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="py-4 px-6">
            <div className="relative overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                <span className="text-white text-lg font-semibold mx-8">
                  🎉 Terima Kasih Kepada Semua Responden Yang Telah Mengisi Survey Pasca Pelatihan LAN RI 2021-2024! Kontribusi Anda Sangat Berarti Untuk Pengembangan Pelatihan ASN di Indonesia 🇮🇩
                </span>
                <span className="text-white text-lg font-semibold mx-8">
                  🎉 Terima Kasih Kepada Semua Responden Yang Telah Mengisi Survey Pasca Pelatihan LAN RI 2021-2024! Kontribusi Anda Sangat Berarti Untuk Pengembangan Pelatihan ASN di Indonesia 🇮🇩
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white/90 rounded-2xl shadow-lg border-2 border-[#2196F3] outline-2 outline-[#2196F3] p-8 flex flex-col items-center text-center">
          <Image src="/file.svg" alt="File" width={48} height={48} className="mb-4" />
          <h3 className="text-xl font-bold text-[#1976D2] mb-2">Mudah & Cepat</h3>
          <p className="text-gray-600">Pengisian survei hanya membutuhkan waktu 3-5 menit. Prosesnya praktis dan responsif di semua perangkat.</p>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-lg border-2 border-[#2196F3] outline-2 outline-[#2196F3] p-8 flex flex-col items-center text-center">
          <Image src="/globe.svg" alt="Globe" width={48} height={48} className="mb-4" />
          <h3 className="text-xl font-bold text-[#1976D2] mb-2">Nasional & Terintegrasi</h3>
          <p className="text-gray-600">Survei ini diikuti oleh alumni ASN dari seluruh Indonesia, terintegrasi dengan sistem LAN RI.</p>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-lg border-2 border-[#2196F3] outline-2 outline-[#2196F3] p-8 flex flex-col items-center text-center">
          <Image src="/window.svg" alt="Window" width={48} height={48} className="mb-4" />
          <h3 className="text-xl font-bold text-[#1976D2] mb-2">Privasi Terjaga</h3>
          <p className="text-gray-600">Data dan jawaban Anda dijamin kerahasiaannya, hanya digunakan untuk keperluan evaluasi dan pengembangan pelatihan.</p>
        </div>
      </section>

      {/* Dashboard Section (optional, uncomment if needed) */}
      <section className="w-full max-w-6xl mx-auto mb-16">
        <DashboardSummaryCard />
        <DashboardMap />
        <DashboardCharts />
      </section>

      {/* Footer removed, handled in layout */}

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Maaf Survei Telah Ditutup
              </h2>
              
              <p className="text-gray-600 mb-4">
                Terima kasih buat Anda yang telah berpartisipasi
              </p>
              
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
