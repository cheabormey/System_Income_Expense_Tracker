<template>
  <Dialog
    :visible="visible"
    @update:visible="
      (val) => {
        if (!val) handleClose();
      }
    "
    modal
    :header="isEditDoc ? 'Edit Invoice' : 'New Invoice'"
    class="w-[95vw] md:w-[85vw] lg:w-[75vw]"
  >
    <div class="space-y-6">
      <!-- CUSTOMER AND DATE -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="form-label font-semibold mb-1 block text-gray-700"
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
            :class="{ 'p-invalid border-red-500': errors.customerId }"
          />
          <Message
            v-if="errors.customerId"
            severity="error"
            class="mt-1 m-0 p-2"
            :closable="false"
            >Customer is required</Message
          >
        </div>

        <div>
          <label class="form-label font-semibold mb-1 block text-gray-700"
            >Play Date <span class="text-red-500">*</span></label
          >
          <Calendar
            v-model="form.playDate"
            dateFormat="yy-mm-dd"
            showIcon
            class="w-full"
            :class="{ 'p-invalid border-red-500': errors.playDate }"
          />
          <Message
            v-if="errors.playDate"
            severity="error"
            class="mt-1 m-0 p-2"
            :closable="false"
            >Date is required</Message
          >
        </div>
      </section>

      <!-- LOTTERY PLAYS -->
      <section>
        <!-- STICKY HEADER FOR EASY CLICKING -->
        <div
          class="sticky top-0 z-50 bg-white/95 backdrop-blur pt-2 pb-3 mb-4 border-b-2 border-gray-100 flex justify-between items-center shadow-sm px-2 -mx-2 rounded-t-md"
        >
          <h3 class="text-lg font-bold text-gray-800">Lottery Plays</h3>
          <Button
            label="Add Play"
            icon="pi pi-plus"
            size="small"
            class="p-button-success shadow-md"
            @click="addPlay"
          />
        </div>

        <div
          v-for="(play, index) in form.lotteryPlays"
          :key="index"
          class="border rounded-xl p-4 mb-4 bg-gray-50 shadow-sm space-y-4"
        >
          <div class="flex justify-between items-center mb-1">
            <strong class="text-[#045B1B]">Play #{{ index + 1 }}</strong>
            <Button
              icon="pi pi-trash"
              text
              severity="danger"
              rounded
              aria-label="Delete"
              @click="removePlay(index)"
            />
          </div>

          <!-- Top Row: Category, Product, Title -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-600 mb-1"
                >Category <span class="text-red-500">*</span></label
              >
              <Dropdown
                v-model="play.categoryId"
                :options="categories"
                optionLabel="name"
                optionValue="_id"
                placeholder="Select Category"
                :class="{
                  'p-invalid border-red-500': errors.plays?.[index]?.categoryId,
                }"
              />
              <Message
                v-if="errors.plays?.[index]?.categoryId"
                severity="error"
                class="mt-1 m-0 p-2 text-sm"
                :closable="false"
                >Category is required</Message
              >
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-600 mb-1"
                >Product <span class="text-red-500">*</span></label
              >
              <Dropdown
                v-model="play.productId"
                :options="products"
                optionLabel="name"
                optionValue="_id"
                placeholder="Select Product"
                :class="{
                  'p-invalid border-red-500': errors.plays?.[index]?.productId,
                }"
              />
              <Message
                v-if="errors.plays?.[index]?.productId"
                severity="error"
                class="mt-1 m-0 p-2 text-sm"
                :closable="false"
                >Product is required</Message
              >
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-600 mb-1"
                >Title <span class="text-red-500">*</span></label
              >
              <InputText
                v-model="play.title"
                placeholder="e.g. Morning Play"
                :class="{
                  'p-invalid border-red-500': errors.plays?.[index]?.title,
                }"
              />
              <Message
                v-if="errors.plays?.[index]?.title"
                severity="error"
                class="mt-1 m-0 p-2 text-sm"
                :closable="false"
                >Title is required</Message
              >
            </div>
          </div>

          <!-- Middle Row: 2D & 3D Settings -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 2D Settings -->
            <div
              class="flex flex-col bg-blue-50/50 p-3 rounded border border-blue-100"
            >
              <label class="text-sm font-bold text-blue-700 mb-2"
                >2-Win number</label
              >
              <div
                class="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-2"
              >
                <InputNumber
                  v-model="play.twoDigitNumber"
                  placeholder="2D Number"
                  :useGrouping="false"
                  class="flex-1 min-w-[100px]"
                />
                <InputNumber
                  v-model="play.twoDigitAmount"
                  placeholder="2D Amount"
                  mode="decimal"
                  class="flex-1 min-w-[100px]"
                />
              </div>
              <div class="flex items-center gap-2 mt-1">
                <Checkbox
                  v-model="play.isTwoNumber"
                  binary
                  :inputId="'isTwoNum_' + index"
                />
                <label
                  :for="'isTwoNum_' + index"
                  class="text-sm cursor-pointer select-none text-green-700 font-semibold"
                  >Is Winning 2D Number?</label
                >
              </div>
            </div>

            <!-- 3D Settings -->
            <div
              class="flex flex-col bg-purple-50/50 p-3 rounded border border-purple-100"
            >
              <label class="text-sm font-bold text-purple-700 mb-2"
                >3-Win number</label
              >
              <div
                class="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-2"
              >
                <InputNumber
                  v-model="play.threeDigitNumber"
                  placeholder="3D Number"
                  :useGrouping="false"
                  class="flex-1 min-w-[100px]"
                />
                <InputNumber
                  v-model="play.threeDigitAmount"
                  placeholder="3D Amount"
                  mode="decimal"
                  class="flex-1 min-w-[100px]"
                />
              </div>
              <div class="flex items-center gap-2 mt-1">
                <Checkbox
                  v-model="play.isThreeNumber"
                  binary
                  :inputId="'isThreeNum_' + index"
                />
                <label
                  :for="'isThreeNum_' + index"
                  class="text-sm cursor-pointer select-none text-green-700 font-semibold"
                  >Is Winning 3D Number?</label
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- OVERALL AMOUNTS & DESCRIPTION -->
      <section>
        <h3 class="text-lg font-bold text-gray-800 mb-3 border-b pb-2">
          Invoice Summary
        </h3>
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border shadow-sm mb-4"
        >
          <div class="flex flex-col">
            <label class="text-sm font-semibold mb-1 text-gray-700"
              >Net Total Invoice Amount (Auto-Calculated)</label
            >
            <InputNumber
              v-model="form.totalAmount"
              placeholder="0 ៛"
              mode="decimal"
              :inputClass="
                form.totalAmount < 0
                  ? 'font-bold text-red-600 bg-gray-100 cursor-not-allowed'
                  : 'font-bold text-green-600 bg-gray-100 cursor-not-allowed'
              "
              readonly
              disabled
            />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-semibold mb-1 text-gray-700"
              >Debt Amount</label
            >
            <InputNumber
              v-model="form.deptAmount"
              placeholder="0 ៛"
              mode="decimal"
              inputClass="font-bold text-red-600"
            />
          </div>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-semibold mb-1 text-gray-700"
            >Description</label
          >
          <Textarea
            v-model="form.description"
            rows="2"
            placeholder="Optional invoice description..."
            class="w-full"
          />
        </div>
      </section>

      <!-- SYSTEM FLAGS -->
      <section
        class="flex flex-wrap gap-6 mt-4 bg-gray-100 p-3 rounded-lg border"
      >
        <div class="flex items-center gap-2 cursor-pointer">
          <Checkbox v-model="form.isDebt" binary inputId="isDebtFlag" />
          <label
            for="isDebtFlag"
            class="font-medium text-orange-600 select-none"
            >Is Debt</label
          >
        </div>
        <div
          class="flex items-center gap-2 cursor-pointer"
          title="Check this to lock the invoice and record finances to balance and expenses"
        >
          <Checkbox v-model="form.isUnchanged" binary inputId="isUnchanged" />
          <label for="isUnchanged" class="font-medium text-red-600 select-none"
            >Lock Invoice (Commits to Balance & Expenses)</label
          >
        </div>
      </section>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        text
        class="text-gray-500 hover:text-gray-700"
        @click="handleClose"
      />
      <Button
        label="Save Invoice"
        icon="pi pi-check"
        class="p-button-success"
        :loading="loading"
        @click="saveInvoice"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Checkbox from "primevue/checkbox";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Message from "primevue/message";
