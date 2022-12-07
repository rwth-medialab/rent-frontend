<template>
  <v-app>
    <!-- right drawer is broken, increases rendered size with white-->
    <v-navigation-drawer v-model="drawer" absolute>
      <v-list nav dense>
        <template v-if="staff">
          <v-list-group no-action>
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Admin</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <template v-for="(link, i) in tabs.admin">
              <template>
                <v-list-group no-action :key="i">
                  <template v-slot:activator>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ link.name }}
                        </v-list-item-title>
                      </v-list-item-content>
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
            </template>
          </v-list-group>
        </template>
        <!-- <v-list-group
          v-model="drawerAdminExpanded"
          v-if="staff"
          prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-item-title>Adminbereich</v-list-item-title>
          </template>
          <v-list-group
            :value="true"
            v-if="staff"
            prepend-icon="mdi-account-circle"
          >
            <template v-slot:activator>
              <v-list-item-title>Adminbereich2</v-list-item-title>
            </template>
          </v-list-group>
        </v-list-group> -->
      </v-list>
    </v-navigation-drawer>

    <div>
      <v-app-bar dense dark>
        <v-app-bar-nav-icon
          v-if="$vuetify.breakpoint.mobile"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <div>
          <v-app-bar-title>
            <v-btn href="/">{{ siteName }}</v-btn>
          </v-app-bar-title>
        </div>
        <template
          v-if="
            !$vuetify.breakpoint.mobile &&
            this.$router.currentRoute.path.includes('admin')
          "
        >
          <v-tabs>
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
            !$vuetify.breakpoint.mobile &&
            this.$router.currentRoute.path.includes('admin')
          "
          v-slot:extension
        >
          <v-tabs>
            <!-- current links is updated on every route change, makes it easier to adjust routes. if changes are needed, adjust getRouteLinks -->
            <v-tab v-for="link in currentLinks" :key="link.to" :to="link.to">
              {{ link.name }}</v-tab
            >
          </v-tabs>
        </template>
        <v-spacer></v-spacer>
        <v-btn
          v-if="!$vuetify.breakpoint.mobile && staff"
          class="no-active"
          id="adminbutton"
          text
          to="/admin/rental/dashboard"
        >
          Admin
        </v-btn>
        <div v-if="!$vuetify.breakpoint.mobile && staff">|</div>
        <v-btn
          v-if="!$vuetify.breakpoint.mobile && loggedIn"
          icon
          to="/account"
          class="no-active"
        >
          <v-icon> mdi-account </v-icon>
        </v-btn>
        <div v-if="!$vuetify.breakpoint.mobile && loggedIn">|</div>
        <v-btn v-if="!loggedIn" icon to="/login">
          <v-icon> mdi-login </v-icon>
        </v-btn>
        <v-btn v-else-if="loggedIn" icon @click="logout()">
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
      drawer: false,
      drawerAdminExpanded: false,
      currentLinks: [],
      tabs: {
        admin: {
          inventory: {
            expanded: false,
            name: "Inventar",
            routefilter: "inventory",
            links: [
              { to: "/admin/inventory/categories", name: "Kategorien" },
              { to: "/admin/inventory/objects", name: "Objekte" },
            ],
          },
          settings: {
            expanded: false,
            name: "Einstellungen",
            routefilter: "settings",
            links: [
              { to: "/admin/settings/texts", name: "Texte" },
              { to: "/admin/settings/users", name: "Nutzerverwaltung" },
            ],
          },
          rental: {
            expanded: false,
            name: "Verleih",
            routefilter: "rental",
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
  watch: {
    $route: function (newroute, oldroute) {
      if (oldroute.name == "login") {
        this.isCredentialsInvalid();
      }
      this.currentLinks = this.getRouteLinks();
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
    getRouteLinks() {
      let val = [];
      Object.keys(this.tabs.admin).forEach((element) => {
        if (
          this.$router.currentRoute.path.includes(
            this.tabs.admin[element].routefilter
          )
        ) {
          val = this.tabs.admin[element].links;
        }
      });
      return val;
    },
  },

  async mounted() {
    document.title = this.siteName;
    await this.isCredentialsInvalid();
    this.redirecToRoot();
    this.currentLinks = this.getRouteLinks();
  },
  computed: {},
};
</script>
