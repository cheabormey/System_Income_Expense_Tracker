<template>
  <div class="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <!-- Header & Navigation -->
      <button
        @click="handleNavigateBack"
        class="flex items-center gap-2 px-4 py-2 mb-6 text-gray-700 bg-white shadow-sm hover:bg-green-50 rounded-full transition"
      >
        <i class="pi pi-chevron-left text-lg"></i>
        <span class="font-semibold">Back to Dashboard</span>
      </button>

      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <div>
          <h2 class="text-3xl md:text-4xl font-extrabold text-[#045B1B]">
            Customer Returns Report
          </h2>
          <p class="text-gray-500 mt-1 font-medium">
            Overview of all debt payments made by customers.
          </p>
        </div>
        <Button
          label="Print Report"
          icon="pi pi-print"
          class="p-button-outlined p-button-secondary bg-white shadow-sm"
          @click="printReport"
        />
      </div>

      <!-- Filters Section -->
      <div
        class="flex flex-wrap gap-4 mb-6 p-5 bg-white rounded-2xl shadow-sm border border-gray-100 items-end"
      >
        <div class="flex flex-col w-full md:w-64">
          <label class="text-sm font-semibold text-gray-600 mb-2"
            >Filter by Customer</label
          >
          <Dropdown
            v-model="selectedCustomer"
            :options="customers"
            optionLabel="username"
            optionValue="_id"
            placeholder="All Customers"
            filter
            showClear
            class="w-full"
          />
        </div>

        <div class="flex flex-col w-full md:w-56">
          <label class="text-sm font-semibold text-gray-600 mb-2"
            >Filter by Date Range</label
          >
          <Dropdown
            v-model="selectedDateRange"
            :options="dateRangePresets"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
        </div>

        <!-- Custom Date Range Input (PrimeVue DatePicker) -->
        <div
          v-if="selectedDateRange === 'custom'"
          class="flex flex-col w-full md:w-72"
        >
          <label class="text-sm font-semibold text-gray-600 mb-2"
            >Select Dates</label
          >
          <DatePicker
            v-model="customDates"
            selectionMode="range"
            :manualInput="false"
            showIcon
            placeholder="Start Date - End Date"
            class="w-full"
          />
        </div>

        <div class="w-full md:w-auto mt-4 md:mt-0">
          <Button
            label="Apply Filter"
            icon="pi pi-filter"
            class="p-button-success w-full md:w-auto bg-[#5B9717] border-none shadow-md hover:bg-[#4a7c13]"
            @click="applyFilters"
          />
        </div>
      </div>

      <!-- Data Table -->
      <div
        class="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100"
      >
        <div v-if="isLoading" class="p-10 flex justify-center items-center">
          <i class="pi pi-spin pi-spinner text-4xl text-[#5B9717]"></i>
        </div>

        <DataTable
          v-else
          :value="filteredReturns"
          responsiveLayout="scroll"
          stripedRows
          :paginator="true"
          :rows="15"
          dataKey="_id"
          class="p-datatable-lg"
          emptyMessage="No customer returns found for the applied filters."
        >
          <Column header="#" headerStyle="width: 3rem">
            <template #body="slotProps">
              <span class="text-gray-400 font-medium">{{
                slotProps.index + 1
              }}</span>
            </template>
          </Column>

          <Column field="customerName" header="Customer Name" sortable>
            <template #body="slotProps">
              <div class="font-bold text-gray-800 text-lg">
                {{ slotProps.data.customerName }}
              </div>
            </template>
          </Column>

          <Column field="returnDate" header="Payment Date" sortable>
            <template #body="slotProps">
              <span class="text-gray-600 font-medium">
                {{
                  formatDate(
                    slotProps.data.returnDate || slotProps.data.createdAt,
                  )
                }}
              </span>
            </template>
          </Column>

          <Column field="status" header="Status" sortable>
            <template #body="slotProps">
              <span
                v-if="slotProps.data.status"
                class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center w-fit gap-1"
              >
                <i class="pi pi-check-circle text-xs"></i> Completed
              </span>
              <span
                v-else
                class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold flex items-center w-fit gap-1"
              >
                <i class="pi pi-clock text-xs"></i> Pending
              </span>
            </template>
          </Column>

          <Column
            field="amount"
            header="Amount Returned"
            sortable
            alignFrozen="right"
          >
            <template #body="slotProps">
              <div class="font-black text-green-600 text-lg text-right">
                + {{ formatCurrency(slotProps.data.amount) }}
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import DatePicker from "primevue/datepicker";
import { getDocument } from "@/composable/getDocument";
import { useBranchStore } from "@/store/branchStore";

