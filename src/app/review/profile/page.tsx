"use client";

import { useRouter } from "next/navigation";
import { useProfileFormStore } from "@/lib/store/profileFormStore";
import { useState, useEffect } from "react";
import { CheckCircle, ArrowRightCircle } from "lucide-react";


export default function ReviewProfilePage() {
	const [showModal, setShowModal] = useState(false);
	const [jenisInstansiList, setJenisInstansiList] = useState<{ id: number; name: string }[]>([]);
	const [jabatanList, setJabatanList] = useState<{ id: string; nama: string }[]>([]);
	const [instansiList, setInstansiList] = useState<{ id: string; agency_name: string }[]>([]);
	const [pelatihanList, setPelatihanList] = useState<{ id: number; nama: string }[]>([]);
	const [loading, setLoading] = useState(false);
	const { form, setForm } = useProfileFormStore();
	const router = useRouter();

	useEffect(() => {
		fetch("/api/jabatan")
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => setJabatanList(data))
			.catch(() => setJabatanList([]));
		// Fetch pelatihan list from API
		fetch("/api/pelatihan")
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => setPelatihanList(data))
			.catch(() => setPelatihanList([]));
		// Fetch jenis instansi list from API
		fetch("/api/jenis_instansi")
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => setJenisInstansiList(data))
			.catch(() => setJenisInstansiList([]));
	}, []);

	useEffect(() => {
		if (form.jenisInstansi) {
			const jenis = jenisInstansiList.find((j) => j.name === form.jenisInstansi);
			if (jenis) {
				fetch(`/api/instansi/${jenis.id}`)
					.then((res) => (res.ok ? res.json() : []))
					.then((data) => setInstansiList(data))
					.catch(() => setInstansiList([]));
			} else {
				setInstansiList([]);
			}
			setForm({ instansi: "" });
		} else {
			setInstansiList([]);
			setForm({ instansi: "" });
		}
	}, [form.jenisInstansi, jenisInstansiList, setForm]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Temukan id dari jenisInstansi dan instansi
		const jenis = jenisInstansiList.find((j) => j.name === form.jenisInstansi);
		const instansi = instansiList.find((i) => i.agency_name === form.instansi);
		const jabatanAnda = jabatanList.find((j) => j.nama === form.jabatanAnda);

		if (
			!form.namaAlumni ||
			!jenis?.id ||
			!instansi?.id ||
			!jabatanAnda?.id ||
			!form.pelatihan ||
			!form.hubungan ||
			!form.jabatanAlumni ||
			!form.namaAnda
		) {
			alert("Semua field wajib diisi!");
			setLoading(false);
			return;
		}

	try {
	  const payload = {
		name: form.namaAnda,
		instansiKategoriId: jenis?.id || null,
		instansiId: instansi?.id || null,
		jabatanId: jabatanAnda?.id || null,
		namaAlumni: form.namaAlumni,
		hubungan: form.hubungan,
		jabatan_alumni: form.jabatanAlumni,
		pelatihanId: form.pelatihan ? Number(form.pelatihan) : null,
		nipNrpNik: "",
		domisiliId: null,
		tahunPelatihanId: null,
		lemdik: "",
		handphone: ""
	  };
	  console.log("Payload to /api/peer_review:", payload);
	  const res = await fetch("/api/peer_review", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	  });
	  const rawResponse = await res.text();
	  console.log("Raw backend response:", rawResponse);
	  if (res.ok) {
		setShowModal(true);
	  } else {
		alert("Gagal menyimpan data. Silakan cek kembali isian Anda.\n" + rawResponse);
	  }
	} catch (err) {
	  alert("Terjadi kesalahan. Silakan coba lagi.\n" + err);
	} finally {
	  setLoading(false);
	}
	};

	const handleLanjut = () => {
		router.push("/review/evaluasi");
	};

	return (
		<div>
			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
					<div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-[#B3E5FC]">
						<h3 className="text-2xl font-bold text-[#1976D2] mb-4">Terima Kasih!</h3>
						<p className="mb-6 text-gray-700">Terima kasih <span className="font-semibold">{form.namaAnda}</span> telah mengisi profile.<br />Sekarang silakan lanjut untuk mengisi surveynya.</p>
						<button
							className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-8 py-3 rounded-xl shadow-lg font-bold text-lg tracking-wide transition flex items-center justify-center gap-2"
							onClick={() => { setShowModal(false); handleLanjut(); }}
						>
							<ArrowRightCircle className="w-6 h-6" /> Lanjut Isi Survei
						</button>
					</div>
				</div>
			)}
			<div className="max-w-4xl mx-auto mt-6 mb-8 bg-white/80 rounded-2xl shadow p-6 border border-[#B3E5FC]">
				<div className="text-xl font-bold text-[#1976D2] mb-2 text-center">
					Evaluasi Pasca Pelatihan Nasional - Atasan/Rekan Kerja/Bawahan{" "}
					<span className="text-base font-normal">(Draf)</span>
				</div>
				<div className="text-gray-700 text-base leading-relaxed mb-2">
					Sebagai bagian dari upaya peningkatan mutu pelatihan, Direktorat Penjaminan Mutu Pengembangan Kapasitas Lembaga Administrasi Negara menyelenggarakan Evaluasi Pascapelatihan Nasional untuk mengidentifikasi hasil pelatihan, khususnya pada level perilaku (behaviour) dan dampak yang ditimbulkan dari pelaksanaan pelatihan.
					<br />
					<br />
					Formulir ini ditujukan bagi Alumni Pelatihan Tahun 2021-2024 pada:
					<ol className="list-decimal list-inside ml-4 my-2">
						<li>Pelatihan Kepemimpinan Nasional Tingkat I</li>
						<li>Pelatihan Kepemimpinan Nasional Tingkat II</li>
						<li>Pelatihan Kepemimpinan Administrator</li>
						<li>Pelatihan Kepemimpinan Pengawas</li>
						<li>Pelatihan Dasar CPNS</li>
					</ol>
					Kami mohon kesediaan Bapak/Ibu untuk mengisi formulir ini secara objektif. Masukan Anda sangat berharga dalam mendukung perbaikan berkelanjutan pelatihan ASN. Data dan informasi pribadi yang Bapak/Ibu sampaikan akan dijaga kerahasiaannya, digunakan hanya untuk keperluan evaluasi, dan tidak akan disebarluaskan tanpa izin.
					<br />
					<br />
					<span className="font-semibold">Waktu pengisian membutuhkan 3 - 5 menit.</span>
					<br />
					<span className="italic text-sm">
						Catatan: Jika Anda pernah mengikuti lebih dari satu pelatihan, silahkan gunakan informasi Pelatihan terakhir Anda
					</span>
				</div>
			</div>
			<form
				className="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]"
				onSubmit={handleSubmit}
			>
				<h2 className="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
					Informasi Profil Penilai Alumni
				</h2>
				<div className="space-y-6">
					{/* Nama Lengkap */}
					<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
						<label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
							Nama Lengkap <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="namaAnda"
							value={form.namaAnda}
							onChange={handleChange}
							required
							className="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
							placeholder="Masukkan nama lengkap Anda"
						/>
					</div>
					{/* Jenis Instansi */}
					<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
						<label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
							Jenis Instansi <span className="text-red-500">*</span>
						</label>
						<select
							name="jenisInstansi"
							value={form.jenisInstansi}
							onChange={handleChange}
							required
							className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
						>
							<option value="" disabled>
								Pilih Jenis Instansi
							</option>
							{jenisInstansiList.map((item) => (
								<option key={item.id} value={item.name}>
									{item.name}
								</option>
							))}
						</select>
					</div>
					{/* Instansi */}
					<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
						<label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
							Instansi <span className="text-red-500">*</span>
						</label>
						<div className="flex-1">
							<select
								name="instansi"
								value={form.instansi}
								onChange={handleChange}
								required
								className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
								disabled={!form.jenisInstansi}
							>
								<option value="" disabled>
									Pilih Instansi
								</option>
								{instansiList.map((item) => (
									<option key={item.id} value={item.agency_name}>
										{item.agency_name}
									</option>
								))}
							</select>
						</div>
					</div>
					{/* Jabatan Anda */}
					<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
						<label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
							Jabatan Anda <span className="text-red-500">*</span>
						</label>
						<select
							name="jabatanAnda"
							value={form.jabatanAnda}
							onChange={handleChange}
							required
							className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
						>
							<option value="" disabled>
								Pilih Jabatan Anda
							</option>
							{jabatanList.map((item) => (
								<option key={item.id} value={item.nama}>
									{item.nama}
								</option>
							))}
						</select>
					</div>
					{/* Nama Alumni */}
					<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
						<label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
							Nama Alumni <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="namaAlumni"
							value={form.namaAlumni}
							onChange={handleChange}
							required
							className="flex-1 border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
							placeholder="Masukkan nama alumni"
						/>
					</div>
					{/* Hubungan dengan Alumni */}
					<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
						<label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
							Hubungan dengan Alumni <span className="text-red-500">*</span>
						</label>
						<select
							name="hubungan"
							value={form.hubungan}
							onChange={handleChange}
							required
							className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
						>
							<option value="" disabled>
								Pilih Hubungan
							</option>
							<option>Atasan</option>
							<option>Rekan Kerja</option>
							<option>Bawahan</option>
						</select>
					</div>
					{/* Jabatan Alumni Saat Ini */}
					<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
						<label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
							Jabatan Alumni Saat Ini <span className="text-red-500">*</span>
						</label>
						<select
							name="jabatanAlumni"
							value={form.jabatanAlumni}
							onChange={handleChange}
							required
							className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
						>
							<option value="" disabled>
								Pilih Jabatan Alumni
							</option>
							{jabatanList.map((item) => (
								<option key={item.id} value={item.nama}>
									{item.nama}
								</option>
							))}
						</select>
					</div>
					{/* Pelatihan yang diikuti Alumni */}
					<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
						<label className="md:w-64 font-semibold text-[#1976D2] mb-1 md:mb-0">
							Pelatihan yang diikuti Alumni <span className="text-red-500">*</span>
						</label>
						<select
							name="pelatihan"
							value={form.pelatihan}
							onChange={handleChange}
							required
							className="flex-1 border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]"
						>
							<option value="" disabled>
								Pilih Pelatihan
							</option>
							{pelatihanList.map((item) => (
								<option key={item.id} value={item.id}>
									{item.nama}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="text-center pt-2">
					<button
						type="submit"
						disabled={loading}
						className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition flex items-center justify-center gap-2"
					>
						<CheckCircle className="w-6 h-6" />
						{loading ? "Menyimpan..." : "Simpan"}
					</button>
				</div>
			</form>
		</div>
	);
}