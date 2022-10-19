<template>
  <v-app>
    <div>
      <v-app-bar dense dark>
        <v-toolbar-title>
          <v-btn href="/">{{siteName}}</v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon to="/account">
          <v-icon>
            mdi-account
          </v-icon>
        </v-btn> |
        <v-btn icon href="/login">
          <v-icon>
            mdi-login
          </v-icon>
        </v-btn>
      </v-app-bar>
    </div>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { useUserStore } from './store/user.js'
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data:  () => {
    return {
      loggedIn: false,
      siteName: process.env.VUE_APP_NAME
    }
  },
  mounted() {
  } 
}
</script>
