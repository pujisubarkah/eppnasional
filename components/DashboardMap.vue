
<template>
  <div>
    <div class="text-center text-lg font-bold text-[#1976D2] mb-2">Peta Sebaran Responden</div>
    <svg viewBox="0 0 1000 600" class="w-full h-[32rem] object-contain">
      <g v-for="prov in provinsi" :key="prov.id">
        <path
          :d="cleanPath(prov.svg_path)"
          :fill="getColor(prov.dummy_responden)"
          fill-opacity="0.7"
          stroke="#1976D2"
          stroke-width="0.5"
        />
      </g>
    </svg>
    <div class="flex flex-wrap gap-4 text-xs text-gray-700 justify-center ">
      <div v-for="(color, idx) in legendColors" :key="idx" class="flex items-center gap-1">
        <span class="inline-block w-4 h-4 rounded" :style="{ background: color.color }"></span>
        <span>{{ color.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const provinsi = ref([])

// Dummy color scale and legend
const colorScale = [
  { max: 10, color: '#E3F2FD', label: '0-10' },
  { max: 50, color: '#90CAF9', label: '11-50' },
  { max: 100, color: '#42A5F5', label: '51-100' },
  { max: 200, color: '#1976D2', label: '101-200' },
  { max: 1000, color: '#0D47A1', label: '201+' },
]

const legendColors = colorScale

function getColor(count) {
  for (const c of colorScale) {
    if (count <= c.max) return c.color
  }
  return colorScale[colorScale.length - 1].color
}

function cleanPath(path) {
  return path.replace(/^"|"$/g, '')
}

// Add dummy respondent counts to each province
onMounted(async () => {
  const res = await fetch('/api/provinsi')
  const data = await res.json()
  // Assign dummy counts (random for demo)
  provinsi.value = data.map((prov, i) => ({
    ...prov,
    dummy_responden: Math.floor(Math.random() * 250),
  }))
})
</script>
