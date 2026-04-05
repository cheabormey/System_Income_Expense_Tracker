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
        Customer Reimbursements
      </h1>

      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex gap-4 items-end">
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
              >Search Customer ID</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by Customer ID..."
              class="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#5B9717] outline-none"
            />
          </div>
        </div>

        <button class="btn-add-new" @click="openAddForm">
          <PlusIcon class="w-5 h-5 mr-1" />
          <span>Add Reimbursement</span>
        </button>
      </div>
    </div>

    <div
      v-if="!isMobileScreen"
      class="bg-white rounded-lg shadow overflow-x-auto relative"
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
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">
              Customer
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">
              Total Debt
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">
              Invoices
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">
              Date
            </th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase">
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
            <!-- Updated to display Customer Name -->
            <td class="px-6 py-4 font-medium text-gray-800">
              {{ getCustomerName(item.customerId) }}
            </td>

            <!-- Updated to format Currency properly -->
            <td class="px-6 py-4 text-rose-600 font-bold">
              {{ formatCurrency(item.totalDebt) }}
            </td>

            <td class="px-6 py-4 italic text-sm text-gray-500">
              <span
                class="bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold"
              >
                {{ item.invoiceIds?.length || 0 }} Invoices
              </span>
            </td>
            <td class="px-6 py-4">{{ formatDate(item.createdAt) }}</td>
            <td class="px-6 py-4 text-center">
              <button
                @click="openEditForm(item)"
                class="text-[#045B1B] p-2 hover:bg-green-50 rounded-lg mx-1 transition-colors"
              >
                <i class="pi pi-pencil" />
              </button>
              <button
                @click="confirmDelete(item)"
                class="text-red-600 p-2 hover:bg-red-50 rounded-lg mx-1 transition-colors"
              >
                <i class="pi pi-trash" />
              </button>
            </td>
          </tr>
          <tr v-if="tableData.length === 0 && !isLoading">
            <td colspan="5" class="px-6 py-10 text-center text-gray-500 italic">
              No reimbursement records found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <CustomerReimbursementCard
        :items="tableData"
        :is-loading="isLoading"
        @onEdit="openEditForm"
        @onDelete="confirmDelete"
      />
    </div>

    <Pagination
      :currentPage="currentPage"
      :limitedPerPage="pageSize"
      :searchQuery="searchQuery"
      collectionName="CustomerReimburstment"
      @onEmitDataFromPagination="handlePaginationData"
      @onEmitIsLoading="isLoading = $event"
    />

    <CustomerReimbursementForm
      :visible="showFormModal"
      :is-edit-doc="isEditDoc"
      :doc="selectedDoc"
      @onClose="closeForm"
    />
    <DeleteConfirmation
      :visible="showDeleteModal"
      :deleteId="deleteId"
      :elementName="'Reimbursement'"
      collectionName="CustomerReimburstment"
      @onCloseDelete="showDeleteModal = false"
    />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { ChevronLeftIcon, PlusIcon } from "@heroicons/vue/24/outline";
import Pagination from "@/components/Pagination.vue";
import DeleteConfirmation from "@/components/DeleteComfirmation.vue";
import CustomerReimbursementForm from "@/components/Modal/CustomerReimbursementForm.vue";
import CustomerReimbursementCard from "@/mobile/CustomerReimbursementCard.vue";
import formatDate from "@/composable/formatDate";
import { getDocument } from "@/composable/getDocument"; // Added to fetch customers

export default {
  components: {
    ChevronLeftIcon,
    PlusIcon,
    Pagination,
    DeleteConfirmation,
    CustomerReimbursementForm,
    CustomerReimbursementCard,
  },
  setup() {
    const router = useRouter();
    const { getDocs } = getDocument(); // Initialized document fetcher

    const customers = ref([]); // Store customer data
    const tableData = ref([]);
    const isLoading = ref(false);
    const searchQuery = ref("");
    const pageSize = ref(50);
    const optionPageSize = ref([50, 100, 200]);
    const isMobileScreen = ref(false);

    const showFormModal = ref(false);
    const isEditDoc = ref(false);
    const selectedDoc = ref(null);
    const showDeleteModal = ref(false);
    const deleteId = ref(null);

    // Fetch customer data for name mapping
    const fetchCustomers = async () => {
      try {
        const res = await getDocs("Customer");
        if (res?.data) {
          customers.value = res.data;
        }
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      }
    };

    const checkSize = () => (isMobileScreen.value = window.innerWidth < 768);

    onMounted(() => {
      checkSize();
      window.addEventListener("resize", checkSize);
      fetchCustomers(); // Fetch customers on mount
    });

    onBeforeUnmount(() => window.removeEventListener("resize", checkSize));

    const handlePaginationData = (data) => (tableData.value = data || []);
    const openAddForm = () => {
      isEditDoc.value = false;
      selectedDoc.value = null;
      showFormModal.value = true;
    };
    const openEditForm = (doc) => {
      isEditDoc.value = true;
      selectedDoc.value = doc;
      showFormModal.value = true;
    };
    const closeForm = () => (showFormModal.value = false);
    const confirmDelete = (doc) => {
      deleteId.value = doc._id;
      showDeleteModal.value = true;
    };

    // Helper function to map Customer ID to Username
    const getCustomerName = (id) => {
      if (!id) return "N/A";
      const customer = customers.value.find((c) => c._id === id);
      return customer ? customer.username : id;
    };

    // Helper function for currency formatting
    const formatCurrency = (val) => {
      if (val === null || val === undefined) return "0 ៛";
      return (
        Number(val).toLocaleString("en-US", { maximumFractionDigits: 0 }) + " ៛"
      );
    };

    return {
      handleNavigateBack: () => router.push("/"),
      tableData,
      isLoading,
      searchQuery,
      pageSize,
      optionPageSize,
      isMobileScreen,
      showFormModal,
      isEditDoc,
      selectedDoc,
      showDeleteModal,
      deleteId,
      handlePaginationData,
      openAddForm,
      openEditForm,
      closeForm,
      confirmDelete,
      formatDate,
      getCustomerName,
      formatCurrency,
    };
  },
};
</script>

<style scoped>
.btn-add-new {
  @apply bg-[#5B9717] text-white px-4 py-2 rounded-md hover:bg-[#4a7c13] transition flex items-center shadow-md;
}
</style>
