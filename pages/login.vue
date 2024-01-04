<script setup>
import { onMounted } from "vue";

definePageMeta({
  layout: "log",
});

//variables

let isLoading = ref(false);
let view = ref(false);
let getData = reactive({
  email: "",
  password: "",
});

let dataError = reactive({
  email: null,
  password: null,
});

let errorMessage = ref("");

onMounted(() => {
  view.value = true;
});

//function
function changeData(e) {
  errorMessage.value = "";
  //handdle email data
  if (e.target.name === "email") {
    if (getData.email.includes(".co") || getData.email.includes(".ne")) {
      dataError.email = "";
    } else if (getData.email === "") {
      dataError.email = "Email is required";
    } else {
      dataError.email = "Invalid email address";
    }
  }
  //handdle password data
  else if (e.target.name == "password") {
    if (getData.password.length >= 6) {
      dataError.password = "";
    } else if (getData.password === "") {
      dataError.password = "Password is required";
    } else {
      dataError.password = "Password must be at least 6 characters long";
    }
  }
}

async function submitForm(e) {
  if (dataError.email == "" && dataError.password == "") {
    isLoading.value = true;
    try {
      let { data: res } = await useFetch(
        `/login`,
        {
          transform: (_res) => _res,
          method: "POST",
          body: getData,
        }
      );

      if (res.value.msg === "login") {
        useCookie("user").value = res.value.token;
        navigateTo("/");
      } else if (res.value.msg === "The email not exist") {
        errorMessage.value = "The email not exist";
        isLoading.value = false;
      } else {
        errorMessage.value = "Password is wrong";
        isLoading.value = false;
      }

      // setLogin();
    } catch (error) {
      errorMessage.value = "there are an error";
      isLoading.value = false;
    }
  } else {
    dataRquired(e);
  }
}
</script>

<template>
  <div className="">
    <Transition name="sign">
      <div
        v-if="view"
        className="bg-black/40 flex justify-center items-center h-screen w-full"
      >
        <div
          className="bg-slate-800 border border-pramiary p-[56px] rounded-2xl w-full md:pt-30  md:w-[430px] h-screen md:h-auto md:block flex flex-col justify-center "
        >
          <div className="w-full flex justify-center mb-0">
            <img
              src=""
              class="w-80 cursor-pointer"
              @click="router.push({ name: 'home' })"
            />
          </div>

          <span
            className="text-[30px] font-bold text-white/50 -mt-3 mb-[18px] text-center inline-block w-full "
          >
            Sign In
          </span>

          <form @submit.prevent="submitForm">
            <div className="w-full mb-2">
              <div className="text-lg mb-3 font-semibold  text-white/50">
                <label htmlFor="email">
                  Email <span className="text-red-600">*</span>
                </label>
              </div>
              <input
                name="email"
                type="text"
                id="email"
                @input="changeData"
                className="signInput"
                v-model="getData.email"
              />
              <span className="text-red-500">{{ dataError.email }}</span>
            </div>

            <div className="w-full mb-[28px]">
              <div className="text-lg mb-3 font-semibold text-white/50">
                <label htmlFor="password">
                  Password <span className="text-red-600">*</span>
                </label>
              </div>
              <input
                name="password"
                type="password"
                id="password"
                @input="changeData"
                v-model="getData.password"
                className=" signInput"
              />
              <span className="text-red-500">{{ dataError.password }}</span>
              <span className="text-red-500">{{ errorMessage }}</span>
            </div>

            <button v-if="isLoading" className="submitButton ">
              <div className="submitSpinner"></div>
            </button>

            <button v-else className="submitButton ">SIGN IN</button>
          </form>

          <div
            className="text-center text-white/50 text-[18px] mt-[12px] font-semibold font-sans  "
          >
            <span>Don't have account, </span>
            <span
              className="focus:underline text-orange-400 cursor-pointer"
              @click="navigateTo('/signup')"
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
