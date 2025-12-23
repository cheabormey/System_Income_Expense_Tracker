import axios from "axios";
import API_CONFIGS from "@/api/config";
import { ref } from 'vue';

export const getDocument = () => {
  const loading = ref(false);
  const error = ref(null);





  const getDocs = async (collection, params = {}) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await axios.get(`${API_CONFIGS.BASE_URL}/api/getAllDocs/${collection}`, { params });
      return response.data;
    } catch (err) {
      error.value = err;
      console.error(`Failed to fetch docs from ${collection}:`, err);
      throw err;
    } finally {
      loading.value = false;
    }
  };





  const createConditions = (conditions) => {
    return JSON.stringify(conditions);
  };




  
  const createPopulate = (fields) => {
    if (Array.isArray(fields)) {
      return JSON.stringify(fields);
    }
    if (typeof fields === 'string') {
      return JSON.stringify([fields]);
    }
    return JSON.stringify(fields);
  };

  return {
    getDocs,
    createConditions,
    createPopulate,
    loading,
    error
  };
};