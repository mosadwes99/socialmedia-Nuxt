<script setup>
import Cookies from "universal-cookie";

let { data } = defineProps(["data"]);
let emit = defineEmits(["close", "update"]);
let cookie = new Cookies();

let token = cookie.get("user");
let abstract = reactive({
  job: "",
  education: "",
  address: "",
  relation: "",
});
let statue = ref();
let isLoading = ref(false);

function resetForm() {
  abstract = {
    job: data.abstract.job,
    education: data.abstract.education,
    address: data.abstract.address,
    relation: data.abstract.relation,
  };
  statue.value = data.statue;
}

onMounted(() => {
  if (data) {
    resetForm();
  }
});

function closeForm() {
  emit("close");
}

async function SubmitForm() {
  isLoading.value = true;
  try {
    let { data: res } = await useFetch(`http://localhost:3000/user/abstract`, {
      transform: (_res) => _res,
      method: "PUT",
      headers: { token: token },
      body: { statue: statue.value, abstract: abstract },
    });
    console.log(res.value.msg);
    emit("update");
  } catch (err) {
    console.log(err);
  }
  setTimeout(() => {
    closeForm();
    isLoading.value = false;
  }, 500);
}
</script>

<template>
  <div
    @click.self="closeForm"
    class="fixed top-0 start-0 w-full h-screen z-50 bg-black/50 flex justify-center items-center"
  >
    <div class="p-4 flex flex-col gap-5 w-1/2 bg-white rounded-md">
      <div class="w-full justify-between items-center flex">
        <div class="flex items-center gap-2">
          <p class="text-pramiary text-xl font-semibold">Update Info</p>
        </div>

        <Icon
          @click="closeForm"
          name="fa6-solid:x"
          class="text-xl cursor-pointer active:scale-95 transition duration-150"
        />
      </div>

      <input
        v-model="abstract.job"
        type="text"
        className="w-full focus:outline-black/30 outline outline-1 outline-black/10   rounded-md p-2  placeholder:text-black/50 "
        placeholder="Work "
      />

      <input
        v-model="abstract.education"
        type="text"
        className="w-full focus:outline-black/30 outline outline-1 outline-black/10   rounded-md p-2  placeholder:text-black/50 "
        placeholder="Graduation "
      />

      <input
        v-model="abstract.address"
        type="text"
        className="w-full focus:outline-black/30 outline outline-1 outline-black/10   rounded-md p-2  placeholder:text-black/50 "
        placeholder="Address "
      />

      <input
        v-model="abstract.relation"
        type="text"
        className="w-full focus:outline-black/30 outline outline-1 outline-black/10   rounded-md p-2  placeholder:text-black/50 "
        placeholder="Marital Status "
      />

      <div class="w-full mb-6">
        <label for="statue" class="p-1 text-black/50">Account statue</label>
        <select
          v-model="statue"
          name="statue"
          id=""
          class="focus:outline-black/30 outline outline-1 block w-full outline-black/10 rounded-md p-2"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div
        class="text-white text-2xl w-fit ms-auto active:scale-95 bg-pramiary p-2 rounded-lg cursor-pointer"
        @click="SubmitForm"
      >
        Update
      </div>
    </div>
  </div>

  <SectionsLoaing v-if="isLoading" />
</template>

<style scoped></style>
