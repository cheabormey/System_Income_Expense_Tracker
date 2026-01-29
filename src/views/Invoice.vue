<template>
  <div class="p-4 shadow-4 border-round surface-card">
    <button @click="handleNavigateBack"
      class="p-2 text-color hover:bg-blue-100 border-none bg-transparent border-round-3xl transition-all mb-4 inline-flex align-items-center cursor-pointer"
      aria-label="Go back">
      <i class="pi pi-chevron-left text-xl"></i>
      <span class="ml-1 font-bold">Back</span>
    </button>

    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0 text-2xl font-bold">Daily Betting Ledger</h2>
      <div class="flex gap-2">
        <Button label="New Entry" icon="pi pi-plus" class="p-button-raised" @click="openNew" />
        <Button label="Print Selected" icon="pi pi-print" class="p-button-success" @click="printSelectedEntries" />
      </div>
    </div>

    <DataTable :value="entries" responsiveLayout="scroll" stripedRows v-model:selection="selectedEntries" dataKey="id"
      class="p-datatable-sm shadow-1 border-round overflow-hidden">
      <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
      <Column field="date" header="Date" sortable>
        <template #body="slotProps">
          {{ formatDate(slotProps.data.date) }}
        </template>
      </Column>
      <Column field="category" header="Category"></Column>
      <Column field="customer" header="Customer"></Column>
      <Column field="head" header="Head (លេខ)"></Column>
      <Column field="twoDigit" header="2-Digit"></Column>
      <Column field="threeDigit" header="3-Digit"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-success" @click="editEntry(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteEntry(slotProps.data.id)" />
        </template>
      </Column>
    </DataTable>

    <Dialog v-model:visible="displayDialog" :header="isEditMode ? 'Update Entry' : 'New Entry'" modal
      class="p-fluid rounded-lg shadow-xl max-w-md w-full mx-2 sm:mx-auto" style="max-width: 500px;">
      <div class="space-y-4">
        <!-- Date -->
        <div class="field">
          <label class="font-semibold text-sm mb-1 block">Date</label>
          <Calendar v-model="activeEntry.date" dateFormat="dd/mm/yy" showIcon
            class="w-full " />
        </div>

        <!-- Category -->
        <div class="field">
          <label class="font-semibold text-sm mb-1 block">Category</label>
          <Dropdown v-model="activeEntry.category" :options="categories" optionLabel="label" optionValue="value"
            placeholder="Select Category"
            class="w-full " />
        </div>

        <!-- Customer -->
        <div class="field">
          <label class="font-semibold text-sm mb-1 block">Customer</label>
          <Dropdown v-model="activeEntry.customer" :options="customers" optionLabel="label" optionValue="value"
            placeholder="Select Customer"
            class="w-full " />
        </div>

        <!-- Head Number -->
        <div class="field">
          <label class="font-semibold text-sm mb-1 block">Head Number</label>
          <InputText v-model="activeEntry.head" placeholder="e.g. 82:5"
            class="w-full " />
        </div>

        <!-- 2-Digit / 3-Digit -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="field">
            <label class="font-semibold text-sm mb-1 block">2-Digit</label>
            <InputNumber v-model="activeEntry.twoDigit" :min="0"
              class="w-full " />
          </div>
          <div class="field">
            <label class="font-semibold text-sm mb-1 block">3-Digit</label>
            <InputNumber v-model="activeEntry.threeDigit" :min="0"
              class="w-full " />
          </div>
        </div>

        <!-- Win 2 / Win 3 -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="field">
            <label class="font-semibold text-sm mb-1 block">Win 2</label>
            <InputNumber v-model="activeEntry.win2Digit" :min="0"
              class="w-full " />
          </div>
          <div class="field">
            <label class="font-semibold text-sm mb-1 block">Win 3</label>
            <InputNumber v-model="activeEntry.win3Digit" :min="0"
              class="w-full r" />
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <template #footer>
        <div class="flex flex-col sm:flex-row justify-end gap-2 mt-4 w-full">
          <Button label="Cancel" icon="pi pi-times" class="p-button-text w-full sm:w-auto"
            @click="displayDialog = false" />
          <Button label="Save Entry" icon="pi pi-check" class="p-button-success w-full sm:w-auto"
            @click="saveToLedger" />
        </div>
      </template>
    </Dialog>

  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';

export default {
  components: {
    DataTable, Column, Button, Dialog, InputText, InputNumber, Dropdown, Calendar
  },
  setup() {
    const router = useRouter();

    // --- STATE & CONFIG ---
    const entries = ref([]);
    const selectedEntries = ref([]);
    const displayDialog = ref(false);
    const isEditMode = ref(false);
    const activeEntry = ref({
      id: null, date: new Date(), category: null, customer: null, head: '',
      twoDigit: 0, threeDigit: 0, win2Digit: 0, win3Digit: 0
    });

    const categories = ref([
      { label: 'ល្ងាច (Evening)', value: 'ល្ងាច' },
      { label: 'យប់ (Night)', value: 'យប់' },
      { label: 'ដីពាក់កណ្តាល', value: 'ដីពាក់កណ្តាល' }
    ]);
    const customers = ref([
      { label: 'សុខា', value: 'សុខា' },
      { label: 'វណ្ណ', value: 'វណ្ណ' },
      { label: 'ស្រីម៉ា', value: 'ស្រីម៉ា' }
    ]);

    // --- UTILS ---
    const formatDate = (val) => {
      if (!val) return '';
      const d = new Date(val);
      return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
    };

    const handleNavigateBack = () => {
      router.push('/');
    };

    // --- CRUD LOGIC ---
    const openNew = () => {
      activeEntry.value = {
        id: null, date: new Date(), category: null, customer: null, head: '',
        twoDigit: 0, threeDigit: 0, win2Digit: 0, win3Digit: 0
      };
      isEditMode.value = false;
      displayDialog.value = true;
    };

    const editEntry = (data) => {
      activeEntry.value = { ...data, date: new Date(data.date) };
      isEditMode.value = true;
      displayDialog.value = true;
    };

    const saveToLedger = () => {
      if (!activeEntry.value.category || !activeEntry.value.customer || !activeEntry.value.head) {
        alert('Please fill in all required fields.');
        return;
      }

      if (isEditMode.value) {
        const idx = entries.value.findIndex(e => e.id === activeEntry.value.id);
        if (idx !== -1) entries.value[idx] = { ...activeEntry.value };
      } else {
        activeEntry.value.id = Date.now();
        entries.value.push({ ...activeEntry.value });
      }
      displayDialog.value = false;
    };

    const deleteEntry = (id) => {
      if (confirm('Are you sure you want to delete this?')) {
        entries.value = entries.value.filter(e => e.id !== id);
      }
    };

    // --- PRINTER LOGIC ---
    const printSelectedEntries = () => {
      if (!selectedEntries.value.length) {
        alert('Please select entries to print.');
        return;
      }

      let content = '';
      let grandNetTotal = 0;

      selectedEntries.value.forEach((data, idx) => {
        const t2 = Number(data.twoDigit || 0);
        const t3 = Number(data.threeDigit || 0);
        const win2 = Number(data.win2Digit || 0);
        const win3 = Number(data.win3Digit || 0);

        const comm65 = Math.round(t3 * 0.65);
        const win2Payout = win2 * 100;
        const win3Payout = win3 * 100;
        const net = (t2 + comm65) - (win2Payout + win3Payout);
        grandNetTotal += net;

        content += `
          <div class="ticket">
            <div class="header">
              <strong>${formatDate(data.date)}</strong> | ${data.category}<br>
              <span class="customer-name">ឈ្មោះ: ${data.customer}</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>លេខក្បាល</th>
                  <th>2លេខ</th>
                  <th>3លេខ</th>
                  <th>Win2</th>
                  <th>Win3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>(${idx + 1}) ${data.head}</td>
                  <td>${t2 || '-'}</td>
                  <td>${t3 || '-'}</td>
                  <td>${win2 || '-'}</td>
                  <td>${win3 || '-'}</td>
                </tr>
              </tbody>
            </table>
            <div class="calc-section">
              <div class="row"><span>2លេខ (100%):</span> <span>${t2}</span></div>
              ${t3 > 0 ? `<div class="row"><span>3លេខ (65%):</span> <span>${comm65}</span></div>` : ''}
              ${win2 > 0 ? `<div class="row win"><span>Win2 Payout:</span> <span>-${win2Payout}</span></div>` : ''}
              ${win3 > 0 ? `<div class="row win"><span>Win3 Payout:</span> <span>-${win3Payout}</span></div>` : ''}
              <div class="net-row"><span>Net Amount:</span> <span>${net.toLocaleString()}</span></div>
            </div>
          </div>
        `;
      });

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Khmer&display=swap');
              body { font-family: 'Khmer', Arial, sans-serif; padding: 20px; font-size: 14px; color: #333; }
              .ticket { border: 1px solid #000; padding: 10px; margin-bottom: 20px; page-break-inside: avoid; }
              .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 10px; }
              .customer-name { font-size: 1.1em; font-weight: bold; }
              table { width: 100%; border-collapse: collapse; }
              th { border-bottom: 1px solid #000; text-align: left; font-size: 11px; }
              td { padding: 5px 0; font-weight: bold; font-size: 15px; }
              .calc-section { margin-top: 10px; border-top: 1px dashed #666; padding-top: 5px; }
              .row { display: flex; justify-content: space-between; margin-bottom: 2px; }
              .win { color: #d32f2f; }
              .net-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 5px; margin-top: 5px; }
              .grand-total { text-align: right; font-size: 20px; font-weight: bold; margin-top: 20px; border: 2px solid #000; padding: 10px; }
              @media print { .no-print { display: none; } }
            </style>
          </head>
          <body>
            <div class="no-print"><button onclick="window.print()" style="padding: 10px; cursor: pointer;">Print Receipt</button><hr></div>
            ${content}
            <div class="grand-total">GRAND TOTAL: ${grandNetTotal.toLocaleString()}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
    };

    return {
      entries, selectedEntries, displayDialog, isEditMode, activeEntry,
      categories, customers, formatDate, openNew, editEntry, saveToLedger,
      deleteEntry, printSelectedEntries, handleNavigateBack
    };
  }
};
</script>