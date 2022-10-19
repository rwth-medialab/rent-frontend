import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore("user", {
  state: () => ({
    user: useStorage('user',{}),
  }),

  actions: {
    async fetchUser() {
      const res = await fetch(process.env.VUE_APP_API_HOST+ "/user");

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
      console.log('this.user')
      const res = await fetch(process.env.VUE_APP_API_HOST+ "/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const user = await res.json();
      if(res.ok){
        this.user = user
      }else{
        console.log(user)
      }
      console.log(res.statusText)
    },
  }
});