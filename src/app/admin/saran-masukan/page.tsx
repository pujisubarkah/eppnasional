"use client";

import dynamic from 'next/dynamic';
const CanvasWordCloud = dynamic(() => import('@/components/CanvaswordCloud'), { ssr: false });

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Ngram = {
  bigram: Record<string, number>;
  trigram: Record<string, number>;
};

type PelatihanData = {
  pelatihanId: number | null;
  namaPelatihan: string | null;
  data: {
    metode: string[];
    materi: string[];
    waktu: string[];
    pengajar: string[];
  };
  ngram: {
    metode: { bigram: Record<string, number>; trigram: Record<string, number> };
    materi: { bigram: Record<string, number>; trigram: Record<string, number> };
    waktu: { bigram: Record<string, number>; trigram: Record<string, number> };
    pengajar: { bigram: Record<string, number>; trigram: Record<string, number> };
  };
};

type SaranApi = {
  data: Record<string, string[]>;
  ngram: Record<string, Ngram>;
  pelatihanList?: { pelatihanId: number; namaPelatihan: string }[];
  pelatihanData?: PelatihanData[];
};

const categories = ['metode', 'materi', 'waktu', 'pengajar'];

// Indonesian stopwords list - focused on most common words
const indonesianStopwords = new Set([
  'yang', 'yg', 'dengan', 'pada', 'di', 'ke', 'dari', 'untuk', 'dan', 'atau', 'adalah', 'ialah',
  'ini', 'itu', 'tersebut', 'saat', 'ketika', 'akan', 'sudah', 'telah', 'sedang', 'sedangkan',
  'namun', 'tetapi', 'tapi', 'juga', 'serta', 'karena', 'sebab', 'oleh', 'maka', 'jika', 'kalau',
  'bila', 'agar', 'supaya', 'hingga', 'sampai', 'sejak', 'selama', 'setelah', 'sebelum', 'tanpa',
  'sangat', 'amat', 'benar', 'memang', 'hanya', 'saja', 'tidak', 'tak', 'bukan', 'belum', 'masih',
  'bisa', 'dapat', 'boleh', 'mau', 'ingin', 'perlu', 'harus', 'bagaimana', 'mengapa', 'kenapa',
  'dimana', 'kemana', 'kapan', 'berapa', 'siapa', 'apa', 'mana', 'dalam', 'atas', 'bawah',
  'antara', 'bersama', 'sama', 'tiap', 'setiap', 'semua', 'seluruh', 'banyak', 'sedikit', 'beberapa',
  'seperti', 'sebagai', 'yaitu', 'yakni', 'tentang', 'mengenai', 'terhadap', 'bagi', 'demi'
]);

// Function to filter stopwords from text
const filterStopwords = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 1 && !indonesianStopwords.has(word)) // Changed from > 2 to > 1
    .join(' ')
    .trim();
};

// Function to filter stopwords from array of phrases
//const filterStopwordsFromPhrases = (phrases: string[]): string[] => {
//  return phrases
//    .map(phrase => filterStopwords(phrase))
//    .filter(phrase => phrase.length > 0);
//};

