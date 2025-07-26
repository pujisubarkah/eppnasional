"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useNamaProfileStore } from "@/lib/store/namaprofile";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import lanLogo from "/public/lanri_.png";
import { toast } from "sonner";


const images = [
  "/DSC_0216.JPG",
  "/DSC_0308.JPG",
  "/DSC_0352.JPG",
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { nama, setNama, clearNama } = useNamaProfileStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setNama(data.user.nama || null); // simpan nama ke zustand
        toast.success(`Login berhasil. Selamat datang, ${data.user.nama}!`);
        router.push("/admin");
      } else {
        alert("Login gagal. Periksa username dan password Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearNama();
    toast.success("Logout berhasil.");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Kiri: Form Login */}
      <div className="w-full md:w-1/4 flex items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#B3E5FC] flex flex-col gap-6 animate-fade-in"
        >
          <div className="flex flex-col items-center mb-2">
            <Image
              src={lanLogo}
              alt="Logo LAN"
              width={96}
              height={96}
              className="mb-2"
            />
            <h2 className="text-2xl font-bold text-[#1976D2] text-center mb-1 tracking-wide drop-shadow">
              Login
            </h2>
            <p className="text-xs text-gray-500 text-center mb-2">
              Evaluasi Pasca Pelatihan Nasional
              {nama && (
                <button
                  type="button"
                  className="mt-2 px-4 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              )}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1976D2] mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[#90CAF9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2] bg-[#F8FAFB] shadow-sm transition-all duration-200"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              placeholder="Masukkan username Anda"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1976D2] mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[#90CAF9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2] bg-[#F8FAFB] shadow-sm transition-all duration-200"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Masukkan password"
              disabled={loading}
            />
          </div>
          <div className="flex justify-between items-center text-xs mb-2">
            <a href="#" className="text-[#1976D2] hover:underline">Lupa password?</a>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white font-bold rounded-lg shadow-lg hover:scale-105 hover:from-[#1976D2] hover:to-[#2196F3] transition-all duration-200"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
      {/* Kanan: Gambar Carousel */}
      <div className="hidden md:flex w-3/4 items-center justify-center bg-gray-100 relative">
        <div className="absolute inset-0 w-full h-full">
          <Slider
            autoplay
            autoplaySpeed={3500}
            infinite
            arrows={false}
            dots={true}
            className="h-full"
          >
            {images.map((src, idx) => (
              <div key={idx} className="relative w-full h-[100vh]">
                <Image
                  src={src}
                  alt={`Carousel ${idx + 1}`}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}