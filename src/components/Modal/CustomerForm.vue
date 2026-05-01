<template>
  <  <div class="flex justify-center fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity z-50">
      <Dialog :visible="props.visible" modal :closable="false" :style="{ width: '55rem' }"
    :breakpoints="{ '1199px': '80vw', '768px': '92vw' }" class="rounded-2xl overflow-hidden">
    <!-- Header -->
    <template #header>
      <div class="flex items-center justify-between w-full px-2">
        <h3 class="text-xl md:text-2xl font-bold text-[#045B1B]">
          {{ props.isEditDoc ? 'Edit Customer' : 'Create Customer' }}
        </h3>

          <button type="button" class="text-red-500 hover:text-red-300" @click="handleClose">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 
                1.293a1 1 0 101.414 1.414L10 11.414l1.293 
                1.293a1 1 0 001.414-1.414L11.414 
                10l1.293-1.293a1 1 0 00-1.414-1.414L10 
                8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
      </div>
    </template>

    <!-- Body -->
    <div class=" max-h-[80vh] overflow-y-auto scrollbar text-left">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div class=" bg-[#F8FAFC] border border-gray-50 shadow-sm rounded-xl border- p-5">
            <!-- General Info -->
            <div class="space-y-5">
              <!-- <h4 class="font-bold text-[#045B1B] border-l-4 border-[#045B1B] pl-3 uppercase text-xs tracking-wider">
              General Info
            </h4> -->
              <div class="flex items-center gap-3">
                <!-- Icon -->
                <div class="w-9 h-9 flex items-center justify-center rounded-xl 
                bg-primary border border-primary-border text-white shadow">
                  <i class="pi pi-user"></i>
                </div>

                <div>
                  <h4 class="font-bold text-primary-text uppercase text-xs tracking-wider">
                    General Info
                  </h4>
                  <p class="text-[11px] text-gray-500">
                    Customer basic information
                  </p>
                </div>
              </div>

              <div class="space-y-4">

                <!-- Name -->
                <div class="space-y-2">
                  <div class="flex space-x-2">
                    <label class="label">{{ $t("Name") }}</label>
                    <span class="rq-label"></span>
                  </div>

                  <InputText v-model="form.username" :invalid="isNameInvalid || isNameDuplicate" class="w-full"
                    :placeholder="t('Enter customer name')" autocomplete="off" @blur="checkCustomerNameUnique" />

                  <Message v-if="isNameInvalid" severity="error">
                    {{ $t("Customer name is required") }}
                  </Message>

                  <Message v-if="!isNameInvalid && isNameDuplicate" severity="error">
                    {{ $t("This customer name already exists") }}
                  </Message>
                </div>

                <!-- Phone -->
                <div class="space-y-2">
                  <div class="flex space-x-2">
                    <label class="label">{{ $t("Contact") }}</label>
                    <span class="rq-label"></span>
                  </div>
                  <InputText v-model="form.phoneNumber" :invalid="isContact || isPhoneDuplicate" class="w-full"
                    :placeholder="t('Enter contact')" @blur="checkPhoneUnique" />

                  <Message v-if="isContact" severity="error">
                    {{ $t("Contact is required") }}
                  </Message>

                  <Message v-if="!isContact && isPhoneDuplicate" severity="error">
                    {{ $t("This contact already exists") }}
                  </Message>
                </div>

                <!-- Address -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Address</label>
                  <InputText v-model="form.address" placeholder="Enter address" class="w-full" />
                </div>

                <!-- Description -->
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm font-semibold text-gray-700">Description</label>
                  <Textarea v-model="form.description" rows="3" class="w-full" autoResize />
                </div>
              </div>
            </div>
          </div>


          <!-- Product Permissions -->
          <div class="space-y-5">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 
         bg-primary-bg/60 backdrop-blur-lg border border-primary-border 
         rounded-2xl px-4 py-3 shadow-sm">
              <!-- LEFT TITLE -->
              <div class="flex items-center gap-3">
                <!-- Icon -->
                <div class="w-9 h-9 flex items-center justify-center rounded-xl 
                bg-primary border border-primary-border text-white shadow">
                  <!-- <i class="pi pi-lock"></i> -->
                  <i class="pi pi-percentage"></i>
                </div>

                <!-- Text -->
                <div>
                  <h4 class="font-bold text-primary-text uppercase text-xs tracking-wider">
                    Product Permissions
                  </h4>
                  <p class="text-[11px] text-gray-500">
                    Manage product access & settings
                  </p>
                </div>
              </div>

              <!-- ACTION BUTTON -->
              <button type="button" @click="addSetting" class="group flex items-center gap-2 text-xs font-bold 
           bg-primary text-white px-4 py-2 rounded-xl shadow
           hover:bg-primary-hover active:bg-primary-active transition-all">
                <span class="text-sm group-hover:rotate-90 transition">＋</span>
                ADD
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="(setting, index) in form.percentages" :key="setting.uid"
                class="bg-white border border-[#82B215] rounded-2xl p-4 sm:p-5 shadow-sm relative">
                <button v-if="form.percentages.length > 1" type="button" @click="removeSetting(index)"
                  class="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 text-xs flex items-center justify-center">
                  <i class="pi pi-trash text-xs"></i>
                </button>

                <div class="space-y-5">

                  <div>
                    <label class="text-[10px] font-bold text-gray-400 uppercase block mb-2">Category</label>
                    <div class="flex gap-2">
                      <button v-for="type in ['Type 2', 'Type 3']" :key="type" type="button"
                        @click="handleTypeChange(setting, type)" :class="[
                          'flex-1 py-2.5 text-xs font-bold rounded-xl border transition',
                          setting.productType === type
                            ? 'bg-[#045B1B] text-white border-[#045B1B]'
                            : 'bg-gray-50 text-gray-500 border-gray-200'
                        ]">
                        {{ type }}
                      </button>
                    </div>
                  </div>

                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] font-bold text-gray-400 uppercase">Product</label>
                    <Dropdown v-model="setting.productId" :options="getFilteredProducts(setting.productType)"
                      optionLabel="label" optionValue="value" filter @change="onProductChange(setting)"
                      placeholder="Choose product..." class="w-full" />
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Percentage (%)</label>
                      <Dropdown v-model="setting.percentages" :options="percentageData[setting.productType]"
                        class="w-full" />
                    </div>

                    <div class="flex flex-col gap-1.5">
                      <label class="text-[10px] font-bold text-gray-400 uppercase">Multiplier</label>
                      <InputNumber v-model="setting.winMultiplier" class="w-full " inputClass="w-full text-center " />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>


        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 mt-6">
          <button type="button" class="btn-cancel" @click="handleClose">{{ $t("Cancel") }}</button>
          <button type="submit" class="btn-sub flex items-center justify-center">
            <span v-if="!loading">{{ $t("Save") }}</span>
            <span v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          </button>
        </div>
      </form>
    </div>
  </Dialog>
  </div>