import { useDocument } from "@/composable/useDocument";
import { getDocument } from "@/composable/getDocument";
import { useAppToast } from "@/helper/toastHelper";
import { useBranchStore } from "@/store/branchStore";

const props = defineProps({
  visible: Boolean,
  isEditDoc: Boolean,
  doc: Object,
});

const emit = defineEmits(["onClose", "refresh"]);

const { insertDoc, updateDoc, deleteDoc } = useDocument();
const { getDocs } = getDocument();
const { showToast } = useAppToast();
const branchStore = useBranchStore();
const loading = ref(false);

const customers = ref([]);
const categories = ref([]);
const products = ref([]);

const errors = ref({ customerId: false, playDate: false, plays: [] });

const form = ref({
  customerId: null,
  playDate: null,
  lotteryPlays: [],
  totalAmount: 0,
  deptAmount: 0,
  description: "",
  isDebt: false,
  isUnchanged: false,
});

const fetchDropdownData = async () => {
  try {
    const [customerRes, categoryRes, productRes] = await Promise.all([
      getDocs("Customer"),
      getDocs("Category"),
      getDocs("Product"),
    ]);
    customers.value = customerRes.data || [];
    categories.value = categoryRes.data || [];
    products.value = productRes.data || [];
  } catch (err) {
    console.error(err);
  }
};

