// ...tidak ada kode di luar fungsi komponen...
"use client";
import { useEffect, useState } from "react";
import { useProfileFormStore } from '@/lib/store/globalStore';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft } from "lucide-react"; // Hapus Send karena tidak digunakan

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
  const profileStore = useProfileFormStore();
  const router = useRouter();
  const [userId, setUserId] = useState<string>("");
  const [pelatihanId, setPelatihanId] = useState<number | null>(null);

  // Hydrate user_id dan pelatihan_id dari Zustand, alumni_profile_form, atau localStorage
  useEffect(() => {
    let id = profileStore.id;
    let pel = profileStore.pelatihan;
    if (!id && typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("alumni_profile_form");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          if (parsed.id) id = parsed.id;
          if (!pel && parsed.pelatihan) pel = parsed.pelatihan;
        } catch {}
      }
      if (!id) id = localStorage.getItem("user_id") || "";
      if (!pel) pel = localStorage.getItem("pelatihan_id") || "";
    }
    if (!id) {
      router.replace("/alumni/profile");
      return;
    }
    setUserId(id);
    setPelatihanId(pel ? Number(pel) : null);
    // Sync ke localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user_id", id);
      if (pel) localStorage.setItem("pelatihan_id", pel.toString());
    }
  }, [profileStore.id, profileStore.pelatihan, router]);

  const user_id = userId;
  const profile = { pelatihan_id: pelatihanId ?? Number(profileStore.pelatihan), id: user_id };
  // ...existing code...
  const [pertanyaanSikap, setPertanyaanSikap] = useState<Question | null>(null);
  const [pertanyaanKinerja, setPertanyaanKinerja] = useState<Question | null>(null);
  const [pertanyaanEkonomi, setPertanyaanEkonomi] = useState<Question | null>(null);
  const [pertanyaanDampak, setPertanyaanDampak] = useState<Question | null>(null);
  const [pertanyaanTransformasi, setPertanyaanTransformasi] = useState<Question | null>(null);
  const [selectedTransformasi, setSelectedTransformasi] = useState<number | null>(null);
  const [selectedSubTransformasi, setSelectedSubTransformasi] = useState<number | null>(null);

  // Local state for answers
  const [sikap, setSikap] = useState<string[]>([]);
  const [kinerja, setKinerja] = useState<string[]>([]);
  const [ekonomi, setEkonomi] = useState<string>("");
  const [dampak, setDampak] = useState<string[]>([]);
  const [dampakLain, setDampakLain] = useState<string>("");

  // router sudah dideklarasi di atas

  // Fetch profile from localStorage or API if needed
  useEffect(() => {
    // Example:
    // setProfile({ pelatihan_id: Number(localStorage.getItem("pelatihan_id")), id: localStorage.getItem("user_id") || "" });
    // setUserId(localStorage.getItem("user_id") || "");
  }, []);

  // Tampilkan hanya pertanyaan 1 dan 2 jika pelatihan_id === 5
  const isPelatihanLima = profile.pelatihan_id === 5;

  useEffect(() => {
    async function fetchQuestions() {
      // Validasi awal pelatihan_id
      if (!profile.pelatihan_id) {
        toast.error("Data pelatihan tidak ditemukan!");
        return;
      }

      try {
        const pelId = profile.pelatihan_id;

        // Tentukan endpoint ekonomi sesuai pelatihan_id
        let ekonomiEndpoint = "/api/pertanyaan/9";
        if (pelId === 1 || pelId === 2) {
          ekonomiEndpoint = "/api/pertanyaan/9/1";
        } else if (pelId === 3 || pelId === 4) {
          ekonomiEndpoint = "/api/pertanyaan/9/2";
        }

        // Fetch semua pertanyaan secara paralel
        const [
          sikapRes,
          resKinerja,
          resEkonomi,
          resDampak,
          resTransformasi
        ] = await Promise.all([
          fetch(`/api/pertanyaan/8/${pelId}`).then((r) => {
            if (!r.ok) throw new Error(`Gagal memuat pertanyaan sikap untuk pelatihan ID ${pelId}`);
            return r.json();
          }),
          fetch("/api/pertanyaan/11").then((r) => {
            if (!r.ok) throw new Error("Gagal memuat pertanyaan kinerja");
            return r.json();
          }),
          fetch(ekonomiEndpoint).then(async (r) => {
            if (!r.ok) throw new Error("Gagal memuat pertanyaan ekonomi");
            const json = await r.json();
            console.log("[DEBUG] Response ekonomiEndpoint", ekonomiEndpoint, json);
            return json;
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
        setPertanyaanSikap({
          id: sikapRes.question?.id,
          text: sikapRes.question?.text,
          options: sikapRes.option || [],
        });

        setPertanyaanKinerja(resKinerja);
        setPertanyaanEkonomi({
          ...resEkonomi.question,
          options: resEkonomi.option || [],
        });
        setPertanyaanDampak(resDampak);
        setPertanyaanTransformasi(resTransformasi);

        setSelectedTransformasi(null);
        setSelectedSubTransformasi(null);

      } catch (err: unknown) {
        console.error("Error fetching questions:", err);
        if (err instanceof Error) {
          toast.error(err.message || "Gagal memuat pertanyaan!");
        } else {
          toast.error("Gagal memuat pertanyaan!");
        }
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
    // Pastikan user_id ada
    if (!user_id) {
      toast.error("Data user tidak ditemukan. Silakan refresh halaman atau isi ulang profil.");
      return false;
    }
    // Validasi berdasarkan jenis pelatihan
    if (isPelatihanLima) {
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
      // Gabungkan semua jawaban ke format JSON
      const answersJson: Record<string, string> = {};
      // Pertanyaan 1: sikap
      if (Array.isArray(sikap) && pertanyaanSikap?.options) {
        pertanyaanSikap.options.forEach((opt, i) => {
          answersJson[`q${i + 1}`] = sikap.includes(opt.option_text) ? opt.option_text : "";
        });
      }
      // Pertanyaan 2: kinerja
      if (Array.isArray(kinerja) && pertanyaanKinerja?.options) {
        pertanyaanKinerja.options.forEach((opt, i) => {
          answersJson[`q${i + 1 + (pertanyaanSikap?.options?.length || 0)}`] = kinerja.includes(opt.option_text) ? opt.option_text : "";
        });
      }
      // Pertanyaan 3: ekonomi
      if (!isPelatihanLima && pertanyaanEkonomi?.options) {
        pertanyaanEkonomi.options.forEach((opt, i) => {
          answersJson[`q${i + 1 + (pertanyaanSikap?.options?.length || 0) + (pertanyaanKinerja?.options?.length || 0)}`] = ekonomi === opt.option_text ? opt.option_text : "";
        });
      }
      // Pertanyaan 4: dampak
      if (!isPelatihanLima && pertanyaanDampak?.options) {
        pertanyaanDampak.options.forEach((opt, i) => {
          answersJson[`q${i + 1 + (pertanyaanSikap?.options?.length || 0) + (pertanyaanKinerja?.options?.length || 0) + (pertanyaanEkonomi?.options?.length || 0)}`] = dampak[0] === opt.option_text ? (opt.option_text === "Yang lain:" ? dampakLain : opt.option_text) : "";
        });
      }
      // Pertanyaan 5: transformasi
      if (!isPelatihanLima && pertanyaanTransformasi?.options) {
        pertanyaanTransformasi.options.forEach((opt, i) => {
          answersJson[`q${i + 1 + (pertanyaanSikap?.options?.length || 0) + (pertanyaanKinerja?.options?.length || 0) + (pertanyaanEkonomi?.options?.length || 0) + (pertanyaanDampak?.options?.length || 0)}`] = selectedTransformasi === opt.id ? opt.option_text : "";
        });
        // Sub bidang
        if (selectedTransformasi !== null && selectedSubTransformasi !== null) {
          const subOpt = pertanyaanTransformasi.options.find(opt => opt.id === selectedTransformasi)?.sub_pertanyaan?.find(sub => sub.id === selectedSubTransformasi);
          if (subOpt) {
            answersJson[`sub_bidang`] = subOpt.text;
          }
        }
      }

      const res = await fetch("/api/jawaban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id,
          answers: answersJson,
          category_id: 3,
        }),
      });

      if (res.ok) {
        toast.success("Jawaban berhasil disimpan!");
        return true;
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Gagal menyimpan jawaban!");
        return false;
      }
    } catch (error: unknown) {
      console.error("Error submitting answers:", error);
      toast.error("Gagal menyimpan jawaban!");
      return false;
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

      {/* Tampilkan pertanyaan 3, 4, dan 5 hanya jika pelatihan_id bukan 5 */}
      {!isPelatihanLima && (
        <>
          {/* 3. Pilih salah satu nilai ekonomi */}
          <div className="bg-white rounded-xl border border-[#B3E5FC] shadow p-4 md:p-6 mb-4 md:mb-6">
            <label className="block font-semibold text-[#1976D2] mb-2 md:mb-4 text-sm md:text-base">
              3. {pertanyaanEkonomi?.text || "Memuat pertanyaan..."}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
              {pertanyaanEkonomi?.options?.length ? (
                pertanyaanEkonomi.options.map((opt) => (
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

          {/* 4. Dampak (radio, hanya satu pilihan) */}
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

          {/* 5. Penerapan hasil pelatihan mendukung transformasi */}
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
        </>
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