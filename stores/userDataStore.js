import { defineStore } from "pinia";

export let useDataStore = defineStore("user", () => {
  let userData = ref("");
  let token = useCookie("user").value;

  async function getUserData() {
    try {
      let { data: res } = await useFetch(`/user/none`, {
        transform: (_res) => _res,
        method: "POST",
        headers: {
          token: token,
        },
      });
      userData.value = res.value.data;
    } catch (err) {
      console.log(err);
    }
  }

  function getDataEmpty() {
    userData.value = "";
  }

  return { userData, getUserData, getDataEmpty };
});
