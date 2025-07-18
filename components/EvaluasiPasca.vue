<template>
  <div class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]">
    <div class="mb-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
      <span>Pinia Profile: </span>
      <span>ID: {{ profileStore.id }}</span> |
      <span>Pelatihan ID: {{ profileStore.pelatihan_id }}</span>
    </div>
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Evaluasi Materi Pelatihan</h2>
    <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-[#1976D2] text-base font-medium">
      <span>
        <span class="font-bold">Petunjuk:</span>
        Pada bagian ini, kami akan menyajikan daftar materi yang diajarkan pada
        <span class="font-bold">{{ namaPelatihan }}</span>.
        Silahkan pilih 3 materi yang menurut Anda paling relevan dan paling tidak relevan dalam mendukung kinerja.
      </span>
    </div>
    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <h3 class="font-bold text-lg mb-4 text-[#1976D2]">Daftar Materi Pelatihan</h3>
      <table class="w-full border rounded shadow text-sm bg-white">
        <thead>
          <tr class="bg-[#C2E7F6] text-[#1976D2]">
            <th class="py-2 px-3 text-left">Agenda</th>
            <th class="py-2 px-3 text-left">Sub Agenda</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="agenda in materiList" :key="agenda.id">
            <tr v-for="(sub, subIdx) in agenda.sub_agendas" :key="sub.id">
              <td class="py-1 px-3 font-semibold align-top">
                <span v-if="subIdx === 0">{{ agenda.name }}</span>
              </td>
              <td class="py-1 px-3">{{ String.fromCharCode(97 + subIdx) }}) {{ sub.name }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold mb-4 text-[#1976D2]">
        {{ pertanyaanRelevan?.text || 'Memuat pertanyaan...' }}
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="opt in pertanyaanRelevan?.options || []" :key="opt.id" class="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2 shadow-sm hover:bg-blue-100 transition cursor-pointer">
          <input type="checkbox" :value="opt.option_text" v-model="relevan" :disabled="relevan.length >= 3 && !relevan.includes(opt.option_text)" class="accent-[#2196F3] scale-125" />
          <span class="text-[#1976D2] font-medium">{{ opt.option_text }}</span>
        </label>
      </div>
      <div v-if="showToastRelevan" class="text-red-500 text-xs mt-2">Pilih tepat 3 materi relevan!</div>
    </div>

    <div class="bg-white/90 rounded-xl border border-[#B3E5FC] shadow p-6 mb-6">
      <label class="block font-semibold mb-4 text-[#1976D2]">
        {{ pertanyaanTidakRelevan?.text || 'Memuat pertanyaan...' }}
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label v-for="opt in pertanyaanTidakRelevan?.options || []" :key="opt.id" class="flex items-center gap-3 bg-red-50 rounded-lg px-3 py-2 shadow-sm hover:bg-red-100 transition cursor-pointer">
          <input type="checkbox" :value="opt.option_text" v-model="tidakRelevan" :disabled="tidakRelevan.length >= 3 && !tidakRelevan.includes(opt.option_text)" class="accent-red-400 scale-125" />
          <span class="text-[#D32F2F] font-medium">{{ opt.option_text }}</span>
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
const profileStore = useProfileStore()
const namaPelatihan = ref('Pelatihan Kepemimpinan Nasional (PKN) Tingkat I')
const materiList = ref([])
const optionsWithSubAgenda = ref([])
const relevan = ref([])
const tidakRelevan = ref([])
const showToastRelevan = ref(false)
const showToastTidakRelevan = ref(false)

async function fetchQuestionData(pelatihanId) {
  try {
    // Fetch agenda, sub agenda, dan opsi pertanyaan dari endpoint baru
    const res = await axios.get(`/api/question/${pelatihanId}`)
    materiList.value = res.data?.result || []
    optionsWithSubAgenda.value = res.data?.optionsWithSubAgenda || []
    // Fetch nama pelatihan
    const resPelatihan = await axios.get(`/api/pelatihan/${pelatihanId}`)
    namaPelatihan.value = resPelatihan.data?.nama || 'Pelatihan Kepemimpinan Nasional (PKN) Tingkat I'
  } catch (err) {
    materiList.value = []
    optionsWithSubAgenda.value = []
    namaPelatihan.value = 'Pelatihan Kepemimpinan Nasional (PKN) Tingkat I'
  }
}

watch(() => profileStore.pelatihan_id, (id) => {
  if (id) fetchQuestionData(id)
})

onMounted(async () => {
  if (profileStore.pelatihan_id) {
    await fetchQuestionData(profileStore.pelatihan_id)
  }
})

const pertanyaanRelevan = computed(() => ({
  text: 'Pilih 3 materi paling relevan dalam mendukung kinerja Anda',
  options: optionsWithSubAgenda.value
}))
const pertanyaanTidakRelevan = computed(() => ({
  text: 'Pilih 3 materi paling tidak relevan dalam mendukung kinerja Anda',
  options: optionsWithSubAgenda.value
}))

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

<style scoped>
/* Add any component-specific styles here */
</style>
