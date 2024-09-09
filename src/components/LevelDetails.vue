<script setup lang="ts">
import type { Level } from '@/model/Level'
import type { Word } from '@/model/Word'
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const level = ref<Level>()
const words = ref<Word[]>()

const loadLevelDetails = async () => {
  const levelId = route.query['levelid'] as String

  try {
    const response = await axios.get(`/api/levels/${levelId}`)
    level.value = response.data
  } catch (error) {
    console.log('Failed to levels', error)
  } finally {
    console.log('TODO: Handle loading')
  }
}
const loadLevelWords = async () => {
  const levelId = route.query['levelid'] as String

  try {
    const response = await axios.get(`/api/words?levelId=${levelId}`)
    words.value = response.data
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
    <h1>Level details</h1>
    <p>
      {{ level }}
    </p>
    <p>
      {{ words }}
    </p>
  </div>
</template>
