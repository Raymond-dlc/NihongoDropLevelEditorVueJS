<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)
const toggleMenu = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <aside
    :class="`${isExpanded ? 'w-96' : 'w-32'}`"
    class="flex flex-col bg-cyan-700 p-8 overflow-hidden min-h-screen duration-200 ease-in-out fixed md:static md:z-50"
  >
    <div class="mb-8">
      <img class="w-8" src="../assets/logo.svg" alt="Logo" />
    </div>
    <div>
      <button @click="toggleMenu">
        <span class="material-symbols-outlined"> keyboard_double_arrow_right </span>
      </button>
    </div>

    <h1>Nihongo Drop - Level Editor</h1>
    <nav>
      <RouterLink to="/" class="text text-xl">Words</RouterLink>
      <p class="text text-xl">Chapters</p>
      <RouterLink to="/chapter/1">Chapter 1</RouterLink>
    </nav>
  </aside>
</template>
