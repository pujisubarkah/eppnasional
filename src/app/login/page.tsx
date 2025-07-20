"use client";

import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Login berhasil (dummy)");
  };

  const images = [
    "/DSC_0216.JPG",
    "/DSC_0308.JPG",
    "/DSC_0352.JPG",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 relative">
      {/* Carousel sebagai background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Slider {...settings}>
          {images.map((src, idx) => (
            <div key={idx} className="w-full h-screen flex justify-center items-center">
              <Image
                src={src}
                alt={`Gambar ${idx + 1}`}
                fill
                className="object-cover brightness-75"
                priority={idx === 0}
              />
            </div>
          ))}
        </Slider>
        {/* Overlay gelap agar form lebih jelas */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      {/* Form Login di tengah */}
      <div className="relative z-10 flex items-center justify-center w-full h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white/90 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#B3E5FC] flex flex-col gap-6"
        >
          <h2 className="text-2xl font-bold text-[#1976D2] text-center mb-2">
            Login
          </h2>
          <div>
            <label className="block text-sm font-semibold text-[#1976D2] mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1976D2] mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976D2]"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white font-bold rounded-lg shadow hover:scale-105 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}