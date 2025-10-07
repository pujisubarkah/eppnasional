"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { BarChart2, BookOpen, Users, Smile, Clock, Star, MessageCircle } from "lucide-react";

const menuItems = [
  { slug: "", label: "Ringkasan", icon: <BarChart2 size={18} /> },
  { slug: "materi", label: "Materi", icon: <BookOpen size={18} /> },
  { slug: "dukungan-lingkungan", label: "Dukungan Lingkungan", icon: <Users size={18} /> },
  { slug: "sikap-perilaku", label: "Sikap Perilaku", icon: <Smile size={18} /> },
  { slug: "kesesuaian-waktu", label: "Kesesuaian Waktu dan Manfaat", icon: <Clock size={18} /> },
  { slug: "saran-masukan", label: "Saran dan Masukan", icon: <MessageCircle size={18} /> },
  { slug: "peer-review", label: "Peer Review", icon: <Star size={18} /> },
  { slug: "laporan", label: "Laporan", icon: <BookOpen size={18} /> },
];

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useParams();
  const baseSlug = params.slug as string;
  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">
      <aside className="w-60 bg-white border-r border-[#E3F2FD] flex flex-col py-8 px-4 shadow-lg">
        <div className="mb-8 text-2xl font-bold text-[#1976D2] text-center tracking-wide">
          {(baseSlug && baseSlug !== '[slug]') 
            ? baseSlug.charAt(0).toUpperCase() + baseSlug.slice(1) + ' Panel'
            : 'Dashboard Panel'
          }
        </div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            // Pastikan baseSlug adalah string yang valid, bukan [slug]
            const validSlug = baseSlug && baseSlug !== '[slug]' ? baseSlug : '';
            const href = item.slug === "" 
              ? `/${validSlug}` 
              : `/${validSlug}/${item.slug}`;
            const isActive = pathname === href;
            
            // Jangan render jika slug tidak valid
            if (!validSlug) return null;
            
            return (
              <Link
                key={item.slug || "home"}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition ${
                  isActive
                    ? "bg-[#E3F2FD] text-[#1976D2]"
                    : "text-gray-600 hover:bg-[#F1F8FF]"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}