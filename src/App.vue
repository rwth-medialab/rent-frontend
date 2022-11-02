<template>
  <v-app>
    <div>
      <v-app-bar dense dark>
        <v-toolbar-title>
          <v-btn href="/">{{ siteName }}</v-btn>
        </v-toolbar-title>
        <template v-if="!(this.$router.currentRoute.path.includes('admin') || false)" v-slot:extension>
          <v-tabs align-with-title>
            <v-tab to="/">Geräte- und Lizenzverleih</v-tab>
            <v-tab to="/onpremise" >Vor Ort Nutzung</v-tab>
          </v-tabs>
        </template>
        <template v-else v-slot:extension>
          <v-tabs align-with-title>
            <v-tab to="/admin/dashboard">Dashboard</v-tab>
            <v-tab to="/admin/categories" >Geräte- und Lizenzverwaltung</v-tab>
          </v-tabs>
        </template>
        <v-spacer></v-spacer>
        <v-btn v-if="staff" text href="/admin">
          Admin
        </v-btn>
        <div v-if="staff">
          |
        </div>
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
      staff: false,
    }
  },
  methods: {
    async logout() {
      await this.userStore.signOut()
      this.isCredentialsInvalid()
      this.$router.push('/')
    },
    async isCredentialsInvalid() {
      this.loggedIn = await this.userStore.checkCredentials()
      // check if user is a staff member and if so show admin button
      if (this.loggedIn) {
        this.staff = this.userStore.isStaff();
      }else{
        this.staff = false;
      }
    }
  },
  async mounted() {
    document.title = this.siteName;
    await this.isCredentialsInvalid();
    if(!this.staff && this.$router.currentRoute.path.includes('admin')){
      this.$router.push('/')
    }
  }
}
</script>
