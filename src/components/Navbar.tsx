'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LogIn, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useProfileStore } from "@/lib/store/profileStore";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { nama, clear } = useProfileStore(); // asumsi ada clear() untuk logout
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) =>
    pathname === path ? 'active-link' : 'inactive-link'

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clear(); // hapus data user dari zustand
    router.push("/login"); // redirect ke halaman login
  };

  return (
    <nav className="navbar flex items-center justify-between px-6 py-4 shadow-md border-b border-[#1565C0] bg-[#1565C0]/80 backdrop-blur z-40 relative">
      {/* Logo / Judul */}
      <div className="flex items-center gap-3">
        <Image
          src="/lanri.png"
          alt="Logo LAN RI"
          width={56}
          height={56}
          className="h-14 w-auto drop-shadow-sm"
          priority
        />
        <span className="text-2xl font-black text-white tracking-wide drop-shadow-sm">
          Evaluasi Pasca Pelatihan Nasional
        </span>
      </div>

      {/* Menu dan Login/User */}
      <div className="flex items-center gap-8 md:gap-12">
        <div className="flex gap-4 md:gap-8 items-center">
          <Link
            href="/"
            className={`nav-link text-white font-bold px-4 py-2 rounded transition-colors duration-150 ${isActive('/')} hover:bg-white hover:text-[#1565C0]`}
          >
            Beranda
          </Link>
          <Link
            href="/tentang"
            className={`nav-link text-white font-bold px-4 py-2 rounded transition-colors duration-150 ${isActive('/tentang')} hover:bg-white hover:text-[#1565C0]`}
          >
            Tentang Kami
          </Link>
          <Link
            href="/FaQ"
            className={`nav-link text-white font-bold px-4 py-2 rounded transition-colors duration-150 ${isActive('/faq')} hover:bg-white hover:text-[#1565C0]`}
          >
            FaQ
          </Link>
          <Link
            href="/kontak"
            className={`nav-link text-white font-bold px-4 py-2 rounded transition-colors duration-150 ${isActive('/kontak')} hover:bg-white hover:text-[#1565C0]`}
          >
            Kontak
          </Link>
        </div>
        <div className="pl-4">
          {!nama ? (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1976D2] to-[#2196F3] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1976D2] to-[#2196F3] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
              >
                <span>{nama}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-[#1976D2] hover:bg-[#E3F2FD] rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
