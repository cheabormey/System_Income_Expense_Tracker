<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-[100]">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-[950px] border-2 border-[#82B215]">

              <div class="flex items-center justify-between px-6 py-4 border-b bg-white">
                <div>
                  <DialogTitle as="h3" class="text-xl font-bold text-[#045B1B]">
                    {{ isEditDoc ? 'Edit Customer' : 'Create Customer' }}
                  </DialogTitle>

                </div>
                <svg @click="handleClose" class="close cursor-pointer w-6 h-6" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </div>

              <div class="bg-[#F8FAFC] p-6 max-h-[80vh] overflow-y-auto scrollbar text-left">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

                    <div class="space-y-4">
                      <h4 class="font-bold text-[#045B1B] border-l-4 border-[#045B1B] pl-2 uppercase text-xs">General
                        Info</h4>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-700">Name (ឈ្មោះ)</label>
                        <InputText v-model="form.username" placeholder="Enter name" class="w-full" />
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-700">Phone number</label>
                        <InputText v-model="form.phoneNumber" placeholder="Enter phone" class="w-full" />
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-700">Address</label>
                        <InputText v-model="form.address" placeholder="Enter address" class="w-full" />
                      </div>
                      <div class="flex flex-col gap-1.5">
                        <label class="text-sm font-semibold text-gray-700">Description</label>
                        <Textarea v-model="form.description" rows="3" class="w-full" autoResize />
                      </div>
                    </div>

                    <div class="space-y-4">
                      <div class="flex justify-between items-center border-l-4 border-gray-400 pl-2">
                        <h4 class="font-bold text-gray-700 uppercase text-xs">Product Permissions</h4>
                        <button type="button" @click="addSetting"
                          class="text-[10px] bg-[#045B1B] text-white px-3 py-1 rounded-lg font-bold">
                          + ADD ROW
                        </button>
                      </div>

                      <div class="grid grid-cols-1 gap-4">
                        <div v-for="(setting, index) in form.percentages" :key="index"
                          class="bg-white border border-[#D1E2F4] rounded-xl p-4 shadow-sm relative group transition-all hover:border-[#82B215]">

                          <button v-if="form.percentages.length > 1" type="button" @click="removeSetting(index)"
                            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-[10px] flex items-center justify-center shadow-md z-20">✕</button>

                          <div class="mb-4">
                            <label class="text-[9px] font-bold text-gray-400 uppercase block mb-2">Category</label>
                            <div class="flex gap-2">
                              <button v-for="type in ['Type 2', 'Type 3']" :key="type" type="button"
                                @click="handleTypeChange(setting, type)"
                                :class="['flex-1 py-1.5 text-[10px] font-bold rounded-md border transition-all',
                                  setting.productType === type ? 'bg-[#045B1B] text-white border-[#045B1B]' : 'bg-gray-50 text-gray-500 border-gray-200']">
                                {{ type }}
                              </button>
                            </div>
                          </div>

                          <div class="flex flex-col gap-1.5 mb-4 text-left">
                            <label class="text-[9px] font-bold text-gray-400 uppercase">Product (ផលិតផល)</label>
                            <Dropdown v-model="setting.productId" :options="getFilteredProducts(setting.productType)"
                              optionLabel="label" optionValue="value" filter @change="onProductChange(setting)"
                              placeholder="Choose product..." class="w-full text-sm" />
                          </div>




                          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                            <div class="flex flex-col gap-1.5 text-left">
                              <label class="text-[9px] font-bold text-gray-400 uppercase">Percentage (%)</label>
                              <Dropdown v-model="setting.percentages" :options="percentageData[setting.productType]"
                                class="w-full text-sm font-bold h-9 flex items-center" />
                            </div>

                            <div class="flex flex-col gap-1.5 text-left">
                              <label class="text-[9px] font-bold text-gray-400 uppercase">Multiplier</label>
                              <div class="flex items-center gap-2">
                                <span class="text-xs font-bold text-[#045B1B] shrink-0">x</span>
                                <InputNumber v-model="setting.winMultiplier" class="w-full h-9 text-sm font-mono"
                                  inputClass="w-full h-9" />
                              </div>
                            </div>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-end gap-4 pt-6 border-t">
                    <button type="button" class="btn-cancel px-6 py-2" @click="handleClose">Cancel</button>
                    <button type="submit" class="btn-add px-8 py-2 bg-[#045B1B] text-white rounded-xl font-bold"
                      :disabled="loading">
                      <span v-if="loading">🌀</span> {{ isEditDoc ? 'UPDATE' : 'SAVE' }}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot, DialogTitle } from '@headlessui/vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import { useDocument } from '@/composable/useDocument';
import { getDocument } from '@/composable/getDocument';

const props = defineProps(['visible', 'isEditDoc', 'doc']);
const emit = defineEmits(['onClose']);
const { insertDoc, updateDoc } = useDocument();
const { getDocs } = getDocument();

const loading = ref(false);
const productList = ref([]);





const percentageData = {
  'Type 2': [101, 102, 103, 104, 105, 106, 107, 108, 109],
  'Type 3': [65, 70, 75, 80, 85, 90, 95, 100]
};




onMounted(async () => {
  try {
    const res = await getDocs('Product'); 
    if (res && res.data) {
      productList.value = res.data.map(p => ({
        label: p.name,
        value: p._id,
        baseWin: p.winMultiplier || 0,
        category: p.winMultiplier >= 600 ? 'Type 3' : 'Type 2'
      }));
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
});

const getInitialForm = () => ({
  username: '', phoneNumber: '', address: '', description: '',
  percentages: [{ productId: '', percentages: 109, winMultiplier: 100, productType: 'Type 2' }],
  status: true
});

const form = reactive(getInitialForm());

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
  if (product) {
    setting.winMultiplier = product.baseWin;
  }
};

const addSetting = () => {
  form.percentages.push({ productId: '', percentages: 109, winMultiplier: 100, productType: 'Type 2' });
};

const removeSetting = (index) => {
  if (form.percentages.length > 1) form.percentages.splice(index, 1);
};

const handleClose = () => emit('onClose');

watch(() => props.visible, (val) => {
  if (val && props.doc) {
    Object.assign(form, { ...props.doc, percentages: props.doc.percentages || getInitialForm().percentages });
  } else if (val) {
    Object.assign(form, getInitialForm());
  }
});

const handleSubmit = async () => {
  if (!form.username) return;
  loading.value = true;
  try {
    const payload = { fields: { ...form } };
    const res = props.isEditDoc ? await updateDoc('Customer', props.doc._id, payload) : await insertDoc('Customer', payload);
    if (res) handleClose();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>