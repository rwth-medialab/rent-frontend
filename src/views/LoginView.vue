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
  async mounted() {
    this.userStore.checkCredentials 
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
      this.goBack();
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  },
};
</script>