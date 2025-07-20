import { Users2, PieChart, BarChart3 } from "lucide-react";

export default function DashboardSummaryCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
        <Users2 className="w-8 h-8 text-[#0D47A1] mb-2" />
        <div className="text-2xl font-bold text-[#0D47A1]">1.234</div>
        <div className="text-gray-600 text-sm">Total Responden</div>
      </div>
      <div className="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
        <PieChart className="w-8 h-8 text-[#0D47A1] mb-2" />
        <div className="text-2xl font-bold text-[#0D47A1]">56</div>
        <div className="text-gray-600 text-sm">Total Instansi</div>
      </div>
      <div className="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
            <BarChart3 className="w-8 h-8 text-[#0D47A1] mb-2" />
            <div className="text-2xl font-bold text-[#0D47A1]">12</div>
            <div className="text-gray-600 text-sm">Total</div>
                  </div>
                </div>
            );
        }