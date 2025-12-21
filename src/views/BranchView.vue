<template>
  <div class="mx-5 font-noto">
    <!-- Back Button -->
    <button
      @click="handleNavigateBack"
      class="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition mb-4 inline-flex items-center"
      aria-label="Go back"
    >
      <ChevronLeftIcon class="w-6 h-6" />
      <span class="ml-1 text-sm">Back</span>
    </button>

    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 my-4 border-2 border-dashed border-[#5B9717]">
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-4">
        Branches
      </h1>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <input
          v-model="searchText"
          placeholder="Search by name or abbreviation"
          class="border rounded-md px-4 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-[#5B9717]"
        />

        <button
          class="bg-[#045B1B] hover:bg-[#045B1B]/90 text-white px-6 py-2 rounded-md transition flex items-center gap-2"
          @click="openAddForm"
        >
          <span>➕ Add New</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden border">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Director</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Contact</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(branch, index) in filteredBranches"
            :key="branch.id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#c6f5d3]'"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="font-medium text-gray-900">{{ branch.name }}</div>
              <div class="text-sm text-gray-500">{{ branch.abbreviation }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.directorName }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ branch.contact }}</td>
            <td class="px-6 py-4 text-gray-700">{{ branch.address }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                @click="toggleStatus(branch)"
                class="cursor-pointer inline-flex px-3 py-1 text-sm font-medium rounded-full"
                :class="branch.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ branch.status ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <button
                class="text-blue-600 hover:text-blue-900 mr-4"
                @click="openEditForm(branch)"
                title="Edit"
              >
                ✏️
              </button>
              <button
                class="text-red-600 hover:text-red-900"
                @click="confirmDelete(branch.id)"
                title="Delete"
              >
                🗑️
              </button>
            </td>
          </tr>
          <!-- Empty State -->
          <tr v-if="filteredBranches.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-500">
              No branches found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Branch Form Modal -->
    <BranchFormModal
      :open="showFormModal"
      :is-edit-doc="isEditDoc"
      :doc="selectedBranch"
      @onClose="closeForm"
      @onSave="handleSave"
    />
  </div>
</template>

<script>
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'; // Adjust import based on your setup
import BranchFormModal from "../components/Modal/BranchForm.vue";
import { useRouter } from 'vue-router'; // Vue 3 Composition API style (recommended)

export default {
  name: "BranchView",
  components: { BranchFormModal, ChevronLeftIcon },

  setup() {
    const router = useRouter();

    const handleNavigateBack = () => {
      router.push('/');
    };

    return { handleNavigateBack };
  },

  data() {
    return {
      searchText: "",
      showFormModal: false,
      isEditDoc: false,
      selectedBranch: null,

      branches: [
        {
          id: 1,
          name: "Phnom Penh Branch",
          abbreviation: "PP",
          directorName: "Sok Dara",
          contact: "012 345 678",
          address: "Phnom Penh",
          status: true,
        },
      ],
    };
  },

  computed: {
    filteredBranches() {
      if (!this.searchText.trim()) return this.branches;

      const query = this.searchText.toLowerCase();
      return this.branches.filter(branch =>
        branch.name.toLowerCase().includes(query) ||
        branch.abbreviation.toLowerCase().includes(query)
      );
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
      this.selectedBranch = { ...branch }; // Clone to avoid mutating original
      this.showFormModal = true;
    },

    closeForm() {
      this.showFormModal = false;
      this.selectedBranch = null;
    },

    toggleStatus(branch) {
      branch.status = !branch.status;
      // Optionally: save to backend here
    },

    confirmDelete(id) {
      if (confirm("Are you sure you want to delete this branch?")) {
        this.deleteBranch(id);
      }
    },

    deleteBranch(id) {
      this.branches = this.branches.filter(b => b.id !== id);
    },

    // Optional: handle save from modal (if modal emits saved data)
    handleSave(savedBranch) {
      if (this.isEditDoc) {
        const index = this.branches.findIndex(b => b.id === savedBranch.id);
        if (index !== -1) {
          this.branches[index] = savedBranch;
        }
      } else {
        // Add new (ensure unique ID)
        const newId = Math.max(...this.branches.map(b => b.id), 0) + 1;
        this.branches.push({ ...savedBranch, id: newId });
      }
      this.closeForm();
    },
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>