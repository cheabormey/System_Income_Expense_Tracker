<template>
  <Dialog v-model:visible="internalVisible" modal :header="isEditDoc ? 'Update Invoice' : 'New Invoice'"
    class="p-fluid w-full max-w-[95vw] md:max-w-7xl border-none" 
    contentClass="bg-gray-50 rounded-b-xl"
    @hide="close">
    
    <div class="space-y-6 pt-2">
      <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="field mb-0">
          <label class="block text-sm font-bold text-gray-700 mb-2">Play Date</label>
          <Calendar v-model="form.playDate" dateFormat="dd/mm/yy" showIcon class="h-11 w-full" />
        </div>
        <div class="field mb-0">
          <label class="block text-sm font-bold text-gray-700 mb-2">Customer Name</label>
          <Dropdown v-model="form.customerId" :options="customerOptions" optionLabel="username" optionValue="_id"
            placeholder="Select customer" filter class="h-11 flex align-items-center w-full"
            @change="handleCustomerChange" />
        </div>
      </div>

      <div>
        <div class="flex justify-between items-center px-1 mb-3">
          <h3 class="text-lg font-extrabold text-[#045B1B] flex items-center gap-2">
            <i class="pi pi-list"></i> Betting Entries
          </h3>
          <Button label="New Row" icon="pi pi-plus" size="small" 
            class="p-button-rounded bg-[#5B9717] border-none shadow-md w-auto px-4" 
            @click="addLotteryPlay" />
        </div>

        <div class="space-y-3">
          <div v-for="(play, index) in form.lotteryPlays" :key="index" 
            class="bg-white border border-gray-200 rounded-xl shadow-sm relative overflow-visible hover:shadow-md transition-shadow">
            
            <div class="grid grid-cols-1 md:grid-cols-12 p-3 gap-4 items-center">
              
              <div class="col-span-1 md:col-span-3 border-r border-gray-100 pr-2">
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Category / Head</label>
                <div class="flex gap-2">
                  <Dropdown v-model="play.categoryId" :options="categoryOptions" optionLabel="name" optionValue="_id" 
                    placeholder="Cat" class="w-1/2 h-10 text-sm" />
                  <InputText v-model="play.productId" placeholder="Head" class="w-1/2 h-10 text-sm" />
                </div>
              </div>

              <!-- <div class="col-span-1 md:col-span-2 border-r border-gray-100 pr-2">
                <label class="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Bet Amount</label>
                <InputNumber v-model="play.totalAmount" mode="decimal" class="h-10 w-full font-bold" placeholder="0.00" />
              </div> -->

              <div class="col-span-1 md:col-span-3 bg-blue-50/60 p-2 rounded-lg border border-blue-100">
                <div class="flex items-center justify-between mb-1">
                   <div class="flex items-center gap-2">
                     <Checkbox v-model="play.isTwoNumber" :binary="true" inputId="chk2d" />
                     <label for="chk2d" class="text-xs font-bold text-blue-700 cursor-pointer">2D Type</label>
                   </div>
                   <span class="text-[9px] text-blue-400 font-bold">x{{ getRule('Type 2').winMultiplier }}</span>
                </div>
                <InputNumber v-model="play.winTwoNumberType" placeholder="Enter Win Amount" 
                  class="h-9 w-full text-sm" :disabled="!play.isTwoNumber" />
              </div>

              <div class="col-span-1 md:col-span-3 bg-purple-50/60 p-2 rounded-lg border border-purple-100">
                <div class="flex items-center justify-between mb-1">
                   <div class="flex items-center gap-2">
                     <Checkbox v-model="play.isThreeNumber" :binary="true" inputId="chk3d" />
                     <label for="chk3d" class="text-xs font-bold text-purple-700 cursor-pointer">3D Type</label>
                   </div>
                   <span class="text-[9px] text-purple-400 font-bold">x{{ getRule('Type 3').winMultiplier }}</span>
                </div>
                <InputNumber v-model="play.winThreeNumberType" placeholder="Enter Win Amount" 
                   class="h-9 w-full text-sm" :disabled="!play.isThreeNumber" />
              </div>

              <div class="col-span-1 md:col-span-1 flex flex-col items-end justify-center pl-2">
                <label class="text-[9px] font-bold text-gray-400 uppercase block md:text-right w-full">Net</label>
                <div class="text-lg font-black mb-1" :class="calculateRowTotal(play) < 0 ? 'text-red-500' : 'text-[#045B1B]'">
                  {{ calculateRowTotal(play).toLocaleString() }}
                </div>
                <Button icon="pi pi-trash" class="p-button-text p-button-danger p-button-sm h-6 w-6 mt-1" 
                  @click="removeLotteryPlay(index)" v-if="form.lotteryPlays.length > 1" />
              </div>

            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-800 p-6 rounded-xl text-white shadow-xl mt-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 items-end">
          <div class="flex flex-col">
            <span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">2D Income</span>
            <span class="text-xl md:text-2xl font-mono font-medium text-blue-200">{{ total2DIncome.toLocaleString() }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">3D Income</span>
            <span class="text-xl md:text-2xl font-mono font-medium text-purple-300">{{ total3DIncome.toLocaleString() }}</span>
          </div>
          <div class="hidden md:block"></div> 
          <div class="flex flex-col border-l border-gray-600 pl-6 col-span-2 md:col-span-1">
            <span class="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Grand Total (Net)</span>
            <span class="text-3xl font-black leading-none" :class="grandTotal >= 0 ? 'text-green-400' : 'text-red-500'">
              {{ grandTotal.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex gap-3 justify-end mt-4 pt-3 border-t border-gray-200">
        <Button label="Cancel" text @click="close" class="text-gray-500 w-auto" />
        <Button label="Save Invoice" icon="pi pi-check" class="bg-[#045B1B] border-none px-6 w-auto" @click="submit" :loading="isSubmitting" />
      </div>
    </template>
  </Dialog>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import { getDocument } from '@/composable/getDocument';
import { useDocument } from '@/composable/useDocument';

export default {
  components: { Dialog, Button, InputText, InputNumber, Dropdown, Calendar, Checkbox },
  props: { visible: Boolean, isEditDoc: Boolean, doc: Object },
  emits: ['onClose', 'refresh'],
  setup(props, { emit }) {
    const { getDocs } = getDocument();
    const { insertDoc, updateDoc } = useDocument();
    
    const isSubmitting = ref(false);
    const customerOptions = ref([]);
    const categoryOptions = ref([]);
    const currentCustomerConfig = ref(null);

    const internalVisible = computed({
      get: () => props.visible,
      set: (value) => { if (!value) emit('onClose'); }
    });

    const form = ref({
      customerId: '',
      playDate: new Date(),
      lotteryPlays: [],
      finalTwoAmount: 0,
      finalThreeAmount: 0,
      totalAmount: 0
    });

    const createNewPlay = () => ({
      categoryId: '',
      productId: '', 
      isTwoNumber: false, 
      isThreeNumber: false,
      winTwoNumberType: null,
      winThreeNumberType: null,
      totalAmount: 0
    });

    const loadOptions = async () => {
      const [customers, categories] = await Promise.all([
        getDocs('Customer'),
        getDocs('Category')
      ]);
      if (customers?.data) customerOptions.value = customers.data;
      if (categories?.data) categoryOptions.value = categories.data;
    };
    onMounted(loadOptions);

    const handleCustomerChange = () => {
      const cust = customerOptions.value.find(c => c._id === form.value.customerId);
      currentCustomerConfig.value = cust || null;
    };

    const getRule = (typeStr) => {
      const defaultRule = { percentages: 100, winMultiplier: typeStr === 'Type 3' ? 600 : 100 };
      if (!currentCustomerConfig.value?.percentages) return defaultRule;
      const rule = currentCustomerConfig.value.percentages.find(p => p.productType === typeStr);
      return rule || defaultRule;
    };

    // CALCULATION LOGIC
    const calculateRowTotal = (play) => {
      let income = 0;
      let payout = 0;

      if (play.isTwoNumber) {
        const rule = getRule("Type 2");
        income += play.totalAmount * (rule.percentages / 100);
        if (play.winTwoNumberType > 0) payout += play.winTwoNumberType * rule.winMultiplier;
      }

      if (play.isThreeNumber) {
        const rule = getRule("Type 3");
        income += play.totalAmount * (rule.percentages / 100);
        if (play.winThreeNumberType > 0) payout += play.winThreeNumberType * rule.winMultiplier;
      }

      return Math.round(income - payout);
    };

    const total2DIncome = computed(() => {
      return form.value.lotteryPlays.reduce((sum, p) => {
        if (p.isTwoNumber) {
          const rule = getRule("Type 2");
          return sum + (p.totalAmount * (rule.percentages / 100));
        }
        return sum;
      }, 0);
    });

    const total3DIncome = computed(() => {
      return form.value.lotteryPlays.reduce((sum, p) => {
         if (p.isThreeNumber) {
           const rule = getRule("Type 3");
           return sum + (p.totalAmount * (rule.percentages / 100));
         }
         return sum;
      }, 0);
    });

    const grandTotal = computed(() => {
      return form.value.lotteryPlays.reduce((sum, p) => sum + calculateRowTotal(p), 0);
    });

    watch(() => props.doc, (val) => {
      if (val) {
        form.value = { 
          ...val, 
          playDate: val.playDate ? new Date(val.playDate) : new Date(),
          lotteryPlays: val.lotteryPlays?.length ? [...val.lotteryPlays] : [createNewPlay()]
        };
        if (val.customerId) {
          setTimeout(() => handleCustomerChange(), 100);
        }
      } else {
        form.value = { customerId: '', playDate: new Date(), lotteryPlays: [createNewPlay()], finalTwoAmount: 0, finalThreeAmount: 0, totalAmount: 0 };
        currentCustomerConfig.value = null;
      }
    }, { immediate: true });

    const close = () => emit('onClose');

    const submit = async () => {
      isSubmitting.value = true;
      try {
        form.value.finalTwoAmount = total2DIncome.value;
        form.value.finalThreeAmount = total3DIncome.value;
        form.value.totalAmount = grandTotal.value;

        if (props.isEditDoc) {
          await updateDoc('Invoice', props.doc._id, form.value);
        } else {
          await insertDoc('Invoice', form.value);
        }
        emit('refresh');
        close();
      } catch (err) {
        console.error("Submission error:", err);
      } finally {
        isSubmitting.value = false;
      }
    };

    return { 
      internalVisible, form, customerOptions, categoryOptions, 
      currentCustomerConfig, getRule,
      isSubmitting, close, submit, 
      addLotteryPlay: () => form.value.lotteryPlays.push(createNewPlay()),
      removeLotteryPlay: (i) => form.value.lotteryPlays.splice(i, 1),
      calculateRowTotal, total2DIncome, total3DIncome, grandTotal, handleCustomerChange
    };
  }
};
</script>

<style scoped>
:deep(.p-inputnumber-input:disabled) {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}
</style>