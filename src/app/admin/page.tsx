export default function AdminRingkasanPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Ringkasan</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-6">
        <p>
          Halaman ini berisi ringkasan dari seluruh menu yang tersedia pada panel admin. Anda dapat melihat rekap data utama dari setiap aspek evaluasi pasca pelatihan, seperti:
        </p>
        <ul className="list-disc ml-6 mt-3 text-[#1976D2]">
          <li><b>Materi:</b> Perbandingan relevansi materi pelatihan terhadap kinerja peserta.</li>
          <li><b>Dukungan Lingkungan:</b> Distribusi dukungan atasan dan rekan kerja setelah pelatihan.</li>
          <li><b>Sikap Perilaku:</b> Perubahan sikap, perilaku, dan kinerja individu pasca pelatihan.</li>
          <li><b>Kesesuaian Waktu dan Manfaat:</b> Persepsi alumni tentang kesepadanan waktu dan manfaat pelatihan.</li>
          <li><b>Kontribusi pada Program Prioritas Nasional:</b> Dampak pelatihan terhadap program prioritas nasional.</li>
          <li><b>Saran dan Masukan:</b> Analisis data tidak terstruktur dari saran dan masukan peserta.</li>
        </ul>
      </div>
      <div className="text-sm text-gray-500">
        Silakan pilih menu di sidebar untuk melihat detail data dan visualisasi masing-masing aspek.
      </div>
    </div>
  );
}