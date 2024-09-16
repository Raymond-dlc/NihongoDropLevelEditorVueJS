<script setup lang="ts">
import { onMounted, ref, watch, type Directive } from 'vue'
import LevelButton from '@/components/LevelButton.vue'
import LevelButtonPlaceholder from '@/components/LevelButtonPlaceholder.vue'
import type { Level } from '@/model/Level'
import type { LevelConnection } from '@/model/LevelConnection'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import LevelConnectionView from './LevelConnectionView.vue'

const props = defineProps({
  chapterId: String,
  onLevelSelected: {
    type: Function,
    required: true
  }
})

// Width of one column
const colWidth = 150
// Number of columns the levels can be snapped to
const cols = 3
// Height of a row
const rowHeight = 150
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
const selectedLevelId = ref()

const mouseX = ref(0)
const mouseY = ref(0)

const snapX = ref(0)
const snapY = ref(0)

async function fetchLevels() {
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
  isLoading.value = true
  try {
    const actualId = await (await axios.get(`/api/levels?levelId=${level.levelId}`)).data[0].id
    const response = await axios.put(`/api/levels/${actualId}`, level)
  } catch (error) {
    console.log('Failed to load level', error)
  } finally {
    isLoading.value = false
  }
}

async function removeLevelConnection(levelConnectionId: string) {
  isLoading.value = true
  try {
    await axios.delete(`/api/levelConnections/${levelConnectionId}`)

    // Reload level connections
    fetchLevelConnections()
  } catch (error) {
    console.log('Failed to remove level connection', error)
  } finally {
    isLoading.value = false
  }
}

async function addLevelConnection(startLevelId: number, endLevelId: number) {
  isLoading.value = true
  try {
    const newLevelConnection: LevelConnection = {
      id: undefined,
      startLevelId: startLevelId,
      endLevelId: endLevelId,
      checkpointId: Number(props.chapterId)
    }
    await axios.post(`/api/levelConnections`, newLevelConnection)

    // Reload level connections
    fetchLevelConnections()
  } catch (error) {
    console.log('Failed to remove level connection', error)
  } finally {
    isLoading.value = false
  }
}

const onRouteUpdate = () => {
  const levelId = route.query['levelid'] as String
  if (levelId == undefined) {
    selectedLevelId.value = ''
  }
}

const buttonClick = (levelId: string) => {
  selectedLevelId.value = levelId
  props.onLevelSelected()
  router.push(`/chapters/${props.chapterId}?levelid=${levelId}`)
}

function startDrag(event: DragEvent, level: Level) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    // event.dataTransfer.setDragImage(new Image(), 0, 0)
    event.dataTransfer.setData('levelId', level.levelId.toString())

    const element = event.target as HTMLDivElement
    element.classList.add('z-50')
  }

  return false
}

function stopDrag(event: DragEvent) {
  const element = event.target as HTMLDivElement
  element.classList.remove('z-50')
  event.preventDefault()
}

function dragHandler(event: DragEvent) {
  event.preventDefault()
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

const onDropOnLevel = (event: DragEvent, endLevel: Level) => {
  const startLevelId = Number(event.dataTransfer?.getData('levelId'))
  addLevelConnection(startLevelId, endLevel.levelId)
  event.preventDefault()
  return false
}

function onDrop(event: DragEvent, gridX: number, gridY: number) {
  const levelId = Number(event.dataTransfer?.getData('levelId'))
  const level = levels.value?.find((level) => level.levelId == levelId)
  if (level != null) {
    level.worldX = gridX
    level.worldY = gridY
    updateLevel(level)
  }

  event.preventDefault()
  return false
}

function onDragEnter(event: DragEvent) {
  event.preventDefault()
  const dropElement = event.target as HTMLDivElement

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
  return worldY * rowHeight + halfRowHeight - levelButtonHalfSize
}

const getXOffsetFor = (worldX: number): number => {
  return (worldX + 1) * colWidth - levelButtonHalfSize
}

const getWorldXFor = (levelId: number): number => {
  const level = levels.value?.find((level) => {
    return level.levelId === levelId
  }) as Level

  if (level == null) {
    console.log("couldn't find level!")
  }

  return level?.worldX ?? 0
}

const getWorldYFor = (levelId: number): number => {
  const worldY = levels.value?.find((level) => {
    return level.levelId == levelId
  })?.worldY
  return worldY ?? 0
}

const getLevelConnectionStyle = (levelConnection: LevelConnection): string => {
  const startWorldX = getWorldXFor(levelConnection.startLevelId)
  const startX = getXOffsetFor(startWorldX) + levelButtonHalfSize
  const startY = getYOffsetFor(getWorldYFor(levelConnection.startLevelId)) + levelButtonHalfSize
  const endY = getYOffsetFor(getWorldYFor(levelConnection.endLevelId)) + levelButtonHalfSize
  const endX = getXOffsetFor(getWorldXFor(levelConnection.endLevelId)) + levelButtonHalfSize
  const width = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2).toFixed(0)
  const rotation = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI

  return `top: ${startY}px; left: ${startX}px; width: ${width}px; 	transform: rotate(${rotation}deg)`
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

watch(route, onRouteUpdate, { immediate: true })
watch(route, fetchLevels, { immediate: true })
watch(route, fetchLevelConnections, { immediate: true })
</script>

<template>
  <div
    id="layoutContainer"
    class="flex-1 overflow-y-auto rounded-[20px] overflow-x-hidden no-scrollbar"
  >
    <div
      class="relative rounded-lg"
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
      <LevelConnectionView
        v-for="levelConnection in levelConnections"
        :key="levelConnection.id"
        :style="`${getLevelConnectionStyle(levelConnection)}`"
        :onDeleteClicked="
          () => {
            removeLevelConnection(levelConnection.id!!)
          }
        "
      />

      <!-- Actual levels -->
      <LevelButton
        v-for="(level, index) in levels"
        :key="level.levelId"
        :label="level.levelId.toString()"
        :isSelected="level.levelId == selectedLevelId"
        :style="`
                top: ${getYOffsetFor(level.worldY)}px; 
                left: ${getXOffsetFor(level.worldX)}px
              `"
        class="absolute"
        :draggable="true"
        :ref="`levelButton${index}`"
        @dragstart.self="startDrag($event, level)"
        @dragend.self="stopDrag($event)"
        @drag.self="dragHandler"
        @drop.prevent="onDropOnLevel($event, level)"
        @dragover.prevent
        @click="buttonClick(level.levelId.toString())"
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
