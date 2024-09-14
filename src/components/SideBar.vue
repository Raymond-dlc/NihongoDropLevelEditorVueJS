<script setup lang="ts">
const props = defineProps({
  showLogo: {
    default: false,
    type: Boolean
  },
  isClosable: {
    defaut: false,
    type: Boolean
  },
  onToggled: {
    type: Function,
    required: true
  },
  isSideBarOpen: {
    default: true,
    type: Boolean
  }
})
</script>

<template>
  <aside
    :class="`${props.isSideBarOpen ? 'w-80' : isClosable ? 'w-0 opacity-0' : 'w-24 hover:w-32'}`"
    class="flex flex-col shrink-0 z-[9999999] bg-sakura overflow-auto no-scrollbar p-8 h-dvh duration-300 ease-in-out fixed md:static md:z-50"
  >
    <div class="relative">
      <img
        v-if="props.showLogo"
        class="w-16 mb-4 transition-* duration-[20000ms]"
        src="../assets/nihongo-drop-logo.bmp"
        :class="`${props.isSideBarOpen ? 'rounded-xl' : 'rounded-md'}`"
        alt="Logo"
      />
      <button
        @click="onToggled()"
        class="transition duration-300"
        :class="`${props.isSideBarOpen ? 'absolute top-0 right-0 -rotate-180' : 'static'}`"
      >
        <span
          v-if="isClosable"
          class="material-symbols-outlined text-white"
        >
          close
        </span>
        <span
          v-else
          class="material-symbols-outlined text-white"
        >
          keyboard_double_arrow_right
        </span>
      </button>
      <div>
        <slot :isSideBarOpen></slot>
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
