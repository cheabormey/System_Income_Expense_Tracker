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
    class="w-[95vw] md:w-[70vw] lg:w-[55vw]"
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
            >Customer <span class="required"></span
          ></label>
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
            >Play Date <span class="required"></span
          ></label>
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Dropdown
              v-model="play.category"
              :options="categories"
              optionLabel="name"
              optionValue="_id"
              placeholder="Category"
            />
            <InputText
              v-model="play.title"
              placeholder="Title"
              class="w-full"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-3">
              <InputNumber
                v-model="play.winTwoNumber"
                placeholder="2D Win Number"
                class="flex-1"
              />
              <Checkbox v-model="play.isTwoNumber" binary /> <span>2D</span>
            </div>

            <div class="flex items-center gap-3">
              <InputNumber
                v-model="play.winThreeNumber"
                placeholder="3D Win Number"
                class="flex-1"
              />
              <Checkbox v-model="play.isThreeNumber" binary /> <span>3D</span>
            </div>
          </div>
        </div>
      </section>

      <!-- TOTAL SUMMARY -->
      <section
        class="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg"
      >
        <InputNumber
          v-model="form.finalTwoAmount"
          disabled
          placeholder="Final 2D"
        />
        <InputNumber
          v-model="form.finalThreeAmount"
          disabled
          placeholder="Final 3D"
        />
        <InputNumber v-model="form.deptAmount" disabled placeholder="Debt" />
        <InputNumber
          v-model="form.totalAmount"
          disabled
          placeholder="Grand Total"
        />
      </section>

      <!-- DESCRIPTION -->
      <section>
        <label class="form-label font-semibold mb-1 block">Description</label>
        <Textarea v-model="form.description" rows="3" class="w-full" />
      </section>

      <!-- FLAGS -->
      <section class="flex flex-wrap gap-6 mt-2">
        <div>
          <Checkbox v-model="form.isChiefLotteryWin" binary /> Chief Win
        </div>
        <div><Checkbox v-model="form.isDebt" binary /> Debt</div>
        <div><Checkbox v-model="form.isUnchanged" binary /> Unchanged</div>
      </section>
    </div>

    <template #footer>
      <Button label="Cancel" text @click="handleClose" />
      <Button label="Save" icon="pi pi-check" @click="saveInvoice" />
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
// Import the Toast Composable
import { useAppToast } from "@/helper/toastHelper";

const props = defineProps({
  visible: Boolean,
  isEditDoc: Boolean,
  doc: Object,
});

const emit = defineEmits(["onClose", "refresh"]);

const { insertDoc, updateDoc } = useDocument();
const { showToast } = useAppToast();

const branches = ref([]);
const customers = ref([]);
const categories = ref([]);

const errors = ref({
  customerId: false,
  playDate: false,
});

const form = ref({
  branchId: null,
  customerId: null,
  playDate: null,
  lotteryPlays: [],
  finalTwoAmount: 0,
  finalThreeAmount: 0,
  deptAmount: 0,
  totalAmount: 0,
  description: "",
  isChiefLotteryWin: false,
  isDebt: false,
  isUnchanged: false,
});

const fetchDropdownData = async () => {
  try {
    const [branchRes, customerRes, categoryRes] = await Promise.all([
      getDocument().getDocs("Branch"),
      getDocument().getDocs("Customer"),
      getDocument().getDocs("Category"),
    ]);
    branches.value = branchRes.data || [];
    customers.value = customerRes.data || [];
    categories.value = categoryRes.data || [];
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
          lotteryPlays: Object.values(props.doc.lotteryPlays || {}),
        };
      } else {
        form.value.lotteryPlays = [];
      }
    }
  },
);

const addPlay = () => {
  form.value.lotteryPlays.push({
    category: null,
    title: "",
    winTwoNumber: 0,
    winThreeNumber: 0,
    isTwoNumber: false,
    isThreeNumber: false,
  });
};

const removePlay = (index) => {
  form.value.lotteryPlays.splice(index, 1);
};

// Validation Helper Function
const validateForm = () => {
  let isValid = true;
  errors.value = {
    customerId: false,
    playDate: false,
  };

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
  // Reset Form
  form.value = {
    branchId: null,
    customerId: null,
    playDate: null,
    lotteryPlays: [],
    finalTwoAmount: 0,
    finalThreeAmount: 0,
    deptAmount: 0,
    totalAmount: 0,
    description: "",
    isChiefLotteryWin: false,
    isDebt: false,
    isUnchanged: false,
  };

  // Reset Errors
  errors.value = {
    customerId: false,
    playDate: false,
  };

  emit("onClose");
};

const saveInvoice = async () => {
  // Call validation before proceeding
  if (!validateForm()) {
    return;
  }

  const payload = {
    fields: {
      ...form.value,
      lotteryPlays: Object.fromEntries(
        form.value.lotteryPlays.map((p, i) => [`play_${i}`, p]),
      ),
    },
  };

  try {
    if (props.isEditDoc && props.doc?._id) {
      await updateDoc("Invoice", props.doc._id, payload);
      showToast("update"); // Emit update toast
    } else {
      await insertDoc("Invoice", payload);
      showToast("create"); // Emit create toast
    }

    emit("refresh");
    handleClose();
  } catch (error) {
    console.error("Failed to save invoice:", error);
    showToast("error", "Failed to save invoice. Please try again."); // Emit error toast on failure
  }
};
</script>
