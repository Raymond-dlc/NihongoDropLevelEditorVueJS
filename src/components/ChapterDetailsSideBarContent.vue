<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Chapter } from '@/model/Chapter'

const route = useRoute()

const props = defineProps({
  chapter: {
    type: Object as () => Chapter,
    required: true
  },
  onChapterDescriptionUpdated: {
    type: Function,
    required: true
  }
})

const descriptionInput = ref(props.chapter.description)

const isLoading = ref(false)
</script>

<template>
  <div>
    <h1 class="mt-8 mb-4 text text-3xl text-bold text-white text-center">{{ props.chapter.title }}</h1>
    <span class="text text-xl text-bold text-white">Description</span>
    <span
      class="text text-xl text-bold text-white transition-opacity transition-duration-1000"
      :class="`${isLoading ? 'opacity-100' : 'opacity-0'}`"
    >
      - loading</span
    >
    <textarea
      class="w-full h-80 rounded-xl mt-4 p-4"
      v-model="descriptionInput"
      placeholder="Chapter description"
    ></textarea>

    <button
      @click="
        () => {
          isLoading = true
          onChapterDescriptionUpdated(descriptionInput)
          isLoading = false
        }
      "
      class="self-start rounded-full w-full bg-mint-green-100 outline mt-4 mb-2 outline-2 outline-green-800 hover:bg-mint-green-500 px-4 py-3"
    >
      <span class="text text-s text-green-800 font-bold">update</span>
    </button>
  </div>
</template>
