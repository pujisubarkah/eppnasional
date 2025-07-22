"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Data skala likert 1-4
const waktuData = [
  { kategori: "1", jumlah: 6 },
  { kategori: "2", jumlah: 12 },
  { kategori: "3", jumlah: 20 },
  { kategori: "4", jumlah: 40 },
];

export default function KesesuaianWaktuPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Kesesuaian Waktu dan Manfaat</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <p>
          Visualisasi berikut menunjukkan persepsi alumni terhadap pernyataan:<br />
          <span className="italic">
            &quot;Investasi waktu yang saya habiskan untuk mengikuti pelatihan sepadan dengan manfaat atau perkembangan yang saya peroleh&quot;
          </span>
        </p>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
        <h2 className="font-semibold text-[#1976D2] mb-2">Distribusi Jawaban Skala Likert</h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={waktuData} margin={{ top: 16, right: 32, left: 0, bottom: 8 }}>
            <XAxis dataKey="kategori" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="jumlah" fill="#1976D2" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-between mt-4 text-xs text-gray-600">
          <span>1 = Sangat Tidak Setuju</span>
          <span>2 = Tidak Setuju</span>
          <span>3 = Setuju</span>
          <span>4 = Sangat Setuju</span>
        </div>
      </div>
      {/* Simpulan */}
      <div className="bg-blue-50 border-l-4 border-blue-400 mt-8 p-6 rounded-xl shadow text-[#1976D2]">
        <h2 className="font-semibold mb-2">Simpulan</h2>
        <p>
          Berdasarkan distribusi jawaban, mayoritas responden merasa bahwa investasi waktu yang dihabiskan untuk mengikuti pelatihan sudah <b>sepadan dengan manfaat atau perkembangan yang diperoleh</b>. Hal ini terlihat dari dominasi jawaban pada kategori <b>3 (Setuju)</b> dan <b>4 (Sangat Setuju)</b> dibandingkan kategori lainnya.
        </p>
      </div>
    </div>
  );
}