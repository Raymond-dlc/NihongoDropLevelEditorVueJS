<script setup lang="ts">
import { onMounted, ref, useSlots } from 'vue'
import axios from 'axios'
import type { Chapter } from '@/model/Chapter'
import ChapterService from '@/data/ChapterService'
import router from '@/router'

const isLoadingChapters = ref(true)
const chapters = ref<Chapter[]>()

const addChapter = async () => {
  const newChapter = await ChapterService.addNewChapter()
  router.push(`/chapters/${newChapter.chapterId}`)
  loadChapters()
}

const loadChapters = async () => {
  try {
    const response = await axios.get(`/api/chapters`)
    chapters.value = response.data
  } catch (error) {
    console.error('Error fetching chapter', error)
  } finally {
    isLoadingChapters.value = false
  }
}

onMounted(loadChapters)
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
      to="/data-export"
      class="text text-xl text-mint-green-400 hover:text-mint-green-700 block"
    >
      Data export
    </RouterLink>
    <RouterLink
      to="/"
      class="text text-xl text-mint-green-400 hover:text-mint-green-700 mt-4 block"
    >
      Words
    </RouterLink>
    <div class="mt-4">
      <span class="text text-xl text-white">Chapters</span>
      <button
        class="ml-5 rounded-full w-6 h-6 outline outline-2 outline-mint-green-400 hover:outline-mint-green-700"
        @click="addChapter"
      >
        <span class="text text-mint-green-400 text-l hover:text-mint-green-700">+</span>
      </button>
    </div>
    <ul>
      <li
        class="ml-4 w-full flex"
        v-for="chapter in chapters"
        :key="chapter.chapterId"
      >
        <RouterLink
          class="text text-mint-green-400 hover:text-mint-green-700 h-full w-full py-2 transition-*"
          :to="`/chapters/${chapter.chapterId}`"
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
