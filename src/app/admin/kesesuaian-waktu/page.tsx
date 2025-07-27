"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

type DivergingRow = {
  kategori: string;
  negatif: number;
  positif: number;
};

export default function KesesuaianWaktuPage() {
  const [chartData, setChartData] = useState<DivergingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/waktu");
        if (!res.ok) throw new Error("Gagal memuat data");
        const data = await res.json();
        // Transform to diverging format
        const negatif = data.data["2 - Tidak Setuju"] ?? 0;
        const positif = data.data["3 - Setuju"] ?? 0;
        setChartData([
          { kategori: "Tidak Setuju", negatif, positif: 0 },
          { kategori: "Setuju", negatif: 0, positif },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
        <h2 className="font-semibold text-[#1976D2] mb-2">Distribusi Jawaban (Diverging Stacked Bar)</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 16, right: 32, left: 0, bottom: 8 }}>
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="kategori" width={220} />
              <Tooltip />
              <Legend />
              <Bar dataKey="negatif" stackId="a" fill="#EF9A9A" />
              <Bar dataKey="positif" stackId="a" fill="#1976D2" />
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="flex justify-between mt-4 text-xs text-gray-600">
          <span>2 = Tidak Setuju</span>
          <span>3 = Setuju</span>
        </div>
      </div>
      {/* Simpulan */}
      <div className="bg-blue-50 border-l-4 border-blue-400 mt-8 p-6 rounded-xl shadow text-[#1976D2]">
        <h2 className="font-semibold mb-2">Simpulan</h2>
        <p>
          Berdasarkan distribusi jawaban, mayoritas responden merasa bahwa investasi waktu yang dihabiskan untuk mengikuti pelatihan sudah <b>sepadan dengan manfaat atau perkembangan yang diperoleh</b>. Hal ini terlihat dari dominasi jawaban pada kategori <b>Setuju</b> dibandingkan kategori lainnya.
        </p>
      </div>
    </div>
  );
}