<script lang="ts">
import { useUserStore } from "@/stores/user";
import type { RentalObjectTypeType, TagType, TextType } from "@/ts/rent.types";
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
    return { userStore };
  },
  async mounted() {
    // get the stuf around first
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
    addToCart(objectType: RentalObjectTypeType) {
      //check if this type is already in cart
      if (
        this.userStore.shoppingCart.filter((x) => x.id == objectType.id)
          .length > 0
      ) {
        // increase count by one
        this.userStore.shoppingCart.filter((x) => x.id == objectType.id)[0]
          .count++;
      } else {
        // add type and add count = 1 to the object
        this.userStore.shoppingCart.push({ ...objectType, count: 1 });
      }
    },
    removeFromCart(objectType: RentalObjectTypeType) {
      if (
        this.userStore.shoppingCart.find((x) => x.id == objectType.id).count > 1
      ) {
        this.userStore.shoppingCart.find((x) => x.id == objectType.id).count--;
      } else {
        const index = this.userStore.shoppingCart.indexOf(
          this.userStore.shoppingCart.find((x) => x.id == objectType.id)
        );
        this.userStore.shoppingCart.splice(index, 1);
      }
    },
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
  components: {},
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
      v-if="texts.find((x) => x.name == 'frontpage') && texts.find((x) => x.name == 'frontpage').content !=''" class="ma-3" flat>
    <div
      class="ql-editor ql-snow frontpage"
      v-html="texts.find((x) => x.name == 'frontpage').content"
    ></div
  ></v-card>
  <!-- Filter-->
  <v-card class="d-flex justify-center px-3">
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
  <!-- Type enumeration-->
  <v-card elevation="0" class="d-flex flex-wrap justify-left">
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
      <v-card-actions>
        <!-- display +- chip if objecttypecount>0 else display cart-->
        <v-chip
          v-if="
            userStore.shoppingCart.filter((x) => x['id'] == thing['id'])
              .length > 0
          "
        >
          <template #prepend>
            <v-btn
              @click.stop
              @click="removeFromCart(thing)"
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
              @click="addToCart(thing)"
              icon="mdi-plus"
              size="small"
            ></v-btn
          ></template>
        </v-chip>
        <v-btn
          v-else
          @click.stop
          @click="addToCart(thing)"
          icon="mdi-basket"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>
