"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, BookOpen, Users, Smile, Clock, Star, MessageCircle } from "lucide-react";

const menu = [
  { href: "/admin", label: "Ringkasan", icon: <BarChart2 size={18} /> },
  { href: "/admin/materi", label: "Materi", icon: <BookOpen size={18} /> },
  { href: "/admin/dukungan-lingkungan", label: "Dukungan Lingkungan", icon: <Users size={18} /> },
  { href: "/admin/sikap-perilaku", label: "Sikap Perilaku", icon: <Smile size={18} /> },
  { href: "/admin/kesesuaian-waktu", label: "Kesesuaian Waktu dan Manfaat", icon: <Clock size={18} /> },
  { href: "/admin/saran-masukan", label: "Saran dan Masukan", icon: <MessageCircle size={18} /> },
  { href: "/admin/peer-review", label: "peer reviwe", icon: <Star size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">
      <aside className="w-60 bg-white border-r border-[#E3F2FD] flex flex-col py-8 px-4 shadow-lg">
        <div className="mb-8 text-2xl font-bold text-[#1976D2] text-center tracking-wide">
          Admin Panel
        </div>
        <nav className="flex flex-col gap-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition ${
                pathname === item.href
                  ? "bg-[#E3F2FD] text-[#1976D2]"
                  : "text-gray-600 hover:bg-[#F1F8FF]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}