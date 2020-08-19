import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    receivedUser: null,
    isAuthorized: false,
  },
  mutations: {
    setReceivedUser(state, data) {
      state.receivedUser = Object.assign({}, data);
    },
    setIsAuthorized(state, data) {
      state.isAuthorized = data;
    },
  },
});
