"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";


import { useEffect, useState } from "react";

type SikapRow = { kategori: string; jumlah: number };
type KinerjaRow = { kategori: string; jumlah: number };
type PieRow = { kategori: string; value: number };
type PelatihanData = {
  pelatihanId: number | null;
  namaPelatihan: string | null;
  sikapData: SikapRow[];
  kinerjaData: KinerjaRow[];
  ekonomiData: { kategori: string; jumlah: number }[];
  temaData: { kategori: string; jumlah: number }[];
  transformasiData: { kategori: string; jumlah: number }[];
  subBidangData: { kategori: string; jumlah: number }[];
};

export default function SikapPerilakuPage() {
  const [pelatihanList, setPelatihanList] = useState<PelatihanData[]>([]);
  const [selectedPelatihan, setSelectedPelatihan] = useState<string>('1');
  const [sikapData, setSikapData] = useState<SikapRow[]>([]);
  const [kinerjaData, setKinerjaData] = useState<KinerjaRow[]>([]);
  const [ekonomiData, setEkonomiData] = useState<PieRow[]>([]);
  const [temaData, setTemaData] = useState<PieRow[]>([]);
  const [transformasiData, setTransformasiData] = useState<PieRow[]>([]);
  const [subBidangData, setSubBidangData] = useState<PieRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/sikap");
        if (!res.ok) throw new Error("Gagal memuat data");
        const data = await res.json();
        const pelatihans: PelatihanData[] = data.data || [];
        setPelatihanList(pelatihans);
        // Default: show pelatihan with ID = 1
        const defaultPelatihan = pelatihans.find(p => p.pelatihanId === 1);
        if (defaultPelatihan) {
          setSikapData(defaultPelatihan.sikapData.filter(d => d.jumlah > 0) || []);
          setKinerjaData(defaultPelatihan.kinerjaData.filter(d => d.jumlah > 0) || []);
          setEkonomiData(defaultPelatihan.ekonomiData.filter(d => d.jumlah > 0).map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
          setTemaData(defaultPelatihan.temaData.filter(d => d.jumlah > 0).map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
          setTransformasiData(defaultPelatihan.transformasiData.filter(d => d.jumlah > 0).map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
          setSubBidangData(defaultPelatihan.subBidangData.filter(d => d.jumlah > 0).map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Aggregate all pelatihan data
  function aggregateAll(pelatihans: PelatihanData[]) {
    // Helper to sum arrays by kategori
    // Aggregate for all pelatihan
    const allSikap: Record<string, number> = {};
    const allKinerja: Record<string, number> = {};
    const allEkonomi: Record<string, number> = {};
    const allTema: Record<string, number> = {};
    const allTransformasi: Record<string, number> = {};
    const allSubBidang: Record<string, number> = {};
    pelatihans.forEach(p => {
      p.sikapData.forEach(d => { allSikap[d.kategori] = (allSikap[d.kategori] || 0) + d.jumlah; });
      p.kinerjaData.forEach(d => { allKinerja[d.kategori] = (allKinerja[d.kategori] || 0) + d.jumlah; });
      p.ekonomiData.forEach(d => { allEkonomi[d.kategori] = (allEkonomi[d.kategori] || 0) + d.jumlah; });
      p.temaData.forEach(d => { allTema[d.kategori] = (allTema[d.kategori] || 0) + d.jumlah; });
      p.transformasiData.forEach(d => { allTransformasi[d.kategori] = (allTransformasi[d.kategori] || 0) + d.jumlah; });
      p.subBidangData.forEach(d => { allSubBidang[d.kategori] = (allSubBidang[d.kategori] || 0) + d.jumlah; });
    });
    setSikapData(Object.entries(allSikap).filter(([, jumlah]) => jumlah > 0).map(([kategori, jumlah]) => ({ kategori, jumlah })));
    setKinerjaData(Object.entries(allKinerja).filter(([, jumlah]) => jumlah > 0).map(([kategori, jumlah]) => ({ kategori, jumlah })));
    setEkonomiData(Object.entries(allEkonomi).filter(([, value]) => value > 0).map(([kategori, value]) => ({ kategori, value })));
    setTemaData(Object.entries(allTema).filter(([, value]) => value > 0).map(([kategori, value]) => ({ kategori, value })));
    setTransformasiData(Object.entries(allTransformasi).filter(([, value]) => value > 0).map(([kategori, value]) => ({ kategori, value })));
    setSubBidangData(Object.entries(allSubBidang).filter(([, value]) => value > 0).map(([kategori, value]) => ({ kategori, value })));
  }

  // Handle filter change
  function handlePelatihanChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedPelatihan(val);
    if (val === 'all') {
      aggregateAll(pelatihanList);
      return;
    }
    const found = pelatihanList.find(p => String(p.pelatihanId) === val);
    setSikapData(found?.sikapData.filter(d => d.jumlah > 0) || []);
    setKinerjaData(found?.kinerjaData.filter(d => d.jumlah > 0) || []);
    setEkonomiData(found?.ekonomiData.filter(d => d.jumlah > 0).map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
    setTemaData(found?.temaData.filter(d => d.jumlah > 0).map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
    setTransformasiData(found?.transformasiData.filter(d => d.jumlah > 0).map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
    setSubBidangData(found?.subBidangData.filter(d => d.jumlah > 0).map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
  }

const COLORS = [
    "#1976D2",
    "#90CAF9",
    "#F59E42",
    "#FF1744",
    "#81C784",
    "#FFD54F",
    "#BA68C8",
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E3F2FD] mb-8">
          <h1 className="text-3xl font-bold mb-4 text-[#1976D2] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1976D2] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            Analisis Sikap Perilaku Pasca Pelatihan
          </h1>
          <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-6 rounded-xl border-l-4 border-[#1976D2]">
            <p className="text-gray-700 leading-relaxed">
              Dashboard ini menampilkan <span className="font-semibold text-[#1976D2]">analisis komprehensif</span> tentang perubahan sikap, perilaku, dan kinerja peserta setelah mengikuti pelatihan. 
              Data divisualisasikan dalam bentuk grafik untuk memberikan insight yang mudah dipahami mengenai <b className="text-purple-600">efektivitas program pelatihan</b> terhadap pengembangan kompetensi peserta.
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
                <option key={p.pelatihanId ?? 'null'} value={p.pelatihanId ?? 'null'}>🎯 {p.namaPelatihan || 'Tidak diketahui'}</option>
              ))}
            </select>
            <div className="text-sm text-gray-600 bg-[#E3F2FD] px-3 py-2 rounded-lg">
              Pelatihan: <span className="font-semibold text-[#1976D2]">{pelatihanList.find(p => String(p.pelatihanId) === selectedPelatihan)?.namaPelatihan || 'Tidak diketahui'}</span>
            </div>
          </div>
        </div>
        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              try {
                const lines: string[] = [];
                const esc = (s: string) => `"${s.replace(/"/g, '""') }"`;

                // Sikap
                lines.push(esc('SECTION: Sikap'));
                lines.push([esc('Kategori'), esc('Jumlah')].join(','));
                sikapData.forEach(d => lines.push([esc(d.kategori), String(d.jumlah)].join(',')));
                lines.push('');

                // Kinerja
                lines.push(esc('SECTION: Kinerja'));
                lines.push([esc('Kategori'), esc('Jumlah')].join(','));
                kinerjaData.forEach(d => lines.push([esc(d.kategori), String(d.jumlah)].join(',')));
                lines.push('');

                // Ekonomi
                lines.push(esc('SECTION: Ekonomi'));
                lines.push([esc('Kategori'), esc('Jumlah')].join(','));
                ekonomiData.forEach(d => lines.push([esc(d.kategori), String(d.value)].join(',')));
                lines.push('');

                // Tema
                lines.push(esc('SECTION: Tema'));
                lines.push([esc('Kategori'), esc('Jumlah')].join(','));
                temaData.forEach(d => lines.push([esc(d.kategori), String(d.value)].join(',')));
                lines.push('');

                // Transformasi
                lines.push(esc('SECTION: Transformasi'));
                lines.push([esc('Kategori'), esc('Jumlah')].join(','));
                transformasiData.forEach(d => lines.push([esc(d.kategori), String(d.value)].join(',')));
                lines.push('');

                // Sub Bidang
                lines.push(esc('SECTION: SubBidang'));
                lines.push([esc('Kategori'), esc('Jumlah')].join(','));
                subBidangData.forEach(d => lines.push([esc(d.kategori), String(d.value)].join(',')));

                const csv = lines.join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `sikap_export_${new Date().toISOString().slice(0,10)}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (err) {
                console.error(err);
                alert('Gagal membuat file CSV');
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            Export CSV
          </button>
        </div>
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 border border-[#E3F2FD] text-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-12 h-12 text-[#1976D2] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-gray-500 text-lg">Memuat data...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-lg p-12 border border-red-200 text-center">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-500 text-lg">{error}</span>
            </div>
          </div>
        ) : (
          <>
            {/* Sikap Data Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E3F2FD] mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 -m-6 mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Perubahan Sikap Perilaku Setelah Pelatihan
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sikapData} layout="vertical" margin={{ left: 250 }}>
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="kategori" width={240} />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#1976D2" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Kinerja Data Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E3F2FD] mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 -m-6 mb-6">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Peningkatan Kinerja yang Dirasakan
                </h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={kinerjaData} layout="vertical" margin={{ left: 250 }}>
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="kategori" width={240} />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#90CAF9" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Economic and Theme Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Nilai Ekonomi Proyek Perubahan
                  </h2>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={ekonomiData} dataKey="value" nameKey="kategori" cx="50%" cy="50%" outerRadius={80} label>
                        {ekonomiData.map((entry, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-orange-200 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Tema Reformasi Birokrasi Tematik
                  </h2>
                </div>
                <div className="p-6">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={temaData} dataKey="value" nameKey="kategori" cx="50%" cy="50%" outerRadius={80} label>
                        {temaData.map((entry, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Transformasi Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-indigo-200 mb-8 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Transformasi Indonesia Emas 2045
                </h2>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={transformasiData} dataKey="value" nameKey="kategori" cx="50%" cy="50%" outerRadius={80} label>
                      {transformasiData.map((entry, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sub-Bidang Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-cyan-200 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 p-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Sub-Bidang Transformasi
                </h2>
              </div>
              <div className="p-6">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={subBidangData} layout="vertical" margin={{ left: 300 }}>
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="kategori" width={290} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#42A5F5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}