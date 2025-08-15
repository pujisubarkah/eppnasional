"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

type DivergingRow = {
  kategori: string;
  negatif: number;
  positif: number;
};

type PelatihanWaktu = {
  pelatihanId: number;
  namaPelatihan: string;
  data: Record<string, number>;
};

export default function KesesuaianWaktuPage() {
  const [pelatihanList, setPelatihanList] = useState<PelatihanWaktu[]>([]);
  const [selectedPelatihan, setSelectedPelatihan] = useState<string>('all');
  const [chartData, setChartData] = useState<DivergingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Custom label function to show values at the end of bars
  const renderCustomLabel = (props: {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    height?: number | string;
    value?: number | string;
  }) => {
    const { x, y, width, height, value } = props;
    const numericValue = value !== undefined ? Number(value) : 0;
    if (numericValue === 0) return null; // Don't show label for zero values

    // Convert possible string values to numbers
    const numX = x !== undefined ? Number(x) : 0;
    const numY = y !== undefined ? Number(y) : 0;
    const numWidth = width !== undefined ? Number(width) : 0;
    const numHeight = height !== undefined ? Number(height) : 0;

    return (
      <text 
        x={numX + numWidth + 5} 
        y={numY + numHeight / 2} 
        fill="#333" 
        textAnchor="start" 
        dy="0.35em"
        fontSize="12"
        fontWeight="bold"
      >
        {numericValue}
      </text>
    );
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/waktu");
        if (!res.ok) throw new Error("Gagal memuat data");
        const data = await res.json();
        const pelatihans: PelatihanWaktu[] = data.data || [];
        setPelatihanList(pelatihans);
        // Default: aggregate all
        aggregateAll(pelatihans);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function aggregateAll(pelatihans: PelatihanWaktu[]) {
    // Sum all data by key
    const total: Record<string, number> = {};
    pelatihans.forEach(p => {
      for (const [k, v] of Object.entries(p.data)) {
        total[k] = (total[k] || 0) + v;
      }
    });
    setChartData([
      { kategori: "Sangat Setuju", negatif: 0, positif: total["4 - Sangat Setuju"] ?? 0 },
      { kategori: "Setuju", negatif: 0, positif: total["3 - Setuju"] ?? 0 },
      { kategori: "Tidak Setuju", negatif: total["2 - Tidak Setuju"] ?? 0, positif: 0 },
      { kategori: "Sangat Tidak Setuju", negatif: total["1 - Sangat Tidak Setuju"] ?? 0, positif: 0 },
    ]);
  }

  function handlePelatihanChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedPelatihan(val);
    if (val === 'all') {
      aggregateAll(pelatihanList);
    } else {
      const found = pelatihanList.find(p => String(p.pelatihanId) === val);
      const d = found?.data || {};
      setChartData([
        { kategori: "Sangat Setuju", negatif: 0, positif: d["4 - Sangat Setuju"] ?? 0 },
        { kategori: "Setuju", negatif: 0, positif: d["3 - Setuju"] ?? 0 },
        { kategori: "Tidak Setuju", negatif: d["2 - Tidak Setuju"] ?? 0, positif: 0 },
        { kategori: "Sangat Tidak Setuju", negatif: d["1 - Sangat Tidak Setuju"] ?? 0, positif: 0 },
      ]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E3F2FD] mb-8">
          <h1 className="text-3xl font-bold mb-4 text-[#1976D2] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1976D2] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            Kesesuaian Waktu dan Manfaat
          </h1>
          <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-6 rounded-xl border-l-4 border-[#1976D2]">
            <p className="text-gray-700 leading-relaxed">
              Visualisasi berikut menunjukkan <span className="font-semibold text-[#1976D2]">persepsi alumni</span> terhadap pernyataan:<br />
              <span className="italic font-medium text-gray-800 mt-2 block">
                &quot;Investasi waktu yang saya habiskan untuk mengikuti pelatihan sepadan dengan manfaat atau perkembangan yang saya peroleh&quot;
              </span>
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#E3F2FD] mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="font-semibold text-[#1976D2] flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filter Pelatihan:
            </label>
            <select
              className="border border-[#B3E5FC] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent bg-white shadow-sm min-w-[250px] transition-all"
              value={selectedPelatihan}
              onChange={handlePelatihanChange}
            >
              <option value="all">📊 Semua Pelatihan</option>
              {pelatihanList.map((p) => (
                <option key={p.pelatihanId} value={p.pelatihanId}>🎯 {p.namaPelatihan}</option>
              ))}
            </select>
            <div className="text-sm text-gray-600 bg-[#E3F2FD] px-3 py-2 rounded-lg">
              Total: <span className="font-semibold text-[#1976D2]">{pelatihanList.length}</span> pelatihan
            </div>
          </div>
        </div>
        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E3F2FD] overflow-hidden">
          <div className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Distribusi Jawaban (Diverging Stacked Bar)
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976D2]"></div>
                  <span className="text-gray-500 text-lg">Memuat data...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-500 text-lg">{error}</span>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 100, left: 20, bottom: 20 }}>
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="kategori" width={180} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E3F2FD',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="negatif" stackId="a" fill="#EF5350" name="Tidak Setuju">
                      <LabelList content={renderCustomLabel} />
                    </Bar>
                    <Bar dataKey="positif" stackId="a" fill="#1976D2" name="Setuju">
                      <LabelList content={renderCustomLabel} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Simpulan Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E3F2FD] mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Simpulan & Analisis
            </h2>
          </div>
          <div className="p-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Kesimpulan Analisis</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Berdasarkan distribusi jawaban pada chart di atas, mayoritas responden merasa bahwa <span className="font-semibold text-blue-600">investasi waktu yang dihabiskan untuk mengikuti pelatihan sudah sepadan dengan manfaat atau perkembangan yang diperoleh</span>. 
                    Hal ini terlihat dari dominasi jawaban pada kategori <span className="font-semibold text-green-600">Setuju</span> dan <span className="font-semibold text-green-600">Sangat Setuju</span> dibandingkan kategori negatif lainnya.
                    <br /><br />
                    Data ini menunjukkan <span className="font-semibold text-blue-600">efektivitas pelatihan</span> yang telah dilaksanakan dan dapat menjadi indikator bahwa program pelatihan memberikan <span className="font-semibold text-green-600">value yang sesuai</span> dengan waktu yang diinvestasikan peserta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}