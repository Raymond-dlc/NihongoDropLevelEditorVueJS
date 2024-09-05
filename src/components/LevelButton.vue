<script setup lang="js">
const props = defineProps({
  label: String
})
</script>

<template>
  <div class="w-20 h-20">
    <div class="relative w-20 h-20 flex justify-center items-center">
      <div class="select-none pointer-events-none absolute">
        <img
          class="select-none pointer-events-none flex"
          src="../assets/images/button_sakura.png"
        />
      </div>
      <div class="select-none pointer-events-none absolute flex justify-center items-center">
        <span class="select-none pointer-events-none flex text text-white text text-2xl text-bold align-middle">{{ props.label }}</span>
      </div>
    </div>
  </div>
</template>
