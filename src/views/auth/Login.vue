<template>
  <div class="relative min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden px-4">

    <!-- Animated Gradient Blobs -->
    <div class="absolute -top-40 -left-40 w-[400px] h-[400px] bg-lime-500/20 blur-[140px] rounded-full animate-blob"></div>
    <div class="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-cyan-500/20 blur-[140px] rounded-full animate-blob animation-delay-2000"></div>

    <!-- Login Card -->
    <div class="relative w-full max-w-md">
      <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-lime-400/30 via-transparent to-cyan-400/30 blur-xl"></div>

      <div class="relative rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(132,204,22,0.15)]">

        <!-- Header -->
        <div class="px-8 pt-10 text-center">
          <img src="@/assets/logo.png"
               class="w-20 h-20 mx-auto mb-4 drop-shadow-xl"
               alt="Logo" />
          <h1 class="text-3xl font-extrabold text-white">Sign In</h1>
          <p class="text-slate-400 text-sm mt-2">
            Secure access to your account
          </p>
        </div>

        <!-- Form -->
        <form class="px-8 py-10 space-y-6" @submit.prevent="handleLogin">

          <!-- Username -->
          <div class="relative">
            <UserIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="usernameOrEmail"
              type="text"
              placeholder="Username or Email"
              class="input-field"
              required
            />
          </div>

          <!-- Password -->
          <div class="relative">
            <LockIcon class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="input-field pr-12"
              required
            />
            <button type="button"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    @click="showPassword = !showPassword">
              <EyeIcon v-if="showPassword" />
              <EyeOffIcon v-else />
            </button>
          </div>

          <!-- Error -->
          <Transition name="fade">
            <p v-if="errorMessage"
               class="text-red-400 text-xs bg-red-400/10 p-3 rounded-xl">
              {{ errorMessage }}
            </p>
          </Transition>

          <!-- Button -->
          <button
            :disabled="isPending"
            class="w-full py-4 rounded-2xl font-bold tracking-wide uppercase
                   bg-gradient-to-r from-lime-500 to-cyan-500
                   hover:shadow-[0_0_30px_rgba(132,204,22,0.6)]
                   transition-all duration-300 active:scale-95">

            <span v-if="!isPending">Sign In</span>
            <span v-else class="flex justify-center">
              <span class="loader"></span>
            </span>
          </button>

        </form>

        <!-- Footer -->
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
import { ref } from 'vue'
import { UserIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-vue-next'

const usernameOrEmail = ref('')
const password = ref('')
const showPassword = ref(false)
const isPending = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  isPending.value = true
  errorMessage.value = ''

  await new Promise(resolve => setTimeout(resolve, 2000))

  // errorMessage.value = 'Invalid credentials'
  isPending.value = false
}
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

/* Loader */
.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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
