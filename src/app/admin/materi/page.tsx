"use client";
import { useEffect, useState } from "react";

// Dummy data materi per pelatihan
const materiTable = [
  {
    pelatihan_id: 1,
    relevan: [
      "Pengembangan Kepemimpinan Kolaboratif",
      "Etika dan Integritas",
      "Kerangka Manajemen Kebijakan Publik",
    ],
    tidakRelevan: [
      "Komunikasi dan Advokasi Kebijakan",
      "Isu Strategis Kebijakan",
    ],
  },
  {
    pelatihan_id: 2,
    relevan: [
      "Etika dan Integritas",
      "Kerangka Manajemen Kebijakan Publik",
    ],
    tidakRelevan: [
      "Berpikir Holistik",
    ],
  },
  // ...tambahkan data lain sesuai kebutuhan
];

export default function MateriPage() {
  const [pelatihan, setPelatihan] = useState<{ id: number; nama: string }[]>([]);
  const [selected, setSelected] = useState<number | "all">("all");

  useEffect(() => {
    // Fetch daftar pelatihan dari API
    fetch("/api/pelatihan")
      .then((res) => res.json())
      .then((data) => setPelatihan(data));
  }, []);

  // Filter table sesuai pelatihan yang dipilih
  const filteredTable =
    selected === "all"
      ? materiTable
      : materiTable.filter((row) => row.pelatihan_id === selected);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Relevansi Materi Pelatihan</h1>
      <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
        <p>
          Tabel berikut memperlihatkan perbandingan jumlah responden yang menilai materi pelatihan <b>Relevan</b> dan <b>Tidak Relevan</b> dalam mendukung kinerja, berdasarkan jenis pelatihan.
        </p>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold text-[#1976D2]">Filter Pelatihan:</label>
        <select
          className="border border-[#B3E5FC] rounded px-3 py-1 focus:outline-none"
          value={selected}
          onChange={e => setSelected(e.target.value === "all" ? "all" : Number(e.target.value))}
        >
          <option value="all">Semua Pelatihan</option>
          {pelatihan.map((p) => (
            <option key={p.id} value={p.id}>{p.nama}</option>
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
            {filteredTable.map((row, idx) => {
              const nama = pelatihan.find((p) => p.id === row.pelatihan_id)?.nama || "-";
              return (
                <tr key={row.pelatihan_id} className="text-center">
                  <td className="px-4 py-2 border">{idx + 1}</td>
                  <td className="px-4 py-2 border">{nama}</td>
                  <td className="px-4 py-2 border text-green-700 font-bold">{Array.isArray(row.relevan) ? row.relevan.join(", ") : row.relevan}</td>
                  <td className="px-4 py-2 border text-red-600 font-bold">{Array.isArray(row.tidakRelevan) ? row.tidakRelevan.join(", ") : row.tidakRelevan}</td>
                </tr>
              );
            })}
            {filteredTable.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}