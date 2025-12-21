<template>
  <div
    v-if="isOpen"
    class="fixed inset-x-0 top-5 z-50"
    role="dialog"
    aria-modal="true"
  >
    <!-- Overlay -->
    <div
      class="fixed inset-0 bg-black/40 backdrop-blur-sm"
      @click="close"
    />

    <!-- Modal -->
    <div class="px-4 pb-20 text-center">
      <div
        class="inline-block bg-white rounded-lg text-left overflow-hidden shadow-xl sm:my-8 sm:max-w-lg sm:w-full"
      >
        <!-- Body -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900">
            Change Branch Status
          </h3>

          <p class="mt-4 text-sm text-gray-600">
            Are you sure you want to change the status of
            <span class="font-semibold">
              {{ branch.name }}
            </span>
            from
            <span
              class="font-semibold"
              :class="branch.status ? 'text-green-600' : 'text-red-600'"
            >
              {{ branch.status ? 'Active' : 'Inactive' }}
            </span>
            to
            <span
              class="font-semibold"
              :class="branch.status ? 'text-red-600' : 'text-green-600'"
            >
              {{ branch.status ? 'Inactive' : 'Active' }}
            </span>
            ?
          </p>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
          <button
            class="w-full sm:w-auto px-4 py-2 bg-[#045B1B] text-white rounded-md hover:bg-[#82B215]"
            @click="confirm"
          >
            Confirm
          </button>

          <button
            class="mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto px-4 py-2 border rounded-md"
            @click="close"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BranchStatusConfirm",

  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Object,
      default: () => ({
        name: "Branch",
        status: true,
      }),
    },
  },

  computed: {
    branch() {
      return {
        name: this.position?.name || "Branch",
        status: Boolean(this.position?.status),
      };
    },
  },

  methods: {
    close() {
      this.$emit("close");
    },

    confirm() {
      // STATIC toggle
      const updated = {
        ...this.branch,
        status: !this.branch.status,
      };

      console.log("STATUS CHANGED (STATIC):", updated);

      alert(
        `Status changed to ${updated.status ? "Active" : "Inactive"}`
      );

      this.$emit("confirm", updated);
      this.close();
    },
  },
};
</script>
