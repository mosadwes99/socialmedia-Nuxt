<script setup>
let token = useCookie("user").value;
import { storeToRefs } from "pinia";
import { useDataStore } from "../stores/userDataStore";

let store = useDataStore();
let { userData } = storeToRefs(store);
let { getUserData } = store;
let data = ref("");
let id = ref("");
let isOptionOpen = ref(false);

async function getData() {
  try {
    data.value = "";
    let { data: res } = await useFetch(`http://localhost:3000/post`, {
      transform: (_res) => _res,
      method: "GET",
      headers: { token: token },
    });

    setTimeout(() => {
      data.value = res.value.data;
    }, 200);
  } catch (err) {
    console.log(err);
  }
}
getData();

function getId(e) {
  if (e === id.value) {
    isOptionOpen.value = !isOptionOpen.value;
  } else {
    isOptionOpen.value = true;
  }
  id.value = e;
}

async function acceptRequest(e) {
  try {
    let { data: res } = await useFetch(`http://localhost:3000/user/add/${e}`, {
      method: "PUT",
      headers: { token },
      transform: (_res) => _res,
    });
    console.log(res.value);
    await getUserData();
  } catch (e) {
    console.log(e);
  }
}
</script>

<template>
  <div class="lg:col-span-2 col-span-4 py-4 flex flex-col gap-4">
    <SectionsCreatePost />

    <div class="full flex flex-col gap-6">
      <SectionsPost
        v-if="data.length"
        v-for="post in data"
        :key="post._id"
        :post="post"
        @update="getData"
        @getId="getId"
        @closeOption="isOptionOpen = false"
        :data="data"
        :id="id"
        :isOptionOpen="isOptionOpen"
      />

      <p v-else class="p-4 text-center text-xl text-black/50">
        There Are No Posts ,Yet.
      </p>
    </div>
  </div>

  <div class="col-span-1 lg:block hidden py-4 sticky">
    <p class="text-xl text-black/30 my-4 font-semibold">Requests</p>

    <div class="flex flex-col gap-3 w-full">
      <div
        class="text-lg p-4 bg-white rounded-lg flex gap-2 items-center"
        v-if="userData.requestReceive.length"
        v-for="request in userData.requestReceive"
      >
        <img
          :src="'/users/' + request.userImage"
          @click="navigateTo(`/profile/${request._id}`)"
          class="rounded-full cursor-pointer w-12 h-12"
          alt=""
        />

        <div class="w-full flex flex-col gap-1">
          <p class="text-pramiary">{{ request.name }}</p>

          <button
            @click="acceptRequest(request._id)"
            class="p-2 px-4 w-full text-white bg-secondary rounded-lg active:scale-95 transition duration-150"
          >
            Submit
          </button>
        </div>
      </div>

      <p
        class="p-4 text-center text-xl w-full bg-white rounded-lg text-black/50"
        v-else
      >
        There Are No Requests.
      </p>
    </div>
  </div>

  <!-- <SectionsLoaing v-else /> -->
</template>

<style scoped></style>
