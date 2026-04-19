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

        <Column field="customerId.username" header="Customer">
          <template #body="slotProps">
            {{ getCustomerName(slotProps.data.customerId) }}
          </template>
        </Column>

        <!-- Debt Amount Column -->
        <Column field="deptAmount" header="Debt Amount">
          <template #body="slotProps">
            <span
              :class="
                slotProps.data.deptAmount > 0
                  ? 'text-red-600 font-semibold'
                  : 'text-gray-600 font-semibold'
              "
            >
              {{ formatCurrency(slotProps.data.deptAmount) }}
            </span>
          </template>
        </Column>

        <!-- Total Amount Column -->
        <Column field="totalAmount" header="Total Amount">
          <template #body="slotProps">
            <span
              :class="
                slotProps.data.totalAmount < 0
                  ? 'text-red-600 font-semibold'
                  : 'text-green-600 font-semibold'
              "
            >
              {{ formatCurrency(slotProps.data.totalAmount) }}
            </span>
          </template>
        </Column>

        <Column header="Actions">
          <template #body="slotProps">
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
              @click="deleteEntry(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <InvoiceForm
      :visible="displayDialog"
      :isEditDoc="isEditMode"
      :doc="selectedDoc"
      @onClose="displayDialog = false"
      @refresh="fetchLedgerData"
    />

    <DeleteConfirmation
      :visible="showDeleteModal"
      :deleteId="deleteId"
      :elementName="'Invoice'"
      collectionName="Invoice"
      @onCloseDelete="handleDeleteClose"
    />

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
import DeleteConfirmation from "@/components/DeleteComfirmation.vue";
import { getDocument } from "@/composable/getDocument";
import { useDocument } from "@/composable/useDocument";
import { useAppToast } from "@/helper/toastHelper";

