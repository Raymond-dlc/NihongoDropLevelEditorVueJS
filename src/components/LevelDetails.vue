<script setup lang="ts">
import type { Level } from '@/model/Level'
import type { Word } from '@/model/Word'
import type { LevelWord } from '@/model/LevelWord'
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const level = ref<Level>()
const allWords = ref<Word[]>()
const levelWords = ref<Word[]>()
const searchResultWords = ref<Word[]>()
const levelId = ref(route.query['levelid'] as String)
const searchInput = ref('')

const loadAllWords = async () => {
  try {
    const response = await axios.get(`/api/words?_limit=5000`)
    allWords.value = response.data
  } catch (error) {
    console.log('Failed to levels', error)
  } finally {
    console.log('TODO: Handle loading')
  }
}

const loadLevelDetails = async () => {
  try {
    const response = await axios.get(`/api/levels/${levelId.value}`)
    level.value = response.data
  } catch (error) {
    console.log('Failed to levels', error)
  } finally {
    console.log('TODO: Handle loading')
  }
}

const loadLevelWords = async () => {
  levelId.value = route.query['levelid'] as String

  try {
    let levelWordsResponse = await axios.get(`/api/levelWords?levelId=${levelId.value}`)
    let wordsResponse = await axios.get('/api/words?_limit=5000')
    const allLevelWords = levelWordsResponse.data as LevelWord[]

    const wordIds = allLevelWords.map((levelWord) => {
      return levelWord.wordId.toString()
    })
    levelWords.value = (wordsResponse.data as Word[]).filter((word: Word) => {
      return wordIds.includes(word.id)
    })
  } catch (error) {
    console.log('Failed to load words', error)
  } finally {
    console.log('TODO: Handle loading')
  }
}

const onSearchInputUpdated = (event: InputEvent) => {
  const newInput = (event.target as HTMLInputElement).value.toLocaleLowerCase() ?? ''

  if (newInput == '') {
    searchResultWords.value = []
    return
  }

  const filteredWords = allWords.value?.filter((word: Word) => {
    return word.english.toLocaleLowerCase().includes(newInput) || word.id == newInput
  })
  console.log('new input' + newInput)
  console.log('found words: ', filteredWords)
  searchResultWords.value = filteredWords
}

watch(route, loadLevelDetails, { immediate: true })
watch(route, loadLevelWords, { immediate: true })
watch(route, loadAllWords, { immediate: true })
</script>

<template>
  <div>
    <h1 class="mt-12 text text-3xl text-bold text-white text-center">Level {{ levelId }}</h1>
    <h4 class="text text-xl text-bold text-white mt-2">Words</h4>

    <input
      v-model="searchInput"
      @input="onSearchInputUpdated($event as InputEvent)"
      class="w-full mt-2 h-10 rounded-2xl px-5 ring-1 hover:ring-2 ring-mint-green-700 focus:outline-none focus:ring focus:ring-mint-green-800 hover:ring-mint-green-700"
      placeholder="search a word"
    />

    <div
      v-if="searchResultWords?.length ?? 0 > 0"
      class="relative"
    >
      <div class="absolute transition duration-300 ring-1 ring-color:black w-full max-h-80 overflow-auto rounded-2xl bg-gray-50 shadow-l">
        <ul>
          <li
            class="px-4 py-2 hover:bg-gray-200 rounded-2xl"
            v-for="word in searchResultWords"
            :key="word.id"
          >
            <p class="text text-mint-green-800">{{ word.id }} - {{ word.japanese }} [{{ word.furigana }}]</p>
            <p class="text text-mint-green-800 ml-5">- {{ word.english }}</p>
          </li>
        </ul>
      </div>
    </div>

    <div class="rounded rounded-2xl bg-gray-50 mt-5">
      <ul class="py-2 px-5">
        <li
          class="mt-2"
          v-for="word in levelWords"
          :key="word.id"
        >
          <p class="text text-mint-green-800">{{ word.id }} - {{ word.japanese }} [{{ word.furigana }}]</p>
          <p class="text text-mint-green-800 ml-5">- {{ word.english }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
