<script setup lang="ts">

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  options: {
    type: Array<String>,
    required: true
  }
})

const model = defineModel()
</script>

<template>
  <div class="mb-4">
    <label
      :for="name"
      class="block text-white font-bold"
    >
      {{ name }}
    </label>
    <select
      v-model="model"
      :id="name"
      :name="name"
      class="w-full mt-2 h-10 capitalize rounded-2xl px-5 ring-1 hover:ring-2 ring-mint-green-700 focus:outline-none focus:ring focus:ring-mint-green-800 hover:ring-mint-green-700"
    >
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option"
        class="capitalize"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>
