<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-40" @close="handleClose">
      <!-- Overlay -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      </TransitionChild>

      <!-- Modal -->
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
            <DialogPanel
              class="w-full max-w-2xl bg-white rounded-3xl border-2 border-[#82B215]"
            >
              <!-- Header -->
              <div class="flex items-center justify-between p-4 border-b">
                <h3 class="text-lg font-semibold text-[#045B1B]">
                  {{ isEditDoc ? 'Edit Branch' : 'Add New Branch' }}
                </h3>
                <button @click="handleClose">✖</button>
              </div>

              <!-- Form -->
              <form class="p-4 space-y-4" @submit.prevent="handleSubmit">
                <div v-if="errorMessage" class="bg-red-50 text-red-600 p-3 rounded">
                  {{ errorMessage }}
                </div>

                <input v-model="name" class="input" placeholder="Branch Name" required />
                <input v-model="abbreviation" class="input" placeholder="Abbreviation" required />
                <input v-model="directorName" class="input" placeholder="Director Name" required />
                <input v-model="contact" class="input" placeholder="Contact" required />
                <input v-model="email" class="input" placeholder="Email" type="email" />
                <textarea v-model="address" class="input" placeholder="Address" rows="2" />

                <!-- Static Map Placeholder -->
                <div>
                  <label class="label">Location (optional)</label>
                  <div class="flex gap-2">
                    <input v-model="latitude" class="input" placeholder="Latitude" readonly />
                    <input v-model="longitude" class="input" placeholder="Longitude" readonly />
                  </div>
                  <div class="mt-2 h-40 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                    Map Placeholder (Static)
                  </div>
                </div>

                <textarea v-model="description" class="input" placeholder="Description" rows="2" />

                <!-- Buttons -->
                <div class="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    class="px-4 py-2 border rounded"
                    @click="handleClose"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-[#82B215] text-white rounded"
                  >
                    {{ isEditDoc ? 'Update' : 'Add' }}
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
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

export default {
  name: "BranchFormModal",
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
    isEditDoc: {
      type: Boolean,
      default: false,
    },
    doc: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      name: "",
      abbreviation: "",
      directorName: "",
      contact: "",
      email: "",
      address: "",
      latitude: "",
      longitude: "",
      description: "",
      errorMessage: "",
    };
  },

  watch: {
    doc: {
      immediate: true,
      handler(val) {
        if (val) {
          this.name = val.name || "";
          this.abbreviation = val.abbreviation || "";
          this.directorName = val.directorName || "";
          this.contact = val.contact || "";
          this.email = val.email || "";
          this.address = val.address || "";
          this.latitude = val.latitude || "";
          this.longitude = val.longitude || "";
          this.description = val.description || "";
        }
      },
    },
  },

  methods: {
    handleClose() {
      this.$emit("onClose");
    },

    handleSubmit() {
      if (!this.name || !this.abbreviation) {
        this.errorMessage = "Please fill required fields";
        return;
      }

      const payload = {
        name: this.name,
        abbreviation: this.abbreviation,
        directorName: this.directorName,
        contact: this.contact,
        email: this.email,
        address: this.address,
        latitude: this.latitude,
        longitude: this.longitude,
        description: this.description,
      };

      console.log("STATIC SUBMIT:", payload);

      alert(this.isEditDoc ? "Branch Updated (Static)" : "Branch Added (Static)");
      this.handleClose();
    },
  },
};
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}
.label {
  font-weight: 600;
}
</style>
