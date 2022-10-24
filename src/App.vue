<template>
  <v-app>
    <div>
      <v-app-bar dense dark>
        <v-toolbar-title>
          <v-btn href="/">{{siteName}}</v-btn>
        </v-toolbar-title>
        <template v-slot:extension>
          <v-tabs align-with-title >
            <v-tab to="/">Geräte- und Lizenzverleih</v-tab>
            <v-tab>Vor Ort Nutzung</v-tab>
            <v-tab v-if="loggedIn">Tab 3</v-tab>
          </v-tabs>
        </template>
        <v-spacer></v-spacer>
        <v-btn icon to="/account">
          <v-icon>
            mdi-account
          </v-icon>
        </v-btn> |
        <v-btn v-if="!loggedIn" icon href="/login">
          <v-icon>
            mdi-login
          </v-icon>
        </v-btn>
        <v-btn v-else icon @click="logout()">
          <v-icon>
            mdi-logout
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
  data: () => {
    return {
      loggedIn: false,
      siteName: process.env.VUE_APP_NAME,
    }
  },
  methods: {
    async logout() {
      await this.userStore.signOut()
      this.isCredentialsInvalid()
    },
    async isCredentialsInvalid() {
      this.loggedIn = await this.userStore.checkCredentials()
    }
  },
  mounted() {
    this.isCredentialsInvalid()
    document.title = this.siteName
  }
}
</script>
