<script setup>
import { storeToRefs } from "pinia";
import { useDataStore } from "../stores/userDataStore";
import { onClickOutside } from "@vueuse/core";
import Cookies from "universal-cookie";

let store = useDataStore();
let { getDataEmpty } = store;
let { userData } = storeToRefs(store);

let token = useCookie("user").value;
let Cookie = new Cookies();
let query = ref("");
let data = ref([]);
let emptyData = ref("");
let errorMessage = ref("");
let target = ref(null);

async function getData() {
  data.value = [];
  emptyData.value = "";
  if (query.value) {
    try {
      let { data: res } = await useFetch(
        "http://localhost:3000/user/finduser",
        {
          transform: (_res) => _res,
          method: "POST",
          body: {
            query: query.value,
            token: token,
          },
        }
      );

      if (res.value.msg === "successful") {
        data.value = res.value.data;
      } else if ((res.value.msg === "successful") === "error token") {
      } else {
        emptyData.value = "there are not data";
      }
    } catch (error) {
      errorMessage.value = "there are an error";
      console.error(error);
      navigateTo("/login");
    }
  }
}

function logOut() {
  useCookie("user").value = null;
  getDataEmpty();
  navigateTo("/login");
  location.reload();
}
function inputBlur() {
  data.value = [];
  emptyData.value = "";
}
onClickOutside(target, () => {
  inputBlur();
});
</script>

<template>
  <div
    class="bg-white shadow-sm shadow-slate-200 border-b-2 border-slate-200 z-10 sticky top-0 "
  >
    <div class="px-5 py-3 lg:py-0  w-4/5 mx-auto  justify-center lg:justify-between flex">
      <div class="w-full lg:w-1/2 flex justify-center lg:justify-start  items-center px-2">
        <img src="../assets/img/logo.png" class="lg:w-12 w-8" />
        <p class="lg:text-xl flex items-center">
          <span class="font-semibold lg:text-3xl text-pramiary">C</span>ontainar
        </p>
      </div>

      <div class="w-1/2 hidden lg:flex items-center justify-between">
        <div
          class="mb-4 bg-slate-100 w-4/5 px-4 p-3 rounded-xl m-auto mt-4 relative"
        >
          <input
            type="text"
            id="search"
            @input="getData"
            v-model="query"
            class="w-10/12 ms-3 focus:outline-none bg-transparent placeholder:text-black/50"
            placeholder="Search"
          />

          <div
            v-if="data.length || emptyData"
            ref="target"
            class="bg-slate-300 rounded-md overflow-hidden w-full flex flex-col gap-[1px] z-10 absolute start-0 top-14 border shadow-lg"
          >
            <div
              v-if="data.length"
              v-for="item in data"
              :key="item.id"
              class="w-full bg-white p-4"
            >
              <NuxtLink
                class="flex gap-1 items-center"
                :to="'/profile/' + item._id"
                @click="inputBlur"
              >
                <img
                  :src="'/users/' + item.userImage"
                  class="w-8 h-8 rounded-full me-3"
                />

                <p>{{ item.name }}</p>
              </NuxtLink>
            </div>

            <div v-if="emptyData" class="w-full bg-white p-4">
              <p>There are no data</p>
            </div>
          </div>
        </div>

        <div class="flex items-center">
          <img
            :src="'/users/' + userData.userImage"
            class="w-10 h-10 rounded-full me-3"
          />

          <button
            class="bg-pramiary text-white p-2 px-3 rounded-md"
            @click="logOut"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
