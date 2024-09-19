<script setup lang="ts">
import ChapterService from '@/data/ChapterService'
import LevelConnectionService from '@/data/LevelConnectionService'
import LevelService from '@/data/LevelService'
import LevelWordService from '@/data/LevelWordService'
import WordService from '@/data/WordService'
import type { Level } from '@/model/Level'
import type { LevelConnection } from '@/model/LevelConnection'
import type { LevelWord } from '@/model/LevelWord'
import { onMounted, ref } from 'vue'

const exportWords = ref<string>('')
const exportChapters = ref<string>('')
const exportLevels = ref<string>('')
const exportLevelWords = ref<string>('')
const exportLevelConnections = ref<string>('')

const loadData = () => {
  loadChapters()
  loadWords()
  loadLevels()
  loadLevelWords()
  loadLevelConnections()
}

const loadWords = async () => {
  const words = await WordService.getAllWords()
  exportWords.value = JSON.stringify(
    words.map((word) => {
      return {
        wordId: word.id,
        japanese: word.japanese,
        furigana: word.furigana,
        english: word.english
      }
    })
  )
}

const loadChapters = async () => {
  const chapters = await ChapterService.getAllChapters()

  exportChapters.value = JSON.stringify(
    chapters.map((chapter) => {
      return {
        id: chapter.id,
        title: chapter.title,
        description: chapter.description
      }
    })
  )
}

const loadLevels = async () => {
  const levels = await LevelService.getAllLevels()
  exportLevels.value = JSON.stringify(
    levels.map((level: Level) => {
      return {
        levelId: Number(level.levelId),
        checkpointId: level.checkpointId,
        worldX: level.worldX,
        worldY: level.worldY,
        type: level.type
      }
    })
  )
}

const loadLevelWords = async () => {
  const levelWords = await LevelWordService.getAllLevelWords()
  exportLevelWords.value = JSON.stringify(
    levelWords.map((levelWord: LevelWord) => {
      return {
        levelId: levelWord.levelId,
        wordId: levelWord.wordId
      }
    })
  )
}

const loadLevelConnections = async () => {
  const levelConnections = await LevelConnectionService.getAllLevelConnections()
  exportLevelConnections.value = JSON.stringify(
    levelConnections.map((levelConnection: LevelConnection) => {
      return {
        id: Number(levelConnection.id),
        startLevelId: levelConnection.startLevelId,
        endLevelId: levelConnection.endLevelId,
        checkpointId: levelConnection.endLevelId
      }
    })
  )
}

onMounted(loadData)
</script>

<template>
  <div class="w-full p-8">
    <h1 class="text text-4xl font-bold text-sakura mb-8">Export Data</h1>

    <h3 class="text text-2xl font-bold text-sakura my-2">Words</h3>
    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportWords"
    ></textarea>

    <h3 class="text text-2xl font-bold text-sakura my-2">Chapters</h3>
    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportChapters"
    ></textarea>

    <h3 class="text text-2xl font-bold text-sakura my-2">Levels</h3>
    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportLevels"
    ></textarea>

    <h3 class="text text-2xl font-bold text-sakura my-2">Level Words</h3>
    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportLevelWords"
    ></textarea>

    <h3 class="text text-2xl font-bold text-sakura my-2">Level Connections</h3>
    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportLevelConnections"
    ></textarea>
  </div>
</template>
