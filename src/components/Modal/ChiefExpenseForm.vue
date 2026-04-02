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
                  {{ isEditDoc ? "Edit Chief Expense" : "New Chief Expense" }}
                </h3>
                <i
                  class="pi pi-times cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
                  @click="handleClose"
                ></i>
              </div>

              <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Customer/Chief <span class="text-red-500">*</span>
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
                </div>

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
                    suffix=" ៛"
                    required
                    placeholder="0 ៛"
                    class="w-full"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Payment Date</label
                  >
                  <input
                    v-model="form.paymentDate"
                    type="date"
                    class="input-field"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Description</label
                  >
                  <textarea
                    v-model="form.description"
                    rows="3"
                    class="input-field"
                    placeholder="What is this expense for?"
                  ></textarea>
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
                    {{ loading ? "Saving..." : "Save Record" }}
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

    const form = ref({
      customerId: null,
      amount: null,
      paymentDate: new Date().toISOString().substr(0, 10),
      description: "",
      branchId: branchStore.branchId || "",
    });

    const fetchCustomers = async () => {
      try {
        const res = await getDocs("Customer");
        if (res?.data) {
          customers.value = res.data;
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };

    watch(
      () => props.visible,
      (isOpen) => {
        if (isOpen) {
          fetchCustomers();

          if (props.isEditDoc && props.doc) {
            form.value = {
              ...props.doc,
              paymentDate: props.doc.paymentDate
                ? new Date(props.doc.paymentDate).toISOString().substr(0, 10)
                : "",
            };
          } else {
            form.value = {
              customerId: null,
              amount: null,
              paymentDate: new Date().toISOString().substr(0, 10),
              description: "",
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
        const payload = {
          fields: {
            ...form.value,
            updatedBy: branchStore.userId,
            updatedAt: props.isEditDoc ? new Date() : null,
            ...(props.isEditDoc ? {} : { createdBy: branchStore.userId }),
          },
        };

        // 1. Save the Chief Expense
        const res = props.isEditDoc
          ? await updateDoc("ChiefExpense", props.doc._id, payload)
          : await insertDoc("ChiefExpense", payload);

        if (res) {
          // 2. CLIENT-SIDE BALANCE UPDATE
          try {
            const balanceRes = await getDocs("LotteryChiefBalance");
            if (balanceRes?.data) {
              // Find active balance for this branch
              const activeBalance = balanceRes.data.find(
                (b) => b.status === true && b.branchId === branchStore.branchId,
              );

              if (activeBalance) {
                // Calculate the difference. If editing, subtract old amount, then deduct new amount.
                const oldExpenseAmount = props.isEditDoc
                  ? props.doc.amount || 0
                  : 0;
                const newExpenseAmount = form.value.amount || 0;

                // Expenses reduce the balance, so subtract the difference
                const amountDifference = newExpenseAmount - oldExpenseAmount;
                const newBalanceAmount =
                  activeBalance.amount - amountDifference;

                // Update LotteryChiefBalance
                await updateDoc("LotteryChiefBalance", activeBalance._id, {
                  fields: {
                    amount: newBalanceAmount,
                    updatedAt: new Date(),
                    updatedBy: branchStore.userId,
                  },
                });
              } else {
                showToast(
                  "warn",
                  "Expense saved, but no active balance found to deduct from.",
                );
              }
            }
          } catch (balanceErr) {
            console.error("Failed to update balance:", balanceErr);
            showToast(
              "error",
              "Expense saved, but failed to update Chief Balance.",
            );
          }

          emit("onClose", props.isEditDoc ? "update" : "add");
        }
      } catch (err) {
        console.error("Submission error:", err);
        showToast("error", "Failed to save the expense record.");
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
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#82B215] outline-none transition-all text-sm;
}
:deep(.p-dropdown) {
  @apply border-gray-300 rounded-lg;
}
:deep(.p-inputnumber-input) {
  @apply w-full border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#82B215];
}
</style>
