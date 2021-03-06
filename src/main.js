import Vue from "vue";
import VueLocalStorage from "vue-localstorage";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

require("@/assets/styles/normalize.css");
require("@/assets/styles/skeleton.css");
require("@/assets/styles/custom.css");

Vue.use(VueLocalStorage);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
