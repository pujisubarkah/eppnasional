export default function Faq() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-extrabold text-[#1976D2] mb-8 text-center drop-shadow">
        FAQ - Pertanyaan Umum
      </h2>
      <div className="space-y-6">
        <div className="bg-white/90 rounded-xl border-2 border-[#2196F3] outline-2 outline-[#2196F3] shadow p-6">
          <h3 className="font-bold text-[#2196F3] mb-2">
            Berapa lama waktu yang dibutuhkan untuk mengisi kuesioner ini?
          </h3>
          <p className="text-gray-700">Sekitar 3 - 5 menit.</p>
        </div>
        <div className="bg-white/90 rounded-xl border-2 border-[#2196F3] outline-2 outline-[#2196F3] shadow p-6">
          <h3 className="font-bold text-[#2196F3] mb-2">
            Apakah saya bisa mengisi lewat handphone?
          </h3>
          <p className="text-gray-700">
            Bisa, tapi kami tetap menyarankan untuk menggunakan Laptop agar lebih optimal.
          </p>
        </div>
        <div className="bg-white/90 rounded-xl border-2 border-[#2196F3] outline-2 outline-[#2196F3] shadow p-6">
          <h3 className="font-bold text-[#2196F3] mb-2">
            Apa yang harus saya lakukan jika ada kendala saat mengisi?
          </h3>
          <p className="text-gray-700">
            Silahkan menghubungi layanan sahabat mutu melalui kanal yang tersedia.
          </p>
        </div>
                <div className="bg-white/90 rounded-xl border-2 border-[#2196F3] outline-2 outline-[#2196F3] shadow p-6">
                  <h3 className="font-bold text-[#2196F3] mb-2">
                    Saya mengikuti lebih dari satu pelatihan, mana yang harus saya isi?
                  </h3>
                  <p className="text-gray-700">
                    Silahkan mengisi data pelatihan terakhir yang Anda ikut.
                  </p>
                </div>
              </div>
            </div>
          );
        }