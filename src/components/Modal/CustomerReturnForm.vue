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
              class="w-full max-w-lg transform overflow-visible bg-white rounded-2xl shadow-xl border-2 border-[#82B215] text-left align-middle transition-all"
            >
              <div class="flex items-center justify-between p-5 border-b">
                <h3 class="text-xl font-bold text-[#045B1B]">
                  {{
                    isEditDoc
                      ? "Edit Return Money"
                      : "New Return Money (Payment)"
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
                  <label class="block text-sm font-medium text-gray-700 mb-1">
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
                  />

                  <!-- Debt Display Banner -->
                  <div
                    v-if="form.customerId"
                    class="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex flex-col gap-1"
                  >
                    <div class="flex justify-between items-center text-sm">
                      <span class="font-medium text-gray-700"
                        >Current Debt:</span
                      >
                      <span class="font-bold text-red-600">
                        {{ (currentDebt || 0).toLocaleString("en-US") }} ៛
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Amount returned -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Amount Returned <span class="text-red-500">*</span>
                  </label>
                  <InputNumber
                    v-model="form.amount"
                    :min="0"
                    mode="decimal"
                    :minFractionDigits="0"
                    :maxFractionDigits="0"
                    useGrouping
                    suffix=" ៛"
                    required
                    placeholder="0 ៛"
                    class="w-full"
                    inputClass="font-bold text-green-700"
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

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Status (Auto Updates based on Amount)</label
                  >
                  <Dropdown
                    v-model="form.status"
                    :options="[
                      { label: 'Completed', value: true },
                      { label: 'Pending', value: false },
                    ]"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                  />
                </div>

                <div class="flex justify-end gap-3 pt-5 border-t">
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
                    {{ loading ? "Saving..." : "Confirm Payment" }}
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
    const reimbursements = ref([]);

    const form = ref({
      customerId: null,
      amount: null,
      returnDate: new Date().toISOString().substr(0, 10),
      status: false, // Default to Pending
      branchId: branchStore.branchId || "",
    });

    // Fetch both Customers and Reimbursements to calculate current debt
    const fetchData = async () => {
      try {
        const [custRes, reimbRes] = await Promise.all([
          getDocs("Customer"),
          getDocs("CustomerReimburstment"),
        ]);

        if (custRes?.data) customers.value = custRes.data;
        if (reimbRes?.data) reimbursements.value = reimbRes.data;
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    // Calculate current debt dynamically based on the selected customer
    const currentDebt = computed(() => {
      if (!form.value.customerId) return 0;

      const targetCustomerId = form.value.customerId;

      const customerReimbursement = reimbursements.value.find((r) => {
        const rCustId =
          typeof r.customerId === "object" ? r.customerId?._id : r.customerId;
        return (
          rCustId === targetCustomerId && r.branchId === branchStore.branchId
        );
      });

      // If we found their master debt record, return the total debt amount
      // We use Math.max(0, debt) so it never shows a negative balance
      const debt = customerReimbursement
        ? Number(customerReimbursement.totalDebt || 0)
        : 0;
      return Math.max(0, debt);
    });

    // Preview remaining debt dynamically while the user is typing an amount
    const remainingDebt = computed(() => {
      const payingAmount = Number(form.value.amount || 0);
      // We use Math.max(0, ...) so it never previews a negative remaining debt
      return Math.max(0, currentDebt.value - payingAmount);
    });

    // Auto-update status to "Completed" if they are paying off all (or more) of their debt
    watch(remainingDebt, (newRemaining) => {
      if (form.value.customerId) {
        if (
          form.value.amount !== null &&
          form.value.amount > 0 &&
          newRemaining <= 0
        ) {
          form.value.status = true; // Completed
        } else {
          form.value.status = false; // Pending
        }
      }
    });

    watch(
      () => props.visible,
      (isOpen) => {
        if (isOpen) {
          fetchData();
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
              status: false, // Default to Pending
              branchId: branchStore.branchId,
            };
          }
        }
      },
    );

    const handleClose = () => emit("onClose", "close");

    const handleSubmit = async () => {
      if (!form.value.customerId || form.value.amount === null) {
        showToast("error", "Please fill required fields.");
        return;
      }

      loading.value = true;
      try {
        // Sanitize Payload to prevent 500 internal server errors
        const cleanFields = { ...form.value };
        delete cleanFields._id;
        delete cleanFields.__v;
        delete cleanFields.createdAt;
        delete cleanFields.createdBy;

        const payload = {
          fields: {
            ...cleanFields,
            updatedBy: branchStore.userId,
            updatedAt: props.isEditDoc ? new Date() : null,
          },
        };

        if (!props.isEditDoc) {
          payload.fields.createdAt = new Date();
          payload.fields.createdBy = branchStore.userId;
        }

        // 1. Save Return Money Record
        let savedReturnId = null;
        if (props.isEditDoc && props.doc?._id) {
          await updateDoc("CustomerReturnMoney", props.doc._id, payload);
          savedReturnId = props.doc._id;
        } else {
          const res = await insertDoc("CustomerReturnMoney", payload);
          savedReturnId = res?._id || res?.data?._id || res?.id;
        }

        // 2. CLIENT-SIDE REIMBURSEMENT UPDATE (Deduct debt)
        try {
          // Note: using the same reimbursements.value we fetched on load to find the ID
          const targetCustomerId = form.value.customerId;
          const targetBranchId = branchStore.branchId;

          const customerReimbursement = reimbursements.value.find((r) => {
            const rCustId =
              typeof r.customerId === "object"
                ? r.customerId?._id
                : r.customerId;
            return (
              rCustId === targetCustomerId &&
              (!targetBranchId || r.branchId === targetBranchId)
            );
          });

          if (customerReimbursement) {
            // Convert everything explicitly to Number to prevent string concatenation bugs
            const oldReturnAmount = props.isEditDoc
              ? Number(props.doc.amount || 0)
              : 0;
            const newReturnAmount = Number(form.value.amount || 0);

            // Calculate the difference. E.g., User paid 100. difference is 100.
            const paymentDifference = newReturnAmount - oldReturnAmount;

            const currentTotalDebt = Number(
              customerReimbursement.totalDebt || 0,
            );

            // Ensure the new total debt doesn't drop below 0 in the database
            const newTotalDebt = Math.max(
              0,
              currentTotalDebt - paymentDifference,
            );

            // Update the Reimbursement table
            await updateDoc(
              "CustomerReimburstment",
              customerReimbursement._id,
              {
                fields: {
                  totalDebt: newTotalDebt,
                  lastCustomerReturnMoneyId: savedReturnId,
                  updatedAt: new Date(),
                  updatedBy: branchStore.userId,
                },
              },
            );

            // Success toast indicating the math worked
            showToast(
              "success",
              `Payment saved! Debt updated from ${currentTotalDebt} ៛ to ${newTotalDebt} ៛`,
            );
            console.log(
              `Debt successfully updated! Old Debt: ${currentTotalDebt}, New Debt: ${newTotalDebt}`,
            );
          } else {
            showToast(
              "warn",
              "Payment saved, but no master debt record found for this customer to deduct from.",
            );
          }
        } catch (balanceErr) {
          console.error("Failed to update reimbursement debt:", balanceErr);
          showToast(
            "error",
            "Payment saved, but failed to automatically update the Customer Debt table.",
          );
        }

        emit("onClose", props.isEditDoc ? "update" : "add");
      } catch (err) {
        console.error("Submission error:", err);
        showToast("error", "Failed to save the return record.");
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      customers,
      loading,
      currentDebt,
      remainingDebt,
      handleClose,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.input-field {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#82B215] outline-none transition-all text-sm;
}
:deep(.p-dropdown) {
  @apply border-gray-300 rounded-lg;
}
:deep(.p-inputnumber-input) {
  @apply w-full border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#82B215];
}
</style>
