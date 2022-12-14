import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import moment from "moment";
import axios from "axios";

//TODO CHANGE ENV
const apiHost = import.meta.env.VITE_API_HOST + "/api";

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
    async getFromURLWithAuth({ url = "", params = {} }) {
      if (url.slice(0, 1) != "/") {
        url = "/" + url;
      }
      url = apiHost + url;
      if (url.slice(-1) != "/") {
        //strict ending in / is activated in Django
        url += "/";
      }
      if (Object.keys(params).length > 0) {
        const urlparams = new URLSearchParams(params);
        url += "?${urlparams}";
      }
      return await axios
        .get(url, {
          headers: { Authorization: "Token " + this.user.token },
        })
        .then(function (response) {
          return response.data;
        });
    },
    async patchURLWithAuth({ url = "", params = {} }) {
      if (url.slice(0, 1) != "/") {
        url = "/" + url;
      }
      url = apiHost + url;
      if (url.slice(-1) != "/") {
        //strict ending in / is activated in Django
        url += "/";
      }
      return await axios
        .patch(url, params, {
          headers: { Authorization: "Token " + this.user.token },
        })
        .then(function (response) {
          return response.data;
        });
    },
    async deleteURLWithAuth({ url = "" }) {
      if (url.slice(0, 1) != "/") {
        url = "/" + url;
      }
      url = apiHost + url;
      if (url.slice(-1) != "/") {
        //strict ending in / is activated in Django
        url += "/";
      }
      return await axios
        .delete(url, {
          headers: { Authorization: "Token " + this.user.token },
        })
        .then(function (response) {
          return response.data;
        });
    },
    async postURLWithAuth({ url = "", params = {} }) {
      if (url.slice(0, 1) != "/") {
        url = "/" + url;
      }
      url = apiHost + url;
      if (url.slice(-1) != "/") {
        //strict ending in / is activated in Django
        url += "/";
      }
      console.log(url);
      return await axios
        .post(url, params, {
          headers: { Authorization: "Token " + this.user.token },
        })
        .then(function (response) {
          return response.data;
        });
    },
    async signIn(username: string, password: string) {
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
      const res = await fetch(apiHost + "/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const user = await res.json();
      if (res.ok) {
        this.user = user;
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
    getCategories() {
      const targeturl = apiHost + "/api/categories/";
      const params = new URLSearchParams({
        type: null,
        category: "adsbsd",
        numbers: String(1),
      });
      return axios
        .get(targeturl, {
          headers: { Authorization: "Token " + this.user.token },
        })
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
    getObjectTypes({ id = null, category = null }) {
      let url = apiHost + "/api/rentalobjecttypes/";
      if (id != null) {
        url += id + "/";
      } else {
        url += "?";
      }
      const params = {};
      if (category != null) {
        params["category"] = category;
      }

      const urlparams = new URLSearchParams(params);

      return axios
        .get(url + "${urlsparams}", {
          headers: { Authorization: "Token " + this.user.token },
        })
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
      const res = await fetch(apiHost + "/auth/logout/", {
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
        const res = await fetch(apiHost + "/auth/checkcredentials/", {
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
  },
});
