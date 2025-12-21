<template>
  <div class="p-4 shadow-4 border-round surface-card">
        <!-- Back Button -->
    <button
      @click="handleNavigateBack"
      class="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
      aria-label="Go back"
    >
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>
    <div class="flex justify-content-between align-items-center mb-4">
      <h2 class="m-0 text-2xl">Daily Betting Ledger</h2>
      <div class="flex gap-2">
        <Button label="New Entry" icon="pi pi-plus" class="p-button-raised" @click="openNew" />
        <Button label="Print Selected" icon="pi pi-print" class="p-button-success" @click="printSelectedEntries" />
      </div>
    </div>

    <DataTable 
      :value="entries" 
      responsiveLayout="scroll" 
      stripedRows 
      class="p-datatable-sm shadow-1" 
      selectionMode="multiple" 
      v-model:selection="selectedEntries"
      dataKey="id"
    >
      <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="customer" header="Customer"></Column>
      <Column field="head" header="លេខក្បាល (Head)"></Column>
      <Column field="twoDigit" header="2លេខ"></Column>
      <Column field="threeDigit" header="3លេខ"></Column>
      <Column field="win2Digit" header="Win 2"></Column>
      <Column field="win3Digit" header="Win 3"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-text p-button-success" @click="editEntry(slotProps.data)" />
          <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="deleteEntry(slotProps.data.id)" />
        </template>
      </Column>
    </DataTable>

    <!-- Add/Edit Dialog -->
    <Dialog 
      v-model:visible="entryDialog" 
      :header="isEdit ? 'Update Entry' : 'New Entry'" 
      modal class="p-fluid" style="width: 400px"
      @hide="entry.value = { category: null, customer: null, head: '', twoDigit: null, threeDigit: null, win2Digit: null, win3Digit: null }"
    >
      <div class="field mb-3">
        <label>Category</label>
        <Dropdown v-model="entry.category" :options="categories" optionLabel="label" optionValue="value" placeholder="Select" />
      </div>
      <div class="field mb-3">
        <label>Customer</label>
        <Dropdown v-model="entry.customer" :options="customers" optionLabel="label" optionValue="value" placeholder="Select" />
      </div>
      <div class="field mb-3">
        <label>Head Number (លេខក្បាល)</label>
        <InputText v-model="entry.head" placeholder="e.g. 82:5" />
      </div>
      <div class="grid">
        <div class="col-6 field">
          <label>2-Digit</label>
          <InputNumber v-model="entry.twoDigit" />
        </div>
        <div class="col-6 field">
          <label>3-Digit</label>
          <InputNumber v-model="entry.threeDigit" />
        </div>
      </div>
      <div class="grid">
        <div class="col-6 field">
          <label>Win Amount 2</label>
          <InputNumber v-model="entry.win2Digit" />
        </div>
        <div class="col-6 field">
          <label>Win Amount 3</label>
          <InputNumber v-model="entry.win3Digit" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="entryDialog = false" />
        <Button label="Save Entry" icon="pi pi-check" @click="saveEntry" />
      </template>
    </Dialog>
  </div>
</template>
<script>
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import { useRouter } from 'vue-router'

