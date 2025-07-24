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

const pieColors = ["#1976D2", "#2196F3", "#90CAF9"];
export default function DashboardCharts() {
  const [pelatihanData, setPelatihanData] = useState<{ name: string; jumlah: number }[]>([]);
  const [instansiData, setInstansiData] = useState<{ name: string; jumlah: number }[]>([]);
  const [jenisInstansiData, setJenisInstansiData] = useState<{ name: string; value: number }[]>([]);

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

    fetch("/api/instansi/summary")
      .then((res) => res.json())
      .then((data: Array<{ kategoriNama: string; instansiNama: string; jumlahAlumni: number }>) => {
        // Bar chart: instansiNama
        const instansiAgg: { [name: string]: number } = {};
        data.forEach((item) => {
          instansiAgg[item.instansiNama] = (instansiAgg[item.instansiNama] || 0) + item.jumlahAlumni;
        });
        setInstansiData(
          Object.entries(instansiAgg)
            .map(([name, jumlah]) => ({ name, jumlah }))
            .sort((a, b) => b.jumlah - a.jumlah)
        );

        // Pie chart: kategoriNama
        const kategoriAgg: { [name: string]: number } = {};
        data.forEach((item) => {
          kategoriAgg[item.kategoriNama] = (kategoriAgg[item.kategoriNama] || 0) + item.jumlahAlumni;
        });
        setJenisInstansiData(
          Object.entries(kategoriAgg).map(([name, value]) => ({ name, value }))
        );
      });
  }, []);

  // jenisInstansiData now comes from API

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
      {/* Bar Chart Instansi */}
      <div className="bg-white/90 rounded-xl shadow flex flex-col items-center justify-center p-6">
        <span className="text-gray-600 font-semibold mb-2">Distribusi Instansi</span>
        <div className="w-full overflow-x-auto" style={{ maxHeight: 350 }}>
          <ResponsiveContainer width={500} height={Math.max(250, instansiData.length * 32)}>
            <BarChart
              data={instansiData}
              layout="vertical"
              margin={{ left: 80, right: 20, top: 20, bottom: 20 }}
            >
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#1976D2">
                <LabelList dataKey="jumlah" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
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
              fill="#1976D2"
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