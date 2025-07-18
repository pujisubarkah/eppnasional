<template>
  <div class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Dukungan Lingkungan Kerja</h2>
    <div class="mb-8 p-5 bg-blue-100/70 border-l-8 border-[#2196F3] rounded-lg text-[#1976D2] text-base shadow">
      <span class="font-bold">Petunjuk:</span> Beri penilaian pada pernyataan berikut dengan menggunakan skala <b>1</b> hingga <b>4</b> di mana <b>1</b> berarti <b>Sangat Tidak Setuju</b> dan <b>4</b> berarti <b>Sangat Setuju</b>.
    </div>
    <div class="space-y-8">
      <div v-for="(q, i) in pertanyaanList" :key="q.id" class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 flex flex-col gap-3 hover:shadow-lg transition">
        <label class="block font-semibold text-[#1976D2] text-base mb-2">{{ i+1 }}. {{ q.text }}</label>
        <div class="flex justify-between gap-4 mt-2">
          <label v-for="opt in q.options" :key="opt.id" class="flex flex-col items-center text-xs font-medium cursor-pointer">
            <input type="radio" :name="'dukungan-'+i" :value="opt.option_text" v-model="answers[i]" class="accent-[#2196F3] scale-125 mb-1" />
            <span class="text-[#1976D2] font-bold">{{ opt.option_text.split(' ')[0] }}</span>
          </label>
        </div>
        <div class="flex justify-between gap-2 mt-1 text-xs text-gray-500">
          <span v-for="opt in q.options" :key="opt.id">{{ opt.option_text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const pertanyaanList = ref([])
const answers = ref([])

onMounted(async () => {
  try {
    const ids = [3, 4, 5, 6, 7]
    const responses = await Promise.all(ids.map(id => axios.get(`/api/pertanyaan/${id}`)))
    pertanyaanList.value = responses.map(res => res.data)
    answers.value = Array(pertanyaanList.value.length).fill(null)
  } catch (err) {
    // handle error, optionally show toast
  }
})
</script>
