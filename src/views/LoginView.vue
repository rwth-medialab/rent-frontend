<template>
  <v-container>
    <v-form @submit.prevent="login">
      <v-text-field
        label="Username"
        type="username"
        v-model="username"
        :error-messages="usernameErrors"
        required
        autofocus
      />
      <v-text-field
        label="Password"
        type="password"
        v-model="password"
        :error-messages="passwordErrors"
        required
      />
      <v-btn type="submit">Login</v-btn>
    </v-form>
    <br />

    <v-alert :value="alert" type="error">
      {{ alertmessage }}
    </v-alert>
  </v-container>
</template>

<script>
import { useUserStore } from "@/store/user.js";
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";

const mustNotContainSpace = (value) => value.indexOf(" ") < 0;

export default {
  mixins: [validationMixin],
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  async mounted() {
    this.userStore.checkCredentials;
  },
  data() {
    return {
      username: "",
      password: "",
      alert: false,
      alertmessage: "",
    };
  },
  methods: {
    async login() {
      this.$v.$touch();
      if (!this.$v.$anyError) {
        const isSuccessfull = await this.userStore.signIn(
          this.username,
          this.password
        );
        if (isSuccessfull) {
          this.goBack();
        } else {
          this.alert = true;
          this.alertmessage = this.userStore.message;
        }
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
  validations: {
    username: { required, minLength: minLength(2), mustNotContainSpace },
    password: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(100),
      mustNotContainSpace,
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.minLength &&
        errors.push("Der Name muss mindestens 2 Zeichen lang sein");
      !this.$v.username.required &&
        errors.push("Nutzername darf nicht leer sein.");
      !this.$v.username.mustNotContainSpace &&
        errors.push("Nutzername darf kein Leerzeichen enthalten.");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.minLength &&
        errors.push("Passwort muss mindestens 8 Zeichen lang sein");
      !this.$v.password.required &&
        errors.push("Passwort darf nicht leer sein.");
      !this.$v.password.mustNotContainSpace &&
        errors.push("Passwort darf kein Leerzeichen enthalten.");
      return errors;
    },
  },
};
</script>
