<template>
  <div class="container">
    <header>
      <h1 class="home-page-heading">
        Калькулятор
      </h1>
    </header>
    <section class="description">
      <div class="row">
        <div class="one-half column">
          <h5>
            Приложение для сложения чисел
          </h5>
        </div>
        <div class="one-half column">
          <h4>
            Для того, чтобы воспользоваться функционалом калькулятора,
            пожалуйста, авторизуйтесь
          </h4>
          <button
            class="button button-primary"
            type="button"
            @click="goToLoginPage"
          >
            Войти
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "Home",
  methods: {
    goToLoginPage() {
      if (Vue.localStorage.get("calculator_app_is_authorized") === "true") {
        this.$router.push({ name: "Addition" });
      } else {
        this.$router.push({ name: "Login" });
      }
    },
  },
};
</script>
