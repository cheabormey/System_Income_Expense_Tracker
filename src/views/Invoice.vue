<template>
  <div class="p-4 md:p-6 lg:p-8 bg-white shadow-lg rounded-xl max-w-7xl mx-auto">
    <!-- Back Button -->
    <button @click="handleNavigateBack"
      class="flex items-center gap-2 px-4 py-2 mb-4 text-gray-700 hover:bg-blue-100 rounded-full transition">
      <i class="pi pi-chevron-left text-lg"></i>
      <span class="font-semibold">Back</span>
    </button>

    <!-- Header Section -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Daily Betting Ledger</h2>
      <div class="flex flex-wrap gap-2">
        <Button label="New Entry" icon="pi pi-plus" class="p-button-raised bg-green-600 hover:bg-green-700 border-none"
          @click="openNew" />
        <Button label="Print Selected" icon="pi pi-print" class="p-button-success border-none"
          @click="printSelectedEntries" />
      </div>
    </div>

    <!-- Data Table -->
    <div class="overflow-x-auto">
      <DataTable :value="entries" responsiveLayout="scroll" stripedRows v-model:selection="selectedEntries"
        dataKey="_id" class="p-datatable-sm shadow rounded-lg">
        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>

        <Column field="playDate" header="Date" sortable>
          <template #body="slotProps">
            {{ formatDate(slotProps.data.playDate) }}
          </template>
        </Column>

        <Column field="customerId.username" header="Customer"></Column>

        <Column field="totalAmount" header="Total Amount">
          <template #body="slotProps">
            <span
              :class="slotProps.data.totalAmount < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'">
              {{ slotProps.data.totalAmount ? slotProps.data.totalAmount.toLocaleString() : '0' }}
            </span>
          </template>
        </Column>


        <Column header="Actions">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="p-button-text p-button-success mr-2"
              @click="editEntry(slotProps.data)" />
            <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteEntry(slotProps.data._id)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Form -->
    <InvoiceForm :visible="displayDialog" :isEditDoc="isEditMode" :doc="selectedDoc" @onClose="displayDialog = false"
      @refresh="fetchLedgerData" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InvoiceForm from '../components/Modal/InvoiceForm.vue';
import { getDocument } from '@/composable/getDocument';

export default {
  components: { DataTable, Column, Button, InvoiceForm },
  setup() {
    const router = useRouter();
    const { getDocs } = getDocument();

    const entries = ref([]);
    const selectedEntries = ref([]);
    const displayDialog = ref(false);
    const isEditMode = ref(false);
    const selectedDoc = ref(null);

    const fetchLedgerData = async () => {
      const res = await getDocs('Invoice');
      if (res?.data) entries.value = res.data;
    };

    onMounted(fetchLedgerData);

    const formatDate = (val) => {
      if (!val) return '';
      return new Date(val).toLocaleDateString('en-GB');
    };

    const handleNavigateBack = () => router.push('/');
    const openNew = () => { selectedDoc.value = null; isEditMode.value = false; displayDialog.value = true; };
    const editEntry = (data) => { selectedDoc.value = data; isEditMode.value = true; displayDialog.value = true; };
    const deleteEntry = async (id) => {
      if (confirm('Are you sure you want to delete this invoice?')) {
        // await deleteDoc('Invoice', id);
        // fetchLedgerData();
      }
    };
    const printSelectedEntries = () => {
      if (!selectedEntries.value.length) { alert('Please select entries to print.'); return; }
      // ... print logic
    };

    return {
      entries, selectedEntries, displayDialog, isEditMode, selectedDoc,
      formatDate, openNew, editEntry, deleteEntry, fetchLedgerData,
      printSelectedEntries, handleNavigateBack
    };
  }
};
</script>

<style scoped>
/* Mobile-friendly scroll for small screens */
.p-datatable-sm {
  min-width: 600px;
}

/* Hover effect for actions */
.p-button-text.p-button-success:hover {
  background-color: #d1fae5;
}

.p-button-text.p-button-danger:hover {
  background-color: #fee2e2;
}
</style>
