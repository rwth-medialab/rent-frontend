<script lang="ts">
import { useUserStore } from "@/stores/user";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      headers: ["abc", "abc"],
      categories: [],
      objecttypes: {},
      objects: {},
      isCategoryEditDialogOpen: false,
      toBeEditedCategory: {},
      isTypeDetailsDialogOpen: false,
    };
  },
  async mounted() {
    this.updateData();
    console.log(this.categories);
  },
  methods: {
    openTypeDetailsDialog() {},
    async updateData() {
      this.categories.splice(
        0,
        this.categories.length,
        ...(await this.userStore.getFromURLWithAuth({ url: "categories" }))
      );
      const types = await this.userStore.getFromURLWithAuth({
        url: "rentalobjecttypes",
      });
      //to reduce network load. load every type and match them on the device
      let resulttypes = {};
      this.categories.forEach((category) => {
        resulttypes[category["id"]] = [];
        types.forEach((objtype) => {
          if (category["id"] == objtype["category"]) {
            resulttypes[category["id"]].splice(
              resulttypes[category["id"]].length,
              0,
              objtype
            );
          }
        });
      });
      this.objecttypes = resulttypes;
      console.log(resulttypes);
      console.log(this.objecttypes);
    },
    createEditedCategory() {
      console.log(this.toBeEditedCategory);
      console.log(
        this.userStore.postURLWithAuth({
          url: "/categories/",
          params: this.toBeEditedCategory,
        })
      );
      this.isCategoryEditDialogOpen = false;
      setTimeout(this.updateData, 200);
    },
    saveEditedCategory() {
      console.log(
        this.userStore.patchURLWithAuth({
          url: "/categories/" + this.toBeEditedCategory["id"],
          params: this.toBeEditedCategory,
        })
      );
      this.isCategoryEditDialogOpen = false;
      setTimeout(this.updateData, 200);
    },
    editCategory(value: number) {
      this.isCategoryEditDialogOpen = true;
      //copy the element to prevent side effects from ref values
      this.toBeEditedCategory = { ...this.categories[value] };
      delete this.toBeEditedCategory["rentalobjecttypes"];
    },
    //TODO delete function with extra accept function
  },
  watch: {
    isCategoryEditDialogOpen: function (newvalue, oldvalue) {
      if (!newvalue) {
        this.toBeEditedCategory = {};
      }
    },
  },
};
</script>

<template>
  <v-dialog v-model="isCategoryEditDialogOpen">
    <v-card>
      <v-card-title>
        <v-text-field
          label="Kategoriename"
          v-model="toBeEditedCategory['name']"
        ></v-text-field>
        <v-textarea
          label="Beschreibung"
          v-model="toBeEditedCategory['description']"
        ></v-textarea>
      </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer
        ><v-btn @click="isCategoryEditDialogOpen = false">Abbrechen</v-btn>
        <v-btn v-if="toBeEditedCategory['id']" @click="saveEditedCategory"
          >Speichern</v-btn
        >
        <v-btn v-else @click="createEditedCategory">Erstellen</v-btn>
      </v-card-actions></v-card
    >
  </v-dialog>
  <div class="d-flex flex-row mb-6">

  </div>
  <v-card
    class="categorycard"
    v-for="(category, index) in categories"
    :key="category.id"
  >
    <v-list>
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :subtitle="category.description">
            <template v-slot:title="title">
              {{ category.name }}
              <v-btn
                v-if="userStore.has_inventory_rights"
                size="small"
                flat
                icon="mdi-pencil"
                @click.stop
                @click="editCategory(index)"
              ></v-btn>
            </template>
          </v-list-item>
        </template>
        <v-list-item v-for="rentaltype in objecttypes[categories[index]['id']]">
          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" class="type-card">
                <div class="d-inline-flex">
                  <v-avatar class="ma-3" size="80" rounded="0">
                    <v-img
                      cover
                      aspect-ratio="1"
                      :src="rentaltype['image']"
                    ></v-img>
                  </v-avatar>
                  <div>
                    <v-card-title class="text-xs-h5">
                      {{ rentaltype["name"] }}
                    </v-card-title>

                    <v-card-actions>
                      <v-btn
                        class="ml-2"
                        variant="outlined"
                        size="small"
                        @click.stop
                        @click="action"
                      >
                        Details
                      </v-btn>
                    </v-card-actions>
                  </div>
                </div>
              </v-list-item>
            </template>
          </v-list-group></v-list-item
        >
        <v-list-item>
          <v-btn
            elevation="0"
            prepend-icon="mdi-plus"
            action
            @click.stop
            @click="isTypeDetailsDialogOpen = true"
            >Neuen Typ hinzufügen</v-btn
          >
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
  <v-card class="categorycard" v-if="userStore.has_inventory_rights">
    <v-list>
      <v-list-item>
        <v-btn
          elevation="0"
          prepend-icon="mdi-plus"
          action
          @click.stop
          @click="isCategoryEditDialogOpen = true"
          >Neue Kategorie hinzufügen</v-btn
        >
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>
.categorycard {
  margin: 1% !important;
}

.extend-icon {
  top: 50% !important;
}
.type-card {
  padding: 0 !important;
}
</style>
