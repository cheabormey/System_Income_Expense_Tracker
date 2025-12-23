<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center px-4 py-6">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-3xl bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
              <!-- Header -->
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-[#045B1B]">
                  {{ isEdit ? 'Edit User' : 'Add New User' }}
                </h3>
                <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
                  ✖
                </button>
              </div>

              <!-- Form -->
              <form class="p-6 space-y-5" @submit.prevent="handleSubmit">
                <div v-if="errorMessage" class="bg-red-50 text-red-700 p-3 rounded border border-red-200">
                  {{ errorMessage }}
                </div>

                <!-- Profile Picture Preview -->
                <div class="flex flex-col md:flex-row items-start gap-6 mb-6">
                  <div class="flex flex-col items-center">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                    <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-[#82B215] shadow-md">
                      <img 
                        v-if="form.profilePicture" 
                        :src="form.profilePicture" 
                        alt="User profile" 
                        class="w-full h-full object-cover"
                        @error="form.profilePicture = ''"  
                      >
                      <div v-else class="w-full h-full bg-[#82B215]/10 flex items-center justify-center">
                        <svg class="w-8 h-8 sm:w-12 sm:h-12 text-[#5B9717]" xmlns="http://www.w3.org/2000/svg"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Form Fields -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="label">Username <span class="rq-label"></span></label>
                    <input v-model="form.username" class="input" placeholder="Username" required />
                  </div>

                  <div>
                    <label class="label">Full Name</label>
                    <input v-model="form.fullName" class="input" placeholder="Full Name" />
                  </div>

                  <div>
                    <label class="label">Gender</label>
                    <select v-model="form.gender" class="input">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label class="label">Phone Number</label>
                    <input v-model="form.phoneNumber" class="input" placeholder="Phone Number" />
                  </div>

                  <div>
                    <label class="label">Address</label>
                    <textarea v-model="form.address" class="input" rows="2" placeholder="Address"></textarea>
                  </div>

                  <div>
                    <label class="label">Main Role <span class="rq-label"></span></label>
                    <select v-model="form.mainRole" class="input" required>
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Staff">Staff</option>
                      <option value="User">User</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Permissions (comma separated)</label>
                    <input
                      v-model="form.permissionsString"
                      class="input"
                      placeholder="view:branches,edit:users,..."
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Bot Token</label>
                    <input v-model="form.botToken" class="input" placeholder="Bot Token (optional)" />
                  </div>
                </div>

                <!-- Buttons -->
                <div class="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    @click="handleClose"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-5 py-2 bg-[#82B215] text-white rounded-md hover:bg-[#6e9a12] transition"
                  >
                    {{ isEdit ? 'Update' : 'Add' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';

export default {
  name: 'UserFormModal',
  components: { Dialog, DialogPanel, TransitionChild, TransitionRoot },

  props: {
    open: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
    initialData: { type: Object, default: null },
  },

  emits: ['close', 'save'],

  data() {
    return {
      form: {
        id: null,
        username: '',
        fullName: '',
        gender: '',
        phoneNumber: '',
        address: '',
        mainRole: '',
        permissionsString: '',
        botToken: '',
        profilePicture: '',
      },
      errorMessage: '',
    };
  },

  watch: {
    open: {
      immediate: true,
      handler(newVal) {
        if (newVal && this.initialData) {
          this.form = {
            ...this.initialData,
            permissionsString: this.initialData.permissions?.join(', ') || '',
          };
        } else if (newVal) {
          this.resetForm();
        }
      },
    },
  },

  methods: {
    resetForm() {
      this.form = {
        id: null,
        username: '',
        fullName: '',
        gender: '',
        phoneNumber: '',
        address: '',
        mainRole: '',
        permissionsString: '',
        botToken: '',
        profilePicture: '',
      };
      this.errorMessage = '';
    },

    handleClose() {
      this.$emit('close');
      this.resetForm();
    },

    handleSubmit() {
      if (!this.form.username || !this.form.mainRole) {
        this.errorMessage = 'Username and Main Role are required.';
        return;
      }

      const permissions = this.form.permissionsString
        ? this.form.permissionsString.split(',').map(p => p.trim()).filter(p => p)
        : [];

      const userData = {
        ...this.form,
        permissions,
      };
      delete userData.permissionsString;

      this.$emit('save', userData);

      alert(this.isEdit ? 'User updated successfully!' : 'User added successfully!');
      this.handleClose();
    },
  },
};
</script>

<style scoped>
.input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#82B215] focus:border-[#82B215];
}
</style>