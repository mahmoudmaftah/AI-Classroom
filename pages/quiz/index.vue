<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Define the structure of a quiz and its questions
interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  questions: Question[];
}

interface QuizForm {
  subject: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  numQuestions: number;
  notions: string[];  // Changed from string to string[]
}

const activeTab = ref('available');
const quizzes = ref<Quiz[]>([]); // Initialize quizzes as an empty array
const showModal = ref(false); // State to toggle modal visibility
const loading = ref(false); // Loading state for generating quiz
const router = useRouter();
const notionInput = ref('')



// Form state
const form = ref({
  subject: '',
  description: '',
  difficulty: 'easy' as const,
  duration: 30,
  numQuestions: 10,
  notions: [] as string[]  // Initialize as empty array
});

// Fetch quizzes from the JSON file
const fetchQuizzes = async () => {
  try {
    const response = await fetch('/api/get-quizzes');
    if (!response.ok) throw new Error('Failed to load quizzes.');
    const result = await response.json();
    quizzes.value = result.quizzes || []; // Ensure quizzes is always an array
  } catch (error) {
    quizzes.value = []; // Handle errors gracefully
  }
};

const addTag = () => {
  const tag = notionInput.value.trim()
  if (tag && !form.value.notions.includes(tag)) {
    form.value.notions.push(tag)
  }
  notionInput.value = ''
}

const removeTag = (tagToRemove: string) => {
  form.value.notions = form.value.notions.filter(tag => tag !== tagToRemove)
}

// Generate quiz function
const generateQuiz = () => {
  router.push({
    path: '/quiz/loading',
    query: {
      subject: form.value.subject,
      description: form.value.description,
      difficulty: form.value.difficulty,
      time: form.value.duration.toString(),
      numQuestions: form.value.numQuestions.toString(),
      notions: form.value.notions.join(','), // Join tags with commas
    },
  });
};

// Fetch quizzes on component mount
onMounted(() => {
  fetchQuizzes();
});

// Open modal for creating a quiz
const handleCreateQuiz = () => {
  showModal.value = true;
};

// Close modal
const handleCancel = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="py-8 space-y-8"> <!-- Changed from space-y-6 to space-y-8 and added py-8 -->
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Quiz Center</h1>
      <BaseButton @click="handleCreateQuiz">Create New Quiz</BaseButton>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in ['available', 'completed', 'my-quizzes']"
          :key="tab"
          :class="[[ 'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
            activeTab === tab
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]]"
          @click="activeTab = tab"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ') }}
        </button>
      </nav>
    </div>

    <!-- Quiz List -->
    <div v-if="quizzes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      <BaseCard
        v-for="quiz in quizzes"
        :key="quiz.id"
        padding="normal"
        hover
        class="cursor-pointer"
        @click="router.push(`/quiz/${quiz.id}`)"
      >
        <div class="space-y-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ quiz.title }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ quiz.subject }}
              </p>
            </div>
            <span
              :class="[ 
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              ]"
            >
              {{ quiz.difficulty }}
            </span>
          </div>

          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {{ quiz.duration }} mins
            </div>
            <div class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {{ quiz.questions.length }} questions
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      No quizzes available. Please create a new quiz.
    </div>

    <!-- Modal -->
    <!-- Modal -->
<div
  v-if="showModal"
  class="fixed inset-0 z-50 overflow-y-auto"
>
  <!-- Overlay -->
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
    @click="handleCancel"
  ></div>

  <!-- Modal Content -->
  <div class="flex min-h-full items-center justify-center p-4 text-center">
    <div 
      class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-lg"
    >
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 v-if="!loading" class="text-xl font-semibold text-gray-900 dark:text-white">
          Create New Quiz
        </h2>
        <h2 v-else class="text-xl font-semibold text-gray-900 dark:text-white text-center">
          Generating Quiz...
        </h2>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="px-6 py-12">
        <div class="flex flex-col items-center space-y-4">
          <div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-gray-600 dark:text-gray-300">Preparing your quiz questions...</p>
        </div>
      </div>

      <!-- Form -->
      <div v-else class="px-6 py-4">
        <form @submit.prevent="generateQuiz" class="space-y-6">
          <!-- Subject -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <input 
              v-model="form.subject" 
              type="text" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-colors" 
              placeholder="Enter subject name"
              required 
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea 
              v-model="form.description" 
              rows="3" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
              placeholder="Describe what this quiz will cover"
              required
            ></textarea>
          </div>

          <!-- Difficulty & Duration Row -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select 
                v-model="form.difficulty"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (mins)
              </label>
              <input 
                v-model="form.duration" 
                type="number" 
                min="1"
                max="180"
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                required 
              />
            </div>
          </div>

          <!-- Questions & Notions Row -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Questions
              </label>
              <input 
                v-model="form.numQuestions" 
                type="number"
                min="5"
                max="50" 
                class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                required 
              />
            </div>
            <div>
  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Notions
  </label>
  <div class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
    <!-- Tags Display -->
    <div class="flex flex-wrap gap-2 mb-2">
      <span 
        v-for="tag in form.notions" 
        :key="tag"
        class="inline-flex items-center px-2 py-1 rounded-md bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm"
      >
        {{ tag }}
        <button 
          type="button"
          @click="removeTag(tag)"
          class="ml-1 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </span>
    </div>
    
    <!-- Input Field - Removed border and modified padding -->
    <input 
      v-model="notionInput"
      type="text"
      class="w-full px-0 py-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
      placeholder="Type and press Enter to add notions"
      @keydown.enter.prevent="addTag"
    />
  </div>
  <!-- Helper text -->
  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
    Press Enter to add multiple notions
  </p>
</div>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
        <button
          type="button"
          class="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          @click="generateQuiz"
        >
          Generate Quiz
        </button>
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<style scoped>
.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
