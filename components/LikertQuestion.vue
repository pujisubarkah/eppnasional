<template>
  <div class="mb-6">
    <label class="block mb-2 font-medium">{{ q }}</label>
    <div class="flex gap-2">
      <label v-for="val in 5" :key="val" class="flex flex-col items-center text-xs text-gray-600 cursor-pointer">
        <input type="radio" :name="q" :value="val" class="accent-[#2196F3]" />
        <span>{{ val }}</span>
      </label>
    </div>
    <div class="flex justify-between text-xs mt-1 text-gray-400">
      <span>Tidak Setuju</span>
      <span>Sangat Setuju</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  q: String
})
</script>
