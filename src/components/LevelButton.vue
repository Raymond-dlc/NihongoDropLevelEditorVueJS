<script setup lang="js">
const props = defineProps({
  label: String
})
</script>

<template>
  <div>
    <div class="relative w-20 h-20 flex justify-center items-center">
      <div class="absolute">
        <img
          class="flex"
          src="../assets/images/button_sakura.png"
        />
      </div>
      <div class="absolute flex justify-center items-center">
        <span class="flex text text-white text text-2xl text-bold align-middle">{{ label }}</span>
      </div>
    </div>
  </div>
</template>
