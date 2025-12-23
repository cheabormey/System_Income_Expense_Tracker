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
            <DialogPanel class="w-full max-w-2xl bg-white rounded-2xl shadow-xl border-2 border-[#82B215]">
              <!-- Header -->
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-semibold text-[#045B1B]">
                  {{ isEdit ? 'Edit Branch' : 'Add New Branch' }}
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

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
                  <input v-model="form.name" class="input" placeholder="Branch Name" required />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Abbreviation *</label>
                  <input v-model="form.abbreviation" class="input" placeholder="Abbreviation" required />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Director Name</label>
                  <input v-model="form.directorName" class="input" placeholder="Director Name" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input v-model="form.contact" class="input" placeholder="Contact" />
                </div>

                <!-- Removed Email field -->

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea v-model="form.address" class="input" rows="2" placeholder="Address"></textarea>
                </div>

                <!-- Invoice Settings -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Prefix</label>
                    <input v-model="form.invoicePrefix" class="input" placeholder="e.g. INV-" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Invoice ID Length</label>
                    <input
                      v-model.number="form.invoiceIdLength"
                      type="number"
                      min="1"
                      class="input"
                      placeholder="e.g. 6"
                    />
                  </div>
                </div>


                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea v-model="form.description" class="input" rows="3" placeholder="Description"></textarea>
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
  name: 'BranchFormModal',
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
        name: '',
        abbreviation: '',
        directorName: '',
        contact: '',
        address: '',
        // latitude: '',
        // longitude: '',
        description: '',
        invoicePrefix: 'INV-',      // default
        invoiceIdLength: 6,         // default
      },
      errorMessage: '',
    };
  },

  watch: {
    open: {
      immediate: true,
      handler(newVal) {
        if (newVal && this.initialData) {
          this.form = { ...this.initialData };
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
        name: '',
        abbreviation: '',
        directorName: '',
        contact: '',
        address: '',
        // latitude: '',
        // longitude: '',
        description: '',
        invoicePrefix: 'INV-',
        invoiceIdLength: 6,
      };
      this.errorMessage = '';
    },

    handleClose() {
      this.$emit('close');
      this.resetForm();
    },

    handleSubmit() {
      if (!this.form.name || !this.form.abbreviation) {
        this.errorMessage = 'Branch Name and Abbreviation are required.';
        return;
      }

      // Emit the data back to parent
      this.$emit('save', { ...this.form });

      alert(this.isEdit ? 'Branch updated successfully!' : 'Branch added successfully!');
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