<template>
  <v-container>
    <v-form @submit.prevent="login">
      <v-text-field label="User" type="username" v-model="user" required />
      <v-text-field label="Password" type="password" v-model="password" required />
      <v-btn type="submit">Login</v-btn>
    </v-form>
    {{userStore.user}}
  </v-container>
</template>

<script>
import { useUserStore } from '@/store/user.js'
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      user: "",
      password: "",
    };
  },
  methods: {
    async login() {
      await this.userStore.signIn(this.user, this.password);
    },
  },
};
</script>