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
import { AlertCircle } from "lucide-react";

type JenisInstansi = { id: number; name: string };
type Instansi = { id: number; agency_name: string };
type Domisili = { id: number; nama: string };
type Pelatihan = { id: number; nama: string };
type Jabatan = { id: number; nama: string };
type TahunPelatihan = { id: number; tahun: string };

export default function ProfileForm() {  // State untuk list dropdown
  const [jenisInstansiList, setJenisInstansiList] = useState<JenisInstansi[]>([]);
  const [instansiList, setInstansiList] = useState<Instansi[]>([]);
  const [filteredInstansiList, setFilteredInstansiList] = useState<Instansi[]>([]);
  const [domisiliList, setDomisiliList] = useState<Domisili[]>([]);
  const [filteredDomisiliList, setFilteredDomisiliList] = useState<Domisili[]>([]);
  const [pelatihanList, setPelatihanList] = useState<Pelatihan[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [tahunPelatihanList, setTahunPelatihanList] = useState<TahunPelatihan[]>([]);
  const [lemdikList, setLemdikList] = useState<{ id: number; namaLemdik: string }[]>([]);
  const [filteredLemdikList, setFilteredLemdikList] = useState<{ id: number; namaLemdik: string }[]>([]);

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
    jenisLembagaPenyelenggara: "",
    lembagaPenyelenggara: "",
    domisiliLembagaPenyelenggara: "",
    handphone: "",
  });
  const [saved, setSaved] = useState(false);
  const [showNamaModal, setShowNamaModal] = useState(false);
  const router = useRouter();  const { nama, formData, setFormData, hasHydrated } = useProfileStore(); // ambil data dari zustand  // Debugging effect untuk melihat status hydration dan data
  useEffect(() => {
    console.log("Current hydration status:", hasHydrated);
    console.log("Current formData in store:", formData);
    
    // Cek localStorage secara manual
    const storedData = localStorage.getItem('profile-storage');
    console.log("Raw localStorage content:", storedData);
    
    // Coba parse localStorage untuk debugging
    try {
      const parsedData = storedData ? JSON.parse(storedData) : null;
      console.log("Parsed localStorage content:", parsedData);
    } catch (e) {
      console.error("Failed to parse localStorage:", e);
    }
  }, [hasHydrated]);

  // Load data dari store setelah hydration dan ketika formData berubah
  useEffect(() => {
    // Cek status hydration terlebih dahulu
    if (!hasHydrated) {
      console.log("Not yet hydrated, skipping form load");
      return;
    }
    
    // Cek formData apakah ada dan memiliki data
    if (formData) {
      // Cek apakah formData memiliki data yang valid (setidaknya ada nama atau nip)
      if (formData.nama || formData.nip || formData.instansi) {
        console.log("Loading form data from store:", formData);
        setForm(formData);
        setSaved(true); // Juga set status saved jika data sudah ada
      } else {
        console.log("FormData exists but has no valid data");
      }
    } else {
      console.log("FormData is null or undefined");
    }
  }, [hasHydrated, formData]); // Dependensi pada hasHydrated dan formData

  // Fetch data dropdown saat mount
  useEffect(() => {
    async function fetchData() {
      const jenisRes = await fetch("/api/jenis_instansi");
      setJenisInstansiList(await jenisRes.json());
      const pelatihanRes = await fetch("/api/pelatihan");
      setPelatihanList(await pelatihanRes.json());      const provRes = await fetch("/api/provinsi");
      const domisiliData = await provRes.json();
      // Urutkan domisili secara ascending (A ke Z)
      const sortedDomisiliData = domisiliData.sort((a: Domisili, b: Domisili) => 
        a.nama.localeCompare(b.nama)
      );
      setDomisiliList(sortedDomisiliData);
      setFilteredDomisiliList(sortedDomisiliData);
      const jabatanRes = await fetch("/api/jabatan");
      setJabatanList(await jabatanRes.json());
      const tahunRes = await fetch("/api/tahun_pelatihan");
      setTahunPelatihanList(await tahunRes.json());
      const lemdikRes = await fetch("/api/lembaga_penyelenggara");
      setLemdikList(await lemdikRes.json());
    }
    fetchData();
  }, []);  // Fetch instansi saat jenisInstansi berubah
  useEffect(() => {
    async function fetchInstansi() {
      if (form.jenisInstansi) {
        try {
          const res = await fetch(`/api/instansi/${form.jenisInstansi}`);
          const data = await res.json();
          // Urutkan instansi secara ascending (A ke Z)
          const sortedData = data.sort((a: Instansi, b: Instansi) => 
            a.agency_name.localeCompare(b.agency_name)
          );
          setInstansiList(sortedData);
          setFilteredInstansiList(sortedData);        } catch {
          setInstansiList([]);
          setFilteredInstansiList([]);
        }
        const newForm = { ...form, instansi: "" };
        setForm(newForm);
        setFormData(newForm);      } else {
        setInstansiList([]);
        setFilteredInstansiList([]);
        const newForm = { ...form, instansi: "" };
        setForm(newForm);
        setFormData(newForm);
      }
    }
    fetchInstansi();
 
  }, [form.jenisInstansi]);
  // Fetch lemdik dari API eksternal
  useEffect(() => {
    async function fetchLemdik() {
      try {
        const res = await fetch("https://api-smartbangkom.lan.go.id/master/lemdik");
        const data = await res.json();
        // Urutkan lembaga penyelenggara secara ascending (A ke Z)
        const sortedData = data.sort((a: { namaLemdik: string }, b: { namaLemdik: string }) => 
          a.namaLemdik.localeCompare(b.namaLemdik)
        );
        setLemdikList(sortedData);
        setFilteredLemdikList(sortedData);
      } catch {
        setLemdikList([]);
        setFilteredLemdikList([]);
      }
    }
    fetchLemdik();
  }, []); 
    // Handle input change
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    setFormData(newForm); // Simpan ke Zustand store
  }  // Handle select change
  function handleSelectChange(name: string, value: string) {
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    setFormData(newForm); // Simpan ke Zustand store
  }

  // Handle submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.domisiliLembagaPenyelenggara) {
      toast.error("Mohon pilih domisili instansi lembaga penyelenggara!");
      return;
    }
    const payload = {
      namaAlumni: form.nama,
      nipNrpNik: form.nip,
      instansiKategoriId: Number(form.jenisInstansi),
      instansiId: Number(form.instansi),
      domisiliId: Number(form.domisiliLembagaPenyelenggara),
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
        body: JSON.stringify(payload),      });
      const result = await res.json();
      if (result.status === "success") {        // Simpan profile data dan form data ke store
        const profileData = {
          id: result.id,
          nama: result.nama,
          pelatihan_id: result.pelatihan_id,
        };
        
        console.log("Saving profile to store:", profileData);
        useProfileStore.getState().setProfile(profileData);
        
        console.log("Saving form data to store:", form);
        useProfileStore.getState().setFormData(form);
        
        // Simpan langsung ke localStorage juga untuk redundansi
        const currentStorage = localStorage.getItem('profile-storage');
        if (currentStorage) {
          try {
            const parsedStorage = JSON.parse(currentStorage);
            const updatedStorage = {
              ...parsedStorage,
              state: {
                ...parsedStorage.state,
                id: result.id,
                nama: result.nama,
                pelatihan_id: result.pelatihan_id,
                formData: form
              }
            };
            localStorage.setItem('profile-storage', JSON.stringify(updatedStorage));
            console.log("Updated localStorage directly:", updatedStorage);
          } catch (e) {
            console.error("Failed to update localStorage directly:", e);
          }
        }
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
        className="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-4 md:p-10 space-y-8 border border-[#B3E5FC]"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Profil Responden</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 md:gap-y-6">
          {/* Nama Lengkap */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">
              Nama Lengkap
            </label>
          </div>
          <div className="w-full">
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

          {/* NIP/NRP/NIK */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">NIP/NRP/NIK</label>
          </div>
          <div className="w-full">
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

          {/* Jenis Instansi */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Jenis Instansi</label>
          </div>
          <div className="w-full">            <Select
              value={form.jenisInstansi}
              onValueChange={(value) => handleSelectChange("jenisInstansi", value)}
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

          {/* Instansi */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Instansi</label>
          </div>
          <div className="w-full">            <Select
              value={form.instansi}
              onValueChange={(value) => handleSelectChange("instansi", value)}
              disabled={!form.jenisInstansi}
              required
            >
              <SelectTrigger className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
                <SelectValue placeholder="Pilih Instansi" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white max-h-72 overflow-y-auto">                <input
                  type="text"
                  placeholder="Cari instansi..."
                  className="w-full px-2 py-1 mb-2 border rounded"
                  onChange={e => {
                    const val = e.target.value.toLowerCase();
                    const filtered = instansiList.filter(i => i.agency_name.toLowerCase().includes(val));
                    // Tetap urutkan hasil filter secara ascending
                    const sortedFiltered = filtered.sort((a, b) => a.agency_name.localeCompare(b.agency_name));
                    setFilteredInstansiList(sortedFiltered);
                  }}
                />
                {filteredInstansiList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>{item.agency_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Jabatan */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Jabatan</label>
          </div>
          <div className="w-full">
            <Select
              value={form.jabatan}
              onValueChange={(value) => handleSelectChange("jabatan", value)}
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

          {/* Nama Pelatihan */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Nama Pelatihan</label>
          </div>
          <div className="w-full">
            <Select
              value={form.pelatihan}
              onValueChange={(value) => handleSelectChange("pelatihan", value)}
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

          {/* Tahun Pelatihan */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Tahun Pelatihan</label>
          </div>
          <div className="w-full">
            <Select
              value={form.tahunPelatihan}
              onValueChange={(value) => handleSelectChange("tahunPelatihan", value)}
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

          {/* Instansi Lembaga Penyelenggara */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Instansi Lembaga Penyelenggara</label>
          </div>
          <div className="w-full">
            <Select
              value={form.lembagaPenyelenggara}
              onValueChange={(value) => handleSelectChange("lembagaPenyelenggara", value)}
              required
            >
              <SelectTrigger className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
                <SelectValue placeholder="Pilih Instansi Lembaga Penyelenggara" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white max-h-72 overflow-y-auto">                <input
                  type="text"
                  placeholder="Cari lembaga..."
                  className="w-full px-2 py-1 mb-2 border rounded"
                  onChange={e => {
                    const val = e.target.value.toLowerCase();
                    const filtered = lemdikList.filter(i => i.namaLemdik.toLowerCase().includes(val));
                    // Tetap urutkan hasil filter secara ascending
                    const sortedFiltered = filtered.sort((a, b) => a.namaLemdik.localeCompare(b.namaLemdik));
                    setFilteredLemdikList(sortedFiltered);
                  }}
                />
                {filteredLemdikList.map((item) => (
                  <SelectItem key={item.id} value={item.namaLemdik}>
                    {item.namaLemdik}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Domisili Instansi Lembaga Penyelenggara */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">
              Domisili Instansi Lembaga Penyelenggara
            </label>
          </div>
          <div className="w-full">
            <Select
              value={form.domisiliLembagaPenyelenggara}
              onValueChange={(value) => handleSelectChange("domisiliLembagaPenyelenggara", value)}
              required
            >
              <SelectTrigger className="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
                <SelectValue placeholder="Pilih Domisili Instansi Lembaga Penyelenggara" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white max-h-72 overflow-y-auto">                <input
                  type="text"
                  placeholder="Cari domisili..."
                  className="w-full px-2 py-1 mb-2 border rounded"
                  onChange={e => {
                    const val = e.target.value.toLowerCase();
                    const filtered = domisiliList.filter(i => i.nama.toLowerCase().includes(val));
                    // Tetap urutkan hasil filter secara ascending
                    const sortedFiltered = filtered.sort((a, b) => a.nama.localeCompare(b.nama));
                    setFilteredDomisiliList(sortedFiltered);
                  }}
                />
                {filteredDomisiliList.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nomor HP */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Nomor HP</label>
          </div>
          <div className="w-full">
            <Input
              type="tel"
              name="handphone"
              value={form.handphone}
              onChange={handleChange}
              className="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition"
              placeholder="Masukkan nomor HP"
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

      {/* Modal Keterangan Nama Lengkap */}
      {showNamaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-xs w-full text-center">
            <div className="flex justify-center mb-2">
              <AlertCircle size={32} className="text-[#F59E42]" />
            </div>
            <div className="text-[#1976D2] font-semibold mb-2">Keterangan Nama Lengkap</div>
            <div className="text-gray-700 text-sm mb-4">
              Nama lengkap adalah nama Anda sebagai alumni pelatihan.
            </div>
            <button
              onClick={() => setShowNamaModal(false)}
              className="bg-[#1976D2] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#1565C0] transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}