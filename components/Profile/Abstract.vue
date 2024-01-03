<script setup>
let { data, statue } = defineProps(["data", "statue"]);
let emit = defineEmits(["update"]);

let isOpening = ref(false);

function closeForm() {
  isOpening.value = false;
}

function update() {
  emit("update");
}
</script>

<template>
  <p class="text-xl text-black/30 my-4 font-semibold ">ABSTRACT</p>

  <div class="text-lg p-4 flex flex-col gap-3 bg-white rounded-lg">
    <div class="flex items-start gap-4">
      <div class="w-10">
        <Icon
          name="material-symbols-light:card-travel"
          class="text-secondary text-3xl"
        />
      </div>

      <p>{{ data.abstract.job }}</p>
    </div>

    <div class="flex items-start gap-4">
      <div class="w-10">
        <Icon name="ph:graduation-cap-fill" class="text-secondary text-3xl" />
      </div>

      <p>{{ data.abstract.education }}</p>
    </div>

    <div class="flex items-start gap-4">
      <div class="w-10">
        <Icon name="fa6-solid:house-chimney" class="text-secondary text-3xl" />
      </div>

      <p>{{ data.abstract.address }}</p>
    </div>

    <div class="flex items-start gap-4">
      <div class="w-10">
        <Icon name="ph:heart-fill" class="text-secondary text-3xl" />
      </div>

      <p>{{ data.abstract.relation }}</p>
    </div>

    <div class="flex items-start gap-4">
      <div class="w-10">
        <Icon name="ic:sharp-settings" class="text-secondary text-3xl" />
      </div>

      <p>{{ data.statue }}</p>
    </div>

    <div v-if="statue === 'me'" class="w-full flex justify-center p-4">
      <button
        @click="isOpening = true"
        class="p-2 px-4 text-white bg-pramiary rounded-lg active:scale-95 transition duration-150"
      >
        Update your info
      </button>
    </div>
  </div>

  <ProfileAbstractForm
    v-if="isOpening"
    :data="data"
    @close="closeForm"
    @update="update"
  />
</template>

<style scoped></style>
