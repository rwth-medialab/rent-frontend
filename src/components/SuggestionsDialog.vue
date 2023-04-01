<script setup lang="ts">
// composition api not option api
import { useUserStore } from "@/stores/user";
import { reactive } from "vue";
import type { RentalObjectTypeType, TagType } from "@/ts/rent.types";

const userStore = useUserStore();
let rentableTypes = reactive([] as RentalObjectTypeType[]);
let tags = reactive([] as TagType[]);

userStore
  .getFromURLWithoutAuth({
    url: "rentalobjecttypes",
    params: { visible: true },
  })
  .then((data) => (rentableTypes = data));
userStore.getFromURLWithoutAuth({ url: "tags" }).then((data) => (tags = data));
</script>

<template>
  <!-- displayed if something is added to cart and this dialog is currently not open-->
  <v-dialog v-model="userStore.suggestions.dialogOpen">
    <v-card class="text-center mx-auto" scrollbar>
      <v-sheet class="pa-2 text-h6">
        Hier werden Gegenstände gezeigt die zu dem gerade hinzugefügten
        Gegenstand passen:
      </v-sheet>
      <v-list>
        <v-list-item
          v-for="thing in rentableTypes.filter((x) =>
            userStore.suggestions.data.map((x) => x.suggestion).includes(x.id)
          )"
          :key="thing['id']"
        >
          <v-card @click="$router.push('/type/' + thing['id'])" class="w-100">
            <v-card flat class="d-flex flex-row h-100">
              <v-avatar class="ma-3" size="90" rounded="0">
                <v-img cover aspect-ratio="1" :src="thing['image']"></v-img>
              </v-avatar>
              <v-sheet>
                <v-card elevation="0" class="overflow-auto">{{
                  thing.shortdescription
                }}</v-card>
              </v-sheet>
            </v-card>
            <template v-slot:title>
              <v-card class="overflow-auto text-wrap" flat
                ><v-sheet
                  v-if="
                    userStore.suggestions.data.find(
                      (x) => x.suggestion == thing.id
                    ).description != ''
                  "
                  >Grund für den Vorschlag:</v-sheet
                ><br />
                {{
                  userStore.suggestions.data.find(
                    (x) => x.suggestion == thing.id
                  ).description
                }}</v-card
              >
              <v-card flat class="d-flex flex-wrap">
                <v-sheet class="mr-2">{{ thing["name"] }}</v-sheet>
                <v-chip v-for="tag in thing['tags']" :key="thing['id'] + tag">{{
                  tags.filter((x) => x.id == tag)[0]["name"]
                }}</v-chip>
              </v-card>
              <hr />
            </template>
            <v-card-actions @click.stop>
              <!-- display +- chip if objecttypecount>0 else display cart-->
              <v-chip
                v-if="
                  userStore.isLoggedIn &&
                  userStore.shoppingCart.filter((x) => x['id'] == thing['id'])
                    .length > 0
                "
              >
                <template #prepend>
                  <v-btn
                    @click.stop
                    @click="userStore.removeFromCart(thing)"
                    icon="mdi-minus"
                    size="small"
                  ></v-btn
                ></template>
                {{
                  userStore.shoppingCart.filter(
                    (x) => x["id"] == thing["id"]
                  )[0].count
                }}
                <template #append>
                  <v-btn
                    @click.stop
                    @click="userStore.addToCart(thing, false)"
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
                v-else-if="userStore.isLoggedIn"
                @click.stop
                @click="userStore.addToCart(thing, false)"
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
            </v-card-actions>
          </v-card>
        </v-list-item>
      </v-list>
      <v-card-actions
        ><v-spacer /><v-btn @click="userStore.suggestions.dialogOpen = false"
          >Schließen</v-btn
        ></v-card-actions
      >
    </v-card>
  </v-dialog>
</template>
