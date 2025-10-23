"use client";
import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BarChart2, BookOpen, Users, Smile, Clock, Star, MessageCircle } from "lucide-react";
import { useNamaProfileStore } from "@/lib/store/namaprofile";
import { toast } from "sonner";

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
  const router = useRouter();
  const baseSlug = params.slug as string;
  const { nama, user, clearUser } = useNamaProfileStore();

  // Logout function
  const handleLogout = () => {
    clearUser();
    toast.success("Logout berhasil.");
    router.push("/login");
  };

  // Check authentication - redirect to login if not authenticated
  useEffect(() => {
    if (!nama) {
      router.push('/login');
    }
  }, [nama, router]);

  // Show loading or redirect if not authenticated
  if (!nama) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1976D2] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

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
        
        {/* User Info and Logout */}
        <div className="mt-auto pt-4 border-t border-[#E3F2FD]">
          <div className="mb-3 text-xs text-gray-600 text-center">
            <div>Logged in as: <span className="font-semibold text-[#1976D2]">{nama}</span></div>
            {user?.lemdikId && (
              <div className="mt-1">Lemdik ID: <span className="font-semibold text-green-600">{user.lemdikId}</span></div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors duration-200 text-sm"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}