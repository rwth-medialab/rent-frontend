import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import moment from "moment";
import axios from "axios";

const apiHost = import.meta.env.VITE_API_HOST;

export type userType = {
  expiry: string;
  token: string;
  user: {
    email: string;
    groups: [string];
    is_staff: boolean;
    is_admin: boolean;
    user_permissions: [string];
    username: string;
  };
};

export const useUserStore = defineStore("user", {
  state: () => ({
    user: useStorage("user", {} as userType),
    message: "",
  }),

  actions: {
    async fetchUser() {
      const res = await fetch(apiHost + "/user");

      const user = await res.json();
      this.user = user;
    },
    async signUp(username: string, password: string) {
      //TODO Copy Pasta
      const res = await fetch(apiHost + "/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const user = await res.json();
      this.user = user;
    },
    async signIn(username: string, password: string) {
      console.log("gell");
      if (
        username == "" ||
        password == "" ||
        username.includes(" ") ||
        password.includes(" ")
      ) {
        this.message =
          "Weder Nutzername noch Passwort darf leer sein oder ein Leerzeichen enthalten";
        return false;
      }
      const res = await fetch(apiHost + "/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const user = await res.json();
      if (res.ok) {
        console.log(user);
        this.user = user;
        console.log(this.user);
        this.message = "Erfolgreich reingeloggt, du wirst jetzt umgeleitet";
        return true;
      } else {
        console.log(user);
      }
      this.message = user["non_field_errors"][0];
      return false;
    },
    getReservations({
      open = false,
      unique = false,
      from = null,
      until = null,
      operation_number = null,
    }) {
      let url = apiHost + "/api/reservations/?";

      if (open) {
        url += "open=true&";
      }

      if (unique) {
        url += "unique=true&";
      }

      if (from != null) {
        url += "from=" + from + "&";
      }

      if (operation_number != null) {
        url += "operation_number=" + operation_number + "&";
      }

      if (until != null) {
        url += "until=" + until;
      }

      return axios
        .get(url, { headers: { Authorization: "Token " + this.user.token } })
        .then(function (response) {
          return response.data;
        });
    },
    getObjects({ type = null }) {
      let url = apiHost + "/api/rentalobjects/?";

      if (type != null) {
        url += "type=" + type + "&";
      }

      return axios
        .get(url, { headers: { Authorization: "Token " + this.user.token } })
        .then(function (response) {
          return response.data;
        });
    },
    getObjectTypes({ id = null }) {
      let url = apiHost + "/api/rentalobjecttypes/";
      if (id != null) {
        url += id + "/";
      } else {
        url += "?";
      }

      return axios
        .get(url, { headers: { Authorization: "Token " + this.user.token } })
        .then(function (response) {
          return response.data;
        });
    },
    postRentals(id: string, reservation_id: string) {
      //TODO
      const url = apiHost + "/api/rentalobjecttypes/";
      axios.post(url, {
        headers: { Authorization: "Token " + this.user.token },
        reservation_id: reservation_id,
        object_id: id,
      });
    },
    async signOut() {
      const res = await fetch(apiHost + "/api/auth/logout/", {
        method: "POST",
        headers: {
          Authorization: "Token " + this.user.token,
        },
        //body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        this.user = null;
      }
    },
    async checkCredentials() {
      //check if expiry date is in future return true in that case
      try {
        const valid = moment(this.user.expiry).isAfter();
        const res = await fetch(apiHost + "/api/auth/checkcredentials/", {
          method: "POST",
          headers: {
            Authorization: "Token " + this.user.token,
          },
          //body: JSON.stringify({ username, password }),
        });
        if (!valid || res.status != 200) {
          console.log("expected 401");
          this.user = null;
          return false;
        }
        return true;
      } catch (error) {
        this.user = null;
        return false;
      }
    },
    isStaff() {
      return this.user.user.is_staff;
    },
    has_inventory_rights() {
      return (
        this.user.user.user_permissions.find(
          (element) => element == "base.inventory_editing"
        ) == "base.inventory_editing"
      );
    },
    has_general_rights() {
      return (
        this.user.user.user_permissions.find(
          (element) => element == "base.general_access"
        ) == "base.general_access"
      );
    },
    has_lending_rights() {
      return (
        this.user.user.user_permissions.find(
          (element) => element == "base.lending_access"
        ) == "base.lending_access"
      );
    },
    async getUrl(path: string) {
      const res = await fetch(apiHost + path, {
        method: "GET",
        headers: {
          Authorization: "Token " + this.user.token,
        },
      });
      if (res.ok) {
        return await res.json();
      } else {
        return res;
      }
    },
  },
});
