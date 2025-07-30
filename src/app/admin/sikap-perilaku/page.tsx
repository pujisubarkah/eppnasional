"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";


import { useEffect, useState } from "react";

type SikapRow = { kategori: string; jumlah: number };
type KinerjaRow = { kategori: string; jumlah: number };
type PieRow = { kategori: string; value: number };

export default function SikapPerilakuPage() {
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
		setSikapData(data.sikapData || []);
		setKinerjaData(data.kinerjaData || []);
		setEkonomiData(data.ekonomiData || []);
		setTemaData(data.temaData || []);
		setTransformasiData(data.transformasiData || []);
		setFrekuensiKalimat(data.frekuensi_kalimat || {});
	  } catch (err) {
		setError(err instanceof Error ? err.message : "Terjadi kesalahan");
	  } finally {
		setLoading(false);
	  }
	}
	fetchData();
  }, []);

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