<template>
  <div class="max-w-4xl mx-auto mt-6 mb-8 bg-white/80 rounded-2xl shadow p-6 border border-[#B3E5FC]">
    <div class="text-xl font-bold text-[#1976D2] mb-2 text-center">Evaluasi Pascapelatihan Nasional - Alumni <span class="text-base font-normal">(Draf)</span></div>
    <div class="text-gray-700 text-base leading-relaxed mb-2">
      Sebagai bagian dari upaya peningkatan mutu pelatihan, Direktorat Penjaminan Mutu Pengembangan Kapasitas Lembaga Administrasi Negara menyelenggarakan Evaluasi Pascapelatihan Nasional untuk mengidentifikasi hasil pelatihan, khususnya pada level perilaku (behaviour) dan dampak yang ditimbulkan dari pelaksanaan pelatihan.
      <br><br>
      Formulir ini ditujukan bagi Alumni Pelatihan Tahun 2021-2024 pada:
      <ol class="list-decimal list-inside ml-4 my-2">
        <li>Pelatihan Kepemimpinan Nasional Tingkat I</li>
        <li>Pelatihan Kepemimpinan Nasional Tingkat II</li>
        <li>Pelatihan Kepemimpinan Administrator</li>
        <li>Pelatihan Kepemimpinan Pengawas</li>
        <li>Pelatihan Dasar CPNS</li>
      </ol>
      Kami mohon kesediaan Bapak/Ibu untuk mengisi formulir ini secara objektif. Masukan Anda sangat berharga dalam mendukung perbaikan berkelanjutan pelatihan ASN. Data dan informasi pribadi yang Bapak/Ibu sampaikan akan dijaga kerahasiaannya, digunakan hanya untuk keperluan evaluasi, dan tidak akan disebarluaskan tanpa izin.
      <br><br>
      <span class="font-semibold">Waktu pengisian membutuhkan 3 - 5 menit.</span>
      <br><span class="italic text-sm">Catatan: Jika Anda pernah mengikuti lebih dari satu pelatihan, silahkan gunakan informasi Pelatihan terakhir Anda</span>
    </div>
  </div>
  <form class="max-w-4xl mx-auto bg-gradient-to-br from-[#E3F2FD] to-[#F8FAFB] rounded-2xl shadow-2xl p-10 space-y-10 border border-[#B3E5FC]" @submit.prevent="submitForm">
    <h2 class="text-3xl font-extrabold text-[#1976D2] mb-2 text-center tracking-wide drop-shadow">Profil Responden</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Nama Lengkap</label></div>
      <div><input type="text" v-model="form.nama" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan nama lengkap" /></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">NIP/NRP/NIK</label></div>
      <div><input type="text" v-model="form.nip" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan NIP/NRP/NIK" /></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Jenis Instansi</label></div>
      <div>
        <select v-model="form.jenisInstansi" class="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
          <option value="" disabled>Pilih Jenis Instansi</option>
          <option v-for="item in jenisInstansiList" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Instansi</label></div>
      <div>
        <select v-model="form.instansi" class="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]" :disabled="!form.jenisInstansi">
          <option value="" disabled>Pilih Instansi</option>
          <option v-for="item in instansiList" :key="item.id" :value="item.agency_name">{{ item.agency_name }}</option>
        </select>
      </div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Domisili Instansi</label></div>
      <div><select v-model="form.domisili" class="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
        <option value="" disabled>Pilih Domisili</option>
        <option v-for="item in domisiliList" :key="item.id" :value="item.nama">{{ item.nama }}</option>
      </select></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Jabatan</label></div>
      <div><select v-model="form.jabatan" class="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
        <option value="" disabled>Pilih Jabatan</option>
        <option v-for="item in jabatanList" :key="item.id" :value="item.nama">{{ item.nama }}</option>
      </select></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Nama Pelatihan</label></div>
      <div><select v-model="form.pelatihan" class="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
        <option value="" disabled>Pilih Nama Pelatihan</option>
        <option v-for="item in pelatihanList" :key="item.id" :value="item.nama">{{ item.nama }}</option>
      </select></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Tahun Pelatihan</label></div>
      <div><select v-model="form.tahunPelatihan" class="w-full border border-[#90CAF9] rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#C2E7F6]">
        <option value="" disabled>Pilih Tahun Pelatihan</option>
        <option v-for="item in tahunPelatihanList" :key="item.id" :value="item.tahun">{{ item.tahun }}</option>
      </select></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Lembaga Penyelenggara Pelatihan</label></div>
      <div><input type="text" v-model="form.lembagaPenyelenggara" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan nama lembaga penyelenggara" /></div>

      <div class="flex items-center md:justify-end"><label class="font-semibold md:text-right w-full md:w-44 text-[#1976D2]">Nomor Handphone</label></div>
      <div><input type="tel" v-model="form.handphone" class="w-full border border-[#90CAF9] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2E7F6] bg-white shadow-sm transition" placeholder="Masukkan nomor handphone" /></div>
    </div>
    <div class="text-center pt-2">
      <button type="submit" class="bg-gradient-to-r from-[#2196F3] to-[#1976D2] text-white px-10 py-3 rounded-xl shadow-lg hover:from-[#1976D2] hover:to-[#2196F3] font-bold text-lg tracking-wide transition">Simpan</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '~/stores/profile'

