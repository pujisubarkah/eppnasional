export default function KontakPage() {
  return (
    <section className="max-w-xl mx-auto py-16 px-4 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#2196F3] drop-shadow text-center">
        Butuh konsultasi lebih lanjut?
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Yuk hubungi <span className="font-semibold text-[#1976D2]">Layanan Sahabat Mutu</span>!<br />
        Kami akan dengan senang hati membantu Anda.
      </p>
      <a
        href="https://api.whatsapp.com/send/?phone=628563542025&text&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-lg shadow-lg font-bold text-xl transition mb-4"
      >
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16" fill="#25D366" />
          <path d="M23.47 19.37c-.32-.16-1.88-.93-2.17-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.89-1.79-2.21-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.53-.54-.71-.55-.18-.01-.39-.01-.6-.01-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.65 0 1.56 1.14 3.06 1.3 3.27.16.21 2.24 3.42 5.44 4.66.76.33 1.36.53 1.83.68.77.25 1.47.21 2.02.13.62-.09 1.88-.77 2.15-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z" fill="#fff" />
        </svg>
        Chat WhatsApp
      </a>
      <div className="text-gray-500 text-sm text-center">
        Layanan Sahabat Mutu: 0856-3542-025
      </div>
    </section>
  );
}