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

  useEffect(() => {
    fetch("/api/jawaban/1")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.result)) {
          const mapped = data.result.map((row: {
            pelatihanId: number;
            namaPelatihan: string;
            answers: { q1?: string; q2?: string; q3?: string; q4?: string; q5?: string; q6?: string };
          }) => ({
            pelatihanId: row.pelatihanId,
            namaPelatihan: row.namaPelatihan,
            relevan: [row.answers.q1, row.answers.q2, row.answers.q3].filter(Boolean),
            tidakRelevan: [row.answers.q4, row.answers.q5, row.answers.q6].filter(Boolean),
          }));
          setMateriTable(mapped);
        } else {
          setMateriTable([]);
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
      <div className="mb-4 flex items-center gap-2">
        <label className="font-semibold text-[#1976D2]">Filter Pelatihan:</label>
        <select
          className="border border-[#B3E5FC] rounded px-3 py-1 focus:outline-none"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="all">Semua Pelatihan</option>
          {Array.from(new Set(materiTable.map((row) => row.namaPelatihan))).map((nama) => (
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
              <tr key={row.pelatihanId} className="text-center">
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
    </div>
  );
}