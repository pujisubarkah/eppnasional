"use client";

import dynamic from 'next/dynamic';
const CanvasWordCloud = dynamic(() => import('@/components/CanvaswordCloud'), { ssr: false });

import { useEffect, useState } from 'react';

type Ngram = {
  bigram: string[];
  trigram: string[];
};

type SaranApi = {
  data: Record<string, string[]>;
  ngram: Record<string, Ngram>;
};

const categories = ['metode', 'materi', 'waktu', 'pengajar'];

export default function SaranMasukanPage() {
  const [apiData, setApiData] = useState<SaranApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/saran');
        if (!res.ok) throw new Error('Gagal memuat data');
        const data = await res.json();
        setApiData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Word cloud: combine all phrases from all categories
  const wordCloudData: [string, number][] = apiData
    ? categories.flatMap((cat) =>
        (apiData.data[cat] ?? []).map((phrase: string) => [phrase, 1] as [string, number])
      )
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Saran dan Masukan</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <p>Berikut adalah analisis data tidak terstruktur dari saran dan masukan alumni.</p>
      </div>
      {/* Word Cloud */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <h2 className="text-lg font-semibold mb-2 text-[#1976D2]">Word Cloud Saran & Masukan</h2>
        <div className="flex items-center justify-center overflow-auto">
          {loading ? (
            <span className="text-gray-400">Memuat word cloud...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <CanvasWordCloud words={wordCloudData} />
          )}
        </div>
      </div>
      {/* Penjelasan bigram & trigram */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl shadow text-[#1976D2] mb-8">
        <h2 className="text-lg font-semibold mb-2">Bigram dan Trigram?</h2>
        <p className="mb-2">
          <b>Bigram</b> adalah kombinasi dua kata yang sering muncul berurutan dalam saran/masukan alumni, sedangkan <b>Trigram</b> adalah kombinasi tiga kata yang sering muncul berurutan. Analisis bigram dan trigram membantu mengidentifikasi pola, tema, atau frasa penting yang sering diungkapkan oleh alumni, sehingga dapat digunakan untuk memahami kebutuhan, harapan, atau isu yang paling relevan.
        </p>
      </div>
      {/* Bigram/Trigram per kategori */}
      {categories.map((cat) => (
        <div key={cat} className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
          <h2 className="text-lg font-semibold mb-2 text-[#1976D2]">{cat.charAt(0).toUpperCase() + cat.slice(1)} - Bigram & Trigram</h2>
          {loading ? (
            <span className="text-gray-400">Memuat data...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : (
            <>
              <h3 className="font-semibold mb-1 text-[#1976D2]">Bigram</h3>
              <ul className="mb-4 list-decimal pl-6 text-gray-700">
                {apiData && apiData.ngram[cat] && Object.keys(apiData.ngram[cat].bigram).length > 0 ? (
                  Object.entries(apiData.ngram[cat].bigram).map(([phrase, freq], idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{phrase}</span>
                      <span className="font-semibold text-[#1976D2]">{freq}x</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">Tidak ada bigram.</li>
                )}
              </ul>
              <h3 className="font-semibold mb-1 text-[#1976D2]">Trigram</h3>
              <ul className="list-decimal pl-6 text-gray-700">
                {apiData && apiData.ngram[cat] && Object.keys(apiData.ngram[cat].trigram).length > 0 ? (
                  Object.entries(apiData.ngram[cat].trigram).map(([phrase, freq], idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{phrase}</span>
                      <span className="font-semibold text-[#1976D2]">{freq}x</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">Tidak ada trigram.</li>
                )}
              </ul>
            </>
          )}
        </div>
      ))}
      {/* Sentimen */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
        <h2 className="text-lg font-semibold mb-2 text-[#1976D2]">Analisis Sentimen</h2>
        <div className="h-48 flex items-center justify-center text-gray-400">
          [Sentiment Pie/Bar Chart]
        </div>
      </div>
    </div>
  );
}
