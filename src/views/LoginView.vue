<template>
  <v-container>
    <v-form @submit.prevent="login">
      <v-text-field label="User" type="username" v-model="user" required />
      <v-text-field label="Password" type="password" v-model="password" required />
      <v-btn type="submit">Login</v-btn>
    </v-form>
  <br/>

  <v-alert :value="alert" type="error">
      {{alertmessage}}
    </v-alert>
    {{ userStore.user }}
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
      alert: false,
      alertmessage: ""
    };
  },
  methods: {
    async login() {
      const isSuccessfull =await this.userStore.signIn(this.user, this.password);
      console.log(isSuccessfull)
      if(isSuccessfull) {
        this.goBack();
      }else{
        this.alert = true
        this.alertmessage = this.userStore.message
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  },
};
</script>