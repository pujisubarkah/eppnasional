<template>
  <footer class="footer-bg text-gray-800 mt-16 px-0 pt-12 pb-6">
    <div class="max-w-5xl mx-auto px-6 md:px-12">
      <div class="grid md:grid-cols-2 gap-10 bg-white/70 rounded-xl shadow-lg p-8">
        <!-- Kiri: Tentang -->
        <div>
          <h2 class="text-xl font-extrabold mb-2 text-[#2196F3] drop-shadow">EPP Nasional</h2>
          <p class="text-base leading-relaxed text-gray-700">
            Dikelola oleh Direktorat Penjaminan Mutu Pengembangan Kapasitas, Lembaga Administrasi Negara.<br />
            EPP Nasional adalah Evaluasi Pasca Pelatihan.
          </p>
        </div>

        <!-- Kanan: Kontak -->
        <div>
          <h2 class="text-xl font-extrabold mb-2 text-[#2196F3] drop-shadow">Informasi Lebih Lanjut</h2>
          <ul class="text-base space-y-3">
            <li class="flex items-start gap-2">
              <Users class="w-5 h-5 mt-0.5 text-blue-600" />
              <span>Layanan Sahabat Mutu</span>
            </li>
            <li class="flex items-start gap-2">
              <Phone class="w-5 h-5 mt-0.5 text-blue-600" />
              <a href="tel:+628563542025" class="hover:underline">+62 856-3542-025</a>
            </li>
            <li class="flex items-start gap-2">
              <Mail class="w-5 h-5 mt-0.5 text-blue-600" />
              <a href="mailto:dirpmpk@lan.go.id" class="hover:underline">dirpmpk@lan.go.id</a>
            </li>
            <li class="flex items-start gap-2">
              <MapPin class="w-5 h-5 mt-0.5 text-blue-600" />
              <span>Jalan Veteran No 10, Gambir, Jakarta Pusat</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- Copyright -->
      <div class="mt-8 text-center text-xs text-gray-600">
        &copy; {{ new Date().getFullYear() }} EPP Nasional. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Users, Phone, Mail, MapPin } from 'lucide-vue-next'
</script>

<style scoped>
.footer-bg {
  background: linear-gradient(90deg, #1976D2 0%, #2196F3 100%);
}
</style>