const router = useRouter();
const branchStore = useBranchStore();
const { getDocs } = getDocument();

const isLoading = ref(true);
const returnRecords = ref([]);
const customers = ref([]);

// Selected Filter States (Bound to UI inputs)
const selectedCustomer = ref(null);
const selectedDateRange = ref("currentMonth");
const customDates = ref(); // Array for PrimeVue range [startDate, endDate]

// Applied Filter States (Used for actual filtering)
const appliedFilters = ref({
  customer: null,
  dateRange: "currentMonth",
  customDates: null,
});

const dateRangePresets = [
  { label: "Current Month", value: "currentMonth" },
  { label: "Last Week", value: "lastWeek" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last 3 Months", value: "last3Months" },
  { label: "All Time", value: "allTime" },
  { label: "Custom Range", value: "custom" },
];

const fetchReportData = async () => {
  isLoading.value = true;
  try {
    const [custRes, retRes] = await Promise.all([
      getDocs("Customer"),
      getDocs("CustomerReturnMoney"),
    ]);

    customers.value = custRes?.data || [];
    const returns = retRes?.data || [];

    // Base Filter: Only records for the current branch
    const currentBranch = branchStore.branchId || "";
    const activeReturns = returns.filter(
      (r) => (r.branchId || "") === currentBranch,
    );

    // Map customer names into the records for easy display and sorting
    returnRecords.value = activeReturns.map((ret) => {
      const custId =
        typeof ret.customerId === "object"
          ? ret.customerId._id
          : ret.customerId;
      const foundCustomer = customers.value.find((c) => c._id === custId);

      return {
        ...ret,
        extractedCustomerId: custId,
        customerName: foundCustomer
          ? foundCustomer.username
          : "Unknown Customer",
      };
    });

    // Sort by latest payment first globally
    returnRecords.value.sort((a, b) => {
      const dateA = new Date(a.returnDate || a.createdAt).getTime();
      const dateB = new Date(b.returnDate || b.createdAt).getTime();
      return dateB - dateA;
    });

    // Apply default filters immediately on load
    applyFilters();
  } catch (error) {
    console.error("Failed to fetch returns report data:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchReportData();
});

// Function to lock in the filters when the Apply button is clicked
const applyFilters = () => {
  appliedFilters.value = {
    customer: selectedCustomer.value,
    dateRange: selectedDateRange.value,
    customDates: customDates.value,
  };
};

// Helper: Check if a date falls within the selected range preset
const isDateInRange = (dateString, rangeType, datesArray) => {
  if (rangeType === "allTime" || !dateString) return true;

  const date = new Date(dateString);
  const now = new Date();

  if (rangeType === "custom") {
    if (datesArray && datesArray.length > 0) {
      const start = datesArray[0] ? new Date(datesArray[0]) : null;
      const end = datesArray[1] ? new Date(datesArray[1]) : null;

      if (start && end) {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return date >= start && date <= end;
      } else if (start) {
        start.setHours(0, 0, 0, 0);
        return date >= start;
      } else if (end) {
        end.setHours(23, 59, 59, 999);
        return date <= end;
      }
    }
    return true; // if custom but no dates set, allow all
  }

  if (rangeType === "currentMonth") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    return date >= startOfMonth && date <= endOfMonth;
  }

  if (rangeType === "lastWeek") {
    const startOfLastWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() - 7,
    );
    const endOfLastWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay() - 1,
      23,
      59,
      59,
      999,
    );
    return date >= startOfLastWeek && date <= endOfLastWeek;
  }

  if (rangeType === "lastMonth") {
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );
    return date >= startOfLastMonth && date <= endOfLastMonth;
  }

  if (rangeType === "last3Months") {
    const startOf3MonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 3,
      now.getDate(),
    );
    return date >= startOf3MonthsAgo && date <= now;
  }

  return true;
};

