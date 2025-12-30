<template>
  <div class="mx-5 font-noto">
    <div class="flex items-center gap-4 mb-4">
      <button @click="$router.push('/')" class="p-2 hover:bg-gray-100 rounded-full transition">
        <ChevronLeftIcon class="w-6 h-6" />
      </button>
      <h1 class="text-2xl font-bold text-[#045B1B]">Invoices</h1>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-dashed border-[#5B9717]">
      <div class="flex flex-col md:flex-row md:items-end gap-4">
        <div class="flex-1">
          <label class="text-sm font-medium text-gray-700 mb-1 block">Search Invoices</label>
          <input v-model="searchQuery" type="text" placeholder="Search by description or ID..." class="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-[#5B9717] outline-none" />
        </div>
        <button @click="openAddForm" class="bg-[#5B9717] text-white px-6 py-2 rounded-md hover:bg-[#4a7c13] flex items-center gap-2 h-[42px]">
          <PlusIcon class="w-5 h-5" /> New Invoice
        </button>
      </div>
    </div>

    <div v-if="!isMobileScreen" key="invoice-desktop" class="bg-white rounded-lg shadow border relative overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Debt</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="inv in invoiceData" :key="inv._id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm">{{ formatDate(inv.playDate) }}</td>
            <td class="px-6 py-4 text-sm font-medium">{{ inv.customerId?.username || 'N/A' }}</td>
            <td class="px-6 py-4 text-sm font-mono font-bold">{{ inv.totalAmount?.toLocaleString() }}</td>
            <td class="px-6 py-4 text-sm font-mono text-red-600">{{ inv.deptAmount?.toLocaleString() }}</td>
            <td class="px-6 py-4">
              <span v-if="inv.isDebt" class="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Debt</span>
              <span v-else class="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Paid</span>
            </td>
            <td class="px-6 py-4 text-center">
              <button @click="openEditForm(inv)" class="text-[#045B1B] mr-3"><i class="pi pi-pencil"></i></button>
              <button @click="confirmDelete(inv)" class="text-red-600"><i class="pi pi-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else key="invoice-mobile">
      <InvoiceCard :items="invoiceData" :is-loading="isLoading" @onEdit="openEditForm" @onDelete="confirmDelete" />
    </div>

    <Pagination class="mt-5" collectionName="Invoice" :searchQuery="searchQuery" @onEmitDataFromPagination="items => invoiceData = items" />

    <InvoiceFormModal :visible="showFormModal" :is-edit-doc="isEditDoc" :doc="selectedInvoice" @onClose="showFormModal = false" />
    <DeleteConfirmation :visible="showDeleteModal" :deleteId="deleteId" :elementName="'Invoice'" collectionName="Invoice" @onCloseDelete="showDeleteModal = false" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/vue/24/outline';
import InvoiceFormModal from '../components/Modal/testinvioceForm.vue';
import InvoiceCard from '@/mobile/testinvioceCard.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';

const invoiceData = ref([]);
const searchQuery = ref('');
const isMobileScreen = ref(false);
const showFormModal = ref(false);
const showDeleteModal = ref(false);
const isEditDoc = ref(false);
const selectedInvoice = ref(null);
const deleteId = ref(null);

const formatDate = (date) => date ? new Date(date).toLocaleDateString() : '-';
const checkSize = () => { isMobileScreen.value = window.innerWidth < 768; };

onMounted(() => { checkSize(); window.addEventListener('resize', checkSize); });
onBeforeUnmount(() => window.removeEventListener('resize', checkSize));

const openAddForm = () => { isEditDoc.value = false; selectedInvoice.value = null; showFormModal.value = true; };
const openEditForm = (doc) => { isEditDoc.value = true; selectedInvoice.value = doc; showFormModal.value = true; };
const confirmDelete = (doc) => { deleteId.value = doc._id; selectedInvoice.value = doc; showDeleteModal.value = true; };
</script>