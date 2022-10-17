import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({ loginKey: '' }),
  actions: {
    increment() {
      this.count++
    },
  },
})
