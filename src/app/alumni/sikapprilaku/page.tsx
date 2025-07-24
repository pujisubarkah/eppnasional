"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft } from "lucide-react"; // Hapus Send karena tidak digunakan
import { useProfileStore } from "@/lib/store/profileStore";
import { useSikapPrilakuStore } from "@/lib/store/sikapprilaku";

type Option = {
  id: number;
  option_text: string;
  ordering?: number;
  sub_pertanyaan?: { id: number; text: string }[];
};

type Question = {
  id: number;
  text: string;
  // Tambahkan properti options jika struktur API mengembalikannya di sini
  // Atau tetap gunakan options dari res.option seperti di fetch
  options?: Option[]; // Opsional jika API struktur berbeda
};

export default function SikapPrilakuPage() {
  const profile = useProfileStore();
  const [pertanyaanSikap, setPertanyaanSikap] = useState<Question | null>(null);
  const [pertanyaanKinerja, setPertanyaanKinerja] = useState<Question | null>(null);
  const [pertanyaanEkonomi, setPertanyaanEkonomi] = useState<Question | null>(null);
  const [pertanyaanDampak, setPertanyaanDampak] = useState<Question | null>(null);
  const [pertanyaanTransformasi, setPertanyaanTransformasi] = useState<Question | null>(null);
  // State untuk pertanyaan Transformasi (baru)
  const [selectedTransformasi, setSelectedTransformasi] = useState<number | null>(null);
  const [selectedSubTransformasi, setSelectedSubTransformasi] = useState<number | null>(null);

  const {
    sikap,
    setSikap,
    kinerja,
    setKinerja,
    ekonomi,
    setEkonomi,
    dampak,
    setDampak,
    dampakLain,
    setDampakLain,
    // tema, setTema // Dihapus karena tidak digunakan
  } = useSikapPrilakuStore();

  const router = useRouter();
  const { id: user_id } = useProfileStore();

  // Tentukan apakah ini pelatihan jenis khusus (hanya 1, 2, dan 5)
  // Perbaikan: Cek eksplisit untuk pelatihan_id 1, 2, dan 5
  const isPelatihanKhusus = profile.pelatihan_id === 1 || profile.pelatihan_id === 2 || profile.pelatihan_id === 5;

  useEffect(() => {
    async function fetchQuestions() {
      // Validasi awal pelatihan_id
      if (!profile.pelatihan_id) {
        toast.error("Data pelatihan tidak ditemukan!");
        return;
      }

      try {
        const pelId = profile.pelatihan_id;

        // Fetch semua pertanyaan secara paralel
        const [
          sikapRes,
          resKinerja,
          resEkonomi,
          resDampak,
          resTransformasi
        ] = await Promise.all([
          // Perbaikan: Gunakan endpoint dinamis berdasarkan pelatihan_id
          fetch(`/api/pertanyaan/8/${pelId}`).then((r) => {
             if (!r.ok) throw new Error(`Gagal memuat pertanyaan sikap untuk pelatihan ID ${pelId}`);
             return r.json();
          }),
          fetch("/api/pertanyaan/11").then((r) => {
             if (!r.ok) throw new Error("Gagal memuat pertanyaan kinerja");
             return r.json();
          }),
          fetch("/api/pertanyaan/9").then((r) => {
             if (!r.ok) throw new Error("Gagal memuat pertanyaan ekonomi");
             return r.json();
          }),
          fetch("/api/pertanyaan/10").then((r) => {
             if (!r.ok) throw new Error("Gagal memuat pertanyaan dampak");
             return r.json();
          }),
          fetch("/api/pertanyaan/26").then((r) => {
             if (!r.ok) throw new Error("Gagal memuat pertanyaan transformasi");
             return r.json();
          }),
        ]);

        // Format pertanyaanSikap agar options dari data.option
        // Asumsi struktur respon API: { question: { id, text }, option: Option[] }
        setPertanyaanSikap({
          id: sikapRes.question?.id,
          text: sikapRes.question?.text,
          options: sikapRes.option || [], // Gunakan options dari res.option
        });

        // Asumsi struktur respon API untuk pertanyaan lain: { id, text, options: Option[] }
        setPertanyaanKinerja(resKinerja);
        setPertanyaanEkonomi(resEkonomi);
        setPertanyaanDampak(resDampak);
        setPertanyaanTransformasi(resTransformasi);

        // Reset state transformasi jika data baru dimuat
        setSelectedTransformasi(null);
        setSelectedSubTransformasi(null);

      } catch (err: any) {
        console.error("Error fetching questions:", err);
        toast.error(err.message || "Gagal memuat pertanyaan!");
      }
    }

    fetchQuestions();
  }, [profile.pelatihan_id]); // Tambahkan dependensi yang relevan jika ada

  const handleCheckbox = (
    arr: string[],
    setArr: (v: string[]) => void,
    value: string,
    max: number
  ) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else if (arr.length < max) {
      setArr([...arr, value]);
    } else {
       // Tidak perlu toast di sini karena sudah ada disabled
       // toast.info(`Maksimal ${max} pilihan.`);
    }
  };

  // Fungsi untuk menyimpan jawaban dan navigasi
  const saveAnswersAndNavigate = async () => {
    // Validasi berdasarkan jenis pelatihan
    if (isPelatihanKhusus) {
      if (!sikap || !Array.isArray(sikap) || sikap.length === 0 || kinerja.length !== 3) {
        toast.error("Mohon isi pertanyaan 1 dan 2 dengan lengkap!");
        return false; // Indikasi gagal
      }
    } else {
      if (
        !sikap || !Array.isArray(sikap) || sikap.length === 0 ||
        kinerja.length !== 3 ||
        !ekonomi ||
        dampak.length === 0
      ) {
        toast.error("Mohon isi semua pertanyaan dengan lengkap!");
        return false;
      }
      // Validasi bidang dan sub bidang untuk pertanyaan 5
      if (selectedTransformasi === null || selectedSubTransformasi === null) {
        toast.error("Mohon pilih bidang dan sub bidang pada pertanyaan 5!");
        return false;
      }
    }

    try {
      // Kirim jawaban pertanyaan 1 (bisa lebih dari satu)
      if (Array.isArray(sikap) && pertanyaanSikap?.id) {
        for (const ans of sikap) {
          await fetch("/api/answers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question_id: pertanyaanSikap.id, // Gunakan ID yang sudah di-set
              user_id,
              answer: ans,
            }),
          });
        }
      }

      // Kirim jawaban pertanyaan 2
      if(pertanyaanKinerja?.id) {
         for (const ans of kinerja) {
           await fetch("/api/answers", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               question_id: pertanyaanKinerja.id,
               user_id,
               answer: ans,
             }),
           });
         }
      }

      // Kirim jawaban pertanyaan 3, 4, dan 5 hanya jika bukan pelatihan khusus
      if (!isPelatihanKhusus) {
        if(pertanyaanEkonomi?.id) {
           await fetch("/api/answers", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               question_id: pertanyaanEkonomi.id,
               user_id,
               answer: ekonomi,
             }),
           });
        }

        if(pertanyaanDampak?.id) {
           for (const ans of dampak) {
             await fetch("/api/answers", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                 question_id: pertanyaanDampak.id,
                 user_id,
                 answer: ans === "Yang lain:" ? dampakLain : ans,
               }),
             });
           }
        }

        // Kirim jawaban untuk pertanyaan Transformasi (pertanyaan 5)
        if (pertanyaanTransformasi?.id && selectedTransformasi !== null) {
          await fetch("/api/answers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question_id: pertanyaanTransformasi.id,
              user_id,
              answer: selectedTransformasi.toString(),
            }),
          });
        }
        // Catatan: Sub_pertanyaan tidak dikirim sebagai jawaban terpisah berdasarkan logika saat ini.
        // Jika perlu, tambahkan logika pengiriman untuk selectedSubTransformasi di sini.
      }

      toast.success("Jawaban berhasil disimpan!");
      return true; // Indikasi sukses
    } catch (error: any) {
      console.error("Error submitting answers:", error);
      toast.error("Gagal menyimpan jawaban!");
      return false; // Indikasi gagal
    }
  };

  const handleLanjut = async () => {
     const isSaved = await saveAnswersAndNavigate();
     if(isSaved) {
        router.push("/alumni/sesuaiwaktu");
     }
     // Jika gagal, toast error sudah ditampilkan oleh saveAnswersAndNavigate
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-4 md:p-10 space-y-8 md:space-y-10 border border-[#B3E5FC]">
      <h2 className="text-xl md:text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">
        Sikap & Perilaku Pasca Pelatihan
      </h2>
      <div className="mb-6 md:mb-8 p-3 md:p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-sm md:text-base shadow">
        <span className="font-bold">Petunjuk:</span> Silahkan centang pada poin yang sesuai dengan pernyataan berikut.
      </div>

      {/* 1. Pilihan perubahan sikap perilaku (checkbox, bisa lebih dari satu) */}
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 mb-4 md:mb-6">
        <label className="block font-semibold text-[#1976D2] mb-2 md:mb-4 text-sm md:text-base">
          1. {pertanyaanSikap?.text || "Memuat pertanyaan..."}
          <span className="block text-xs md:text-sm text-[#1976D2] font-normal mt-1">(Boleh pilih lebih dari 1)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
          {pertanyaanSikap?.options?.length ? (
            pertanyaanSikap.options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 md:gap-3 bg-blue-50 rounded-lg px-2 md:px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={opt.option_text}
                  checked={Array.isArray(sikap) ? sikap.includes(opt.option_text) : false}
                  onChange={() => {
                    if (Array.isArray(sikap)) {
                      if (sikap.includes(opt.option_text)) {
                        setSikap(sikap.filter((v) => v !== opt.option_text));
                      } else {
                        setSikap([...sikap, opt.option_text]);
                      }
                    } else {
                      setSikap([opt.option_text]);
                    }
                  }}
                  className="accent-[#2196F3] scale-110 md:scale-125"
                />
                <span className="text-[#1976D2] font-medium text-xs md:text-base">{opt.option_text}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm md:text-base">Tidak ada opsi tersedia.</p>
          )}
        </div>
      </div>

      {/* 2. Pilih 3 dari 7+ opsi */}
      <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 mb-4 md:mb-6">
        <label className="block font-semibold text-[#1976D2] mb-2 md:mb-4 text-sm md:text-base">
          2. {pertanyaanKinerja?.text || "Memuat pertanyaan..."}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
          {pertanyaanKinerja?.options?.length ? (
            pertanyaanKinerja.options.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 md:gap-3 bg-blue-50 rounded-lg px-2 md:px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={opt.option_text}
                  checked={kinerja.includes(opt.option_text)}
                  onChange={() =>
                    handleCheckbox(kinerja, setKinerja, opt.option_text, 3)
                  }
                  disabled={
                    kinerja.length >= 3 && !kinerja.includes(opt.option_text)
                  }
                  className="accent-[#2196F3] scale-110 md:scale-125"
                />
                <span className="text-[#1976D2] font-medium text-xs md:text-base">{opt.option_text}</span>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm md:text-base">Tidak ada opsi tersedia.</p>
          )}
        </div>
        {kinerja.length > 3 && (
          <div className="text-red-500 text-xs mt-2">Maksimal 3 pilihan.</div>
        )}
      </div>

      {/* 3. Pilih salah satu nilai ekonomi - Hanya ditampilkan jika bukan pelatihan khusus */}
      {!isPelatihanKhusus && (
        <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 mb-4 md:mb-6">
          <label className="block font-semibold text-[#1976D2] mb-2 md:mb-4 text-sm md:text-base">
            3. {pertanyaanEkonomi?.text || "Memuat pertanyaan..."}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
            {pertanyaanEkonomi?.options?.length ? (
              pertanyaanEkonomi.options
                // Filter sesuai pelatihan_id dan ordering
                ?.filter((opt) => {
                  // Perbaikan: Filter berdasarkan pelatihan_id dan ordering
                  if (profile.pelatihan_id === 3 || profile.pelatihan_id === 4) {
                    return opt.ordering === 1;
                  } else if (profile.pelatihan_id === 5) {
                    return opt.ordering === 2;
                  }
                  return false; // Default tidak menampilkan jika tidak sesuai
                })
                .map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 md:gap-3 bg-blue-50 rounded-lg px-2 md:px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={opt.option_text}
                      checked={ekonomi === opt.option_text}
                      onChange={() => setEkonomi(opt.option_text)}
                      className="accent-[#2196F3] scale-110 md:scale-125"
                    />
                    <span className="text-[#1976D2] font-medium text-xs md:text-base">{opt.option_text}</span>
                  </label>
                ))
            ) : (
              <p className="text-gray-500 text-sm md:text-base">Tidak ada opsi tersedia.</p>
            )}
          </div>
        </div>
      )}

      {/* 4. Dampak (radio, hanya satu pilihan) - Hanya ditampilkan jika bukan pelatihan khusus */}
      {!isPelatihanKhusus && (
        <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 mb-4 md:mb-6">
          <label className="block font-semibold text-[#1976D2] mb-2 md:mb-4 text-sm md:text-base">
            4. {pertanyaanDampak?.text || "Memuat pertanyaan..."}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
            {pertanyaanDampak?.options?.length ? (
              pertanyaanDampak.options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 md:gap-3 bg-blue-50 rounded-lg px-2 md:px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
                >
                  <input
                    type="radio"
                    value={opt.option_text}
                    checked={dampak[0] === opt.option_text}
                    onChange={() => setDampak([opt.option_text])}
                    className="accent-[#2196F3] scale-110 md:scale-125"
                  />
                  <span className="text-[#1976D2] font-medium text-xs md:text-base">{opt.option_text}</span>
                </label>
              ))
            ) : (
              <p className="text-gray-500 text-sm md:text-base">Tidak ada opsi tersedia.</p>
            )}
          </div>
          {dampak[0] === "Yang lain:" && (
            <input
              type="text"
              value={dampakLain}
              onChange={(e) => setDampakLain(e.target.value)}
              placeholder="Sebutkan dampak lain..."
              className="mt-2 p-2 border rounded w-full text-xs md:text-base"
              required // Tambahkan required jika field ini wajib
            />
          )}
        </div>
      )}

      {/* 5. Penerapan hasil pelatihan mendukung transformasi - Hanya ditampilkan jika bukan pelatihan khusus */}
      {!isPelatihanKhusus && (
        <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 mb-4 md:mb-6">
          <label className="block font-semibold text-[#1976D2] mb-2 md:mb-4 text-sm md:text-base">
            5. {pertanyaanTransformasi?.text || "Memuat pertanyaan..."}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
            {pertanyaanTransformasi?.options?.length ? (
              pertanyaanTransformasi.options.map((opt: Option & { sub_pertanyaan?: { id: number; text: string }[] }) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 md:gap-3 bg-blue-50 rounded-lg px-2 md:px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer"
                >
                  <input
                    type="radio"
                    value={opt.id} // Gunakan ID untuk identifikasi unik
                    checked={selectedTransformasi === opt.id}
                    onChange={() => {
                      setSelectedTransformasi(opt.id);
                      setSelectedSubTransformasi(null); // Reset sub jika option utama berubah
                    }}
                    className="accent-[#2196F3] scale-110 md:scale-125"
                  />
                  <span className="text-[#1976D2] font-medium text-xs md:text-base">{opt.option_text}</span>
                </label>
              ))
            ) : (
              <p className="text-gray-500 text-sm md:text-base">Tidak ada opsi tersedia.</p>
            )}
          </div>
          {/* Sub pertanyaan muncul jika ada dan option dipilih */}
          {selectedTransformasi && (
            <div className="mt-4">
              <div className="font-semibold text-[#1976D2] mb-2 text-sm md:text-base">Sub Bidang:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                {pertanyaanTransformasi?.options
                  ?.find((opt: Option) => opt.id === selectedTransformasi)?.sub_pertanyaan?.length ? (
                    pertanyaanTransformasi.options
                      .find((opt: Option) => opt.id === selectedTransformasi)!
                      .sub_pertanyaan!.map((sub: { id: number; text: string }) => (
                        <label
                          key={sub.id}
                          className="flex items-center gap-2 md:gap-3 bg-blue-100 rounded-lg px-2 md:px-3 py-2 shadow-sm hover:bg-blue-200 transition cursor-pointer"
                        >
                          <input
                            type="radio"
                            value={sub.id} // Gunakan ID sub untuk identifikasi unik
                            checked={selectedSubTransformasi === sub.id}
                            onChange={() => setSelectedSubTransformasi(sub.id)}
                            className="accent-[#1976D2] scale-110 md:scale-125"
                          />
                          <span className="text-[#1976D2] font-medium text-xs md:text-base">{sub.text}</span>
                        </label>
                      ))
                  ) : (
                    <p className="text-gray-500 text-sm md:text-base">Tidak ada sub bidang tersedia.</p>
                  )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pt-6 md:pt-8 flex flex-col md:flex-row justify-between gap-3 md:gap-6">
        <button
          type="button"
          onClick={() => router.push("/alumni/dukunganlingkungan")}
          className="flex items-center gap-2 bg-white border border-[#B3E5FC] text-[#1976D2] px-6 md:px-8 py-2 md:py-3 rounded-xl shadow font-bold text-base md:text-lg tracking-wide hover:bg-[#E3F2FD] transition w-full md:w-auto justify-center"
        >
          <ArrowLeft size={20} />
          Sebelumnya
        </button>
        <button
          type="button"
          onClick={handleLanjut} // Gunakan fungsi tunggal untuk simpan & lanjut
          className="flex items-center gap-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-6 md:px-10 py-2 md:py-3 rounded-xl shadow-lg font-bold text-base md:text-lg tracking-wide transition w-full md:w-auto justify-center"
        >
          Lanjut <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}