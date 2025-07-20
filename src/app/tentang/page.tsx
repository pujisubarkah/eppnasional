import { Award, BarChart3, Users2 } from "lucide-react";

export default function TentangPage() {
  return (
    <section className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white/80 rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-9 h-9 text-[#2196F3] drop-shadow" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#2196F3] drop-shadow">
            Tentang EPP Nasional
          </h1>
        </div>
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          <span className="font-semibold text-[#1976D2]">
            Direktorat Penjaminan Mutu Pengembangan Kapasitas
          </span>{" "}
          adalah bagian integral dari Lembaga Administrasi Negara (LAN) yang mengemban tanggung jawab strategis dalam menjamin mutu pelatihan bagi Aparatur Sipil Negara (ASN). Melalui pendekatan evaluatif, pemantauan sistematis, serta pengembangan yang berkesinambungan, direktorat ini berkomitmen memastikan bahwa setiap program pelatihan tidak hanya berhenti pada transfer pengetahuan di ruang kelas, tetapi benar-benar memberikan dampak yang signifikan terhadap peningkatan kinerja individu maupun organisasi.
        </p>
        <div className="flex items-start gap-3 mb-4">
          <BarChart3 className="w-7 h-7 text-[#1976D2] mt-1" />
          <p className="text-lg text-gray-700 leading-relaxed">
            Sebagai wujud komitmen tersebut, kami menginisiasi{" "}
            <span className="font-semibold text-[#1976D2]">
              Evaluasi Pasca Pelatihan (EPP) Nasional
            </span>{" "}
            – sebuah upaya mendalam untuk mendengarkan kembali suara para alumni pelatihan, menilai sejauh mana hasil pelatihan diimplementasikan dalam lingkungan kerja, serta mengidentifikasi peluang peningkatan yang lebih baik ke depannya.
          </p>
        </div>
        <div className="flex items-start gap-3 mb-2">
          <Users2 className="w-7 h-7 text-[#1976D2] mt-1" />
          <p className="text-lg text-gray-700 leading-relaxed">
            Pada tahun 2025, EPP Nasional secara khusus menyasar alumni pelatihan yang mengikuti program LAN pada tahun 2021 hingga 2024. Evaluasi ini mencakup berbagai aspek penting seperti perubahan kompetensi individu, penerapan hasil pelatihan di tempat kerja, dukungan organisasi, serta dampak terhadap pencapaian kinerja unit kerja. Hasil dari evaluasi ini akan menjadi landasan berharga dalam memperkuat siklus pembelajaran dan merancang pelatihan ASN yang lebih adaptif, relevan, dan berdampak.
          </p>
        </div>
      </div>
            </section>
        );
    }