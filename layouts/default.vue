
<template>
  <div class="flex flex-col min-h-screen bg-white">
    <Navbar />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '~/components/Footer.vue'
import Navbar from '~/components/Navbar.vue'
</script>