const profileStore = useProfileStore()
const router = useRouter()

const jenisInstansiList = ref([])
const instansiList = ref([])
const domisiliList = ref([])
const pelatihanList = ref([])
const jabatanList = ref([])
const tahunPelatihanList = ref([])

const form = ref({
  nama: '',
  nip: '',
  instansi: '',
  jenisInstansi: '',
  domisili: '',
  jabatan: '',
  pelatihan: '',
  tahunPelatihan: '',
  lembagaPenyelenggara: '',
  handphone: '',
})

const submitForm = async () => {
  const payload = {
    namaAlumni: form.value.nama,
    nipNrpNik: form.value.nip,
    instansiKategoriId: form.value.jenisInstansi,
    instansiId: instansiList.value.find(i => i.agency_name === form.value.instansi)?.id || '',
    domisiliId: domisiliList.value.find(d => d.nama === form.value.domisili)?.id || '',
    jabatanId: jabatanList.value.find(j => j.nama === form.value.jabatan)?.id || '',
    pelatihanId: pelatihanList.value.find(p => p.nama === form.value.pelatihan)?.id || '',
    tahunPelatihanId: tahunPelatihanList.value.find(t => t.tahun === form.value.tahunPelatihan)?.id || '',
    lemdik: form.value.lembagaPenyelenggara,
    handphone: form.value.handphone,
  }
  try {
    const res = await fetch('/api/profile_alumni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const result = await res.json()
    if (result.status === 'success') {
      profileStore.setProfileData({
        id: result.data?.insertId || '',
        pelatihan_id: payload.pelatihanId,
      })
      // Emit event ke parent agar pindah tab
      emit('nextTab')
    } else {
      alert('Gagal menyimpan data: ' + (result.message || 'Unknown error'))
    }
  } catch (err) {
    alert('Terjadi error saat menyimpan data!')
  }
}

// Fetch instansi when jenisInstansi changes
watch(() => form.value.jenisInstansi, async (val) => {
  if (val) {
    try {
      const res = await fetch(`/api/instansi/${val}`)
      instansiList.value = await res.json()
    } catch (e) {
      instansiList.value = []
    }
    // Reset instansi selection when jenisInstansi changes
    form.value.instansi = ''
  } else {
    instansiList.value = []
    form.value.instansi = ''
  }
})

onMounted(async () => {
  const resJenis = await fetch('/api/jenis_instansi')
  jenisInstansiList.value = await resJenis.json()
  const resPelatihan = await fetch('/api/pelatihan')
  pelatihanList.value = await resPelatihan.json()
  const resProvinsi = await fetch('/api/provinsi')
  domisiliList.value = await resProvinsi.json()
  const resJabatan = await fetch('/api/jabatan')
  jabatanList.value = await resJabatan.json()
  const resTahun = await fetch('/api/tahun_pelatihan')
  tahunPelatihanList.value = await resTahun.json()
})
</script>
