<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]"></div>

    <div class="relative w-full max-w-lg z-10">
      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12">
        
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 mb-6">
            <User class="text-white w-10 h-10" />
          </div>
          <h2 class="text-3xl font-bold text-white tracking-tight mb-2">Create User</h2>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300 ml-1">Username <span class="text-blue-400">*</span></label>
            <input 
              type="text" 
              v-model="username"
              placeholder="Minimum 3 characters"
              class="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-slate-500 transition-all focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300 ml-1">Password <span class="text-blue-400">*</span></label>
            <input 
              type="password" 
              v-model="password"
              placeholder="Minimum 8 characters"
              class="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-white placeholder-slate-500 transition-all focus:bg-white/10 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300 ml-1">Assign Role <span class="text-blue-400">*</span></label>
            <Dropdown 
              v-model="mainRole" 
              :options="roleOptions" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Select a role" 
              class="w-full bg-white/5 border border-white/10 rounded-2xl text-slate-200"
              :pt="{
                root: { class: 'bg-white/5 border-white/10 rounded-2xl' },
                input: { class: 'text-slate-200 p-3.5' },
                trigger: { class: 'text-slate-400 pr-4' },
                panel: { class: 'bg-slate-900 border-white/10 text-slate-200' },
                item: { class: 'hover:bg-white/10 text-slate-300' }
              }"
            />
          </div>
   

          <div class="pt-4">
            <button 
              type="submit"
              :disabled="isPending || !isFormValid"
              class="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl font-bold text-white shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98] transition-all disabled:opacity-50"
            >   
            Submit        
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { User } from 'lucide-vue-next';
import Dropdown from 'primevue/dropdown';
import { useBranchStore } from '@/store/branchStore';
import API_CONFIGS from '@/api/config';
import { decodeJwt } from '@/composable/jwt';
import { fetchTimestamp } from "@/composable/timestamp";

export default {
  name: 'SuperAdminView',
  components: { User, Dropdown },
  setup() {
    const router = useRouter();
    const branchStore = useBranchStore();

    const username = ref('');
    const password = ref('');
    const mainRole = ref('Super Admin');
    const isPending = ref(false);

    const roleOptions = [
      { label: 'Super Admin', value: 'Super Admin' },
      { label: 'Admin', value: 'Admin' },
      { label: 'User', value: 'User' }
    ];

    const isFormValid = computed(() => {
      return username.value.trim().length >= 3 && 
             password.value.length >= 8 && 
             mainRole.value;
    });


    const handleSubmit = async () => {
  try {
    isPending.value = true;

    const timestamp = await fetchTimestamp();

    const requestBody = {
      username: username.value,
      password: password.value,
      mainRole: mainRole.value,
      status: true,
      createdAt: timestamp,
      branchId: [],
      permission: {}
    };

    const createRes = await axios.post(
      `${API_CONFIGS.BASE_URL}/api/insertDoc/User`,
      { fields: requestBody }
    );

    if (createRes.data) {

      const loginRes = await axios.post(
        `${API_CONFIGS.BASE_URL}/api/login`,
        {
          username: username.value,
          password: password.value
        }
      );

      const token = loginRes.data.token;

      if (token) {
        const decoded = await decodeJwt(token);

        branchStore.setUserId(decoded.userId);
        branchStore.setUserRole(mainRole.value);
        localStorage.setItem("token", token);
      }

      router.push("/");

    }

  } catch (error) {
    console.error(error);
  } finally {
    isPending.value = false;
  }
};

    return {
      username, password, mainRole, roleOptions,
       isPending, isFormValid, handleSubmit
    };
  }
};
</script>