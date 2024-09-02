<script setup lang="ts">
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import { type Chapter } from '@/model/Chapter'
import ChapterLayout from '@/components/ChapterLayout.vue'

const route = useRoute()

const chapterId = ref<string | string[]>('')
const isLoading = ref<boolean>(false)
const chapter = ref<Chapter>()

async function fetchChapter() {
  isLoading.value = true
  chapterId.value = route.params.id
  try {
    const response = await axios.get(`/api/chapters/${chapterId.value}`)
    chapter.value = response.data
  } catch (error) {
    console.log('Failed to load chapter', error)
  } finally {
    isLoading.value = false
  }
}

watch(route, fetchChapter, { immediate: true })
</script>

<template>
  <main class="flex flex-1 flex-row bg-grey-100 p-8 pl-32 md:p-8">
    <div class="grow"></div>
    <div class="shrink">
      <h1 class="text text-center text-5xl text-extrabold mt-8 mb-16">
        {{ chapter?.title }}
      </h1>
      <ChapterLayout :chapter-id="chapterId" />
    </div>
    <div class="grow"></div>
  </main>
</template>
