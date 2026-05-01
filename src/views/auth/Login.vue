<template>
  <div class="relative min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden px-4">

    <div class="absolute -top-40 -left-40 w-[400px] h-[400px] bg-lime-500/20 blur-[140px] rounded-full animate-blob"></div>
    <div class="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-cyan-500/20 blur-[140px] rounded-full animate-blob animation-delay-2000"></div>

    <div class="relative w-full max-w-md">
      <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-lime-400/30 via-transparent to-cyan-400/30 blur-xl"></div>

      <div class="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(132,204,22,0.15)]">

<!-- TOP LOGIN HEADER -->
<div class="px-8 pt-10 pb-6 text-center relative overflow-hidden">

  <!-- Glow Background -->
  <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-cyan-500/20 blur-[100px] rounded-full"></div>
  <div class="absolute top-16 right-10 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full"></div>
  <div class="absolute top-10 left-10 w-20 h-20 bg-indigo-500/20 blur-3xl rounded-full"></div>

  <!-- Logo Ring -->
  <div class="relative z-10 flex justify-center">
    <div
      class="w-32 h-32 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center p-3 animate-float"
    >
      <img
        src="@/assets/logo.jpeg"
        class="w-full h-full object-cover rounded-2xl shadow-lg"
        alt="Logo"
      />
    </div>
  </div>



  <!-- Title -->
  <h1
    class="relative z-10 mt-5 text-4xl font-black bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent tracking-wide"
  >
    Sign In
  </h1>

  <!-- Subtitle -->
  <p class="relative z-10 text-slate-400 text-sm mt-3 leading-relaxed max-w-[260px] mx-auto">
    Securely login to continue managing your dashboard and business activities.
  </p>
</div>
        <form class="px-8 py-10 space-y-6" @submit.prevent="handleLogin">

          <div class="relative">
            <UserIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="usernameOrEmail"
              type="text"
              placeholder="Username or Email"
              :class="['input-field', fieldErrors.usernameOrEmail ? 'border-red-500/50' : '']"
              required
            />
            <p v-if="fieldErrors.usernameOrEmail" class="text-[10px] text-red-400 mt-1 ml-4">{{ fieldErrors.usernameOrEmail }}</p>
          </div>

          <div class="relative">
            <LockIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              :class="['input-field pr-12', fieldErrors.password ? 'border-red-500/50' : '']"
              required
            />
            <button type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    @click="showPassword = !showPassword">
              <EyeIcon v-if="showPassword" />
              <EyeOffIcon v-else />
            </button>
            <p v-if="fieldErrors.password" class="text-[10px] text-red-400 mt-1 ml-4">{{ fieldErrors.password }}</p>
          </div>

          <Transition name="fade">
            <div v-if="errorMessage"
                 :class="['text-xs p-3 rounded-xl flex items-center gap-2', 
                          isPermissionLogin ? 'bg-amber-400/10 text-amber-400' : 'bg-red-400/10 text-red-400']">
              <span>{{ errorMessage }}</span>
            </div>
          </Transition>

          <button
            :disabled="isPending"
            class="w-full py-4 rounded-2xl font-bold tracking-wide uppercase
                   bg-gradient-to-r from-lime-500 to-cyan-500
                   hover:shadow-[0_0_30px_rgba(132,204,22,0.6)]
                   transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">

            <span v-if="!isPending">Sign In</span>
            <span v-else class="flex justify-center items-center gap-2">
              <Vue3Lottie :animationData="loading" :height="30" :width="30" />
            </span>
          </button>

        </form>

        <div class="pb-8 text-center">
          <a href="#" class="text-xs text-slate-400 hover:text-lime-400">
            Forgot password?
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-vue-next';

// Assets & Config
import API_CONFIGS from '@/api/config';

// Composables & Stores
import { decodeJwt } from '@/composable/jwt';
import { useBranchStore } from '@/store/branchStore';

// State
const usernameOrEmail = ref("");
const password = ref("");
const showPassword = ref(false);
const isPending = ref(false);
const isErrorLogin = ref(false);
const isPermissionLogin = ref(false);
const errorMessage = ref("");
const fieldErrors = reactive({ usernameOrEmail: '', password: '' });

const router = useRouter();
const branchStore = useBranchStore();

watch([usernameOrEmail, password], () => {
  fieldErrors.usernameOrEmail = '';
  fieldErrors.password = '';
  errorMessage.value = '';
  isErrorLogin.value = false;
  isPermissionLogin.value = false;
});

const handleLogin = async () => {
  try {
    isErrorLogin.value = false;
    isPermissionLogin.value = false;
    errorMessage.value = '';
    isPending.value = true;

    const deviceUUID = uuidv4();
    
    const isEmail = usernameOrEmail.value.includes('@');


    const params = {
      dynamicConditions: JSON.stringify([{
        field: isEmail ? 'email' : 'username',
        operator: '==',
        value: usernameOrEmail.value,
      }]),
    };

    const res = await axios.get(`${API_CONFIGS.BASE_URL}/api/getAllDocs/User`, { params });
    const userDoc = res.data.data?.[0];

    if (!userDoc) {
      isPending.value = false;
      isErrorLogin.value = true;
      errorMessage.value = "Invalid credentials!";
      fieldErrors.usernameOrEmail = "User not found.";
      return;
    }

    const isSuperAdmin = userDoc.mainRole === "Super Admin";
    if (!isSuperAdmin && userDoc.status === false) {
      isPermissionLogin.value = true;
      isPending.value = false;
      errorMessage.value = "Your account is inactive. Please contact admin.";
      return;
    }

    let loginBranchId = null;
    if (!isSuperAdmin) {
      const userBranchIds = userDoc.branchId || [];
      if (!userBranchIds.length) {
        isPending.value = false;
        errorMessage.value = "No branch assigned.";
        return;
      }
      
      const branchRes = await axios.get(`${API_CONFIGS.BASE_URL}/api/getAllDocs/Branch`);
      const activeBranch = branchRes.data.data.find(b => userBranchIds.includes(b._id) && b.status === true);

      if (!activeBranch) {
        isPending.value = false;
        errorMessage.value = "Your assigned branch is inactive.";
        return;
      }
      loginBranchId = activeBranch._id;
    }

  
    const loginRes = await axios.post(`${API_CONFIGS.BASE_URL}/api/login`, {
      username: userDoc.username, 
      password: password.value,
    });

    const token = loginRes.data.token;
    const decoded = await decodeJwt(token);
    const userId = decoded.id || userDoc._id;

    branchStore.setUserId(userId);
    branchStore.setUserRole(userDoc.mainRole);

    if (!isSuperAdmin) {
      branchStore.setBranchId(loginBranchId);
      localStorage.setItem("branchId", loginBranchId);
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);


    setTimeout(() => {
      isPending.value = false;
      router.push("/");
    }, 1000);

  } catch (err) {
    console.error("Login Error:", err);
    isPending.value = false;
    isErrorLogin.value = true;

    if (err.response?.status === 401) {
      errorMessage.value = "Invalid Username or password";
      fieldErrors.password = "Please check your credentials.";
    } else {
      errorMessage.value = "Server error. Please try again later.";
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

.input-field {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border-radius: 1.25rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  color: white;
  outline: none;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #84cc16;
  box-shadow: 0 0 0 2px rgba(132,204,22,0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Blob Animation */
@keyframes blob {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(20px,-20px) scale(1.1); }
}

.animate-blob {
  animation: blob 12s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>