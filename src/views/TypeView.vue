<script lang="ts">
import { useUserStore } from "@/stores/user";
import type { RentalObjectTypeType, TagType } from "@/ts/rent.types";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      thing: {} as RentalObjectTypeType,
      tags: [] as TagType[],
    };
  },
  async mounted() {
    // get the stuf around first
    this.tags = await this.userStore.getFromURLWithoutAuth({ url: "tags" });
    // get the type
    this.thing = await this.userStore.getFromURLWithoutAuth({
      url: "/rentalobjecttypes/" + this.$route.params.id,
    });
    console.log(this.tags);
  },
};
</script>

<template>
  <!-- V-Card to wrap whole page-->
  <v-card class="ma-2 pa-2">
    <v-row class="d-flex flex wrap"
      ><v-col
        :cols="$vuetify.display.xs ? 'auto' : '3'"
        class="d-flex flex-column"
        ><v-avatar
          class="ma-2"
          rounded="0"
          :size="$vuetify.display.xs ? '150' : 'auto'"
        >
          <v-img cover aspect-ratio="1" :src="thing.image"></v-img>
        </v-avatar>
        <v-btn> <v-icon icon="mdi-basket"> </v-icon></v-btn>
      </v-col>
      <!--- Take up full 12 points on small displays to keep the Text readable-->
      <v-col :cols="$vuetify.display.xs ? '12' : '9'"
        ><div class="d-flex flex-wrap">
          <div class="text-h5 mr-2">{{ thing.name }}</div>
          <!-- filter the tags for those saved in the type-->
          <v-chip v-for="tag in thing.tags" :key="tag">
            {{ tags.filter((x) => x.id == tag)[0]["name"] }}</v-chip
          >
        </div>
        <hr />
        <div>
          Hersteller: {{ thing.manufacturer }} <br />
          Beschreibung: <br />
          {{ thing.description }}
        </div></v-col
      ></v-row
    >
  </v-card>
</template>

<style></style>