export default function SaranMasukanPage() {
  const [apiData, setApiData] = useState<SaranApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [activeTab, setActiveTab] = useState<string>('metode');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPelatihan, setSelectedPelatihan] = useState<string>('all');
  const itemsPerPage = 10;

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

  // Get current data based on selected pelatihan
  const getCurrentData = () => {
    if (!apiData) return { data: { metode: [], materi: [], waktu: [], pengajar: [] }, ngram: { metode: { bigram: {}, trigram: {} }, materi: { bigram: {}, trigram: {} }, waktu: { bigram: {}, trigram: {} }, pengajar: { bigram: {}, trigram: {} } } };
    
    if (selectedPelatihan === 'all') {
      return { data: apiData.data, ngram: apiData.ngram };
    } else {
      const selectedPelatihanData = apiData.pelatihanData?.find(p => String(p.pelatihanId) === selectedPelatihan);
      if (selectedPelatihanData) {
        return { data: selectedPelatihanData.data, ngram: selectedPelatihanData.ngram };
      }
      return { data: { metode: [], materi: [], waktu: [], pengajar: [] }, ngram: { metode: { bigram: {}, trigram: {} }, materi: { bigram: {}, trigram: {} }, waktu: { bigram: {}, trigram: {} }, pengajar: { bigram: {}, trigram: {} } } };
    }
  };

  const currentData = getCurrentData();

  // Function to generate word frequency from text data
  const generateWordFrequency = (texts: string[]): Record<string, number> => {
    const wordFreq: Record<string, number> = {};
    
    texts.forEach(text => {
      if (!text || text.trim() === '') return;
      
      const filteredText = filterStopwords(text);
      const words = filteredText
        .split(/\s+/)
        .filter(word => word.length > 1 && word.match(/^[a-zA-Z\u00C0-\u017F\u0100-\u024F]+$/)); // Allow accented characters
      
      words.forEach(word => {
        const normalizedWord = word.toLowerCase().trim();
        if (normalizedWord.length > 1) {
          wordFreq[normalizedWord] = (wordFreq[normalizedWord] || 0) + 1;
        }
      });
    });
    
    return wordFreq;
  };

  // Generate wordcloud data based on selected category and pelatihan
  const getWordCloudData = (): [string, number][] => {
    const data = currentData.data as Record<string, string[]>;
    if (!data) return [];
    
    let texts: string[] = [];
    
    if (selectedCategory === 'semua') {
      // Combine all categories
      texts = categories.flatMap(cat => data[cat] ?? []);
    } else {
      // Use specific category
      texts = data[selectedCategory] ?? [];
    }
    
    const wordFreq = generateWordFrequency(texts);

    // Convert to array and sort by frequency, show more words
    return Object.entries(wordFreq)
      //.filter(([word, freq]) => freq >= 1) // Show all words that appear at least once
      .sort(([, a], [, b]) => b - a)
      .slice(0, 200); // Increased from 100 to 200 words
  };

  const wordCloudData = getWordCloudData();

  // Function to get filtered data for the active tab (API already filters duplicates and empty entries)
  const getFilteredTabData = () => {
    const data = currentData.data as Record<string, string[]>;
    if (!data || !data[activeTab]) return [];
    
    return data[activeTab]; // No need for additional filtering since API handles it
  };

  // Get filtered data and calculate pagination
  const filteredTabData = getFilteredTabData();
  const totalPages = Math.ceil(filteredTabData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredTabData.slice(startIndex, endIndex);

  // Reset pagination when tab changes
  const handleTabChange = (category: string) => {
    setActiveTab(category);
    setCurrentPage(1);
  };

  // Function to get top N items and prepare for bar chart
  const getTopNgramsForChart = (ngramData: Record<string, number>, type: 'bigram' | 'trigram', n: number = 10) => {
    // Filter out n-grams that contain stopwords (API already filters frequency > 2)
    const filteredNgrams = Object.entries(ngramData).filter(([phrase]) => {
      const filteredPhrase = filterStopwords(phrase);
      return filteredPhrase.length > 0; // No need to check freq > 1 since API already filters > 2
    });

    return filteredNgrams
      .sort(([, a], [, b]) => b - a)
      .slice(0, n)
      .map(([phrase, freq]) => ({
        phrase: phrase.length > 20 ? phrase.substring(0, 20) + '...' : phrase,
        fullPhrase: phrase,
        frequency: freq,
      }));
  };

  // Custom tooltip for bar chart
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: {
        fullPhrase: string;
        frequency: number;
      };
    }>;
  }
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{payload[0].payload.fullPhrase}</p>
          <p className="text-blue-600">
            <span className="font-semibold">Frekuensi: {payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E3F2FD] mb-8">
          <h1 className="text-3xl font-bold mb-4 text-[#1976D2] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1976D2] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            Saran dan Masukan Alumni
          </h1>
          <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-6 rounded-xl border-l-4 border-[#1976D2]">
            <p className="text-gray-700 leading-relaxed">
              Berikut adalah <span className="font-semibold text-[#1976D2]">analisis komprehensif</span> dari data tidak terstruktur saran dan masukan alumni, menggunakan teknik <b className="text-blue-600">text mining</b> dan <b className="text-green-600">natural language processing</b> untuk mengidentifikasi pola, tema, dan insight yang berharga.
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
              value={selectedPelatihan}
              onChange={(e) => setSelectedPelatihan(e.target.value)}
              className="border border-[#B3E5FC] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent bg-white shadow-sm min-w-[300px] transition-all"
            >
              <option value="all">📊 Semua Pelatihan</option>
              {apiData?.pelatihanList?.map((p) => (
                <option key={p.pelatihanId} value={p.pelatihanId}>
                  🎯 {p.namaPelatihan}
                </option>
              ))}
            </select>
            <div className="text-sm text-gray-600 bg-[#E3F2FD] px-3 py-2 rounded-lg">
              Total: <span className="font-semibold text-[#1976D2]">{Object.values(currentData.data).flat().length}</span> feedback
            </div>
          </div>
        </div>
      {/* Word Cloud */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <h2 className="text-lg font-semibold mb-2 text-[#1976D2]">Word Cloud Saran & Masukan</h2>
        <p className="text-sm text-gray-600 mb-4">
          Visualisasi kata-kata yang sering muncul dalam saran dan masukan alumni. Semakin besar ukuran kata, semakin sering kata tersebut muncul (kata-kata umum bahasa Indonesia telah difilter).
        </p>
        
        {/* Category Filter */}
        <div className="mb-6">
          <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
            Filter berdasarkan kategori:
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="semua">Semua Kategori</option>
            <option value="metode">Metode</option>
            <option value="materi">Materi</option>
            <option value="waktu">Waktu</option>
            <option value="pengajar">Pengajar</option>
          </select>
        </div>

        <div className="flex items-center justify-center overflow-auto">
          {loading ? (
            <span className="text-gray-400">Memuat word cloud...</span>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : wordCloudData.length > 0 ? (
            <div className="w-full">
              <div className="text-xs text-gray-500 mb-2 text-center">
                Menampilkan {wordCloudData.length} kata unik
              </div>
              <CanvasWordCloud words={wordCloudData} />
            </div>
          ) : (
            <span className="text-gray-400">Tidak ada data tersedia untuk kategori yang dipilih</span>
          )}
        </div>
      </div>
      
      {/* Tabel Saran Masukan */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <h2 className="text-lg font-semibold mb-4 text-[#1976D2]">Data Saran & Masukan Lengkap</h2>
        <p className="text-sm text-gray-600 mb-6">
          Tabel berisi seluruh teks saran dan masukan alumni yang telah dikategorikan.
        </p>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleTabChange(category)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === category
                    ? 'border-[#1976D2] text-[#1976D2]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
                {currentData && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {(currentData.data as Record<string, string[]>)[category]?.length || 0}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Table Content */}
        <div className="overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976D2]"></div>
              <span className="ml-3 text-gray-600">Memuat data...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48">
              <span className="text-red-500 font-medium">{error}</span>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                      No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saran & Masukan - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPageData.length > 0 ? (
                    currentPageData.map((text: string, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-4xl">
                            {text}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-8 text-center text-gray-500 italic">
                        Tidak ada data untuk kategori {activeTab}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Pagination Controls */}
        {filteredTabData.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span>
                Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredTabData.length)} dari {filteredTabData.length} entri
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Sebelumnya
              </button>
              
              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-[#1976D2] text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="px-2 py-2 text-sm text-gray-500">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
              
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Penjelasan bigram & trigram */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl shadow text-[#1976D2] mb-8">
        <h2 className="text-lg font-semibold mb-2">Bigram dan Trigram?</h2>
        <p className="mb-2">
          <b>Bigram</b> adalah kombinasi dua kata yang sering muncul berurutan dalam saran/masukan alumni, sedangkan <b>Trigram</b> adalah kombinasi tiga kata yang sering muncul berurutan. Analisis bigram dan trigram membantu mengidentifikasi pola, tema, atau frasa penting yang sering diungkapkan oleh alumni, sehingga dapat digunakan untuk memahami kebutuhan, harapan, atau isu yang paling relevan.
        </p>
        <p className="text-sm bg-blue-100 p-2 rounded border-l-2 border-blue-300 mt-3">
          <strong>Catatan:</strong> Data telah difilter untuk menghilangkan kata-kata umum bahasa Indonesia (stopwords) seperti yang, dengan, pada, dll. Hanya bigram dan trigram dengan frekuensi lebih dari 2 kali kemunculan yang ditampilkan untuk memberikan analisis yang lebih fokus pada pola kata yang signifikan.
        </p>
      </div>
      {/* Bigram/Trigram per kategori */}
      {categories.map((cat) => {
        const ngramData = currentData.ngram as Record<string, Ngram>;
        const bigramData = ngramData[cat]?.bigram || {};
        const trigramData = ngramData[cat]?.trigram || {};
        const topBigrams = getTopNgramsForChart(bigramData, 'bigram', 10);
        const topTrigrams = getTopNgramsForChart(trigramData, 'trigram', 10);

        return (
          <div key={cat} className="bg-white rounded-xl shadow-lg p-8 border border-[#E3F2FD] mb-8">
            <h2 className="text-2xl font-bold mb-6 text-[#1976D2] border-b-2 border-blue-100 pb-3">
              {cat.charAt(0).toUpperCase() + cat.slice(1)} - Analisis N-gram
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1976D2]"></div>
                <span className="ml-3 text-gray-600">Memuat data...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-48">
                <span className="text-red-500 font-medium">{error}</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Bigram Chart */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-[#1976D2] flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                    Top 10 Bigram
                  </h3>
                  {topBigrams.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topBigrams}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis 
                            dataKey="phrase" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            fontSize={11}
                            stroke="#64748b"
                          />
                          <YAxis 
                            stroke="#64748b"
                            fontSize={12}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="frequency" 
                            fill="url(#bigramGradient)"
                            radius={[4, 4, 0, 0]}
                            stroke="#1976D2"
                            strokeWidth={1}
                          />
                          <defs>
                            <linearGradient id="bigramGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#3B82F6" />
                              <stop offset="100%" stopColor="#1976D2" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-gray-500 italic">Tidak ada data bigram tersedia</p>
                    </div>
                  )}
                </div>

                {/* Trigram Chart */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-emerald-700 flex items-center">
                    <div className="w-4 h-4 bg-emerald-500 rounded mr-3"></div>
                    Top 10 Trigram
                  </h3>
                  {topTrigrams.length > 0 ? (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topTrigrams}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                          <XAxis 
                            dataKey="phrase" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            fontSize={11}
                            stroke="#64748b"
                          />
                          <YAxis 
                            stroke="#64748b"
                            fontSize={12}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="frequency" 
                            fill="url(#trigramGradient)"
                            radius={[4, 4, 0, 0]}
                            stroke="#059669"
                            strokeWidth={1}
                          />
                          <defs>
                            <linearGradient id="trigramGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10B981" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-80 flex items-center justify-center">
                      <p className="text-gray-500 italic">Tidak ada data trigram tersedia</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
      {/* Sentimen */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
        <h2 className="text-lg font-semibold mb-2 text-[#1976D2]">Analisis Sentimen</h2>
        <div className="h-48 flex items-center justify-center text-gray-400">
          [Sentiment Pie/Bar Chart]
        </div>
      </div>
      </div>
    </div>
  );
}
