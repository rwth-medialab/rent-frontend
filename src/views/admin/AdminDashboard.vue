<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Offene Ausleihanfragen</v-card-title>
      <v-card-subtitle>
        Anfragen die noch abgeholt werden müssen</v-card-subtitle
      >
      <v-data-table
        dense
        :headers="openHeaders"
        :items="reservations"
        item-key="id"
      >
        <template v-slot:[`item.reserved_from`]="{ item }">
          <v-chip :color="getColor(item)" dark>
            {{ item.reserved_from }}
          </v-chip>
        </template>
        <template v-slot:[`item.reserved_until`]="{ item }">
          <v-chip :color="getColor(item)" dark>
            {{ item.reserved_until }}
          </v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small @click="handleReservation(item)"> mdi-pencil </v-icon>
        </template>
        <template v-slot:top>
          <v-dialog v-model="editRequestDialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Anfragen bearbeiten</span>
                <v-spacer></v-spacer
                ><v-icon @click="handleCamera()"> mdi-camera</v-icon>
              </v-card-title>

              <v-card-text>
                <v-container fluid>
                  <v-col
                    v-for="(item, index) in toReserveReservations"
                    :key="item.id"
                    cols="12"
                  >
                    <v-autocomplete
                      v-model="selectedItemsForReservation[index]"
                      :items="toReserveObjects[index]"
                      :label="toReserveNames[index] + ' (' + item.count + ')'"
                      :item-text="
                        (item) =>
                          `${toReserveIdentifierPrefix[index]}${item.internal_identifier}`
                      "
                      :item-value="
                        (item) =>
                          `{object_id: ${item.id}, reservation_id: ${toReserveReservations[index].id}}`
                      "
                      dense
                      chips
                      small-chips
                      deletable-chips
                      multiple
                    ></v-autocomplete>
                  </v-col>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="closeReservationDialog"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="saveReservationDialog"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
      </v-data-table></v-card
    >
    <v-card class="mt-2">
      <v-card-title>Überfällige Ausleihvorgänge</v-card-title>
      <v-card-subtitle>
        Anfragen die schon zurückgegeben worden sein sollten</v-card-subtitle
      >
      <v-data-table> </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { useUserStore } from "@/store/user.js";
import moment from "moment";
export default {
  name: "AdminDashboardView",
  setup() {
    const userStore = useUserStore();

    return { userStore };
  },
  data() {
    return {
      editRequestDialog: false,
      toReserveReservations: [],
      toReserveNames: [],
      toReserveObjects: [],
      toReserveIdentifierPrefix: [],
      toReserveCommitable: false,
      selectedItemsForReservation: [],
      openHeaders: [
        {
          text: "id",
          value: "operation_number",
          align: "start",
        },
        {
          text: "Von",
          value: "reserved_from",
        },
        {
          text: "Bis",
          value: "reserved_until",
        },
        {
          text: "Vorname",
          value: "reservername",
        },
        {
          text: "Nachname",
          value: "reserverlastname",
        },
        {
          text: "Username",
          value: "reserverusername",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
      reservations: [],
    };
  },
  watch: {
    editRequestDialog(val) {
      val || this.closeReservationDialog();
    },
    selectedItemsForReservation() {
      console.log(this.selectedItemsForReservation);
      let toReserveCommitable = true;
      this.toReserveReservations.forEach((item, index) => {
        if (
          typeof this.selectedItemsForReservation[index] === "undefined" ||
          !(item.count == this.selectedItemsForReservation[index].length)
        ) {
          toReserveCommitable = false;
        }
      });
      this.selectedItemsForReservation.forEach((item) => {
        console.log(item[0]);
      });
      this.toReserveCommitable = toReserveCommitable;
    },
  },
  async mounted() {
    this.reservations = await this.userStore.getReservations({
      open: true,
      unique: true,
    });
  },
  methods: {
    handleCamera() {
      console.log(this.editReservationNumber);
      //TODO
    },
    async handleReservation(item) {
      this.toReserveReservations = await this.userStore.getReservations({
        operation_number: item.operation_number,
      });
      console.log(this.toReserveReservations);
      await this.toReserveReservations.forEach(async (item, index) => {
        let type = await this.userStore.getObjectTypes({ id: item.objecttype });
        console.log(type);
        this.toReserveNames.splice(index, 1, type.name);
        this.toReserveIdentifierPrefix.splice(index, 1, type.prefix_identifier);
        await this.toReserveObjects.splice(
          index,
          1,
          await this.userStore.getObjects({
            type: item.objecttype,
          })
        );
      });
      this.editRequestDialog = true;
    },
    closeReservationDialog() {
      this.selectedItemsForReservation = [];
      this.editRequestDialog = false;
    },
    saveReservationDialog() {
      if (!this.toReserveCommitable) {
        console.log("Not every object is selected");
      } else {
        console.log("commiting reservation");
        this.editRequestDialog = true;
      }
    },
    loggedInRedirect() {},
    getColor(item) {
      const reserved_from = moment(item.reserved_from, "YYYY-MM-DD");
      const reserved_until = moment(item.reserved_until, "YYYY-MM-DD");
      const now = moment().startOf("day");
      if (reserved_from < now && reserved_until < now) {
        return "red";
      } else if (reserved_from < now) {
        return "yellow";
      } else {
        return "green";
      }
    },
  },
};
</script>
