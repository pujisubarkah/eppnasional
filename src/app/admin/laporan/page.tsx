"use client";

import { useState } from "react";

export default function LaporanPage() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/laporan-final");
      if (!res.ok) {
        alert("Gagal mengunduh laporan DOCX.");
        setLoading(false);
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "laporan-survey.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat download.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1976D2]">📑 Laporan Survey</h1>
      <p className="text-gray-700">
        Preview laporan di bawah ini, bisa langsung download juga.
      </p>

      {/* Preview HTML */}
      <div className="border rounded shadow overflow-auto h-[600px]">
        <iframe
          src="/api/laporan-preview"
          className="w-full h-full"
        />
      </div>

      {/* Tombol download */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-[#1976D2] text-white px-6 py-2 rounded-lg shadow hover:bg-[#1565C0] transition disabled:opacity-50"
      >
        {loading ? "Mengunduh..." : "Download Laporan DOCX"}
      </button>
    </div>
  );
}
