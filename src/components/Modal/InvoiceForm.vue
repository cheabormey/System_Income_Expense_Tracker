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
    class="w-[95vw] md:w-[80vw] lg:w-[65vw]"
  >
    <div class="space-y-6">
      <!-- BASIC INFO -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="form-label font-semibold mb-1 block">Branch</label>
          <Dropdown
            v-model="form.branchId"
            :options="branches"
            optionLabel="name"
            optionValue="_id"
            placeholder="Select Branch"
            class="w-full"
          />
        </div>

        <div>
          <label class="form-label font-semibold mb-1 block"
            >Customer <span class="text-red-500">*</span></label
          >
          <Dropdown
            v-model="form.customerId"
            :options="customers"
            optionLabel="username"
            optionValue="_id"
            placeholder="Select Customer"
            class="w-full"
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
          <label class="form-label font-semibold mb-1 block"
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
            >Play Date is required</Message
          >
        </div>
      </section>

      <!-- LOTTERY PLAYS -->
      <section>
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-lg font-semibold">Lottery Plays</h3>
          <Button
            label="Add Play"
            icon="pi pi-plus"
            size="small"
            @click="addPlay"
          />
        </div>

        <div
          v-for="(play, index) in form.lotteryPlays"
          :key="index"
          class="border rounded-lg p-4 mb-4 bg-gray-50 space-y-3"
        >
          <div class="flex justify-between items-center mb-2">
            <strong>Play #{{ index + 1 }}</strong>
            <Button
              icon="pi pi-trash"
              text
              severity="danger"
              @click="removePlay(index)"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Dropdown
              v-model="play.categoryId"
              :options="categories"
              optionLabel="name"
              optionValue="_id"
              placeholder="Category"
            />
            <Dropdown
              v-model="play.productId"
              :options="products"
              optionLabel="name"
              optionValue="_id"
              placeholder="Product"
            />
            <InputText
              v-model="play.title"
              placeholder="Title"
              class="w-full"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium">2D Win Type</label>
              <div class="flex items-center gap-2">
                <InputNumber
                  v-model="play.winTwoNumberType"
                  placeholder="2D Win Number"
                  class="flex-1"
                />
                <Checkbox v-model="play.isTwoNumber" binary />
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium">3D Win Type</label>
              <div class="flex items-center gap-2">
                <InputNumber
                  v-model="play.winThreeNumberType"
                  placeholder="3D Win Number"
                  class="flex-1"
                />
                <Checkbox v-model="play.isThreeNumber" binary />
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium">Total Amount</label>
              <InputNumber
                v-model="play.totalAmount"
                placeholder="Amount"
                mode="decimal"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- TOTAL SUMMARY -->
      <section
        class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg"
      >
        <div class="flex flex-col">
          <label class="text-sm font-semibold mb-1 text-gray-600"
            >Final 2D Amount</label
          >
          <InputNumber
            v-model="form.finalTwoAmount"
            placeholder="0"
            mode="decimal"
          />
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-semibold mb-1 text-gray-600"
            >Final 3D Amount</label
          >
          <InputNumber
            v-model="form.finalThreeAmount"
            placeholder="0"
            mode="decimal"
          />
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-semibold mb-1 text-gray-600"
            >Debt Amount</label
          >
          <InputNumber
            v-model="form.debtAmount"
            placeholder="0"
            mode="decimal"
          />
        </div>
        <div class="flex flex-col">
          <label class="text-sm font-semibold mb-1 text-gray-600"
            >Grand Total Amount</label
          >
          <InputNumber
            v-model="form.totalAmount"
            placeholder="0"
            mode="decimal"
          />
        </div>
      </section>

      <!-- DESCRIPTION -->
      <section>
        <label class="form-label font-semibold mb-1 block">Description</label>
        <Textarea v-model="form.description" rows="3" class="w-full" />
      </section>

      <!-- FLAGS -->
      <section
        class="flex flex-wrap gap-6 mt-2 bg-blue-50 p-4 rounded-lg border border-blue-100"
      >
        <div
          class="flex items-center gap-2 cursor-pointer"
          title="Check if the Chief won this bet"
        >
          <Checkbox
            v-model="form.isChiefLotteryWin"
            binary
            inputId="chiefWin"
          />
          <label for="chiefWin" class="font-medium text-[#045B1B]"
            >Chief Lottery Win</label
          >
        </div>
        <div class="flex items-center gap-2 cursor-pointer">
          <Checkbox v-model="form.isDebt" binary inputId="isDebt" />
          <label for="isDebt" class="font-medium">Is Debt</label>
        </div>
        <div
          class="flex items-center gap-2 cursor-pointer"
          title="Check this to prevent deletion and record to history"
        >
          <Checkbox v-model="form.isUnchanged" binary inputId="isUnchanged" />
          <label for="isUnchanged" class="font-medium text-red-600"
            >Lock Invoice (Unchanged)</label
          >
        </div>
      </section>
    </div>

    <template #footer>
      <Button label="Cancel" text @click="handleClose" />
      <Button
        label="Save"
        icon="pi pi-check"
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

const { insertDoc, updateDoc } = useDocument();
const { getDocs } = getDocument();
const { showToast } = useAppToast();
const branchStore = useBranchStore();
const loading = ref(false);

