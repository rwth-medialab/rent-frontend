<script lang="ts">
import "@/assets/custom.css";
import { useUserStore } from "@/stores/user.js";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  created() {
    this.$watch("userStore.isLoggedIn", () => {
      this.userStore.func_isStaff();
      this.userStore.func_has_inventory_rights();
      this.userStore.func_has_lending_rights();
    });
  },
  watch: {
    $route: function (_newroute, oldroute) {
      if (oldroute.name == "login") {
        this.userStore.checkCredentials();
      }
      this.currentLinks = this.getRouteLinks();
      if (
        !this.userStore.is_staff &&
        this.$router.currentRoute.value.path.includes("admin")
      ) {
        this.$router.push("/");
      }
    },
  },
  methods: {
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
      //reset permissions
      await this.userStore.signOut();
      this.$router.push("/");
    },
    toggleLogin() {
      if (this.userStore.isLoggedIn) {
        this.logout();
      } else {
        this.$router.push("/login");
      }
    },
  },
  async mounted() {
    document.title = this.siteName;
    this.userStore.refreshSettings();
    this.userStore.checkCredentials();
    this.currentLinks = this.getRouteLinks();
  },
  data: () => {
    return {
      siteName: import.meta.env.VITE_SITENAME,
      drawer: false,
      currentLinks: [],
      links: {
        admin: {
          inventory: {
            name: "Inventar",
            routefilter: "inventory",
            links: [
              { to: "/admin/inventory/rental", name: "Verleih" },
              { to: "/admin/inventory/onpremise", name: "Vorort" },
              { to: "/admin/inventory/tags", name: "Tags" },
              { to: "/admin/inventory/priorities", name: "Prioritäten" },
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
  <v-app :theme="userStore.theme">
    <v-navigation-drawer v-model="drawer" temporary right>
      <template v-slot:append>
        <v-btn
          class="w-100"
          @click="toggleLogin"
          :color="userStore.isLoggedIn ? 'red' : 'green'"
          >{{ userStore.isLoggedIn ? "Ausloggen" : "Einloggen" }}</v-btn
        ></template
      >
      <v-list nav dense>
        <template v-if="userStore.is_staff">
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
        <v-list-item to="/">
          <v-list-item-title> Verleih </v-list-item-title>
        </v-list-item>
        <v-list-item to="/onpremise">
          <v-list-item-title> Vorortnutzung </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar dense>
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          v-if="$vuetify.display.mobile"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
      </template>
      <template v-slot:title
        ><v-btn @click="$router.push('/')">{{ siteName }}</v-btn></template
      >
      <v-tabs
        align-tabs="title"
        v-if="
          !$vuetify.display.mobile &&
          $router.currentRoute.value.path.includes('admin')
        "
      >
        <v-tab to="/admin/rental"> Verleih </v-tab>
        <v-tab to="/admin/inventory"> Inventar </v-tab>
        <v-tab v-if="userStore.inventory_rights" to="/admin/settings">
          Einstellungen
        </v-tab>
      </v-tabs>
      <v-spacer v-if="!$vuetify.display.mobile"></v-spacer>
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
      <template v-slot:append>
        <!-- button for the admin area, only displayed for staff-->
        <v-btn
          v-if="!$vuetify.display.mobile && userStore.is_staff"
          id="adminbutton"
          to="/admin"
        >
          Admin
        </v-btn>
        <div v-if="!$vuetify.display.mobile && userStore.is_staff">|</div>

        <!-- Account button, leads to account overview -->
        <v-btn
          v-if="!$vuetify.display.mobile && userStore.isLoggedIn"
          icon="mdi-account"
          @click="$router.push('/account')"
        >
        </v-btn>
        <div v-if="!$vuetify.display.mobile && userStore.isLoggedIn">|</div>
        <!-- Button to switch between light and dark theme-->
        <v-btn
          :icon="
            userStore.theme == 'light'
              ? 'mdi-weather-sunny'
              : 'mdi-weather-night'
          "
          @click="
            userStore.theme = userStore.theme == 'light' ? 'dark' : 'light'
          "
        ></v-btn>
        <div v-if="!$vuetify.display.mobile">|</div>
        <!-- Login/Logout Button-->
        <v-btn
          v-if="!$vuetify.display.mobile"
          :icon="userStore.isLoggedIn ? 'mdi-logout' : 'mdi-login'"
          @click="toggleLogin()"
        >
        </v-btn>
        <div v-if="userStore.isLoggedIn">|</div>
        <v-btn v-if="userStore.isLoggedIn" icon @click="$router.push('/cart')">
          <v-badge floating :content="userStore.shoppingCart.length">
            <v-icon icon="mdi-basket"></v-icon>
          </v-badge>
        </v-btn>
      </template>
    </v-app-bar>
    <v-main fluid>
      <v-alert
        v-if="
          userStore.message.alert && !userStore.message.text.includes('html')
        "
        v-model="userStore.message['alert']"
        class="ma-3"
        :type="userStore.message['type']"
        :text="userStore.message['text']"
        closable
      />
      <div
        v-if="
          userStore.message.alert && userStore.message.text.includes('html')
        "
        v-html="userStore.message.text"
      ></div>
      <router-view />
    </v-main>
  </v-app>
</template>
<style>
.w-30 {
  width: 30% !important;
}
</style>
