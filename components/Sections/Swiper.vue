<script setup>
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Zoom } from "swiper/modules";

let { index, imgs } = defineProps(["index", "imgs"]);
let emit = defineEmits(["close", "prev", "next"]);
</script>

<template>
  <div
    @click.self="emit('close')"
    class="fixed top-0 start-0 w-full h-screen z-20 bg-black/70 flex items-center justify-center"
  >
    <div
      class="w-1/2 flex items-center justify-center gap-8"
      @click.self="emit('close')"
    >
      <button
        class="rounded-full bg-pramiary p-2 active:scale-90 disabled:bg-slate-500 disabled:active:scale-100"
        :disabled="index === 0"
        @click="emit('prev')"
      >
        <Icon
          name="material-symbols:arrow-back-ios-new"
          class="text-white text-2xl"
        />
      </button>

      <div class="w-full">
        <swiper :modules="[Zoom]" :slides-per-view="1" :zoom="true">
          <swiper-slide>
            <img
              :src="'/posts/' + imgs[index]"
              alt=""
              class="rounded-md mx-auto"
            />
          </swiper-slide>
        </swiper>
      </div>

      <button
        class="rounded-full bg-pramiary p-2 active:scale-90 disabled:bg-slate-500 disabled:active:scale-100"
        :disabled="index === imgs.length - 1"
        @click="emit('next')"
      >
        <Icon
          name="material-symbols:arrow-forward-ios-rounded"
          class="text-white text-2xl disabled:text-white/50"
        />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
