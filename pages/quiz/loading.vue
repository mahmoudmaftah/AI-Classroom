<template>
  <div class="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center overflow-hidden">
    <!-- Background Animation -->
    <div class="absolute inset-0 overflow-hidden">
      <div v-if="loading" class="absolute inset-0 opacity-20">
        <div class="absolute top-0 -left-4 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 max-w-2xl w-full mx-4">
      <!-- Loading State -->
      <div v-if="loading" class="text-center space-y-8">
        <div class="flex flex-col items-center">
          <div class="w-24 h-24 relative">
            <div class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div class="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
            <div class="absolute inset-2 rounded-full border-4 border-purple-500 border-b-transparent animate-spin animation-delay-150"></div>
            <div class="absolute inset-4 rounded-full border-4 border-pink-500 border-l-transparent animate-spin animation-delay-300"></div>
          </div>
          
          <h1 class="mt-8 text-4xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Generating Your Quiz
          </h1>
          <p class="mt-4 text-gray-600 dark:text-gray-300 text-lg animate-pulse">
            Crafting the perfect questions for you...
          </p>
        </div>

        <!-- Progress Steps -->
        <div class="grid grid-cols-3 gap-4 max-w-md mx-auto mt-8">
          <div v-for="(step, index) in loadingSteps" :key="index"
            class="flex flex-col items-center space-y-2"
          >
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="currentStep >= index ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'"
            >
              {{ index + 1 }}
            </div>
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ step }}</span>
          </div>
        </div>
      </div>

      <!-- Quiz Ready State -->
      <div v-else-if="quiz" 
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-500 ease-out"
      >
        <div class="text-center space-y-6">
          <div class="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Quiz Ready!</h2>
            <p class="mt-2 text-gray-600 dark:text-gray-300">Your personalized quiz has been generated.</p>
          </div>

          <div class="flex justify-center space-x-4">
            <BaseButton variant="outline" @click="saveForLater" class="group">
              <span>Save for Later</span>
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </BaseButton>
            <BaseButton @click="takeQuizNow" class="group">
              <span>Take Quiz Now</span>
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div class="text-center space-y-4">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-red-600 dark:text-red-400">Error</h2>
          <p class="text-gray-600 dark:text-gray-300">{{ error }}</p>
          <BaseButton variant="outline" @click="router.push('/quiz')">
            Return to Quiz Center
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  
  const subject = ref("");
  const description = ref("");
  const difficulty = ref("easy");
  const time = ref("");
  const numQuestions = ref("");
  const notions = ref("");
  const quiz = ref(null);
  const error = ref(null);
  const loading = ref(true); // Set loading state initially
  const route = useRoute();
  const router = useRouter();
  
  onMounted(async () => {
    try {
      // Extract parameters from route query
      const params = route.query;
      subject.value = params.subject || "";
      description.value = params.description || "";
      difficulty.value = params.difficulty || "easy";
      time.value = params.time || "";
      numQuestions.value = params.numQuestions || "";
      notions.value = params.notions || "";
  
      // Prepare the notions as an array
      const notionsArray = notions.value.split(",").map((n) => n.trim());
  
      // Call the API
      const res = await $fetch("/api/quiz-generator", {
        method: "POST",
        body: {
          subject: subject.value,
          description: description.value,
          difficulty: difficulty.value,
          time: parseInt(time.value), // Ensure time is a number
          numQuestions: parseInt(numQuestions.value), // Ensure numQuestions is a number
          notions: notionsArray,
        },
      });
  
      if (res.error) {
        throw new Error(res.error); // Handle API error
      }
  
      quiz.value = res; // Store the generated quiz
    } catch (err) {
      error.value = err.message || "An unexpected error occurred.";
    } finally {
      loading.value = false; // Stop loading after the API call
    }
  });
  
  // Save for later
  const saveForLater = () => {
    router.push("/quiz"); // Redirect back to quizzes page
  };
  
  // Take the quiz now
  const takeQuizNow = () => {
    if (quiz.value.quiz.id) {
      router.push(`/quiz/${quiz.value.quiz.id}`);
    } else {
      error.value = "Unable to proceed. Quiz ID is missing.";
    }
  };

  // Add these for the loading animation
const loadingSteps = ['Analyzing Content', 'Generating Questions', 'Finalizing Quiz']
const currentStep = ref(0)

// Simulate progress steps
onMounted(() => {
  if (loading.value) {
    const stepInterval = setInterval(() => {
      if (currentStep.value < 2) {
        currentStep.value++
      } else {
        clearInterval(stepInterval)
      }
    }, 2000)
  }
})
</script>
  
<style scoped>
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
  