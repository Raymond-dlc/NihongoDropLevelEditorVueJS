<script setup lang="ts">
import { ref, watch } from 'vue'
import LevelButton from '@/components/LevelButton.vue'
import LevelButtonPlaceholder from '@/components/LevelButtonPlaceholder.vue'
import type { Level } from '@/model/Level'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { UseDraggable, UseElementBounding } from '@vueuse/components'

const props = defineProps({
  chapterId: String
})

// Width of one column
const colWidth = 150
// Number of columns the levels can be snapped to
const cols = 3
// Height of a row
const rowHeight = 200
// Half rpw height for easy calculations
const halfRowHeight = rowHeight / 2
// Number of rows the levels can be snapped to
// Will always be 1 more than the last row with a level on it.
var rows = 5
// Size of a button
const levelButtonSize = 80
// Half size of a button
const levelButtonHalfSize = 40
// Layout width equals 1 extra col to give some padding
const layoutWidth = (cols + 1) * colWidth
// The height depends on the number of rows
var layoutHeight = rows * rowHeight

const levelButtonRefs = ref([])
const route = useRoute()
const levels = ref<Level[]>()
const isLoading = ref<boolean>(false)
const element = ref<HTMLElement | null>(null)

async function fetchLevels() {
  console.log('loading for ' + props.chapterId)
  isLoading.value = true
  try {
    const response = await axios.get(`/api/levels?checkpointId=${props.chapterId}`)
    levels.value = response.data

    rows = 0
    levels.value?.forEach((level) => {
      rows = Math.max(rows, level.worldY)
    })
    rows += 2

    layoutHeight = rows * rowHeight
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
    class="overflow-hidden relative"
    :style="`width: ${layoutWidth}px; height: ${layoutHeight}px`"
    :class="`bg-gray-200 min-h-[500px]`"
  >
    <!-- Background Image -->
    <img
      class="select-none pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover z-0"
      src="../assets/images/bg_2.jpg"
      alt="Background Image"
    />

    <!-- Content Wrapper -->
    <UseElementBounding
      v-slot="{ width, height, top, left }"
      class="relative h-full z-10"
    >
      <!-- Placeholders -->
      <div
        v-for="yPos in rows"
        :key="yPos"
        class="absolute"
        :style="`top: ${(yPos - 1) * rowHeight + halfRowHeight - levelButtonHalfSize}px`"
      >
        <LevelButtonPlaceholder
          v-for="xPos in cols"
          :key="xPos"
          :style="`left: ${xPos * colWidth - levelButtonHalfSize}px`"
          class="absolute"
        />
      </div>

      <!-- Actual levels -->
      <UseDraggable
        v-for="level in levels"
        :key="level.id"
        :ref="`element${level.id}`"
        v-slot="{ x, y }"
        :initial-value="{
          x: (level.worldX + 1) * colWidth - levelButtonHalfSize + left,
          y: level.worldY * rowHeight + halfRowHeight - 40 + top
        }"
        style="position: fixed"
      >
        <LevelButton :label="level.id.toString()" />
      </UseDraggable>
    </UseElementBounding>
  </div>
</template>
