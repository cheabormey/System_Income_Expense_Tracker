<template>
  <!-- Cast visible strictly to Boolean to prevent Headless UI crashes -->
  <TransitionRoot appear as="template" :show="Boolean(visible)">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <!-- Backdrop -->
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
        >
          <!-- Panel Transition -->
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-visible bg-white rounded-2xl shadow-xl border-2 border-[#82B215] text-left align-middle transition-all"
            >
              <div class="flex justify-between items-center p-5 border-b">
                <h3 class="text-xl font-bold text-[#045B1B]">
                  {{ isEditDoc ? "Edit Balance Record" : "New Balance Record" }}
                </h3>
                <i
                  class="pi pi-times cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                  @click="handleClose"
                ></i>
              </div>

              <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                <!-- Amount (Currency formatting integrated) -->
                <div>
                  <label class="block text-sm font-medium mb-1">
                    Balance Amount <span class="text-red-500">*</span>
                  </label>
                  <InputNumber
                    v-model="form.amount"
                    :min="0"
                    mode="decimal"
                    :minFractionDigits="0"
                    :maxFractionDigits="0"
                    useGrouping
                    suffix=" ៛"
                    class="w-full"
                    placeholder="0 ៛"
                    required
                  />
                </div>

                <!-- Invoice IDs (MultiSelect) -->
                <div>
                  <label class="block text-sm font-medium mb-1">
                    Invoice IDs
                  </label>
                  <MultiSelect
                    v-model="form.invoiceIds"
                    :options="invoiceOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Invoices"
                    display="chip"
                    class="w-full"
                    filter
                  />
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium mb-1">
                    Status <span class="text-red-500">*</span>
                  </label>
                  <Dropdown
                    v-model="form.status"
                    :options="statusOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Status"
                    class="w-full"
                    required
                  />
                </div>

                <!-- Branch ID -->
                <div>
                  <label class="block text-sm font-medium mb-1"
                    >Branch ID</label
                  >
                  <input
                    v-model="form.branchId"
                    type="text"
                    class="input-field bg-gray-50 cursor-not-allowed text-gray-500"
                    placeholder="Branch identifier"
                    disabled
                  />
                </div>

                <div class="flex justify-end gap-3 pt-4 border-t mt-4">
                  <button
                    type="button"
                    @click="handleClose"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="bg-[#5B9717] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#4a7c13] transition disabled:opacity-50"
                  >
                    {{ loading ? "Saving..." : "Confirm Save" }}
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
import { ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import Dropdown from "primevue/dropdown";
import InputNumber from "primevue/inputnumber";
import MultiSelect from "primevue/multiselect";
import { useDocument } from "@/composable/useDocument";
import { useBranchStore } from "@/store/branchStore";
import { useAppToast } from "@/helper/toastHelper";

export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    Dropdown,
    InputNumber,
    MultiSelect,
  },

  props: {
    visible: { type: Boolean, default: false },
    isEditDoc: { type: Boolean, default: false },
    doc: { type: Object, default: () => null },
  },

  emits: ["onClose"],
  setup(props, { emit }) {
    const { insertDoc, updateDoc } = useDocument();
    const branchStore = useBranchStore();
    const { showToast } = useAppToast();
    const loading = ref(false);

    // Form Status configuration
    const statusOptions = ref([
      { label: "Active / Valid", value: true },
      { label: "Inactive / Invalid", value: false },
    ]);

    // Placeholder for invoice options (populate this from your API/DB)
    const invoiceOptions = ref([
      // Example data format:
      // { label: 'INV-001', value: 'INV-001' },
      // { label: 'INV-002', value: 'INV-002' },
    ]);

    const form = ref({
      amount: null,
      invoiceIds: [],
      status: true,
      branchId: "",
    });

    watch(
      () => props.visible,
      (newVal) => {
        if (newVal) {
          if (props.doc && props.isEditDoc) {
            form.value = {
              ...props.doc,
              // Directly use the array since MultiSelect binds to arrays
              invoiceIds: props.doc.invoiceIds || [],
            };
          } else {
            form.value = {
              amount: null,
              invoiceIds: [],
              status: true,
              branchId: branchStore.branchId || "",
            };
          }
        }
      },
    );

    const handleClose = () => emit("onClose");

    const handleSubmit = async () => {
      if (form.value.amount === null || form.value.amount === undefined) {
        showToast("error", "Please enter a valid amount.");
        return;
      }

      loading.value = true;
      try {
        const payload = {
          fields: {
            amount: form.value.amount,
            invoiceIds: form.value.invoiceIds,
            status: form.value.status,
            branchId: form.value.branchId,
            updatedBy: branchStore.userId,
            updatedAt: props.isEditDoc ? new Date() : null,
            ...(props.isEditDoc ? {} : { createdBy: branchStore.userId }),
          },
        };

        const res = props.isEditDoc
          ? await updateDoc("LotteryChiefBalance", props.doc._id, payload)
          : await insertDoc("LotteryChiefBalance", payload);

        if (res) {
          // Emit the action back to the parent so it can trigger the toast & refresh
          emit("onClose", props.isEditDoc ? "update" : "add");
        }
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to save the balance record.");
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      statusOptions,
      invoiceOptions,
      loading,
      handleClose,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.input-field {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#82B215] outline-none transition-all;
}

:deep(.p-dropdown) {
  @apply border-gray-300 rounded-lg;
}
:deep(.p-multiselect) {
  @apply border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#82B215];
}
:deep(.p-inputnumber-input) {
  @apply w-full border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#82B215];
}
</style>
