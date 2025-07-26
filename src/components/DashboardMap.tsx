"use client";

import { useEffect, useState } from "react";

type Provinsi = {
  provinsiId: number;
  provinsiNama: string;
  svgPath: string;
  jumlahAlumni: number;
};

const colorScale = [
  { max: 10, color: "#E3F2FD", label: "0–10" },
  { max: 50, color: "#90CAF9", label: "11–50" },
  { max: 100, color: "#42A5F5", label: "51–100" },
  { max: 200, color: "#2196F3", label: "101–200" },
  { max: Infinity, color: "#1976D2", label: "201+" },
];

function getColor(count: number) {
  if (count === 0) return "url(#no-data-gradient)";
  for (const c of colorScale) {
    if (count <= c.max) return c.color;
  }
  return colorScale[colorScale.length - 1].color;
}

function cleanPath(path: string) {
  return path ? path.replace(/^"|"$/g, "") : "";
}

export default function DashboardMap() {
  const [provinsi, setProvinsi] = useState<Provinsi[]>([]);
  const [hovered, setHovered] = useState<Provinsi | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    async function fetchProvinsi() {
      try {
        const res = await fetch("/api/provinsi/summary");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProvinsi(data);
        } else if (Array.isArray(data?.result)) {
          setProvinsi(data.result);
        } else {
          setProvinsi([]);
        }
      } catch {
        setProvinsi([]);
      }
    }
    fetchProvinsi();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-12">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl border-2 border-[#2196F3] p-4 md:p-10 flex flex-col lg:flex-row gap-4 md:gap-8 items-stretch">
        {/* Bagian Utama Peta */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-4 md:mb-6 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#1976D2] mb-2 md:mb-3">
              PETA SEBARAN RESPONDEN
            </h1>
            <p className="text-center text-gray-700 max-w-4xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2 mb-2">
              Temukan sebaran responden alumni ASN dari seluruh Indonesia!
            </p>
            <p className="text-center text-gray-700 max-w-4xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed px-2">
              <span className="text-[#1976D2] font-semibold">Semakin banyak responden, semakin biru provinsinya.</span>
              Peta interaktif ini menunjukkan partisipasi alumni secara nasional.
            </p>
            <hr className="w-1/4 h-1 bg-gradient-to-r from-blue-700 via-blue-400 to-cyan-400 mx-auto my-3 sm:my-4" />
          </div>

          {/* Kontainer Peta */}
          <div className="relative overflow-hidden rounded-lg shadow-md border border-[#2196F3]/30 flex-1">
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-auto max-h-[70vh]"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <radialGradient id="prov-hover-gradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#BBDEFB" />
                  <stop offset="100%" stopColor="#1976D2" />
                </radialGradient>
                <linearGradient id="no-data-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
              </defs>
              {provinsi.map((prov) => (
                <path
                  key={prov.provinsiId}
                  d={cleanPath(prov.svgPath)}
                  fill={hovered?.provinsiId === prov.provinsiId ? "url(#prov-hover-gradient)" : (prov.jumlahAlumni > 0 ? getColor(prov.jumlahAlumni) : "url(#no-data-gradient)")}
                  stroke="#1E3A8A"
                  strokeWidth={0.5}
                  strokeOpacity={0.3}
                  onMouseEnter={() => {
                    setHovered(prov);
                    setShowTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                    setShowTooltip(false);
                  }}
                  className="cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <title>{prov.provinsiNama} ({prov.jumlahAlumni} alumni)</title>
                </path>
              ))}
              {/* Tooltip Hover di pojok kanan atas */}
              {showTooltip && hovered && (
                <foreignObject x={770} y={10} width={220} height={60} className="pointer-events-none">
                  <div className="bg-white/95 border border-blue-300 rounded-lg p-2 shadow-lg text-xs sm:text-sm font-semibold text-blue-800 backdrop-blur-sm animate-fadeIn">
                    <div className="font-bold">{hovered.provinsiNama}</div>
                    <div>Jumlah Alumni: {hovered.jumlahAlumni}</div>
                  </div>
                </foreignObject>
              )}
            </svg>
          </div>
        </div>

        {/* Legend Card */}
        <div className="w-full lg:w-64 flex flex-col bg-white/90 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border-2 border-[#2196F3] p-4 md:p-5 gap-3 md:gap-4 h-fit self-start transition-all duration-300 hover:shadow-xl mt-4 lg:mt-0">
                <h2 className="font-bold text-[#1976D2] text-lg md:text-xl tracking-wide text-center">LEGENDA</h2>
                <div className="space-y-2 mt-2">
                  {colorScale.map((scale, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span
                        className="inline-block w-6 h-6 rounded border border-blue-300"
                        style={{
                          background: scale.color,
                        }}
                      ></span>
                      <span className="text-sm text-gray-700">{scale.label}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className="inline-block w-6 h-6 rounded border border-gray-300"
                      style={{
                        background: "linear-gradient(90deg, #f8fafc 0%, #e2e8f0 100%)",
                      }}
                    ></span>
                    <span className="text-sm text-gray-500">Belum ada data</span>
                  </div>
                </div>
              </div>
      </div>
    </section>
      );
}