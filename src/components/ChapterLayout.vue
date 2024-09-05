<script setup lang="ts">
import { onMounted, ref, watch, type Directive } from 'vue'
import LevelButton from '@/components/LevelButton.vue'
import LevelButtonPlaceholder from '@/components/LevelButtonPlaceholder.vue'
import type { Level } from '@/model/Level'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { UseDraggable, UseElementBounding } from '@vueuse/components'
import { useElementBounding } from '@vueuse/core'

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

const route = useRoute()
const levels = ref<Level[]>()
const isLoading = ref<boolean>(false)
const layoutScrollTop = ref(0)

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

var mouseX = ref(0)
var mouseY = ref(0)

function startDrag(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.setDragImage(new Image(), 0, 0)
  }
}

function dragHandler(event: DragEvent) {
  // event.preventDefault()
  const layoutContainer = document.getElementById('layoutContainer')

  const relativeX = (mouseX.value - layoutContainer?.offsetLeft ?? 0) - levelButtonHalfSize
  const relativeY = (mouseY.value - layoutContainer?.offsetTop ?? 0) - levelButtonHalfSize + layoutScrollTop.value

  const dragX = Math.min(Math.max(relativeX, 0), layoutWidth - levelButtonSize)
  const dragY = Math.min(Math.max(relativeY, 0), layoutHeight - levelButtonSize)

  let element = event.target as HTMLDivElement
  element.style.left = dragX.toString() + "px"
  element.style.top = dragY.toString() + "px"

  console.log(`x: ${dragX}, y: ${dragY}`)
}

onMounted(() => {
  document.getElementById('layoutContainer')?.addEventListener('scroll', function () {
    layoutScrollTop.value = this.scrollTop
  })
  window.addEventListener('dragover', (event) => {
    mouseX.value = event.x
    mouseY.value = event.y
  })
})

watch(route, fetchLevels, { immediate: true })
</script>

<template>
  <div
    id="layoutContainer"
    class="overflow-y-auto overflow-x-hidden h-full"
    :class="`min-h-[500px]`"
  >
    <div
      class="relative h-full"
      :style="`width: ${layoutWidth}px; height: ${layoutHeight}px`"
    >
      <!-- Background Image -->
      <img
        class="select-none pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover z-0"
        src="../assets/images/bg_2.jpg"
        alt="Background Image"
      />

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
      <LevelButton
        v-for="(level, index) in levels"
        :key="level.id"
        :label="level.id.toString()"
        :style="`
                top: ${level.worldY * rowHeight + halfRowHeight - levelButtonHalfSize}px; 
                left: ${(level.worldX + 1) * colWidth - levelButtonHalfSize}px
              `"
        class="absolute"
        draggable="true"
        :ref="`levelButton${index}`"
        @dragstart="startDrag"
        @drag="dragHandler"
      />
    </div>
  </div>
</template>
