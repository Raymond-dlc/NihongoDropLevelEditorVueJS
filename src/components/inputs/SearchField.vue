<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  onSearchInputUpdated: {
    type: Function,
    required: true
  },
  placeholder: {
    type: String,
    default: ""
  },
  defaultValue: {
    type: String
  },
})

const input = ref(props.defaultValue)

</script>

<template>
  <input
    v-model="input"
    @input="props.onSearchInputUpdated($event as InputEvent)"
    class="w-full mt-2 h-10 rounded-2xl px-5 ring-1 hover:ring-2 ring-mint-green-700 focus:outline-none focus:ring focus:ring-mint-green-800 hover:ring-mint-green-700"
    :placeholder="props.placeholder"
  />
</template>
