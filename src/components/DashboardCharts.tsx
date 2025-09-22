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
  Sector,
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

  // Active shape saat slice pie di-hover
  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;

    return (
      <g>
        <text x={cx} y={cy - 15} textAnchor="middle" fill="#2c3e50" fontWeight="bold" fontSize={16}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 15}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#fff"
          strokeWidth={2}
          style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
        />
        <text x={sx} y={sy} textAnchor="middle" fill="#2c3e50" fontWeight="bold" fontSize={14}>
          {value} ({(percent * 100).toFixed(1)}%)
        </text>
      </g>
    );
  };

  return (
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
          Jenis Instansi
        </h3>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full">
          <div className="w-full flex flex-row items-center justify-center gap-6">
            {/* Pie Chart */}
            <div className="flex justify-center" style={{ minWidth: 300 }}>
              <PieChart width={300} height={300}>
                <Pie
                  data={jenisInstansiData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  isAnimationActive
                  animationDuration={1000}
                  // label di dalam chart dihilangkan
                >
                  {jenisInstansiData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={pieColors[idx % pieColors.length]}
                      stroke="#fff"
                      strokeWidth={2}
                      className="hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </div>
            {/* Label di samping donat */}
            <div className="flex flex-col justify-center max-h-72 overflow-y-auto scrollbar-thin" style={{ minWidth: 220 }}>
              <ul className="space-y-3">
                {jenisInstansiData.map((entry, idx) => {
                  const total = jenisInstansiData.reduce((sum, d) => sum + d.value, 0);
                  const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";
                  return (
                    <li
                      key={entry.name}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <span
                        className="w-4 h-4 rounded mr-3 flex-shrink-0"
                        style={{ backgroundColor: pieColors[idx % pieColors.length] }}
                      ></span>
                      <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {entry.name}
                      </span>
                      <span className="ml-auto text-sm text-gray-600 font-semibold">
                        {entry.value} ({percent}%)
                      </span>
                    </li>
                  );
                })}
              </ul>
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
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={pelatihanData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              tick={props => (
                <text
                  {...props}
                  fontSize={12}
                  textAnchor="end"
                  transform={`rotate(-30,${props.x},${props.y})`}
                >
                  {props.payload.value}
                </text>
              )}
              interval={0}
              height={70}
            />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <Bar dataKey="jumlah" radius={[8, 8, 0, 0]}>
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
                position="top"
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
  );
}