</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import Message from 'primevue/message';
import { useDocument } from '@/composable/useDocument';
import { getDocument } from '@/composable/getDocument';
import { useI18n } from 'vue-i18n';

const props = defineProps(['visible', 'isEditDoc', 'doc']);
const emit = defineEmits(['onClose']);

const { insertDoc, updateDoc } = useDocument();
const { getDocs } = getDocument();
const { t } = useI18n();

const loading = ref(false);
const productList = ref([]);
const customerDocs = ref([]);

const isContact = ref(false);
const isNameInvalid = ref(false);
const isNameDuplicate = ref(false);
const isPhoneDuplicate = ref(false);

const percentageData = {
  'Type 2': [101, 102, 103, 104, 105, 106, 107, 108, 109],
  'Type 3': [65, 70, 75, 80, 85, 90, 95, 100]
};

const createSettingRow = () => ({
  uid: Date.now() + Math.random(),
  productId: '',
  percentages: 109,
  winMultiplier: 100,
  productType: 'Type 2'
});

const getInitialForm = () => ({
  username: '',
  phoneNumber: '',
  address: '',
  description: '',
  percentages: [createSettingRow()],
  status: true
});

const form = reactive(getInitialForm());

onMounted(async () => {
  try {
    const [productRes, customerRes] = await Promise.all([
      getDocs('Product'),
      getDocs('Customer')
    ]);

    if (productRes?.data) {
      productList.value = productRes.data.map(p => ({
        label: p.name,
        value: p._id,
        baseWin: p.winMultiplier || 0,
        category: p.winMultiplier >= 600 ? 'Type 3' : 'Type 2'
      }));
    }

    if (customerRes?.data) {
      customerDocs.value = customerRes.data;
    }
  } catch (err) {
    console.error(err);
  }
});

