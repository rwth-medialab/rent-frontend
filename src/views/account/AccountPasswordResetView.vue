<script lang="ts">
import { useUserStore } from "@/stores/user";
import type { UserStoreType, UserType, WorkplaceType } from "@/ts/rent.types";
import dateFormat from "dateformat";
export default {
  props: [
    'hash'
  ],
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  async created() {},
  data() {
    return {
        username: "",
        email: "",
    };
  },
  mounted() {
    console.log(this.$route.params)
    if (this.$route.params.hash){
      console.log(this.$route.params.hash)
    }
  },
  watch: {},
  methods: {
    resetPassword(){

    }
  },
};
</script>
<template>
  <v-card class="ma-3"> 
    <v-sheet>
        <v-form @submit.prevent="resetPassword">
            <v-text-field v-model="username">
            </v-text-field>
            <v-text-field v-model="email">

            </v-text-field>
        </v-form>
    </v-sheet>
    <v-sheet>
      {{ hash }}
    </v-sheet>
  </v-card>
</template>
