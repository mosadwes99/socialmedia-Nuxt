<script setup>
import { UseTimeAgo } from "@vueuse/components";
import { useDataStore } from "../stores/userDataStore";
import { storeToRefs } from "pinia";

let store = useDataStore();
let { userData } = storeToRefs(store);
let { data, id } = defineProps(["data", "id"]);
let emit = defineEmits(["update"]);
let token = useCookie("user").value;

async function deleteComment() {
  try {
    let { data: res } = await useFetch(
      `http://localhost:3000/post/comment/${data._id}`,
      {
        transform: (_res) => _res,
        method: "DELETE",
        headers: { token: token },
        body: {
          postId: id,
        },
      }
    );
    emit("update");
  } catch (err) {
    console.log(err);
  }
}
</script>

<template>
  <div class="w-full my-4 px-2 gap-2 flex items-center">
    <img
      @click="navigateTo(`/profile/${data.createdBy._id}`)"
      :src="'/users/' + data.createdBy.userImage"
      alt=""
      class="w-10 h-10 rounded-full cursor-pointer"
    />

    <div class="bg-slate-100 p-2 rounded-lg w-full">
      <div class="flex justify-between">
        <p class="text-pramiary text-xl">{{ data.createdBy.name }}</p>

        <div class="flex items-center gap-4 text-sm text-black/50">
          <UseTimeAgo v-slot="{ timeAgo }" :time="data.createdAt">
            {{ timeAgo }}
          </UseTimeAgo>

          <Icon
            v-if="userData.id == data.createdBy._id"
            name="fa6-solid:x"
            class="hover:text-red-400 cursor-pointer text-xl transition active:scale-90 text-black"
            @click="deleteComment"
          />
        </div>
      </div>

      <p class="p-1">{{ data.content }}</p>
    </div>
  </div>
</template>

<style scoped></style>
