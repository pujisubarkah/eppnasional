<template>
  <div class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Evaluasi Materi Pelatihan</h2>
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <h3 class="font-bold text-lg mb-4 text-[#1976D2]">Daftar Materi Pelatihan</h3>
      <table class="w-full border rounded shadow text-sm bg-white">
        <thead>
          <tr class="bg-[#C2E7F6] text-[#1976D2]">
            <th class="py-2 px-3 text-left">No</th>
            <th class="py-2 px-3 text-left">Materi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(materi, idx) in materiList" :key="materi">
            <td class="py-1 px-3">{{ idx + 1 }}</td>
            <td class="py-1 px-3">{{ materi }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold mb-4 text-[#1976D2]">Silakan pilih <span class="text-[#2196F3]">3 materi yang paling relevan</span> dalam mendukung kinerja Anda:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="materi in materiList" :key="materi" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="checkbox" :value="materi" v-model="relevan" :disabled="relevan.length >= 3 && !relevan.includes(materi)" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ materi }}</span>
        </label>
      </div>
      <div v-if="showToastRelevan" class="text-red-500 text-xs mt-2">Pilih tepat 3 materi relevan!</div>
    </div>

    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold mb-4 text-[#1976D2]">Silakan pilih <span class="text-[#2196F3]">3 materi yang paling tidak relevan</span> dalam mendukung kinerja Anda:</label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="materi in materiList" :key="materi" class="flex items-center gap-3 bg-red-50 rounded-lg px-3 py-2 shadow-sm hover:bg-red-100 transition cursor-pointer">
          <input type="checkbox" :value="materi" v-model="tidakRelevan" :disabled="tidakRelevan.length >= 3 && !tidakRelevan.includes(materi)" class="accent-red-400 scale-125" />
          <span class="text-[#D32F2F] font-medium">{{ materi }}</span>
        </label>
      </div>
      <div v-if="showToastTidakRelevan" class="text-red-500 text-xs mt-2">Pilih tepat 3 materi tidak relevan!</div>
    </div>
    <div class="pt-4 text-center">
      <button @click.prevent="submit" class="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition">Simpan Pilihan</button>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const materiList = [
  'Pengembangan Kepemimpinan Kolaboratif',
  'Etika dan Integritas',
  'Kerangka Manajemen Kebijakan Publik',
  'Komunikasi dan Advokasi Kebijakan',
  'Isu Strategis Kebijakan',
  'Berpikir Holistik',
  'Kepemimpinan Koloboratif',
  'Transformasi Digital',
  'Benchmarking Kebijakan',
  'Policy Brief',
  'Proyek Perubahan',
]
const relevan = ref([])
const tidakRelevan = ref([])
const showToastRelevan = ref(false)
const showToastTidakRelevan = ref(false)

function submit() {
  showToastRelevan.value = relevan.value.length !== 3
  showToastTidakRelevan.value = tidakRelevan.value.length !== 3
  if (relevan.value.length !== 3) {
    toast.error('Pilih tepat 3 materi relevan!')
    return
  }
  if (tidakRelevan.value.length !== 3) {
    toast.error('Pilih tepat 3 materi tidak relevan!')
    return
  }
  toast.success('Pilihan berhasil disimpan!')
}
</script>
