<script setup lang="ts">
import WordService from '@/data/WordService'
import type { Word } from '@/model/Word'
import { onMounted, ref } from 'vue'

const words = ref<Word[]>([])
const generatedQuiz = ref('')

const loadData = () => {
  loadWords()
}

const loadWords = async () => {
  words.value = await WordService.getAllWords()
}

const generateQuiz = () => {
  const answer = words.value[Math.floor(Math.random() * words.value.length)]
  const decoy1 = wordToString(words.value[Math.floor(Math.random() * words.value.length)])
  const decoy2 = wordToString(words.value[Math.floor(Math.random() * words.value.length)])
  const decoy3 = wordToString(words.value[Math.floor(Math.random() * words.value.length)])
  const options = [wordToString(answer), decoy1, decoy2, decoy3]
  shuffle(options)
  generatedQuiz.value = `🎌🌸 Japanese Word Quiz 🌸🎌\n\nHow do you say "${answer.english}" in Japanese?\n\n${options[0]}\n${options[1]}\n${options[2]}\n${options[3]}\n\n#langtwt #japanese`
}

function shuffle(array: string[]) {
  let currentIndex = array.length

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
}

function wordToString(word: Word): string {
  let text = '🌸'
  text += word.japanese
  if (word.furigana) {
    text += `「${word.furigana}」`
  }
  return text
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
      <h3 class="text text-2xl font-bold text-sakura inline">Quiz</h3>
      <button @click="copyToClipboard(generatedQuiz)">
        <span class="material-symbols-outlined hover:text-mint-green-700"> content_copy </span>
      </button>
    </div>

    <textarea
      class="w-full h-80 outline outline-1 outline-black rounded-xl p-2"
      v-model="generatedQuiz"
    ></textarea>

    <button
      @click="generateQuiz"
      class="rounded-full mt-4 bg-mint-green-100 outline outline-2 outline-green-800 hover:bg-mint-green-500 px-4 py-3"
    >
      <span class="text text-s text-green-800 font-bold">Generate</span>
    </button>
  </div>
</template>
