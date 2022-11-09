<template>
  <v-container my-5>
    <div class="devicemanagement">
      <div>
        <h1>
          {{ category.name }}
        </h1>
        <h4>
          {{ category.description }}
        </h4>
      </div>
      <v-layout wrap>
        <v-flex
          xs12
          sm6
          md4
          lg3
          v-for="(rentalobjecttype, index) in category.rentalobjecttypes"
          :key="index"
        >
          <v-card
            class="ma-3"
            outlined
            :href="'/admin/objecttypes/' + rentalobjecttype.id"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  {{ rentalobjecttype.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  rentalobjecttype.description
                }}</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-avatar tile size="80" color="grey">
                <v-img :src="rentalobjecttype.image" />
              </v-list-item-avatar>
            </v-list-item>

            <v-card-actions> </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<script>
import { useUserStore } from "@/store/user.js";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  name: "DeviceManagementView",
  data: () => {
    return {
      category: { id: 1, name: "placeholder", description: "placeholdertext" },
      rentalobjecttypes: [],
    };
  },
  methods: {
    async updateData() {
      const targetUrl = "/api/categories/" + this.$route.params.id + "/";
      this.category = await this.userStore.getUrl(targetUrl);
      const rentalobjecttypesarray = [];
      for (const rentalobjecttype of this.category.rentalobjecttypes) {
        const result = await this.userStore.getUrl(
          "/api/rentalobjecttypes/" + rentalobjecttype + "/"
        );
        rentalobjecttypesarray.push(result);
      }
      this.category.rentalobjecttypes = rentalobjecttypesarray;
    },
  },
  mounted() {
    this.updateData();
  },
};
</script>
