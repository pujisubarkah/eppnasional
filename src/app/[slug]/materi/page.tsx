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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    // fetch("/api/pelatihan")
    //   .then((res) => res.json())
    //   .then((data) => setPelatihan(data));
  }, []);

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
      });
  }, []);

  const filteredTable =
    selected === "all"
      ? materiTable
      : materiTable.filter((row) => row.namaPelatihan === selected);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selected]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTable.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredTable.slice(startIndex, endIndex);

  // Calculate filtered frequencies for Rekap & Simpulan
  const filteredFrekuensi = filteredTable.reduce<{
    relevan: Record<string, number>;
    tidakRelevan: Record<string, number>;
  }>(
    (acc, row) => {
      row.relevan.forEach((materi) => {
        acc.relevan[materi] = (acc.relevan[materi] || 0) + 1;
      });
      row.tidakRelevan.forEach((materi) => {
        acc.tidakRelevan[materi] = (acc.tidakRelevan[materi] || 0) + 1;
      });
      return acc;
    },
    { relevan: {}, tidakRelevan: {} }
  );

  // Get top 10 relevant and irrelevant materials
  const top10Relevan = Object.entries(filteredFrekuensi.relevan)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const top10TidakRelevan = Object.entries(filteredFrekuensi.tidakRelevan)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Get top 3 relevant and irrelevant materials
  const top3Relevan = Object.entries(filteredFrekuensi.relevan)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const top3TidakRelevan = Object.entries(filteredFrekuensi.tidakRelevan)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-[#1976D2] border border-[#E3F2FD] hover:bg-[#E3F2FD]'
        }`}
      >
        ‹ Prev
      </button>
    );

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
            currentPage === i
              ? 'bg-[#1976D2] text-white'
              : 'bg-white text-[#1976D2] border border-[#E3F2FD] hover:bg-[#E3F2FD]'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-[#1976D2] border border-[#E3F2FD] hover:bg-[#E3F2FD]'
        }`}
      >
        Next ›
      </button>
    );

    return (
      <div className="flex justify-center items-center mt-6 space-x-1">
        {pages}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E3F2FD] mb-8">
          <h1 className="text-3xl font-bold mb-4 text-[#1976D2] flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1976D2] rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            Relevansi Materi Pelatihan
          </h1>
          <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-6 rounded-xl border-l-4 border-[#1976D2]">
            <p className="text-gray-700 leading-relaxed">
              Tabel berikut memperlihatkan <span className="font-semibold text-[#1976D2]">3 materi teratas</span> yang dinilai paling <b className="text-green-600">Relevan</b> dan <b className="text-red-600">Tidak Relevan</b> dalam mendukung kinerja, berdasarkan jenis pelatihan yang dipilih responden.
            </p>
          </div>
        </div>
        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              // Build CSV from filteredTable
              const headers = ["Pelatihan ID", "Nama Pelatihan", "Top Relevan (comma-separated)", "Top Tidak Relevan (comma-separated)"];
              const rows = filteredTable.map(r => [
                r.pelatihanId,
                `"${String(r.namaPelatihan).replace(/"/g, '""')}"`,
                `"${r.relevan.slice(0,10).join(', ').replace(/"/g, '""')}"`,
                `"${r.tidakRelevan.slice(0,10).join(', ').replace(/"/g, '""')}"`,
              ]);
              const csvContent = [headers, ...rows].map(r => r.join(",")).join("\n");
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `materi_export_${new Date().toISOString().slice(0,10)}.csv`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            Export CSV
          </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-[#E3F2FD] mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="font-semibold text-[#1976D2] flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filter Pelatihan:
            </label>
            <select
              className="border border-[#B3E5FC] rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1976D2] focus:border-transparent bg-white shadow-sm min-w-[250px] transition-all"
              value={selected}
              onChange={e => setSelected(e.target.value)}
            >
              <option value="all">📊 Semua Pelatihan</option>
              {Array.from(new Set(materiTable.map((row) => row.namaPelatihan).filter(nama => !!nama))).map((nama) => (
                <option key={nama} value={nama}>🎯 {nama}</option>
              ))}
            </select>
            <div className="text-sm text-gray-600 bg-[#E3F2FD] px-3 py-2 rounded-lg">
              Total: <span className="font-semibold text-[#1976D2]">{filteredTable.length}</span> data
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E3F2FD] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] text-white">
                  <th className="px-6 py-4 text-left font-semibold">No</th>
                  <th className="px-6 py-4 text-left font-semibold">Nama Pelatihan</th>
                  <th className="px-6 py-4 text-center font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                      Top 3 Materi Relevan
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                      Top 3 Materi Tidak Relevan
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentRows.map((row, idx) => {
                  // Get top 3 for this specific row
                  const rowRelevan = row.relevan.slice(0, 3);
                  const rowTidakRelevan = row.tidakRelevan.slice(0, 3);
                  
                  return (
                    <tr key={`${row.pelatihanId}-${idx}`} className="hover:bg-[#F8F9FA] transition-colors">
                      <td className="px-6 py-4 text-center font-medium text-[#1976D2]">
                        {startIndex + idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{row.namaPelatihan}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {rowRelevan.length > 0 ? (
                            rowRelevan.map((materi, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                <span className="text-sm text-green-700 font-medium">{materi}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm italic">Tidak ada data</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {rowTidakRelevan.length > 0 ? (
                            rowTidakRelevan.map((materi, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                <span className="text-sm text-red-600 font-medium">{materi}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-400 text-sm italic">Tidak ada data</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {currentRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-gray-500 text-lg">Tidak ada data yang tersedia</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredTable.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Menampilkan <span className="font-semibold">{startIndex + 1}</span> - <span className="font-semibold">{Math.min(endIndex, filteredTable.length)}</span> dari <span className="font-semibold">{filteredTable.length}</span> data
                </div>
                {renderPagination()}
              </div>
            </div>
          )}
        </div>

        {/* Rekap Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Rekap Materi Relevan */}
          <div className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Rekap Materi Relevan
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {top10Relevan.length > 0 ? (
                  top10Relevan.map(([materi, jumlah], index) => (
                    <div key={materi} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">{materi}</span>
                      </div>
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {jumlah}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg">📋</div>
                    <p className="text-gray-500 mt-2">Tidak ada data materi relevan</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rekap Materi Tidak Relevan */}
          <div className="bg-white rounded-xl shadow-lg border border-red-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Rekap Materi Tidak Relevan
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {top10TidakRelevan.length > 0 ? (
                  top10TidakRelevan.map(([materi, jumlah], index) => (
                    <div key={materi} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">{materi}</span>
                      </div>
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {jumlah}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg">📋</div>
                    <p className="text-gray-500 mt-2">Tidak ada data materi tidak relevan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Simpulan Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E3F2FD] mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Simpulan & Analisis
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-4 text-green-600 text-lg flex items-center gap-2">
                  🏆 Top 3 Materi Paling Relevan
                </h3>
                <div className="space-y-3">
                  {top3Relevan.length > 0 ? (
                    top3Relevan.map(([materi, jumlah], index) => (
                      <div key={materi} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{materi}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Dipilih oleh <span className="font-bold text-green-600">{jumlah} responden</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 italic">
                      Tidak ada data materi relevan
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-4 text-red-600 text-lg flex items-center gap-2">
                  ⚠️ Top 3 Materi Kurang Relevan
                </h3>
                <div className="space-y-3">
                  {top3TidakRelevan.length > 0 ? (
                    top3TidakRelevan.map(([materi, jumlah], index) => (
                      <div key={materi} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xs mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{materi}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Dipilih oleh <span className="font-bold text-red-600">{jumlah} responden</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 italic">
                      Tidak ada data materi tidak relevan
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Kesimpulan Analisis</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Data di atas menampilkan <span className="font-semibold text-blue-600">3 materi teratas</span> yang paling sering dinilai relevan dan tidak relevan oleh responden. 
                    <span className="font-semibold text-green-600"> Materi relevan</span> menunjukkan topik yang paling mendukung kinerja alumni dan dapat dijadikan prioritas dalam pengembangan kurikulum. 
                    Sebaliknya, <span className="font-semibold text-red-600">materi tidak relevan</span> dapat menjadi bahan evaluasi untuk perbaikan dan penyesuaian kurikulum pelatihan di masa mendatang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}