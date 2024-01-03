<script setup>
import { UseTimeAgo } from "@vueuse/components";
import { onClickOutside } from "@vueuse/core";
import { useDataStore } from "../stores/userDataStore";
import { storeToRefs } from "pinia";

let store = useDataStore();
let { userData } = storeToRefs(store);

let { post, id, isOptionOpen, data } = defineProps([
  "post",
  "id",
  "isOptionOpen",
  "data",
]);
let emit = defineEmits(["update", "getId", "closeOption"]);
let token = useCookie("user").value;

const target = ref(null);
let thisId = ref("");
let selectedImgs = ref([]);
let selectedIndex = ref(0);
let isSwiperOpen = ref(false);
let inputRef = ref(null);
let commentContent = ref("");
let globaReacts = [
  { icon: "ph:thumbs-up-duotone", color: "text-secondary ", name: "like" },
  { icon: "iconamoon:heart-fill", color: "text-red-500", name: "love" },
  { icon: "bi:emoji-smile-fill", color: "text-[#ffba2e]", name: "smile" },
  { icon: "fa6-solid:face-sad-tear", color: "text-[#ffba2e]", name: "sad" },
];
let isReact = ref(false);

let shownImgs = computed(() => {
  if (post.imgs.length >= 4) {
    return post.imgs.slice(0, 4);
  } else {
    return post.imgs;
  }
});

let gridStyle = computed(() => {
  if (shownImgs.value.length < 2) {
    return "col-span-2 row-span-2";
  } else if (shownImgs.value.length < 3) {
    return "col-span-2 row-span-1";
  } else {
    return "col-span-1 row-span-1";
  }
});

function openOption() {
  emit("getId", post._id);
  thisId.value = post._id;
}

function seeMoreStyle(e) {
  if (post.imgs.length > 4 && e === 3) {
    return true;
  } else {
    return false;
  }
}

function getSwiperImgs(e, i) {
  selectedImgs.value = e;
  selectedIndex.value = i;
  isSwiperOpen.value = true;
}

async function deletePost() {
  try {
    let { data: res } = await useFetch(
      `http://localhost:3000/post/${thisId.value}`,
      {
        transform: (_res) => _res,
        method: "DELETE",
        headers: { token: token },
      }
    );
    console.log(res.value.msg);
    emit("update");
  } catch (err) {
    console.log(err);
  }
}

function closeSwiper() {
  isSwiperOpen.value = false;
}

function prev() {
  selectedIndex.value -= 1;
}
function next() {
  selectedIndex.value += 1;
}
onClickOutside(target, () => {
  emit("closeOption");
});

function getInputFocus() {
  inputRef.value.focus();
}

async function getReact(e) {
  try {
    let reacts = [];
    let react = "";

    if (!e) {
      react = "like";
    } else {
      react = e;
    }
    reacts = post.reacts;
    if (reacts.some((item) => item.reactBy == userData.value.id)) {
      if (
        reacts.filter((item) => item.reactBy == userData.value.id)[0].react ==
        react
      ) {
        react = "none";
      }
    }
    let { data: res } = await useFetch(`http://localhost:3000/post/react`, {
      transform: (_res) => _res,
      method: "POST",
      headers: { token: token },
      body: {
        id: post._id,
        react: react,
      },
    });
    emit("update");
  } catch (e) {
    console.log(e);
  }

  console.log("momo");
}

function getIsReact() {
  let reacts = [];
  reacts = post.reacts;
  if (reacts.some((item) => item.reactBy == userData.value.id)) {
    isReact.value = true;
  } else {
    isReact.value = false;
  }
}

getIsReact();

let shownReact = computed(() => {
  if (isReact.value) {
    let reacts = [];
    let react = "";
    reacts = post.reacts;
    react = reacts.filter((item) => item.reactBy == userData.value.id)[0].react;
    return globaReacts.filter((item) => item.name == react)[0];
  }
});

