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
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Dukungan Lingkungan</h1>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold text-[#1976D2]">Filter Pelatihan:</label>
        <select
          className="border border-[#B3E5FC] rounded px-3 py-1 focus:outline-none"
          value={selectedPelatihan}
          onChange={e => setSelectedPelatihan(e.target.value)}
        >
          {pelatihanList.map((nama) => (
            <option key={nama} value={nama}>{nama === "all" ? "Semua Pelatihan" : nama}</option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <p>
          Grafik di bawah ini menunjukkan distribusi jawaban responden untuk setiap pertanyaan dukungan lingkungan kerja.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
        <h2 className="text-lg font-semibold mb-4 text-[#1976D2]">Distribusi Jawaban Dukungan Lingkungan</h2>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat data...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
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
        )}
        {/* Pie Chart per pertanyaan */}
        {/* filteredChartData is already aggregated per pertanyaan when 'Semua Pelatihan' is selected */}
        <div className="mt-8">
          <h3 className="text-md font-semibold mb-4 text-[#1976D2]">Distribusi Jawaban per Pertanyaan</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {filteredChartData.map((row) => {
              const pieData = [
                { name: "1 - Sangat Tidak Setuju", value: row["1 - Sangat Tidak Setuju"] },
                { name: "2 - Tidak Setuju", value: row["2 - Tidak Setuju"] },
                { name: "3 - Setuju", value: row["3 - Setuju"] },
                { name: "4 - Sangat Setuju", value: row["4 - Sangat Setuju"] },
              ];
              return (
                <div key={row.pertanyaan} className="bg-white rounded-xl shadow p-4 border border-[#E3F2FD]">
                  <h4 className="font-semibold mb-2 text-[#1976D2] text-sm">{row.pertanyaan}</h4>
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
      </div>
      {/* Simpulan */}
      <div className="bg-blue-50 border-l-4 border-blue-400 mt-8 p-6 rounded-xl shadow text-[#1976D2]">
        <h2 className="text-lg font-semibold mb-4">Simpulan</h2>
        {filteredStats ? (
          <>
            <p className="mb-2">
              Berdasarkan data distribusi jawaban, mayoritas responden menunjukkan sikap positif terhadap dukungan lingkungan kerja setelah pelatihan. Hal ini terlihat dari persentase jawaban:
            </p>
            <ul className="mb-2 ml-6 list-disc">
              <li>
                <span className="font-semibold">Sangat Setuju:</span> {filteredStats.persenSS}% ({filteredStats.totalSS} jawaban)
              </li>
              <li>
                <span className="font-semibold">Setuju:</span> {filteredStats.persenS}% ({filteredStats.totalS} jawaban)
              </li>
              <li>
                <span className="font-semibold">Tidak Setuju:</span> {filteredStats.persenTS}% ({filteredStats.totalTS} jawaban)
              </li>
              <li>
                <span className="font-semibold">Sangat Tidak Setuju:</span> {filteredStats.persenSTS}% ({filteredStats.totalSTS} jawaban)
              </li>
            </ul>
            <p>
              Dukungan tersebut meliputi respon positif terhadap penerapan pengetahuan dan keterampilan baru, keberlanjutan proyek perubahan, peningkatan kepercayaan diri dalam menangani tugas yang lebih menantang, serta penilaian positif terhadap perubahan perilaku setelah pelatihan. Dengan demikian, dukungan sosial dari atasan dan rekan kerja dinilai sangat berarti dan berdampak signifikan terhadap perkembangan profesional alumni di tempat kerja.
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default DukunganLingkunganPage;