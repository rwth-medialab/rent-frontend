import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";
import router from "./router";
// Vuetify
import "vuetify/styles";
import "v-calendar/dist/style.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import VCalendar from "v-calendar";

// import "./assets/main.css";

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});
app.use(vuetify);
// Use plugin with defaults
app.use(VCalendar, {});
app.use(createPinia());
app.use(router);

app.mount("#app");
