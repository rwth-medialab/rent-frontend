<script lang="ts">
import "@/assets/custom.css";
import { useUserStore } from "@/stores/user.js";
import {useSettingsStore} from "@/stores/settings.js"
export default {
  setup() {
    const userStore = useUserStore();
    const settingsStore = useSettingsStore();
    return { userStore, settingsStore };
  },
  watch: {
    $route: function (newroute, oldroute) {
      if (oldroute.name == "login") {
        this.isCredentialsInvalid();
      }
      this.currentLinks = this.getRouteLinks();
    },
  },
  methods: {
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
    getRouteLinks() {
      let val = [];
      Object.keys(this.links.admin).forEach((element) => {
        if (
          this.$router.currentRoute.value.path.includes(
            this.links.admin[element].routefilter
          )
        ) {
          val = this.links.admin[element].links;
        }
      });
      return val;
    },
    async logout() {
      await this.userStore.signOut();
      await this.isCredentialsInvalid();
      if (
        !this.staff &&
        this.$router.currentRoute.value.path.includes("admin")
      ) {
        this.$router.push("/");
      }
    },
  },
  async mounted() {
    document.title = this.siteName;
    await this.isCredentialsInvalid();
    this.currentLinks = this.getRouteLinks();
  },
  data: () => {
    return {
      siteName: import.meta.env.VITE_SITENAME,
      drawer: false,
      loggedIn: false,
      staff: false,
      inventory_rights: false,
      general_rights: false,
      lending_rights: false,
      currentLinks: [],
      links: {
        admin: {
          inventory: {
            name: "Inventar",
            routefilter: "inventory",
            links: [
              { to: "/admin/inventory/rental", name: "Verleih" },
              { to: "/admin/inventory/onpremise", name: "Vorort" },
              { to: "/admin/inventory/objects", name: "Objekte" },
            ],
          },
          settings: {
            name: "Einstellungen",
            routefilter: "settings",
            links: [
              { to: "/admin/settings/texts", name: "Texte" },
              { to: "/admin/settings/users", name: "Nutzerverwaltung" },
            ],
          },
          rental: {
            name: "Verleih",
            routefilter: "/admin/rental",
            links: [
              {
                to: "/admin/rental/dashboard",
                name: "Geräte- und Lizenzverleih",
              },
              { to: "/admin/rental/onpremise", name: "Vorort Nutzung" },
            ],
          },
        },
      },
    };
  },
};
</script>

<template>
  <v-app :theme="settingsStore.theme">
    <v-navigation-drawer v-model="drawer" temporary right>
      <v-list nav dense>
        <template v-if="staff">
          <v-list-group no-action>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Admin"> </v-list-item>
            </template>
            <template v-for="(link, i) in links.admin" :key="i">
              <v-list-group no-active>
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>
                      {{ link.name }}
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <v-list-item
                  v-for="sublink in link.links"
                  :to="sublink.to"
                  :key="sublink.name"
                >
                  <v-list-item-title>{{ sublink.name }}</v-list-item-title>
                </v-list-item>
              </v-list-group>
            </template>
          </v-list-group>
        </template>
        <v-list-item to="/rental">
          <v-list-item-title> Verleih </v-list-item-title>
        </v-list-item>
        <v-list-item to="/onpremise">
          <v-list-item-title> Vorortnutzung </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dense>
      <v-app-bar-nav-icon
        v-if="$vuetify.display.mobile"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-app-bar-title>
        <v-btn href="/">{{ siteName }}</v-btn>
      </v-app-bar-title>
      <template
        v-if="
          !$vuetify.display.mobile &&
          $router.currentRoute.value.path.includes('admin')
        "
      >
        <v-tabs align-tabs="center">
          <v-tab to="/admin/rental"> Verleih </v-tab>
          <v-tab to="/admin/inventory"> Inventar </v-tab>
          <v-tab v-if="inventory_rights" to="/admin/settings">
            Einstellungen
          </v-tab>
        </v-tabs>
      </template>
      <!-- v-tabs below the current tabs-->
      <template
        v-if="
          !$vuetify.display.mobile &&
          $router.currentRoute.value.path.includes('admin')
        "
        v-slot:extension
      >
        <v-tabs align-tabs="center" fixed-tabs>
          <!-- current links is updated on every route change, makes it easier to adjust routes. if changes are needed, adjust getRouteLinks -->
          <v-tab v-for="link in currentLinks" :key="link.to" :to="link.to">
            {{ link.name }}</v-tab
          >
        </v-tabs>
      </template>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!$vuetify.display.mobile && staff"
        id="adminbutton"
        to="/admin"
      >
        Admin
      </v-btn>
      <div v-if="!$vuetify.display.mobile && staff">|</div>
      <v-btn
        v-if="!$vuetify.display.mobile && loggedIn"
        icon
        to="/account"
        class="no-active"
      >
        <v-icon icon="mdi-account" />
      </v-btn>
      <div v-if="!$vuetify.display.mobile && loggedIn">|</div>
      <v-btn icon="mdi-theme-light-dark" @click="settingsStore.theme = settingsStore.theme == 'light' ? 'dark' : 'light'"></v-btn>
      <div>|</div>
      <v-btn v-if="!loggedIn" icon to="/login" class="no-active">
        <v-icon class="no-active" icon="mdi-login" />
      </v-btn>
      <v-btn v-else-if="loggedIn" icon @click="logout()">
        <v-icon class="no-active" icon="mdi-logout" />
      </v-btn>
    </v-app-bar>
    <v-main fluid>
      <router-view />
    </v-main>
  </v-app>
</template>
<style scoped></style>
