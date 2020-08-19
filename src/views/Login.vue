<template>
  <div class="container">
    <form class="login-form">
      <div>
        <label>Email</label>
        <Input
          :input-value="accountData.email"
          :error="$v.accountData.email.$error"
          field-name="email"
          placeholder="test@mail.com"
          @update="updateForm"
        />
      </div>
      <div>
        <label>Пароль</label>
        <Input
          :input-value="accountData.pass"
          :error="$v.accountData.pass.$error"
          input-type="password"
          field-name="pass"
          @update="updateForm"
        />
      </div>
      <button
        :disabled="$v.accountData.$invalid === true"
        class="login-button button button-primary"
        type="button"
        @click="logIn"
      >
        Войти
      </button>
      <div v-if="$v.accountData.$anyError" class="error-message">
        Вы ввели некорректные данные!
      </div>
      <div v-if="wrongEmailOrPass" class="error-message">
        Пользователь с таким Email или паролем не зарегистрирован.
      </div>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import isEqual from "lodash.isequal";
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { mapState, mapMutations } from "vuex";
import Input from "../components/Input";

export default {
  name: "Login",
  components: {
    Input,
  },
  mixins: [validationMixin],
  data() {
    return {
      accountData: {
        email: null,
        pass: null,
      },
      wrongEmailOrPass: false,
    };
  },
  computed: {
    ...mapState(["receivedUser"]),
  },
  validations: {
    accountData: {
      email: {
        required,
        email,
      },
      pass: {
        required,
      },
    },
  },
  methods: {
    ...mapMutations(["setIsAuthorized"]),
    updateForm({ fieldName, newValue }) {
      this.wrongEmailOrPass = false;
      this.$set(this.accountData, fieldName, newValue);
      this.$v.accountData[fieldName].$touch();
    },
    logIn() {
      if (!isEqual(this.accountData, this.receivedUser)) {
        this.wrongEmailOrPass = true;
        return false;
      }

      this.setIsAuthorized(true);
      Vue.localStorage.set("calculator_app_is_authorized", true);
      this.$router.push({ name: "Addition" });
    },
  },
};
</script>
