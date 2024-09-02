<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import LevelButton from '@/components/LevelButton.vue'
import type { Level } from '@/model/Level'
import axios from 'axios'
import { useRoute } from 'vue-router'

const props = defineProps({
  chapterId: String
})

const route = useRoute()
const levels = ref<Level>()
const isLoading = ref<boolean>(false)

async function fetchLevels() {
  console.log('loading for ' + props.chapterId)
  isLoading.value = true
  try {
    const response = await axios.get(`/api/levels?checkpointId=${props.chapterId}`)
    levels.value = response.data
  } catch (error) {
    console.log('Failed to load level', error)
  } finally {
    isLoading.value = false
  }
}

watch(route, fetchLevels, { immediate: true })
</script>

<template>
  <div class="bg-gray-200 w-[600px] min-h-[500px]">
    <LevelButton
      v-for="level in levels"
      :key="level.id"
      :label="level.id.toString()"
    />
  </div>
</template>