export default {
  components: {
    DataTable,
    Column,
    Button,
    Toast,
    InvoiceForm,
    DeleteConfirmation,
  },
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

    // Custom Delete Modal refs
    const showDeleteModal = ref(false);
    const deleteId = ref(null);

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

    const getCustomerName = (customerId) => {
      if (!customerId) return "";
      if (typeof customerId === "object") return customerId.username || "";
      const found = customer.value.find((c) => c._id === customerId);
      return found ? found.username : customerId;
    };

    const formatCurrency = (val) => {
      if (val === null || val === undefined) return "0 ៛";
      return (
        Number(val).toLocaleString("en-US", { maximumFractionDigits: 0 }) + " ៛"
      );
    };

    const handleNavigateBack = () => router.push("/");

    const openNew = () => {
      selectedDoc.value = null;
      isEditMode.value = false;
      displayDialog.value = true;
    };

    const editEntry = (data) => {
      const formattedData = { ...data };
      if (formattedData.playDate) {
        formattedData.playDate = new Date(formattedData.playDate);
      }
      selectedDoc.value = formattedData;
      isEditMode.value = true;
      displayDialog.value = true;
    };

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

    // Trigger Custom Modal for Deletion
    const deleteEntry = (entry) => {
      if (entry.isUnchanged) {
        showToast("error", "Cannot delete an unchanged invoice.");
        return;
      }
      deleteId.value = entry._id;
      showDeleteModal.value = true;
    };

    // Handle closure of the delete confirmation modal
    const handleDeleteClose = async (status) => {
      showDeleteModal.value = false;
      if (status && status !== "cancel" && status !== false) {
        showToast("delete", "Invoice deleted successfully.");
        await fetchLedgerData();
      }
    };

    const deleteSelectedEntries = async () => {
      if (!selectedEntries.value || selectedEntries.value.length === 0) return;

      const deletableEntries = selectedEntries.value.filter(
        (e) => !e.isUnchanged,
      );

      if (deletableEntries.length === 0) {
        showToast(
          "error",
          "Selected invoices are marked unchanged and cannot be deleted.",
        );
        return;
      }

      if (
        confirm(
          `Are you sure you want to delete ${deletableEntries.length} selected invoices?`,
        )
      ) {
        try {
          const deletePromises = deletableEntries.map((entry) =>
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

      // Helper to format numbers cleanly for print without currency symbol
      const fmt = (num) => {
        if (num === null || num === undefined) return "0";
        return Number(num).toLocaleString("en-US", {
          maximumFractionDigits: 0, // Removed fraction digits
        });
      };

      let printContent = `
        <!DOCTYPE html>
        <html lang="km">
        <head>
          <meta charset="UTF-8">
          <title>Print Ledger</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap');
            body { 
              font-family: 'Battambang', Arial, sans-serif; 
              padding: 20px; 
              margin: 0; 
              background: #fff; 
              font-size: 14px;
              color: #333;
            }
            .print-container {
              max-width: 500px;
              margin: 0 auto;
            }
            .global-header { 
              text-align: center; 
              font-weight: bold; 
              font-size: 16px; 
              margin-bottom: 15px; 
            }
            .receipt-wrapper { 
              border: 4px solid #eceadd; 
              border-radius: 6px; 
              padding: 4px; 
              margin-bottom: 15px; 
              page-break-inside: avoid; 
            }
            .receipt-inner { 
              border: 1px solid #ccc; 
              padding: 10px; 
              border-radius: 4px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 10px; 
            }
            th, td { 
              border: 1px solid #ebebeb; 
              padding: 6px; 
              text-align: center; 
              font-weight: bold; 
            }
            th { 
              color: #000; 
              background-color: #fcfcfc; 
            }
            .check-icon { color: #8bc34a; font-weight: bold; font-size: 14px; }
            .summary { padding: 5px 15px; font-weight: bold; }
            .summary-row { display: flex; align-items: center; margin-bottom: 4px; }
            .summary-label { width: 65px; text-align: left; }
            .summary-calc { margin-left: 10px; }
            .divider { border-top: 1px solid #999; margin: 10px 0; width: 60%; }
            .total-blue { color: #0000cc; font-weight: bold; text-align: center; font-size: 16px; margin-top: 10px; }
            .total-red { color: #cc0000; font-weight: bold; text-align: center; font-size: 16px; margin-top: 10px; }
            .grand-total-section { text-align: center; font-weight: bold; font-size: 16px; margin-top: 30px; page-break-inside: avoid; }
            .gt-row { display: flex; justify-content: center; margin-bottom: 5px; }
            .gt-label { width: 120px; text-align: right; padding-right: 10px; }
            .gt-value { width: 100px; text-align: left; }
            .gt-divider { border-top: 1px dashed #000; width: 220px; margin: 5px auto; }
            @media print {
              body { padding: 0; }
              .receipt-wrapper { margin-bottom: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
      `;

      let sumGrandTotal = 0;
      let sumDebt = 0;

      selectedEntries.value.forEach((entry, index) => {
        const plays = Array.isArray(entry.lotteryPlays)
          ? entry.lotteryPlays
          : Object.values(entry.lotteryPlays || {});

        // Dynamically calculate 2D and 3D amount sums and payouts
        let twoAmount = 0;
        let threeAmount = 0;
        let winTwoAmountPlayed = 0;
        let winThreeAmountPlayed = 0;

        plays.forEach((p) => {
          const amt2 = Number(p.twoDigitAmount) || 0;
          const amt3 = Number(p.threeDigitAmount) || 0;

          twoAmount += amt2;
          threeAmount += amt3;

          // Pull the WINNING AMOUNTS from the twoDigitNumber/threeDigitNumber fields
          if (p.isTwoNumber) {
            winTwoAmountPlayed += Number(p.twoDigitNumber) || 0;
          }
          if (p.isThreeNumber) {
            winThreeAmountPlayed += Number(p.threeDigitNumber) || 0;
          }
        });

        // Calculations (a, b, c logic)
        const a = twoAmount * 1; // x 100%
        const b = threeAmount * 0.65; // x 65%
        const c = a + b;

        // Payouts for winners
        const winTwoPayout = winTwoAmountPlayed * 100;
        const winThreePayout = winThreeAmountPlayed * 600;
        const totalPayout = winTwoPayout + winThreePayout;

        // Final invoice calculated net total
        const netTotal = c - totalPayout;
        const debtAmt = Number(entry.deptAmount) || 0;

        sumGrandTotal += netTotal;
        sumDebt += debtAmt;

        // Build the header specific to this invoice using the shortened ID
        const entryId = entry._id
          ? entry._id.substring(0, 5).toUpperCase()
          : "00000";
        const customerName = getCustomerName(entry.customerId);
        const dateStr = entry.playDate
          ? new Date(entry.playDate).toLocaleDateString("en-GB")
          : "";
        const headerText = `${entryId} ${customerName} ${dateStr}`;

        // Try to get category name for the header, default to 'វេន'
        let categoryLabel = "វេន";
        if (plays.length > 0 && plays[0].categoryId) {
          categoryLabel =
            plays[0].categoryId.name || plays[0].categoryId || "វេន";
        }

        // Map the rows to include the accurate amounts and checkbox logic
        let rowsHtml = plays
          .map(
            (p, i) => `
          <tr>
            <td>(${i + 1})</td>
            <td>${p.title || ""}</td>
            <td>${p.twoDigitAmount || ""}</td>
            <td>${p.threeDigitAmount || ""}</td>
            <td>${p.isTwoNumber ? p.twoDigitNumber || "" : ""}</td>
            <td>${p.isThreeNumber ? p.threeDigitNumber || "" : ""}</td>
            <td class="check-icon">✔</td>
          </tr>
        `,
          )
          .join("");

        if (plays.length === 0) {
          rowsHtml = `<tr><td colspan="7">No entries found</td></tr>`;
        }

        // Add additional summary payout rows if there are winning amounts
        let winningRowsHtml = "";
        if (winTwoAmountPlayed > 0) {
          winningRowsHtml += `
            <div class="summary-row">
              <span class="summary-label">ត្រូវ2</span>
              <span class="summary-calc">${fmt(
                winTwoAmountPlayed,
              )} x 100 = -${fmt(winTwoPayout)}</span>
            </div>
          `;
        }
        if (winThreeAmountPlayed > 0) {
          winningRowsHtml += `
            <div class="summary-row">
              <span class="summary-label">ត្រូវ3</span>
              <span class="summary-calc">${fmt(
                winThreeAmountPlayed,
              )} x 600 = -${fmt(winThreePayout)}</span>
            </div>
          `;
        }

        // Determine if total is positive (មេស៊ី) or negative (មេសង)
        let totalDisplayHtml = "";
        if (netTotal < 0) {
          totalDisplayHtml = `<div class="total-red">មេសង: ${fmt(
            netTotal,
          )}</div>`;
        } else {
          totalDisplayHtml = `<div class="total-blue">មេស៊ី: = ${fmt(
            netTotal,
          )}</div>`;
        }

        printContent += `
          <div class="receipt-wrapper">
            <div class="receipt-inner">
              <div class="global-header">${headerText}</div>
              <table>
                <thead>
                  <tr>
                    <th>ល.រ</th>
                    <th>លេខ កូដ</th>
                    <th>2លេខ</th>
                    <th>3លេខ</th>
                    <th>ត្រូវ2</th>
                    <th>ត្រូវ3</th>
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
                  <span class="summary-calc">${fmt(twoAmount)} x 100% = ${fmt(
          a,
        )}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">3លេខ</span>
                  <span class="summary-calc">${fmt(threeAmount)} x 65% = ${fmt(
          b,
        )}</span>
                </div>
                ${winningRowsHtml}
                ${
                  debtAmt
                    ? `
                <div class="summary-row">
                  <span class="summary-label">បំណុល</span>
                  <span class="summary-calc">${fmt(debtAmt)}</span>
                </div>`
                    : ""
                }
                <div class="divider"></div>
                ${totalDisplayHtml}
              </div>
            </div>
          </div>
        `;
      });

      // Append Grand Total Section
      printContent += `
            <div class="grand-total-section">
              <div class="gt-row">
                <div class="gt-label">សរុបចុងស្តុប :</div>
                <div class="gt-value">${fmt(
                  sumGrandTotal,
                )} <span class="check-icon">✔</span></div>
              </div>
              ${
                sumDebt
                  ? `
              <div class="gt-row">
                <div class="gt-label">លុយចាស់ :</div>
                <div class="gt-value">${fmt(sumDebt)}</div>
              </div>
              `
                  : ""
              }
              <div class="gt-divider"></div>
              <div class="gt-row" style="color: #0000cc;">
                <div class="gt-label">សរុប :</div>
                <div class="gt-value">${fmt(sumGrandTotal + sumDebt)}</div>
              </div>
            </div>
          </div> <!-- End print-container -->
          <script>
            window.onload = () => { window.print(); }
            window.onafterprint = () => { window.close(); }
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
      showDeleteModal,
      deleteId,
      formatDate,
      formatCurrency,
      openNew,
      editEntry,
      markAsPaid,
      deleteEntry,
      handleDeleteClose,
      deleteSelectedEntries,
      fetchLedgerData,
      printSelectedEntries,
      handleNavigateBack,
      getCustomerName,
    };
  },
};
</script>

<style scoped>
.p-datatable-sm {
  min-width: 600px;
}
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
