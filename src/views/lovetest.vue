<template>
  <div class="w-full min-h-screen p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10" data-aos="fade-down">
    <div class="bg-white border border-primary-border p-4 shadow-sm rounded-xl font-NotoSerifKhmer"
      v-animateonscroll="{ enterClass: 'animate-scalein', leaveClass: 'animate-fadeout' }">
      <!-- Header Section -->
      <div class="space-y-5 py-6 pt-2 rounded-lg bg-btcha">
        <div class="text-lg sm:text-xl font-bold text-primary flex items-center gap-2">
          <Armchair />
          <span>{{ $t("Table List") }}</span>
        </div>

        <!-- Desktop / Tablet Controls -->
        <div v-if="!isMobileScreen" class="hidden md:flex flex-wrap items-end justify-between gap-3">
          <div>
            <span class="label">{{ $t("Page rows") }}</span>
            <Select v-model="pageSize" :options="optionPageSize" option-label="value" option-value="value"
              :disabled="searchQuery !== ''" placeholder="ជ្រើសរើសចំនួនជួរ" class="w-24 sm:w-28" size="small" />
          </div>

          <div class="w-full sm:w-1/2 md:w-1/3 flex items-center">
            <InputText v-model="searchQuery" type="text" :placeholder="t('Search by table name...')" class="w-full"
              size="small" />
          </div>

          <div class="flex items-center">
            <button @click="handlePopOpenform" class="btn-sub flex items-center space-x-2">
              <font-awesome-icon icon="fa-solid fa-plus-circle" />
              <span>{{ $t("Add new") }}</span>
            </button>
          </div>
        </div>

        <!-- Mobile Controls -->
        <div v-else class="block md:hidden space-y-3">
          <div>
            <InputText v-model="searchQuery" type="text" :placeholder="t('Search by table name...')" class="w-full"
              size="small" />
          </div>

          <div class="flex justify-between items-center">
            <div>
              <span class="label">{{ $t("Page rows") }}</span>
              <Select v-model="pageSize" :options="optionPageSize" option-label="value" option-value="value"
                :disabled="searchQuery !== ''" placeholder="ជ្រើសរើសចំនួនជួរ" class="w-24" size="small" />
            </div>

            <button @click="handlePopOpenform" class="btn-sub flex items-center space-x-2">
              <font-awesome-icon icon="fa-solid fa-plus-circle" />
              <span>{{ $t("Add new") }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div v-if="!isMobileScreen"
        class="hidden md:block w-full max-h-[720px] overflow-auto scrollbar scrollbar-purple relative rounded-lg text-sm">
        <div v-if="isLoading" class="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <table class="w-full" :class="{ 'opacity-50': isLoading }">
          <thead class="font-bold bg-primary-bg text-primary-text sticky top-0 z-[10]">
            <tr
              class="[&>*]:border [&>*]:px-2 [&>*]:py-2 [&>*]:text-center whitespace-nowrap text-xs sm:text-sm md:text-base">
              <th>{{ $t("Table Name") }}</th>
              <th>{{ $t("Floor") }}</th>
              <th>{{ $t("Seats") }}</th>
              <th>{{ $t("Description") }}</th>
              <th>{{ $t("Status") }}</th>
              <th>{{ $t("Created By") }}</th>
              <th>{{ $t("Created At") }}</th>
              <th>{{ $t("Actions") }}</th>
            </tr>
          </thead>

          <tbody v-if="tableData.length > 0">
            <tr v-for="(item, index) in tableData" :key="item._id" class="[&>*]:border [&>*]:p-2"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-primary-bg'">
              <td class="text-center font-semibold">{{ item.tableName }}</td>
              <td class="text-center">{{ item.floorId?.floorName || "-" }}</td>
              <td class="text-center">{{ item.seats }}</td>
              <td class="text-center">{{ item.description || "-" }}</td>
              <td>
                <div class="flex justify-center">
                  <span v-if="item.isAvailable" class="flex items-center gap-1 text-green-600">
                    <CheckCircle class="w-4" /> {{ $t("Available") }}
                  </span>
                  <span v-else class="flex items-center gap-1 text-red-600">
                    <XCircle class="w-4" /> {{ $t("Occupied") }}
                  </span>
                </div>
              </td>
              <td class="text-center">{{ getUserName(item.createdBy) || "" }}</td>
              <td class="text-center">{{ formatDate(item.createdAt) }}</td>
              <td class="text-center space-x-3">
                <button @click="handlePopEdit(item)">
                  <Edit class="edit" />
                </button>
                <button @click="handlePopDelete(item)">
                  <Trash2 class="delete" />
                </button>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td colspan="8" class="text-center py-6 font-semibold text-base">
                {{ $t("No Data Found") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card View -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
        <TableCard v-for="item in tableData" :key="item._id" :table="item" :getUserName="getUserName"
          :formatDate="formatDate" @onCardAction="handleCardAction" />
      </div>

      <!-- Pagination -->
      <div class="pt-6">
        <Pagination :currentPage="currentPage" @onEmitDataFromPagination="handleListenToPagination"
          @onEmitIsLoading="handleListenIsLoading" @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage"
          :limitedPerPage="pageSize" :searchQuery="searchText" />
      </div>
    </div>
  </div>

  <!-- Dynamic Form/Delete Components -->
  <component :is="currentComponent" @onCloseDelete="handleListenEmitEventDelete" @onClose="handleListenEmitEvent"
    @onToastSuccess="handleClearToast" :isLastRecordOnPage="isLastRecordOnPage" :collectionName="collectionName"
    :displayLabel="displayLabel" :elementName="elementName" :deleteId="deleteId" :visible="openForm" :doc="docData"
    :docDelete="docDelete" :showToast="showToast" :isFailed="isFailed" :isEditDoc="isEditDoc"
    :informMessage="informMessage" />
</template>


<script>
import TableForm from "@/components/Modal/TablesForm.vue";
import DeleteConfirmation from "@/components/DeleteComfirmation.vue";
import Pagination from "@/components/Pagination.vue";
import ToastedVue from "@/components/ToastedVue.vue";
import formatDate from "@/composable/formatDate";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { getDocument } from '@/composable/getDocument';
import TableCard from "@/views/mobile/Card/TableCard.vue";

export default {
  components: {
    TableForm,
    ToastedVue,
    DeleteConfirmation,
    Pagination,
    TableCard,
  },
  setup() {
    const { t } = useI18n();
    const openForm = ref(false);
    const tableData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(5);
    const isEditDoc = ref(false);
    const docData = ref(null);
    const searchQuery = ref("");
    const isLoading = ref(false);
    const optionPageSize = ref([5, 10, 20, 500, 1000].map((v) => ({ value: v })));
    const showToast = ref(false);
    const isFailed = ref(false);
    const informMessage = ref("");
    const searchText = ref("");
    const isMobileScreen = ref(false);

    // Delete state
    const collectionName = ref("");
    const displayLabel = ref("");
    const elementName = ref("");
    const deleteId = ref(null);
    const docDelete = ref(null);
    const isLastRecordOnPage = ref(false);
    const currentComponent = ref("");
    const userData = ref([]);


    // ✅ fixed screen size checker
    function handleCheckScreenSize() {
      if (typeof window !== "undefined") {
        isMobileScreen.value = window.innerWidth < 768;
      }
    }

    onMounted(() => {
      handleCheckScreenSize();
      window.addEventListener("resize", handleCheckScreenSize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", handleCheckScreenSize);
    });


    const { getDocs, createConditions } = getDocument();



    const handleListenToPagination = (items) => {
      tableData.value = items || [];
    };

    const handleListenIsLoading = (status) => {
      isLoading.value = status;
    };

    const handleListenIsLastRecordOnPage = (status) => {
      isLastRecordOnPage.value = status;
    };

    watch(searchQuery, (newValue) => {
      searchText.value = newValue;
      currentPage.value = 1;
    });


    const resetState = () => {
      currentComponent.value = "";
      showToast.value = false;
      isFailed.value = false;
      openForm.value = false;
      isEditDoc.value = false;
      docData.value = null;
      docDelete.value = null;
      deleteId.value = null;
      collectionName.value = "";
      displayLabel.value = "";
      elementName.value = "";
    };

    const handleListenEmitEvent = (status) => {
      if (status === "add" || status === "update") {
        informMessage.value =
          status === "add" ? t("Successfully Added") : t("Successfully Updated");
        searchQuery.value = "";
        showToast.value = true;
        currentComponent.value = "ToastedVue";
        openForm.value = false;
      } else {
        resetState();
      }
    };

    const handleListenEmitEventDelete = (status) => {
      if (status === "delete") {
        informMessage.value = t("Successfully Deleted");
        searchQuery.value = "";
        showToast.value = true;
        currentComponent.value = "ToastedVue";
        // Reset delete-related values
        deleteId.value = null;
        collectionName.value = "";
        displayLabel.value = "";
        elementName.value = "";
      } else {
        resetState();
      }
    };

    const handleClearToast = () => {
      resetState();
    };

    const handlePopOpenform = () => {
      openForm.value = true;
      isEditDoc.value = false;
      docData.value = null;
      currentComponent.value = "TableForm";
    };

    const handlePopEdit = (item) => {
      isEditDoc.value = true;
      openForm.value = true;
      docData.value = item;
      currentComponent.value = "TableForm";
    };




    const handlePopDelete = async (item) => {
      docDelete.value = item;
      deleteId.value = item._id;

      // call collection name here
      collectionName.value = "Table";
      displayLabel.value = "Table";

      showToast.value = true;

      if (tableData.value.length === 1 && currentPage.value > 1) {
        isLastRecordOnPage.value = true;
      } else {
        isLastRecordOnPage.value = false;
      }

      currentComponent.value = "DeleteConfirmation";
    };
    const handleCardAction = ({ action, item }) => {
      if (action === "edit") handlePopEdit(item);
      if (action === "delete") handlePopDelete(item);
    };




    const getUserName = (id) => {
      if (!id || !userData.value || !Array.isArray(userData.value)) {
        return "Unknown User";
      }

      const user = userData.value.find((user) => user._id === id);
      return user ? (user.username || user.displayName || user.name) : "Unknown User";
    };

    const fetchUserName = async () => {
      try {
        const conditions = createConditions([
          {
            field: 'status',
            operator: "==",
            value: true,
          },
        ]);

        const params = {
          dynamicConditions: conditions
        };

        const response = await getDocs('User', params);
        userData.value = response.data?.data || response.data || [];

      } catch (err) {
        console.log("failed to fetch data", err);
        userData.value = [];
      }
    };


    onMounted(() => {
      fetchUserName();
    });



    return {
      // Data
      docDelete,
      isLoading,
      searchText,
      isLastRecordOnPage,
      deleteId,
      collectionName,
      displayLabel,
      elementName,
      searchQuery,
      isFailed,
      showToast,
      informMessage,
      optionPageSize,
      docData,
      isEditDoc,
      pageSize,
      currentPage,
      tableData,
      openForm,
      currentComponent,
      userData,
      isMobileScreen,

      // Functions
      handleListenIsLastRecordOnPage,
      handleListenIsLoading,
      handleListenToPagination,
      handleListenEmitEventDelete,
      handlePopDelete,
      handleClearToast,
      handlePopEdit,
      handleListenEmitEvent,
      handlePopOpenform,
      formatDate,
      fetchUserName,
      getUserName,
      handleCardAction,
      handleCheckScreenSize,
      t,
    };
  },
};
</script>
