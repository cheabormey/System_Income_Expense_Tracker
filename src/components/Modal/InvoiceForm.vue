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
        <div class="flex justify-between items-center mb-3 border-b pb-2">
          <h3 class="text-lg font-bold text-gray-800">Lottery Plays</h3>
          <Button
            label="Add Play"
            icon="pi pi-plus"
            size="small"
            class="p-button-success p-button-outlined"
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
                >Category</label
              >
              <Dropdown
                v-model="play.categoryId"
                :options="categories"
                optionLabel="name"
                optionValue="_id"
                placeholder="Select Category"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-600 mb-1"
                >Product</label
              >
              <Dropdown
                v-model="play.productId"
                :options="products"
                optionLabel="name"
                optionValue="_id"
                placeholder="Select Product"
              />
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-medium text-gray-600 mb-1"
                >Title</label
              >
              <InputText v-model="play.title" placeholder="e.g. Morning Play" />
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
                  class="text-sm cursor-pointer select-none"
                  >Is 2D Number?</label
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
                  class="text-sm cursor-pointer select-none"
                  >Is 3D Number?</label
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
              >Total Invoice Amount (Auto-Calculated)</label
            >
            <InputNumber
              v-model="form.totalAmount"
              placeholder="0 ៛"
              mode="decimal"
              inputClass="font-bold text-green-600 bg-gray-100 cursor-not-allowed"
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
        <div
          class="flex items-center gap-2 cursor-pointer"
          title="Check if the Chief won this bet"
        >
          <Checkbox
            v-model="form.isChiefLotteryWin"
            binary
            inputId="chiefWin"
          />
          <label for="chiefWin" class="font-medium text-[#045B1B] select-none"
            >Chief Lottery Win</label
          >
        </div>
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
          title="Check this to prevent deletion and record to history"
        >
          <Checkbox v-model="form.isUnchanged" binary inputId="isUnchanged" />
          <label for="isUnchanged" class="font-medium text-red-600 select-none"
            >Lock Invoice (Unchanged)</label
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

const { insertDoc, updateDoc } = useDocument();
const { getDocs } = getDocument();
const { showToast } = useAppToast();
const branchStore = useBranchStore();
const loading = ref(false);

const customers = ref([]);
const categories = ref([]);
const products = ref([]);

const errors = ref({ customerId: false, playDate: false });

const form = ref({
  customerId: null,
  playDate: null,
  lotteryPlays: [],
  totalAmount: 0,
  deptAmount: 0,
  description: "",
  isChiefLotteryWin: false,
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
          isChiefLotteryWin: false,
          isDebt: false,
          isUnchanged: false,
        };
      }
    }
  },
);

// Auto-calculate Total Invoice Amount
watch(
  () => form.value.lotteryPlays,
  (plays) => {
    let total = 0;
    if (plays && plays.length > 0) {
      plays.forEach((play) => {
        total +=
          (Number(play.twoDigitAmount) || 0) +
          (Number(play.threeDigitAmount) || 0);
      });
    }
    form.value.totalAmount = total;
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
    customerId: null,
    playDate: null,
    lotteryPlays: [],
    totalAmount: 0,
    deptAmount: 0,
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

  // Auto assign branchId from the global store
  cleanFields.branchId = branchStore.branchId;

  // Clean up system fields before sending to the backend
  delete cleanFields._id;
  delete cleanFields.__v;
  delete cleanFields.createdAt;
  delete cleanFields.createdBy;

  const payload = {
    fields: {
      branchId: branchStore.branchId,
      customerId: form.value.customerId,
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
      totalAmount: form.value.totalAmount,
      deptAmount: form.value.deptAmount,
      description: form.value.description,
      isChiefLotteryWin: form.value.isChiefLotteryWin,
      isDebt: form.value.isDebt,
      isUnchanged: form.value.isUnchanged,
      updatedBy: branchStore.userId,
      updatedAt: props.isEditDoc ? new Date() : null,
      ...(props.isEditDoc ? {} : { createdBy: branchStore.userId }),
    },
  };

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
        (b) => b.branchId === branchStore.branchId && b.status === true,
      );

      // Sum up the total of this invoice to add to the wallet
      const currentInvoiceTotal = Number(form.value.totalAmount) || 0;

      if (activeBalance) {
        let updatedInvoiceIds = Array.isArray(activeBalance.invoiceIds)
          ? [...activeBalance.invoiceIds]
          : [];
        if (!updatedInvoiceIds.includes(savedInvoiceId))
          updatedInvoiceIds.push(savedInvoiceId);

        // Add the new total to the Chief's Wallet
        await updateDoc("LotteryChiefBalance", activeBalance._id, {
          fields: {
            amount: Number(activeBalance.amount || 0) + currentInvoiceTotal,
            invoiceIds: updatedInvoiceIds,
            updatedAt: new Date(),
            updatedBy: branchStore.userId,
          },
        });
      } else {
        await insertDoc("LotteryChiefBalance", {
          fields: {
            branchId: branchStore.branchId,
            amount: currentInvoiceTotal,
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
