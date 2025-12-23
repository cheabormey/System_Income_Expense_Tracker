// store/branch.js
import { defineStore } from 'pinia';

export const useBranchStore = defineStore('branch', {
  state: () => ({
    branchId: null,
    userId: null,
    branchName: null,
    serverDate: null
  }),
  actions: {
    setBranchId(id) {
      this.branchId = id
    },

    setServerDate(date) {
      this.serverDate = date
    },


    setUserId(id) {
      this.userId = id
    },

    setBranchName(name) {
      this.branchName = name
    },
    clearBranchId() {
      this.branchId = null;

    },
    clearUserId() {
      this.userId = null;
    },

    clearBranchName() {
      this.branchName = null;
    },

    clearServerDate() {
      this.serverDate = null;
    },








  },
  getters: {
    getBranchId: (state) => state.branchId,
    getUserId: (state) => state.userId,
    getBranchName: (state) => state.branchName,
    getServerDate: (state) => state.serverDate
  },
  persist: true,
});
