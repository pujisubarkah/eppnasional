import { useEffect, useState } from "react";
import { CalendarDays, Users, Building2 } from "lucide-react";

type SummaryType = {
  totalResponden: number;
  tahunPelatihan: Record<string, number>;
  totalInstansi: number;
};

export default function DashboardSummaryCard() {
  const [summary, setSummary] = useState<SummaryType | null>(null);

  useEffect(() => {
    fetch("/api/summarycard")
      .then((res) => res.json())
      .then((data) => setSummary(data.summary));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-10">
      {/* Tahun Pelatihan Card */}
      {["2021", "2022", "2023", "2024"].map((tahun) => (
        <div
          key={tahun}
          className="bg-white rounded-xl shadow flex flex-col items-center justify-center p-6 border-2 border-[#2196F3]/40 hover:border-[#1976D2] transition"
        >
          <CalendarDays className="w-8 h-8 text-[#1976D2] mb-2" />
          <div className="text-2xl font-bold text-[#1976D2]">
            {summary?.tahunPelatihan?.[tahun] ?? 0}
          </div>
          <div className="text-gray-700 text-sm text-center font-semibold mt-2">
            Total Responden
            <br />Pelatihan Tahun {tahun}
          </div>
        </div>
      ))}
      {/* Total Responden Keseluruhan */}
      <div className="bg-white rounded-xl shadow flex flex-col items-center justify-center p-6 border-2 border-[#2196F3]/40 hover:border-[#1976D2] transition">
        <Users className="w-8 h-8 text-[#1976D2] mb-2" />
        <div className="text-2xl font-bold text-[#1976D2]">
          {summary?.totalResponden ?? 0}
        </div>
        <div className="text-gray-700 text-sm text-center font-semibold mt-2">
          Total Responden
          <br />Keseluruhan
        </div>
      </div>
      {/* Total Instansi */}
      <div className="bg-white rounded-xl shadow flex flex-col items-center justify-center p-6 border-2 border-[#2196F3]/40 hover:border-[#1976D2] transition">
        <Building2 className="w-8 h-8 text-[#1976D2] mb-2" />
        <div className="text-2xl font-bold text-[#1976D2]">
          {summary?.totalInstansi ?? 0}
        </div>
        <div className="text-gray-700 text-sm text-center font-semibold mt-2">
          Total Instansi
        </div>
      </div>
    </div>
  );
}