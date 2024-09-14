<script setup lang="ts">
import { onMounted, ref, useSlots } from 'vue'
import axios from 'axios'
import type { Chapter } from '@/model/Chapter'

const isLoadingChapters = ref(true)
const chapters = ref<Chapter[]>()

onMounted(async () => {
  try {
    const response = await axios.get(`/api/chapters`)
    chapters.value = response.data
  } catch (error) {
    console.error('Error fetching chapter', error)
  } finally {
    isLoadingChapters.value = false
  }
})
</script>

<template>
  <h1
    :class="`${$attrs.isSideBarOpen ? 'opacity-100' : 'opacity-0'}`"
    class="text text-white text-3xl font-extrabold mb-4 transition-opacity duration-75"
  >
    Nihongo Drop Level Editor
  </h1>

  <nav
    :class="`${$attrs.isSideBarOpen ? 'opacity-100' : 'opacity-0'}`"
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
