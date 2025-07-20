"use client";

import { useEffect, useState } from "react";

type Provinsi = {
  id: string;
  svg_path: string;
  dummy_responden: number;
  nama?: string; // gunakan 'nama' sesuai API
};

const colorScale = [
  { max: 10, color: "#BBDEFB", label: "0-10" },      // biru pastel
  { max: 50, color: "#64B5F6", label: "11-50" },     // biru muda
  { max: 100, color: "#4FC3F7", label: "51-100" },   // biru terang
  { max: 200, color: "#29B6F6", label: "101-200" },  // biru lebih terang
  { max: 1000, color: "#03A9F4", label: "201+" },    // biru cerah
];

function getColor(count: number) {
  for (const c of colorScale) {
    if (count <= c.max) return c.color;
  }
  return colorScale[colorScale.length - 1].color;
}

function cleanPath(path: string) {
  return path.replace(/^"|"$/g, "");
}

export default function DashboardMap() {
  const [provinsi, setProvinsi] = useState<Provinsi[]>([]);
  const [hovered, setHovered] = useState<Provinsi | null>(null);

  useEffect(() => {
    async function fetchProvinsi() {
      const res = await fetch("/api/provinsi");
      const data = await res.json();
      // Assign dummy counts (random for demo)
      setProvinsi(
        data.map((prov: Provinsi) => ({
          ...prov,
          dummy_responden: Math.floor(Math.random() * 250),
        }))
      );
    }
    fetchProvinsi();
  }, []);

  return (
    <div>
      <div className="text-center text-lg font-bold text-[#1976D2] mb-2">
        Peta Sebaran Responden
      </div>
      {hovered && (
        <div className="text-center mb-2 text-base font-semibold text-[#1976D2] bg-white/80 rounded shadow inline-block px-4 py-1">
          {hovered.nama} <span className="text-gray-700 font-normal">({hovered.dummy_responden} responden)</span>
        </div>
      )}
      <svg viewBox="0 0 1000 600" className="w-full h-[32rem] object-contain">
        {provinsi.map((prov) => (
          <path
            key={prov.id}
            d={cleanPath(prov.svg_path)}
            fill={getColor(prov.dummy_responden)}
            fillOpacity={0.7}
            stroke="#1976D2"
            strokeWidth={0.5}
            onMouseEnter={() => setHovered(prov)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </svg>
    </div>
  );
}