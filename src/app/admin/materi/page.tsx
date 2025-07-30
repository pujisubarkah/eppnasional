"use client";
import { useEffect, useState } from "react";

type MateriRow = {
  pelatihanId: number;
  namaPelatihan: string;
  relevan: string[];
  tidakRelevan: string[];
};

export default function MateriPage() {
  const [selected, setSelected] = useState<string | "all">("all");
  const [materiTable, setMateriTable] = useState<MateriRow[]>([]);

  useEffect(() => {
    // fetch("/api/pelatihan")
    //   .then((res) => res.json())
    //   .then((data) => setPelatihan(data));
  }, []);

  const [frekuensi, setFrekuensi] = useState<{ relevan: Record<string, number>; tidakRelevan: Record<string, number> }>({ relevan: {}, tidakRelevan: {} });
  useEffect(() => {
    fetch("/api/materi")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.result)) {
          const mapped = data.result.map((row: {
            pelatihanId: number;
            namaPelatihan: string;
            relevan: Record<string, string>;
            tidakRelevan: Record<string, string>;
          }) => ({
            pelatihanId: row.pelatihanId,
            namaPelatihan: row.namaPelatihan,
            relevan: Object.values(row.relevan).filter(Boolean),
            tidakRelevan: Object.values(row.tidakRelevan).filter(Boolean),
          }));
          setMateriTable(mapped);
        } else {
          setMateriTable([]);
        }
        if (data.frekuensi) {
          setFrekuensi(data.frekuensi);
        } else {
          setFrekuensi({ relevan: {}, tidakRelevan: {} });
        }
      });
  }, []);

  const filteredTable =
    selected === "all"
      ? materiTable
      : materiTable.filter((row) => row.namaPelatihan === selected);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Relevansi Materi Pelatihan</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <p>
          Tabel berikut memperlihatkan perbandingan jumlah responden yang menilai materi pelatihan <b>Relevan</b> dan <b>Tidak Relevan</b> dalam mendukung kinerja, berdasarkan jenis pelatihan.
        </p>
      </div>
      {/* ...existing code... */}
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold text-[#1976D2]">Filter Pelatihan:</label>
        <select
          className="border border-[#B3E5FC] rounded px-3 py-1 focus:outline-none"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="all">Semua Pelatihan</option>
          {Array.from(new Set(materiTable.map((row) => row.namaPelatihan).filter(nama => !!nama))).map((nama) => (
            <option key={nama} value={nama}>{nama}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-[#E3F2FD] text-[#1976D2]">
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Nama Pelatihan</th>
              <th className="px-4 py-2 border">Relevan</th>
              <th className="px-4 py-2 border">Tidak Relevan</th>
            </tr>
          </thead>
          <tbody>
            {filteredTable.map((row, idx) => (
              <tr key={`${row.pelatihanId}-${idx}`} className="text-center">
                <td className="px-4 py-2 border">{idx + 1}</td>
                <td className="px-4 py-2 border">{row.namaPelatihan}</td>
                <td className="px-4 py-2 border text-green-700 font-bold">{row.relevan.join(", ")}</td>
                <td className="px-4 py-2 border text-red-600 font-bold">{row.tidakRelevan.join(", ")}</td>
              </tr>
            ))}
            {filteredTable.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-2 border text-center text-gray-500">
                  Tidak ada data yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Rekap jumlah materi relevan & tidak relevan */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl shadow text-[#1976D2]">
        <h2 className="text-lg font-semibold mb-2">Rekap Jumlah Materi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2 text-green-700">Materi Relevan</h3>
            <ul className="list-disc ml-6">
              {Object.entries(frekuensi.relevan)
                .sort((a, b) => b[1] - a[1])
                .map(([materi, jumlah]) => (
                  <li key={materi}>{materi}: <span className="font-bold">{jumlah}</span></li>
                ))}
              {Object.keys(frekuensi.relevan).length === 0 && <li className="text-gray-500">Tidak ada data materi relevan.</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-red-600">Materi Tidak Relevan</h3>
            <ul className="list-disc ml-6">
              {Object.entries(frekuensi.tidakRelevan)
                .sort((a, b) => b[1] - a[1])
                .map(([materi, jumlah]) => (
                  <li key={materi}>{materi}: <span className="font-bold">{jumlah}</span></li>
                ))}
              {Object.keys(frekuensi.tidakRelevan).length === 0 && <li className="text-gray-500">Tidak ada data materi tidak relevan.</li>}
            </ul>
          </div>
        </div>
      </div>
      {/* Simpulan Top 3 Materi Relevan & Tidak Relevan di bawah */}
      <div className="bg-blue-50 border-l-4 border-blue-400 mt-8 p-6 rounded-xl shadow text-[#1976D2]">
        <h2 className="text-lg font-semibold mb-4">Simpulan 3 Materi Teratas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2 text-green-700">Top 3 Materi Relevan</h3>
            <ul className="list-decimal ml-6">
              {Object.entries(frekuensi.relevan)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([materi, jumlah]) => (
                  <li key={materi}>
                    <span className="font-bold">{materi}</span> <span className="text-gray-700">({jumlah} responden)</span>
                  </li>
                ))}
              {Object.keys(frekuensi.relevan).length === 0 && <li className="text-gray-500">Tidak ada data materi relevan.</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-red-600">Top 3 Materi Tidak Relevan</h3>
            <ul className="list-decimal ml-6">
              {Object.entries(frekuensi.tidakRelevan)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([materi, jumlah]) => (
                  <li key={materi}>
                    <span className="font-bold">{materi}</span> <span className="text-gray-700">({jumlah} responden)</span>
                  </li>
                ))}
              {Object.keys(frekuensi.tidakRelevan).length === 0 && <li className="text-gray-500">Tidak ada data materi tidak relevan.</li>}
            </ul>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">
          Simpulan di atas menampilkan 3 materi yang paling sering dinilai relevan dan tidak relevan oleh responden. Materi relevan menunjukkan topik yang paling mendukung kinerja alumni, sedangkan materi tidak relevan dapat menjadi bahan evaluasi untuk perbaikan kurikulum pelatihan berikutnya.
        </p>
      </div>
    </div>
  );
}