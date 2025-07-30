"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

type ChartRow = {
  pertanyaan: string;
  "Sangat Tidak Setuju": number;
  "Tidak Setuju": number;
  "Setuju": number;
  "Sangat Setuju": number;
};

function transformFrekuensiToChartData(frekuensi: Record<string, Record<string, number>>): ChartRow[] {
  // Map API answer keys to chart keys
  const answerMap: Record<string, keyof ChartRow> = {
    "1 - Sangat Tidak Setuju": "Sangat Tidak Setuju",
    "2 - Tidak Setuju": "Tidak Setuju",
    "3 - Setuju": "Setuju",
    "4 - Sangat Setuju": "Sangat Setuju",
  };
  return Object.entries(frekuensi).map(([pertanyaan, jawabanObj]) => {
    const row: ChartRow = {
      pertanyaan,
      "Sangat Tidak Setuju": 0,
      "Tidak Setuju": 0,
      "Setuju": 0,
      "Sangat Setuju": 0,
    };
    for (const [jawaban, jumlah] of Object.entries(jawabanObj)) {
      const key = answerMap[jawaban];
      if (key) row[key as "Sangat Tidak Setuju" | "Tidak Setuju" | "Setuju" | "Sangat Setuju"] = jumlah;
    }
    return row;
  });
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
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getSummaryStats>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/dukungan");
        if (!res.ok) throw new Error("Gagal memuat data");
        const data = await res.json();
        const chartRows = transformFrekuensiToChartData(data.frekuensi);
        setChartData(chartRows);
        setStats(getSummaryStats(chartRows));
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Dukungan Lingkungan</h1>
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
              data={chartData}
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
              <Bar dataKey="Sangat Tidak Setuju" stackId="a" fill="#EF9A9A" />
              <Bar dataKey="Tidak Setuju" stackId="a" fill="#FFB74D" />
              <Bar dataKey="Setuju" stackId="a" fill="#90CAF9" />
              <Bar dataKey="Sangat Setuju" stackId="a" fill="#1976D2" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* Simpulan */}
      <div className="bg-blue-50 border-l-4 border-blue-400 mt-8 p-6 rounded-xl shadow text-[#1976D2]">
        <h2 className="text-lg font-semibold mb-4">Simpulan</h2>
        {stats ? (
          <>
            <p className="mb-2">
              Berdasarkan data distribusi jawaban, mayoritas responden menunjukkan sikap positif terhadap dukungan lingkungan kerja setelah pelatihan. Hal ini terlihat dari persentase jawaban:
            </p>
            <ul className="mb-2 ml-6 list-disc">
              <li>
                <span className="font-semibold">Sangat Setuju:</span> {stats.persenSS}% ({stats.totalSS} jawaban)
              </li>
              <li>
                <span className="font-semibold">Setuju:</span> {stats.persenS}% ({stats.totalS} jawaban)
              </li>
              <li>
                <span className="font-semibold">Tidak Setuju:</span> {stats.persenTS}% ({stats.totalTS} jawaban)
              </li>
              <li>
                <span className="font-semibold">Sangat Tidak Setuju:</span> {stats.persenSTS}% ({stats.totalSTS} jawaban)
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

// ...existing code...
export default DukunganLingkunganPage;