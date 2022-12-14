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
      toBeEditedObjectsType: {},
      openTypeImage: null,
      toBeUploadedImage: null,
    };
  },
  async mounted() {
    this.updateData();
    console.log(this.categories);
  },
  methods: {
    openTypeDetailsDialog(type) {
      this.isTypeDetailsDialogOpen = true;
      this.toBeEditedObjectsType = { ...type };
      this.toBeEditedObjectsType["image"] = this.toBeEditedObjectsType[
        "image"
      ].replace("http://", "https://");
      this.openTypeImage = this.toBeEditedObjectsType["image"];
      console.log(this.toBeEditedObjectsType);
    },
    saveEditedObjectsType() {
      let formData = new FormData();
      if (this.openTypeImage.includes("base64")) {
        //string containes 'base64' => uploaded image
        console.log(this.openTypeImage);
        formData.append(this.toBeUploadedImage["type"], this.toBeUploadedImage);
      }
      for (const key in this.toBeEditedObjectsType) {
        if (
          Object.prototype.hasOwnProperty.call(
            this.toBeEditedObjectsType,
            key
          ) &&
          key != "rentalobjects"
        ) {
          if (key == "tags" && this.toBeEditedObjectsType[key].length < 1) {
            continue;
          }
          if (
            key == "image" &&
            this.toBeEditedObjectsType[key].includes("http")
          ) {
            //image has not been changed => shouldnt be uploaded
            continue;
          }
          const element = this.toBeEditedObjectsType[key];
          formData.append(key, element);
        }
      }
      console.log(...formData);
      this.userStore.patchURLWithAuth({
        url: "rentalobjecttypes/" + this.toBeEditedObjectsType["id"],
        params: formData,
      });
      setTimeout(this.updateData, 200);
    },
    createEditedObjectsType() {},
    tempSaveTypeImage(e) {
      //temporary save the image as bas64 to display it temporarily
      const image = e.target.files[0];
      this.toBeUploadedImage = image;
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.openTypeImage = e.target.result;
      };
      this.toBeEditedObjectsType["image"] = this.toBeUploadedImage;
    },
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
      const objects = await this.userStore.getFromURLWithAuth({
        url: "rentalobjects",
      });
      let tempObjects = {};
      //TODO sort objects to type
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
    isTypeDetailsDialogOpen: function (newvalue, oldvalue) {
      if (!newvalue) {
        this.toBeEditedObjectsType = {};
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
  <v-dialog v-model="isTypeDetailsDialogOpen">
    <v-card class="pa-3">
      <h2 class="ma-2">Details von: {{ toBeEditedObjectsType["name"] }}</h2>
      <v-text-field
        label="Name"
        v-model="toBeEditedObjectsType['name']"
        :readonly="!userStore.has_inventory_rights()"
      ></v-text-field>
      <v-textarea
        label="Beschreibung"
        v-model="toBeEditedObjectsType['description']"
        :readonly="!userStore.has_inventory_rights()"
      ></v-textarea>
      <v-text-field
        label="Präfix für ID"
        v-model="toBeEditedObjectsType['prefix_identifier']"
        :readonly="!userStore.has_inventory_rights()"
      ></v-text-field>
      <v-checkbox
        label="In Verleihübersicht anzeigen"
        :readonly="!userStore.has_inventory_rights()"
        v-model="toBeEditedObjectsType['visible']"
      ></v-checkbox>
      <v-row>
        <v-avatar class="ma-3" size="100" rounded="0">
          <v-img cover aspect-ratio="1" :src="openTypeImage"></v-img>
          <!-- TODO replace "replace(http://, https://)" with something better, maybe django could send the correct protocol -->
          <!-- Suggestions between types-->
        </v-avatar>
        <v-col>
          <v-file-input
            class="mr-3"
            density="compact"
            accept="image/*"
            @change="tempSaveTypeImage"
            v-if="userStore.has_inventory_rights"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer
        ><v-btn @click="isTypeDetailsDialogOpen = false">Abbrechen</v-btn>
        <v-btn v-if="toBeEditedObjectsType['id']" @click="saveEditedObjectsType"
          >Speichern</v-btn
        >
        <v-btn v-else @click="createEditedObjectsType">Erstellen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="d-flex flex-wrap">
    <v-card
      class="categorycard w-100"
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
          <v-row class="ma-1">
            <v-list-item
              :class="{
                'w-30': !$vuetify.display.mobile,
                'w-100': $vuetify.display.mobile,
              }"
              v-for="rentaltype in objecttypes[categories[index]['id']]"
            >
              <v-list-group>
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props" class="type-card">
                    <div class="d-inline-flex">
                      <v-avatar class="ma-3" size="80" rounded="0">
                        <v-img
                          cover
                          aspect-ratio="1"
                          :src="
                            rentaltype['image'].replace('http://', 'https://')
                          "
                        ></v-img>
                        <!-- TODO replace "replace(http://, https://)" with something better -->
                      </v-avatar>
                      <div class="flex-column">
                        <v-card-title class="text-xs-h5 d-flex">
                          {{ rentaltype["name"] }}
                        </v-card-title>

                        <v-card-subtitle class="d-flex">
                          <v-chip
                            v-if="!rentaltype['visible']"
                            class=""
                            color="red"
                            >versteckt</v-chip
                          >
                          <v-chip v-else color="green">angezeigt</v-chip>
                        </v-card-subtitle>

                        <v-card-actions>
                          <v-btn
                            class="ml-2"
                            variant="outlined"
                            size="small"
                            @click.stop
                            @click="openTypeDetailsDialog(rentaltype)"
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
          </v-row>
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
  </div>
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

.w-30 {
  width: 30% !important;
}

.w-70 {
  width: 60% !important;
}

.titlerow {
  width: inherit;
}
</style>
