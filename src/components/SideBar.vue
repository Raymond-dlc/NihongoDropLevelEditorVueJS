<script setup lang="ts">
import { ref } from 'vue'

const isExpanded = ref(true)

const props = defineProps({
  showLogo: {
    default: false,
    type: Boolean
  }
})

const toggleMenu = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <aside
    :class="`${isExpanded ? 'w-80' : 'w-24'}`"
    class="flex flex-col shrink-0 z-[9999999] bg-sakura overflow-auto no-scrollbar p-8 h-dvh duration-300 ease-in-out fixed md:static md:z-50"
  >
    <div class="relative">
      <img
        v-if="props.showLogo"
        class="w-16 mb-4 transition-* duration-[20000ms]"
        src="../assets/nihongo-drop-logo.bmp"
        :class="`${isExpanded ? 'rounded-xl' : 'rounded-md'}`"
        alt="Logo"
      />
      <button
        @click="toggleMenu"
        class="transition duration-300"
        :class="`${isExpanded ? 'absolute top-0 right-0 -rotate-180' : 'static'}`"
      >
        <span class="material-symbols-outlined text-white"> keyboard_double_arrow_right </span>
      </button>

      <div>
        <slot :isExpanded></slot>
      </div>
    </div>
  </aside>
</template>

<style lang="css" scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
