"use client";

import { useEffect, useState, useRef } from "react";

type Provinsi = {
  provinsiId: number;
  provinsiNama: string;
  svgPath: string;
  jumlahAlumni: number;
};

const colorScale = [
  { max: 10, color: "#E1F5FE", label: "1–10 alumni", gradient: "linear-gradient(135deg, #E1F5FE, #B3E5FC)" },
  { max: 50, color: "#4FC3F7", label: "11–50 alumni", gradient: "linear-gradient(135deg, #4FC3F7, #29B6F6)" },
  { max: 100, color: "#0288D1", label: "51–100 alumni", gradient: "linear-gradient(135deg, #0288D1, #0277BD)" },
  { max: 200, color: "#01579B", label: "101–200 alumni", gradient: "linear-gradient(135deg, #01579B, #003c71)" },
  { max: Infinity, color: "#1A237E", label: "200+ alumni", gradient: "linear-gradient(135deg, #1A237E, #0D47A1)" },
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
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    if (svgRef.current) svgRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragStart(null);
    if (svgRef.current) svgRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart) return;
    setPan((prev) => ({
      x: prev.x + (e.clientX - dragStart.x),
      y: prev.y + (e.clientY - dragStart.y),
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Opsional: hanya zoom saat Ctrl ditekan agar tidak ganggu scroll halaman
    // Jika ingin zoom tanpa Ctrl, hapus baris berikut:
    // if (!e.ctrlKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.5, Math.min(3, z + delta)));
  };

  const handlePathMouseEnter = (prov: Provinsi, e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    setTooltipPos({ x: svgP.x, y: svgP.y });
    setHovered(prov);
    setShowTooltip(true);
  };

  return (
    <section className="w-full px-2 sm:px-4 md:px-6 py-6 md:py-8">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl -z-10"></div>

      <div className="bg-gradient-to-br from-white/95 via-blue-50/30 to-cyan-50/40 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-200/50 p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 md:p-4 rounded-2xl shadow-lg mr-3 md:mr-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
                PETA SEBARAN RESPONDEN
              </h1>
              <div className="h-0.5 w-16 md:w-20 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 rounded-full mx-auto mt-2"></div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto mt-4">
            <p className="text-gray-700 text-sm sm:text-base px-1">
              🗺️ <span className="font-semibold">Temukan sebaran responden alumni ASN</span> dari seluruh Indonesia!
            </p>
            <div className="mt-2 bg-blue-50/60 rounded-lg p-3 border border-blue-200/50">
              <p className="text-gray-800 text-xs sm:text-sm">
                💡 <span className="text-blue-600 font-medium">Tips:</span> Semakin gelap warna biru, semakin banyak responden.
                <br className="hidden sm:inline" /> Gunakan <strong>scroll</strong> untuk zoom dan <strong>drag</strong> untuk menggeser peta.
              </p>
            </div>
          </div>
        </div>

        {/* Peta - Full Width */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg border border-blue-200/50 bg-gradient-to-b from-blue-50/40 to-cyan-50/30 mb-8">
          {/* Zoom Controls */}
          <div className="absolute z-20 top-4 left-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-2 border border-blue-200/40">
            <button
              className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-bold shadow transition hover:scale-105"
              onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
              aria-label="Perbesar"
            >
              +
            </button>
            <button
              className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-bold shadow transition hover:scale-105"
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
              aria-label="Perkecil"
            >
              −
            </button>
            <button
              className="w-9 h-9 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold shadow transition hover:scale-105"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              aria-label="Reset peta"
            >
              ↺
            </button>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 1000 600"
            className="w-full h-auto max-h-[70vh] min-h-[50vh] select-none"
            preserveAspectRatio="xMidYMid meet"
            style={{ cursor: dragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onWheel={handleWheel}
            role="img"
            aria-label="Peta sebaran responden alumni ASN di seluruh provinsi Indonesia"
          >
            <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
              <defs>
                <radialGradient id="prov-hover-gradient" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#B3E5FC" />
                  <stop offset="100%" stopColor="#00B8D9" />
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
                  fill={hovered?.provinsiId === prov.provinsiId ? "url(#prov-hover-gradient)" : getColor(prov.jumlahAlumni)}
                  stroke="#1E3A8A"
                  strokeWidth={0.5}
                  strokeOpacity={0.3}
                  onMouseEnter={(e) => handlePathMouseEnter(prov, e)}
                  onMouseLeave={() => {
                    setHovered(null);
                    setShowTooltip(false);
                  }}
                  className="cursor-pointer transition-all duration-200 ease-in-out"
                />
              ))}

              {showTooltip && hovered && (
                <foreignObject
                  x={tooltipPos.x + 10}
                  y={tooltipPos.y - 60}
                  width={240}
                  height={100}
                  className="pointer-events-none"
                >
                  <div className="bg-white border border-gray-800 rounded-lg p-3 shadow-lg text-sm font-medium">
                    <div className="flex items-center mb-1">
                      <div
                        className="w-3.5 h-3.5 rounded-full mr-2 border border-gray-700"
                        style={{ backgroundColor: getColor(hovered.jumlahAlumni) }}
                      />
                      <span className="font-bold text-gray-900">{hovered.provinsiNama}</span>
                    </div>
                    <div className="text-gray-800">
                      👥 <span className="font-bold text-blue-800">{hovered.jumlahAlumni.toLocaleString('id-ID')} Alumni</span>
                    </div>
                    <div className={`mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                      hovered.jumlahAlumni === 0 ? 'bg-gray-100 text-gray-600' :
                      hovered.jumlahAlumni <= 10 ? 'bg-green-100 text-green-800' :
                      hovered.jumlahAlumni <= 50 ? 'bg-yellow-100 text-yellow-800' :
                      hovered.jumlahAlumni <= 100 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {hovered.jumlahAlumni === 0 ? '📊 Belum ada responden' :
                       hovered.jumlahAlumni <= 10 ? '🟢 Partisipasi Rendah' :
                       hovered.jumlahAlumni <= 50 ? '🟡 Partisipasi Sedang' :
                       hovered.jumlahAlumni <= 100 ? '🟠 Partisipasi Tinggi' : '🔴 Partisipasi Sangat Tinggi'}
                    </div>
                  </div>
                </foreignObject>
              )}
            </g>
          </svg>
        </div>

        {/* Legenda - Full Width di Bawah Peta */}
        <div className="w-full bg-gradient-to-br from-white/90 via-blue-50/40 to-cyan-50/30 backdrop-blur-sm rounded-2xl shadow-md border border-blue-200/50 p-4 md:p-5">
          <div className="text-center mb-3">
            <h2 className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-lg md:text-xl">
              LEGENDA
            </h2>
            <div className="h-0.5 w-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded mx-auto mt-1"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
            {colorScale.map((scale, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                <div
                  className="w-5 h-5 rounded shadow-sm border border-white"
                  style={{ background: scale.gradient }}
                />
                <span className="text-sm text-gray-700">{scale.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 p-2 rounded-lg bg-white/50">
              <div
                className="w-5 h-5 rounded shadow-sm border border-gray-300"
                style={{ background: "linear-gradient(135deg, #f8fafc, #e2e8f0)" }}
              />
              <span className="text-sm text-gray-500">Belum ada data</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}