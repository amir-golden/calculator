import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/addition",
    name: "Addition",
    component: () => import("../views/Addition.vue"),
    beforeEnter: (to, from, next) => {
      if (
        Vue.localStorage.get("calculator_app_is_authorized") === null ||
        Vue.localStorage.get("calculator_app_is_authorized") === "false"
      ) {
        next({ name: "Login" });
      } else {
        next();
      }
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
