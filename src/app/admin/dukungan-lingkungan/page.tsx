"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
const PIE_COLORS = ["#FF1744", "#FFB74D", "#90CAF9", "#1976D2"];

type ChartRow = {
  pertanyaan: string;
  "Sangat Tidak Setuju": number;
  "Tidak Setuju": number;
  "Setuju": number;
  "Sangat Setuju": number;
};

function transformFrekuensiToChartData(frekuensi: Record<string, Array<{ pelatihanId: number, namaPelatihan: string, frekuensi: Record<string, number> }>>): (ChartRow & { namaPelatihan: string; pelatihanId: number })[] {
  const answerMap: Record<string, "Sangat Tidak Setuju" | "Tidak Setuju" | "Setuju" | "Sangat Setuju"> = {
    "1 - Sangat Tidak Setuju": "Sangat Tidak Setuju",
    "2 - Tidak Setuju": "Tidak Setuju",
    "3 - Setuju": "Setuju",
    "4 - Sangat Setuju": "Sangat Setuju",
  };
  const rows: Array<ChartRow & { namaPelatihan: string; pelatihanId: number }> = [];
  Object.entries(frekuensi).forEach(([pertanyaan, arr]) => {
    arr.forEach(({ namaPelatihan, pelatihanId, frekuensi }) => {
      const row: ChartRow & { namaPelatihan: string; pelatihanId: number } = {
        pertanyaan: pertanyaan,
        "Sangat Tidak Setuju": 0,
        "Tidak Setuju": 0,
        "Setuju": 0,
        "Sangat Setuju": 0,
        namaPelatihan: namaPelatihan,
        pelatihanId: pelatihanId,
      };
      for (const [jawaban, jumlah] of Object.entries(frekuensi)) {
        const key = answerMap[jawaban];
        if (key) row[key] = jumlah;
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
    totalSTS += d["Sangat Tidak Setuju"] ?? 0;
    totalTS += d["Tidak Setuju"] ?? 0;
    totalS += d["Setuju"] ?? 0;
    totalSS += d["Sangat Setuju"] ?? 0;
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
          "Sangat Tidak Setuju": 0,
          "Tidak Setuju": 0,
          "Setuju": 0,
          "Sangat Setuju": 0,
        });
      }
      const agg = pertanyaanMap.get(row.pertanyaan)!;
      agg["Sangat Tidak Setuju"] += row["Sangat Tidak Setuju"];
      agg["Tidak Setuju"] += row["Tidak Setuju"];
      agg["Setuju"] += row["Setuju"];
      agg["Sangat Setuju"] += row["Sangat Setuju"];
    });
    filteredChartData = Array.from(pertanyaanMap.values());
  } else {
    filteredChartData = chartData.filter(row => row.namaPelatihan === selectedPelatihan);
  }
  const filteredStats = getSummaryStats(filteredChartData);

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
              margin={{ top: 16, right: 32, left: 0, bottom: 8 }}
            >
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="pertanyaan"
                tick={{ fontSize: 13 }}
                width={320}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="Sangat Tidak Setuju" stackId="a" fill="#FF1744" />
              <Bar dataKey="Tidak Setuju" stackId="a" fill="#FFB74D" />
              <Bar dataKey="Setuju" stackId="a" fill="#90CAF9" />
              <Bar dataKey="Sangat Setuju" stackId="a" fill="#1976D2" />
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
                { name: "Sangat Tidak Setuju", value: row["Sangat Tidak Setuju"] },
                { name: "Tidak Setuju", value: row["Tidak Setuju"] },
                { name: "Setuju", value: row["Setuju"] },
                { name: "Sangat Setuju", value: row["Sangat Setuju"] },
              ];
              return (
                <div key={row.pertanyaan} className="bg-white rounded-xl shadow p-4 border border-[#E3F2FD]">
                  <h4 className="font-semibold mb-2 text-[#1976D2]">{row.pertanyaan}</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      >
                        {pieData.map((entry, i) => (
                          <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
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