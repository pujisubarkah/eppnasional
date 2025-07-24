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

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 md:gap-12">
        <div className="flex gap-4 md:gap-8 items-center">
          <Link href="/" className={`nav-link text-white font-bold px-4 py-2 rounded transition-colors duration-150 ${isActive('/')} hover:bg-white hover:text-[#1565C0]`}>Beranda</Link>
          <Link href="/tentang" className={`nav-link text-white font-bold px-4 py-2 rounded transition-colors duration-150 ${isActive('/tentang')} hover:bg-white hover:text-[#1565C0]`}>Tentang Kami</Link>
          <Link href="/FaQ" className={`nav-link text-white font-bold px-4 py-2 rounded transition-colors duration-150 ${isActive('/faq')} hover:bg-white hover:text-[#1565C0]`}>FaQ</Link>
          <Link href="/kontak" className={`nav-link text-white font-bold px-4 py-2 rounded transition-colors duration-150 ${isActive('/kontak')} hover:bg-white hover:text-[#1565C0]`}>Kontak</Link>
        </div>
        <div className="pl-4">
          {!nama ? (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1976D2] to-[#2196F3] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200">
              <LogIn className="w-5 h-5" />
              Login
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen((v) => !v)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1976D2] to-[#2196F3] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200">
                <span>{nama}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border z-50">
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-[#1976D2] hover:bg-[#E3F2FD] rounded-b-lg">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hamburger Menu Mobile */}
      <div className="md:hidden flex items-center">
        <button className="p-2 rounded focus:outline-none transition-all duration-300 hover:bg-blue-200 shadow-md" onClick={() => setDropdownOpen((v) => !v)} aria-label="Buka menu">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>
        {dropdownOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden transition-opacity duration-300" onClick={() => setDropdownOpen(false)}>
            <nav className="absolute top-0 right-0 w-72 h-full bg-white/90 backdrop-blur-lg shadow-2xl flex flex-col gap-6 p-8 animate-slide-in" onClick={(e) => e.stopPropagation()} style={{ borderTopLeftRadius: '2rem', borderBottomLeftRadius: '2rem' }}>
              <Link href="/" className="font-bold text-[#1976D2] text-lg transition-colors duration-200 hover:text-blue-700" onClick={() => setDropdownOpen(false)}>Beranda</Link>
              <Link href="/tentang" className="font-bold text-[#1976D2] text-lg transition-colors duration-200 hover:text-blue-700" onClick={() => setDropdownOpen(false)}>Tentang Kami</Link>
              <Link href="/FaQ" className="font-bold text-[#1976D2] text-lg transition-colors duration-200 hover:text-blue-700" onClick={() => setDropdownOpen(false)}>FaQ</Link>
              <Link href="/kontak" className="font-bold text-[#1976D2] text-lg transition-colors duration-200 hover:text-blue-700" onClick={() => setDropdownOpen(false)}>Kontak</Link>
              {!nama ? (
                <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1976D2] to-[#2196F3] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200" onClick={() => setDropdownOpen(false)}>
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
              ) : (
                <button onClick={() => { handleLogout(); setDropdownOpen(false); }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#1976D2] to-[#2196F3] text-white font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </nav>
  )
}
