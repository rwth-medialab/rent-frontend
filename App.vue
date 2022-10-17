<template>
  <v-app>
    <v-app-bar dense>

      <v-toolbar-title>Page title</v-toolbar-title>
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
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data:function() {
return {
    loggedIn: false,
  };
}
}
</script>
