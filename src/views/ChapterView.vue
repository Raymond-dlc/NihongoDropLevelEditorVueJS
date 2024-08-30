<script setup lang="ts">
import axios from 'axios';
import { useRoute } from 'vue-router';
import { onMounted, ref, watch } from 'vue';
import { type Chapter } from '@/model/Chapter';

const route = useRoute();

const chapterId = ref<string | string[]>("");
const isLoading = ref<boolean>(false);
const chapter = ref<Chapter>();

async function fetchChapter() {
  isLoading.value = true
  chapterId.value = route.params.id;
  try {
    const response = await axios.get(`/api/chapters/${chapterId.value}`);
    chapter.value = response.data;
  } catch (error) {
    console.log("Failed to load chapter", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchChapter);

watch(route, fetchChapter, { immediate: true }); // Fetch data on initial render as well

</script>

<template>
  <main class="flex flex-1 flex-col bg-grey-100 p-8 pl-32 md:p-8">
    <h1>Chapter Page {{ isLoading ? " - Loading" : "" }}</h1>
    <br />
    <p v-if="!isLoading">This is the chapter page for {{ chapter?.title }}!</p>
  </main>
</template>
