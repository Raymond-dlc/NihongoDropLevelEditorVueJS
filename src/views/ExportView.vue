<script setup lang="ts">
import ChapterService from '@/data/chapterService'
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
        wordId: Number(word.id),
        japanese: word.japanese,
        furigana: word.furigana,
        english: word.english,
        dutch: word.dutch
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
        chapterId: chapter.chapterId,
        title: chapter.title,
        description: chapter.description ?? '',
        languageCode: chapter.languageCode
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

const copyToClipboard = (content: string) => {
  navigator.clipboard
    .writeText(content)
    .then(function () {
      console.log('Text copied to clipboard!')
    })
    .catch(function (err) {
      console.error('Failed to copy: ', err)
      console.log('Failed to copy to clipboard!')
    })
}

onMounted(loadData)
</script>

<template>
  <div class="w-full bg-mint-green-100 p-8">
    <h1 class="text text-4xl font-bold text-sakura mb-8">Export Data</h1>

    <div class="my-2 font-bold text-sakura">
      <h3 class="text text-2xl font-bold text-sakura inline">Words</h3>
      <button @click="copyToClipboard(exportWords)">
        <span class="material-symbols-outlined hover:text-mint-green-700"> content_copy </span>
      </button>
    </div>

    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportWords"
    ></textarea>

    <div class="my-2 font-bold text-sakura">
      <h3 class="text text-2xl inline">Chapters</h3>
      <button @click="copyToClipboard(exportChapters)">
        <span class="material-symbols-outlined hover:text-mint-green-700"> content_copy </span>
      </button>
    </div>
    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportChapters"
    ></textarea>

    <div class="my-2 font-bold text-sakura">
      <h3 class="text text-2xl inline">Levels</h3>
      <button @click="copyToClipboard(exportLevels)">
        <span class="material-symbols-outlined hover:text-mint-green-700"> content_copy </span>
      </button>
    </div>
    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportLevels"
    ></textarea>

    <div class="my-2 font-bold text-sakura">
      <h3 class="text text-2xl inline">Level Words</h3>
      <button @click="copyToClipboard(exportLevelWords)">
        <span class="material-symbols-outlined hover:text-mint-green-700"> content_copy </span>
      </button>
    </div>
    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportLevelWords"
    ></textarea>

    <div class="my-2 font-bold text-sakura">
      <h3 class="text text-2xl inline">Level Connections</h3>
      <button @click="copyToClipboard(exportLevelConnections)">
        <span class="material-symbols-outlined hover:text-mint-green-700"> content_copy </span>
      </button>
    </div>
    <textarea
      class="w-full h-20 outline outline-1 outline-black rounded-xl p-2"
      v-model="exportLevelConnections"
    ></textarea>
  </div>
</template>
