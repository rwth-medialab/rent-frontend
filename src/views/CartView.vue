<script lang="ts">
import { useUserStore } from "@/stores/user";
export default {
  data: () => {
    return {
      attributes: [{ bar: "red", dates: [], format: "yyyy-mm-dd" }],
    };
  },
  mounted() {},
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
};
</script>

<template>
  <v-card>
    <v-card v-for="thing in userStore.shoppingCart" :key="thing.id">
      <div>
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
      </div>
    </v-card>
  </v-card>
</template>
