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
  Legend,
} from "recharts";

const instansiData = [
  { name: "Kementerian", jumlah: 120 },
  { name: "Lembaga", jumlah: 80 },
  { name: "Pemda", jumlah: 60 },
  { name: "BUMN", jumlah: 30 },
  { name: "Lainnya", jumlah: 10 },
];

const jenisInstansiData = [
  { name: "Pusat", value: 150 },
  { name: "Daerah", value: 90 },
  { name: "Lainnya", value: 20 },
];

const pelatihanData = [
  { name: "Dasar CPNS", jumlah: 70 },
  { name: "Kepemimpinan", jumlah: 60 },
  { name: "Teknis", jumlah: 40 },
  { name: "Fungsional", jumlah: 30 },
  { name: "Lainnya", jumlah: 20 },
];

const pieColors = ["#1976D2", "#2196F3", "#90CAF9"];

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      {/* Bar Chart Instansi */}
      <div className="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
        <span className="text-gray-600 font-semibold mb-2">Distribusi Instansi</span>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={instansiData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="jumlah" fill="#1976D2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Pie Chart Jenis Instansi */}
      <div className="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
        <span className="text-gray-600 font-semibold mb-2">Distribusi Jenis Instansi</span>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={jenisInstansiData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {jenisInstansiData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Bar Chart Nama Pelatihan */}
      <div className="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6 md:col-span-2">
        <span className="text-gray-600 font-semibold mb-2">Distribusi Nama Pelatihan</span>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={pelatihanData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="jumlah" fill="#1976D2" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}