<script setup>
let token = useCookie("user").value;
let route = useRoute();

let data = ref("");
let profileStatue = ref("");
let id = ref("");
let isOptionOpen = ref(false);

async function getData() {
  try {
    data.value = "";
    let { data: res } = await useFetch(`/user/${route.params.id}`, {
      transform: (_res) => _res,
      method: "POST",
      headers: { token: token },
    });

    setTimeout(() => {
      data.value = res.value.data;
      profileStatue.value = res.value.statue;
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
</script>

<template>
  <ClientOnly>
    <div v-if="data" class="col-span-3 grid grid-cols-3 gap-6">
      <div class="col-span-2 flex flex-col py-4 gap-4">
        <ProfileDetails
          :data="data"
          @update="getData"
          :statue="profileStatue"
        />

        <SectionsCreatePost v-if="profileStatue === 'me'" @update="getData" />

        <SectionsPost
          v-if="data.posts.length"
          v-for="post in data.posts"
          :key="post._id"
          :post="post"
          @update="getData"
          @getId="getId"
          @closeOption="isOptionOpen = false"
          :data="data"
          :id="id"
          :isOptionOpen="isOptionOpen"
        />

        <div v-else class="w-fill bg-slate-100 rounded-lg">
          <p class="p-4 text-center text-xl text-black/50">
            There Are No Posts ,Yet.
          </p>
        </div>
      </div>

      <div class="col-span-1 sticky">
        <ProfileAbstract
          :data="data"
          @update="getData"
          :statue="profileStatue"
        />
      </div>
    </div>
    <SectionsLoaing v-else />
  </ClientOnly>
</template>

<style scoped></style>
