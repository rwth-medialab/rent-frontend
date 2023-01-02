<script lang="ts">
import { useUserStore } from "@/stores/user";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  async created() {
    // do not allow person here if they are already logged in
    if ( await this.userStore.checkCredentials()) {
      this.$router.push("/");
    }
  },
  data() {
    return {
      valid: false,
      username: "",
      password: "",
      usernameRules: [
        (v: string) => !!v || "Der Nutzername darf nicht leer sein",
        (v: string) =>
          v.length > 3 || "Der Nutzername besteht aus mindestens 3 Zeichen",
        (v: string) =>
          /^[0-9a-zA-Z]+$/.test(v) ||
          "Der Nutzername besteht nur aus Ziffern und Buchstaben",
      ],
      passwordRules: [
        (v: string) => !!v || "Das Passwortfeld darf nicht leer sein",
        (v: string) =>
          v.length > 3 || "Das Passwort besteht aus mindestens 3 Zeichen",
      ],
    };
  },
  methods: {
    async login() {
      if (this.valid) {
        const isSuccessfull = await this.userStore.signIn(
          this.username,
          this.password
        );
        if (isSuccessfull) {
          this.goBack();
        }
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
  },
};
</script>

<template>
  <v-form class="ma-3" @submit.prevent="login" v-model="valid">
    <v-text-field
      label="Username"
      type="username"
      v-model="username"
      :rules="usernameRules"
      required
      autofocus
    />
    <v-text-field
      label="Password"
      type="password"
      :rules="passwordRules"
      v-model="password"
      required
    />
    <v-btn type="submit">Login</v-btn>
    <v-btn class="ml-3" to="register">register</v-btn>
  </v-form>
</template>
