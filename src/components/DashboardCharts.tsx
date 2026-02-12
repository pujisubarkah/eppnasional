"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useEffect, useState } from "react";

// Warna tema untuk chart
const pieColors = [
  "#1976D2", // biru
  "#E53935", // merah
  "#43A047", // hijau
  "#FDD835", // kuning
  "#8E24AA", // ungu
  "#FB8C00", // oranye
  "#00ACC1", // cyan
  "#F06292", // pink
  "#6D4C41", // coklat
  "#C0CA33", // lime
  "#00E676", // hijau terang
  "#FFB300", // kuning gelap
  "#1DE9B6", // turquoise
  "#D500F9", // ungu terang
  "#FF1744", // merah terang
  "#FFEA00", // kuning neon
  "#00B8D4", // biru muda
  "#FF4081", // pink terang
  "#AEEA00", // lime terang
  "#B388FF", // ungu pastel
];

export default function DashboardCharts() {
  // Add custom styles for scrollbar
  const customScrollbarStyle = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(156, 163, 175, 0.1);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, #8b5cf6, #a855f7);
      border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, #7c3aed, #9333ea);
    }
  `;
  const [pelatihanData, setPelatihanData] = useState<{ name: string; jumlah: number }[]>([]);
  const [instansiData, setInstansiData] = useState<{ name: string; jumlah: number }[]>([]);
  const [jenisInstansiData, setJenisInstansiData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    // Fetch data pelatihan
    fetch("/api/alumni/summary")
      .then((res) => res.json())
      .then((data: Array<{ id: number; pelatihan: string; total_alumni: string }>) => {
        setPelatihanData(
          data.map((item) => ({
            name: item.pelatihan,
            jumlah: Number(item.total_alumni),
          }))
        );
      })
      .catch((err) => console.error("Error fetching pelatihan data:", err));

    // Fetch data instansi & jenis instansi
    fetch("/api/instansi/summary")
      .then((res) => res.json())
      .then((data: Array<{ kategoriNama: string; instansiNama: string; jumlahAlumni: number }>) => {
        // Agregasi per instansi (untuk bar chart vertikal)
        const instansiAgg: { [name: string]: number } = {};
        data.forEach((item) => {
          instansiAgg[item.instansiNama] = (instansiAgg[item.instansiNama] || 0) + item.jumlahAlumni;
        });
        setInstansiData(
          Object.entries(instansiAgg)
            .map(([name, jumlah]) => ({ name, jumlah }))
            .sort((a, b) => b.jumlah - a.jumlah) // urutkan descending
        );

        // Agregasi per jenis instansi (untuk pie chart)
        const kategoriAgg: { [name: string]: number } = {};
        data.forEach((item) => {
          kategoriAgg[item.kategoriNama] = (kategoriAgg[item.kategoriNama] || 0) + item.jumlahAlumni;
        });
        setJenisInstansiData(
          Object.entries(kategoriAgg).map(([name, value]) => ({ name, value }))
        );
      })
      .catch((err) => console.error("Error fetching instansi data:", err));
  }, []);


  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customScrollbarStyle }} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-10 px-4">

      {/* Chart 1: Distribusi Instansi (Bar Vertikal) */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          Alumni per Instansi
        </h3>
        <div className="w-full overflow-x-auto" style={{ maxHeight: 350 }}>
          <ResponsiveContainer width="100%" height={Math.max(250, instansiData.length * 32)}>
            <BarChart
              data={instansiData}
              layout="vertical"
              margin={{ left: 100, right: 20, top: 20, bottom: 20 }}
            >
              <XAxis type="number" stroke="#6b7280" />
              <YAxis dataKey="name" type="category" width={180} stroke="#6b7280" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="jumlah" radius={[0, 6, 6, 0]}>
                {instansiData.map((entry, idx) => (
                  <Cell
                    key={`bar-cell-${idx}`}
                    fill={pieColors[idx % pieColors.length]}
                    opacity={0.9}
                    className="hover:opacity-100 transition-opacity duration-300"
                  />
                ))}
                <LabelList
                  dataKey="jumlah"
                  position="right"
                  fill="#4b5563"
                  fontSize={12}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Jenis Instansi (Pie + Legend) */}
      <div className="bg-gradient-to-br from-white/90 via-purple-50/30 to-indigo-50/40 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-200/50 hover:shadow-2xl transition-all duration-500 p-8 flex flex-col relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-2xl shadow-lg mr-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v5h5"/>
                <path d="M21 21v-5h-5"/>
                <path d="M21 3v5h-5"/>
                <path d="M3 21v-5h5"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Distribusi Jenis Instansi
              </h3>
              <p className="text-sm text-gray-500 mt-1">Klasifikasi alumni berdasarkan jenis instansi</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center w-full">
            {/* Compact Layout: Chart + Legend Side by Side */}
            <div className="flex flex-col lg:flex-row items-center gap-4 w-full max-w-5xl">
              
              {/* Pie Chart - Compact Size */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-lg scale-110"></div>
                <div className="relative">
                  <PieChart width={260} height={260}>
                    <defs>
                      {jenisInstansiData.map((entry, idx) => (
                        <linearGradient key={`gradient-${idx}`} id={`gradient-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={pieColors[idx % pieColors.length]} stopOpacity={1} />
                          <stop offset="100%" stopColor={pieColors[idx % pieColors.length]} stopOpacity={0.75} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={jenisInstansiData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={2}
                      isAnimationActive
                      animationDuration={1200}
                    >
                      {jenisInstansiData.map((entry, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={`url(#gradient-${idx})`}
                          stroke="#fff"
                          strokeWidth={2}
                          className="hover:opacity-90 transition-all duration-300 cursor-pointer"
                          style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                        />
                      ))}
                    </Pie>
                    
                    {/* Center text */}
                    <text x="50%" y="47%" textAnchor="middle" className="fill-gray-600 text-xs font-medium">
                      Total Alumni
                    </text>
                    <text x="50%" y="57%" textAnchor="middle" className="fill-purple-600 text-lg font-bold">
                      {jenisInstansiData.reduce((sum, d) => sum + d.value, 0)}
                    </text>
                    
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                        backdropFilter: "blur(8px)",
                      }}
                      formatter={(value, name) => [
                        <span key="value" style={{ color: '#6366f1', fontWeight: '600' }}>{value} alumni</span>,
                        <span key="name" style={{ color: '#374151' }}>{name}</span>
                      ]}
                    />
                  </PieChart>
                </div>
              </div>
              
              {/* Legend with More Space for Text */}
              <div className="flex-1 min-w-0 lg:pl-6">
                <h4 className="text-base font-semibold text-gray-800 mb-3">Keterangan</h4>
                
                <div className="space-y-2">
                  {jenisInstansiData
                    .sort((a, b) => b.value - a.value)
                    .map((entry) => {
                      const total = jenisInstansiData.reduce((sum, d) => sum + d.value, 0);
                      const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";
                      const originalIndex = jenisInstansiData.findIndex(item => item.name === entry.name);
                      
                      return (
                        <div
                          key={entry.name}
                          className="flex items-start p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5 mr-3"
                            style={{ 
                              backgroundColor: pieColors[originalIndex % pieColors.length]
                            }}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-800 leading-tight">
                              {entry.name}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-600">{entry.value} alumni</span>
                              <span className="text-sm font-semibold text-purple-600">{percent}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 3: Nama Pelatihan (Bar Horizontal) */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6 md:col-span-2">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          Alumni per Pelatihan
        </h3>
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={Math.max(300, pelatihanData.length * 50)}>
            <BarChart
              data={pelatihanData}
              layout="vertical"
              margin={{ top: 20, right: 50, left: 20, bottom: 20 }}
            >
              <XAxis type="number" stroke="#6b7280" />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={200} 
                stroke="#6b7280" 
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="jumlah" radius={[0, 8, 8, 0]}>
                {pelatihanData.map((entry, idx) => (
                  <Cell
                    key={`pelatihan-bar-cell-${idx}`}
                    fill={pieColors[idx % pieColors.length]}
                    opacity={0.85}
                    className="hover:opacity-100 transition-opacity duration-300"
                  />
                ))}
                <LabelList
                  dataKey="jumlah"
                  position="right"
                  fill="#4b5563"
                  fontSize={12}
                  fontWeight="bold"
                  formatter={(label: React.ReactNode) => {
                    const value = typeof label === "number" ? label : Number(label);
                    const total = pelatihanData.reduce((sum, d) => sum + d.jumlah, 0);
                    const percent = total > 0 && value ? ((value / total) * 100).toFixed(1) : "0";
                    return `${value} (${percent}%)`;
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      </div>
    </>
  );
}
