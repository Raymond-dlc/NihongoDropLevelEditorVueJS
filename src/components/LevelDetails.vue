<script setup lang="ts">
import type { Level } from '@/model/Level'
import type { Word } from '@/model/Word'
import type { LevelWord } from '@/model/LevelWord'
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const level = ref<Level>()
const words = ref<Word[]>()
const levelId = ref(route.query['levelid'] as String)

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
    const levelWords = levelWordsResponse.data as LevelWord[]

    console.log('levelwords: ', levelWords[0])
    const wordIds = levelWords.map((levelWord) => {
      console.log('levelWord: ' + levelWord.id + ' => ' + levelWord.wordId)
      return levelWord.wordId.toString()
    })
    words.value = (wordsResponse.data as Word[]).filter((word: Word) => {
      return wordIds.includes(word.id)
    })
  } catch (error) {
    console.log('Failed to load words', error)
  } finally {
    console.log('TODO: Handle loading')
  }
}

watch(route, loadLevelDetails, { immediate: true })
watch(route, loadLevelWords, { immediate: true })
</script>

<template>
  <div>
    <h1 class="mt-20 text text-3xl text-bold text-white text-center">Level {{ levelId }}</h1>
    <h4 class="text text-xl text-bold text-white">Words</h4>
    <div class="rounded rounded-2xl bg-gray-50 mt-5">
      <ul class="py-2 px-5">
        <li
        class="mt-2"
          v-for="word in words"
          :key="word.id"
        >
          <p class="text text-green-800">{{ word.id }} - {{ word.japanese }} [{{ word.furigana }}]</p>
          <p class="text text-green-800 ml-5">- {{ word.english }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
