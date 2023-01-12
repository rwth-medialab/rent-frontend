<script lang="ts">
import { useUserStore } from "@/stores/user";
import type { RentalObjectTypeType, TagType, TextType } from "@/ts/rent.types";
import "v-calendar/dist/style.css";
import dateFormat from "dateformat";
import VCalendar from "v-calendar";
export default {
  data: () => {
    return {
      rentableTypes: [] as RentalObjectTypeType[],
      tags: [] as TagType[],
      searchTerm: "" as string,
      neededTexts: ["frontpage"],
      texts: [] as TextType[],
      filterDialog: {
        open: false,
        selectedTags: [] as number[],
      },
    };
  },
  setup() {
    const userStore = useUserStore();
    userStore.$subscribe(async (mutation, state) => {
      // reset rentRange.end if start changes to prevent sideeffects
      if (mutation.type == "direct" && mutation.events.key == "start") {
        state.rentRange.end = null;
      }
      if (
        mutation.type == "direct" &&
        state.rentRange.start != null &&
        state.rentRange.end != null &&
        (mutation.events.key == "start" || mutation.events.key == "end")
      ) {
        userStore.available = await userStore.getFromURLWithAuth({
          url: "rentalobjecttypes/available",
          params: {
            from_date: dateFormat(state.rentRange.start, "yyyy-mm-dd"),
            until_date: dateFormat(state.rentRange.end, "yyyy-mm-dd"),
          },
        });
      }
    });
    return { userStore };
  },
  async mounted() {
    // get the stuf around first
    this.userStore.isLoggedIn = await this.userStore.checkCredentials();
    this.texts = await this.userStore.getFromURLWithoutAuth({
      url: "texts",
      params: { names: this.neededTexts },
    });
    this.tags = await this.userStore.getFromURLWithoutAuth({ url: "tags" });
    this.rentableTypes.splice(
      0,
      this.rentableTypes.length,
      ...(await this.userStore.getFromURLWithoutAuth({
        url: "rentalobjecttypes",
        params: { visible: true },
      }))
    );
  },
  methods: {
    filterTypes() {
      // converts the types and corresponding tags to a Json string and filters them for the searchterm
      let filtered = this.rentableTypes;
      if (this.filterDialog.selectedTags.length > 0) {
        filtered = filtered.filter((thing) =>
          this.filterDialog.selectedTags.every((tag) =>
            thing.tags.includes(tag)
          )
        );
      }
      filtered = filtered.filter((thing) =>
        (
          JSON.stringify(thing) +
          JSON.stringify(this.tags.filter((tag) => thing.tags.includes(tag.id)))
        )
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
      return filtered;
    },
  },
  components: { VCalendar },
};
</script>

<template>
  <!-- filterdialog-->
  <v-dialog v-model="filterDialog.open">
    <v-card>
      <v-card-title class="text-h4"
        >Filter
        <hr
      /></v-card-title>
      <v-card>
        <v-card-title> Tags </v-card-title>
        <v-card-text>
          <v-select
            :items="tags"
            v-model="filterDialog.selectedTags"
            item-title="name"
            item-value="id"
            multiple
          ></v-select
        ></v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
  <!-- Rich Text from /admin/settings/texts-->
  <v-card
    v-if="
      texts.find((x) => x.name == 'frontpage') &&
      texts.find((x) => x.name == 'frontpage').content != ''
    "
    class="ma-3"
    flat
  >
    <div
      class="ql-editor ql-snow frontpage"
      v-html="texts.find((x) => x.name == 'frontpage').content"
    ></div
  ></v-card>
  <div v-else class="ma-5"></div>
  <!-- Filter-->
  <v-card flat class="d-flex justify-center px-3">
    <div :class="$vuetify.display.mobile ? 'w-100' : 'w-75'">
      <v-text-field
        v-model="searchTerm"
        prepend-icon="mdi-magnify"
        class=""
      ></v-text-field>
    </div>
    <v-btn
      icon="mdi-filter"
      flat
      @click="filterDialog.open = !filterDialog.open"
    ></v-btn>
  </v-card>
  <div v-if="userStore.isLoggedIn" class="d-flex flex-column align-center justify-center">
    <div class="text-h5 text-center">Zeitraum in dem reserviert werden soll:</div>
    <div class="d-flex">
      <vc-date-picker
        v-model="userStore.rentRange.start"
        class="mr-2"
        mode="date"
        input="YYYY-MM-DD"
        :available-dates="{
          weekdays: [Number(userStore.settings.lenting_day.value)],
          start: new Date(),
        }"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <input
            class="bg-white border px-2 py-1 rounded"
            :value="inputValue"
            v-on="inputEvents"
          />
        </template>
      </vc-date-picker>
      <div>-</div>
      <vc-date-picker
        class="ml-2"
        mode="date"
        input="YYYY-MM-DD"
        v-model="userStore.rentRange.end"
        :available-dates="{
          weekdays: [Number(userStore.settings.returning_day.value)],
          start: userStore.rentRange.start,
        }"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <input
            class="bg-white border px-2 py-1 rounded"
            :value="inputValue"
            v-on="inputEvents"
          />
        </template>
      </vc-date-picker>
    </div>
  </div>
  <!-- Type enumeration-->
  <v-card class="d-flex flex-wrap justify-left" flat>
    <v-card
      class="ma-2 pa-2"
      :class="$vuetify.display.mobile ? 'w-100' : 'w-32'"
      v-for="thing in filterTypes()"
      :key="thing['id']"
      @click="$router.push('/type/' + thing['id'])"
    >
      <div class="d-flex flex-row">
        <v-avatar class="ma-3" size="90" rounded="0">
          <v-img cover aspect-ratio="1" :src="thing['image']"></v-img>
        </v-avatar>
        <v-card elevation="0" height="100" class="overflow-auto">{{
          thing.shortdescription
        }}</v-card>
      </div>
      <template v-slot:title
        ><div class="d-flex flex-wrap">
          <div class="mr-2">{{ thing["name"] }}</div>
          <v-chip v-for="tag in thing['tags']" :key="thing['id'] + tag">{{
            tags.filter((x) => x.id == tag)[0]["name"]
          }}</v-chip>
        </div>
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
            userStore.shoppingCart.filter((x) => x["id"] == thing["id"])[0]
              .count
          }}
          <template #append>
            <v-btn
              @click.stop
              @click="userStore.addToCart(thing)"
              icon="mdi-plus"
              size="small"
              :disabled="!(thing.id in userStore.available) || userStore.getNumberInCart(thing)>=userStore.available[thing.id].available"
            ></v-btn
          ></template>
        </v-chip>
        <v-btn
          v-else-if="userStore.isLoggedIn"
          @click.stop
          @click="userStore.addToCart(thing)"
          icon="mdi-basket"
          :disabled="!(thing.id in userStore.available) || userStore.getNumberInCart(thing)>=userStore.available[thing.id].available"
        ></v-btn>
        <v-chip
          v-if="thing.id in userStore.available"
          :color="userStore.available[thing.id].available>5?'green': (userStore.available[thing.id].available>0?'yellow': 'red')"
          >{{ userStore.available[thing.id].available }} verfügbar</v-chip
        >
      </v-card-actions>
    </v-card>
  </v-card>
</template>
