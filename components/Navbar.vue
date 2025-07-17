<template>
  <nav class="navbar flex items-center justify-between px-6 py-4 shadow-md border-b border-[#C2E7F6] bg-[#C2E7F6]/60 backdrop-blur z-40 relative">
    <!-- Logo / Judul -->
    <div class="text-2xl font-extrabold text-[#0D47A1] tracking-wide drop-shadow-sm">
      KuesionerKu
    </div>

    <!-- Menu Utama -->
    <div class="flex gap-2 md:gap-4 items-center">
      <NuxtLink to="/" class="nav-link" :class="isActive('/')">Beranda</NuxtLink>
      <div class="relative" ref="dropdownRef">
        <button class="nav-link flex items-center gap-1" type="button" @click="dropdownOpen = !dropdownOpen">
          Form Kuesioner
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div v-show="dropdownOpen" class="absolute left-0 mt-2 min-w-[260px] bg-white rounded shadow-lg border border-[#C2E7F6] transition z-30" @mousedown.prevent>
          <NuxtLink to="/form" class="block px-4 py-2 text-[#1976D2] hover:bg-[#C2E7F6]/40 font-medium" @click="dropdownOpen = false">Evaluasi Pasca Pelatihan Nasional</NuxtLink>
          <NuxtLink to="/form-atasan" class="block px-4 py-2 text-[#1976D2] hover:bg-[#C2E7F6]/40 font-medium" @click="dropdownOpen = false">Evaluasi Pasca Pelatihan Nasional - Atasan/Rekan Kerja/Bawahan</NuxtLink>
        </div>
      </div>
      <NuxtLink to="/hasil" class="nav-link" :class="isActive('/hasil')">Hasil</NuxtLink>
      <NuxtLink to="/tentang" class="nav-link" :class="isActive('/tentang')">Tentang</NuxtLink>
      <NuxtLink to="/ringkasan" class="nav-link" :class="isActive('/ringkasan')">Ringkasan</NuxtLink>
      <NuxtLink to="/kontak" class="nav-link" :class="isActive('/kontak')">Kontak</NuxtLink>
    </div>

    <!-- Login Button -->
    <div>
      <NuxtLink to="/login" class="login-btn">
        Login
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router' // or 'nuxt/app' if using Nuxt 3
const route = useRoute()
const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const isActive = (path) => {
  return route.path === path
    ? 'active-link'
    : 'inactive-link';
}

function handleClickOutside(event) {
  if (dropdownOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false
  }
}
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  background: linear-gradient(90deg, #C2E7F6 0%, #E3F2FD 100%);
}
.nav-link {
  transition: all 0.2s;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 1rem;
  color: #1976D2;
  background: transparent;
}
.nav-link.inactive-link {
  color: #1976D2;
  opacity: 0.85;
}
.nav-link.active-link {
  color: #fff;
.login-btn {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
  background: linear-gradient(90deg, #0D47A1 60%, #C2E7F6 100%);
  color: #fff;
  border: none;
}
}
.login-btn {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
  background: linear-gradient(90deg, #2196F3 60%, #C2E7F6 100%);
  color: #fff;
  border: none;
}
.login-btn:hover {
  background: #1976D2;
  color: #fff;
}
</style>
