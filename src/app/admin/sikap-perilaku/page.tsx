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
};

export default function SikapPerilakuPage() {
  const [pelatihanList, setPelatihanList] = useState<PelatihanData[]>([]);
  const [selectedPelatihan, setSelectedPelatihan] = useState<string>('all');
  const [sikapData, setSikapData] = useState<SikapRow[]>([]);
  const [kinerjaData, setKinerjaData] = useState<KinerjaRow[]>([]);
  const [ekonomiData, setEkonomiData] = useState<PieRow[]>([]);
  const [temaData, setTemaData] = useState<PieRow[]>([]);
  const [transformasiData, setTransformasiData] = useState<PieRow[]>([]);
  const [frekuensiKalimat, setFrekuensiKalimat] = useState<Record<string, number>>({});
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
        setFrekuensiKalimat(data.frekuensi_kalimat || {});
        // Default: aggregate all
        aggregateAll(pelatihans);
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
    pelatihans.forEach(p => {
      p.sikapData.forEach(d => { allSikap[d.kategori] = (allSikap[d.kategori] || 0) + d.jumlah; });
      p.kinerjaData.forEach(d => { allKinerja[d.kategori] = (allKinerja[d.kategori] || 0) + d.jumlah; });
      p.ekonomiData.forEach(d => { allEkonomi[d.kategori] = (allEkonomi[d.kategori] || 0) + d.jumlah; });
      p.temaData.forEach(d => { allTema[d.kategori] = (allTema[d.kategori] || 0) + d.jumlah; });
      p.transformasiData.forEach(d => { allTransformasi[d.kategori] = (allTransformasi[d.kategori] || 0) + d.jumlah; });
    });
    setSikapData(Object.entries(allSikap).map(([kategori, jumlah]) => ({ kategori, jumlah })));
    setKinerjaData(Object.entries(allKinerja).map(([kategori, jumlah]) => ({ kategori, jumlah })));
    setEkonomiData(Object.entries(allEkonomi).map(([kategori, value]) => ({ kategori, value })));
    setTemaData(Object.entries(allTema).map(([kategori, value]) => ({ kategori, value })));
    setTransformasiData(Object.entries(allTransformasi).map(([kategori, value]) => ({ kategori, value })));
  }

  // Handle filter change
  function handlePelatihanChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    setSelectedPelatihan(val);
    if (val === 'all') {
      aggregateAll(pelatihanList);
    } else {
      const found = pelatihanList.find(p => String(p.pelatihanId) === val);
      setSikapData(found?.sikapData || []);
      setKinerjaData(found?.kinerjaData || []);
      setEkonomiData(found?.ekonomiData.map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
      setTemaData(found?.temaData.map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
      setTransformasiData(found?.transformasiData.map(d => ({ kategori: d.kategori, value: d.jumlah })) || []);
    }
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
	<div>
	  <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Sikap Perilaku</h1>
	  <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold text-[#1976D2]">Filter Pelatihan:</label>
        <select
          className="border border-[#B3E5FC] rounded px-3 py-1 focus:outline-none"
          value={selectedPelatihan}
          onChange={handlePelatihanChange}
        >
          <option value="all">Semua Pelatihan</option>
          {pelatihanList.map((p) => (
            <option key={p.pelatihanId ?? 'null'} value={p.pelatihanId ?? 'null'}>{p.namaPelatihan || 'Tidak diketahui'}</option>
          ))}
        </select>
      </div>
	  {loading ? (
		<div className="text-center py-12 text-gray-500">Memuat data...</div>
	  ) : error ? (
		<div className="text-center py-12 text-red-500">{error}</div>
	  ) : (
		<>
		  <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
			<h2 className="font-semibold text-[#1976D2] mb-2">Perubahan Sikap Perilaku Setelah Pelatihan</h2>
			<ResponsiveContainer width="100%" height={300}>
			  <BarChart data={sikapData} layout="vertical" margin={{ left: 40 }}>
				<XAxis type="number" allowDecimals={false} />
				<YAxis type="category" dataKey="kategori" width={220} />
				<Tooltip />
				<Bar dataKey="jumlah" fill="#1976D2" />
			  </BarChart>
			</ResponsiveContainer>
		  </div>
		  <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
			<h2 className="font-semibold text-[#1976D2] mb-2">Peningkatan Kinerja yang Dirasakan</h2>
			<ResponsiveContainer width="100%" height={300}>
			  <BarChart data={kinerjaData} layout="vertical" margin={{ left: 40 }}>
				<XAxis type="number" allowDecimals={false} />
				<YAxis type="category" dataKey="kategori" width={220} />
				<Tooltip />
				<Bar dataKey="jumlah" fill="#90CAF9" />
			  </BarChart>
			</ResponsiveContainer>
		  </div>
		  <div className="grid md:grid-cols-2 gap-8">
			<div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
			  <h2 className="font-semibold text-[#1976D2] mb-2">Nilai Ekonomi Proyek Perubahan</h2>
			  <ResponsiveContainer width="100%" height={250}>
				<PieChart>
				  <Pie data={ekonomiData} dataKey="value" nameKey="kategori" cx="50%" cy="50%" outerRadius={80} label>
					{ekonomiData.map((entry, idx) => (
					  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
					))}
				  </Pie>
				  <Legend />
				  <Tooltip />
				</PieChart>
			  </ResponsiveContainer>
			</div>
			<div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
			  <h2 className="font-semibold text-[#1976D2] mb-2">Tema Reformasi Birokrasi Tematik</h2>
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
		  <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mt-8">
			<h2 className="font-semibold text-[#1976D2] mb-2">Transformasi Indonesia Emas 2045</h2>
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
		  {/* Frekuensi Kalimat Section */}
		  <div className="bg-blue-50 border-l-4 border-blue-400 mt-8 p-6 rounded-xl shadow text-[#1976D2]">
			<h2 className="text-lg font-semibold mb-4">Rekap Frekuensi Kalimat</h2>
			<ul className="list-disc ml-6">
			  {Object.entries(frekuensiKalimat)
				.sort((a, b) => b[1] - a[1])
				.map(([kalimat, jumlah]) => (
				  <li key={kalimat}>{kalimat}: <span className="font-bold">{jumlah}</span></li>
				))}
			  {Object.keys(frekuensiKalimat).length === 0 && <li className="text-gray-500">Tidak ada data frekuensi kalimat.</li>}
			</ul>
		  </div>
		</>
	  )}
	</div>
  );
}