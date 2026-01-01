import { defineStore } from 'pinia';

export const useBranchStore = defineStore('branch', {
  state: () => ({
    branchId: null,
    userId: null,
    userRole: null, // Added userRole
    branchName: null,
    serverDate: null
  }),
  actions: {
    setBranchId(id) {
      this.branchId = id;
    },

    setServerDate(date) {
      this.serverDate = date;
    },

    setUserId(id) {
      this.userId = id;
    },

    setUserRole(role) { // Added this function to fix your error
      this.userRole = role;
    },

    setBranchName(name) {
      this.branchName = name;
    },

    // Clear functions
    clearBranchId() {
      this.branchId = null;
    },

    clearUserId() {
      this.userId = null;
    },

    clearUserRole() { // Added clear for role
      this.userRole = null;
    },

    clearBranchName() {
      this.branchName = null;
    },

    clearServerDate() {
      this.serverDate = null;
    },

    // Helper to clear everything on logout
    logoutClear() {
      this.branchId = null;
      this.userId = null;
      this.userRole = null;
      this.branchName = null;
      this.serverDate = null;
    }
  },
  getters: {
    getBranchId: (state) => state.branchId,
    getUserId: (state) => state.userId,
    getUserRole: (state) => state.userRole, // Added getter
    getBranchName: (state) => state.branchName,
    getServerDate: (state) => state.serverDate
  },
  persist: true,
});