watch(
  () => props.visible,
  (val) => {
    if (val) {
      fetchDropdownData();
      if (props.isEditDoc && props.doc) {
        form.value = {
          ...props.doc,
          playDate: props.doc.playDate
            ? new Date(props.doc.playDate)
            : new Date(),
          lotteryPlays: Array.isArray(props.doc.lotteryPlays)
            ? [...props.doc.lotteryPlays]
            : Object.values(props.doc.lotteryPlays || {}),
        };
      } else {
        form.value = {
          customerId: null,
          playDate: new Date(),
          lotteryPlays: [],
          totalAmount: 0,
          deptAmount: 0,
          description: "",
          isDebt: false,
          isUnchanged: false,
        };
      }
    }
  },
);

// Auto-calculate Net Total Invoice Amount (Bet Amounts minus Winning Payouts)
watch(
  () => form.value.lotteryPlays,
  (plays) => {
    let betTotal = 0;
    let winTotal = 0;

    if (plays && plays.length > 0) {
      plays.forEach((play) => {
        // Calculate incoming bet money
        betTotal += (Number(play.twoDigitAmount) || 0) * 1;
        betTotal += (Number(play.threeDigitAmount) || 0) * 0.65;

        // Calculate outgoing payout money
        if (play.isTwoNumber) {
          winTotal += (Number(play.twoDigitNumber) || 0) * 100;
        }
        if (play.isThreeNumber) {
          winTotal += (Number(play.threeDigitNumber) || 0) * 600;
        }
      });
    }

    // Net total. Math.trunc drops decimal digits (e.g. 201.5 becomes 201)
    form.value.totalAmount = Math.trunc(betTotal - winTotal);
  },
  { deep: true },
);

const addPlay = () => {
  form.value.lotteryPlays.push({
    categoryId: null,
    productId: null,
    title: "",
    twoDigitNumber: null,
    threeDigitNumber: null,
    twoDigitAmount: null,
    threeDigitAmount: null,
    isTwoNumber: false,
    isThreeNumber: false,
  });
};

const removePlay = (index) => {
  form.value.lotteryPlays.splice(index, 1);
  if (errors.value.plays.length > index) {
    errors.value.plays.splice(index, 1);
  }
};

const validateForm = () => {
  let isValid = true;
  errors.value = { customerId: false, playDate: false, plays: [] };

  if (!form.value.customerId) {
    errors.value.customerId = true;
    isValid = false;
  }

  if (!form.value.playDate) {
    errors.value.playDate = true;
    isValid = false;
  }

  // Validate dynamically added plays
  if (form.value.lotteryPlays.length > 0) {
    form.value.lotteryPlays.forEach((play, index) => {
      const playErrors = { categoryId: false, productId: false, title: false };

      if (!play.categoryId) {
        playErrors.categoryId = true;
        isValid = false;
      }
      if (!play.productId) {
        playErrors.productId = true;
        isValid = false;
      }
      if (!play.title || !play.title.trim()) {
        playErrors.title = true;
        isValid = false;
      }

      errors.value.plays[index] = playErrors;
    });
  }

  return isValid;
};

