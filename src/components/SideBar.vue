<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import type { Chapter } from '@/model/Chapter'

const isExpanded = ref(true)
const isLoadingChapters = ref(true)
const chapters = ref<Chapter[]>()

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value
}

onMounted(async () => {
  try {
    const response = await axios.get(`/api/chapters`)
    chapters.value = response.data
    console.log(response.data)
  } catch (error) {
    console.error('Error fetching chapter', error)
  } finally {
    isLoadingChapters.value = false
  }
})
</script>

<template>
  <aside
    :class="`${isExpanded ? 'w-80' : 'w-24'}`"
    class="flex flex-col shrink-0 z-[9999999] bg-sakura overflow-auto no-scrollbar p-8 h-dvh duration-300 ease-in-out fixed md:static md:z-50"
  >
    <div class="relative">
      <img
        class="w-16 mb-4 transition-* duration-[20000ms]"
        src="../assets/nihongo-drop-logo.bmp"
        :class="`${isExpanded ? 'rounded-xl' : 'rounded-md'}`"
        alt="Logo"
      />
      <button
        @click="toggleMenu"
        class="transition duration-300"
        :class="`${isExpanded ? 'absolute top-0 right-0 -rotate-180' : 'static'}`"
      >
        <span class="material-symbols-outlined text-white"> keyboard_double_arrow_right </span>
      </button>
    </div>

    <h1
      :class="`${isExpanded ? 'opacity-100' : 'opacity-0'}`"
      class="text text-white text-3xl font-extrabold mb-4 transition-opacity duration-75"
    >
      Nihongo Drop Level Editor
    </h1>

    <nav
      :class="`${isExpanded ? 'opacity-100' : 'opacity-0'}`"
      class="transition-opacity duration-75 h-full"
    >
      <RouterLink
        to="/"
        class="text text-xl text-mint-green-400 hover:text-mint-green-700"
      >
        Words
      </RouterLink>
      <p class="text text-xl text-mint-green-400">Chapters</p>
      <ul>
        <li
          class="ml-4 w-full flex"
          v-for="chapter in chapters"
          :key="chapter.id"
        >
          <RouterLink
            class="text text-mint-green-400 hover:text-mint-green-700 h-full w-full py-2 transition-*"
            :to="`/chapters/${chapter.id}`"
          >
            {{ chapter.title }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style lang="css" scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
