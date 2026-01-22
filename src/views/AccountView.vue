<template>
  <div class="mx-5 font-noto">
    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">Customer Reimbursement Management</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div class="space-y-2 text-left">
          <label class="block text-sm font-semibold text-gray-700 ml-1">Filter by Customer</label>
          <Select 
            v-model="selectedCustomerId" 
            :options="customers" 
            option-label="username" 
            option-value="_id"
            placeholder="Search and select a customer" 
            filter 
            showClear
            class="w-full custom-select"
          />
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border overflow-hidden relative scrollbar">
      <div v-if="isLoading" class="absolute inset-0 bg-white/60 flex justify-center items-center z-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#045B1B]"></div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-4 text-left text-xs font-bold uppercase">Customer ID / Info</th>
            <th class="px-6 py-4 text-left text-xs font-bold uppercase">Total Debt</th>
            <th class="px-6 py-4 text-center text-xs font-bold uppercase">Record Return Money</th>
            <th class="px-6 py-4 text-left text-xs font-bold uppercase">Created At</th>
            <th class="px-6 py-4 text-center text-xs font-bold uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 bg-white">
          <tr v-for="(record, index) in reimbursementData" :key="record._id" :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4 font-medium text-gray-900">
              {{ getCustomerName(record.customerId) }}
            </td>
            <td class="px-6 py-4 font-mono font-bold" :class="record.totalDebt > 0 ? 'text-red-600' : 'text-green-700'">
              ${{ record.totalDebt?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00' }}
            </td>
            <td class="px-6 py-4 text-center">
              <button @click="handleReturnMoney(record)" class="bg-[#045B1B] text-white px-3 py-1 rounded text-xs font-bold hover:bg-[#034d16]">
                Return Money
              </button>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(record.createdAt) }}
            </td>
            <td class="px-6 py-4 text-center">
              <button @click="handleDelete(record)" class="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="reimbursementData.length === 0 && !isLoading">
            <td colspan="5" class="py-12 text-center text-gray-400 italic">
              No reimbursement records found. Select a customer or check database collection: "CustomerReimburstment".
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-6">
      <Pagination 
        :key="filterConditions"
        v-model:currentPage="currentPage" 
        :limitedPerPage="pageSize" 
        :dynamicConditions="filterConditions"
        collectionName="CustomerReimburstment" 
        @onEmitDataFromPagination="handlePaginationData" 
        @onEmitIsLoading="isLoading = $event" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { getDocument } from '@/composable/getDocument';
import formatDate from '@/composable/formatDate';

const { getDocs } = getDocument();

const reimbursementData = ref([]);
const customers = ref([]);
const selectedCustomerId = ref(null);
const isLoading = ref(false);
const currentPage = ref(1);
const pageSize = ref(50);

// Reset to page 1 when filter changes
watch(selectedCustomerId, () => { currentPage.value = 1; });

const filterConditions = computed(() => {
  const cond = [];
  if (selectedCustomerId.value) {
    // Ensure field name 'customerId' matches backend schema
    cond.push({ field: 'customerId', operator: '==', value: selectedCustomerId.value });
  }
  return JSON.stringify(cond);
});

onMounted(async () => {
  try {
    const res = await getDocs("Customer", { dynamicConditions: JSON.stringify([{ field: 'status', operator: '==', value: true }]) });
    customers.value = res.data?.data || res.data || res || [];
  } catch (err) {
    console.error("Customer fetch error:", err);
  }
});

const handlePaginationData = (items) => {
  // Parsing logic to handle array or object-wrapped data
  reimbursementData.value = items?.data || items || [];
};

const getCustomerName = (id) => {
  const found = customers.value.find(c => c._id === id);
  return found ? found.username : id;
};
</script>