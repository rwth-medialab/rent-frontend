import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import axios from "axios";

import type { RentalObjectTypeType } from "@/ts/rent.types";

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
    message: { type: "info", text: null, alert: false } as {
      type: "error" | "success" | "warning" | "info";
      text: string;
      alert: boolean;
    },
    shoppingCart: useStorage("shoppingCart", [] as RentalObjectTypeType[]),
    theme: useStorage("settings", "dark"),
  }),

  actions: {
    async fetchUser() {
      const res = await fetch(apiHost + "/user");
      const user = await res.json();
      this.user = user;
    },
    alert(
      text: string,
      type: "error" | "success" | "warning" | "info",
      duration?: number
    ) {
      this.message["type"] = type;
      this.message["text"] = text;
      this.message["alert"] = true;
      const message = this.message;
      if (typeof duration == "undefined") {
        duration = 3000;
      }
      //display alert for a couple of seconds
      setTimeout(resetAlert, duration);

      function resetAlert() {
        message["alert"] = false;
      }
    },
    async getFromURLWithoutAuth({ url = "", params = {}, headers = {} }) {
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
        url += "?" + urlparams.toString();
      }

      return await axios
        .get(url, {
          headers: headers,
        })
        .then(function (response) {
          return response.data;
        })
        .catch((error) => {
          let msg = "";
          Object.keys(error["response"]["data"]).forEach(
            (errorkey) => (msg += error["response"]["data"][errorkey])
          );
          this.alert(msg, "warning", 10000);
        });
    },
    async getFromURLWithAuth({ url = "", params = {}, headers = {} }) {
      headers["Authorization"] = "Token " + this.user.token;
      return this.getFromURLWithoutAuth({
        url: url,
        params: params,
        headers: headers,
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
    async postURLWithAuth({ url = "", params = {}, headers = {} }) {
      headers["Authorization"] = "Token " + this.user.token;
      return this.postURLWithoutAuth({
        url: url,
        params: params,
        headers: headers,
      });
    },
    async postURLWithoutAuth({ url = "", params = {}, headers = {} }) {
      console.log(params);
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
          headers: headers,
        })
        .then(function (response) {
          return response.data;
        })
        .catch((error) => {
          let msg = "";
          Object.keys(error["response"]["data"]).forEach(
            (errorkey) => (msg += error["response"]["data"][errorkey])
          );
          this.alert(msg, "warning", 10000);
        });
    },
    //TODO move to axios + move this.alert
    async signIn(username: string, password: string) {
      if (
        username == "" ||
        password == "" ||
        username.includes(" ") ||
        password.includes(" ")
      ) {
        this.alert(
          "Weder Nutzername noch Passwort darf leer sein oder ein Leerzeichen enthalten",
          "warning"
        );
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
        this.alert("Erfolgreich eingeloggt", "success");
        return true;
      } else {
        console.log(user);
      }
      this.alert(user["non_field_errors"][0], "warning");
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
    async signOut() {
      const res = await fetch(apiHost + "/auth/logout/", {
        method: "POST",
        headers: {
          Authorization: "Token " + this.user.token,
        },
        //body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        this.user = {} as userType;
      }
    },
    async checkCredentials() {
      //check if expiry date is in future return true in that case
      if ("token" in this.user) {
        try {
          const res = await fetch(apiHost + "/auth/checkcredentials/", {
            method: "POST",
            headers: {
              Authorization: "Token " + this.user.token,
            },
            //body: JSON.stringify({ username, password }),
          });
          if (res.status != 200) {
            this.alert(
              "Sie wurden ausgeloggt, bitte loggen Sie sich neu ein.",
              "info"
            );
            this.user = {} as userType;
            return false;
          }
          return true;
        } catch (error) {
          this.user = {} as userType;
          return false;
        }
      } else {
        return false;
      }
    },
    isStaff() {
      return typeof this.user.user != "undefined"
        ? this.user.user.is_staff
        : false;
    },
    has_inventory_rights() {
      return typeof this.user.user != "undefined"
        ? this.user.user.user_permissions.find(
            (element) => element == "base.inventory_editing"
          ) == "base.inventory_editing"
        : false;
    },
    has_general_rights() {
      return typeof this.user.user != "undefined"
        ? this.user.user.user_permissions.find(
            (element) => element == "base.general_access"
          ) == "base.general_access"
        : false;
    },
    has_lending_rights() {
      return typeof this.user.user != "undefined"
        ? this.user.user.user_permissions.find(
            (element) => element == "base.lending_access"
          ) == "base.lending_access"
        : false;
    },
  },
});
