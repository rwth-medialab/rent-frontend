<template>
  <v-container my-5>
    <v-card>
      <v-toolbar dense>
        <v-tabs>
          <v-tab> SA </v-tab>
        </v-tabs>
      </v-toolbar>
    </v-card>
  </v-container>
</template>

<script>
import { useUserStore } from "@/store/user.js";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  name: "InventoryView",
  data: () => {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>
