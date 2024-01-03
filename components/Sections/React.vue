<script setup>
let emit = defineEmits(["react"]);
</script>

<template>
  <div
    class="group-hover:flex w-40 bg-slate-200 px-4 p-2 rounded-full absolute -top-10 -start-4 hidden"
  >
    <img
      @click="emit('react', 'like')"
      class="w-8 hover:-translate-y-2 transition"
      src="../../assets/icon/thumbs-up-skin-1-svgrepo-com.svg"
      alt=""
    />

    <img
      @click="emit('react', 'love')"
      class="w-8 hover:-translate-y-2 transition"
      src="../../assets/icon/heart-svgrepo-com.svg"
      alt=""
    />

    <img
      @click="emit('react', 'smile')"
      class="w-8 hover:-translate-y-2 transition"
      src="../../assets/icon/slightly-smiling-face-svgrepo-com.svg"
      alt=""
    />

    <img
      @click="emit('react', 'sad')"
      class="w-8 hover:-translate-y-2 transition"
      src="../../assets/icon/sad-but-relieved-face-svgrepo-com.svg"
      alt=""
    />
  </div>
</template>

<style scoped></style>
