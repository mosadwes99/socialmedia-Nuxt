<script setup>
import { storeToRefs } from "pinia";
import { useDataStore } from "../stores/userDataStore";

let store = useDataStore();
let { getUserData } = store;
let { userData } = storeToRefs(store);
let { data, statue } = defineProps(["data", "statue"]);
let emit = defineEmits(["update"]);

let token = useCookie("user").value;
let isLoading = ref(false);

async function changeUserImg(e) {
  isLoading.value = true;
  if (e.target.files[0].type.includes("image")) {
    try {
      let formData = new FormData();
      formData.append("userImg", e.target.files[0]);
      let { data: res } = await useFetch(`/user/changeimg`, {
        method: "PUT",
        headers: { token },
        body: formData,
        transform: (_res) => _res,
      });
      if (res.value.msg == "Image Changed successfully") {
        emit("update");
        await getUserData();
        setTimeout(() => {
          isLoading.value = false;
        }, 500);
      } else {
        navigateTo("/login");
      }
    } catch (err) {
      console.error(err);
      navigateTo("/login");
    }
  } else {
    console.log("Not  image");
  }
}

async function sendRequest() {
  try {
    let { data: res } = await useFetch(`/user/request/${data.id}`, {
      method: "PUT",
      headers: { token },
      transform: (_res) => _res,
    });
    console.log(res.value);
    emit("update");
    await getUserData();
  } catch (e) {
    console.log(e);
  }
}
async function cancelRequest() {
  try {
    let { data: res } = await useFetch(`/user/request/${data.id}`, {
      method: "DELETE",
      headers: { token },
      transform: (_res) => _res,
    });
    console.log(res.value);
    emit("update");
    await getUserData();
  } catch (e) {}
}
async function acceptRequest() {
  try {
    let { data: res } = await useFetch(`/user/add/${data.id}`, {
      method: "PUT",
      headers: { token },
      transform: (_res) => _res,
    });
    console.log(res.value);
    emit("update");
    await getUserData();
  } catch (e) {}
}
async function cancelFriend() {
  try {
    let { data: res } = await useFetch(`/user/add/${data.id}`, {
      method: "DELETE",
      headers: { token },
      transform: (_res) => _res,
    });
    console.log(res.value);
    emit("update");
    await getUserData();
  } catch (e) {}
}

let friendButton = computed(() => {
  if (userData.value.requestSent.some((item) => item == data.id)) {
    return "cancelRequest";
  } else if (
    userData.value.requestReceive.some((item) => item._id == data.id)
  ) {
    return "confirmRequest";
  } else if (userData.value.friends.some((item) => item == data.id)) {
    return "deleteFriend";
  } else {
    return "sendRequest";
  }
});
</script>

<template>
  <div
    v-if="data"
    class="w-full bg-white rounded-lg p-5 flex flex-col justify-center items-center gap-2"
  >
    <div class="relative">
      <img
        :src="'/users/' + data.userImage"
        :alt="data.userImage"
        class="rounded-full w-40 h-40"
      />

      <label for="userImg" class="bg-white"
        ><Icon
          v-if="statue === 'me'"
          name="ic:baseline-camera-enhance"
          class="text-orange-400 cursor-pointer absolute end-0 bottom-4 text-4xl"
      /></label>

      <input id="userImg" @change="changeUserImg" type="file" class="hidden" />
    </div>

    <p class="text-2xl text-pramiary">{{ data.name }}</p>

    <div v-if="statue !== 'me'">
      <button
        v-if="friendButton == 'cancelRequest'"
        @click="cancelRequest"
        class="p-2 px-4 text-white bg-secondary/50 rounded-lg active:scale-95 transition duration-150"
      >
        Request Sent
      </button>

      <button
        v-else-if="friendButton == 'deleteFriend'"
        @click="cancelFriend"
        class="p-2 px-4 text-white bg-secondary rounded-lg active:scale-95 transition duration-150"
      >
        Friend
      </button>

      <button
        v-else-if="friendButton == 'confirmRequest'"
        @click="acceptRequest"
        class="p-2 px-4 text-white bg-secondary rounded-lg active:scale-95 transition duration-150"
      >
        Confirm
      </button>

      <button
        v-else
        @click="sendRequest"
        class="p-2 px-4 text-white bg-secondary rounded-lg active:scale-95 transition duration-150"
      >
        Add Friend
      </button>
    </div>
  </div>
  <SectionsLoaing v-if="isLoading" />
</template>

<style scoped></style>
