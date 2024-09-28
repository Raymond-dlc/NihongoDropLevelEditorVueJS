<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Chapter } from '@/model/Chapter'
import DropDownMenu from './inputs/DropDownMenu.vue'
import TextArea from './inputs/TextArea.vue'
import { Language } from '@/model/enums/Language';
import chapterService from '@/data/chapterService';

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

const loadDataForSelectedLanguage = async () => {
  const chapter = await chapterService.getChapterForLanguage(props.chapter.chapterId, selectedLanguage.value)
  titleInput.value = chapter.title
  descriptionInput.value = chapter.description
}

const titleInput = ref(props.chapter.title)
const descriptionInput = ref(props.chapter.description)
const isLoading = ref(false)
const selectedLanguage = ref(Language.English)

watch(selectedLanguage, loadDataForSelectedLanguage)
</script>

<template>
  <div>
    <h1 class="mt-8 mb-4 text text-3xl text-bold text-white text-center">{{ props.chapter.title }}</h1>
    <DropDownMenu
      name="Language"
      v-model="selectedLanguage"
      :options="Object.values(Language)"
    />
    <TextArea
      name="Title"
      height="h-20"
      v-model="titleInput"
      placeholder="Chapter title"
    />
    <TextArea
      name="Description"
      height="h-40"
      v-model="descriptionInput"
      placeholder="Chapter description"
    />

    <button
      @click="
        () => {
          isLoading = true
          onChapterDescriptionUpdated(titleInput, descriptionInput, selectedLanguage)
          isLoading = false
        }
      "
      class="self-start rounded-full w-full bg-mint-green-100 outline mt-4 mb-2 outline-2 outline-green-800 hover:bg-mint-green-500 px-4 py-3"
    >
      <span class="text text-s text-green-800 font-bold">update</span>
    </button>
  </div>
</template>
