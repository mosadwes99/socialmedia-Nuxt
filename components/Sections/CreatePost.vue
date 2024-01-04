<script setup>
import { storeToRefs } from "pinia";
import { useDataStore } from "../stores/userDataStore";

let store = useDataStore();
let { userData } = storeToRefs(store);
let token = useCookie("user").value;
let route = useRoute();
let emit = defineEmits(["update"]);

let isOpening = ref(false);
let post = reactive({
  title: "",
  img: [],
});

let isAdded = ref(false);

let imgError = ref("");

let imgsUrl = ref([]);

function closePost() {
  isOpening.value = false;
  post = {
    title: "",
    img: [],
  };
  imgError.value = "";
  imgsUrl.value = [];
}

function getImgUrl() {
  imgsUrl.value = [];
  post.img.forEach((file) => {
    let reader = new FileReader();
    reader.onload = function (event) {
      let imageDataUrl = event.target.result;
      saveUrl({ url: imageDataUrl, file: file });
    };
    reader.onerror = function (error) {
      console.error("Error reading the file:", error);
    };
    reader.readAsDataURL(file);
  });
  console.log("getimg");
}

function saveUrl(src) {
  imgsUrl.value.push(src);
}

function getImg(e) {
  let data = [];
  imgError.value = "";
  for (let i = 0; i < e.target.files.length; i++) {
    data = [...data, e.target.files[i]];
  }
  if (data.every((item) => item.type.includes("image"))) {
    post.img = [...post.img, ...data];
  } else {
    imgError.value = "Please select image file only";
  }
  getImgUrl();
}

function deleteImg(event) {
  let data = post.img;
  data = data.filter((item) => item !== event.file);
  post.img = data;
  getImgUrl();
}

function notify() {
  if (route.fullPath === "/") {
    isAdded.value = true;
    setTimeout(() => {
      isAdded.value = false;
    }, 2000);
  } else {
    emit("update");
  }
}

async function sendPost() {
  if (post.title || post.img.length) {
    try {
      let formData = new FormData();
      post.img.map((item) => formData.append("imgPost", item));
      let { data: res } = await useFetch(`/post`, {
        method: "POST",
        headers: { title: post.title, token },
        transform: (_res) => _res,
        body: formData,
      });
      if (res.value.msg == "post added successfully") {
        notify();
      } else {
        navigateTo("/login");
      }
    } catch (err) {
      console.error(err);
      navigateTo("/login");
    }
    closePost();
  } else {
    imgError.value = "there are no data";
  }
}

function removeError() {
  imgError.value = "";
}
</script>

<template>
  <div class="w-full">
    <div class="flex w-full items-center gap-2 p-2 bg-white rounded-md">
      <img
        :src="'/users/' + userData.userImage"
        class="w-10 h-10 rounded-full"
      />

      <div>
        <p
          class="text-pramiary/50 text-lg font-semibold truncate cursor-pointer"
          @click="isOpening = true"
        >
          what's new {{ userData.name }}?
        </p>
      </div>
    </div>
  </div>

  <div class="overflow-hidden">
    <Transition name="star">
      <div
        v-if="isAdded"
        class="w-full p-4 text-xl text-center text-green-800 bg-green-300 rounded-xl my-4"
      >
        <p>The post added successfully please visit your profile to see it.</p>
      </div>
    </Transition>
  </div>

  <div
    v-if="isOpening"
    @click.self="closePost"
    class="fixed top-0 start-0 w-full z-50 h-screen bg-black/50 flex justify-center items-center"
  >
    <div class="p-4 flex flex-col gap-5 w-1/2 bg-white rounded-md">
      <div class="w-full justify-between items-center flex">
        <div class="flex items-center gap-2">
          <img
            :src="'/users/' + userData.userImage"
            class="w-10 h-10 rounded-full"
          />

          <p class="text-pramiary text-xl font-semibold">
            {{ userData.name }}
          </p>
        </div>

        <Icon
          name="fa6-solid:x"
          class="text-xl cursor-pointer active:scale-95 transition duration-150"
          @click="closePost"
        />
      </div>

      <input
        type="text"
        @input="removeError"
        v-model="post.title"
        className="w-full
      focus:outline-black/30 outline outline-1 outline-black/10   rounded-md p-2 bg-transparent placeholder:text-black/50 "
        placeholder="what do you think ... "
      />

      <div class="px-2 flex flex-wrap justify-center gap-3">
        <div
          v-for="(item, i) in imgsUrl"
          @click="deleteImg(item)"
          :key="i"
          class="overflow-hidden cursor-pointer transition rounded-lg hover:outline-2 hover:outline hover:outline-red-500"
        >
          <img :src="item.url" alt="" class="object-cover w-32 h-32" />
        </div>
      </div>

      <div
        class="flex text-pramiary bg-slate-200 w-full p-2 rounded-lg justify-center"
      >
        <label for="img" class="flex items-center cursor-pointer"
          ><Icon name="ic:baseline-add-photo-alternate" class="text-2xl" />

          <p class="text-2xl">Upload Image</p>
        </label>

        <input
          type="file"
          multiple
          name="img"
          id="img"
          class="hidden"
          @change="getImg"
        />
      </div>
      <p v-if="imgError" class="text-sm text-red-500 -mt-4">{{ imgError }}</p>

      <div
        @click="sendPost"
        class="flex text-white text-2xl bg-[#1170ff] w-full p-2 rounded-lg cursor-pointer justify-center"
      >
        Post
      </div>
    </div>
  </div>
</template>

<style scoped>
.star-enter-active,
.star-leave-active {
  transition: 0.5s ease;
}

.star-enter-from {
  transform: translateY(-100%);
}
.star-leave-to {
  transform: translateY(0);
}
</style>
