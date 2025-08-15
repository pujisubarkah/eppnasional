"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
const PIE_COLORS = ["#FF1744", "#FFB74D", "#90CAF9", "#1976D2"];

type ChartRow = {
  pertanyaan: string;
  "1 - Sangat Tidak Setuju": number;
  "2 - Tidak Setuju": number;
  "3 - Setuju": number;
  "4 - Sangat Setuju": number;
};

function transformFrekuensiToChartData(frekuensi: Record<string, Array<{ pelatihanId: number, namaPelatihan: string, frekuensi: Record<string, number> }>>): (ChartRow & { namaPelatihan: string; pelatihanId: number })[] {
  const rows: Array<ChartRow & { namaPelatihan: string; pelatihanId: number }> = [];
  Object.entries(frekuensi).forEach(([pertanyaan, arr]) => {
    arr.forEach(({ namaPelatihan, pelatihanId, frekuensi }) => {
      const row: ChartRow & { namaPelatihan: string; pelatihanId: number } = {
        pertanyaan: pertanyaan,
        "1 - Sangat Tidak Setuju": 0,
        "2 - Tidak Setuju": 0,
        "3 - Setuju": 0,
        "4 - Sangat Setuju": 0,
        namaPelatihan: namaPelatihan,
        pelatihanId: pelatihanId,
      };
      for (const [jawaban, jumlah] of Object.entries(frekuensi)) {
        if (jawaban in row) {
          (row as unknown as Record<string, number>)[jawaban] = jumlah;
        }
      }
      rows.push(row);
    });
  });
  return rows;
}

// Hitung persentase dinamis

function getSummaryStats(data: ChartRow[]) {
  const totalPertanyaan = data.length;
  let totalSTS = 0, totalTS = 0, totalS = 0, totalSS = 0;
  data.forEach((d) => {
    totalSTS += d["1 - Sangat Tidak Setuju"] ?? 0;
    totalTS += d["2 - Tidak Setuju"] ?? 0;
    totalS += d["3 - Setuju"] ?? 0;
    totalSS += d["4 - Sangat Setuju"] ?? 0;
  });
  const totalJawaban = totalSTS + totalTS + totalS + totalSS;
  return {
    totalPertanyaan,
    totalJawaban,
    totalSTS,
    totalTS,
    totalS,
    totalSS,
    persenSTS: totalJawaban ? ((totalSTS / totalJawaban) * 100).toFixed(1) : "0",
    persenTS: totalJawaban ? ((totalTS / totalJawaban) * 100).toFixed(1) : "0",
    persenS: totalJawaban ? ((totalS / totalJawaban) * 100).toFixed(1) : "0",
    persenSS: totalJawaban ? ((totalSS / totalJawaban) * 100).toFixed(1) : "0",
  };
}

// Custom label function to show values at the end of bars
import type { LabelProps } from "recharts";

const renderCustomLabel = (props: LabelProps) => {
  const { x, y, width, height, value } = props;
  if (value === 0 || !value) return null; // Don't show label for zero values
  
  // Calculate position at the end of each bar segment
  const labelX = Number(x) + Number(width) + 5;
  const labelY = Number(y) + Number(height) / 2;
  
  return (
    <text 
      x={labelX} 
      y={labelY} 
      fill="#333" 
      textAnchor="start" 
      dy="0.35em"
      fontSize="11"
      fontWeight="bold"
    >
      {value}
    </text>
  );
};