async function getComment() {
  try {
    let { data: res } = await useFetch(`http://localhost:3000/post/comment`, {
      transform: (_res) => _res,
      method: "POST",
      headers: { token: token },
      body: {
        content: commentContent.value,
        id: post._id,
      },
    });
    emit("update");
  } catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <div class="bg-white p-2 rounded-lg">
    <div class="flex items-center w-full justify-between relative">
      <div class="flex items-center">
        <img
          @click="navigateTo(`/profile/${post.createdBy._id}`)"
          :src="'/users/' + post.createdBy.userImage"
          alt=""
          class="w-12 h-12 rounded-full me-2 cursor-pointer"
        />

        <div>
          <p class="text-[1.2rem] text-pramiary font-semibold">
            {{ post.createdBy.name }}
          </p>

          <p class="text-sm text-black/50">
            <UseTimeAgo v-slot="{ timeAgo }" :time="post.createdAt">
              {{ timeAgo }}
            </UseTimeAgo>
          </p>
        </div>
      </div>

      <Icon
        v-if="post.createdBy._id == userData.id"
        name="mdi:dots-vertical"
        class="text-3xl mx-2 cursor-pointer active:scale-90 transition hover:bg-black/10 rounded-full"
        @click="openOption"
      />

      <div
        v-if="isOptionOpen && post._id === id"
        ref="target"
        class="text-red-400 select-none absolute bg-white p-4 rounded-lg end-6 shadow-md -bottom-12"
      >
        <p @click="deletePost" class="cursor-pointer">Delete</p>
      </div>
    </div>

    <p class="p-2 py-4">{{ post.title }}</p>

    <div class="grid grid-cols-2 grid-rows-2 gap-2 p-4" v-if="shownImgs.length">
      <div
        v-for="(img, i) in shownImgs"
        :class="gridStyle"
        class="h-80 overflow-hidden relative flex justify-center items-center"
      >
        <img
          @click="getSwiperImgs(post.imgs, i)"
          :src="'/posts/' + img"
          alt=""
          class="object-cover w-full h-full rounded-lg cursor-pointer"
        />
        <div
          v-if="seeMoreStyle(i)"
          @click="getSwiperImgs(post.imgs, 3)"
          class="bg-black/70 absolute w-full h-full flex justify-center items-center rounded-md text-xl text-white top-0 cursor-pointer"
        >
          See More({{ post.imgs.length - 4 }})
        </div>
      </div>
    </div>

    <p class="w-full h-[1px] bg-black/20"></p>

    <div class="p-2 w-3/4 mx-auto flex justify-between">
      <div
        v-if="isReact"
        class="flex items-center gap-2 cursor-pointer group relative"
        :class="shownReact.color"
        @click="getReact()"
      >
        <Icon :name="shownReact.icon" class="text-xl transition" />

        <p class="text-xl">{{ shownReact.name }}</p>

        <SectionsReact @react="getReact" />
      </div>

      <div
        v-else
        class="flex items-center gap-2 cursor-pointer group relative"
        @click="getReact('')"
      >
        <Icon
          name="ph:thumbs-up-duotone"
          class="text-xl group-hover:text-secondary transition"
        />

        <p class="text-xl group-hover:text-secondary transition">like</p>

        <SectionsReact @react="getReact" />
      </div>

      <div
        class="flex items-center gap-2 cursor-pointer group"
        @click="getInputFocus"
      >
        <Icon
          name="iconamoon:comment-dots"
          class="text-xl group-active:scale-95 group-hover:text-secondary transition text-pramiary"
        />

        <p
          class="text-pramiary text-xl group-active:scale-95 transition group-hover:text-secondary"
        >
          Comment
        </p>
      </div>
    </div>
    <p class="w-full h-[1px] bg-black/20"></p>

    <div class="w-full py-6 px-2 gap-2 flex items-center">
      <img
        :src="'/users/' + userData.userImage"
        alt=""
        class="w-10 h-10 rounded-full cursor-pointer"
        @click="getInputFocus"
      />

      <form @submit.prevent="getComment" class="w-full">
        <input
          v-model="commentContent"
          type="text"
          ref="inputRef"
          class="outline outline-1 focus:outline-4 outline-black/10 focus:outline-secondary/10 p-2 px-6 w-full rounded-full"
          placeholder="Add a comment"
        />
      </form>
    </div>

    <div v-if="post.comments.length">
      <p class="w-full h-[1px] bg-black/10"></p>
      <SectionsComment
        v-for="(item, index) in post.comments"
        :key="index"
        :data="item"
        :id="post._id"
        @update="emit('update')"
      />
    </div>
  </div>

  <SectionsSwiper
    v-if="isSwiperOpen"
    :imgs="selectedImgs"
    :index="selectedIndex"
    @close="closeSwiper"
    @next="next"
    @prev="prev"
  />
</template>

<style scoped></style>