const getFilteredProducts = (type) => {
  return productList.value.filter(p => p.category === type);
};

const handleTypeChange = (setting, type) => {
  setting.productType = type;
  setting.productId = '';
  setting.winMultiplier = type === 'Type 3' ? 600 : 100;
  setting.percentages = type === 'Type 3' ? 100 : 109;
};

const onProductChange = (setting) => {
  const product = productList.value.find(p => p.value === setting.productId);
  if (product) setting.winMultiplier = product.baseWin;
};

const addSetting = () => form.percentages.push(createSettingRow());

const removeSetting = (index) => {
  if (form.percentages.length > 1) form.percentages.splice(index, 1);
};

const handleClose = () => emit('onClose');

watch(() => props.visible, (val) => {
  if (val && props.doc) {
    Object.assign(form, {
      ...getInitialForm(),
      ...props.doc,
      percentages: props.doc?.percentages
        ? JSON.parse(JSON.stringify(props.doc.percentages)).map(item => ({
          uid: Date.now() + Math.random(),
          ...item
        }))
        : [createSettingRow()]
    });
  } else if (val) {
    Object.assign(form, getInitialForm());
  }

  isContact.value = false;
  isNameInvalid.value = false;
  isNameDuplicate.value = false;
  isPhoneDuplicate.value = false;
});

watch(() => form.username, () => {
  isNameInvalid.value = false;
  isNameDuplicate.value = false;
});

watch(() => form.phoneNumber, () => {
  isContact.value = false;
  isPhoneDuplicate.value = false;
});

const checkCustomerNameUnique = () => {
  if (!form.username) return;

  const currentName = form.username.trim().toLowerCase();

  const duplicate = customerDocs.value.some(item => {
    const sameName = item.username?.trim().toLowerCase() === currentName;

    if (props.isEditDoc) {
      return sameName && item._id !== props.doc?._id;
    }

    return sameName;
  });

  isNameDuplicate.value = duplicate;
};

const checkPhoneUnique = () => {
  if (!form.phoneNumber) return;

  const currentPhone = form.phoneNumber.trim();

  const duplicate = customerDocs.value.some(item => {
    const samePhone = item.phoneNumber?.trim() === currentPhone;

    if (props.isEditDoc) {
      return samePhone && item._id !== props.doc?._id;
    }

    return samePhone;
  });

  isPhoneDuplicate.value = duplicate;
};

const handleSubmit = async () => {
  let hasError = false;

  if (!form.username) {
    isNameInvalid.value = true;
    hasError = true;
  }

  if (!form.phoneNumber) {
    isContact.value = true;
    hasError = true;
  }

  checkCustomerNameUnique();
  checkPhoneUnique();

  if (isNameDuplicate.value || isPhoneDuplicate.value) {
    hasError = true;
  }

  if (hasError) return;

  loading.value = true;

  try {
    const payload = {
      fields: {
        ...form,
        percentages: form.percentages.map(({ uid, ...rest }) => rest)
      }
    };

    const res = props.isEditDoc
      ? await updateDoc('Customer', props.doc._id, payload)
      : await insertDoc('Customer', payload);

    if (res) {
      const customerRes = await getDocs('Customer');
      customerDocs.value = customerRes?.data || [];
      handleClose();
    }
  } catch (err) {
    console.error(err);

    const errorMessage = err?.response?.data?.message || err?.message || '';

    if (errorMessage.includes('phoneNumber')) {
      isPhoneDuplicate.value = true;
    }

    if (errorMessage.includes('username')) {
      isNameDuplicate.value = true;
    }
  } finally {
    loading.value = false;
  }
};
</script>