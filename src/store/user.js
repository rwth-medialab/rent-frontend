import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import moment from 'moment'

export const useUserStore = defineStore("user", {
  state: () => ({
    user: useStorage('user', {}),
  }),

  actions: {
    async fetchUser() {
      const res = await fetch(process.env.VUE_APP_API_HOST + "/user");

      const user = await res.json();
      this.user = user;
    },
    async signUp(username, password) {
      const res = await fetch(process.env.VUE_APP_API_HOST + "/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const user = await res.json()
      this.user.push(user);
    },
    async signIn(username, password) {
      const res = await fetch(process.env.VUE_APP_API_HOST + "/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const user = await res.json();
      if (res.ok) {
        this.user = user
      } else {
        console.log(user)
      }
      console.log(res.statusText)
    },
    async signOut() {
      const res = await fetch(process.env.VUE_APP_API_HOST + "/api/auth/logout/", {
        method: "POST",
        headers: {
          "Authorization": "Token " + this.user.token,
        },
        //body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        this.user = null
      } 
    },
    async checkCredentials() {
      //check if expiry date is in future return true in that case
      
      try {
        const valid = moment(this.user.expiry).isAfter()

        const res = await fetch(process.env.VUE_APP_API_HOST + "/api/auth/checkcredentials/", {
          method: "POST",
          headers: {
            "Authorization": "Token " + this.user.token,
          },
          //body: JSON.stringify({ username, password }),
        });
        if (!valid || res.status !=200) {
          this.user = null
          return false
        }
        return true
      } catch (error) {
        this.user = null
        return false
      }
    }
  }
});