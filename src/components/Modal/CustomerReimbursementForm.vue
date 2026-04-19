<template>
  <TransitionRoot appear as="template" :show="Boolean(visible)">
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
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
        >
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
                  {{
                    isEditDoc
                      ? "Edit Reimbursement Debt"
                      : "New Reimbursement Debt"
                  }}
                </h3>
                <i
                  class="pi pi-times cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                  @click="handleClose"
                ></i>
              </div>

              <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
                <!-- Customer Dropdown -->
                <div>
                  <label class="block text-sm font-medium mb-1">
                    Customer <span class="text-red-500">*</span>
                  </label>
                  <Dropdown
                    v-model="form.customerId"
                    :options="customers"
                    optionLabel="username"
                    optionValue="_id"
                    placeholder="Select Customer"
                    class="w-full"
                    filter
                    required
                    @change="onCustomerChange"
                  />
                </div>

                <!-- Invoice IDs (MultiSelect Array) -->
                <div>
                  <label class="block text-sm font-medium mb-1 text-blue-700"
                    >Associated Debt Invoices</label
                  >
                  <MultiSelect
                    v-model="form.invoiceIds"
                    :options="invoiceOptions"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select Invoices to Calculate Debt"
                    display="chip"
                    class="w-full"
                    filter
                    :disabled="!form.customerId"
                  />
                  <small
                    class="text-gray-500 mt-1 block"
                    v-if="!form.customerId"
                  >
                    Please select a customer first to see their invoices.
                  </small>
                </div>

                <!-- Total Debt -->
                <div class="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <label class="block text-sm font-bold text-red-800 mb-1">
                    Total Debt <span class="text-red-500">*</span>
                  </label>
                  <InputNumber
                    v-model="form.totalDebt"
                    mode="decimal"
                    :minFractionDigits="0"
                    :maxFractionDigits="0"
                    useGrouping
                    suffix=" ៛"
                    class="w-full font-bold"
                    inputClass="font-bold text-red-600"
                    placeholder="0 ៛"
                    required
                  />
                  <small class="text-red-600 mt-1 block font-medium">
                    This amount auto-calculates when you select invoices.
                  </small>
                </div>

                <!-- Branch ID -->
                <div>
                  <label class="block text-sm font-medium mb-1"
                    >Branch ID</label
                  >
                  <input
                    v-model="form.branchId"
                    type="text"
                    class="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
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
import { ref, watch, computed } from "vue";
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
    const { getDocs } = getDocument();
    const branchStore = useBranchStore();
    const { showToast } = useAppToast();
    const loading = ref(false);

    const customers = ref([]);
    const allInvoices = ref([]); // Store all invoices here

    const form = ref({
      customerId: null,
      totalDebt: null,
      invoiceIds: [],
      branchId: "",
    });

    // Automatically filter invoices based on the selected customer
    const invoiceOptions = computed(() => {
      if (!form.value.customerId) return [];

      return allInvoices.value
        .filter((inv) => {
          // Check if invoice belongs to selected customer
          const invCustId =
            typeof inv.customerId === "object"
              ? inv.customerId?._id
              : inv.customerId;

          // Only show invoices that actually have a debtAmount > 0, OR if they are already selected (for editing)
          const hasDebt = Number(inv.deptAmount) > 0;
          const isAlreadySelected = form.value.invoiceIds.includes(inv._id);

          return (
            invCustId === form.value.customerId &&
            (hasDebt || isAlreadySelected)
          );
        })
        .map((inv) => {
          const shortId = inv._id ? inv._id.substring(0, 5).toUpperCase() : "";
          const debtAmt = inv.deptAmount
            ? Number(inv.deptAmount).toLocaleString("en-US") + " ៛"
            : "0 ៛";
          const playDate = inv.playDate
            ? new Date(inv.playDate).toLocaleDateString("en-GB")
            : "";
          return {
            label: `[${shortId}] - ${playDate} - Debt: ${debtAmt}`,
            value: inv._id,
          };
        });
    });

    const fetchData = async () => {
      try {
        const [custRes, invRes] = await Promise.all([
          getDocs("Customer"),
          getDocs("Invoice"),
        ]);
        if (custRes?.data) customers.value = custRes.data;
        if (invRes?.data) allInvoices.value = invRes.data;
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    // Auto-calculate Total Debt when invoices are selected
    watch(
      () => form.value.invoiceIds,
      (newIds, oldIds) => {
        // Prevent clearing the manual totalDebt during the very first modal open if it's an edit
        if (props.isEditDoc && !oldIds) return;

        let calculatedDebt = 0;
        newIds.forEach((id) => {
          const inv = allInvoices.value.find((i) => i._id === id);
          if (inv) {
            calculatedDebt += Number(inv.deptAmount) || 0;
          }
        });

        // Automatically fill the Total Debt field with the calculated sum
        form.value.totalDebt = calculatedDebt;
      },
      { deep: true },
    );

    watch(
      () => props.visible,
      (newVal) => {
        if (newVal) {
          fetchData();
          if (props.doc && props.isEditDoc) {
            form.value = {
              ...props.doc,
              customerId:
                typeof props.doc.customerId === "object"
                  ? props.doc.customerId?._id
                  : props.doc.customerId,
              invoiceIds: props.doc.invoiceIds || [],
            };
          } else {
            form.value = {
              customerId: null,
              totalDebt: null,
              invoiceIds: [],
              branchId: branchStore.branchId || "",
            };
          }
        }
      },
    );

    // Clear selected invoices if the customer is changed manually
    const onCustomerChange = () => {
      form.value.invoiceIds = [];
      form.value.totalDebt = 0;
    };

    const handleClose = () => emit("onClose");

    const handleSubmit = async () => {
      if (!form.value.customerId || form.value.totalDebt === null) {
        showToast("error", "Please fill all required fields.");
        return;
      }

      loading.value = true;
      try {
        // Sanitize Payload to prevent 500 server errors on update
        const cleanFields = { ...form.value };
        delete cleanFields._id;
        delete cleanFields.__v;
        delete cleanFields.createdAt;
        delete cleanFields.createdBy;

        const payload = {
          fields: {
            ...cleanFields,
            updatedAt: new Date(),
            updatedBy: branchStore.userId,
          },
        };

        // Add creation specific fields if it is a new document
        if (!props.isEditDoc) {
          payload.fields.createdAt = new Date();
          payload.fields.createdBy = branchStore.userId;
        }

        const res = props.isEditDoc
          ? await updateDoc("CustomerReimburstment", props.doc._id, payload)
          : await insertDoc("CustomerReimburstment", payload);

        if (res) emit("onClose", props.isEditDoc ? "update" : "add");
      } catch (e) {
        console.error(e);
        showToast("error", "Failed to save the reimbursement record.");
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      customers,
      invoiceOptions,
      loading,
      onCustomerChange,
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
:deep(.p-dropdown),
:deep(.p-multiselect) {
  @apply border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#82B215];
}
:deep(.p-inputnumber-input) {
  @apply w-full border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#82B215];
}
</style>
