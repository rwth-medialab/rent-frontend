<template>
  <v-app>
    <div>
      <v-app-bar dense dark>
        <div>
          <v-app-bar-title>
            <v-btn href="/">{{ siteName }}</v-btn>
          </v-app-bar-title>
        </div>
        <template>
          <v-tabs v-if="this.$router.currentRoute.path.includes('admin')">
            <v-tab to="/admin/rental/dashboard"> Verleih </v-tab>
            <v-tab to="/admin/inventory"> Inventar </v-tab>
            <v-tab v-if="inventory_rights" to="/admin/settings">
              Einstellungen
            </v-tab>
          </v-tabs>
        </template>
        <template
          v-if="this.$router.currentRoute.path.includes('admin/inventory')"
          v-slot:extension
        >
          <v-tabs align-with-title>
            <v-tab to="/admin/inventory/categories">Kategorien</v-tab>
            <v-tab to="/admin/inventory/objects">Objekte</v-tab>
          </v-tabs>
        </template>
        <template
          v-else-if="this.$router.currentRoute.path.includes('admin/settings')"
          v-slot:extension
        >
          <v-tabs align-with-title>
            <v-tab to="/admin/settings/texts">Standardtexte</v-tab>
            <v-tab to="/admin/settings/users">Nutzerverwaltung</v-tab>
          </v-tabs>
        </template>
        <template
          v-else-if="this.$router.currentRoute.path.includes('admin/rental')"
          v-slot:extension
        >
          <v-tabs align-with-title>
            <v-tab to="/admin/rental/dashboard"
              >Geräte- und Lizenzverleih</v-tab
            >
            <v-tab to="/admin/rental/onpremise">Vor Ort Nutzung</v-tab>
          </v-tabs>
        </template>
        <v-spacer></v-spacer>
        <v-btn
          v-if="staff"
          class="no-active"
          id="adminbutton"
          text
          to="/admin/rental/dashboard"
        >
          Admin
        </v-btn>
        <div v-if="staff">|</div>
        <v-btn icon to="/account" class="no-active">
          <v-icon> mdi-account </v-icon>
        </v-btn>
        |
        <v-btn v-if="!loggedIn" icon to="/login">
          <v-icon> mdi-login </v-icon>
        </v-btn>
        <v-btn v-else icon @click="logout()">
          <v-icon> mdi-logout </v-icon>
        </v-btn>
      </v-app-bar>
    </div>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style></style>

<script>
import { useUserStore } from "./store/user.js";
import "@/assets/custom.css";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data: () => {
    return {
      siteName: process.env.VUE_APP_NAME,
      loggedIn: false,
      staff: false,
      inventory_rights: false,
      general_rights: false,
      lending_rights: false,
    };
  },
  watch: {
    $route: function (newroute, oldroute) {
      if (oldroute.name == "login") {
        this.isCredentialsInvalid();
      }
    },
  },
  methods: {
    async logout() {
      await this.userStore.signOut();
      await this.isCredentialsInvalid();
      this.redirecToRoot();
    },
    redirecToRoot() {
      if (!this.staff && this.$router.currentRoute.path.includes("admin")) {
        this.$router.push("/");
      }
    },
    async isCredentialsInvalid() {
      this.loggedIn = await this.userStore.checkCredentials();
      // check if user is a staff member and if so show admin button
      if (this.loggedIn) {
        this.staff = this.userStore.isStaff();
        this.inventory_rights = this.userStore.has_inventory_rights();
        this.general_rights = this.userStore.has_general_rights();
        this.lending_rights = this.userStore.has_lending_rights();
      } else {
        this.staff = false;
      }
    },
  },

  async mounted() {
    document.title = this.siteName;
    await this.isCredentialsInvalid();
    this.redirecToRoot();
  },
  computed: {},
};
</script>
