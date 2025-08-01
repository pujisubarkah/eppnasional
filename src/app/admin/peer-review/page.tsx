"use client";
import { useEffect, useState } from "react";

type PeerReviewAnswer = {
  id: string;
  user_id: number;
  created_at: string;
  answers: Record<string, string>;
  category_id: number;
};

type PeerReviewPelatihan = {
  pelatihanId: number;
  namaPelatihan: string;
  frekuensi: Record<string, Record<string, number>>;
};

type ChartItem = {
  question: string;
  [answer: string]: number | string;
};
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function PeerReviewPage() {
  const [pelatihanList, setPelatihanList] = useState<PeerReviewPelatihan[]>([]);
  const [selectedPelatihan, setSelectedPelatihan] = useState<string>('all');
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/review")
      .then((res) => res.json())
      .then((json) => {
        const pelatihans: PeerReviewPelatihan[] = json.data || [];
        setPelatihanList(pelatihans);
        aggregateAll(pelatihans);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal mengambil data");
        setLoading(false);
      });
  }, []);

  function aggregateAll(pelatihans: PeerReviewPelatihan[]) {
    // Aggregate all frekuensi by question and answer
    const agg: Record<string, Record<string, number>> = {};
    pelatihans.forEach(p => {
      Object.entries(p.frekuensi).forEach(([question, freq]) => {
        if (!agg[question]) agg[question] = {};
        Object.entries(freq).forEach(([answer, count]) => {
          agg[question][answer] = (agg[question][answer] || 0) + count;
        });
      });
    });
    setChartData(Object.entries(agg).map(([question, freq]) => ({
      question,
      ...freq,
    })));
  }

  function handlePelatihanChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedPelatihan(val);
    if (val === 'all') {
      aggregateAll(pelatihanList);
    } else {
      const found = pelatihanList.find(p => String(p.pelatihanId) === val);
      const freq = found?.frekuensi || {};
      setChartData(Object.entries(freq).map(([question, freqObj]) => ({
        question,
        ...freqObj,
      })));
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Peer Review Alumni</h1>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold text-[#1976D2]">Filter Pelatihan:</label>
        <select
          className="border border-[#B3E5FC] rounded px-3 py-1 focus:outline-none"
          value={selectedPelatihan}
          onChange={handlePelatihanChange}
        >
          <option value="all">Semua Pelatihan</option>
          {pelatihanList.map((p) => (
            <option key={p.pelatihanId} value={p.pelatihanId}>{p.namaPelatihan}</option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
        <p className="mb-4">Visualisasi frekuensi jawaban untuk setiap pertanyaan peer review alumni.</p>
        {chartData.map((item, idx) => {
          const answerKeys = Object.keys(item).filter((k) => k !== "question");
          const barData = answerKeys.map((key) => ({ name: key, value: item[key] as number }));
          return (
            <div key={idx} className="mb-8">
              <h2 className="font-semibold mb-2 text-[#1976D2]">{item.question}</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1976D2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}