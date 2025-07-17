<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow p-4 mb-6">
      <h1 class="text-2xl font-bold text-gray-800">EPP Nasional</h1>
    </header>
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
    <!-- Footer -->
    <footer class="bg-white shadow p-4 mt-6 text-center text-gray-500">
      &copy; 2025 EPP Nasional
    </footer>
  </div>
</template>

<script setup>
// Layout default
</script>
