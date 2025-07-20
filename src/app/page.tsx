"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import DashboardSummaryCard from "@/components/DashboardSummaryCard";
import DashboardMap from "@/components/DashboardMap";
import DashboardCharts from "@/components/DashboardCharts";


export default function Home() {
  const [eligible, setEligible] = useState<null | boolean>(null);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <section className="w-full max-w-6xl mt-8 mb-10">
        <div className="flex flex-col items-end mb-4">
          {/* Dua card utama sejajar */}
          <div className="w-full flex flex-col md:flex-row gap-8 mb-6">
            {/* Card Alumni */}
            <div className="flex-1 bg-white/80 rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
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
                    className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] hover:from-[#1976D2] hover:to-[#2196F3] text-white font-bold py-2 px-8 rounded-xl shadow transition-colors duration-200"
                  >
                    Ya
                  </button>
                  <button
                    onClick={() => setEligible(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-[#1976D2] font-bold py-2 px-8 rounded-xl shadow transition-colors duration-200"
                  >
                    Tidak
                  </button>
                </div>
                <div className="mt-4">
                  <Link
                    href={eligible ? "/alumni/profile" : "#"}
                    className={`inline-block font-bold py-3 px-8 rounded-xl shadow transition-colors duration-200 ${
                      eligible
                        ? "bg-[#1976D2] hover:bg-[#1565C0] text-white cursor-pointer"
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
                  <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-lg shadow p-4 text-center mt-4">
                    Terima kasih atas perhatian Anda.<br />
                    Maaf, Anda tidak memenuhi syarat sebagai responden.<br />
                    Survey ini ditujukan bagi alumni pelatihan pada rentang tahun 2021–2024.
                  </div>
                )}
              </div>
            </div>
            {/* Card Atasan/Rekan Kerja/Bawahan */}
            <div className="flex-1 bg-white/80 rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
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
                    className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] hover:from-[#1976D2] hover:to-[#2196F3] text-white font-bold py-2 px-8 rounded-xl shadow transition-colors duration-200"
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
