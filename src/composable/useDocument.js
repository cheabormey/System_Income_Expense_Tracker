import { fetchTimestamp } from "@/composable/timestamp";
import { useBranchStore } from "@/store/branchStore";
import axios from "axios";
import API_CONFIGS from "@/api/config";
import { ref } from "vue";


export const useDocument = () => {
  const loading = ref(false);
  const error = ref(null);


  // Insert
  const insertDoc = async (collection, formDoc, options = {}) => {
    try {
      loading.value = true;
      error.value = null;
      
      const branchStore = useBranchStore();
      const timestamp = await fetchTimestamp();

      const requestBody = {
        fields: {
          ...formDoc.fields,
          createdAt: timestamp,
          createdBy: branchStore.getUserId,
        }
      };

      // Add custom fields if provided
      if (options.customFields) {
        Object.assign(requestBody.fields, options.customFields);
      }

      const response = await axios.post(`${API_CONFIGS.BASE_URL}/api/insertDoc/${collection}`, requestBody);
      
      return response.data;
    } catch (err) {
      error.value = err;
      console.error(`Failed to insert into ${collection}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };









  // Update 
  const updateDoc = async (collection, id, formDoc, options = {}) => {
    try {
      loading.value = true;
      error.value = null;
      
      const branchStore = useBranchStore();
      const timestamp = await fetchTimestamp();

  

      const requestBody = {
        fields: {
          ...formDoc.fields,
          updatedAt: timestamp,
          updatedBy: branchStore.getUserId,
        }
      };

      // Add custom fields if provided
      if (options.customFields) {
        Object.assign(requestBody.fields, options.customFields);
      }

      const response = await axios.patch(`${API_CONFIGS.BASE_URL}/api/updateDoc/${collection}/${id}`, requestBody);
      
      return response.data;
    } catch (err) {
      error.value = err;
      console.error(`Failed to update ${collection} with id ${id}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };





  // Delete
  const deleteDoc = async (collection, id, options = {}) => {
    try {
      loading.value = true;
      error.value = null;

      
      if (options.softDelete) {
        const branchStore = useBranchStore();
        const timestamp = await fetchTimestamp();
        
        const requestBody = {
          fields: {
            deletedAt: timestamp,
            deletedBy: branchStore.getUserId,
            isDeleted: true
          }
        };

        const response = await axios.patch(`${API_CONFIGS.BASE_URL}/api/updateDoc/${collection}/${id}`, requestBody);
        return response.data;
      } else {
        // Hard delete
        const response = await axios.delete(`${API_CONFIGS.BASE_URL}/api/deleteDoc/${collection}/${id}`);
        return response.data;
      }
    } catch (err) {
      error.value = err;
      console.error(`Failed to delete from ${collection} with id ${id}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    insertDoc,
    updateDoc,
    deleteDoc,
    loading,
    error
  };
};
