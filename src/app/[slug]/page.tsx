"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

// SVG Icon Components (copy dari kode kamu di atas)
const BookOpenIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0118 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const UserGroupIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

// HeartIcon SVG Component
const HeartIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.435 6.582a5.25 5.25 0 00-8.4-1.272L12 6.364l-1.035-1.054a5.25 5.25 0 00-8.4 1.272c-1.285 2.14-.634 4.91 1.293 6.637l7.142 6.453a1.5 1.5 0 002.1 0l7.142-6.453c1.927-1.727 2.578-4.497 1.293-6.637z" />
  </svg>
);

// ClockIcon SVG Component
const ClockIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

// StarIcon SVG Component
const StarIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 17.25l-5.197 3.102a.75.75 0 01-1.093-.79l.99-5.773-4.205-4.099a.75.75 0 01.416-1.279l5.8-.843 2.594-5.26a.75.75 0 011.346 0l2.594 5.26 5.8.843a.75.75 0 01.416 1.279l-4.205 4.099.99 5.773a.75.75 0 01-1.093.79L12 17.25z" />
  </svg>
);

// ChatBubbleLeftRightIcon SVG Component
const ChatBubbleLeftRightIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.5h6m-6 3.5h4.5M2.25 6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5A2.25 2.25 0 0119.5 19.5H6.621a1.5 1.5 0 00-1.06.44l-2.56 2.56a.75.75 0 01-1.28-.53V6.75z" />
  </svg>
);

// contoh menu (bisa ambil semua dari kode kamu)
const menuItems = [
  {
    title: "Materi",
    description: "Perbandingan relevansi materi pelatihan terhadap kinerja peserta",
    href: "materi",
    icon: BookOpenIcon,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Dukungan Lingkungan",
    description: "Distribusi dukungan atasan dan rekan kerja setelah pelatihan",
    href: "dukungan-lingkungan",
    icon: UserGroupIcon,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Sikap Perilaku",
    description: "Perubahan sikap, perilaku, dan kinerja individu pasca pelatihan",
    href: "sikap-perilaku",
    icon: HeartIcon,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    title: "Kesesuaian Waktu & Manfaat",
    description: "Persepsi alumni tentang kesepadanan waktu dan manfaat pelatihan",
    href: "kesesuaian-waktu",
    icon: ClockIcon,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    title: "Peer Review",
    description: "Evaluasi dan penilaian dari rekan kerja terhadap peserta pelatihan",
    href: "peer-review",
    icon: StarIcon,
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    title: "Saran dan Masukan",
    description: "Analisis data tidak terstruktur dari saran dan masukan peserta",
    href: "saran-masukan",
    icon: ChatBubbleLeftRightIcon,
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
    iconColor: "text-pink-600"
  }
];


export default function DashboardPage() {
  const { slug } = useParams(); // ambil param dinamis

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1976D2] mb-4">
            Dashboard {slug}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Panel administrasi untuk {slug}. Pilih menu di bawah untuk melihat detail.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link key={index} href={`/${slug}/${item.href}`}>
                <div className={`
                  ${item.color} 
                  rounded-xl border-2 p-6 
                  transition-all duration-300 ease-in-out 
                  hover:shadow-lg hover:scale-105 
                  cursor-pointer group
                  min-h-[200px] flex flex-col justify-between
                `}>
                  <div>
                    <div className="flex items-center mb-4">
                      <IconComponent className={`w-8 h-8 ${item.iconColor} mr-3`} />
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-700">
                    <span>Lihat Detail</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
