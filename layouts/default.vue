<script setup>
import { useDataStore } from "../stores/userDataStore";
import { storeToRefs } from "pinia";

let store = useDataStore();
let { getUserData } = store;
let { userData } = storeToRefs(store);

getUserData();
</script>

<template>
  <div class="bg-slate-200 h-screen overflow-y-auto " v-if="userData">
    <Nav />
    <div class="grid grid-cols-4 gap-6 w-4/5 mx-auto ">
      <SideBar />
      <slot />
    </div>
  </div>
  <SectionsLoaing v-else />
</template>

<style scoped></style>
