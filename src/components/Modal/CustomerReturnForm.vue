<template>
  <TransitionRoot as="template" :show="Boolean(visible)">
    <Dialog as="div" class="relative z-50" @close="handleClose">
      <!-- Backdrop Transition -->
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
              <!-- Header -->
              <div class="flex justify-between items-center p-5 border-b">
                <h3 class="text-xl font-bold text-[#045B1B]">
                  {{ isEditDoc ? "Edit Return" : "New Return Money" }}
                </h3>
                <i
                  class="pi pi-times cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                  @click="handleClose"
                ></i>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
                <!-- Customer Dropdown -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Customer <span class="text-red-500">*</span></label
                  >
                  <Dropdown
                    v-model="form.customerId"
                    :options="customers"
                    optionLabel="username"
                    optionValue="_id"
                    placeholder="Select Customer"
                    class="w-full"
                    filter
                    required
                  />
                </div>

                <!-- Amount Input -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Amount <span class="text-red-500">*</span>
                  </label>
                  <InputNumber
                    v-model="form.amount"
                    :min="0"
                    mode="decimal"
                    :minFractionDigits="0"
                    :maxFractionDigits="0"
                    useGrouping
                    required
                    placeholder="0"
                    class="w-full"
                  />
                </div>

                <!-- Return Date -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Return Date</label
                  >
                  <input
                    v-model="form.returnDate"
                    type="date"
                    class="input-field"
                    required
                  />
                </div>

                <!-- Status Toggle -->
                <div class="flex items-center gap-3 py-2">
                  <ToggleSwitch v-model="form.status" inputId="status" />
                  <label for="status" class="text-sm font-medium text-gray-700"
                    >Active Record</label
                  >
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 pt-4 border-t mt-4">
                  <button
                    type="button"
                    @click="handleClose"
                    class="px-4 py-2 text-gray-500 hover:text-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="bg-[#5B9717] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-[#4a7c13] transition disabled:opacity-50"
                  >
                    {{ loading ? "Processing..." : "Save Record" }}
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
import ToggleSwitch from "primevue/toggleswitch";
import { useDocument } from "@/composable/useDocument";
import { getDocument } from "@/composable/getDocument";
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
    ToggleSwitch,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    isEditDoc: {
      type: Boolean,
      default: false,
    },
    doc: {
      type: Object,
      default: () => null,
    },
  },

  emits: ["onClose"],
  setup(props, { emit }) {
    const { insertDoc, updateDoc } = useDocument();
    const { getDocs } = getDocument();
    const branchStore = useBranchStore();
    const { showToast } = useAppToast();
    const loading = ref(false);
    const customers = ref([]);

    const form = ref({
      customerId: null,
      amount: null,
      returnDate: new Date().toISOString().substr(0, 10),
      status: true,
      branchId: branchStore.branchId || "",
    });

    const fetchCustomers = async () => {
      try {
        const res = await getDocs("Customer");
        if (res && res.data) {
          customers.value = res.data;
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };

    watch(
      () => props.visible,
      (opened) => {
        if (opened) {
          fetchCustomers();

          if (props.isEditDoc && props.doc) {
            form.value = {
              ...props.doc,
              returnDate: props.doc.returnDate
                ? new Date(props.doc.returnDate).toISOString().substr(0, 10)
                : "",
            };
          } else {
            form.value = {
              customerId: null,
              amount: null,
              returnDate: new Date().toISOString().substr(0, 10),
              status: true,
              branchId: branchStore.branchId || "",
            };
          }
        }
      },
    );

    const handleClose = () => emit("onClose");

    const handleSubmit = async () => {
      if (!form.value.customerId) {
        showToast("error", "Please select a customer.");
        return;
      }

      loading.value = true;
      try {
        const payload = {
          fields: {
            ...form.value,
            createdBy: props.isEditDoc
              ? props.doc.createdBy
              : branchStore.userId,
            updatedAt: props.isEditDoc ? new Date() : undefined,
          },
        };

        const res = props.isEditDoc
          ? await updateDoc("CustomerReturnMoney", props.doc._id, payload)
          : await insertDoc("CustomerReturnMoney", payload);

        if (res) {
          emit("onClose", props.isEditDoc ? "update" : "add");
          handleClose();
        }
      } catch (err) {
        console.error(err);
        showToast("error", "Failed to save the record. Please try again.");
      } finally {
        loading.value = false;
      }
    };

    return { form, customers, loading, handleClose, handleSubmit };
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
</style>
