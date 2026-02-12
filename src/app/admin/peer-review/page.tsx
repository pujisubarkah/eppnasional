"use client";
import { useEffect, useState } from "react";

//type PeerReviewAnswer = {
//  id: string;
//  user_id: number;
//  created_at: string;
//  answers: Record<string, string>;
//  category_id: number;
//};

type PeerReviewPelatihan = {
  pelatihanId: number;
  namaPelatihan: string;
  frekuensi: Record<string, Record<string, number>>;
};

type ChartItem = {
  question: string;
  [answer: string]: number | string;
};
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LabelList } from "recharts";

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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-[#E3F2FD]">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1976D2]"></div>
          <span className="text-[#1976D2] font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-red-200">
        <div className="flex items-center gap-3 text-red-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E3F2FD] mb-8">
          <h1 className="text-2xl font-bold mb-4 text-[#1976D2] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1976D2] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            Peer Review Alumni
          </h1>
          <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-6 rounded-xl border-l-4 border-[#1976D2]">
            <p className="text-gray-700 leading-relaxed">
              Visualisasi frekuensi jawaban untuk setiap pertanyaan <span className="font-semibold text-[#1976D2]">peer review alumni</span> berdasarkan pelatihan yang dipilih. Grafik ini membantu memahami pola respons dan evaluasi dari para atasan/bawahan/rekan kerja alumni.
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
              Total Chart: <span className="font-semibold text-[#1976D2]">{chartData.length}</span> pertanyaan
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E3F2FD] overflow-hidden">
          <div className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Visualisasi Data Peer Review
            </h2>
          </div>
          <div className="p-6">
            {chartData.length > 0 ? (
              <div className="space-y-8">
                {chartData.map((item, idx) => {
                  const answerKeys = Object.keys(item).filter((k) => k !== "question");
                  const barData = answerKeys.map((key) => ({ name: key, value: item[key] as number }));
                  return (
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                      <h3 className="font-semibold mb-4 text-[#1976D2] text-lg flex items-center gap-2">
                        <span className="w-6 h-6 bg-[#1976D2] text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        {item.question}
                      </h3>
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                        <ResponsiveContainer width="100%" height={350}>
                          <BarChart data={barData} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12, fill: '#6B7280' }}
                              tickLine={{ stroke: '#D1D5DB' }}
                            />
                            <YAxis 
                              allowDecimals={false} 
                              tick={{ fontSize: 12, fill: '#6B7280' }}
                              tickLine={{ stroke: '#D1D5DB' }}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#1976D2',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '14px'
                              }}
                            />
                            <Legend />
                            <Bar 
                              dataKey="value" 
                              fill="#1976D2"
                              radius={[4, 4, 0, 0]}
                            >
                              <LabelList 
                                dataKey="value" 
                                position="top" 
                                style={{ 
                                  fill: '#1976D2', 
                                  fontWeight: 'bold', 
                                  fontSize: '13px' 
                                }}
                                formatter={(label: React.ReactNode) => {
                                  if (typeof label === 'number' && label > 0) return label;
                                  return '';
                                }}
                              />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div>
                    <h3 className="text-xl font-medium text-gray-500 mb-2">Tidak ada data tersedia</h3>
                    <p className="text-gray-400">Pilih pelatihan untuk melihat visualisasi data peer review</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E3F2FD] mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Ringkasan Analisis
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Insight Data Peer Review</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Grafik di atas menampilkan <span className="font-semibold text-blue-600">distribusi respons peer review alumni</span> untuk setiap pertanyaan evaluasi. 
                    Data ini memberikan gambaran tentang <span className="font-semibold text-[#1976D2]">persepsi alumni terhadap kualitas pelatihan</span> dan dapat digunakan sebagai 
                    bahan evaluasi untuk peningkatan program pelatihan di masa mendatang.
                  </p>
                  {selectedPelatihan !== 'all' && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-blue-100">
                      <span className="text-xs text-blue-600 font-medium">📊 Filter Aktif: </span>
                      <span className="text-sm font-semibold text-blue-800">
                        {pelatihanList.find(p => String(p.pelatihanId) === selectedPelatihan)?.namaPelatihan || 'Pelatihan Terpilih'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}