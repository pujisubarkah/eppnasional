
<template>
  <div class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Kontribusi Pasca Pelatihan</h2>
    <div class="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
      <span class="font-bold">Petunjuk:</span> Pilih salah satu peran utama Anda dalam mendukung perwujudan Asta Cita setelah mengikuti pelatihan ini.
    </div>
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">1. {{ pertanyaanAstaCita?.text || 'Memuat pertanyaan...' }}</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="opt in pertanyaanAstaCita?.options || []" :key="opt.id" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="opt.option_text" v-model="selectedAstaCita" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ opt.option_text }}</span>
        </label>
      </div>
    </div>
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold text-[#1976D2] mb-4">2. {{ pertanyaanPrioritas?.text || 'Memuat pertanyaan...' }} <span class="text-[#2196F3]">(pilih 1)</span>:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="opt in pertanyaanPrioritas?.options || []" :key="opt.id" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="radio" :value="opt.option_text" v-model="selectedPrioritas" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ opt.option_text }}</span>
        </label>
      </div>
      <div v-if="selectedPrioritas === 'Yang lain:'" class="mt-2">
        <input type="text" v-model="prioritasLain" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Tuliskan bidang lain..." />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const pertanyaanAstaCita = ref(null)
const pertanyaanPrioritas = ref(null)
const selectedAstaCita = ref('')
const selectedPrioritas = ref('')
const prioritasLain = ref('')

onMounted(async () => {
  try {
    const [resAstaCita, resPrioritas] = await Promise.all([
      axios.get('/api/pertanyaan/14'),
      axios.get('/api/pertanyaan/15'),
    ])
    pertanyaanAstaCita.value = resAstaCita.data
    pertanyaanPrioritas.value = resPrioritas.data
  } catch (err) {
    // handle error, optionally show toast
  }
})
</script>
