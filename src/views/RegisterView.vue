<template>
  <v-container>
    <v-form @submit.prevent="register">
      <v-text-field
        label="Vorname"
        type="firstname"
        v-model="firstname"
        :error-messages="usernameErrors"
        required
        autofocus
      />
      <v-text-field
        label="Nachname"
        type="lastname"
        v-model="lastname"
        :error-messages="usernameErrors"
        required
        autofocus
      />
      <v-text-field
        label="Email"
        type="email"
        v-model="email"
        :error-messages="emailErrors"
        required
        autofocus
      />
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
      <v-btn type="submit">Register</v-btn>
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
import {
  required,
  maxLength,
  minLength,
  email,
} from "vuelidate/lib/validators";

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
      email: "",
      firstname: "",
      lastname: "",
      alert: false,
      alertmessage: "",
    };
  },
  methods: {
    async register() {
      this.$v.$touch();
      if (!this.$v.$anyError) {
        console.log(this.email);
        const isSuccessfull = await this.userStore.register(
          this.username,
          this.password,
          this.email,
          this.firstname,
          this.lastname
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
    email: {
      required,
      email,
    },
  },
  computed: {
    usernameErrors() {
      const errors = [];
      if (!this.$v.username.$dirty) return errors;
      !this.$v.username.minLength &&
        errors.push("Der Name muss mindestens 2 Zeichen lang sein");
      !this.$v.username.required && errors.push("Darf nicht leer sein.");
      !this.$v.username.mustNotContainSpace &&
        errors.push("Darf kein Leerzeichen enthalten.");
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
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.password.email &&
        errors.push("Hat nicht das design einer Emailadresse");
      !this.$v.password.required && errors.push("Email darf nicht leer sein.");
      return errors;
    },
  },
};
</script>
