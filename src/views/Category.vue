<template>
  <div class="p-6 min-h-screen flex justify-center items-center bg-blue-100">
    <div class="bg-white rounded-xl shadow-lg p-8 w-full max-w-6xl">
      <!-- Back Button -->
      <button
        @click="handleNavigateBack"
        class="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition mb-4"
      >
        <ChevronLeftIcon class="w-6 h-6" />
      </button>

      <!-- Header + Add Button -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-blue-800">Category Management</h1>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          @click="openAddForm"
        >
          ➕ Add Category
        </button>
      </div>

      <!-- Table -->
      <DataTable
        :value="categories"
        paginator
        :rows="5"
        stripedRows
        responsiveLayout="scroll"
      >
        <Column field="id" header="ID" />
        <Column field="name" header="Category Name" />
        <Column field="description" header="Description" />

        <Column header="Action">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button
                icon="pi pi-pencil"
                class="p-button-sm p-button-warning"
                @click="editCategory(data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-sm p-button-danger"
                @click="deleteCategory(data.id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Modal Form -->
      <CategoryForm
        :open="showForm"
        :data="selectedCategory"
        :is-edit="isEdit"
        @close="closeForm"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import CategoryForm from '../components/Modal/CategoryForm.vue'

export default {
  components: { DataTable, Column, Button, CategoryForm, ChevronLeftIcon },

  setup() {
    const router = useRouter() // FIX: initialize router

    const categories = ref([
      { id: 1, name: 'Lottery', description: 'All lottery categories' },
      { id: 2, name: 'Finance', description: 'Finance related' }
    ])

    const showForm = ref(false)
    const isEdit = ref(false)
    const selectedCategory = ref(null)

    const handleNavigateBack = () => {
      router.push('/')
    }

    const openAddForm = () => {
      selectedCategory.value = null
      isEdit.value = false
      showForm.value = true
    }

    const editCategory = (category) => {
      selectedCategory.value = { ...category }
      isEdit.value = true
      showForm.value = true
    }

    const closeForm = () => {
      showForm.value = false
      selectedCategory.value = null
    }

    const handleSave = (category) => {
      if (isEdit.value) {
        const index = categories.value.findIndex(c => c.id === category.id)
        if (index !== -1) categories.value[index] = category
      } else {
        category.id = Date.now()
        categories.value.push(category)
      }
      closeForm()
    }

    const deleteCategory = (id) => {
      if (confirm('Are you sure you want to delete this category?')) {
        categories.value = categories.value.filter(c => c.id !== id)
      }
    }

    return {
      categories,
      showForm,
      isEdit,
      selectedCategory,
      openAddForm,
      editCategory,
      closeForm,
      handleSave,
      deleteCategory,
      handleNavigateBack
    }
  }
}
</script>

<style scoped>
</style>
