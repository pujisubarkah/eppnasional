"use client";

import { Users, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 shadow-md backdrop-blur-sm filter brightness-105 contrast-125 border-t border-blue-500 text-gray-100 mt-16 px-0 pt-12 pb-6">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-10 bg-white/70 rounded-xl shadow-lg p-8">
          {/* Kiri: Tentang */}
          <div>
            <h2 className="text-xl font-extrabold mb-2 text-[#2196F3] drop-shadow">EPP Nasional</h2>
            <p className="text-base leading-relaxed text-gray-700">
              Dikelola oleh Direktorat Penjaminan Mutu Pengembangan Kapasitas, Lembaga Administrasi Negara.<br />
              EPP Nasional adalah Evaluasi Pasca Pelatihan.
            </p>
          </div>

          {/* Kanan: Kontak */}
          <div>
            <h2 className="text-xl font-extrabold mb-2 text-[#2196F3] drop-shadow">Informasi Lebih Lanjut</h2>
            <ul className="text-base space-y-3">
              <li className="flex items-start gap-2">
                <Users className="w-5 h-5 mt-0.5 text-blue-600" />
                <span>Layanan Sahabat Mutu</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-5 h-5 mt-0.5 text-blue-600" />
                <a href="tel:+628563542025" className="hover:underline">+62 856-3542-025</a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-5 h-5 mt-0.5 text-blue-600" />
                <a href="mailto:dirpmpk@lan.go.id" className="hover:underline">dirpmpk@lan.go.id</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 text-blue-600" />
                <span>Jalan Veteran No 10, Gambir, Jakarta Pusat</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} EPP Nasional. All rights reserved.
        </div>
      </div>
      <style jsx>{`
        .footer-bg {
          /* background: linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #1e40af 100%); */
        }
      `}</style>
    </footer>
  );
}
