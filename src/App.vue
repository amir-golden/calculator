<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  name: "App",
  mounted() {
    const user = {
      email: "user@gmail.com",
      pass: "123abC_!",
    };

    this.setReceivedUser(user);
  },
  methods: {
    ...mapMutations(["setReceivedUser"]),
  },
};
</script>
