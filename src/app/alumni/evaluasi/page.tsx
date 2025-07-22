'use client'

import { useEffect, useState, useCallback } from 'react'
import { useProfileStore } from '@/lib/store/profileStore'
import { useEvaluasiStore } from '@/lib/store/evaluasiStore'
import { toast } from 'sonner'
import { ArrowRight, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
}

// Custom hook untuk cek hydration Zustand
function useHasHydrated() {
  const [hasHydrated, setHasHydrated] = useState(false)
  useEffect(() => {
    setHasHydrated(true)
  }, [])
  return hasHydrated
}

export default function EvaluasiPage() {
  const hasHydrated = useHasHydrated();
  const { id, nama, pelatihan_id } = useProfileStore();

  // Hapus clearAll jika tidak digunakan
  const { relevan, setRelevan, tidakRelevan, setTidakRelevan } = useEvaluasiStore();

  const [materiList, setMateriList] = useState<Agenda[]>([])
  const [namaPelatihan, setNamaPelatihan] = useState<string>('Memuat...')
  const [relevanOptions, setRelevanOptions] = useState<Option[]>([])
  const { tidakRelevanOptions, setTidakRelevanOptions } = useEvaluasiStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
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
      const res = await fetch(`/api/pertanyaan/1/${pelatihan_id}`)
      const data = await res.json()
      setRelevanOptions(data.option || [])
    } catch {
      setRelevanOptions([])
    }
  }, [pelatihan_id])

  const fetchTidakRelevanOptions = useCallback(async () => {
    try {
      const res = await fetch(`/api/pertanyaan/2/${pelatihan_id}`)
      const data = await res.json()
      setTidakRelevanOptions(data.option || [])
    } catch {
      setTidakRelevanOptions([])
    }
  }, [pelatihan_id, setTidakRelevanOptions])

  useEffect(() => {
    if (pelatihan_id) {
      fetchData(pelatihan_id);
      fetchRelevanOptions();
      fetchTidakRelevanOptions();
    }
  }, [pelatihan_id, fetchRelevanOptions, fetchTidakRelevanOptions]);

  const handleCheckbox = (list: string[], setList: (v: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value))
    } else if (list.length < 3) {
      setList([...list, value])
    }
  }

  const handleSubmit = async () => {
    if (relevan.length !== 3) {
      toast.error('Pilih tepat 3 materi relevan!');
      return;
    }
    if (tidakRelevan.length !== 3) {
      toast.error('Pilih tepat 3 materi tidak relevan!');
      return;
    }

    try {
      // Kirim jawaban relevan
      for (const answer of relevan) {
        await fetch('/api/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_id: 1,
            user_id: id,
            answer,
          }),
        });
      }
      // Kirim jawaban tidak relevan
      for (const answer of tidakRelevan) {
        await fetch('/api/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question_id: 2,
            user_id: id,
            answer,
          }),
        });
      }

      toast.success('Jawaban berhasil disimpan! Silakan klik tombol lanjut untuk melanjutkan.');
      setIsSubmitted(true);
    } catch {
      toast.error('Gagal menyimpan jawaban!');
    }
  };

  // Jangan render apapun sebelum hydrated
  if (!hasHydrated) return null;

  return (
    
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
 

      {/* Motivasi sebelum petunjuk */}
      <div className="mb-4">
        <span className="block text-[#1976D2] text-base">
          {nama ? (
            pelatihan_id && namaPelatihan ? (
              <>
                Halo <b>{nama}</b>! Kami ingin meminta waktu Anda terkait pelatihan yang pernah Anda ikuti yaitu <b>{namaPelatihan}</b>. Cuma 3–5 menit, tapi dampaknya besar banget buat perbaikan pelatihan ke depan!
              </>
            ) : pelatihan_id ? (
              <>
                Halo <b>{nama}</b>! Kami ingin meminta waktu Anda terkait pelatihan yang pernah Anda ikuti yaitu <b>ID {pelatihan_id}</b>. Cuma 3–5 menit, tapi dampaknya besar banget buat perbaikan pelatihan ke depan!
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
              <label key={opt.id} className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
                <input
                  type="checkbox"
                  value={opt.option_text}
                  checked={relevan.includes(opt.option_text)}
                  onChange={() => handleCheckbox(relevan, setRelevan, opt.option_text)}
                  className="accent-[#2196F3] scale-125"
                />
                <span className="text-[#1976D2] font-medium">{opt.option_text}</span>
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
              <label key={opt.id} className="flex items-center gap-3 bg-red-50 rounded-lg px-3 py-2 shadow-sm hover:bg-red-100 transition cursor-pointer">
                <input
                  type="checkbox"
                  value={opt.option_text}
                  checked={tidakRelevan.includes(opt.option_text)}
                  onChange={() => handleCheckbox(tidakRelevan, setTidakRelevan, opt.option_text)}
                  className="accent-red-400 scale-125"
                />
                <span className="text-[#D32F2F] font-medium">{opt.option_text}</span>
              </label>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">Tidak ada opsi materi tersedia.</p>
          )}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition"
          >
            <Send size={20} /> Submit
          </button>
        ) : (
          <button
            onClick={() => router.push("/alumni/dukunganlingkungan")}
            className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition"
          >
            Lanjut <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  )
}
