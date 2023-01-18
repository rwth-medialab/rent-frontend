<script lang="ts">
import type { ReservationType } from "@/ts/rent.types";
import { useUserStore } from "@/stores/user";
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import dateFormat from "dateformat";
export default {
  components: { Datepicker },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      reservations: {
        data: [],
        //the grouping keys are generated in updateData
        groupBy: [{ key: "grouping1" }, { key: "grouping2" }],
        sortBy: [{ key: "reserved_from" }],
        headers: [
          { title: "Actions", key: "actions", sortable: false },
          { title: "Gegenstand", value: "objecttype.name" },
          { title: "Anzahl", value: "count" },
          { title: "reserviert von", value: "reserved_from" },
          { title: "reserviert bis", value: "reserved_until" },
        ],
        open: true,
      },
      rentals: {
        data: [],
        headers: [
          {}
        ]
      },
      handleDialog: {
        open: false,
        reservations: [] as ReservationType[],
      },
    };
  },
  mounted() {
    this.updateData();
  },
  watch: {
    "reservations.open": function () {
      setTimeout(this.updateData, 500);
      //this.updateData();
    },
  },
  methods: {
    async updateData(reservation?: boolean, rental?: boolean) {
      if (typeof reservation == "undefined") {
        reservation = true;
      }
      if (typeof rental == "undefined") {
        rental = true;
      }
      if (reservation) {
        let reservationData = await this.userStore.getFromURLWithAuth({
          url: "reservations",
          params: { open: this.reservations.open },
        });
        this.reservations.data = reservationData.map((x) => {
          return {
            ...x,
            grouping1: "Abholdatum: " + x.reserved_from,
            grouping2:
              x.operation_number +
              " " +
              x.reserver.user.first_name +
              " " +
              x.reserver.user.last_name,
          };
        });
      }
      this.rentals.data = await this.userStore.getFromURLWithAuth({url: "rentals"})
      console.log(this.rentals.data)
    },
    async openHandleDialog(item) {
      this.handleDialog.reservations = this.reservations.data.filter(
        (x) =>
          x.reserver.id == item.reserver.id &&
          x.reserved_from == item.reserved_from
      );
      this.handleDialog.reservations.forEach(async (selectedReservation) => {
        selectedReservation["selectedObjects"] = [];
        selectedReservation["selectableObjects"] = (
          await this.userStore.getFromURLWithAuth({
            url:
              "rentalobjecttypes/" +
              selectedReservation.objecttype.id +
              "/freeobjects",
          })
        ).map((x) => {
          // merge the identifiers for better recognition
          return {
            ...x,
            merged_identifier:
              selectedReservation.objecttype.prefix_identifier +
              String(x.internal_identifier),
          };
        });
      });
      this.handleDialog.open = true;
    },
    turnReservationsIntoRentals() {
      this.userStore.postURLWithAuth({url: "rentals/bulk", params:this.handleDialog.reservations}).then( response => {
        this.handleDialog.open=false
        setTimeout(this.updateData, 500);
      }
      )
      
    },
    downloadForm(){
      this.userStore.downloadFilledInTemplateWithAuth({url: "reservations/download_form", params: this.handleDialog.reservations})
    }
  },
};
</script>

<template>
  <v-card>
    <v-data-table
      :headers="reservations.headers"
      :items="reservations.data"
      :group-by="reservations.groupBy"
      :sort-by="reservations.sortBy"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Reservierungen</v-toolbar-title>
          <v-spacer />
          <v-menu location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-checkbox
                  label="Nur offene Reservierungen anzeigen"
                  v-model="reservations.open"
                />
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="mr-2" @click="openHandleDialog(item.raw)">
          mdi-pencil
        </v-icon>
      </template>
      <template v-slot:no-data>
        <div class="text-center">Keine Reservierungen :'(</div>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-model="handleDialog.open" max-width="800px">
    <v-card class="pa-3">
      <div class="text-h4">Verleih</div>
      <v-card class="pa-3" v-for="reservation in handleDialog.reservations">
        <v-row>
          <v-col>
            <v-list>
              <v-list-item-title> Daten</v-list-item-title>
              <v-list-item>
                <v-list-item-subtitle>Name:</v-list-item-subtitle>
                {{
                  reservation.reserver.user.first_name +
                  " " +
                  reservation.reserver.user.last_name
                }}
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle>Verliehen von:</v-list-item-subtitle>
                {{ reservation.reserved_from }}
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle>Verliehen bis:</v-list-item-subtitle>
                {{ reservation.reserved_until }}
              </v-list-item>
            </v-list></v-col
          ><v-col
            ><v-list>
              <v-list-item-title>&nbsp;</v-list-item-title>
              <v-list-item>
                <v-list-item-subtitle>Gegenstand:</v-list-item-subtitle>
                {{ reservation.objecttype.name }}
              </v-list-item>
              <v-list-item>
                <v-list-item-subtitle>Anzahl:</v-list-item-subtitle>
                {{ reservation.count }}
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
        <v-alert
          type="error"
          v-if="reservation.selectedObjects.length > reservation.count"
        >
          Zu viele Gegenstände ausgewählt</v-alert
        >
        <v-select
          v-model="reservation.selectedObjects"
          :items="reservation.selectableObjects"
          multiple
          item-title="merged_identifier"
          item-value="id"
        ></v-select>
      </v-card>
      <v-card-actions
        ><v-spacer />
        <!-- enable button if number of selectedObjects equals the count  for each reservation-->
        <div
          class="text-red"
          v-if="
            handleDialog.reservations.filter(
              (x) => x.count != x.selectedObjects.length
            ).length != 0
          "
        >
          Die ausgewählten Anzahlen passen irgendwo nicht
        </div>
        <v-btn
          :disabled="
            handleDialog.reservations.filter(
              (x) => x.count != x.selectedObjects.length
            ).length != 0
          "
          @click="downloadForm"
          >Download Formular</v-btn
        >
        <v-btn
          :disabled="
            handleDialog.reservations.filter(
              (x) => x.count != x.selectedObjects.length
            ).length != 0
          "
          @click="turnReservationsIntoRentals"
          >Verleihen</v-btn
        >
      </v-card-actions></v-card
    >
  </v-dialog>
</template>