// Computed property that applies the LOCKED (applied) filters
const filteredReturns = computed(() => {
  return returnRecords.value.filter((r) => {
    // 1. Customer Filter Match
    if (
      appliedFilters.value.customer &&
      r.extractedCustomerId !== appliedFilters.value.customer
    ) {
      return false;
    }

    // 2. Date Filter Match
    const recordDate = r.returnDate || r.createdAt;
    if (
      !isDateInRange(
        recordDate,
        appliedFilters.value.dateRange,
        appliedFilters.value.customDates,
      )
    ) {
      return false;
    }

    return true;
  });
});

const handleNavigateBack = () => {
  router.push("/report");
};

const formatCurrency = (val) => {
  if (!val) return "0 ៛";
  return (
    Number(val).toLocaleString("en-US", { maximumFractionDigits: 0 }) + " ៛"
  );
};

const formatDate = (val) => {
  if (!val) return "N/A";
  const date = new Date(val);
  return date.toLocaleDateString("en-GB");
};

const printReport = () => {
  const currentDate = new Date().toLocaleDateString("en-GB");

  // Calculate dynamically filtered total return amount
  const totalFilteredReturns = filteredReturns.value.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );

  let rowsHtml = filteredReturns.value
    .map(
      (r, index) => `
    <tr>
      <td>${index + 1}</td>
      <td style="text-align: left;">${r.customerName}</td>
      <td>${formatDate(r.returnDate || r.createdAt)}</td>
      <td>${r.status ? "Completed" : "Pending"}</td>
      <td style="text-align: right; color: #16a34a; font-weight: bold;">+ ${formatCurrency(
        r.amount,
      )}</td>
    </tr>
  `,
    )
    .join("");

  if (filteredReturns.value.length === 0) {
    rowsHtml = `<tr><td colspan="5">No returns found for the applied filters.</td></tr>`;
  }

  // Find label for chosen preset to show on print
  let selectedPresetLabel =
    dateRangePresets.find((p) => p.value === appliedFilters.value.dateRange)
      ?.label || "All Time";
  if (appliedFilters.value.dateRange === "custom") {
    const dates = appliedFilters.value.customDates;
    if (dates && dates.length > 0) {
      const startStr = dates[0]
        ? new Date(dates[0]).toLocaleDateString("en-GB")
        : "Any";
      const endStr = dates[1]
        ? new Date(dates[1]).toLocaleDateString("en-GB")
        : "Any";
      selectedPresetLabel = `Custom: ${startStr} to ${endStr}`;
    } else {
      selectedPresetLabel = `Custom: All Time`;
    }
  }

  const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Customer Returns Report</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Battambang:wght@400;700&display=swap');
        body { font-family: 'Battambang', Arial, sans-serif; padding: 30px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0 0 10px 0; color: #045B1B; }
        .header p { margin: 2px 0; color: #666; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th, td { border: 1px solid #ddd; padding: 10px 12px; text-align: center; }
        th { background-color: #f8f9fa; color: #333; }
        .summary-box { 
          float: right; 
          border: 2px solid #045B1B; 
          padding: 15px 25px; 
          border-radius: 8px; 
          background-color: #f0fdf4;
        }
        .summary-box h3 { margin: 0 0 5px 0; font-size: 16px; color: #045B1B; }
        .summary-box .amount { margin: 0; font-size: 24px; font-weight: bold; color: #16a34a; }
        .clearfix::after { content: ""; clear: both; display: table; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Customer Returns Report</h1>
        <p><strong>Period:</strong> ${selectedPresetLabel}</p>
        <p>Generated on: ${currentDate}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th style="text-align: left;">Customer Name</th>
            <th>Payment Date</th>
            <th>Status</th>
            <th style="text-align: right;">Amount Returned</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>

      <div class="clearfix">
        <div class="summary-box">
          <h3>Total Filtered Returns</h3>
          <p class="amount">+ ${formatCurrency(totalFilteredReturns)}</p>
        </div>
      </div>

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
    alert("Please allow popups to print the report.");
  }
};
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
}
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}
</style>
