<template>
  <div class="mx-5 font-noto">
    <button @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center">
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">Customer Return Money</h1>

      <div
        :class="!isMobileScreen ? 'hidden md:flex flex-wrap items-end justify-between gap-4' : 'block md:hidden space-y-4'">
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">Rows</span>
          <Select v-model="pageSize" :options="optionPageSize" placeholder="Select size"
            class="w-24 custom-row-select" />
        </div>

        <div class="flex-1 max-w-md">
          <span class="text-sm font-medium text-gray-700 mb-1 block">Search Users</span>
          <input v-model="searchQuery" type="text" placeholder="Search by username, phone, or role"
            class="w-full border rounded-md px-4 py-2 text-sm focus:ring-[#5B9717]" />
        </div>

        <!-- <button
          class="bg-[#5B9717] text-white px-4 py-2 rounded-md hover:bg-[#4a7c13] transition flex items-center gap-2"
          @click="openAddForm">
          <PlusIcon class="w-5 h-5" />
          <span>Add New User</span>
        </button> -->
                <!-- Add Button -->
        <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
            <path
              d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span>Add New Category</span>
        </button>
      </div>
    </div>

    <div v-if="!isMobileScreen" class="bg-white rounded-lg shadow overflow-x-auto border relative">
      <div v-if="isLoading" class="absolute inset-0 bg-white/50 flex justify-center items-center z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5B9717]"></div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(user, index) in userData" :key="user._id" :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  <img v-if="user.profilePicture" :src="user.profilePicture" class="h-full w-full object-cover" />
                  <i v-else class="pi pi-user text-gray-400"></i>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                  <div class="text-xs text-gray-500">{{ user.gender }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 text-xs rounded-full"
                :class="user.mainRole === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'">
                {{ user.mainRole }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ user.phoneNumber || '-' }}</td>
            <td class="px-3 py-2">
              <button @click="handleStatusToggle(user)" :class="user.status ? 'text-green-600' : 'text-red-600'">
                <i class="pi" :class="user.status ? 'pi-check-circle' : 'pi-times-circle'" />
              </button>
            </td>
            <td class="px-6 py-4 text-center">
              <button @click="openEditForm(user)" class="p-2 text-[#045B1B]"><i class="pi pi-pencil" /></button>
              <button @click="confirmDelete(user)" class="p-2 text-red-600"><i class="pi pi-trash" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <UserCard :items="userData" :is-loading="isLoading" @onEdit="openEditForm" @onDelete="confirmDelete" />
    </div>

    <Pagination class="mt-5" :currentPage="currentPage" :limitedPerPage="pageSize" :searchQuery="searchQuery"
      collectionName="User" @onEmitDataFromPagination="handlePaginationData" @onEmitIsLoading="handleIsLoading"
      @onEmitCurrentPageIsLastRecord="handleIsLastRecord" />

    <UserFormModal :visible="showFormModal" :is-edit-doc="isEditDoc" :doc="selectedUser" @onClose="closeForm" />
    <DeleteConfirmation :visible="showDeleteModal" :deleteId="deleteId" :elementName="selectedUser?.username || ''"
      collectionName="User" @onCloseDelete="handleCloseDelete" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/vue/24/outline';
import UserFormModal from '../components/Modal/UserForm.vue';
import UserCard from '@/mobile/UserCard.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';

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

const handleCheckScreenSize = () => { isMobileScreen.value = window.innerWidth < 768; };
onMounted(() => { handleCheckScreenSize(); window.addEventListener('resize', handleCheckScreenSize); });
onBeforeUnmount(() => window.removeEventListener('resize', handleCheckScreenSize));



const openAddForm = () => { isEditDoc.value = false; selectedUser.value = null; showFormModal.value = true; };
const openEditForm = (user) => { isEditDoc.value = true; selectedUser.value = user; showFormModal.value = true; };
const confirmDelete = (user) => { deleteId.value = user._id; selectedUser.value = user; showDeleteModal.value = true; };
const closeForm = () => { showFormModal.value = false; };
const handleCloseDelete = () => { showDeleteModal.value = false; };
const handleNavigateBack = () => router.push('/');

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




</script>