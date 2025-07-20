"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/lib/store/profileStore"; // pastikan path sesuai
import { ArrowRight } from "lucide-react"; // Tambahkan import ini

type JenisInstansi = { id: number; name: string };
type Instansi = { id: number; agency_name: string };
type Domisili = { id: number; nama: string };
type Pelatihan = { id: number; nama: string };
type Jabatan = { id: number; nama: string };
type TahunPelatihan = { id: number; tahun: string };

export default function ProfileForm() {
  // State untuk list dropdown
  const [jenisInstansiList, setJenisInstansiList] = useState<JenisInstansi[]>([]);
  const [instansiList, setInstansiList] = useState<Instansi[]>([]);
  const [domisiliList, setDomisiliList] = useState<Domisili[]>([]);
  const [pelatihanList, setPelatihanList] = useState<Pelatihan[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [tahunPelatihanList, setTahunPelatihanList] = useState<TahunPelatihan[]>([]);

  // State untuk form
  const [form, setForm] = useState({
    nama: "",
    nip: "",
    instansi: "",
    jenisInstansi: "",
    domisili: "",
    jabatan: "",
    pelatihan: "",
    tahunPelatihan: "",
    lembagaPenyelenggara: "",
    handphone: "",
  });
  const [saved, setSaved] = useState(false);

  const router = useRouter();
  const nama = useProfileStore((state) => state.nama); // ambil nama dari zustand

  // Fetch data dropdown saat mount
  useEffect(() => {
    async function fetchData() {
      const jenisRes = await fetch("/api/jenis_instansi");
      setJenisInstansiList(await jenisRes.json());
      const pelatihanRes = await fetch("/api/pelatihan");
      setPelatihanList(await pelatihanRes.json());
      const provRes = await fetch("/api/provinsi");
      setDomisiliList(await provRes.json());
      const jabatanRes = await fetch("/api/jabatan");
      setJabatanList(await jabatanRes.json());
      const tahunRes = await fetch("/api/tahun_pelatihan");
      setTahunPelatihanList(await tahunRes.json());
    }
    fetchData();
  }, []);

  // Fetch instansi saat jenisInstansi berubah
  useEffect(() => {
    async function fetchInstansi() {
      if (form.jenisInstansi) {
        try {
          const res = await fetch(`/api/instansi/${form.jenisInstansi}`);
          setInstansiList(await res.json());
        } catch {
          setInstansiList([]);
        }
        setForm((f) => ({ ...f, instansi: "" }));
      } else {
        setInstansiList([]);
        setForm((f) => ({ ...f, instansi: "" }));
      }
    }
    fetchInstansi();
 
  }, [form.jenisInstansi]);

  // Handle input change
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      namaAlumni: form.nama,
      nipNrpNik: form.nip,
      instansiKategoriId: Number(form.jenisInstansi),
      instansiId: Number(form.instansi),
      domisiliId: Number(form.domisili),
      jabatanId: Number(form.jabatan),
      pelatihanId: Number(form.pelatihan),
      tahunPelatihanId: Number(form.tahunPelatihan),
      lemdik: form.lembagaPenyelenggara,
      handphone: form.handphone,
    };
    try {
      const res = await fetch("/api/profile_alumni", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.status === "success") {
        useProfileStore.getState().setProfile({
          id: result.id,
          nama: result.nama,
          pelatihan_id: result.pelatihan_id,
        });
        toast.success(
          `Terima kasih ${nama ? nama : ""} sudah bersedia mengisi survey! Silakan lanjut ke tahap berikutnya.`
        );
        setSaved(true); // Data tersimpan, munculkan tombol lanjut
      } else {
        toast.error("Gagal menyimpan data: " + (result.message || "Unknown error"));
      }
    } catch {
      toast.error("Terjadi error saat menyimpan data!");
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto mt-6 mb-8 bg-white rounded-2xl shadow p-6 border border-[#B3E5FC]">
        <div className="text-xl font-bold text-[#1976D2] mb-2 text-center">
          Evaluasi Pascapelatihan Nasional - Alumni
        </div>
        <div className="text-gray-700 text-base leading-relaxed mb-2">
          Sebagai bagian dari upaya peningkatan mutu pelatihan, Direktorat Penjaminan Mutu Pengembangan Kapasitas Lembaga Administrasi Negara menyelenggarakan Evaluasi Pascapelatihan Nasional untuk mengidentifikasi hasil pelatihan, khususnya pada level perilaku (behaviour) dan dampak yang ditimbulkan dari pelaksanaan pelatihan.
          <br /><br />
          Formulir ini ditujukan bagi Alumni Pelatihan Tahun 2021-2024 pada:
          <ol className="list-decimal list-inside ml-4 my-2">
            <li>Pelatihan Kepemimpinan Nasional Tingkat I</li>
            <li>Pelatihan Kepemimpinan Nasional Tingkat II</li>
            <li>Pelatihan Kepemimpinan Administrator</li>
            <li>Pelatihan Kepemimpinan Pengawas</li>
            <li>Pelatihan Dasar CPNS</li>
          </ol>
          Kami mohon kesediaan Bapak/Ibu untuk mengisi formulir ini secara objektif. Masukan Anda sangat berharga dalam mendukung perbaikan berkelanjutan pelatihan ASN. Data dan informasi pribadi yang Bapak/Ibu sampaikan akan dijaga kerahasiaannya, digunakan hanya untuk keperluan evaluasi, dan tidak akan disebarluaskan tanpa izin.
          <br /><br />
          <span className="font-semibold">Waktu pengisian membutuhkan 3 - 5 menit.</span>
          <br /><span className="italic text-sm">Catatan: Jika Anda pernah mengikuti lebih dari satu pelatihan, silahkan gunakan informasi Pelatihan terakhir Anda</span>
        </div>
      </div>
      <form
        className="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Profil Responden</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Nama Lengkap</label>
          </div>
          <div>
            <Input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">NIP/NRP/NIK</label>
          </div>
          <div>
            <Input
              type="text"
              name="nip"
              value={form.nip}
              onChange={handleChange}
              className="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
              placeholder="Masukkan NIP/NRP/NIK"
              required
            />
          </div>

          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Jenis Instansi</label>
          </div>
          <div>
            <Select
              value={form.jenisInstansi}
              onValueChange={(value) => setForm((f) => ({ ...f, jenisInstansi: value }))}
              required
            >
              <SelectTrigger className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
                <SelectValue placeholder="Pilih Jenis Instansi" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {jenisInstansiList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Instansi</label>
          </div>
          <div>
            <Select
              value={form.instansi}
              onValueChange={(value) => setForm((f) => ({ ...f, instansi: value }))}
              disabled={!form.jenisInstansi}
              required
            >
              <SelectTrigger className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
                <SelectValue placeholder="Pilih Instansi" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {instansiList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.agency_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Domisili Instansi</label>
          </div>
          <div>
            <Select
              value={form.domisili}
              onValueChange={(value) => setForm((f) => ({ ...f, domisili: value }))}
              required
            >
              <SelectTrigger className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
                <SelectValue placeholder="Pilih Domisili" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {domisiliList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Jabatan</label>
          </div>
          <div>
            <Select
              value={form.jabatan}
              onValueChange={(value) => setForm((f) => ({ ...f, jabatan: value }))}
              required
            >
              <SelectTrigger className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
                <SelectValue placeholder="Pilih Jabatan" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {jabatanList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Nama Pelatihan</label>
          </div>
          <div>
            <Select
              value={form.pelatihan}
              onValueChange={(value) => setForm((f) => ({ ...f, pelatihan: value }))}
              required
            >
              <SelectTrigger className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
                <SelectValue placeholder="Pilih Nama Pelatihan" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {pelatihanList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Tahun Pelatihan</label>
          </div>
          <div>
            <Select
              value={form.tahunPelatihan}
              onValueChange={(value) => setForm((f) => ({ ...f, tahunPelatihan: value }))}
              required
            >
              <SelectTrigger className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
                <SelectValue placeholder="Pilih Tahun Pelatihan" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {tahunPelatihanList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.tahun}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Lembaga Penyelenggara Pelatihan</label>
          </div>
          <div>
            <Input
              type="text"
              name="lembagaPenyelenggara"
              value={form.lembagaPenyelenggara}
              onChange={handleChange}
              className="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
              placeholder="Masukkan nama lembaga penyelenggara"
              required
            />
          </div>

          <div className="flex items-center md:justify-end">
            <label className="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Nomor Handphone</label>
          </div>
          <div>
            <Input
              type="tel"
              name="handphone"
              value={form.handphone}
              onChange={handleChange}
              className="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
              placeholder="Masukkan nomor handphone"
              required
            />
          </div>
        </div>
        <div className="text-center pt-2">
          {!saved ? (
            <button
              type="submit"
              className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition"
            >
              Simpan
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/alumni/evaluasi")}
              className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition flex items-center gap-2"
            >
              Lanjut <ArrowRight size={20} />
            </button>
          )}
        </div>
      </form>
    </>
  );
}