<template>
  <div class="mx-5 font-noto">
    <button
      @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
    >
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <div
      class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]"
    >
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">
        Chief Expenses
      </h1>

      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex gap-4 items-end flex-1">
          <div class="flex flex-col">
            <span class="text-sm font-medium text-gray-700 mb-1">Rows</span>
            <Select
              v-model="pageSize"
              :options="optionPageSize"
              class="w-24 custom-row-select"
            />
          </div>
          <div class="w-full md:w-96">
            <span class="text-sm font-medium text-gray-700 mb-1 block"
              >Search Description</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by description or ID..."
              class="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#5B9717] outline-none"
            />
          </div>
        </div>

        <button class="btn-add-new" @click="openAddForm">
          <PlusIcon class="w-5 h-5 mr-1" />
          <span>Add Expense</span>
        </button>
      </div>
    </div>

    <div
      v-if="!isMobileScreen"
      class="bg-white rounded-lg shadow overflow-x-auto relative border"
    >
      <div
        v-if="isLoading"
        class="absolute inset-0 bg-white/50 flex justify-center items-center z-10"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B9717]"
        ></div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Payment Date
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Customer/Chief
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Description
            </th>
            <th
              class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="(item, index) in tableData"
            :key="item._id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatDate(item.paymentDate) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
              {{ getCustomerName(item.customerId) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap font-bold text-red-600">
              {{ formatCurrency(item.amount) }}
            </td>
            <!-- Formatted Description Column -->
            <td
              class="px-6 py-4 text-sm text-gray-600 font-medium truncate max-w-xs"
            >
              {{ formatDescription(item.description) }}
            </td>
            <td class="px-6 py-4 text-center whitespace-nowrap">
              <button
                @click="openEditForm(item)"
                class="text-[#045B1B] hover:bg-green-50 p-2 rounded-md mx-1"
              >
                <i class="pi pi-pencil" />
              </button>
              <button
                @click="confirmDelete(item)"
                class="text-red-600 hover:bg-red-50 p-2 rounded-md mx-1"
              >
                <i class="pi pi-trash" />
              </button>
            </td>
          </tr>
          <tr v-if="tableData.length === 0 && !isLoading">
            <td colspan="5" class="px-6 py-12 text-center text-gray-500">
              No expenses recorded yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <ChiefExpenseCard
        :items="tableData"
        :is-loading="isLoading"
        @onEdit="openEditForm"
        @onDelete="confirmDelete"
      />
    </div>

    <div class="mt-5">
      <Pagination
        :currentPage="currentPage"
        :limitedPerPage="pageSize"
        :searchQuery="searchQuery"
        collectionName="ChiefExpense"
        @onEmitDataFromPagination="tableData = $event"
        @onEmitIsLoading="isLoading = $event"
      />
    </div>

    <ChiefExpenseForm
      :visible="showFormModal"
      :is-edit-doc="isEditDoc"
      :doc="selectedDoc"
      @onClose="closeForm"
    />

    <DeleteConfirmation
      :visible="showDeleteModal"
      :deleteId="deleteId"
      :elementName="'Chief Expense'"
      collectionName="ChiefExpense"
      @onCloseDelete="handleDeleteClose"
    />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/vue/24/outline";
import Pagination from "@/components/Pagination.vue";
import DeleteConfirmation from "@/components/DeleteComfirmation.vue";
import ChiefExpenseForm from "@/components/Modal/ChiefExpenseForm.vue";
import ChiefExpenseCard from "@/mobile/ChiefExpenseCard.vue";
import formatDate from "@/composable/formatDate";
import { useAppToast } from "@/helper/toastHelper";
import { getDocument } from "@/composable/getDocument";
import { useDocument } from "@/composable/useDocument";
import { useBranchStore } from "@/store/branchStore";

export default {
  components: {
    ChevronLeftIcon,
    PlusIcon,
    Pagination,
    DeleteConfirmation,
    ChiefExpenseForm,
    ChiefExpenseCard,
  },
  setup() {
    const router = useRouter();
    const { showToast } = useAppToast();
    const { getDocs } = getDocument();
    const { updateDoc } = useDocument();
    const branchStore = useBranchStore();

    const customers = ref([]);
    const invoices = ref([]); // Store invoices to map IDs to Dates
    const tableData = ref([]);
    const isLoading = ref(false);
    const searchQuery = ref("");
    const pageSize = ref(50);
    const optionPageSize = ref([50, 100, 200]);
    const isMobileScreen = ref(false);
    const currentPage = ref(1);

    const showFormModal = ref(false);
    const isEditDoc = ref(false);
    const selectedDoc = ref(null);
    const showDeleteModal = ref(false);

    const deleteId = ref(null);
    const itemToDelete = ref(null);

    const handleCheckSize = () => {
      isMobileScreen.value = window.innerWidth < 768;
    };

    const fetchCustomers = async () => {
      try {
        const res = await getDocs("Customer");
        if (res?.data) customers.value = res.data;
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };

    const fetchInvoices = async () => {
      try {
        const res = await getDocs("Invoice");
        if (res?.data) invoices.value = res.data;
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
      }
    };

    onMounted(() => {
      handleCheckSize();
      window.addEventListener("resize", handleCheckSize);
      fetchCustomers();
      fetchInvoices();
    });

    onBeforeUnmount(() =>
      window.removeEventListener("resize", handleCheckSize),
    );

    const getCustomerName = (id) => {
      if (!id) return "N/A";
      const customer = customers.value.find((c) => c._id === id);
      return customer ? customer.username : id;
    };

    const formatCurrency = (val) => {
      if (val === null || val === undefined) return "0 ៛";
      return val.toLocaleString("en-US", { maximumFractionDigits: 0 }) + " ៛";
    };

    // Dynamically replaces the raw Invoice ID with the beautifully formatted Play Date
    const formatDescription = (desc) => {
      if (!desc) return "-";

      // Look for the "Invoice ID: <hash>" pattern in the description
      const match = desc.match(/Invoice ID:\s*([a-zA-Z0-9]+)/);

      if (match && match[1]) {
        const invoiceId = match[1];
        const invoice = invoices.value.find((inv) => inv._id === invoiceId);

        if (invoice) {
          // Fallback to createdAt if playDate doesn't exist
          const dateStr = formatDate(invoice.playDate || invoice.createdAt);
          return desc.replace(
            `Invoice ID: ${invoiceId}`,
            `Invoice Date: ${dateStr}`,
          );
        }
      }
      return desc;
    };

    const openAddForm = () => {
      isEditDoc.value = false;
      selectedDoc.value = null;
      showFormModal.value = true;
    };
    const openEditForm = (item) => {
      isEditDoc.value = true;
      selectedDoc.value = item;
      showFormModal.value = true;
    };

    const closeForm = (status) => {
      showFormModal.value = false;
      if (status === "add") {
        showToast("success", "Expense created successfully.");
        searchQuery.value = "";
      } else if (status === "update") {
        showToast("success", "Expense updated successfully.");
        searchQuery.value = "";
      }
    };

    const confirmDelete = (item) => {
      deleteId.value = item._id;
      itemToDelete.value = item;
      showDeleteModal.value = true;
    };

    const handleDeleteClose = async (status) => {
      showDeleteModal.value = false;

      if (status !== false && status !== "cancel") {
        if (itemToDelete.value && itemToDelete.value.amount) {
          try {
            const balanceRes = await getDocs("LotteryChiefBalance");
            if (balanceRes?.data) {
              const activeBalance = balanceRes.data.find(
                (b) => b.status === true && b.branchId === branchStore.branchId,
              );

              if (activeBalance) {
                const newBalanceAmount =
                  activeBalance.amount + itemToDelete.value.amount;

                await updateDoc("LotteryChiefBalance", activeBalance._id, {
                  fields: {
                    amount: newBalanceAmount,
                    updatedAt: new Date(),
                    updatedBy: branchStore.userId,
                  },
                });
                showToast("success", "Expense deleted and balance restored.");
              } else {
                showToast(
                  "warn",
                  "Expense deleted, but no active balance found to restore.",
                );
              }
            }
          } catch (e) {
            console.error("Failed to restore balance after deletion:", e);
            showToast(
              "error",
              "Expense deleted, but failed to restore balance.",
            );
          }
        } else {
          showToast("success", "Expense deleted successfully.");
        }

        itemToDelete.value = null;
      } else {
        itemToDelete.value = null;
      }
    };

    return {
      handleNavigateBack: () => router.push("/"),
      tableData,
      isLoading,
      searchQuery,
      pageSize,
      optionPageSize,
      isMobileScreen,
      currentPage,
      showFormModal,
      isEditDoc,
      selectedDoc,
      showDeleteModal,
      deleteId,
      openAddForm,
      openEditForm,
      closeForm,
      confirmDelete,
      handleDeleteClose,
      formatDate,
      formatCurrency,
      getCustomerName,
      formatDescription,
    };
  },
};
</script>

<style scoped>
.btn-add-new {
  @apply bg-[#5B9717] text-white px-4 py-2 rounded-md hover:bg-[#4a7c13] transition flex items-center shadow-md font-medium;
}
</style>
