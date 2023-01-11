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
    <v-row class="d-flex justify-center"
      ><v-col
        :cols="$vuetify.display.xs ? 'auto' : '3'"
        class="d-flex flex-column"
      >
        <v-avatar
          class="ma-2"
          rounded="0"
          :size="$vuetify.display.xs ? '150' : 'auto'"
        >
          <v-img cover aspect-ratio="1" :src="thing.image"></v-img>
        </v-avatar>
        <div>
          <v-chip
            v-if="
              userStore.checkCredentials() &&
              userStore.shoppingCart.filter((x) => x['id'] == thing['id'])
                .length > 0
            "
          >
            <template #prepend>
              <v-btn
                variant="plain"
                @click.stop
                @click="userStore.removeFromCart(thing)"
                icon="mdi-minus"
                size="small"
              ></v-btn
            ></template>
            {{
              userStore.shoppingCart.filter((x) => x["id"] == thing["id"])[0]
                .count
            }}
            <template #append>
              <v-btn
                variant="plain"
                @click.stop
                @click="userStore.addToCart(thing)"
                icon="mdi-plus"
                size="small"
                :disabled="
                  !(thing.id in userStore.available) ||
                  userStore.getNumberInCart(thing) >=
                    userStore.available[thing.id].available
                "
              ></v-btn
            ></template>
          </v-chip>
          <v-btn
            v-else-if="userStore.checkCredentials()"
            flat
            @click.stop
            @click="userStore.addToCart(thing)"
            icon="mdi-basket"
            :disabled="
              !(thing.id in userStore.available) ||
              userStore.getNumberInCart(thing) >=
                userStore.available[thing.id].available
            "
          ></v-btn>
          <v-chip
            v-if="thing.id in userStore.available"
            :color="
              userStore.available[thing.id].available > 5
                ? 'green'
                : userStore.available[thing.id].available > 0
                ? 'yellow'
                : 'red'
            "
            >{{ userStore.available[thing.id].available }} verfügbar</v-chip
          >
        </div>
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
          <div
            class="ql-editor ql-snow"
            v-html="thing.description"
          ></div></div></v-col
    ></v-row>
  </v-card>
</template>

<style></style>
