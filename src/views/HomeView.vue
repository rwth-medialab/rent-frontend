<script lang="ts">
import { useUserStore } from "@/stores/user";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
};
</script>

<template>
  <v-card>Filler</v-card>
</template>
