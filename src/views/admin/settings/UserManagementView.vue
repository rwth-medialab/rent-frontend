<script lang="ts">
import { useUserStore } from "@/stores/user";
export default {
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      users: [],
      headers: [
        { title: "Vorname", key: "first_name" },
        { title: "Nachname", key: "last_name" },
        { title: "Email", key: "email" },
        { title: "Superadmin", key: "is_superuser" },
        { title: "Mitarbeiter/Hiwi", key: "is_staff" },
      ],
    };
  },
  async mounted() {
    this.users = await this.userStore.getFromURLWithAuth({ url: "users" });
    console.log(this.users);
  },
};
</script>

<template>
  <v-card>
    <!-- this could break somehow props do not fit example: https://dev.vuetifyjs.com/en/components/data-tables/basics/#simple-checkbox -->
    <v-data-table :headers="headers" :items="users">
      <template v-slot:item.is_superuser="{ item }">
        <v-checkbox-btn
          v-model="item.props.title.is_superuser"
          disabled
        ></v-checkbox-btn>
      </template>
      <template v-slot:item.is_staff="{ item }">
        <v-checkbox-btn
          v-model="item.props.title.is_staff"
          disabled
        ></v-checkbox-btn>
      </template>
    </v-data-table>
  </v-card>
</template>
