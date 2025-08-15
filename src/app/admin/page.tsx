"use client";

import Link from "next/link";

// SVG Icon Components
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

const HeartIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const ClockIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const ChatBubbleLeftRightIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
  </svg>
);

const EyeIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.639 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.639 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const menuItems = [
  {
    title: "Materi",
    description: "Perbandingan relevansi materi pelatihan terhadap kinerja peserta",
    href: "/admin/materi",
    icon: BookOpenIcon,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Dukungan Lingkungan",
    description: "Distribusi dukungan atasan dan rekan kerja setelah pelatihan",
    href: "/admin/dukungan-lingkungan",
    icon: UserGroupIcon,
    color: "bg-green-50 border-green-200 hover:bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Sikap Perilaku",
    description: "Perubahan sikap, perilaku, dan kinerja individu pasca pelatihan",
    href: "/admin/sikap-perilaku",
    icon: HeartIcon,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    title: "Kesesuaian Waktu & Manfaat",
    description: "Persepsi alumni tentang kesepadanan waktu dan manfaat pelatihan",
    href: "/admin/kesesuaian-waktu",
    icon: ClockIcon,
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    title: "Peer Review",
    description: "Evaluasi dan penilaian dari rekan kerja terhadap peserta pelatihan",
    href: "/admin/peer-review",
    icon: StarIcon,
    color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    iconColor: "text-yellow-600"
  },
  {
    title: "Saran dan Masukan",
    description: "Analisis data tidak terstruktur dari saran dan masukan peserta",
    href: "/admin/saran-masukan",
    icon: ChatBubbleLeftRightIcon,
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
    iconColor: "text-pink-600"
  }
];

export default function AdminRingkasanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1976D2] mb-4">
            Dashboard Admin
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Panel administrasi untuk mengelola dan menganalisis data evaluasi pasca pelatihan. 
            Pilih menu di bawah untuk melihat detail data dan visualisasi masing-masing aspek.
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link key={index} href={item.href}>
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
                    <EyeIcon className="w-4 h-4 mr-1" />
                    <span>Lihat Detail</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpenIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Total Menu</h4>
                <p className="text-2xl font-bold text-[#1976D2]">{menuItems.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Aktif</h4>
                <p className="text-2xl font-bold text-green-600">{menuItems.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <StarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Kategori</h4>
                <p className="text-2xl font-bold text-purple-600">6</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClockIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Status</h4>
                <p className="text-2xl font-bold text-orange-600">Online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl shadow p-8 border border-[#E3F2FD]">
          <h2 className="text-2xl font-semibold text-[#1976D2] mb-4">
            Tentang Dashboard Admin
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Dashboard ini menyediakan akses komprehensif untuk mengelola dan menganalisis 
            seluruh aspek evaluasi pasca pelatihan. Setiap menu telah dirancang untuk 
            memberikan insight mendalam mengenai efektivitas program pelatihan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Fitur Utama:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Visualisasi data interaktif</li>
                <li>• Filter berdasarkan pelatihan</li>
                <li>• Analisis sentimen otomatis</li>
                <li>• Export data dalam berbagai format</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Keunggulan:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time data processing</li>
                <li>• Responsive design</li>
                <li>• User-friendly interface</li>
                <li>• Comprehensive reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}