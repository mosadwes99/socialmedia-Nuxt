import { defineStore } from "pinia";
import Cookies from "universal-cookie";

export let useLoginStore = defineStore("login", () => {
  let cookie = new Cookies();
  let user = cookie.get("user");
  

  let token = ref(user || null);

  function changeToken(e) {
    token.value = e;
  }

  return { token, changeToken };
});
