<script setup lang="ts">
const props = defineProps({
  onDeleteClicked: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <div class="absolute w-full drop-shadow-lg outline outline-white origin-left h-2 bg-mint-green-800 rounded-lg flex justify-center items-center">
    <button
      class="p-2 translate-y-0"
      @click="props.onDeleteClicked!!"
    >
      <span class="text-red-800 font-outline font-bold text-3xl">X</span>
    </button>
  </div>
</template>
