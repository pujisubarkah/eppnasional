'use client'
import { useEffect, useState, useCallback } from 'react'

import { toast } from 'sonner'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useProfileFormStore } from '@/lib/store/globalStore';

interface SubAgenda {
  id: number
  name: string
}

interface Agenda {
  id: number
  name: string
  sub_agendas: SubAgenda[]
}

interface Option {
  id: number
  option_text: string
  option_value?: number
}

export interface EvaluasiState {
  relevan: string[];
  setRelevan: (v: string[]) => void;
  tidakRelevan: string[];
  setTidakRelevan: (v: string[]) => void;
  reset: () => void;
}

export default function EvaluasiPage() {
  // Ambil data dari globalStore (zustand)
  const profileStore = useProfileFormStore();
  const [nama, setNama] = useState<string>(profileStore.nama || "");
  const [pelatihanId, setPelatihanId] = useState<number>(() => {
    if (profileStore.pelatihan) return Number(profileStore.pelatihan);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alumni_evaluasi_pelatihan_id");
      if (saved) return Number(saved);
    }
    return 0;
  });
  const [userId, setUserId] = useState<string>("");

  // Local state for evaluasi
  const [relevan, setRelevan] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alumni_evaluasi_relevan");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [tidakRelevan, setTidakRelevan] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alumni_evaluasi_tidakRelevan");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  // Reset function
  const reset = useCallback(() => {
    setRelevan([]);
    setTidakRelevan([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("alumni_evaluasi_relevan");
      localStorage.removeItem("alumni_evaluasi_tidakRelevan");
    }
  }, []);

  const [materiList, setMateriList] = useState<Agenda[]>([])
  const [namaPelatihan, setNamaPelatihan] = useState<string>('Memuat...')
  const [relevanOptions, setRelevanOptions] = useState<Option[]>([])
  const [tidakRelevanOptions, setTidakRelevanOptions] = useState<Option[]>([]);
  const router = useRouter();

  const fetchData = async (id: number) => {
    try {
      const res = await fetch(`/api/pertanyaan/pelatihan/${id}`)
      const data = await res.json()
      setMateriList(data?.result || [])
      const pel = await fetch(`/api/pelatihan/${id}`)
      const pelData = await pel.json()
      setNamaPelatihan(pelData?.nama || '')
    } catch {
      setMateriList([])
      setNamaPelatihan('')
    }
  }

  const fetchRelevanOptions = useCallback(async () => {
    try {
      const res = await fetch(`/api/pertanyaan/1/${pelatihanId}`)
      const data = await res.json()
      setRelevanOptions(data.option || [])
    } catch {
      setRelevanOptions([])
    }
  }, [pelatihanId])

  const fetchTidakRelevanOptions = useCallback(async () => {
    try {
      const res = await fetch(`/api/pertanyaan/2/${pelatihanId}`)
      const data = await res.json()
      // Urutkan berdasarkan option_value
      const sortedOptions = (data.option || []).slice().sort((a: Option, b: Option) => (a.option_value ?? 0) - (b.option_value ?? 0));
      setTidakRelevanOptions(sortedOptions)
    } catch {
      setTidakRelevanOptions([])
    }
  }, [pelatihanId])

  // Sync zustand to localStorage for pelatihan_id, nama, dan user_id
  useEffect(() => {
    if (profileStore.pelatihan) {
      setPelatihanId(Number(profileStore.pelatihan));
      if (typeof window !== "undefined") {
        localStorage.setItem("alumni_evaluasi_pelatihan_id", String(profileStore.pelatihan));
      }
    }
    if (profileStore.nama) {
      setNama(profileStore.nama);
      if (typeof window !== "undefined") {
        localStorage.setItem("alumni_evaluasi_nama", profileStore.nama);
      }
    }
    // Hydrate user_id dari beberapa sumber
    let id = profileStore.id;
    if (!id && typeof window !== "undefined") {
      // alumni_profile_form
      const savedProfile = localStorage.getItem("alumni_profile_form");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.id) id = parsed.id;
        } catch {}
      }
      // alumni_evaluasi_user_id
      if (!id) {
        const saved = localStorage.getItem("alumni_evaluasi_user_id");
        if (saved) id = saved;
      }
      // global user_id
      if (!id) {
        const globalId = localStorage.getItem("user_id");
        if (globalId) id = globalId;
      }
    }
    if (!id) {
      router.replace("/alumni/profile");
      return;
    }
    setUserId(String(id));
    if (typeof window !== "undefined") {
      localStorage.setItem("user_id", String(id));
      localStorage.setItem("alumni_evaluasi_user_id", String(id));
    }
  }, [profileStore.pelatihan, profileStore.nama, profileStore.id, router]);

  // Restore from localStorage if zustand kosong (pelatihan/nama saja, userId sudah di atas)
  useEffect(() => {
    if (!profileStore.pelatihan && typeof window !== "undefined") {
      const saved = localStorage.getItem("alumni_evaluasi_pelatihan_id");
      if (saved) setPelatihanId(Number(saved));
    }
    if (!profileStore.nama && typeof window !== "undefined") {
      const saved = localStorage.getItem("alumni_evaluasi_nama");
      if (saved) setNama(saved);
    }
  }, [profileStore.pelatihan, profileStore.nama]);

  useEffect(() => {
    if (pelatihanId) {
      fetchData(pelatihanId);
      fetchRelevanOptions();
      fetchTidakRelevanOptions();
    }
  }, [pelatihanId, fetchRelevanOptions, fetchTidakRelevanOptions]);

  useEffect(() => {
    reset(); // Reset pilihan saat halaman dibuka
  }, [reset]);

  // Logika checkbox diperbaiki untuk sinkronisasi antar list
  const handleCheckbox = (list: string[], setList: (v: string[]) => void, value: string) => {
    let updated: string[];
    if (list.includes(value)) {
      updated = list.filter((v) => v !== value);
    } else {
      if (list.length >= 3) {
        toast.info('Hapus salah satu pilihan terlebih dahulu.');
        return;
      }
      // Sinkronisasi antar list: Hapus dari list lawan jika ada
      if (setList === setRelevan && tidakRelevan.includes(value)) {
        setTidakRelevan(prev => {
          const arr = prev.filter((v) => v !== value);
          if (typeof window !== "undefined") localStorage.setItem("alumni_evaluasi_tidakRelevan", JSON.stringify(arr));
          return arr;
        });
      }
      if (setList === setTidakRelevan && relevan.includes(value)) {
        setRelevan(prev => {
          const arr = prev.filter((v) => v !== value);
          if (typeof window !== "undefined") localStorage.setItem("alumni_evaluasi_relevan", JSON.stringify(arr));
          return arr;
        });
      }
      updated = [...list, value];
    }
    setList(updated);
    // Simpan ke localStorage
    if (typeof window !== "undefined") {
      if (setList === setRelevan) localStorage.setItem("alumni_evaluasi_relevan", JSON.stringify(updated));
      if (setList === setTidakRelevan) localStorage.setItem("alumni_evaluasi_tidakRelevan", JSON.stringify(updated));
    }
  };

  // State untuk id jawaban (jika sudah pernah submit)
  const [idJawaban, setIdJawaban] = useState<string | number | null>(null);

  // Cek localStorage untuk id jawaban saat mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("alumni_evaluasi_jawaban_id");
      if (saved) setIdJawaban(saved);
    }
  }, []);

  // Fungsi untuk submit (POST/PUT)
  const handleNext = () => {
    if (!userId) {
      toast.error("Data profil tidak ditemukan. Silakan lengkapi profil terlebih dahulu.");
      router.push("/alumni/profile");
      return;
    }
    const sendData = async () => {
      const body = {
        user_id: userId,
        answers: {
          q1: relevan[0] || '',
          q2: relevan[1] || '',
          q3: relevan[2] || '',
          q4: tidakRelevan[0] || '',
          q5: tidakRelevan[1] || '',
          q6: tidakRelevan[2] || ''
        },
        category_id: 1
      };

      try {
        let res;
        if (idJawaban) {
          // PUT jika sudah ada id jawaban
          res = await fetch(`/api/jawaban/${idJawaban}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
        } else {
          // POST jika belum ada id jawaban
          res = await fetch('/api/jawaban', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });
        }

        if (res.ok) {
          // Simpan id jawaban ke localStorage jika POST
          const data = await res.json();
          if (!idJawaban && data?.data?.id) {
            setIdJawaban(data.data.id);
            if (typeof window !== "undefined") {
              localStorage.setItem("alumni_evaluasi_jawaban_id", String(data.data.id));
            }
          }
          router.push("/alumni/dukunganlingkungan");
        } else {
          const errorData = await res.json();
          toast.error(errorData.message || 'Terjadi kesalahan, silakan coba lagi.');
        }
      } catch {
        toast.error('Terjadi kesalahan, silakan coba lagi.');
      }
    };
    sendData();
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-24 bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
        {/* Motivasi sebelum petunjuk */}
        <div className="mb-4">
          <span className="block text-[#1976D2] text-base">
            {nama ? (
              pelatihanId && namaPelatihan ? (
                <>
                  Halo <b>{nama}</b>! Kami ingin meminta waktu Anda terkait pelatihan yang pernah Anda ikuti yaitu <b>{namaPelatihan}</b>. Cuma 3–5 menit, tapi dampaknya besar banget buat perbaikan pelatihan ke depan!
                </>
              ) : pelatihanId ? (
                <>
                  Halo <b>{nama}</b>! Kami ingin meminta waktu Anda terkait pelatihan yang pernah Anda ikuti yaitu <b>ID {pelatihanId}</b>. Cuma 3–5 menit, tapi dampaknya besar banget buat perbaikan pelatihan ke depan!
                </>
              ) : (
                <>
                  Halo <b>{nama}</b>! Kami ingin meminta waktu Anda terkait pelatihan yang pernah Anda ikuti. Cuma 3–5 menit, tapi dampaknya besar banget buat perbaikan pelatihan ke depan!
                </>
              )
            ) : (
              <>
                Kami ingin meminta waktu Anda terkait pelatihan yang pernah Anda ikuti. Cuma 3–5 menit, tapi dampaknya besar banget buat perbaikan pelatihan ke depan!
              </>
            )}
          </span>
        </div>
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-[#1976D2] text-base font-medium">
          <span>
            <span className="font-bold">Petunjuk:</span> Pada bagian ini, kami akan menyajikan daftar materi yang diajarkan pada{' '}
            <span className="font-bold">{namaPelatihan}</span>. Silahkan pilih 3 materi yang menurut Anda paling relevan dan paling tidak relevan dalam mendukung kinerja.
            {/* <br />
            <span className="text-sm">(Debug: Anda memilih {relevan.length} relevan, {tidakRelevan.length} tidak relevan)</span> */}
          </span>
        </div>
        {/* Daftar Materi */}
        <div className="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
          <h3 className="font-bold text-lg mb-4 text-[#1976D2]">Daftar Materi Pelatihan</h3>
          <table className="w-full border rounded shadow text-sm bg-white">
            <thead>
              <tr className="bg-[#C2E7F6] text-[#1976D2]">
                <th className="py-2 px-3 text-left">Agenda</th>
                <th className="py-2 px-3 text-left">Sub Agenda</th>
              </tr>
            </thead>
            <tbody>
              {materiList.map((agenda) =>
                agenda.sub_agendas.map((sub, idx) => (
                  <tr key={sub.id}>
                    <td className="py-1 px-3 font-semibold align-top">
                      {idx === 0 ? agenda.name : ""}
                    </td>
                    <td className="py-1 px-3">{`${String.fromCharCode(97 + idx)}) ${sub.name}`}</td>
                  </tr>
                ))
              )
              }
            </tbody>
          </table>
        </div>
        {/* Relevan */}
        <div className="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
          <label className="block font-semibold mb-4 text-[#1976D2]">Pilih 3 materi paling relevan dalam mendukung kinerja Anda</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relevanOptions.length > 0 ? (
              relevanOptions.map((opt) => (
                <label 
                  key={opt.id} 
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 shadow-sm transition cursor-pointer
                    ${tidakRelevan.includes(opt.option_text) ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-blue-50 hover:bg-blue-100'}`
                  }
                >
                  <input
                    type="checkbox"
                    value={opt.option_text}
                    checked={relevan.includes(opt.option_text)}
                    onChange={() => handleCheckbox(relevan, setRelevan, opt.option_text)}
                    className="accent-[#2196F3] scale-125"
                    // Nonaktifkan jika sudah dipilih di list lain
                    disabled={tidakRelevan.includes(opt.option_text)}
                  />
                  <span className={`font-medium ${tidakRelevan.includes(opt.option_text) ? 'text-gray-500' : 'text-[#1976D2]'}`}>
                    {opt.option_text}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Tidak ada opsi materi tersedia.</p>
            )}
          </div>
        </div>
        {/* Tidak Relevan */}
        <div className="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
          <label className="block font-semibold mb-4 text-[#1976D2]">Pilih 3 materi paling tidak relevan dalam mendukung kinerja Anda</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tidakRelevanOptions.length > 0 ? (
              tidakRelevanOptions.map((opt) => (
                <label 
                  key={opt.id} 
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 shadow-sm transition
                    ${relevan.includes(opt.option_text) ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-red-50 hover:bg-red-100 cursor-pointer'}`
                  }
                >
                  <input
                    type="checkbox"
                    value={opt.option_text}
                    checked={tidakRelevan.includes(opt.option_text)}
                    onChange={() => handleCheckbox(tidakRelevan, setTidakRelevan, opt.option_text)}
                    className="accent-red-400 scale-125"
                    // Nonaktifkan jika sudah dipilih di list lain
                    disabled={relevan.includes(opt.option_text)}
                  />
                  <span className={`font-medium ${relevan.includes(opt.option_text) ? 'text-gray-500' : 'text-[#D32F2F]'}`}>
                    {opt.option_text}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Tidak ada opsi materi tersedia.</p>
            )}
          </div>
        </div>
        <div className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/alumni/profile")}
            className="flex items-center gap-2 bg-white border border-[#B3E5FC] text-[#1976D2] px-6 md:px-8 py-2 md:py-3 rounded-xl shadow font-bold text-base md:text-lg tracking-wide hover:bg-[#E3F2FD] transition w-full md:w-auto justify-center"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          {/* Tombol Submit diganti langsung jadi Lanjut */}
          <button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition w-full md:w-auto justify-center"
          >
            {idJawaban ? "Update" : "Lanjut"} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </>
  )
}