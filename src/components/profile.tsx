"use client";

import { useState, useEffect } from "react";
import { useProfileFormStore } from "@/lib/store/globalStore";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";


type JenisInstansi = { id: number; name: string };
type Instansi = { id: number; agency_name: string };
type Domisili = { id: number; nama: string };
type Pelatihan = { id: number; nama: string };
type Jabatan = { id: number; nama: string };
type TahunPelatihan = { id: number; tahun: string };
type Lemdik = { id: number; namalemdik: string; provinsi: number };

export default function ProfileForm() {
  const profileStore = useProfileFormStore();
  const router = useRouter();

  // State
  const [jenisInstansiList, setJenisInstansiList] = useState<JenisInstansi[]>([]);
  // Removed unused setInstansiList
  const [filteredInstansiList, setFilteredInstansiList] = useState<Instansi[]>([]);
  const [domisiliList, setDomisiliList] = useState<Domisili[]>([]);
  const [filteredDomisiliList, setFilteredDomisiliList] = useState<Domisili[]>([]);
  const [pelatihanList, setPelatihanList] = useState<Pelatihan[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [tahunPelatihanList, setTahunPelatihanList] = useState<TahunPelatihan[]>([]);
  // Removed unused setLemdikList
  const [filteredLemdikList, setFilteredLemdikList] = useState<Lemdik[]>([]);
  const [saved, setSaved] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState<"success"|"error">("success");

  const initialForm = {
    id: undefined as string | number | undefined,
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
  };
  const [form, setForm] = useState<typeof initialForm>(initialForm);

  // Hydrate form from localStorage after mount (client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alumni_profile_form");
      if (saved) {
        const parsed = JSON.parse(saved);
        setForm(parsed);
        // Sync id ke profileStore jika ada dan berbeda
        if (parsed.id && profileStore.id !== parsed.id) {
          profileStore.setForm({ id: parsed.id });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // UI: Hero header
  const Hero = () => (
    <div className="relative w-full max-w-4xl mx-auto mb-8">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#2196F3]/70 via-[#E3F2FD]/80 to-[#1976D2]/60 blur-xl opacity-60 z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center py-10 px-6 md:px-12 rounded-3xl shadow-2xl border-2 border-[#B3E5FC] bg-white/90">
        <CheckCircle2 size={64} className="text-[#2196F3] mb-4 drop-shadow-lg" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Evaluasi Pascapelatihan Nasional - Alumni</h1>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2 text-center max-w-2xl">
          Sebagai bagian dari upaya peningkatan mutu pelatihan, Direktorat Penjaminan Mutu Pengembangan Kapasitas Lembaga Administrasi Negara menyelenggarakan Evaluasi Pascapelatihan Nasional untuk mengidentifikasi hasil pelatihan, khususnya pada level perilaku (behaviour) dan dampak yang ditimbulkan dari pelaksanaan pelatihan.<br /><br />
          Formulir ini ditujukan bagi Alumni Pelatihan Tahun 2021-2024 pada:
        </p>
        <ol className="list-decimal list-inside ml-4 my-2 text-left">
          <li>Pelatihan Kepemimpinan Nasional Tingkat I</li>
          <li>Pelatihan Kepemimpinan Nasional Tingkat II</li>
          <li>Pelatihan Kepemimpinan Administrator</li>
          <li>Pelatihan Kepemimpinan Pengawas</li>
          <li>Pelatihan Dasar CPNS</li>
        </ol>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-2 text-center max-w-2xl">
          Kami mohon kesediaan Bapak/Ibu untuk mengisi formulir ini secara objektif. Masukan Anda sangat berharga dalam mendukung perbaikan berkelanjutan pelatihan ASN. Data dan informasi pribadi yang Bapak/Ibu sampaikan akan dijaga kerahasiaannya, digunakan hanya untuk keperluan evaluasi, dan tidak akan disebarluaskan tanpa izin.<br /><br />
          <span className="font-semibold">Waktu pengisian membutuhkan 3 - 5 menit.</span><br />
          <span className="italic text-sm">Catatan: Jika Anda pernah mengikuti lebih dari satu pelatihan, silahkan gunakan informasi Pelatihan terakhir Anda</span>
        </p>
      </div>
    </div>
  );

  // Fetch dropdown data
  useEffect(() => {
    async function fetchData() {
      try {
        const jenisRes = await fetch("/api/jenis_instansi");
        setJenisInstansiList(await jenisRes.json());
        const pelatihanRes = await fetch("/api/pelatihan");
        setPelatihanList(await pelatihanRes.json());
        const provRes = await fetch("/api/provinsi");
        const domisiliData = await provRes.json();
        const sortedDomisiliData = domisiliData.sort((a: Domisili, b: Domisili) => a.nama.localeCompare(b.nama));
        setDomisiliList(sortedDomisiliData);
        setFilteredDomisiliList(sortedDomisiliData);
        const jabatanRes = await fetch("/api/jabatan");
        setJabatanList(await jabatanRes.json());
        const tahunRes = await fetch("/api/tahun_pelatihan");
        setTahunPelatihanList(await tahunRes.json());
        const lemdikRes = await fetch("/api/master_lemdik");
        const lemdikJson = await lemdikRes.json();
        // setLemdikList removed
        setFilteredLemdikList(lemdikJson.data);
      } catch {
        // handle error
      }
    }
    fetchData();
  }, []);

  // Instansi filter
  useEffect(() => {
    async function fetchInstansi() {
      if (form.jenisInstansi) {
        const res = await fetch(`/api/instansi/${form.jenisInstansi}`);
        const data = await res.json();
        const sortedData = data.sort((a: Instansi, b: Instansi) => a.agency_name.localeCompare(b.agency_name));
        // setInstansiList removed
        setFilteredInstansiList(sortedData);
        setForm((f: typeof form) => ({ ...f, instansi: "" }));
      } else {
        // setInstansiList removed
        setFilteredInstansiList([]);
        setForm((f: typeof form) => ({ ...f, instansi: "" }));
      }
    }
    fetchInstansi();
  }, [form.jenisInstansi]);

  // Auto-select domisili when lembagaPenyelenggara changes
  // Auto-select domisili only if user selects a new lembaga
  useEffect(() => {
    if (form.lembagaPenyelenggara) {
      const selectedLemdik = filteredLemdikList.find(item => item.namalemdik === form.lembagaPenyelenggara);
      if (selectedLemdik) {
        const domisili = domisiliList.find(d => d.id === selectedLemdik.provinsi);
        if (domisili && form.domisiliLembagaPenyelenggara !== domisili.id.toString()) {
          setForm((f: typeof form) => ({ ...f, domisiliLembagaPenyelenggara: domisili.id.toString() }));
        }
      }
    }
  }, [form.lembagaPenyelenggara, form.domisiliLembagaPenyelenggara, domisiliList, filteredLemdikList]);

  // Handlers
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f: typeof form) => {
      // Ambil id lama dari localStorage jika ada
      let id = f.id;
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("alumni_profile_form");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.id) id = parsed.id;
        }
      }
      const updated = { ...f, [name]: value };
      if (id) updated.id = id;
      if (typeof window !== "undefined") {
        localStorage.setItem("alumni_profile_form", JSON.stringify(updated));
      }
      return updated;
    });
    profileStore.setForm({ [name]: value }); // update ke zustand
  }

  function handleSelectChange(name: string, value: string) {
    setForm((f: typeof form) => {
      // Ambil id lama dari localStorage jika ada
      let id = f.id;
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("alumni_profile_form");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.id) id = parsed.id;
        }
      }
      const updated = { ...f, [name]: value };
      if (id) updated.id = id;
      if (typeof window !== "undefined") {
        localStorage.setItem("alumni_profile_form", JSON.stringify(updated));
      }
      return updated;
    });
    profileStore.setForm({ [name]: value }); // update ke zustand
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.jenisInstansi || form.jenisInstansi === "0") {
      setDialogType("error");
      setDialogMessage("Mohon pilih Jenis Instansi!");
      setDialogOpen(true);
      return;
    }
    if (!form.instansi || form.instansi === "0") {
      setDialogType("error");
      setDialogMessage("Mohon pilih Instansi!");
      setDialogOpen(true);
      return;
    }
    if (!form.jabatan || form.jabatan === "0") {
      setDialogType("error");
      setDialogMessage("Mohon pilih Jabatan!");
      setDialogOpen(true);
      return;
    }
    if (!form.pelatihan || form.pelatihan === "0") {
      setDialogType("error");
      setDialogMessage("Mohon pilih Nama Pelatihan!");
      setDialogOpen(true);
      return;
    }
    if (!form.tahunPelatihan || form.tahunPelatihan === "0") {
      setDialogType("error");
      setDialogMessage("Mohon pilih Tahun Pelatihan!");
      setDialogOpen(true);
      return;
    }
    if (!form.domisiliLembagaPenyelenggara || form.domisiliLembagaPenyelenggara === "0") {
      setDialogType("error");
      setDialogMessage("Mohon pilih Domisili Instansi Lembaga Penyelenggara!");
      setDialogOpen(true);
      return;
    }
    // Ambil dari form state
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
      // Cek apakah sudah ada id integer dari database (bukan NIP/string)
      const alumniId = profileStore.id && !isNaN(Number(profileStore.id)) ? Number(profileStore.id) : null;
      let res;
      if (alumniId) {
        // PUT update jika sudah ada id integer
        res = await fetch(`/api/profile_alumni/${alumniId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // POST create jika belum ada id integer
        res = await fetch("/api/profile_alumni", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      const result = await res.json();
      if (result.status === "success") {
        setSaved(true);
        setDialogType("success");
        setDialogMessage(`Terima kasih ${form.nama} sudah mengisi profilnya. Silakan lanjut ke pengisian survey.`);
        setDialogOpen(true);
        // Simpan semua data payload ke zustand globalStore
        const newId = result.id;
        profileStore.setForm({
          id: newId,
          nama: form.nama,
          nip: form.nip,
          instansi: form.instansi,
          jenisInstansi: form.jenisInstansi,
          domisili: form.domisiliLembagaPenyelenggara,
          jabatan: form.jabatan,
          pelatihan: form.pelatihan,
          tahunPelatihan: form.tahunPelatihan,
          lembagaPenyelenggara: form.lembagaPenyelenggara,
          handphone: form.handphone,
        });
        // Simpan id integer ke localStorage agar update berikutnya selalu pakai id integer
        if (typeof window !== "undefined" && newId) {
          const savedProfile = localStorage.getItem("alumni_profile_form");
          if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            parsed.id = newId;
            localStorage.setItem("alumni_profile_form", JSON.stringify(parsed));
          }
        }
        // Jangan hapus localStorage di sini, biarkan sampai submit final di konfirmasi
      } else {
        setDialogType("error");
        let detailMsg = "Gagal menyimpan data: " + (result.message || "Unknown error");
        if (result.detail) {
          detailMsg += `\nDetail: ${result.detail}`;
        }
        setDialogMessage(detailMsg);
        setDialogOpen(true);
      }
    } catch {
      setDialogType("error");
      setDialogMessage("Terjadi error saat menyimpan data!");
      setDialogOpen(true);
    }
  }

  return (
    <>
      <Hero />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {dialogOpen && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        )}
        <DialogContent className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-[#B3E5FC] flex flex-col items-center gap-6 animate-fade-in z-[101]">
          <div className="flex flex-col items-center gap-4 w-full">
            {dialogType === "success" ? (
              <CheckCircle2 size={56} className="text-green-500 mb-2 drop-shadow-lg" />
            ) : (
              <XCircle size={56} className="text-red-500 mb-2 drop-shadow-lg" />
            )}
            <DialogTitle className={dialogType === "success" ? "text-green-700 text-3xl font-extrabold tracking-wide" : "text-red-700 text-3xl font-extrabold tracking-wide"}>
              {dialogType === "success" ? "Berhasil" : "Error"}
            </DialogTitle>
            <DialogDescription className="text-lg md:text-xl text-gray-700 text-center mb-2 font-medium">
              {dialogMessage}
            </DialogDescription>
            <DialogFooter className="w-full flex justify-center mt-4">
              {dialogType === "success" ? (
                <button
                  className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-4 rounded-2xl shadow-lg font-bold text-xl hover:from-[#1976D2] hover:to-[#2196F3] transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2"
                  onClick={() => { setDialogOpen(false); router.push("/alumni/evaluasi"); }}
                >
                  Lanjut ke Survey
                  <ArrowRight size={24} />
                </button>
              ) : (
                <button
                  className="bg-gradient-to-r from-red-400 to-red-600 text-white px-10 py-4 rounded-2xl shadow-lg font-bold text-xl hover:from-red-600 hover:to-red-400 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                  onClick={() => setDialogOpen(false)}
                >Tutup</button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      <form className="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-3xl shadow-2xl p-2 md:p-10 space-y-8 md:space-y-10 border-2 border-[#B3E5FC]" onSubmit={handleSubmit}>
        <h2 className="text-2xl md:text-4xl font-extrabold text-[#1976D2] mb-4 text-center tracking-wide drop-shadow">Profil Responden</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-10 gap-y-4 md:gap-y-8">
          {/* Nama Lengkap */}
          <div className="flex items-center justify-start md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Nama Lengkap</label>
          </div>
          <div className="w-full">
            <input type="text" name="nama" value={form.nama} onChange={handleChange} className="w-full border-2 border-[#90CAF9] rounded-xl px-4 py-3 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] bg-white shadow transition" placeholder="Masukkan nama lengkap" required />
          </div>
          {/* NIP/NRP/NIK */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">NIP/NRP/NIK</label>
          </div>
          <div className="w-full">
            <input
              type="text"
              name="nip"
              value={form.nip}
              onChange={handleChange}
              className="w-full border-2 border-[#90CAF9] rounded-xl px-4 py-3 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] bg-white shadow transition"
              placeholder="Masukkan NIP/NRP/NIK"
              required
              disabled={form.id !== undefined && form.id !== "" && !isNaN(Number(form.id))}
            />
          </div>
          {/* Jenis Instansi */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Jenis Instansi</label>
          </div>
          <div className="w-full">
          <Select value={form.jenisInstansi} onValueChange={value => handleSelectChange("jenisInstansi", value)} required>
            <SelectTrigger className="w-full border-2 border-[#90CAF9] rounded-xl px-4 py-3 text-base md:text-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#2196F3] transition-all">
              <SelectValue placeholder="Pilih Jenis Instansi" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg bg-white">
              {jenisInstansiList.map(item => (
                <SelectItem key={item.id} value={item.id.toString()} className="px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E3F2FD] focus:bg-[#BBDEFB] transition-colors">
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          {/* Instansi */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Instansi</label>
          </div>
          <div className="w-full">
            <input
              list="instansi-list"
              name="instansi"
              value={(() => {
                // Cari nama instansi dari id yang tersimpan di form
                const found = filteredInstansiList.find(i => i.id.toString() === form.instansi);
                return found ? found.agency_name : form.instansi;
              })()}
              onChange={e => {
                // Cari id dari nama yang dipilih
                const selected = filteredInstansiList.find(i => i.agency_name === e.target.value);
                if (selected) {
                  handleSelectChange("instansi", selected.id.toString());
                } else {
                  // Jika tidak ditemukan, simpan string mentah (misal user ketik manual)
                  handleSelectChange("instansi", e.target.value);
                }
              }}
              className="w-full border-2 border-[#90CAF9] rounded-xl px-4 py-3 text-base md:text-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#2196F3] transition"
              placeholder="Cari atau pilih Instansi"
              required
              autoComplete="off"
              disabled={!form.jenisInstansi}
            />
            <datalist id="instansi-list">
              {filteredInstansiList.map((item, idx) => (
                <option key={item.agency_name + '-' + idx} value={item.agency_name} />
              ))}
            </datalist>
          </div>
          {/* Jabatan */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Jabatan</label>
          </div>
          <div className="w-full">
          <Select value={form.jabatan} onValueChange={value => handleSelectChange("jabatan", value)} required>
            <SelectTrigger className="w-full border-2 border-[#90CAF9] rounded-xl px-4 py-3 text-base md:text-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#2196F3] transition-all">
              <SelectValue placeholder="Pilih Jabatan" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg bg-white">
              {jabatanList.map(item => (
                <SelectItem key={item.id} value={item.id.toString()} className="px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E3F2FD] focus:bg-[#BBDEFB] transition-colors">
                  {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          {/* Nama Pelatihan */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Nama Pelatihan</label>
          </div>
          <div className="w-full">
          <Select value={form.pelatihan} onValueChange={value => handleSelectChange("pelatihan", value)} required>
            <SelectTrigger className="w-full border-2 border-[#90CAF9] rounded-xl px-4 py-3 text-base md:text-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#2196F3] transition-all">
              <SelectValue placeholder="Pilih Nama Pelatihan" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg bg-white">
              {pelatihanList.map(item => (
                <SelectItem key={item.id} value={item.id.toString()} className="px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E3F2FD] focus:bg-[#BBDEFB] transition-colors">
                  {item.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          {/* Tahun Pelatihan */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Tahun Pelatihan</label>
          </div>
          <div className="w-full">
          <Select value={form.tahunPelatihan} onValueChange={value => handleSelectChange("tahunPelatihan", value)} required>
            <SelectTrigger className="w-full border-2 border-[#90CAF9] rounded-xl px-4 py-3 text-base md:text-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#2196F3] transition-all">
              <SelectValue placeholder="Pilih Tahun Pelatihan" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg bg-white">
              {tahunPelatihanList.map(item => (
                <SelectItem key={item.id} value={item.id.toString()} className="px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E3F2FD] focus:bg-[#BBDEFB] transition-colors">
                  {item.tahun}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          {/* Instansi Lembaga Penyelenggara */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">
              Instansi Lembaga Penyelenggara
            </label>
          </div>
          <div className="w-full">
            <input
              list="lembaga-list"
              name="lembagaPenyelenggara"
              value={form.lembagaPenyelenggara}
              onChange={e => handleSelectChange("lembagaPenyelenggara", e.target.value)}
              className="w-full border-2 border-[#90CAF9] rounded-xl px-4 py-3 text-base md:text-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#2196F3] transition"
              placeholder="Cari atau pilih Instansi Lembaga Penyelenggara"
              required
              autoComplete="off"
            />
            <datalist id="lembaga-list">
              {filteredLemdikList.map(item => (
                <option key={item.id} value={item.namalemdik} />
              ))}
            </datalist>
          </div>
          {/* Domisili Instansi Lembaga Penyelenggara */}
          <div className="flex items-center md:justify-end">
            <label className="font-semibold text-left md:text-right w-full md:w-44 text-[#1976D2]">Domisili Instansi Lembaga Penyelenggara</label>
          </div>
          <div className="w-full">
          <Select value={form.domisiliLembagaPenyelenggara} onValueChange={value => handleSelectChange("domisiliLembagaPenyelenggara", value)} required>
            <SelectTrigger className="w-full border-2 border-[#90CAF9] rounded-xl px-4 py-3 text-base md:text-lg bg-white shadow focus:outline-none focus:ring-2 focus:ring-[#2196F3] transition-all">
              <SelectValue placeholder="Pilih Domisili Instansi Lembaga Penyelenggara" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg bg-white">
              {filteredDomisiliList.map(item => (
                <SelectItem key={item.id} value={item.id.toString()} className="px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E3F2FD] focus:bg-[#BBDEFB] transition-colors">
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
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-3 rounded-l-xl border-2 border-r-0 border-[#2196F3] bg-[#E3F2FD] text-[#1976D2] font-bold text-base md:text-lg select-none" style={{ minWidth: 56, justifyContent: 'center' }}>+62</span>
              <input
                type="tel"
                name="handphone"
                value={form.handphone.replace(/^\+?62/, '')}
                onChange={e => {
                  // Always prepend '+62' to the value
                  const value = '+62' + e.target.value.replace(/^0+/, '');
                  setForm(f => {
                    const updated = { ...f, handphone: value };
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('alumni_profile_form', JSON.stringify(updated));
                    }
                    return updated;
                  });
                  profileStore.setForm({ handphone: value });
                }}
                className="w-full border-2 border-l-0 border-[#2196F3] rounded-r-xl px-4 py-3 text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] bg-white shadow transition"
                placeholder="Nomor HP tanpa 0 di depan"
                required
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                inputMode="numeric"
              />
            </div>
          </div>
        </div>
        <div className="text-center pt-4">
          {!saved ? (
            <button type="submit" className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-4 rounded-2xl shadow-xl hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-xl tracking-wide transition-all flex items-center gap-3">
              <Save size={24} />
              {Number.isInteger(Number(form.id)) && form.id !== "" ? "Update" : "Simpan"}
            </button>
          ) : (
            <button type="button" onClick={() => router.push("/alumni/evaluasi")} className="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-4 rounded-2xl shadow-xl hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-xl tracking-wide transition-all flex items-center gap-3">
              Lanjut
              <ArrowRight size={24} />
            </button>
          )}
        </div>
      </form>
    </>
  );
}
