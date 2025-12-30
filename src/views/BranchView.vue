<template>
  <div class="mx-5 font-noto">
    <button @click="handleNavigateBack" class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center">
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-6">Branch Management</h1>

      <div :class="!isMobileScreen ? 'hidden md:flex flex-wrap items-end justify-between gap-4' : 'block md:hidden space-y-4'">
        <div class="flex flex-col">
          <span class="text-sm font-medium text-gray-700 mb-1">Page rows</span>
          <select v-model="pageSize" :disabled="searchQuery !== ''" class="w-28 border rounded-md px-3 py-2 text-sm focus:ring-[#5B9717]">
            <option v-for="size in optionPageSize" :key="size" :value="size">{{ size }}</option>
          </select>
        </div>

        <div class="flex-1 max-w-md">
          <span class="text-sm font-medium text-gray-700 mb-1 block">Search Branches</span>
          <input v-model="searchQuery" type="text" placeholder="Search by name, abbreviation or contact" class="w-full border rounded-md px-4 py-2 text-sm focus:ring-[#5B9717]" />
        </div>

        <button class="bg-[#5B9717] text-white px-4 py-2 rounded-md hover:bg-[#4a7c13] transition flex items-center gap-2" @click="openAddForm">
          <PlusIcon class="w-5 h-5" />
          <span>Add New Branch</span>
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
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Branch Name (Code)</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Director / Contact</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Inv. Prefix</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(branch, index) in branchData" :key="branch._id" :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4">
              <div class="font-bold text-gray-900">{{ branch.name }}</div>
              <div class="text-xs text-gray-500 font-mono">ID: {{ branch.abbreviation }}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">
              <div>{{ branch.directorName || 'No Director' }}</div>
              <div class="text-xs text-gray-500">{{ branch.contact }}</div>
            </td>
            <td class="px-6 py-4 font-mono text-sm">{{ branch.invoicePrefix || '-' }}</td>
            <td class="px-3 py-2">
              <button @click="handlePopStatusChange(branch)" :class="branch.status ? 'text-green-600' : 'text-red-600'">
                <i class="pi" :class="branch.status ? 'pi-check-circle' : 'pi-times-circle'" />
              </button>
            </td>
            <td class="px-6 py-4 text-center">
              <button @click="openEditForm(branch)" class="p-2 text-[#045B1B] hover:bg-gray-100 rounded-md"><i class="pi pi-pencil" /></button>
              <button @click="confirmDelete(branch)" class="p-2 text-red-600 hover:bg-red-50 rounded-md"><i class="pi pi-trash" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <BranchCard :items="branchData" :is-loading="isLoading" @onEdit="openEditForm" @onDelete="confirmDelete" />
    </div>

    <div class="mt-5">
      <Pagination :currentPage="currentPage" :limitedPerPage="pageSize" :searchQuery="searchQuery" collectionName="Branch" @onEmitDataFromPagination="handleListenToPagination" />
    </div>

    <BranchFormModal :visible="showFormModal" :is-edit-doc="isEditDoc" :doc="selectedBranch" @onClose="closeForm" />
    <DeleteConfirmation :visible="showDeleteModal" :deleteId="deleteId" :elementName="selectedBranch?.name || ''" collectionName="Branch" @onCloseDelete="handleCloseDelete" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/vue/24/outline';
import BranchFormModal from '../components/Modal/BranchForm.vue';
import BranchCard from '@/mobile/BranchCard.vue';
import Pagination from '@/components/Pagination.vue';
import DeleteConfirmation from '@/components/DeleteComfirmation.vue';

const router = useRouter();
const branchData = ref([]);
const isLoading = ref(false);
const isMobileScreen = ref(false);
const searchQuery = ref('');
const pageSize = ref(50);
const optionPageSize = [50, 100, 200];
const showFormModal = ref(false);
const isEditDoc = ref(false);
const selectedBranch = ref(null);
const showDeleteModal = ref(false);
const deleteId = ref(null);
const currentPage = ref(1);

const handleCheckScreenSize = () => { isMobileScreen.value = window.innerWidth < 768; };
onMounted(() => { handleCheckScreenSize(); window.addEventListener('resize', handleCheckScreenSize); });
onBeforeUnmount(() => window.removeEventListener('resize', handleCheckScreenSize));

const handleListenToPagination = (items) => { branchData.value = items || []; };
const openAddForm = () => { isEditDoc.value = false; selectedBranch.value = null; showFormModal.value = true; };
const openEditForm = (branch) => { isEditDoc.value = true; selectedBranch.value = branch; showFormModal.value = true; };
const confirmDelete = (branch) => { deleteId.value = branch._id; selectedBranch.value = branch; showDeleteModal.value = true; };
const closeForm = () => { showFormModal.value = false; };
const handleCloseDelete = () => { showDeleteModal.value = false; };
const handleNavigateBack = () => router.push('/');
</script>