export default function SaranMasukanPage() {
  // Contoh data dummy bigram/trigram
  const bigramData = [
    { phrase: "pelatihan bermanfaat", count: 12 },
    { phrase: "materi relevan", count: 9 },
    { phrase: "narasumber kompeten", count: 7 },
    { phrase: "waktu pelaksanaan", count: 6 },
    { phrase: "fasilitas kurang", count: 5 },
  ];

  const trigramData = [
    { phrase: "pelatihan sangat bermanfaat", count: 8 },
    { phrase: "materi mudah dipahami", count: 6 },
    { phrase: "narasumber sangat kompeten", count: 4 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Saran dan Masukan</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <p>
          Berikut adalah analisis data tidak terstruktur dari saran dan masukan alumni.
        </p>
      </div>
      {/* Word Cloud */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <h2 className="text-lg font-semibold mb-2 text-[#1976D2]">Word Cloud Saran & Masukan</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          [Word Cloud Chart]
        </div>
      </div>
      {/* Bigram/Trigram Section */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <h2 className="text-lg font-semibold mb-2 text-[#1976D2]">Bigram Terpopuler</h2>
        <ul className="mb-4 list-decimal pl-6 text-gray-700">
          {bigramData.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.phrase}</span>
              <span className="font-semibold text-[#1976D2]">{item.count}x</span>
            </li>
          ))}
        </ul>
        <h2 className="text-lg font-semibold mb-2 text-[#1976D2]">Trigram Terpopuler</h2>
        <ul className="list-decimal pl-6 text-gray-700">
          {trigramData.map((item, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{item.phrase}</span>
              <span className="font-semibold text-[#1976D2]">{item.count}x</span>
            </li>
          ))}
        </ul>
        {/* Anda bisa ganti dengan bar chart jika ingin visualisasi */}
      </div>
      {/* Sentiment Analysis */}
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
        <h2 className="text-lg font-semibold mb-2 text-[#1976D2]">Analisis Sentimen</h2>
        <div className="h-48 flex items-center justify-center text-gray-400">
          [Sentiment Pie/Bar Chart]
        </div>
      </div>
    </div>
  );
}