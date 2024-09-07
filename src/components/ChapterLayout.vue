<script setup lang="ts">
import { onMounted, ref, watch, type Directive } from 'vue'
import LevelButton from '@/components/LevelButton.vue'
import LevelButtonPlaceholder from '@/components/LevelButtonPlaceholder.vue'
import type { Level } from '@/model/Level'
import axios from 'axios'
import { useRoute } from 'vue-router'

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
const draggingElement = ref<HTMLDivElement>()

const mouseX = ref(0)
const mouseY = ref(0)

const snapX = ref(0)
const snapY = ref(0)

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

function startDrag(event: DragEvent, level: Level) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setDragImage(new Image(), 0, 0)
    event.dataTransfer.setData('levelId', level.id)
    console.log('setting the level id')

    const element = event.target as HTMLDivElement
    element.classList.add('pointer-events-none', 'z-50')
  }
}
function stopDrag(event: DragEvent) {
  const element = event.target as HTMLDivElement
  element.classList.remove('pointer-events-none', 'z-50')

  console.log(element)
}

function dragHandler(event: DragEvent) {
  const layoutContainer = document.getElementById('layoutContainer')

  const relativeX = (mouseX.value - layoutContainer?.offsetLeft ?? 0) - levelButtonHalfSize
  const relativeY = (mouseY.value - layoutContainer?.offsetTop ?? 0) - levelButtonHalfSize + layoutScrollTop.value

  let dragX = Math.min(Math.max(relativeX, 0), layoutWidth - levelButtonSize)
  let dragY = Math.min(Math.max(relativeY, 0), layoutHeight - levelButtonSize)

  if (snapX.value != 0) {
    dragX = snapX.value
    dragY = snapY.value
  }

  let element = event.target as HTMLDivElement
  element.style.left = dragX.toString() + 'px'
  element.style.top = dragY.toString() + 'px'

  event.preventDefault()
}

function onDrop(event: DragEvent, gridX: Number, gridY: Number) {
  console.log(`Drop it at ${gridX}, ${gridY}`)
  // TODO update x/y pos
  event.preventDefault()
}

function onDragEnter(event: DragEvent, gridX: Number, gridY: Number) {
  const dropElement = event.target as HTMLDivElement

  snapX.value = dropElement.offsetLeft
  snapY.value = dropElement.parentElement?.offsetTop ?? 0
}

function onDragLeave(event: DragEvent, gridX: Number, gridY: Number) {
  snapX.value = 0
  snapY.value = 0
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
    class="overflow-y-auto overflow-x-hidden h-full no-scrollbar"
    :class="`min-h-[500px]`"
  >
    <div
      class="relative h-full"
      :style="`width: ${layoutWidth}px; height: ${layoutHeight}px`"
    >
      <!-- Background Image -->
      <img
        class="select-none rounded-xl pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover z-0"
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
          @drop.prevent="onDrop($event, xPos - 1, yPos - 1)"
          @dragenter.prevent="onDragEnter($event, xPos - 1, yPos - 1)"
          @dragleave.prevent="onDragLeave($event, xPos - 1, yPos - 1)"
          @dragover.prevent
        />
      </div>
      <!--
      
      @dragleave.prevent="onDragLeave($event, xPos, yPos)" -->

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
        @dragstart.self="startDrag($event, level)"
        @dragend.self="stopDrag($event)"
        @drag.self="dragHandler"
      />
    </div>
  </div>
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