export default {
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
    InputNumber,
    Dropdown
  },

  setup() {
      const router = useRouter() // FIX: initialize router
    
    // --- CONFIGURATION & DATA ---
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

    const entries = ref([
      { id: 1, category: 'ល្ងាច', customer: 'សុខា', head: '82:5', twoDigit: 340, threeDigit: 0, win2Digit: 0, win3Digit: 0 },
      { id: 2, category: 'ល្ងាច', customer: 'សុខា', head: '515:20', twoDigit: 100, threeDigit: 160, win2Digit: 0, win3Digit: 0 },
      { id: 3, category: 'យប់', customer: 'វណ្ណ', head: '90:7', twoDigit: 200, threeDigit: 50, win2Digit: 0, win3Digit: 0 }
    ]);
    const handleNavigateBack = () => {
      router.push('/')
    }
    // --- STATE ---
    const entryDialog = ref(false);
    const isEdit = ref(false);
    const entry = ref({
      category: null,
      customer: null,
      head: '',
      twoDigit: null,
      threeDigit: null,
      win2Digit: null,
      win3Digit: null
    });

    const selectedEntries = ref([]);

    // --- CRUD LOGIC ---
    const openNew = () => {
      entry.value = {
        category: null,
        customer: null,
        head: '',
        twoDigit: null,
        threeDigit: null,
        win2Digit: null,
        win3Digit: null
      };
      isEdit.value = false;
      entryDialog.value = true;
    };

    const editEntry = (data) => {
      entry.value = { ...data };
      isEdit.value = true;
      entryDialog.value = true;
    };

    const saveEntry = () => {
      if (!entry.value.category || !entry.value.customer || !entry.value.head) {
        alert('Please fill in Category, Customer, and Head Number.');
        return;
      }

      if (isEdit.value) {
        const index = entries.value.findIndex(e => e.id === entry.value.id);
        if (index !== -1) {
          entries.value[index] = { ...entry.value };
        }
      } else {
        entry.value.id = Date.now();
        entries.value.push({ ...entry.value });
      }

      entryDialog.value = false;
    };

    const deleteEntry = (id) => {
      if (confirm('Are you sure you want to delete this entry?')) {
        entries.value = entries.value.filter(e => e.id !== id);
      }
    };

    // --- PRINT SELECTED ENTRIES ---
    const printSelectedEntries = () => {
      if (!selectedEntries.value.length) {
        alert('Please select at least one entry to print.');
        return;
      }

      let content = '';
      let netTotal = 0;

      selectedEntries.value.forEach((data, idx) => {
        const t2 = Number(data.twoDigit || 0);
        const t3 = Number(data.threeDigit || 0);
        const win2 = Number(data.win2Digit || 0);
        const win3 = Number(data.win3Digit || 0);

        const comm65 = Math.round(t3 * 0.65);
        const win2Payout = win2 * 100;
        const win3Payout = win3 * 100;
        const net = t2 + comm65 - win2Payout - win3Payout;
        netTotal += net;

        content += `
          <div class="ticket">
            <div class="title">${data.category} - ${data.customer}</div>
            <table>
              <thead>
                <tr>
                  <th>លេខក្បាល</th>
                  <th>2លេខ</th>
                  <th>3លេខ</th>
                  <th>Win 2</th>
                  <th>Win 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>(${idx + 1}) ${data.head}</td>
                  <td>${t2}</td>
                  <td>${t3 || ''}</td>
                  <td>${win2 || ''}</td>
                  <td>${win3 || ''}</td>
                </tr>
              </tbody>
            </table>
            <div class="math-section">
              <div>2លេខ ${t2} x 100% = ${t2}</div>
              ${t3 ? `<div>3លេខ ${t3} x 65% = ${comm65}</div>` : ''}
              ${win2 ? `<div class="win-row">Win2: ${win2} x 100 = -${win2Payout}</div>` : ''}
              ${win3 ? `<div class="win-row">Win3: ${win3} x 100 = -${win3Payout}</div>` : ''}
              <div class="final-total">Net: ${net}</div>
            </div>
          </div>
          <hr/>
        `;
      });

      const printWindow = window.open('', '', 'height=800,width=600');
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: 'Khmer OS Battambang', sans-serif; padding: 20px; }
              .ticket { border: 1px solid #d4d4aa; border-radius: 8px; padding: 15px; background: #fff; margin-bottom: 15px; }
              .title { text-align: center; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th { font-size: 12px; border-bottom: 1px solid #ccc; text-align: left; }
              td { padding: 5px 0; font-weight: bold; }
              .math-section { margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px; font-size: 14px; line-height: 1.8; }
              .win-row { color: #d32f2f; }
              .final-total { border-top: 2px solid #333; margin-top: 10px; padding-top: 5px; font-size: 16px; font-weight: bold; color: #1a237e; text-align: right; }
            </style>
          </head>
          <body>
            ${content}
            <h3>Total Net: ${netTotal}</h3>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };

    return {
      categories,
      customers,
      entries,
      entryDialog,
      isEdit,
      entry,
      selectedEntries,
      openNew,
      editEntry,
      saveEntry,
      deleteEntry,
      printSelectedEntries,
      handleNavigateBack
    };
  }
};
</script>


