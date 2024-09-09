<script setup lang="ts">
import { RouterView } from 'vue-router'
import SideBar from './components/SideBar.vue'
import NavigationMenu from './components/NavigationMenu.vue'
</script>

<template>
  <SideBar
    v-slot="parentProps"
    :showLogo="true"
  >
    <NavigationMenu v-bind="parentProps" />
  </SideBar>
  <RouterView />
  <!-- <SideBar>
  </SideBar> -->
</template>

<style scoped></style>
