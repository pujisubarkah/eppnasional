"use client";

import { useEffect, useState } from "react";

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
  const [showTooltip, setShowTooltip] = useState(false);
  // Zoom & Pan State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

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

  // Mouse events for pan
  function handleMouseDown(e: React.MouseEvent) {
    setDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }
  function handleMouseUp() {
    setDragging(false);
    setDragStart(null);
  }
  function handleMouseMove(e: React.MouseEvent) {
    if (!dragging || !dragStart) return;
    setPan((prev) => ({
      x: prev.x + (e.clientX - dragStart.x),
      y: prev.y + (e.clientY - dragStart.y),
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  }
  // Wheel event for zoom
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((z) => Math.max(0.5, Math.min(3, z + delta)));
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-12 relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative bg-gradient-to-br from-white/95 via-blue-50/30 to-cyan-50/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/50 p-6 md:p-12 hover:shadow-3xl transition-all duration-500">
        {/* Enhanced Header - Full Width */}
        <div className="mb-6 md:mb-8 text-center relative">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg mr-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  PETA SEBARAN RESPONDEN
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 rounded-full mx-auto"></div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-3">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed px-2">
                🗺️ <span className="font-semibold">Temukan sebaran responden alumni ASN</span> dari seluruh Indonesia!
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200/50">
                <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                  💡 <span className="text-blue-600 font-semibold">Tips:</span> Semakin gelap warna biru, semakin banyak responden dari provinsi tersebut. 
                  <span className="text-cyan-600 font-medium">Gunakan zoom dan drag untuk eksplorasi lebih detail!</span>
                </p>
              </div>
            </div>
        </div>

        {/* Container untuk Peta dan Legenda Sejajar */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
          {/* Enhanced Map Container */}
          <div className="flex-1 relative overflow-hidden rounded-2xl shadow-2xl border-2 border-blue-200/60 bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
            {/* Enhanced Zoom Controls */}
            <div className="absolute z-20 top-4 left-4 flex flex-col gap-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-blue-200/50">
              <button
                className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
                onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
                aria-label="Zoom in"
                title="Perbesar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button
                className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                aria-label="Zoom out"
                title="Perkecil"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button
                className="w-10 h-10 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold shadow-md transition-all duration-200 hover:scale-110 active:scale-95"
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                aria-label="Reset"
                title="Reset Posisi"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                  <polyline points="1,4 1,10 7,10"></polyline>
                  <path d="M3.51,15a9,9,0,0,0,2.13,3.09,9,9,0,0,0,12.86,0A9,9,0,0,0,21,12"></path>
                </svg>
              </button>
            </div>
            

            <svg
              viewBox="0 0 1000 600"
              className="w-full h-auto max-h-[80vh] min-h-[60vh] select-none"
              preserveAspectRatio="xMidYMid meet"
              style={{ cursor: dragging ? 'grabbing' : 'grab' }}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onWheel={handleWheel}
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
                    <title>{prov.provinsiNama}</title>
                  </path>
                ))}
                {/* Enhanced Interactive Tooltip */}
                {showTooltip && hovered && (
                  <foreignObject x={50} y={50} width={260} height={100} className="pointer-events-none z-50">
                    <div className="bg-white border-3 border-gray-800 rounded-lg p-4 shadow-2xl">
                      <div className="flex items-center mb-2">
                        <div 
                          className="w-4 h-4 rounded-full mr-3 shadow-md border-2 border-gray-700"
                          style={{ backgroundColor: getColor(hovered.jumlahAlumni) }}
                        ></div>
                        <div className="font-bold text-gray-900 text-base leading-tight">{hovered.provinsiNama}</div>
                      </div>
                      <div className="text-sm text-gray-800 mb-2 font-semibold">
                        👥 <span className="font-black text-blue-800">{hovered.jumlahAlumni.toLocaleString('id-ID')} Alumni</span>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
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

          {/* Enhanced Legend Card - Sejajar dengan Peta */}
          <div className="w-full lg:w-72 xl:w-80 flex flex-col bg-gradient-to-br from-white/95 via-blue-50/30 to-cyan-50/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-200/50 p-5 gap-3 h-fit transition-all duration-500 hover:shadow-3xl hover:scale-105">
          <div className="text-center mb-2">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-xl shadow-md mr-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <h2 className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent text-xl tracking-wide">
                LEGENDA
              </h2>
            </div>
            <div className="h-0.5 w-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded mx-auto"></div>
          </div>
          
          <div className="space-y-3">
            {colorScale.map((scale, idx) => (
              <div key={idx} className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-all duration-200 cursor-pointer">
                <div className="relative">
                  <span
                    className="inline-block w-6 h-6 rounded-lg border-2 border-white shadow-md transition-transform duration-200 group-hover:scale-110"
                    style={{
                      background: scale.gradient || scale.color,
                    }}
                  ></span>
                  <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">{scale.label}</span>
              </div>
            ))}
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
                <span
                  className="inline-block w-6 h-6 rounded-lg border-2 border-gray-300 shadow-sm transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                  }}
                ></span>
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors">Belum ada data</span>
              </div>
            </div>

          </div>
        </div>
        </div>
      </div>
    </section>
  );
}