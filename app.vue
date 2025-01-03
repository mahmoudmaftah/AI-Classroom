<template>
  <NuxtLayout>
    <NuxtLoadingIndicator 
      :height="4" 
      :duration="3000" 
      :throttle="400"
      color="repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)"
    />
    <!-- App Loading State -->
    <div v-if="isLoading" class="fixed inset-0 z-50">
      <!-- Background with animated gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div class="absolute inset-0 opacity-30">
          <div class="absolute top-0 -left-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <!-- Content -->
      <div class="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <!-- Logo Animation -->
        <div class="relative w-32 h-32 mb-8">
          <div class="absolute inset-0 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-xl animate-pulse"></div>
          <div class="absolute inset-1 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AC
            </h1>
          </div>
        </div>

        <!-- Loading Text -->
        <h2 class="text-3xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          AI-Classroom
        </h2>
        
        <!-- Spinner -->
        <div class="w-24 h-24 relative">
          <div class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div class="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
          <div class="absolute inset-2 rounded-full border-4 border-purple-500 border-b-transparent animate-spin animation-delay-150"></div>
          <div class="absolute inset-4 rounded-full border-4 border-pink-500 border-l-transparent animate-spin animation-delay-300"></div>
        </div>

        <!-- Loading Progress -->
        <div class="mt-8 text-center">
          <p class="text-gray-600 dark:text-gray-300 animate-pulse">
            Starting your learning journey...
          </p>
        </div>
      </div>
    </div>

    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const isLoading = ref(true)

// Simulate minimum loading time
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})
</script>

<style>
.animation-delay-150 {
  animation-delay: 150ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}
</style>