<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-[100]" >
      
      <TransitionChild 
        as="template" 
        enter="ease-out duration-300" 
        enter-from="opacity-0" 
        enter-to="opacity-100" 
        leave="ease-in duration-200" 
        leave-from="opacity-100" 
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          
          <TransitionChild 
            as="template" 
            enter="ease-out duration-300" 
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" 
            enter-to="opacity-100 translate-y-0 sm:scale-100" 
            leave="ease-in duration-200" 
            leave-from="opacity-100 translate-y-0 sm:scale-100" 
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-[900px] border-2 border-[#82B215]">
              
              <div class="flex items-center justify-between px-6 py-4 border-b bg-white">
                <div>
                  <DialogTitle as="h3" class="text-xl font-bold text-[#045B1B]">
                    {{ isEditDoc ? 'Edit Customer' : 'Create Customer' }}
                  </DialogTitle>
                  <p class="text-[10px] md:text-xs text-gray-400 uppercase tracking-tight">
                    Income and Expense Management System
                  </p>
                </div>
        <svg @click="handleClose" class="close cursor-pointer w-6 h-6" xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
              </div>

              <div class="bg-[#F8FAFC] p-6 max-h-[80vh] overflow-y-auto scrollbar">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                  
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 text-left">
                    
                    <div class="space-y-4">
                      <h4 class="font-bold text-[#045B1B] border-l-4 border-[#045B1B] pl-2">
                        បូកបន្ថែមអតិថិជន (General Info)
                      </h4>

                      <div class="space-y-4">
                        <div class="flex flex-col gap-1.5">
                          <label class="text-sm font-semibold text-gray-700 ml-1">Name (ឈ្មោះ)</label>
                          <InputText v-model="form.username" placeholder="Enter name" class="w-full custom-input" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                          <label class="text-sm font-semibold text-gray-700 ml-1">Phone number</label>
                          <InputText v-model="form.phoneNumber" placeholder="Enter phone" class="w-full custom-input" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                          <label class="text-sm font-medium text-gray-600 ml-1">Initial Balance ($)</label>
                          <InputNumber v-model="form.balance" inputId="balance" fluid placeholder="0.00" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                          <label class="text-sm font-semibold text-gray-700 ml-1">Address (អាសយដ្ឋាន)</label>
                          <InputText v-model="form.address" placeholder="Enter address" class="w-full custom-input" />
                        </div>

                        <div class="flex flex-col gap-1.5">
                          <label class="text-sm font-semibold text-gray-700 ml-1">Description</label>
                          <Textarea v-model="form.description" rows="3" placeholder="Optional notes..." class="w-full custom-input" autoResize />
                        </div>
                      </div>
                    </div>

                    <div class="space-y-4">
                      <h4 class="font-bold text-gray-700 border-l-4 border-gray-400 pl-2">Set Permission Settings</h4>

                      <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <p class="text-xs text-gray-400 mb-3 uppercase font-bold tracking-wider">Select Name Category</p>
                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                          <div v-for="cat in ['Type A', 'Type B', 'Type C', 'Type D', 'VIP']" :key="cat" class="flex items-center">
                            <Checkbox v-model="form.categories" :inputId="cat" :name="cat" :value="cat" class="mr-2" />
                            <label :for="cat" class="text-sm text-gray-600 cursor-pointer select-none">{{ cat }}</label>
                          </div>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 gap-4">
                        <div v-for="(setting, index) in [1, 2]" :key="index" class="bg-white border border-[#D1E2F4] rounded-xl p-4 shadow-sm">
                          <div class="flex justify-between items-start mb-3">
                            <span class="font-bold text-gray-800">Setting {{ setting }}</span>
                            <span class="text-[9px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">General</span>
                          </div>
                          <div class="flex items-center justify-between mb-4 gap-2">
                            <span class="text-xs text-gray-500 italic">Percentage</span>
                            <Dropdown v-model="form['percentage' + (index === 0 ? '' : '2')]" :options="[0, 50, 100, 109]" class="w-24 md:w-28 text-sm" />
                          </div>
                          <div class="flex justify-between items-center text-xs border-t pt-3">
                            <span class="text-gray-400">Winning Condition</span>
                            <span class="font-mono text-[#045B1B] font-bold">x {{ index === 0 ? '100' : '600' }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                 <!-- Buttons -->
                <div class="flex justify-end gap-4 pt-6 border-t">
                  <button type="button" class="btn-cancel" @click="handleClose" :disabled="loading">
                    Cancel
                  </button>

                  <button type="submit" class="btn-add" :disabled="loading || isNameDuplicate">
                    <span v-if="loading" class="animate-spin">🌀</span>
                    {{ isEditDoc ? 'Update' : 'Save' }}
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
import { ref, watch, reactive } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import { useDocument } from '@/composable/useDocument';

const props = defineProps(['visible', 'isEditDoc', 'doc']);
const emit = defineEmits(['onClose']);
const { insertDoc, updateDoc } = useDocument();

const loading = ref(false);

const getInitialForm = () => ({
  username: '',
  phoneNumber: '',
  address: '',
  description: '',
  balance: 0,
  percentage: 109,
  categories: [],
  status: true
});

const form = reactive(getInitialForm());

const handleClose = () => emit('onClose');

watch(() => props.visible, (val) => {
  if (val && props.doc) {
    Object.assign(form, {
      ...props.doc,
      categories: props.doc.categories || [],
      balance: props.doc.balance || 0
    });
  } else if (val) {
    Object.assign(form, getInitialForm());
  }
});

const handleSubmit = async () => {
  if (!form.username) return;
  loading.value = true;
  try {
    const payload = { fields: { ...form } };
    const res = props.isEditDoc
      ? await updateDoc('Customer', props.doc._id, payload)
      : await insertDoc('Customer', payload);
    if (res) handleClose();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
