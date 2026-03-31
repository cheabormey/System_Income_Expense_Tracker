<template>
  <div class="space-y-4 p-1">
    <div v-for="user in items" :key="user._id" class="bg-white border rounded-2xl shadow-sm overflow-hidden relative">
      <div class="absolute top-0 left-0 w-1.5 h-full" :class="user.status ? 'bg-[#5B9717]' : 'bg-rose-500'"></div>

      <div class="p-4 pl-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
            <i class="pi pi-user text-[#045B1B]"></i>
          </div>
          <div class="flex-1">
            <h3 class="font-bold text-gray-900">{{ user.username }}</h3>
            <p class="text-xs text-gray-500">{{ user.mainRole }} • {{ user.gender || 'N/A' }}</p>
          </div>
          <!-- <span class="px-2 py-1 rounded text-[10px] font-bold" :class="user.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
            {{ user.status ? 'ACTIVE' : 'INACTIVE' }}
          </span> -->
          <button @click.stop="$emit('onStatusChange', user)"
            class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border"
            :class="user.status
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'">
            <i class="pi" :class="user.status ? 'pi-check-circle' : 'pi-times-circle'"></i>
            {{ user.status ? 'Active' : 'Inactive' }}
          </button>
        </div>

        <div class="text-sm text-gray-600 space-y-1 mb-4">
          <div class="flex items-center gap-2"><i class="pi pi-phone text-xs"></i> {{ user.phoneNumber || 'No phone' }}
          </div>
          <div class="flex items-center gap-2"><i class="pi pi-map-marker text-xs"></i> {{ user.address || 'No address'
            }}</div>
        </div>

        <!-- <div class="flex justify-end gap-2 border-t pt-3">
          <button @click="$emit('onEdit', user)" class="p-2 bg-blue-50 text-blue-600 rounded-lg"><i class="pi pi-pencil"></i></button>
          <button @click="$emit('onDelete', user)" class="p-2 bg-rose-50 text-rose-600 rounded-lg"><i class="pi pi-trash"></i></button>
        </div> -->
        <div class="flex justify-end gap-2 border-t pt-3">
          <button @click.stop="$emit('onEdit', item)"
            class="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
            <i class="pi pi-pencil text-sm"></i>
          </button>

          <button @click.stop="$emit('onDelete', item)"
            class="flex items-center justify-center w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors">
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/vue/24/outline';
import UserFormModal from '../components/Modal/UserForm.vue';
import UserCard from '@/mobile/UserCard.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';

export default {
  name: 'UserPage',

  components: {
    ChevronLeftIcon,
    PlusIcon,
    UserFormModal,
    UserCard,
    Pagination,
    DeleteConfirmation
  },

  setup() {
    const router = useRouter();

    const userData = ref([]);
    const isLoading = ref(false);
    const isMobileScreen = ref(false);
    const searchQuery = ref('');
    const pageSize = ref(50);
    const optionPageSize = [50, 100, 200];
    const showFormModal = ref(false);
    const isEditDoc = ref(false);
    const selectedUser = ref(null);
    const showDeleteModal = ref(false);
    const deleteId = ref(null);
    const currentPage = ref(1);
    const isLastRecordOnPage = ref(false);

    const handleCheckScreenSize = () => {
      isMobileScreen.value = window.innerWidth < 768;
    };

    onMounted(() => {
      handleCheckScreenSize();
      window.addEventListener('resize', handleCheckScreenSize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleCheckScreenSize);
    });

    const openAddForm = () => {
      isEditDoc.value = false;
      selectedUser.value = null;
      showFormModal.value = true;
    };

    const openEditForm = (user) => {
      isEditDoc.value = true;
      selectedUser.value = user;
      showFormModal.value = true;
    };

    const confirmDelete = (user) => {
      deleteId.value = user._id;
      selectedUser.value = user;
      showDeleteModal.value = true;
    };

    const closeForm = () => {
      showFormModal.value = false;
    };

    const handleCloseDelete = () => {
      showDeleteModal.value = false;
    };

    const handleNavigateBack = () => {
      router.push('/');
    };

    const handlePaginationData = (items) => {
      userData.value = items;
      isLoading.value = false;
    };

    const handleIsLoading = (status) => {
      isLoading.value = status;
    };

    const handleIsLastRecord = (status) => {
      isLastRecordOnPage.value = status;
    };

    watch(searchQuery, () => {
      currentPage.value = 1;
    });

    return {
      userData,
      isLoading,
      isMobileScreen,
      searchQuery,
      pageSize,
      optionPageSize,
      showFormModal,
      isEditDoc,
      selectedUser,
      showDeleteModal,
      deleteId,
      currentPage,
      isLastRecordOnPage,
      openAddForm,
      openEditForm,
      confirmDelete,
      closeForm,
      handleCloseDelete,
      handleNavigateBack,
      handlePaginationData,
      handleIsLoading,
      handleIsLastRecord
    };
  }
};
</script>