<script setup>
import { storeToRefs } from "pinia";
import { useDataStore } from "../stores/userDataStore";

let store = useDataStore();
let { userData } = storeToRefs(store);
let route = useRoute();

let user = ref("");

let sideIcon = ref([
  { icon: "fa6-solid:house-chimney", name: "Home", href: "/", id: 1 },
  // {
  //   icon: "ph:messenger-logo-fill",
  //   name: "messenger",
  //   href: "/messenger",
  //   id: 2,
  // },
  {
    icon: "ph:user-light",
    name: "Profile",

    href: "",
    id: user.value.id,
  },
]);

function getProfileHref() {
  sideIcon.value[1].href = `/profile/${userData.value.id}`;
}
getProfileHref();

function linkStyle(e) {
  if (e === route.fullPath) {
    return "text-secondary border-s-secondary";
  } else {
    return "text-black/50  border-s-slate-100";
  }
}
</script>

<template>
  <div class="col-span-1 hidden lg:flex flex-col py-4 gap-10 sticky start-0">
    <div class="flex items-center gap-2 p-4 bg-white rounded-md">
      <img
        :src="'/users/' + userData.userImage"
        class="w-10 h-10 rounded-full"
      />

      <div>
        <p class="text-pramiary text-lg font-semibold truncate">
          {{ userData.name }}
        </p>

        <p class="text-black/50 font-semibold">@{{ userData.userName }}</p>
      </div>
    </div>

    <div class="bg-slate-200 rounded-md overflow-hidden">
      <ul class="flex flex-col gap-[1.5px]">
        <NuxtLink
          v-for="item in sideIcon"
          :to="item.href"
          :key="item.id"
          class="flex items-center"
        >
          <li
            :class="linkStyle(item.href)"
            class="px-6 p-3 hover:text-secondary transition-colors duration-150 bg-white w-full border-s-[6px]"
          >
            <Icon :name="item.icon" class="text-2xl" />

            <span class="text-2xl ms-4">{{ item.name }}</span>
          </li>
        </NuxtLink>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
