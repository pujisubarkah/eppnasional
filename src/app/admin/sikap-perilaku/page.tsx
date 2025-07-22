"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const sikapData = [
	{ kategori: "Motivasi Etika & Integritas", jumlah: 42 },
	{ kategori: "Percaya Diri Kebijakan", jumlah: 38 },
	{ kategori: "Inovasi/Kreativitas", jumlah: 35 },
	{ kategori: "Kepemimpinan Kolaboratif", jumlah: 30 },
	{ kategori: "Peningkatan Kinerja", jumlah: 45 },
];

const kinerjaData = [
	{ kategori: "Kinerja Individu", jumlah: 40 },
	{ kategori: "Pengetahuan & Keterampilan", jumlah: 44 },
	{ kategori: "Mengelola Perubahan", jumlah: 32 },
	{ kategori: "Kualitas Pelayanan Publik", jumlah: 28 },
	{ kategori: "Menggerakkan Stakeholders", jumlah: 25 },
	{ kategori: "Jejaring Kerja", jumlah: 20 },
	{ kategori: "Kepuasan Pelanggan", jumlah: 18 },
];

const ekonomiData = [
	{ kategori: "< 100 Juta", value: 10 },
	{ kategori: "100 Juta - 1 M", value: 20 },
	{ kategori: "1 M - 10 M", value: 8 },
	{ kategori: "> 10 M", value: 2 },
];

const temaData = [
	{ kategori: "Pengentasan Kemiskinan", value: 12 },
	{ kategori: "Peningkatan Investasi", value: 8 },
	{ kategori: "Digitalisasi Administrasi", value: 15 },
	{ kategori: "Prioritas Presiden", value: 5 },
	{ kategori: "Other", value: 3 },
];

const transformasiData = [
	{ kategori: "Sosial", value: 18 },
	{ kategori: "Ekonomi", value: 22 },
	{ kategori: "Tata Kelola", value: 10 },
];

const COLORS = [
	"#1976D2",
	"#90CAF9",
	"#F59E42",
	"#EF9A9A",
	"#81C784",
	"#FFD54F",
	"#BA68C8",
];

export default function SikapPerilakuPage() {
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4 text-[#1976D2]">
				Sikap Perilaku
			</h1>
			<div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
				<h2 className="font-semibold text-[#1976D2] mb-2">
					Perubahan Sikap Perilaku Setelah Pelatihan
				</h2>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart
						data={sikapData}
						layout="vertical"
						margin={{ left: 40 }}
					>
						<XAxis type="number" allowDecimals={false} />
						<YAxis type="category" dataKey="kategori" width={220} />
						<Tooltip />
						<Bar dataKey="jumlah" fill="#1976D2" />
					</BarChart>
				</ResponsiveContainer>
			</div>
			<div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
				<h2 className="font-semibold text-[#1976D2] mb-2">
					Peningkatan Kinerja yang Dirasakan
				</h2>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart
						data={kinerjaData}
						layout="vertical"
						margin={{ left: 40 }}
					>
						<XAxis type="number" allowDecimals={false} />
						<YAxis type="category" dataKey="kategori" width={220} />
						<Tooltip />
						<Bar dataKey="jumlah" fill="#90CAF9" />
					</BarChart>
				</ResponsiveContainer>
			</div>
			<div className="grid md:grid-cols-2 gap-8">
				<div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
					<h2 className="font-semibold text-[#1976D2] mb-2">
						Nilai Ekonomi Proyek Perubahan
					</h2>
					<ResponsiveContainer width="100%" height={250}>
						<PieChart>
							<Pie
								data={ekonomiData}
								dataKey="value"
								nameKey="kategori"
								cx="50%"
								cy="50%"
								outerRadius={80}
								label
							>
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
					<h2 className="font-semibold text-[#1976D2] mb-2">
						Tema Reformasi Birokrasi Tematik
					</h2>
					<ResponsiveContainer width="100%" height={250}>
						<PieChart>
							<Pie
								data={temaData}
								dataKey="value"
								nameKey="kategori"
								cx="50%"
								cy="50%"
								outerRadius={80}
								label
							>
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
				<h2 className="font-semibold text-[#1976D2] mb-2">
					Transformasi Indonesia Emas 2045
				</h2>
				<ResponsiveContainer width="100%" height={250}>
					<PieChart>
						<Pie
							data={transformasiData}
							dataKey="value"
							nameKey="kategori"
							cx="50%"
							cy="50%"
							outerRadius={80}
							label
						>
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
	);
}