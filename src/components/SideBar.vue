<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios';
import type { Chapter } from '@/model/Chapter';

const isExpanded = ref(false)
const isLoadingChapters = ref(true)
const chapters = ref<Chapter[]>();

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value
}

onMounted(async () => {
  try {
    const response = await axios.get(`/api/chapters`);
    chapters.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching chapter', error);
  } finally {
    isLoadingChapters.value = false
  }
});

</script>

<template>
  <aside
    :class="`${isExpanded ? 'w-80' : 'w-24'}`"
    class="flex flex-col bg-sakura p-8 overflow-hidden min-h-screen duration-300 ease-in-out fixed md:static md:z-50"
  >
    <div class="relative">
      <img
        class="w-16 mb-4"
        src="../assets/nihongo-drop-logo.bmp"
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
      class="transition-opacity duration-75"
    >
      <RouterLink 
        to="/"
        class="text text-xl text-mint-green"
      >
        Words
      </RouterLink>
      <p class="text text-xl text-mint-green">Chapters</p>
      <ul>
        <li v-for="chapter in chapters" :key="chapter.id">
          <RouterLink
            class="text text-mint-green p-4 ml-4 transition-*"
            :to="`/chapters/${chapter.id}`"
          >
            {{ chapter.title }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