function DukunganLingkunganPage() {
  const [chartData, setChartData] = useState<(ChartRow & { namaPelatihan: string; pelatihanId: number })[]>([]);
  // const [stats, setStats] = useState<ReturnType<typeof getSummaryStats>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pelatihanList, setPelatihanList] = useState<string[]>([]);
  const [selectedPelatihan, setSelectedPelatihan] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dukungan");
        if (!res.ok) throw new Error("Gagal memuat data");
        const data = await res.json();
        // Parse new API response structure
        const chartRows = transformFrekuensiToChartData(data.frekuensi);
        setChartData(chartRows);
        // Get unique namaPelatihan
        const uniquePelatihan = Array.from(new Set(chartRows.map(r => r.namaPelatihan)));
        setPelatihanList(["all", ...uniquePelatihan]);
        // setStats(getSummaryStats(chartRows));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || "Terjadi kesalahan");
        } else {
          setError("Terjadi kesalahan");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter chartData by selectedPelatihan
  let filteredChartData: (ChartRow & { namaPelatihan: string; pelatihanId: number })[] | ChartRow[] = [];
  if (selectedPelatihan === "all") {
    // Group by pertanyaan and sum frequencies
    const pertanyaanMap = new Map<string, ChartRow>();
    chartData.forEach(row => {
      if (!pertanyaanMap.has(row.pertanyaan)) {
        pertanyaanMap.set(row.pertanyaan, {
          pertanyaan: row.pertanyaan,
          "1 - Sangat Tidak Setuju": 0,
          "2 - Tidak Setuju": 0,
          "3 - Setuju": 0,
          "4 - Sangat Setuju": 0,
        });
      }
      const agg = pertanyaanMap.get(row.pertanyaan)!;
      agg["1 - Sangat Tidak Setuju"] += row["1 - Sangat Tidak Setuju"];
      agg["2 - Tidak Setuju"] += row["2 - Tidak Setuju"];
      agg["3 - Setuju"] += row["3 - Setuju"];
      agg["4 - Sangat Setuju"] += row["4 - Sangat Setuju"];
    });
    filteredChartData = Array.from(pertanyaanMap.values());
  } else {
    filteredChartData = chartData.filter(row => row.namaPelatihan === selectedPelatihan);
  }
  const filteredStats = getSummaryStats(filteredChartData);

  // Create a closure function that has access to the chart data
  const createStackedLabelRenderer = (dataKey: string) => {
    const StackedLabel = (props: LabelProps & { index?: number }) => {
      const { x, y, width, height, value, index } = props;
      
      // Early return if no value
      if (!value || value === 0) return null;
      
      // Get individual value from the chart data
      let individualValue = 0;
      if (filteredChartData && index !== undefined && filteredChartData[index]) {
        individualValue = Number((filteredChartData[index] as ChartRow)[dataKey as keyof ChartRow]) || 0;
      }
      
      // Don't show label if individual value is 0
      if (!individualValue || individualValue === 0) return null;
      
      // Position label at the center of each bar segment
      const labelX = Number(x) + Number(width) / 2;
      const labelY = Number(y) + Number(height) / 2;
      
      // Only show label if bar segment is wide enough
      if (Number(width) < 15) return null;
      
      return (
        <text 
          x={labelX} 
          y={labelY} 
          fill="white" 
          textAnchor="middle" 
          dy="0.35em"
          fontSize="10"
          fontWeight="bold"
          style={{ 
            textShadow: '1px 1px 2px rgba(0,0,0,0.9)',
            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.7))'
          }}
        >
          {individualValue}
        </text>
      );
    };
    StackedLabel.displayName = `StackedLabel_${dataKey}`;
    return StackedLabel;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E3F2FD] mb-8">
          <h1 className="text-3xl font-bold mb-4 text-[#1976D2] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1976D2] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            Dukungan Lingkungan Kerja
          </h1>
          <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-6 rounded-xl border-l-4 border-[#1976D2]">
            <p className="text-gray-700 leading-relaxed">
              Analisis ini menunjukkan <span className="font-semibold text-[#1976D2]">distribusi persepsi responden</span> terhadap dukungan lingkungan kerja yang diterima setelah mengikuti pelatihan. Grafik menampilkan tingkat persetujuan responden pada berbagai aspek dukungan dari atasan dan rekan kerja dalam implementasi hasil pelatihan.
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
              onChange={e => setSelectedPelatihan(e.target.value)}
            >
              <option value="all">📊 Semua Pelatihan</option>
              {pelatihanList.filter(nama => nama !== "all").map((nama) => (
                <option key={nama} value={nama}>🎯 {nama}</option>
              ))}
            </select>
            <div className="text-sm text-gray-600 bg-[#E3F2FD] px-3 py-2 rounded-lg">
              Total Data: <span className="font-semibold text-[#1976D2]">{filteredChartData.length}</span> pertanyaan
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E3F2FD] mb-8">
          <h2 className="text-xl font-semibold mb-6 text-[#1976D2] flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Distribusi Jawaban Dukungan Lingkungan
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976D2]"></div>
                <span className="text-gray-500 text-lg">Memuat data...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <svg className="w-16 h-16 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-500 text-lg">{error}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 mb-8">
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart
                    data={filteredChartData}
                    layout="vertical"
                    margin={{ top: 16, right: 80, left: 0, bottom: 8 }}
                  >
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="pertanyaan"
                      tick={{ fontSize: 13 }}
                      width={320}
                    />
                    <Tooltip />
                    <Legend
                      verticalAlign="top"
                      align="right"
                      iconType="circle"
                      formatter={(value) => {
                        return <span style={{ color: "#1976D2", fontWeight: 500 }}>{value}</span>;
                      }}
                    />
                    <Bar dataKey="1 - Sangat Tidak Setuju" stackId="a" fill="#FF1744">
                      <LabelList content={createStackedLabelRenderer("1 - Sangat Tidak Setuju")} />
                    </Bar>
                    <Bar dataKey="2 - Tidak Setuju" stackId="a" fill="#FFB74D">
                      <LabelList content={createStackedLabelRenderer("2 - Tidak Setuju")} />
                    </Bar>
                    <Bar dataKey="3 - Setuju" stackId="a" fill="#90CAF9">
                      <LabelList content={createStackedLabelRenderer("3 - Setuju")} />
                    </Bar>
                    <Bar dataKey="4 - Sangat Setuju" stackId="a" fill="#1976D2">
                      <LabelList content={createStackedLabelRenderer("4 - Sangat Setuju")} />
                      <LabelList content={renderCustomLabel} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart per pertanyaan */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-6 text-[#1976D2] flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 21a9 9 0 008.945-8H13V21z" />
                  </svg>
                  Distribusi Jawaban per Pertanyaan
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredChartData.map((row) => {
                    const pieData = [
                      { name: "1 - Sangat Tidak Setuju", value: row["1 - Sangat Tidak Setuju"] },
                      { name: "2 - Tidak Setuju", value: row["2 - Tidak Setuju"] },
                      { name: "3 - Setuju", value: row["3 - Setuju"] },
                      { name: "4 - Sangat Setuju", value: row["4 - Sangat Setuju"] },
                    ];
                    return (
                      <div key={row.pertanyaan} className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-6 border border-[#E3F2FD] hover:shadow-lg transition-shadow">
                        <h4 className="font-semibold mb-4 text-[#1976D2] text-sm leading-tight">{row.pertanyaan}</h4>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={pieData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              innerRadius={0}
                              paddingAngle={2}
                              label={({ value, percent }) => 
                                (value ?? 0) > 0 && percent !== undefined
                                  ? `${value ?? 0} (${(percent * 100).toFixed(1)}%)`
                                  : null
                              }
                              labelLine={false}
                            >
                              {pieData.map((entry, i) => (
                                <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value, name) => [`${value} (${((value as number) / pieData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1)}%)`, name]}
                            />
                            <Legend 
                              verticalAlign="bottom" 
                              height={36}
                              iconType="circle"
                              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Simpulan Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E3F2FD] overflow-hidden">
          <div className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Simpulan & Analisis
            </h2>
          </div>
          <div className="p-6">
            {filteredStats ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-3">📊 Ringkasan Distribusi Jawaban</h4>
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        Berdasarkan analisis distribusi jawaban responden, mayoritas menunjukkan <span className="font-semibold text-green-600">sikap positif</span> terhadap dukungan lingkungan kerja setelah mengikuti pelatihan.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{filteredStats.persenSS}%</div>
                            <div className="text-sm text-gray-600 mt-1">Sangat Setuju</div>
                            <div className="text-xs text-gray-500">({filteredStats.totalSS} jawaban)</div>
                          </div>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{filteredStats.persenS}%</div>
                            <div className="text-sm text-gray-600 mt-1">Setuju</div>
                            <div className="text-xs text-gray-500">({filteredStats.totalS} jawaban)</div>
                          </div>
                        </div>
                        <div className="bg-orange-100 p-4 rounded-lg border border-orange-200">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{filteredStats.persenTS}%</div>
                            <div className="text-sm text-gray-600 mt-1">Tidak Setuju</div>
                            <div className="text-xs text-gray-500">({filteredStats.totalTS} jawaban)</div>
                          </div>
                        </div>
                        <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{filteredStats.persenSTS}%</div>
                            <div className="text-sm text-gray-600 mt-1">Sangat Tidak Setuju</div>
                            <div className="text-xs text-gray-500">({filteredStats.totalSTS} jawaban)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">💡 Kesimpulan Analisis</h4>
                      <p className="text-gray-700 leading-relaxed">
                        Dukungan lingkungan kerja yang positif meliputi <span className="font-semibold text-blue-600">respon positif terhadap penerapan pengetahuan dan keterampilan baru</span>, 
                        keberlanjutan proyek perubahan, peningkatan kepercayaan diri dalam menangani tugas yang lebih menantang, serta penilaian positif terhadap perubahan perilaku setelah pelatihan. 
                        Dengan demikian, <span className="font-semibold text-green-600">dukungan sosial dari atasan dan rekan kerja</span> dinilai sangat berarti dan berdampak signifikan terhadap 
                        perkembangan profesional alumni di tempat kerja.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg">📊</div>
                <p className="text-gray-500 mt-2">Data belum tersedia untuk analisis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DukunganLingkunganPage;