<template>
  <v-container my-5>
    <div class="categoryview">
      <v-layout wrap>
        <v-flex
          xs12
          sm6
          md4
          lg3
          v-for="(category, index) in categories"
          :key="index"
        >
          <v-card
            class="ma-3"
            outlined
            :href="'/admin/categories/' + category.id"
          >
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title class="text-h5 mb-1">
                  {{ category.name }}
                </v-list-item-title>
                <v-list-item-subtitle>{{
                  category.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
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
      categories: [
        { id: 1, name: "placeholder", description: "placeholdertext" },
      ],
    };
  },
  methods: {
    async updateData() {
      const targetUrl = "/api/categories/";
      this.categories = await this.userStore.getUrl(targetUrl);
    },
  },
  mounted() {
    this.updateData();
  },
};
</script>
