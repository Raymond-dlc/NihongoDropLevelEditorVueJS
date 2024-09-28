<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ""
  },
  height: {
    type: String,
    default: "h-40"
  }
})

const model = defineModel<string>()
</script>

<template>
  <div class="mb-4">
    <label
      :for="name"
      class="block text-white font-bold"
    >
      {{ name }}
    </label>
    <textarea
      :name="name"
      class="w-full rounded-xl mt-4 p-4 rounded-2xl px-5 ring-1 hover:ring-2 ring-mint-green-700 focus:outline-none focus:ring focus:ring-mint-green-800 hover:ring-mint-green-700"
      :class="height"
      :placeholder="placeholder"
      v-model="model"
    ></textarea>
  </div>
</template>
