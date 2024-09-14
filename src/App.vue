<script setup lang="ts">
import { RouterView } from 'vue-router'
import SideBar from './components/SideBar.vue'
import NavigationMenu from './components/NavigationMenu.vue'
import { ref } from 'vue'

const isSideBarOpen = ref<boolean>(true) // State to control the sidebar visibility

const onSideBarToggled = () => {
  isSideBarOpen.value = !isSideBarOpen.value
}
</script>

<template>
  <SideBar
    v-slot="parentProps"
    :showLogo="true"
    :isSideBarOpen="isSideBarOpen"
    :onToggled="
      () => {
        onSideBarToggled()
      }
    "
  >
    <NavigationMenu v-bind="parentProps" />
  </SideBar>
  <RouterView />
</template>

<style scoped></style>
