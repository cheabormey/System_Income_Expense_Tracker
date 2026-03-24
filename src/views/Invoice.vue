<template>
  <div
    class="p-4 md:p-6 lg:p-8 bg-white shadow-lg rounded-xl max-w-7xl mx-auto"
  >
    <!-- Back Button -->
    <button
      @click="handleNavigateBack"
      class="flex items-center gap-2 px-4 py-2 mb-4 text-gray-700 hover:bg-blue-100 rounded-full transition"
    >
      <i class="pi pi-chevron-left text-lg"></i>
      <span class="font-semibold">Back</span>
    </button>

    <!-- Header Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
        Daily Betting Ledger
      </h2>
      <div class="flex flex-wrap gap-2">
        <Button
          label="New Entry"
          icon="pi pi-plus"
          class="p-button-raised bg-green-600 hover:bg-green-700 border-none"
          @click="openNew"
        />

        <!-- Smooth Transition wrapper for contextual actions -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-1"
        >
          <div
            v-if="selectedEntries && selectedEntries.length > 0"
            class="flex gap-2"
          >
            <Button
              label="Print Selected"
              icon="pi pi-print"
              class="p-button-success border-none"
              @click="printSelectedEntries"
            />
            <Button
              label="Delete Selected"
              icon="pi pi-trash"
              class="p-button-danger border-none"
              @click="deleteSelectedEntries"
            />
          </div>
        </Transition>
      </div>
    </div>

    <!-- Data Table -->
    <div class="overflow-x-auto">
      <DataTable
        :value="entries"
        responsiveLayout="scroll"
        stripedRows
        v-model:selection="selectedEntries"
        dataKey="_id"
        class="p-datatable-sm shadow rounded-lg"
      >
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
              :class="
                slotProps.data.totalAmount < 0
                  ? 'text-red-600 font-semibold'
                  : 'text-green-600 font-semibold'
              "
            >
              {{
                slotProps.data.totalAmount
                  ? slotProps.data.totalAmount.toLocaleString()
                  : "0"
              }}
            </span>
          </template>
        </Column>

        <Column header="Actions">
          <template #body="slotProps">
            <!-- Quick Update Action to clear debt using updateDoc -->
            <Button
              v-if="slotProps.data.isDebt"
              icon="pi pi-check-circle"
              class="p-button-text p-button-info mr-2"
              title="Mark as Paid"
              @click="markAsPaid(slotProps.data._id)"
            />
            <Button
              icon="pi pi-pencil"
              class="p-button-text p-button-success mr-2"
              @click="editEntry(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-text p-button-danger"
              @click="deleteEntry(slotProps.data._id)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Form -->
    <InvoiceForm
      :visible="displayDialog"
      :isEditDoc="isEditMode"
      :doc="selectedDoc"
      @onClose="displayDialog = false"
      @refresh="fetchLedgerData"
    />

    <!-- Toast component must be present in the template to show notifications -->
    <Toast />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Toast from "primevue/toast";
import InvoiceForm from "../components/Modal/InvoiceForm.vue";
import { getDocument } from "@/composable/getDocument";
import { useDocument } from "@/composable/useDocument";
import { useAppToast } from "@/helper/toastHelper";

