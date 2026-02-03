<template>
  <div class="p-4 shadow-4 border-round surface-card">
    <button @click="handleNavigateBack"
      class="p-2 text-color hover:bg-blue-100 border-none bg-transparent border-round-3xl transition-all mb-4 inline-flex align-items-center cursor-pointer">
      <i class="pi pi-chevron-left text-xl"></i>
      <span class="ml-1 font-bold">Back</span>
    </button>

    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0 text-2xl font-bold">Daily Betting Ledger</h2>
      <div class="flex gap-2">
        <Button label="New Entry" icon="pi pi-plus" class="p-button-raised bg-[#5B9717] border-none" @click="openNew" />
        <Button label="Print Selected" icon="pi pi-print" class="p-button-success" @click="printSelectedEntries" />
      </div>
    </div>

    <DataTable :value="entries" responsiveLayout="scroll" stripedRows v-model:selection="selectedEntries" dataKey="_id"
      class="p-datatable-sm shadow-1 border-round overflow-hidden">
      <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
      <Column field="playDate" header="Date" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.playDate) }}
        </template>
      </Column>
      <Column field="customerId.username" header="Customer"></Column>
      <Column field="totalAmount" header="Total Amount">
        <template #body="slotProps">
          <span :class="slotProps.data.totalAmount < 0 ? 'text-red-600' : 'text-green-600'">
            {{ slotProps.data.totalAmount.toLocaleString() }}
          </span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-success" @click="editEntry(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteEntry(slotProps.data._id)" />
        </template>
      </Column>
    </DataTable>

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
// Import your custom form component
import InvoiceForm from '../components/Modal/InvoiceForm.vue';
import { getDocument } from '@/composable/getDocument';

export default {
  components: {
    DataTable, Column, Button, InvoiceForm
  },
  setup() {
    const router = useRouter();
    const { getDocs } = getDocument();

    // --- STATE ---
    const entries = ref([]);
    const selectedEntries = ref([]);
    const displayDialog = ref(false);
    const isEditMode = ref(false);
    const selectedDoc = ref(null);

    // --- DATA FETCHING ---
    const fetchLedgerData = async () => {
      const res = await getDocs('Invoice');
      if (res?.data) {
        entries.value = res.data;
      }
    };

    onMounted(fetchLedgerData);

    // --- UTILS ---
    const formatDate = (val) => {
      if (!val) return '';
      const d = new Date(val);
      return d.toLocaleDateString('en-GB');
    };

    const handleNavigateBack = () => router.push('/');

    // --- CRUD LOGIC ---
    const openNew = () => {
      selectedDoc.value = null;
      isEditMode.value = false;
      displayDialog.value = true;
    };

    const editEntry = (data) => {
      selectedDoc.value = data;
      isEditMode.value = true;
      displayDialog.value = true;
    };

    const deleteEntry = async (id) => {
      if (confirm('Are you sure you want to delete this invoice?')) {
        // Use your useDocument delete function here if available
        // await deleteDoc('Invoice', id);
        // fetchLedgerData();
      }
    };

    // --- PRINTER LOGIC (Updated to match Invoice Schema) ---
    const printSelectedEntries = () => {
      if (!selectedEntries.value.length) {
        alert('Please select entries to print.');
        return;
      }
      // ... (existing print logic using selectedEntries.value)
    };

    return {
      entries, selectedEntries, displayDialog, isEditMode, selectedDoc,
      formatDate, openNew, editEntry, deleteEntry, fetchLedgerData,
      printSelectedEntries, handleNavigateBack
    };
  }
};
</script>