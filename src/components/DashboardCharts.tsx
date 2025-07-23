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
  LabelList,
} from "recharts";

import { useEffect, useState } from "react";

const instansiData = [
  { name: "Kementerian", jumlah: 120 },
  { name: "Lembaga", jumlah: 80 },
  { name: "Pemda", jumlah: 60 },
  { name: "BUMN", jumlah: 30 },
];


const pieColors = ["#1976D2", "#2196F3", "#90CAF9"];
export default function DashboardCharts() {
  const [pelatihanData, setPelatihanData] = useState<{ name: string; jumlah: number }[]>([]);

  useEffect(() => {
    fetch("/api/alumni/summary")
      .then((res) => res.json())
      .then((data: Array<{ id: number; pelatihan: string; total_alumni: string }>) => {
        setPelatihanData(
          data.map((item) => ({
            name: item.pelatihan,
            jumlah: Number(item.total_alumni),
          }))
        );
      });
  }, []);

  // Dummy data for jenisInstansiData (replace with real data if available)
  const jenisInstansiData = [
    { name: "Kementerian", value: 120 },
    { name: "Lembaga", value: 80 },
    { name: "Pemda", value: 60 },
    { name: "BUMN", value: 30 },
  ];

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
            <Bar dataKey="jumlah" fill="#1976D2">
              {
                pelatihanData.map((entry, idx) => (
                  <text
                    key={`label-${idx}`}
                    x={idx * 80 + 40}
                    y={250 - entry.jumlah * 2 - 10}
                    textAnchor="middle"
                    fill="#1976D2"
                    fontSize={12}
                  >{entry.jumlah}</text>
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Pie Chart Jenis Instansi */}
      <div className="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
        <span className="text-gray-600 font-semibold mb-2">Distribusi Jenis Instansi</span>
        <ResponsiveContainer width="100%" height={250}>
          <>
            <PieChart>
              <Pie
                data={jenisInstansiData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#1976D2"
              >
                {jenisInstansiData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </>
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
            <Bar dataKey="jumlah" fill="#1976D2">
              <LabelList
                dataKey="jumlah"
                position="center"
                content={({ x, y, value, height }) => {
                  const total = pelatihanData.reduce((sum, d) => sum + d.jumlah, 0);
                  const percent = total > 0 ? ((value as number) / total * 100).toFixed(1) : "0";
                  // Posisikan label di tengah bar
                  const labelY = typeof y === "number" && typeof height === "number" ? y + height / 2 : y;
                  return (
                    <text
                      x={x}
                      y={labelY}
                      textAnchor="middle"
                      fill="#222"
                      fontWeight="bold"
                      fontSize={13}
                      alignmentBaseline="middle"
                    >
                      {value} ({percent}%)
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}