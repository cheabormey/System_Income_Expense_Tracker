<template>
  <div class="w-full min-h-screen p-4 sm:p-3 md:p-4 lg:p-6 xl:p-8 2xl:p-10 bg-white font-noto animate-fade-up animate-once animate-duration-[400ms]">
    <div class="font-NotoSerifKhmer"
      v-animateonscroll="{ enterClass: 'animate-scalein', leaveClass: 'animate-fadeout' }">

      <!-- Responsive Top Header -->
      <div class="relative flex items-center justify-between ">
        <!-- Left : Back Button -->
        <div class="w-[95px] sm:w-[110px] flex justify-start">
          <button @click="handleNavigateBack" class="group relative flex items-center gap-2 px-3 py-2 rounded-xl
             bg-white/80 backdrop-blur-md border border-white/50
             text-primary-dark text-xs sm:text-sm font-medium
             shadow-sm hover:shadow-md hover:bg-white
             transition-all duration-300">
            <!-- Icon -->
            <div class="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full
               bg-primary-focus/20 group-hover:bg-primary-focus/50 border border-primary-focus
               transition-all duration-300">
              <i class="pi pi-arrow-left text-[10px] sm:text-xs"></i>
            </div>

            <!-- Text -->
            <span class="tracking-wide hidden xs:block sm:block">
              {{ $t('Back') }}
            </span>
          </button>
        </div>

        <!-- Center : Title -->
        <div class="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 ">
          <!-- <Tag class="w-8 h-8 sm:w-10 sm:h-10" /> -->
          <span class="whitespace-nowrap text-xl md:text-2xl text-primary-dark">{{ $t('Category list') }}</span>
        </div>

        <!-- Right : Empty Space for Perfect Balance -->
        <div class="w-[95px] sm:w-[110px]"></div>
      </div>

      <!-- Header -->
      <div class="space-y-5 py-6 rounded-lg bg-white shadow-sm p-4 md:p-6 my-4 border-2 border-dashed border-[#5B9717]">

        <!-- Desktop + Tablet -->
        <div class="hidden md:flex flex-wrap items-end justify-between gap-4">

          <!-- Page Size -->
          <div class="flex flex-col">
            <span class="label mb-1">{{ $t('Page rows') }}</span>
            <Select v-model="pageSize" :options="optionPageSize" option-label="value" option-value="value"
              :disabled="searchQuery !== ''" class="w-24" size="small" />
          </div>

          <!-- Search -->
          <div class="flex-1 min-w-[200px] max-w-md">
            <InputText v-model="searchQuery" :placeholder="t('Search by category name...')" class="w-full"
              size="small" />
          </div>

          <!-- Button -->
          <div class="flex justify-end w-full md:w-auto">
            <button @click="handlePopOpenform"
              class="btn-add-new flex items-center justify-center gap-2 w-full md:w-auto">
              <font-awesome-icon icon="fa-solid fa-plus-circle" />
              <span>{{ $t('Add new') }}</span>
            </button>
          </div>

        </div>

        <!-- Mobile -->
        <div class="block md:hidden space-y-3">

          <!-- Search -->
          <InputText v-model="searchQuery" :placeholder="t('Search by category name...')" class="w-full" size="small" />

          <!-- Bottom row -->
          <div class="flex items-center justify-between gap-3">

            <!-- Page Size -->
            <div class="flex flex-col">
              <span class="label text-xs mb-1">{{ $t('Page rows') }}</span>
              <Select v-model="pageSize" :options="optionPageSize" option-label="value" option-value="value"
                :disabled="searchQuery !== ''" class="w-20" size="small" />
            </div>

            <!-- Button -->
            <button @click="handlePopOpenform"
              class="flex items-center gap-1 bg-primary-bg border border-primary-border rounded-lg text-primary px-3 py-2 hover:bg-[#045B1B]/80 text-xs whitespace-nowrap">
              <font-awesome-icon icon="fa-solid fa-plus-circle" />
              <span>{{ $t('Add new') }}</span>
            </button>

          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div v-if="!isMobileScreen"
        class="hidden md:block w-full max-h-[720px] overflow-auto scrollbar scrollbar-purple relative rounded-lg text-sm">
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center z-10 rounded-lg">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <table class="w-full" :class="{ 'opacity-50': isLoading }">
          <thead class="font-bold bg-primary-light text-white sticky top-0 z-10">
            <tr class="[&>*]:border [&>*]:px-2 [&>*]:py-3 [&>*]:text-center">
              <th class="px-4 py-3 text-left">N</th>
                <th>{{ $t('Name') }}</th>
              <th>{{ $t('Description') }}</th>
              <th>{{ $t('Created By') }}</th>
              <th>{{ $t('Created At') }}</th>
              <th>{{ $t('Status') }}</th>
              <th>{{ $t('Actions') }}</th>
            </tr>
          </thead>

          <tbody v-if="categoryData.length">
            <tr v-for="(item, index) in categoryData" :key="item._id"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="[&>*]:border [&>*]:p-1">
              <td class="px-4 py-3">{{ ((currentPage - 1) * pageSize) + index + 1 }}</td>
                            <td class="text-center">{{ item.name }}</td>
              <td class="text-center">{{ item.description || '-' }}</td>
              <td class="text-center">{{ getUserName(item.createdBy) }}</td>
              <td class="text-center">{{ formatDateKhmer(item.createdAt) }}</td>
              <td class="text-center">
                <div class="flex justify-center">
                  <button @click="$emit('onTableAction', { action: 'changeStatus', item })"
                    class="px-4 py-1.5 flex items-center gap-1.5 text-xs sm:text-sm font-semibold rounded-2xl backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-105"
                    :class="[
                      item.status
                        ? ' text-primary-hover'
                        : ' text-rose-600'
                    ]">
                    <!-- Icon -->
                    <i :class="[
                      'text-sm transition-transform duration-300',
                      item.status
                        ? 'pi pi-check-circle text-primary-hover'
                        : 'pi pi-times-circle text-rose-600'
                    ]"></i>

                    <!-- Text -->
                    <span class="capitalize tracking-wide font-medium">
                      {{ item.status ? $t('Active') : $t('Inactive') }}
                    </span>
                  </button>
                </div>
              </td>
              <td class="space-x-4 text-center">
                <!-- <button @click="handlePopEdit(item)">
                  <Edit class="edit" />
                </button>
                <button @click="handlePopDelete(item)">
                  <Trash2 class="delete" />
                </button> -->
                <button @click="handlePopEdit(item)"
                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 hover:bg-primary-hover hover:text-white transition">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="handlePopDelete(item)"
                  class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td colspan="7" class="py-20 text-center">
                <div class="flex flex-col items-center opacity-30">
                  <Tag class="w-16 h-16 mb-2" />
                  <p class="text-xl font-bold">{{ $t('No Customers Found') }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile Card -->
      <div v-if="isMobileScreen" class="grid gap-4 sm:grid-cols-2 md:hidden">
        <CategoryCard v-for="item in categoryData" :key="item._id" :floor="item" :getUserName="getUserName"
          :formatDate="formatDateKhmer" @onCardAction="handleCardAction" />
      </div>

      <!-- Pagination -->
      <Pagination :currentPage="currentPage" :limitedPerPage="pageSize" :searchQuery="searchText"
        @onEmitDataFromPagination="handleListenToPagination" @onEmitIsLoading="handleListenIsLoading"
        @onEmitCurrentPageIsLastRecord="handleListenIsLastRecordOnPage" />
    </div>

    <!-- Dynamic Modal -->
    <component v-if="currentComponent" :is="currentComponent" :visible="openForm" :doc="docData" :docDelete="docDelete"
      :deleteId="deleteId" :collectionName="collectionName" :displayLabel="displayLabel" :elementName="elementName"
      :isEditDoc="isEditDoc" :showToast="showToast" :isFailed="isFailed" :informMessage="informMessage"
      :isLastRecordOnPage="isLastRecordOnPage" @onClose="handleListenEmitEvent"
      @onCloseDelete="handleListenEmitEventDelete" @onToastSuccess="handleClearToast" />
  </div>
</template>

<script>
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';
import CategoryForm from '@/components/Modal/CategoryForm.vue';
import Pagination from '@/components/Pagination.vue';
import ToastedVue from '@/components/ToastedVue.vue';
import CategoryCard from '@/mobile/CategoryCard.vue';
import formatDateKhmer from '@/composable/formatDate';
import { getDocument } from '@/composable/getDocument';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import { CheckCircle, XCircle, Edit, Trash2, Tag } from 'lucide-vue-next';
import { useRouter } from 'vue-router'

export default {
  components: {
    DeleteConfirmation,
    CategoryForm,
    Pagination,
    ToastedVue,
    CategoryCard,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Tag,
  },

  setup() {
    const router = useRouter()
    const { t } = useI18n();
    const { getDocs, createConditions } = getDocument();

    const openForm = ref(false);
    const categoryData = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(50);
    const isEditDoc = ref(false);
    const docData = ref(null);
    const searchQuery = ref('');
    const searchText = ref('');
    const isLoading = ref(false);
    const optionPageSize = ref([50, 100, 200, 500, 1000].map((v) => ({ value: v })));
    const showToast = ref(false);
    const isFailed = ref(false);
    const informMessage = ref('');
    const isMobileScreen = ref(false);

    const collectionName = ref('');
    const displayLabel = ref('');
    const elementName = ref('');
    const deleteId = ref(null);
    const docDelete = ref(null);
    const isLastRecordOnPage = ref(false);
    const currentComponent = ref('');
    const userData = ref([]);

    const handleCheckScreenSize = () => {
      isMobileScreen.value = window.innerWidth < 768;
    };

    onMounted(async () => {
      handleCheckScreenSize();
      window.addEventListener('resize', handleCheckScreenSize);
      await fetchUserName();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleCheckScreenSize);
    });

    watch(searchQuery, (val) => {
      searchText.value = val;
      currentPage.value = 1;
    });

    const resetState = () => {
      openForm.value = false;
      isEditDoc.value = false;
      docData.value = null;
      docDelete.value = null;
      deleteId.value = null;
      collectionName.value = '';
      displayLabel.value = '';
      elementName.value = '';
      currentComponent.value = '';
      showToast.value = false;
      isFailed.value = false;
      informMessage.value = '';
    };

    const handleListenToPagination = (items) => (categoryData.value = items || []);
    const handleListenIsLoading = (status) => (isLoading.value = status);
    const handleListenIsLastRecordOnPage = (status) => (isLastRecordOnPage.value = status);

    const handlePopOpenform = () => {
      resetState();
      openForm.value = true;
      currentComponent.value = 'CategoryForm';
    };

    const handlePopEdit = (item) => {
      resetState();
      isEditDoc.value = true;
      docData.value = item;
      openForm.value = true;
      currentComponent.value = 'CategoryForm';
    };

    const handlePopDelete = (item) => {
      resetState();
      docDelete.value = item;
      deleteId.value = item._id;
      collectionName.value = 'Category';
      displayLabel.value = 'Category';
      elementName.value = item.name || '';
      openForm.value = true;

      isLastRecordOnPage.value = categoryData.value.length === 1 && currentPage.value > 1;

      currentComponent.value = 'DeleteConfirmation';
    };

    const handleListenEmitEvent = (status) => {
      if (status === 'add' || status === 'update') {
        openForm.value = false;
        informMessage.value = status === 'add' ? t('Added Successfully!') : t('Updated Successfully!');
        showToast.value = true;
        currentComponent.value = 'ToastedVue';
      } else {
        resetState();
      }
    };

    const handleListenEmitEventDelete = (status) => {
      if (status === 'delete') {
        openForm.value = false;
        informMessage.value = t('Deleted Successfully!');
        showToast.value = true;
        currentComponent.value = 'ToastedVue';
      } else {
        resetState();
      }
    };

    const handleClearToast = () => {
      showToast.value = false;
      currentComponent.value = '';
    };

    const handleCardAction = ({ action, item }) => {
      if (action === 'edit') handlePopEdit(item);
      if (action === 'delete') handlePopDelete(item);
    };

    const getUserName = (id) => {
      const user = userData.value.find((u) => u._id === id);
      return user ? user.username || user.displayName || user.name : 'Unknown User';
    };

    const fetchUserName = async () => {
      try {
        const conditions = createConditions([{ field: 'status', operator: '==', value: true }]);
        const response = await getDocs('User', { dynamicConditions: conditions });
        userData.value = response.data?.data || response.data || [];
      } catch (error) {
        userData.value = [];
      }
    };

    return {
      t,
      openForm,
      categoryData,
      currentPage,
      pageSize,
      isEditDoc,
      docData,
      searchQuery,
      searchText,
      isLoading,
      optionPageSize,
      showToast,
      isFailed,
      informMessage,
      isMobileScreen,
      collectionName,
      displayLabel,
      elementName,
      deleteId,
      docDelete,
      isLastRecordOnPage,
      currentComponent,
      userData,
      formatDateKhmer,
      handleListenToPagination,
      handleListenIsLoading,
      handleListenIsLastRecordOnPage,
      handlePopOpenform,
      handlePopEdit,
      handlePopDelete,
      handleListenEmitEvent,
      handleListenEmitEventDelete,
      handleClearToast,
      handleCardAction,
      getUserName,
      handleNavigateBack: () => router.push('/'),
    };
  },
};
</script>
