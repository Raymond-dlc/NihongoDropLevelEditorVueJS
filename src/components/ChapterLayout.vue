<script setup lang="ts">
import { onMounted, ref, watch, type Directive } from 'vue'
import LevelButton from '@/components/LevelButton.vue'
import LevelButtonPlaceholder from '@/components/LevelButtonPlaceholder.vue'
import type { Level } from '@/model/Level'
import type { LevelConnection } from '@/model/LevelConnection'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

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
const router = useRouter()
const levels = ref<Level[]>()
const levelConnections = ref<LevelConnection[]>()
const isLoading = ref<boolean>(false)
const layoutScrollTop = ref(0)
const selectedLevelId = ref('')

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

async function fetchLevelConnections() {
  console.log('loading for ' + props.chapterId)
  isLoading.value = true
  try {
    const response = await axios.get(`/api/levelConnections?checkpointId=${props.chapterId}`)
    levelConnections.value = response.data
  } catch (error) {
    console.log('Failed to load level', error)
  } finally {
    isLoading.value = false
  }
}

async function updateLevel(level: Level) {
  console.log('updating level')
  isLoading.value = true
  try {
    const response = await axios.put(`/api/levels/${level.id}`, level)
    console.log('level updated')
  } catch (error) {
    console.log(level)
    console.log('Failed to load level', error)
  } finally {
    isLoading.value = false
  }
}

const buttonClick = (levelId: string) => {
  console.log('clicked')
  selectedLevelId.value = levelId
  router.push(`/chapters/${props.chapterId}?levelid=${levelId}`)
}

function startDrag(event: DragEvent, level: Level) {
  console.log('start drag')
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    // event.dataTransfer.setDragImage(new Image(), 0, 0)
    event.dataTransfer.setData('levelId', level.id)

    const element = event.target as HTMLDivElement
    element.classList.add('z-50')
  }

  return false
}

function stopDrag(event: DragEvent) {
  console.log('stop drag')
  const element = event.target as HTMLDivElement
  element.classList.remove('z-50')

  console.log(element)
  event.preventDefault()
}

function dragHandler(event: DragEvent) {
  event.preventDefault()
  console.log('dragging')
  const layoutContainer = document.getElementById('layoutContainer')

  const offsetLeft = layoutContainer?.offsetLeft ?? 0
  const offsetTop = layoutContainer?.offsetTop ?? 0

  const relativeX = mouseX.value - offsetLeft - levelButtonHalfSize
  const relativeY = mouseY.value - offsetTop - levelButtonHalfSize + layoutScrollTop.value

  let dragX = Math.min(Math.max(relativeX, 0), layoutWidth - levelButtonSize)
  let dragY = Math.min(Math.max(relativeY, 0), layoutHeight - levelButtonSize)

  if (snapX.value != 0) {
    dragX = snapX.value
    dragY = snapY.value
  }

  let element = event.target as HTMLDivElement
  // element.style.left = dragX.toString() + 'px'
  // element.style.top = dragY.toString() + 'px'
}

function onDrop(event: DragEvent, gridX: number, gridY: number) {
  const levelId = event.dataTransfer?.getData('levelId')
  const level = levels.value?.find((level) => level.id == levelId)
  if (level != null) {
    level.worldX = gridX
    level.worldY = gridY
    updateLevel(level)
    console.log(`update dragging element to pos ${gridX}, ${gridY}`)
  } else {
    console.log(`Couldn't find level for levelId: ${levelId}`)
  }

  event.preventDefault()
  return false
}

function onDragEnter(event: DragEvent) {
  event.preventDefault()
  const dropElement = event.target as HTMLDivElement
  console.log('drag enter')

  snapX.value = dropElement.offsetLeft
  snapY.value = dropElement.parentElement?.offsetTop ?? 0
  return false
}

function onDragLeave() {
  snapX.value = 0
  snapY.value = 0
  return false
}

const getYOffsetFor = (worldY: number): number => {
  console.log("get X offset for: " + worldY)
  return worldY * rowHeight + halfRowHeight - levelButtonHalfSize
}

const getXOffsetFor = (worldX: number): number => {
  console.log("get X offset for: " + worldX)
  return (worldX + 1) * colWidth - levelButtonHalfSize
}

const getWorldXFor = (levelId: number): number => {
  console.log("get for levelid : " + levelId)
  const worldX = levels.value?.find(level => { level.id == levelId.toString()})?.worldX
  console.log("found X for level: " +  worldX)
  return (worldX ?? 0)
}
const getWorldYFor = (levelId: number): number => {
  const worldY = levels.value?.find(level => { level.id == levelId.toString()})?.worldY
  return (worldY ?? 0)
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
watch(route, fetchLevelConnections, { immediate: true })
</script>

<template>
  <div
    id="layoutContainer"
    class="overflow-y-auto rounded-[20px] overflow-x-hidden h-full no-scrollbar"
    :class="`min-h-[500px]`"
  >
    <div
      class="relative h-full rounded-lg"
      :style="`width: ${layoutWidth}px; height: ${layoutHeight}px`"
    >
      <!-- Background Image -->
      <img
        class="select-none pointer-events-none rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover z-0"
        src="../assets/images/bg_2.jpg"
        alt="Background Image"
      />

      <!-- Placeholders / Dropzones -->
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
          @dragenter.prevent="onDragEnter($event)"
          @dragleave.prevent="onDragLeave"
          @dragover.prevent
        />
      </div>

      <!-- Level connections -->
      <div
        v-for="levelConnection in levelConnections"
        :key="levelConnection.id"
        class="absolute origin-left w-[600px] z-50 h-2 bg-mint-green-800 rounded-lg"
        :style="`
                top: ${getYOffsetFor(getWorldYFor(levelConnection.startLevelId)) + levelButtonHalfSize}px; 
                left: ${getXOffsetFor(getWorldXFor(levelConnection.startLevelId)) + levelButtonHalfSize}px
                `"
      ></div>

      <!-- Actual levels -->
      <LevelButton
        v-for="(level, index) in levels"
        :key="level.id"
        :label="level.id.toString()"
        :isSelected="level.id == selectedLevelId"
        :style="`
                top: ${getYOffsetFor(level.worldY)}px; 
                left: ${getXOffsetFor(level.worldX)}px
              `"
        class="absolute"
        draggable="true"
        :ref="`levelButton${index}`"
        @dragstart.self="startDrag($event, level)"
        @dragend.self="stopDrag($event)"
        @drag.self="dragHandler"
        @click="buttonClick(level.id.toString())"
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
