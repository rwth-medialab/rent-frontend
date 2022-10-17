<template>
<v-app>
  <v-app-bar app>
    <v-tabs>
          <v-tab to="/">Home</v-tab>
          <v-tab to="/about">About</v-tab>
          <v-tab icon to="/login">L</v-tab>
        </v-tabs>
        <v-btn icon>
          <v-icon>mdi-login</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-account</v-icon>
        </v-btn>
    <!-- -->
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>
</template>

<script>

  export default {
    data: () => ({
      //
    }),
  }
</script>
