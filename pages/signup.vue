<script setup>
import { onMounted } from "vue";

definePageMeta({
  layout: "log",
});

let view = ref(false);
let isLoading = ref(false);
let getData = reactive({
  userName: "",
  email: "",
  password: "",
  userName: null,
  confirmPassword: "",
});

let dataError = reactive({
  email: null,
  password: null,
  confirmPassword: null,
});

let errorMessage = ref("");

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
  //handdle userName data
  else if (e.target.name == "userName") {
    if (getData.userName.length > 2 && getData.userName.length < 20) {
      dataError.userName = "";
    } else if (getData.userName.length == 0) {
      dataError.userName = "userName is required";
    } else if (getData.userName.length <= 2) {
      dataError.userName = "It must be at least 3 characters long";
    } else {
      dataError.userName = "It must be less than 20 characters long";
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
  //handdle confirmPassword data
  else {
    if (getData.confirmPassword == getData.password) {
      dataError.confirmPassword = "";
    } else {
      dataError.confirmPassword = "They're not matching";
    }
  }
}

async function dataRquired(e) {
  for (let i = 0; i < 4; i++) {
    if (dataError[e.target[i].name] == null) {
      dataError[e.target[i].name] = `${e.target[i].name} is required`;
    }
  }
  console.log(dataError);
}

async function submitForm(e) {
  if (
    dataError.email == "" &&
    dataError.password == "" &&
    dataError.confirmPassword == ""
  ) {
    isLoading.value = true;
    try {
      let { data: res } = await useFetch(`/signup`, {
        transform: (_res) => _res.msg,
        method: "POST",
        body: {
          email: getData.email,
          password: getData.password,
          name: getData.userName,
        },
      });
      console.log(res.value);
      if (res.value === "Email is already exist") {
        errorMessage.value = "Email is already exist";
        isLoading.value = false;
      } else {
        navigateTo("/login");
      }
    } catch (error) {
      isLoading.value = false;
      errorMessage.value = "there are an error";
    }
  } else {
    dataRquired(e);
  }
}
onMounted(() => {
  view.value = true;
});
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
            Create Account
          </span>

          <form @submit.prevent="submitForm">
            <div className="w-full mb-2">
              <div className="text-lg mb-3 font-semibold  text-white/50">
                <label htmlFor="userName">
                  User Name <span className="text-red-600">*</span>
                </label>
              </div>

              <input
                name="userName"
                type="text"
                id="userName"
                @input="changeData"
                className="signInput"
                v-model="getData.userName"
              />

              <span className="text-red-500">{{ dataError.userName }}</span>
            </div>

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

            <div className="w-full mb-2">
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
            </div>

            <div className="w-full mb-[4rem]">
              <div className="text-lg mb-3 font-semibold text-white/50">
                <label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-600">*</span>
                </label>
              </div>
              <input
                name="confirmPassword"
                v-model="getData.confirmPassword"
                type="password"
                id="confirmPassword"
                @input="changeData"
                className=" signInput"
              />
              <span className="text-red-500">
                {{ dataError.confirmPassword }}
              </span>
              <span className="text-red-500">{{ errorMessage }}</span>
            </div>

            <button v-if="isLoading" className="submitButton ">
              <div className="submitSpinner"></div>
            </button>

            <button v-else className="submitButton ">SIGN UP</button>
          </form>

          <div
            className="text-center text-white/50 text-[18px] mt-[12px] font-semibold font-sans  "
          >
            <span>Already have account, </span>
            <span
              className="focus:underline text-orange-400 cursor-pointer"
              @click="navigateTo('/login')"
            >
              Sign in
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.sign-enter-active,
.sign-leave-active {
  transition: opacity 0.5s ease;
}

.sign-enter-from,
.sign-leave-to {
  opacity: 0;
}
</style>