const branches = ref([]);
const customers = ref([]);
const categories = ref([]);
const products = ref([]);

const errors = ref({ customerId: false, playDate: false });

const form = ref({
  branchId: null,
  customerId: null,
  playDate: null,
  lotteryPlays: [],
  finalTwoAmount: 0,
  finalThreeAmount: 0,
  debtAmount: 0,
  totalAmount: 0,
  description: "",
  isChiefLotteryWin: false,
  isDebt: false,
  isUnchanged: false,
});

const fetchDropdownData = async () => {
  try {
    const [branchRes, customerRes, categoryRes, productRes] = await Promise.all(
      [
        getDocs("Branch"),
        getDocs("Customer"),
        getDocs("Category"),
        getDocs("Product"),
      ],
    );
    branches.value = branchRes.data || [];
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
          lotteryPlays: Array.isArray(props.doc.lotteryPlays)
            ? [...props.doc.lotteryPlays]
            : Object.values(props.doc.lotteryPlays || {}),
        };
      } else {
        form.value.lotteryPlays = [];
        form.value.branchId = branchStore.branchId;
      }
    }
  },
);

const addPlay = () => {
  form.value.lotteryPlays.push({
    categoryId: null,
    productId: null,
    title: "",
    winTwoNumberType: null,
    winThreeNumberType: null,
    isTwoNumber: false,
    isThreeNumber: false,
    totalAmount: null,
  });
};

const removePlay = (index) => form.value.lotteryPlays.splice(index, 1);

const validateForm = () => {
  let isValid = true;
  errors.value = { customerId: false, playDate: false };
  if (!form.value.customerId) {
    errors.value.customerId = true;
    isValid = false;
  }
  if (!form.value.playDate) {
    errors.value.playDate = true;
    isValid = false;
  }
  return isValid;
};

const handleClose = () => {
  form.value = {
    branchId: branchStore.branchId,
    customerId: null,
    playDate: null,
    lotteryPlays: [],
    finalTwoAmount: 0,
    finalThreeAmount: 0,
    debtAmount: 0,
    totalAmount: 0,
    description: "",
    isChiefLotteryWin: false,
    isDebt: false,
    isUnchanged: false,
  };
  errors.value = { customerId: false, playDate: false };
  emit("onClose");
};

const saveInvoice = async () => {
  if (!validateForm()) return;
  loading.value = true;

  const cleanFields = { ...form.value };

  // Transform lotteryPlays array back to Map object for MongoDB Schema compliance
  cleanFields.lotteryPlays = Object.fromEntries(
    form.value.lotteryPlays.map((p, i) => [`play_${i}`, p]),
  );

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
  if (!props.isEditDoc) {
    payload.fields.createdAt = new Date();
    payload.fields.createdBy = branchStore.userId;
  }

  try {
    let savedInvoiceId = null;

    // 1. Save the Invoice
    if (props.isEditDoc && props.doc?._id) {
      await updateDoc("Invoice", props.doc._id, payload);
      savedInvoiceId = props.doc._id;
      showToast("update", "Invoice updated successfully.");
    } else {
      const res = await insertDoc("Invoice", payload);
      savedInvoiceId = res?._id || res?.data?._id || res?.id;
      showToast("create", "Invoice created successfully.");
    }

    // 2. SCHEMA RULE: isUnchanged creates a duplicate backup in InvoiceRecord
    if (form.value.isUnchanged) {
      await insertDoc("InvoiceRecord", {
        fields: { ...payload.fields, originalInvoiceId: savedInvoiceId },
      });
    }

    // 3. SCHEMA RULE: isChiefLotteryWin ADDS (+) to LotteryChiefBalance (Wallet)
    if (form.value.isChiefLotteryWin) {
      const balanceRes = await getDocs("LotteryChiefBalance");
      let activeBalance = balanceRes.data?.find(
        (b) => b.branchId === form.value.branchId && b.status === true,
      );

      // Calculate difference if editing. If new, the difference is just the new totalAmount.
      const oldTotal =
        props.isEditDoc && props.doc.isChiefLotteryWin
          ? Number(props.doc.totalAmount || 0)
          : 0;
      const newTotal = Number(form.value.totalAmount || 0);
      const addedValue = newTotal - oldTotal;

      if (activeBalance) {
        let updatedInvoiceIds = Array.isArray(activeBalance.invoiceIds)
          ? [...activeBalance.invoiceIds]
          : [];
        if (!updatedInvoiceIds.includes(savedInvoiceId))
          updatedInvoiceIds.push(savedInvoiceId);

        await updateDoc("LotteryChiefBalance", activeBalance._id, {
          fields: {
            amount: Number(activeBalance.amount || 0) + addedValue, // Math: Add to Wallet
            invoiceIds: updatedInvoiceIds,
            updatedAt: new Date(),
            updatedBy: branchStore.userId,
          },
        });
        console.log(`Chief Balance increased by ${addedValue} ៛`);
      } else {
        await insertDoc("LotteryChiefBalance", {
          fields: {
            branchId: form.value.branchId,
            amount: newTotal,
            invoiceIds: [savedInvoiceId],
            status: true,
            createdAt: new Date(),
            createdBy: branchStore.userId,
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
