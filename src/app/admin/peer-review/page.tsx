"use client";
import { useEffect, useState } from "react";

type PeerReviewAnswer = {
  id: string;
  user_id: number;
  created_at: string;
  answers: Record<string, string>;
  category_id: number;
};

type PeerReviewApiResponse = {
  result: PeerReviewAnswer[];
  frekuensi: Record<string, Record<string, number>>;
  mapping?: Record<string, string>;
};

type ChartItem = {
  question: string;
  [answer: string]: number | string;
};
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function PeerReviewPage() {
  const [data, setData] = useState<PeerReviewApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/review")
      .then((res) => res.json())
      .then((json: PeerReviewApiResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal mengambil data");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Transform frekuensi to chart data
  const chartData: ChartItem[] = data && data.frekuensi
    ? Object.entries(data.frekuensi).map(([question, freq]) => {
        const freqObj: Record<string, number> = typeof freq === "object" && freq !== null ? freq : {};
        return {
          question,
          ...freqObj,
        };
      })
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Peer Review Alumni</h1>
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