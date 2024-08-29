<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(false)
const toggleMenu = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <aside :class="`${isExpanded ? 'w-80' : 'w-24'}`"
    class="flex flex-col bg-sakura p-8 overflow-hidden min-h-screen duration-300 ease-in-out fixed md:static md:z-50">
    <div class="relative">
      <img class="w-16 mb-4" src="../assets/nihongo-drop-logo.bmp" alt="Logo" />
      <button @click="toggleMenu" class="transition duration-300"
        :class="`${isExpanded ? 'absolute top-0 right-0 -rotate-180' : 'static'}`">
        <span class="material-symbols-outlined text-white"> keyboard_double_arrow_right </span>
      </button>
    </div>

    <h1 :class="`${isExpanded ? 'opacity-100' : 'opacity-0'}`"
      class="text text-white text-3xl font-extrabold mb-4 transition-opacity duration-75">
      Nihongo Drop Level Editor
    </h1>
    <nav :class="`${isExpanded ? 'opacity-100' : 'opacity-0'}`" class="transition-opacity duration-75">
      <RouterLink to="/" class="text text-xl text-mint-green">Words</RouterLink>
      <p class="text text-xl text-mint-green">Chapters</p>
      <ul>
        <li><RouterLink class="text text-mint-green ml-4" to="/chapter/1">Chapter 1</RouterLink></li>
        <li><RouterLink class="text text-mint-green ml-4" to="/chapter/2">Chapter 2</RouterLink></li>
        <li><RouterLink class="text text-mint-green ml-4" to="/chapter/3">Chapter 3</RouterLink></li>
        <li><RouterLink class="text text-mint-green ml-4" to="/chapter/4">Chapter 4</RouterLink></li>
      </ul>
    </nav>
  </aside>
</template>
