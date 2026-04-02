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
        Lottery Chief Balances
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
              >Search</span
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by Invoice ID or Expense..."
              class="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-[#5B9717] outline-none"
            />
          </div>
        </div>

        <button class="btn-add-new" @click="openAddForm">
          <PlusIcon class="w-5 h-5 mr-1" />
          <span>New Balance</span>
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
              Created At
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-center"
            >
              Invoices
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
            >
              Status
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
              {{ formatDate(item.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap font-bold text-[#045B1B]">
              {{ formatCurrency(item.amount) }}
            </td>
            <td class="px-6 py-4 text-center">
              <span
                class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold"
              >
                {{ item.invoiceIds?.length || 0 }} IDs
              </span>
            </td>
            <td class="px-6 py-4">
              <i
                class="pi"
                :class="
                  item.status
                    ? 'pi-check-circle text-green-600'
                    : 'pi-times-circle text-red-600'
                "
              />
            </td>
            <td class="px-6 py-4 text-center text-sm font-medium">
              <button
                @click="openEditForm(item)"
                class="text-blue-600 hover:bg-blue-50 p-2 rounded-md mx-1"
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
            <td colspan="5" class="px-6 py-10 text-center text-gray-500 italic">
              No balance data found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <LotteryChiefBalanceCard
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
        collectionName="LotteryChiefBalance"
        @onEmitDataFromPagination="tableData = $event"
        @onEmitIsLoading="isLoading = $event"
      />
    </div>

    <LotteryChiefBalanceForm
      :visible="showFormModal"
      :is-edit-doc="isEditDoc"
      :doc="selectedDoc"
      @onClose="closeForm"
    />

    <DeleteConfirmation
      :visible="showDeleteModal"
      :deleteId="deleteId"
      :elementName="'Balance Record'"
      collectionName="LotteryChiefBalance"
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
import LotteryChiefBalanceForm from "@/components/Modal/LotteryChiefBalanceForm.vue";
import LotteryChiefBalanceCard from "@/mobile/LotteryChiefBalanceCard.vue";
import formatDate from "@/composable/formatDate";
import { useAppToast } from "@/helper/toastHelper"; // Imported Toast Helper

export default {
  components: {
    ChevronLeftIcon,
    PlusIcon,
    Pagination,
    DeleteConfirmation,
    LotteryChiefBalanceForm,
    LotteryChiefBalanceCard,
  },
  setup() {
    const router = useRouter();
    const { showToast } = useAppToast();

    const tableData = ref([]);
    const isLoading = ref(false);
    const searchQuery = ref("");
    const pageSize = ref(50);
    const optionPageSize = ref([50, 100, 200, 500]);
    const isMobileScreen = ref(false);
    const currentPage = ref(1);

    const showFormModal = ref(false);
    const isEditDoc = ref(false);
    const selectedDoc = ref(null);
    const showDeleteModal = ref(false);
    const deleteId = ref(null);

    const handleCheckSize = () => {
      isMobileScreen.value = window.innerWidth < 768;
    };

    onMounted(() => {
      handleCheckSize();
      window.addEventListener("resize", handleCheckSize);
    });

    onBeforeUnmount(() =>
      window.removeEventListener("resize", handleCheckSize),
    );

    // Currency Formatter
    const formatCurrency = (val) => {
      if (val === null || val === undefined) return "0 ៛";
      return val.toLocaleString("en-US", { maximumFractionDigits: 0 }) + " ៛";
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
        showToast("success", "Balance created successfully.");
        searchQuery.value = "";
      } else if (status === "update") {
        showToast("success", "Balance updated successfully.");
        searchQuery.value = "";
      }
    };

    const confirmDelete = (item) => {
      deleteId.value = item._id;
      showDeleteModal.value = true;
    };

    const handleDeleteClose = (status) => {
      showDeleteModal.value = false;
      if (status === "deleted" || status === true) {
        showToast("success", "Balance record deleted successfully.");
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
    };
  },
};
</script>

<style scoped>
.btn-add-new {
  @apply bg-[#5B9717] text-white px-4 py-2 rounded-md hover:bg-[#4a7c13] transition flex items-center shadow-md font-medium;
}
</style>
