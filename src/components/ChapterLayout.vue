<script setup lang="ts">
import { ref, watch } from 'vue'
import LevelButton from '@/components/LevelButton.vue'
import LevelButtonPlaceholder from '@/components/LevelButtonPlaceholder.vue'
import type { Level } from '@/model/Level'
import axios from 'axios'
import { useRoute } from 'vue-router'

const props = defineProps({
  chapterId: String
})

const route = useRoute()
const levels = ref<Level[]>()
const isLoading = ref<boolean>(false)

// Width of one column
const colWidth = 150
// Number of columns the levels can be snapped to
const cols = 3
// Height of a row
const rowHeight = 200
// Number of rows the levels can be snapped to
// Will always be 1 more than the last row with a level on it.
var rows = 5
// Size of a button
const levelButtonSize = 80
// Half size of a button
const levelButtonHalfSize = 40

const layoutWidth = (cols + 1) * colWidth

const layoutHeight = (rows + 1) * rowHeight

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
  <div
    :style="`width: ${layoutWidth}px; height: ${layoutHeight}px`"
    :class="`bg-gray-200 min-h-[500px]`"
  >
    <div class="relative h-full">
      <!-- Placeholders -->
      <div
        v-for="y in rows"
        :key="y"
        class="absolute"
        :style="`top: ${(y - 1) * rowHeight}px`"
      >
        <LevelButtonPlaceholder
          v-for="x in cols"
          :key="x"
          :style="`left: ${x * colWidth - levelButtonHalfSize}px`"
          class="absolute"
        />
      </div>

      <!-- Actual levels -->
      <LevelButton
        v-for="level in levels"
        :key="level.id"
        :label="level.id.toString()"
      />
    </div>
  </div>
</template>
