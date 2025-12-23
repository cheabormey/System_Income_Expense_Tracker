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
      <h1 class="text-2xl md:text-3xl font-bold text-[#045B1B] mb-4">Categories</h1>

      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="w-full md:w-auto flex flex-col sm:flex-row gap-3 flex-wrap">
          <input v-model="searchText" placeholder="Search by name or description"
            class="border rounded-md px-4 py-2 w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-[#5B9717]" />

          <select v-model="statusFilter"
            class="border rounded-md px-4 py-2 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-[#5B9717]">
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

                <button class="btn-add-new flex items-center gap-2" @click="openAddForm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5">
            <path
              d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
            <span>Add New Category</span>
        </button>


      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow overflow-x-auto border">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-[#045B1B] text-white">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="(category, index) in filteredCategories" :key="category.id"
            :class="index % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'">
            <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-6 py-4 text-gray-700">{{ category.description || '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span @click="toggleStatus(category)"
                class="cursor-pointer inline-flex px-3 py-1 text-xs font-medium rounded-full"
                :class="category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                {{ category.status ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <!-- Edit Button -->
              <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#045B1B] hover:bg-[#f9faf5] transition"
                @click="openEditForm(category)" title="Edit">
                <i class="pi pi-pencil text-base" />
              </button>

              <!-- Delete Button -->
              <button
                class="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:bg-red-50 transition"
                @click="confirmDelete(category.id)" title="Delete">
                <i class="pi pi-trash text-base" />
              </button>

            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="filteredCategories.length === 0">
            <td colspan="4" class="px-6 py-16 text-center text-gray-500">
              No categories found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Category Form Modal -->
    <CategoryFormModal :open="showFormModal" :is-edit="isEditDoc" :initial-data="selectedCategory" @close="closeForm"
      @save="handleSave" />
  </div>
</template>

<script>
import { ChevronLeftIcon } from '@heroicons/vue/24/outline';
import CategoryFormModal from '../components/Modal/CategoryForm.vue'; // adjust path
import { useRouter } from 'vue-router';

export default {
  name: 'CategoryView',
  components: { CategoryFormModal, ChevronLeftIcon },

  setup() {
    const router = useRouter();
    const handleNavigateBack = () => router.push('/');

    return { handleNavigateBack };
  },

  data() {
    return {
      searchText: '',
      statusFilter: '',
      showFormModal: false,
      isEditDoc: false,
      selectedCategory: null,
      categories: [
        {
          id: 1,
          name: 'Electronics',
          description: 'All electronic devices and accessories',
          status: true,
        },
        {
          id: 2,
          name: 'Clothing',
          description: 'Men, women, and kids apparel',
          status: true,
        },
      ],
    };
  },

  computed: {
    filteredCategories() {
      let result = this.categories;

      // Search by name or description
      if (this.searchText.trim()) {
        const query = this.searchText.toLowerCase();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            (c.description && c.description.toLowerCase().includes(query))
        );
      }

      // Status filter
      if (this.statusFilter !== '') {
        const status = this.statusFilter === 'true';
        result = result.filter((c) => c.status === status);
      }

      return result;
    },
  },

  methods: {
    openAddForm() {
      this.isEditDoc = false;
      this.selectedCategory = null;
      this.showFormModal = true;
    },

    openEditForm(category) {
      this.isEditDoc = true;
      this.selectedCategory = { ...category };
      this.showFormModal = true;
    },

    closeForm() {
      this.showFormModal = false;
      this.selectedCategory = null;
    },

    toggleStatus(category) {
      category.status = !category.status;
      // TODO: call API to update
    },

    confirmDelete(id) {
      if (confirm('Are you sure you want to delete this category?')) {
        this.categories = this.categories.filter((c) => c.id !== id);
        // TODO: call API to delete
      }
    },

    handleSave(savedCategory) {
      if (this.isEditDoc) {
        const index = this.categories.findIndex((c) => c.id === savedCategory.id);
        if (index !== -1) this.categories[index] = { ...savedCategory };
      } else {
        const newId = Math.max(...this.categories.map((c) => c.id), 0) + 1;
        this.categories.push({ ...savedCategory, id: newId, status: true });
      }
      this.closeForm();
    },
  },
};
</script>