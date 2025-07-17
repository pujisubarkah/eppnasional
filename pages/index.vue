
<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
    <section class="w-full max-w-3xl mb-20 mt-8 md:mt-14">
      <div class="h-2 w-full bg-gradient-to-r from-[#2196F3] via-[#C2E7F6] to-[#1976D2] rounded-t-2xl mb-0.5"></div>
      <div class="relative">
        <Swiper
          :modules="[Navigation, Pagination, Autoplay]"
          :slides-per-view="1"
          :loop="true"
          :autoplay="{ delay: 3500, disableOnInteraction: false }"
          :pagination="{ clickable: true }"
          class="rounded-2xl shadow-2xl overflow-hidden"
        >
          <SwiperSlide v-for="img in images" :key="img" class="bg-white flex items-center justify-center">
            <img :src="img" class="object-cover w-full h-[350px] md:h-[500px]" />
          </SwiperSlide>
        </Swiper>
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div class="bg-black/40 rounded-xl px-6 py-4 text-center">
            <h2 class="text-white text-2xl md:text-3xl font-extrabold drop-shadow mb-2">Evaluasi Pasca Pelatihan Nasional</h2>
            <p class="text-white text-base md:text-lg font-medium drop-shadow">dikelola oleh Direktorat Penjaminan Mutu Pengembangan Kapasitas<br class='hidden md:inline'/>Lembaga Administrasi Negara</p>
          </div>
        </div>
      </div>
      <div class="h-2 w-full bg-gradient-to-r from-[#1976D2] via-[#C2E7F6] to-[#2196F3] rounded-b-2xl mt-0.5"></div>
    </section>


    <section class="w-full max-w-2xl mx-auto mb-16">
      <faq />
    </section>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import faq from '~/components/faq.vue';

const images = [
  '/bigger.jpg',
  '/smarter.jpg',
  '/DSC_0216.JPG',
  '/DSC_0308.JPG',
  '/DSC_0352.JPG',
];
</script>
