"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const chartData = [
    {
        pertanyaan: "Atasan memberikan respon positif atas penerapan pengetahuan dan keterampilan baru yang diperoleh dari hasil Pelatihan",
        "Sangat Tidak Setuju": 2,
        "Tidak Setuju": 5,
        "Setuju": 15,
        "Sangat Setuju": 28,
    },
    {
        pertanyaan: "Atasan memberi dukungan dalam keberlanjutan Proyek Perubahan",
        "Sangat Tidak Setuju": 1,
        "Tidak Setuju": 4,
        "Setuju": 18,
        "Sangat Setuju": 27,
    },
    {
        pertanyaan: "Pelatihan ini meningkatkan kepercayaan atasan kepada saya untuk menangani tugas yang lebih menantang",
        "Sangat Tidak Setuju": 3,
        "Tidak Setuju": 6,
        "Setuju": 14,
        "Sangat Setuju": 25,
    },
    {
        pertanyaan: "Atasan memberikan penilaian positif terhadap perubahan perilaku setelah pelatihan",
        "Sangat Tidak Setuju": 2,
        "Tidak Setuju": 3,
        "Setuju": 17,
        "Sangat Setuju": 26,
    },
    {
        pertanyaan: "Rekan kerja memberikan penilaian positif terhadap perubahan perilaku setelah pelatihan",
        "Sangat Tidak Setuju": 1,
        "Tidak Setuju": 2,
        "Setuju": 19,
        "Sangat Setuju": 29,
    },
];

// Hitung persentase dinamis
function getSummaryStats(data: typeof chartData) {
    const totalPertanyaan = data.length;
    let totalSTS = 0, totalTS = 0, totalS = 0, totalSS = 0;

    data.forEach((d) => {
        totalSTS += d["Sangat Tidak Setuju"] ?? 0;
        totalTS += d["Tidak Setuju"] ?? 0;
        totalS += d["Setuju"] ?? 0;
        totalSS += d["Sangat Setuju"] ?? 0;
    });

    const totalJawaban = totalSTS + totalTS + totalS + totalSS;

    return {
        totalPertanyaan,
        totalJawaban,
        totalSTS,
        totalTS,
        totalS,
        totalSS,
        persenSTS: totalJawaban ? ((totalSTS / totalJawaban) * 100).toFixed(1) : "0",
        persenTS: totalJawaban ? ((totalTS / totalJawaban) * 100).toFixed(1) : "0",
        persenS: totalJawaban ? ((totalS / totalJawaban) * 100).toFixed(1) : "0",
        persenSS: totalJawaban ? ((totalSS / totalJawaban) * 100).toFixed(1) : "0",
    };
}

export default function DukunganLingkunganPage() {
    const stats = getSummaryStats(chartData);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-[#1976D2]">Dukungan Lingkungan</h1>
            <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD] mb-8">
                <p>
                    Grafik di bawah ini menunjukkan distribusi jawaban responden untuk setiap pertanyaan dukungan lingkungan
                    kerja.
                </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border border-[#E3F2FD]">
                <h2 className="text-lg font-semibold mb-4 text-[#1976D2]">Distribusi Jawaban Dukungan Lingkungan</h2>
                <ResponsiveContainer width="100%" height={450}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 16, right: 32, left: 0, bottom: 8 }}
                    >
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis
                            type="category"
                            dataKey="pertanyaan"
                            tick={{ fontSize: 13 }}
                            width={320}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Sangat Tidak Setuju" stackId="a" fill="#EF9A9A" />
                        <Bar dataKey="Tidak Setuju" stackId="a" fill="#FFF59D" />
                        <Bar dataKey="Setuju" stackId="a" fill="#90CAF9" />
                        <Bar dataKey="Sangat Setuju" stackId="a" fill="#1976D2" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/* Simpulan */}
            <div className="bg-blue-50 border-l-4 border-blue-400 mt-8 p-6 rounded-xl shadow text-[#1976D2]">
                <h2 className="text-lg font-semibold mb-4">Simpulan</h2>
                <p className="mb-2">
                    Berdasarkan data distribusi jawaban, mayoritas responden menunjukkan sikap positif terhadap dukungan lingkungan kerja setelah pelatihan. Hal ini terlihat dari persentase jawaban:
                </p>
                <ul className="mb-2 ml-6 list-disc">
                    <li>
                        <span className="font-semibold">Sangat Setuju:</span> {stats.persenSS}% ({stats.totalSS} jawaban)
                    </li>
                    <li>
                        <span className="font-semibold">Setuju:</span> {stats.persenS}% ({stats.totalS} jawaban)
                    </li>
                    <li>
                        <span className="font-semibold">Tidak Setuju:</span> {stats.persenTS}% ({stats.totalTS} jawaban)
                    </li>
                    <li>
                        <span className="font-semibold">Sangat Tidak Setuju:</span> {stats.persenSTS}% ({stats.totalSTS} jawaban)
                    </li>
                </ul>
                <p>
                    Dukungan tersebut meliputi respon positif terhadap penerapan pengetahuan dan keterampilan baru, keberlanjutan proyek perubahan, peningkatan kepercayaan diri dalam menangani tugas yang lebih menantang, serta penilaian positif terhadap perubahan perilaku setelah pelatihan. Dengan demikian, dukungan sosial dari atasan dan rekan kerja dinilai sangat berarti dan berdampak signifikan terhadap perkembangan profesional alumni di tempat kerja.
                </p>
            </div>
        </div>
    );
}