export default {
  components: { DataTable, Column, Button, Toast, InvoiceForm },
  setup() {
    const router = useRouter();

    const { getDocs } = getDocument();
    const { deleteDoc, updateDoc } = useDocument();
    const { showToast } = useAppToast();

    const customer = ref([]);
    const entries = ref([]);
    const selectedEntries = ref([]);
    const displayDialog = ref(false);
    const isEditMode = ref(false);
    const selectedDoc = ref(null);

    const fetchLedgerData = async () => {
      const res = await getDocs("Invoice");
      if (res?.data) entries.value = res.data;
    };

    const fetchCustomerData = async () => {
      const res = await getDocs("Customer");
      if (res?.data) customer.value = res.data;
    };

    onMounted(async () => {
      Promise.allSettled([fetchLedgerData(), fetchCustomerData()]);
    });

    const formatDate = (val) => {
      if (!val) return "";
      return new Date(val).toLocaleDateString("en-GB");
    };

    // Inline fallback for formatNameById just in case the helper isn't hooked up correctly
    const getCustomerName = (customerId) => {
      if (!customerId) return "";
      if (typeof customerId === "object") return customerId.username || "";
      const found = customer.value.find((c) => c._id === customerId);
      return found ? found.username : customerId;
    };

    const handleNavigateBack = () => router.push("/");

    const openNew = () => {
      selectedDoc.value = null;
      isEditMode.value = false;
      displayDialog.value = true;
    };

    const editEntry = (data) => {
      // Fix for date parsing error: clone the data and convert playDate to a Date object
      const formattedData = { ...data };
      if (formattedData.playDate) {
        formattedData.playDate = new Date(formattedData.playDate);
      }

      selectedDoc.value = formattedData;
      isEditMode.value = true;
      displayDialog.value = true;
    };

    // Quick action to mark debt as paid
    const markAsPaid = async (id) => {
      if (
        confirm("Are you sure you want to mark this invoice as fully paid?")
      ) {
        try {
          await updateDoc("Invoice", id, {
            fields: {
              isDebt: false,
              deptAmount: 0,
            },
          });
          showToast("update", "Invoice marked as paid.");
          await fetchLedgerData();
        } catch (error) {
          console.error(error);
          showToast("error", "Failed to update the invoice.");
        }
      }
    };

    // Single delete function
    const deleteEntry = async (id) => {
      if (confirm("Are you sure you want to delete this invoice?")) {
        try {
          await deleteDoc("Invoice", id);
          showToast("delete", "Invoice deleted successfully.");
          await fetchLedgerData();
        } catch (error) {
          console.error(error);
          showToast("error", "Failed to delete the invoice.");
        }
      }
    };

    // Multiple delete function
    const deleteSelectedEntries = async () => {
      if (!selectedEntries.value || selectedEntries.value.length === 0) return;

      if (
        confirm(
          `Are you sure you want to delete ${selectedEntries.value.length} selected invoices?`,
        )
      ) {
        try {
          const deletePromises = selectedEntries.value.map((entry) =>
            deleteDoc("Invoice", entry._id),
          );
          await Promise.all(deletePromises);

          selectedEntries.value = [];
          showToast("delete", "Selected invoices deleted successfully.");
          await fetchLedgerData();
        } catch (error) {
          console.error(error);
          showToast("error", "Failed to delete selected entries.");
        }
      }
    };

    const printSelectedEntries = () => {
      if (!selectedEntries.value.length) {
        alert("Please select entries to print.");
        return;
      }

      let printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Ledger</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap');
            body { 
              font-family: 'Battambang', Arial, sans-serif; 
              padding: 20px; 
              margin: 0; 
              background: #fff; 
            }
            .receipt-wrapper {
              border: 5px solid #eceadd;
              border-radius: 6px;
              padding: 4px;
              max-width: 500px;
              margin: 0 auto 30px auto;
              page-break-inside: avoid;
            }
            .receipt-inner {
              border: 1px solid #dcdcdc;
              padding: 10px;
              border-radius: 4px;
            }
            .header { 
              text-align: center; 
              font-weight: bold; 
              font-size: 15px; 
              margin-bottom: 10px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 10px; 
              font-size: 14px; 
            }
            th, td { 
              border: 1px solid #ebebeb; 
              padding: 6px; 
              text-align: center; 
              color: #333; 
              font-weight: bold; 
            }
            th { 
              color: #000; 
              font-weight: bold; 
              background-color: #fcfcfc;
            }
            .check-icon { 
              color: #8bc34a; 
              font-weight: bold; 
              font-size: 14px; 
            }
            .summary { 
              padding: 5px 15px; 
              font-size: 15px; 
              font-weight: bold; 
            }
            .summary-row { 
              display: flex; 
              align-items: center; 
              margin-bottom: 4px; 
            }
            .summary-label { 
              width: 55px; 
              text-align: left; 
            }
            .summary-calc { 
              margin-left: 10px; 
            }
            .divider { 
              border-top: 1px solid #000; 
              margin: 10px 0; 
              width: 60%; 
            }
            .total-row { 
              color: #0000cc; 
              font-weight: bold; 
              text-align: left; 
              font-size: 16px; 
              margin-top: 5px; 
              padding-left: 40px;
            }
            @media print {
              body { padding: 0; }
              .receipt-wrapper { 
                page-break-inside: avoid;
                margin-bottom: 20px;
                padding-bottom: 20px;
                border: none;
                // border-bottom: 2px dashed #000;
                max-width: 100%; 
              }
              .receipt-wrapper:last-child {
                border-bottom: none;
                margin-bottom: 0;
              }
            }
          </style>
        </head>
        <body>
      `;

      selectedEntries.value.forEach((entry) => {
        const plays = entry.lotteryPlays
          ? Object.values(entry.lotteryPlays)
          : [];
        let rowsHtml = plays
          .map(
            (p, i) => `
          <tr>
            <td>(${i + 1})</td>
            <td>${p.title || ""}</td>
            <td>${p.winTwoNumber || ""}</td>
            <td>${p.winThreeNumber || ""}</td>
            <td>${p.isTwoNumber ? "10" : ""}</td>
            <td class="check-icon">✔</td>
          </tr>
        `,
          )
          .join("");

        if (plays.length === 0) {
          rowsHtml = `<tr><td colspan="6">No entries found</td></tr>`;
        }

        const dateStr = entry.playDate
          ? new Date(entry.playDate).toLocaleDateString("en-GB")
          : "";
        const entryId = entry._id
          ? entry._id.substring(0, 5).toUpperCase()
          : "00000";

        const customerName = getCustomerName(entry.customerId);
        const headerText = `${entryId} ${customerName} ${dateStr}`;

        printContent += `
          <div class="receipt-wrapper">
            <div class="receipt-inner">
              <div class="header">${headerText}</div>
              <table>
                <thead>
                  <tr>
                    <th>ល្ងាច</th>
                    <th>លេខ កូដ</th>
                    <th>2លេខ</th>
                    <th>3លេខ</th>
                    <th>ត្រូវ2</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
              <div class="summary">
                <div class="summary-row">
                  <span class="summary-label">2លេខ</span>
                  <span class="summary-calc">${
                    entry.finalTwoAmount || 0
                  } x 100% = ${entry.finalTwoAmount || 0}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">3លេខ</span>
                  <span class="summary-calc">${
                    entry.finalThreeAmount || 0
                  } x 65% = ${
          (entry.finalThreeAmount * 0.65).toFixed(0) || 0
        }</span>
                </div>
                ${
                  entry.deptAmount
                    ? `
                <div class="summary-row">
                  <span class="summary-label">បំណុល</span>
                  <span class="summary-calc">${entry.deptAmount}</span>
                </div>`
                    : ""
                }
                <div class="divider"></div>
                <div class="total-row">មេស៊ី: = ${entry.totalAmount || 0}</div>
              </div>
            </div>
          </div>
        `;
      });

      printContent += `
          <script>
            window.onload = () => {
              window.print();
            }
            window.onafterprint = () => {
              window.close();
            }
          <\/script>
        </body>
        </html>
      `;

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
      } else {
        alert("Please allow popups to print the ledger.");
      }
    };

    return {
      entries,
      selectedEntries,
      displayDialog,
      isEditMode,
      selectedDoc,
      formatDate,
      openNew,
      editEntry,
      markAsPaid,
      deleteEntry,
      deleteSelectedEntries,
      fetchLedgerData,
      printSelectedEntries,
      handleNavigateBack,
    };
  },
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

.p-button-text.p-button-info:hover {
  background-color: #e0f2fe;
}
</style>
