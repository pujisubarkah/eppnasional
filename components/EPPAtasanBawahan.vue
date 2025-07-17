<template>
  <form class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Evaluasi Alumni oleh Atasan/Rekan/Bawahan</h2>
    <div class="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
      <span class="font-bold">Petunjuk:</span> Beri penilaian pada pernyataan berikut dengan menggunakan skala <b>1 hingga 4</b>, di mana <b>1</b> berarti <b>Sangat Tidak Setuju</b> dan <b>4</b> berarti <b>Sangat Setuju</b>.
    </div>
    <div class="space-y-8">
      <div v-for="(q, idx) in likertQuestions" :key="idx" class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 flex flex-col gap-3 hover:shadow-lg transition">
        <label class="block font-semibold text-[#1976D2] text-base mb-2">{{ idx + 1 }}. {{ q }}</label>
        <div class="flex justify-between gap-4 mt-2">
          <label v-for="n in 4" :key="n" class="flex flex-col items-center text-xs font-medium">
            <input type="radio" :name="'likert-' + idx" :value="n" v-model="likertAnswers[idx]" required class="accent-[#2196F3] scale-125 mb-1" />
            <span class="text-[#1976D2] font-bold">{{ n }}</span>
          </label>
        </div>
        <div class="flex justify-between gap-2 mt-1 text-xs text-gray-500">
          <span>1 = Sangat Tidak Setuju</span>
          <span>2 = Tidak Setuju</span>
          <span>3 = Setuju</span>
          <span>4 = Sangat Setuju</span>
        </div>
      </div>
    </div>
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 flex flex-col gap-3 hover:shadow-lg transition">
      <label class="block font-semibold text-[#1976D2] mb-2">Saran/Masukan/Harapan untuk perbaikan pelatihan ke depan <span class="text-red-500">*</span></label>
      <textarea v-model="saran" required class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" rows="3" placeholder="Tulis saran, masukan, atau harapan Anda..."></textarea>
    </div>
    <div class="text-center pt-2">
      <button type="submit" class="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition">Simpan</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const likertQuestions = [
  'Terdapat peningkatan dalam sikap dan perilaku kerja Alumni setelah mengikuti pelatihan',
  'Terdapat peningkatan kompetensi alumni yang mendukung kinerjanya',
  'Penerapan hasil pelatihan Alumni mendorong terjadinya perubahan dan perbaikan dalam proses kerja organisasi',
  'Waktu yang dihabiskan Alumni untuk mengikuti pelatihan sepadan dengan manfaat atau perkembangan yang diperoleh setelah mengikuti pelatihan',
]
const likertAnswers = ref([ '', '', '', '' ])
const saran = ref('')
</script>

<style scoped>
</style>
