<script setup lang="ts">
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import { type Chapter } from '@/model/Chapter'
import ChapterLayout from '@/components/ChapterLayout.vue'
import SideBar from '../components/SideBar.vue'
import LevelDetails from '@/components/LevelDetails.vue'
import type { Level } from '@/model/Level'

const route = useRoute()
const router = useRouter()

const chapterId = ref<string>('')
const isLoading = ref<boolean>(false)
const chapter = ref<Chapter>()
const isSideBarOpen = ref<boolean>(false) // State to control the sidebar visibility

async function fetchChapter() {
  const newChapterId = route.params.id as string
  if (chapterId.value == newChapterId) return

  chapterId.value = newChapterId
  isLoading.value = true
  isSideBarOpen.value = false

  try {
    const response = await axios.get(`/api/chapters/${chapterId.value}`)
    chapter.value = response.data
  } catch (error) {
    console.log('Failed to load chapter', error)
  } finally {
    isLoading.value = false
  }
}

const onSideBarToggled = () => {
  isSideBarOpen.value = !isSideBarOpen.value

  router.push(`/chapters/${chapterId.value}`)
}

const onLevelSelected = () => {
  isSideBarOpen.value = true
}

async function addLevel() {
  // isSideBarOpen.value = true
  // Add a level, and open the sidebar

  const getLevelsResponse = await axios.get(`/api/levels?checkpointId=${chapterId.value}`)
  const currentChapterLevels = getLevelsResponse.data as Level[]
  const latestLevel = currentChapterLevels.reduce((prev, current) => {
    return Number(current.id) > Number(prev.id) ? current : prev
  })

  // Update current latest level to not be checkpoint anymore.
  console.log("firs tput attempt")
  latestLevel.type = 'normal'
  const updateLatestLeveltypeResponse = await axios.put(`/api/levels/${latestLevel.id}`, latestLevel)
  if (updateLatestLeveltypeResponse.status == 200) {
    console.log('updated latest level')
  } else {
    console.log ("failed to update last level type: " + updateLatestLeveltypeResponse.status)
    return
  }

  // Shift all other levels
  //const getHigherLevelsResponse = await axios.get(`/api/levels?levelId_gt=${latestLevel.id}&limit=9001`)
  //if (getHigherLevelsResponse.status == 200) {
  //  console.log('loaded?')
  //  const allNextLevels = getHigherLevelsResponse.data
  //  allNextLevels.forEach((element: Level) => {
  //    const newLevelId = element.levelId + 1
  //    const updatedLevel: Level = {
  //      id: newLevelId.toString(),
  //      levelId: newLevelId,
  //      checkpointId: element.checkpointId,
  //      worldX: element.worldX,
  //      worldY: element.worldY,
  //      type: element.type
  //    }
  //    axios.put(`/api/levels`, updatedLevel)
  //  })
  //  console.log(allNextLevels)
  //}
//
  //// Create level inside the current chapter.
  //const newLevel: Level = {
  //  id: (Number(latestLevel.id) + 1).toString(),
  //  levelId: Number(latestLevel.id) + 1,
  //  worldX: latestLevel.worldX,
  //  worldY: latestLevel.worldY + 1,
  //  checkpointId: chapterId.value,
  //  type: 'checkpoint'
  //}
//
  //const addNewLevelResponse = await axios.post(`/api/levels`, newLevel)
  //if (addNewLevelResponse.status == 200) {
  //  console.log('added new level')
  //}
}

watch(route, fetchChapter, { immediate: true })
</script>

<template>
  <main class="flex flex-1 flex-row h-dvh overflow-hidden bg-grey-100 px-8 pl-32 md:px-8">
    <div class="grow"></div>
    <div class="flex flex-col shrink h-dvh pb-8">
      <h1 class="text text-center text-5xl text-extrabold mt-8 mb-8">
        {{ chapter?.title }}
      </h1>
      <button
        @click="addLevel"
        class="self-start rounded-full bg-mint-green-100 outline mb-2 outline-2 outline-green-800 hover:bg-mint-green-500 px-4 py-3"
      >
        <span class="text text-s text-green-800 font-bold">+ Add level</span>
      </button>
      <ChapterLayout
        :chapter-id="chapterId"
        :on-level-selected="
          () => {
            onLevelSelected()
          }
        "
      />
    </div>
    <div class="grow w-80"></div>
    <div class="absolute right-0 top-0">
      <SideBar
        :is-closable="true"
        :is-side-bar-open="isSideBarOpen"
        :on-toggled="
          () => {
            onSideBarToggled()
          }
        "
      >
        <LevelDetails />
      </SideBar>
    </div>
  </main>
</template>
