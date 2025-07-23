"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";

import DashboardSummaryCard from "@/components/DashboardSummaryCard";
import DashboardMap from "@/components/DashboardMap";
import DashboardCharts from "@/components/DashboardCharts";

export default function Home() {
  const [eligible, setEligible] = useState<null | boolean>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-blue-300 px-4">
      {/* Hamburger & Mobile Menu */}
      <div className="w-full max-w-6xl mx-auto flex md:hidden justify-between items-center py-4 px-2">
        <Image
          src="/lanri.png"
          alt="Logo LAN RI"
          width={40}
          height={40}
          className="h-10 w-auto drop-shadow-md"
          priority
        />
        <button
          className="p-2 rounded focus:outline-none transition-all duration-300 hover:bg-blue-200 shadow-md"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Buka menu"
        >
          <Menu size={32} className="text-[#1976D2]" />
        </button>
      </div>
      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden transition-opacity duration-300" onClick={() => setMenuOpen(false)}>
          <nav
            className="absolute top-0 right-0 w-72 h-full bg-white/90 backdrop-blur-lg shadow-2xl flex flex-col gap-6 p-8 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
            style={{ borderTopLeftRadius: '2rem', borderBottomLeftRadius: '2rem' }}
          >
            {["Beranda", "Tentang Kami", "FaQ", "Kontak", "Login"].map((item, index) => (
              <Link key={index} href={`/${item.toLowerCase().replace(" ", "")}`} className="font-bold text-[#1976D2] text-lg transition-colors duration-200 hover:text-blue-700" onClick={() => setMenuOpen(false)}>
                {item}
              </Link>
            ))}
          </nav>
        </div>
      )}

      <section className="w-full max-w-6xl mt-8 mb-10">
        <div className="flex flex-col items-end mb-4">
          {/* Dua card utama sejajar */}
          <div className="w-full flex flex-col md:flex-row gap-8 mb-6">
            {/* Card Alumni */}
            <div className="flex-1 bg-white/70 rounded-3xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-blue-200 backdrop-blur-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-white">
              <div className="flex-shrink-0 flex flex-col items-center">
                <Image
                  src="/alumni.png"
                  alt="Alumni"
                  width={200}
                  height={200}
                  className="rounded-2xl shadow-lg border-4 border-[#B3E5FC] bg-white"
                />
                <span className="mt-2 text-sm text-[#1976D2] font-semibold">
                  Alumni Pelatihan
                </span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 text-lg mb-4">
                  Apakah Anda mengikuti <br />
                  <span className="font-bold text-[#1976D2]">
                    Pelatihan Kepemimpinan Nasional Tingkat I
                  </span>
                  ,{" "}
                  <span className="font-bold text-[#1976D2]">Tingkat II</span>
                  ,{" "}
                  <span className="font-bold text-[#1976D2]">Administrator</span>
                  ,{" "}
                  <span className="font-bold text-[#1976D2]">Pengawas</span>
                  , atau{" "}
                  <span className="font-bold text-[#1976D2]">
                    Pelatihan Dasar CPNS
                  </span>
                  <br />
                  pada rentang tahun{" "}
                  <span className="font-bold text-[#1976D2]">2021–2024</span>?
                </div>
                <div className="flex gap-4 mt-2">
                  <button
                    onClick={() => setEligible(true)}
                    className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] hover:from-[#1976D2] hover:to-[#2196F3] text-white font-bold py-2 px-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => setEligible(false)}
                    className="bg-gray-200 hover:bg-blue-100 text-[#1976D2] font-bold py-2 px-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Tidak
                  </button>
                </div>
                <div className="mt-4">
                  <Link
                    href={eligible ? "/alumni/profile" : "#"}
                    className={`inline-block font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 ${
                      eligible
                        ? "bg-[#1976D2] hover:bg-[#1565C0] text-white cursor-pointer hover:scale-105 hover:shadow-xl"
                        : "bg-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                    tabIndex={eligible ? 0 : -1}
                    aria-disabled={!eligible}
                    onClick={(e) => {
                      if (!eligible) e.preventDefault();
                    }}
                  >
                    Survey
                  </Link>
                </div>
                {eligible === false && (
                  <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-lg shadow p-4 text-center mt-4 animate-fade-in">
                    Terima kasih atas perhatian Anda.<br />
                    Maaf, Anda tidak memenuhi syarat sebagai responden.<br />
                    Survey ini ditujukan bagi alumni pelatihan pada rentang tahun 2021–2024.
                  </div>
                )}
              </div>
            </div>
            {/* Card Atasan/Rekan Kerja/Bawahan */}
            <div className="flex-1 bg-white/70 rounded-3xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6 border border-blue-200 backdrop-blur-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-white">
              <div className="flex-shrink-0 flex flex-col items-center">
                <Image
                  src="/atasan.png"
                  alt="Atasan/Rekan/Bawahan"
                  width={200}
                  height={200}
                  className="rounded-2xl shadow-lg border-4 border-[#B3E5FC] bg-white"
                />
                <span className="mt-2 text-sm text-[#1976D2] font-semibold">
                  Atasan / Rekan Kerja / Bawahan
                </span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 text-lg mb-4">
                  Survey ini juga ditujukan bagi{" "}
                  <span className="font-bold text-[#1976D2]">Atasan</span>,{" "}
                  <span className="font-bold text-[#1976D2]">Rekan Kerja</span>, atau{" "}
                  <span className="font-bold text-[#1976D2]">
                    Bawahan Alumni Pelatihan Tahun 2021–2024
                  </span>
                  .
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/review/profile"
                    className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] hover:from-[#1976D2] hover:to-[#2196F3] text-white font-bold py-2 px-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    Isi Survey
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <section className="w-full max-w-6xl mx-auto mb-16">
            {/* Komponen summary dan lainnya di bawah dua card utama */}
            <DashboardSummaryCard />
            <DashboardMap />
            <DashboardCharts />
          </section>
        </div>
      </section>
    </div>
  );
}
