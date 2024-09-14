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
const isLoading = ref(false)

const loadAllWords = async () => {
  if(levelId.value == undefined) return

  isLoading.value = true
  try {
    const response = await axios.get(`/api/words?_limit=5000`)
    allWords.value = response.data
  } catch (error) {
    console.log('Failed to levels', error)
  } finally {
    isLoading.value = false
  }
}

const loadLevelDetails = async () => {
  if(levelId.value == undefined) return

  isLoading.value = true
  try {
    const response = await axios.get(`/api/levels/${levelId.value}`)
    level.value = response.data
  } catch (error) {
    console.log('Failed to levels', error)
  } finally {
    isLoading.value = false
  }
}

const loadLevelWords = async () => {
  levelId.value = route.query['levelid'] as String

  if(levelId.value == undefined) return

  isLoading.value = true
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
    isLoading.value = false
  }
}

const addWordToLevel = async (wordId: string) => {
  searchInput.value = ''
  searchResultWords.value = []
  isLoading.value = true
  try {
    const newLevelWord: LevelWord = {
      id: undefined,
      levelId: Number(levelId.value),
      wordId: Number(wordId)
    }
    await axios.post(`/api/levelWords`, newLevelWord)

    // Reload level words
    loadLevelWords()
  } catch (error) {
    console.log('Failed to load words', error)
  } finally {
    isLoading.value = false
  }
}

const removeWordFromLevel = async (wordId: string) => {
  isLoading.value = true
  try {
    const response = await axios.get(`/api/levelWords?wordId=${wordId}&levelId=${levelId.value}`)
    const toDeleteWordId = (response.data[0] as LevelWord).id
    await axios.delete(`/api/levelWords/${toDeleteWordId}`)

    // Reload level words
    loadLevelWords()
  } catch (error) {
    console.log('Failed to remove Word from level', error)
  } finally {
    isLoading.value = false
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
  searchResultWords.value = filteredWords
}

watch(route, loadLevelDetails, { immediate: true })
watch(route, loadLevelWords, { immediate: true })
watch(route, loadAllWords, { immediate: true })
</script>

<template>
  <div>
    <h1 class="mt-12 text text-3xl text-bold text-white text-center">Level {{ levelId }}</h1>
    <span class="text text-xl text-bold text-white mt-2">Words</span>
    <span
      class="text text-xl text-bold text-white transition-opacity transition-duration-1000"
      :class="`${isLoading ? 'opacity-100' : 'opacity-0'}`"
    >
      - loading</span
    >

    <input
      v-model="searchInput"
      @input="onSearchInputUpdated($event as InputEvent)"
      class="w-full mt-2 h-10 rounded-2xl px-5 ring-1 hover:ring-2 ring-mint-green-700 focus:outline-none focus:ring focus:ring-mint-green-800 hover:ring-mint-green-700"
      placeholder="search a word"
    />

    <div class="relative bg-gray-50">
      <div
        :class="`${(searchResultWords?.length ?? 0 > 0) ? 'opacity-100' : 'opacity-0'} `"
        class="absolute z-50 transition outline outline-gray-200 drop-shadow-lg w-full max-h-80 overflow-auto rounded-2xl bg-gray-50 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-xl [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <ul>
          <li
            class="px-4 py-2 hover:bg-gray-200 rounded-2xl"
            v-for="word in searchResultWords"
            :key="word.id"
            @click="addWordToLevel(word.id)"
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
          class="mt-2 relative"
          v-for="word in levelWords"
          :key="word.id"
        >
          <button
            class="p-2 absolute right-0"
            @click="removeWordFromLevel(word.id)"
          >
            <span class="text text-red-800">X</span>
          </button>
          <p class="text text-mint-green-800">{{ word.id }} - {{ word.japanese }} [{{ word.furigana }}]</p>
          <p class="text text-mint-green-800 ml-5">- {{ word.english }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