const handleClose = () => {
  form.value = {
    customerId: null,
    playDate: null,
    lotteryPlays: [],
    totalAmount: 0,
    deptAmount: 0,
    description: "",
    isDebt: false,
    isUnchanged: false,
  };
  errors.value = { customerId: false, playDate: false, plays: [] };
  emit("onClose");
};

const saveInvoice = async () => {
  if (!validateForm()) {
    showToast("error", "Please fill in all required fields.");
    return;
  }
  loading.value = true;

  // Extract pure String ID for customer to prevent 500 CastErrors
  const targetCustomerId =
    typeof form.value.customerId === "object"
      ? form.value.customerId?._id
      : form.value.customerId;

  const baseFields = {
    branchId: branchStore.branchId || "",
    customerId: targetCustomerId,
    playDate: form.value.playDate,
    lotteryPlays: Object.fromEntries(
      form.value.lotteryPlays.map((play, index) => [
        `play_${index}`,
        {
          categoryId: play.categoryId,
          productId: play.productId,
          title: play.title,
          twoDigitNumber: play.twoDigitNumber,
          threeDigitNumber: play.threeDigitNumber,
          twoDigitAmount: play.twoDigitAmount,
          threeDigitAmount: play.threeDigitAmount,
          isTwoNumber: play.isTwoNumber,
          isThreeNumber: play.isThreeNumber,
        },
      ]),
    ),
    finalTwoAmount: 0, // Fallback for backend schema validation
    finalThreeAmount: 0, // Fallback for backend schema validation
    isChiefLotteryWin: false, // Fallback for backend schema validation
    totalAmount: form.value.totalAmount,
    deptAmount: form.value.deptAmount,
    description: form.value.description,
    isDebt: form.value.isDebt,
    isUnchanged: form.value.isUnchanged,
  };

  const payload = {
    fields: {
      ...baseFields,
      ...(props.isEditDoc
        ? { updatedAt: new Date(), updatedBy: branchStore.userId || "" }
        : { createdAt: new Date(), createdBy: branchStore.userId || "" }),
    },
  };

  try {
    let savedInvoiceId = null;

    // 1. Save main Invoice
    if (props.isEditDoc && props.doc?._id) {
      await updateDoc("Invoice", props.doc._id, payload);
      savedInvoiceId = props.doc._id;
      showToast("update", "Invoice updated successfully.");
    } else {
      const res = await insertDoc("Invoice", payload);
      savedInvoiceId = res?._id || res?.data?._id || res?.id;
      showToast("create", "Invoice created successfully.");
    }

    // ==========================================
    // 2. ROBUST REVERSAL & AUTOMATION LOGIC
    // ==========================================
    const isNowLocked = form.value.isUnchanged;
    const wasLocked = props.isEditDoc && props.doc?.isUnchanged;

    const newNetTotal = isNowLocked ? Number(form.value.totalAmount) || 0 : 0;
    const oldNetTotal = wasLocked ? Number(props.doc?.totalAmount) || 0 : 0;
    const balanceDelta = newNetTotal - oldNetTotal;

    let expenseId = null;

    // STEP A: Clean up any existing ChiefExpense for this Invoice to prevent ghost expenses
    if (props.isEditDoc) {
      const expRes = await getDocs("ChiefExpense");
      if (expRes?.data) {
        const oldExpenses = expRes.data.filter(
          (e) =>
            e.description &&
            e.description.includes(`Invoice ID: ${savedInvoiceId}`),
        );
        for (const exp of oldExpenses) {
          await deleteDoc("ChiefExpense", exp._id);
        }
      }
    }

    // STEP B: If currently locked and negative, create a new accurate ChiefExpense
    if (isNowLocked && newNetTotal < 0) {
      const expensePayload = {
        fields: {
          branchId: branchStore.branchId || "",
          customerId: targetCustomerId,
          paymentDate: form.value.playDate || new Date(),
          amount: Math.abs(newNetTotal),
          description: `Auto-generated expense from Invoice. Invoice ID: ${savedInvoiceId}`,
          createdAt: new Date(),
          createdBy: branchStore.userId || "",
        },
      };
      const expenseRes = await insertDoc("ChiefExpense", expensePayload);
      expenseId = expenseRes?._id || expenseRes?.data?._id || expenseRes?.id;
    }

    // STEP C: Apply the Net Balance Difference to LotteryChiefBalance
    if (balanceDelta !== 0 || (!isNowLocked && wasLocked)) {
      const balanceRes = await getDocs("LotteryChiefBalance");
      let activeBalance = balanceRes.data?.find(
        (b) => b.branchId === branchStore.branchId && b.status === true,
      );

      if (activeBalance) {
        let updatedInvoiceIds = Array.isArray(activeBalance.invoiceIds)
          ? [...activeBalance.invoiceIds]
          : [];

        if (isNowLocked && !updatedInvoiceIds.includes(savedInvoiceId)) {
          updatedInvoiceIds.push(savedInvoiceId);
        } else if (!isNowLocked) {
          updatedInvoiceIds = updatedInvoiceIds.filter(
            (id) => id !== savedInvoiceId,
          );
        }

        const updateFields = {
          amount: Number(activeBalance.amount || 0) + balanceDelta,
          invoiceIds: updatedInvoiceIds,
          updatedAt: new Date(),
          updatedBy: branchStore.userId || "",
          // Fallback to empty string to prevent validation errors if it's a positive gain with no expense
          lastChiefExpenseId:
            expenseId || activeBalance.lastChiefExpenseId || "",
        };

        await updateDoc("LotteryChiefBalance", activeBalance._id, {
          fields: updateFields,
        });
      } else if (isNowLocked) {
        const newFields = {
          branchId: branchStore.branchId || "",
          amount: balanceDelta,
          invoiceIds: [savedInvoiceId],
          status: true,
          createdAt: new Date(),
          createdBy: branchStore.userId || "",
          lastChiefExpenseId: expenseId || "",
        };
        await insertDoc("LotteryChiefBalance", { fields: newFields });
      }
    }

    // 3. SCHEMA RULE: deptAmount pushes to CustomerReimburstment
    // Same dynamic locking logic applied to Debts
    const newDeptAmount = isNowLocked ? Number(form.value.deptAmount) || 0 : 0;
    const oldDeptAmount = wasLocked ? Number(props.doc?.deptAmount) || 0 : 0;
    const deptDiff = newDeptAmount - oldDeptAmount;

    if (deptDiff !== 0 || (!isNowLocked && wasLocked)) {
      const reimRes = await getDocs("CustomerReimburstment");

      let customerReim = reimRes.data?.find((r) => {
        const rCustId =
          typeof r.customerId === "object" ? r.customerId?._id : r.customerId;
        return (
          rCustId === targetCustomerId && r.branchId === branchStore.branchId
        );
      });

      if (customerReim) {
        let updatedInvoiceIds = Array.isArray(customerReim.invoiceIds)
          ? [...customerReim.invoiceIds]
          : [];
        if (isNowLocked && !updatedInvoiceIds.includes(savedInvoiceId)) {
          updatedInvoiceIds.push(savedInvoiceId);
        } else if (!isNowLocked) {
          updatedInvoiceIds = updatedInvoiceIds.filter(
            (id) => id !== savedInvoiceId,
          );
        }

        await updateDoc("CustomerReimburstment", customerReim._id, {
          fields: {
            totalDebt: Number(customerReim.totalDebt || 0) + deptDiff,
            invoiceIds: updatedInvoiceIds,
            updatedAt: new Date(),
            updatedBy: branchStore.userId || "",
          },
        });
      } else if (newDeptAmount > 0 && isNowLocked) {
        await insertDoc("CustomerReimburstment", {
          fields: {
            branchId: branchStore.branchId || "",
            customerId: targetCustomerId,
            totalDebt: newDeptAmount,
            invoiceIds: [savedInvoiceId],
            lastCustomerReturnMoneyId: "",
            status: true,
            createdAt: new Date(),
            createdBy: branchStore.userId || "",
          },
        });
      }
    }

    emit("refresh");
    handleClose();
  } catch (error) {
    console.error("Failed to save invoice:", error);
    showToast("error", "Failed to save invoice. Please try again.");
  } finally {
    loading.value = false;
  }
};
</script>
