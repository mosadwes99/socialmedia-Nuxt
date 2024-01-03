
export default defineNuxtRouteMiddleware((to, from, next) => {
  let token = useCookie("user").value;
  if (token) {
    if (to.fullPath === "/login" || to.fullPath === "/signup") {
      return navigateTo("/");
    }
  } else {
    if (to.fullPath !== "/login" && to.fullPath !== "/signup") {
      return navigateTo("/login");
    }
  }
});
