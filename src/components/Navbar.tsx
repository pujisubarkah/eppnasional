'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { LogIn, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useNamaProfileStore } from "@/lib/store/namaprofile";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  // Gunakan zustand namaprofile
  const { nama, setNama, clearNama } = useNamaProfileStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) =>
    pathname === path ? 'active-link' : 'inactive-link'

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (dropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    clearNama(); // hapus nama user dari zustand
    router.push("/login"); // redirect ke halaman login
  };

  return (
    <nav className="navbar flex items-center justify-between px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-700 shadow-md backdrop-blur-sm filter brightness-105 contrast-125 border-b border-blue-500 z-50 fixed top-0 left-0 right-0">
      {/* Logo / Judul */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <Image
          src="/lanri.png"
          alt="Logo LAN RI"
          width={72}
          height={72}
          className="h-auto w-auto drop-shadow-md flex-shrink-0"
          priority
        />
        <span className="navbar-logo-text font-black text-white tracking-wide drop-shadow-md truncate text-base sm:text-lg md:text-xl lg:text-lg xl:text-xl">
          <span className="hidden sm:inline">Evaluasi Pasca Pelatihan Nasional</span>
          <span className="sm:hidden">EPP Nasional</span>
        </span>
      </div>

      {/* Desktop & Tablet Menu */}
      <div className="hidden lg:flex items-center gap-6 xl:gap-8">
        <div className="flex gap-3 xl:gap-6 items-center">
          <Link href="/" className={`nav-link text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 nav-item-hover ${isActive('/')} hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:scale-105`}>Beranda</Link>
          <Link href="/tentang" className={`nav-link text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 nav-item-hover ${isActive('/tentang')} hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:scale-105`}>Tentang</Link>
          <Link href="/FaQ" className={`nav-link text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 nav-item-hover ${isActive('/faq')} hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:scale-105`}>FaQ</Link>
          <Link href="/kontak" className={`nav-link text-white font-semibold px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 nav-item-hover ${isActive('/kontak')} hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-lg hover:scale-105`}>Kontak</Link>
        </div>
        <div className="pl-2 xl:pl-4">
          {!nama ? (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-effect text-white font-bold shadow-xl hover:bg-gradient-to-r hover:from-white hover:to-white hover:text-[#1565C0] hover:scale-105 transition-all duration-300 nav-item-hover">
              <LogIn className="w-4 h-4" />
              <span className="hidden xl:inline">Login</span>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen((v) => !v)} className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-effect text-white font-bold shadow-xl hover:bg-gradient-to-r hover:from-white hover:to-white hover:text-[#1565C0] hover:scale-105 transition-all duration-300 nav-item-hover">
                <span className="max-w-32 truncate">{nama}</span>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 glass-effect-strong rounded-xl shadow-2xl z-50 overflow-hidden animate-bounce-in">
                  <div className="p-2">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-[#1565C0] hover:bg-gradient-to-r hover:from-[#E3F2FD] hover:to-[#BBDEFB] rounded-lg transition-all duration-200 font-medium nav-item-hover">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Menu Button */}
      <div className="lg:hidden flex items-center">
        <button 
          className="p-2.5 rounded-xl glass-effect shadow-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50" 
          onClick={() => setDropdownOpen((v) => !v)} 
          aria-label={dropdownOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={dropdownOpen}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${dropdownOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
            <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${dropdownOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${dropdownOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
          </div>
        </button>
        
        {/* Mobile/Tablet Overlay Menu */}
        {dropdownOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in-backdrop" 
              onClick={() => setDropdownOpen(false)}
            />
            
            {/* Menu Panel */}
            <div className={`absolute top-0 right-0 h-full bg-white shadow-2xl animate-slide-in-right ${
              isMobile ? 'w-full' : 'w-72 sm:w-80'
            }`} style={{ zIndex: 60 }}>
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1565C0] to-[#1976D2] p-4 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/lanri.png"
                      alt="Logo LAN RI"
                      width={24}
                      height={24}
                      className="h-auto w-auto drop-shadow-md"
                    />
                    <span className="text-white font-bold text-base">Menu</span>
                  </div>
                  <button 
                    onClick={() => setDropdownOpen(false)}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1 overflow-y-auto bg-white" style={{ maxHeight: 'calc(100vh - 80px)' }}>
                <Link 
                  href="/" 
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-sm ${
                    pathname === '/' 
                      ? 'bg-[#1565C0] text-white shadow-md' 
                      : 'text-[#1565C0] hover:bg-[#F3F4F6]'
                  }`}
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${pathname === '/' ? 'bg-white' : 'bg-[#1565C0]'}`}></div>
                  Beranda
                </Link>
                <Link 
                  href="/tentang" 
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-sm ${
                    pathname === '/tentang' 
                      ? 'bg-[#1565C0] text-white shadow-md' 
                      : 'text-[#1565C0] hover:bg-[#F3F4F6]'
                  }`}
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${pathname === '/tentang' ? 'bg-white' : 'bg-[#1565C0]'}`}></div>
                  Tentang Kami
                </Link>
                <Link 
                  href="/FaQ" 
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-sm ${
                    pathname === '/FaQ' || pathname === '/faq' 
                      ? 'bg-[#1565C0] text-white shadow-md' 
                      : 'text-[#1565C0] hover:bg-[#F3F4F6]'
                  }`}
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${pathname === '/FaQ' || pathname === '/faq' ? 'bg-white' : 'bg-[#1565C0]'}`}></div>
                  FaQ
                </Link>
                <Link 
                  href="/kontak" 
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-sm ${
                    pathname === '/kontak' 
                      ? 'bg-[#1565C0] text-white shadow-md' 
                      : 'text-[#1565C0] hover:bg-[#F3F4F6]'
                  }`}
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${pathname === '/kontak' ? 'bg-white' : 'bg-[#1565C0]'}`}></div>
                  Kontak
                </Link>
                
                {/* Divider */}
                <div className="my-4 border-t border-gray-200"></div>
                
                {/* User Actions */}
                {!nama ? (
                  <Link 
                    href="/login" 
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1565C0] text-white font-medium shadow-md hover:bg-[#1976D2] hover:shadow-lg transition-all duration-200" 
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <div className="px-3 py-2 rounded-lg bg-[#F3F4F6] border border-gray-200">
                      <p className="text-[#6B7280] font-medium text-xs">Halo,</p>
                      <p className="text-[#1565C0] font-semibold text-sm truncate">{nama}</p>
                    </div>
                    <button 
                      onClick={() => { handleLogout(); setDropdownOpen(false); }} 
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-red-500 text-white font-medium shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
