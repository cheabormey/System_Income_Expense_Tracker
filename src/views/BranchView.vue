<template>
  <div class="mx-5 font-noto">
    <!-- Back Button -->
    <button @click="handleNavigateBack"
      class="p-2 text-black hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
      aria-label="Go back">
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-4">Branches</h1>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="w-full md:w-auto flex flex-col sm:flex-row gap-3 flex-wrap">
          <input v-model="searchText" placeholder="Search by name or abbreviation"
            class="border rounded-md px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#5B9717]" />

          <input v-model="invoicePrefix" placeholder="Invoice Prefix (e.g. INV-)"
            class="border rounded-md px-4 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-[#5B9717]" />
          <input v-model.number="invoiceIdLength" type="number" min="1" placeholder="Invoice ID Length"
            class="border rounded-md px-4 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-[#5B9717]" />
        </div>


        <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
            <path
              d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span>Add New</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-x-auto border">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Abbreviation</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Director</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
            <!-- <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th> -->
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Invoice Prefix</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Invoice ID Length</th>
            <!-- <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Latitude</th> -->
            <!-- <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Longitude</th> -->
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(branch, index) in filteredBranches" :key="branch.id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ branch.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.abbreviation }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.directorName || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.contact || '-' }}</td>
            <!-- <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.email || '-' }}</td> -->
            <td class="px-6 py-4 text-gray-700">{{ branch.address || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.invoicePrefix || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.invoiceIdLength || '-' }}</td>
            <!-- <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.latitude || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.longitude || '-' }}</td> -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span @click="toggleStatus(branch)"
                class="cursor-pointer inline-flex px-3 py-1 text-xs font-medium rounded-full"
                :class="branch.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ branch.status ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">

              <!-- Edit Button -->
              <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#045B1B] hover:bg-[#f9faf5] transition"
                @click="openEditForm(branch)" title="Edit">
                <i class="pi pi-pencil text-base" />
              </button>

              <!-- Delete Button -->
              <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:bg-red-50 transition"
                @click="confirmDelete(branch.id)" title="Delete">
                <i class="pi pi-trash text-base" />
              </button>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="filteredBranches.length === 0">
            <td colspan="12" class="px-6 py-16 text-center text-gray-500">
              No branches found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Branch Form Modal -->
    <BranchFormModal :open="showFormModal" :is-edit="isEditDoc" :initial-data="selectedBranch" @close="closeForm"
      @save="handleSave" />
  </div>
</template>

<script>
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
import BranchFormModal from '../components/Modal/BranchForm.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'BranchView',
  components: { BranchFormModal, ChevronLeftIcon },

  setup() {
    const router = useRouter();
    const handleNavigateBack = () => router.push('/');

    return { handleNavigateBack };
  },

  data() {
    return {
      searchText: '',
      invoicePrefix: '',
      invoiceIdLength: null,
      showFormModal: false,
      isEditDoc: false,
      selectedBranch: null,
      branches: [
        {
          id: 1,
          name: 'Phnom Penh Branch',
          abbreviation: 'PP',
          directorName: 'Sok Dara',
          contact: '012 345 678',
          email: 'ppbranch@example.com',
          address: 'Phnom Penh, Cambodia',
          invoicePrefix: 'INV-',
          invoiceIdLength: 6,
          latitude: '11.5564',
          longitude: '104.9282',
          description: 'Main branch in capital city',
          status: true,
        },
      ],
    };
  },

  computed: {
    filteredBranches() {
      let result = this.branches;

      if (this.searchText.trim()) {
        const query = this.searchText.toLowerCase();
        result = result.filter(
          (b) =>
            b.name.toLowerCase().includes(query) ||
            b.abbreviation.toLowerCase().includes(query)
        );
      }

      if (this.invoicePrefix.trim()) {
        const prefix = this.invoicePrefix.trim().toUpperCase();
        result = result.filter((b) => b.invoicePrefix?.toUpperCase() === prefix);
      }

      if (this.invoiceIdLength !== null && !isNaN(this.invoiceIdLength)) {
        const len = Number(this.invoiceIdLength);
        result = result.filter((b) => b.invoiceIdLength === len);
      }

      return result;
    },
  },

  methods: {
    openAddForm() {
      this.isEditDoc = false;
      this.selectedBranch = null;
      this.showFormModal = true;
    },

    openEditForm(branch) {
      this.isEditDoc = true;
      this.selectedBranch = { ...branch };
      this.showFormModal = true;
    },

    closeForm() {
      this.showFormModal = false;
      this.selectedBranch = null;
    },

    toggleStatus(branch) {
      branch.status = !branch.status;
      // TODO: call API to update status
    },

    confirmDelete(id) {
      if (confirm('Are you sure you want to delete this branch?')) {
        this.branches = this.branches.filter((b) => b.id !== id);
        // TODO: call API to delete
      }
    },

    handleSave(savedBranch) {
      if (this.isEditDoc) {
        const index = this.branches.findIndex((b) => b.id === savedBranch.id);
        if (index !== -1) this.branches[index] = { ...savedBranch };
      } else {
        const newId = Math.max(...this.branches.map((b) => b.id), 0) + 1;
        this.branches.push({
          ...savedBranch,
          id: newId,
          status: true,
          invoicePrefix: savedBranch.invoicePrefix || 'INV-',
          invoiceIdLength: savedBranch.invoiceIdLength || 6,
        });
      }
      this.closeForm();
    },
  },
};
</script>