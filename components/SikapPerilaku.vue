<template>
  <div class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Sikap & Perilaku Pasca Pelatihan</h2>
    <div class="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
      <span class="font-bold">Petunjuk:</span> Silahkan centang pada poin yang sesuai dengan pernyataan berikut.
    </div>
    <!-- 1. Pilihan perubahan sikap perilaku (radio) -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">1. {{ pertanyaanSikap?.text || 'Memuat pertanyaan...' }}</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="opt in pertanyaanSikap?.options || []" :key="opt.id" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="opt.option_text" v-model="sikap" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ opt.option_text }}</span>
        </label>
      </div>
    </div>

    <!-- 2. Pilih 3 dari 7+ opsi -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">2. {{ pertanyaanKinerja?.text || 'Memuat pertanyaan...' }} <span class="text-[#2196F3]">(pilih 3)</span>:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="opt in pertanyaanKinerja?.options || []" :key="opt.id" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="checkbox" :value="opt.option_text" v-model="kinerja" :disabled="kinerja.length >= 3 && !kinerja.includes(opt.option_text)" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ opt.option_text }}</span>
        </label>
      </div>
      <div v-if="kinerja.length > 3" class="text-red-500 text-xs mt-2">Maksimal 3 pilihan.</div>
    </div>

    <!-- 3. Pilih salah satu nilai ekonomi -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">3. {{ pertanyaanEkonomi?.text || 'Memuat pertanyaan...' }}</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="opt in pertanyaanEkonomi?.options || []" :key="opt.id" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="opt.option_text" v-model="ekonomi" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ opt.option_text }}</span>
        </label>
      </div>
    </div>

    <!-- 4. Dampak keberlanjutan, pilih max 3, ada input lain -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">4. {{ pertanyaanDampak?.text || 'Memuat pertanyaan...' }} <span class="text-[#2196F3]">(pilih maksimal 3)</span>:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="opt in pertanyaanDampak?.options || []" :key="opt.id" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="checkbox" :value="opt.option_text" v-model="dampak" :disabled="dampak.length >= 3 && !dampak.includes(opt.option_text) && opt.option_text !== 'Yang lain:'" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ opt.option_text }}</span>
        </label>
      </div>
      <div v-if="dampak.includes('Yang lain:')" class="mt-2">
        <input type="text" v-model="dampakLain" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Tuliskan dampak lain..." />
      </div>
      <div v-if="dampak.length > 3" class="text-red-500 text-xs mt-2">Maksimal 3 pilihan.</div>
    </div>

    <!-- 5. Tema RB Tematik, radio -->
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">5. {{ pertanyaanTema?.text || 'Memuat pertanyaan...' }}</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="opt in pertanyaanTema?.options || []" :key="opt.id" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="opt.option_text" v-model="tema" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ opt.option_text }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>

import { onMounted, ref } from 'vue'
import axios from 'axios'

const pertanyaanSikap = ref(null)
const pertanyaanKinerja = ref(null)
const pertanyaanEkonomi = ref(null)
const pertanyaanDampak = ref(null)
const pertanyaanTema = ref(null)

const sikap = ref('')
const kinerja = ref([])
const ekonomi = ref('')
const dampak = ref([])
const dampakLain = ref('')
const tema = ref('')

onMounted(async () => {
  try {
    const [resSikap, resKinerja, resEkonomi, resDampak, resTema] = await Promise.all([
      axios.get('/api/pertanyaan/8'),
      axios.get('/api/pertanyaan/11'),
      axios.get('/api/pertanyaan/9'),
      axios.get('/api/pertanyaan/12'),
      axios.get('/api/pertanyaan/10'),
    ])
    pertanyaanSikap.value = resSikap.data
    pertanyaanKinerja.value = resKinerja.data
    pertanyaanEkonomi.value = resEkonomi.data
    pertanyaanDampak.value = resDampak.data
    pertanyaanTema.value = resTema.data
  } catch (err) {
    // handle error, optionally show toast
  }
})
</script>
