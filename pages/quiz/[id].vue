<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Conditional Rendering for Loading -->
    <div v-if="quiz">
      <!-- Quiz Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ quiz.title }}
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ quiz.subject }} | {{ quiz.difficulty }} | {{ quiz.questions.length }} questions
          </p>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Timer -->
          <div class="text-lg font-medium text-gray-900 dark:text-white">
            {{ formatTime(timeLeft) }}
          </div>
          <!-- Progress -->
          <div class="w-32">
            <div class="text-sm text-gray-500 dark:text-gray-400 text-right mb-1">
              {{ currentQuestionIndex + 1 }}/{{ quiz.questions.length }}
            </div>
            <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary-600"
                :style="{ width: `${(currentQuestionIndex + 1) * 100 / quiz.questions.length}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Quiz Content -->
      <transition name="fade" mode="out-in">
        <div>
          <!-- Conditionally render based on quiz completion -->
          <div v-if="!quizCompleted" key="quiz">
            <QuestionCard
              v-if="currentQuestion"
              :question="currentQuestion"
              :current-answer="currentAnswer"
              :show-answer="reviewMode || showAnswer"
              :review-mode="reviewMode"
              @answer="handleAnswer"
            />
            <div class="mt-6 flex justify-between">
              <BaseButton
                v-if="currentQuestionIndex > 0"
                variant="outline"
                @click="previousQuestion"
              >
                Previous
              </BaseButton>
              <div class="flex-1" />
              <BaseButton
                v-if="currentQuestionIndex < quiz.questions.length - 1"
                @click="nextQuestion"
                :disabled="currentAnswer === null && !reviewMode"
              >
                Next
              </BaseButton>
              <BaseButton
                v-else
                @click="finishQuiz"
                :disabled="currentAnswer === null && !reviewMode"
              >
                Finish Quiz
              </BaseButton>
            </div>
          </div>

          <!-- Results -->
          <div v-else key="results" class="space-y-6">
            <BaseCard title="Quiz Results" padding="normal">
              <div class="text-center">
                <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {{ score }}%
                </div>
                <p class="text-gray-500 dark:text-gray-400">
                  You answered {{ correctAnswers }} out of {{ quiz.questions.length }} questions correctly
                </p>
              </div>
              <div class="mt-8 space-y-4">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Time taken</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ formatTime(quiz.duration * 60 - timeLeft) }}
                  </span>
                </div>
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500 dark:text-gray-400">Average time per question</span>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ formatTime((quiz.duration * 60 - timeLeft) / quiz.questions.length) }}
                  </span>
                </div>
              </div>
            </BaseCard>
            <div class="flex justify-center space-x-4">
              <BaseButton variant="outline" @click="reviewQuiz">
                Review Answers
              </BaseButton>
              <NuxtLink to="/quiz">
                <BaseButton>Try Another Quiz</BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Loading State -->
    <div v-else>
      <p class="text-center text-gray-500">Loading quiz...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import QuestionCard from '@/components/quiz/QuestionCard.vue';

const route = useRoute();
const quizId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;

// Interfaces
interface Question {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  duration: number;
  questions: Question[];
}

// State Variables
const quiz = ref<Quiz | null>(null);
const currentQuestionIndex = ref(0);
const answers = ref<(string | null)[]>([]);
const showAnswer = ref(false);
const quizCompleted = ref(false);
const reviewMode = ref(false); // New state for review mode
const timeLeft = ref(0);
const timerInterval = ref<number | null>(null);

// Fetch Quiz Data
async function fetchQuizData(quizId: string) {
  try {
    // Fetch quizzes using the API route
    const response = await fetch('/api/get-quizzes');
    if (!response.ok) throw new Error('Failed to fetch quizzes');

    // Parse the quizzes data
    const data = await response.json(); // The API response object
    const quizzes: Quiz[] = data.quizzes; // Extract the quizzes array

    // Find the selected quiz by ID
    const selectedQuiz = quizzes.find((q) => q.id === quizId);

    if (selectedQuiz) {
      quiz.value = selectedQuiz;
      timeLeft.value = selectedQuiz.duration * 60; // Convert duration to seconds
      answers.value = Array(selectedQuiz.questions.length).fill(null); // Initialize answers
    } else {
      console.error('Quiz not found for the provided ID.');
    }
  } catch (error) {
    console.error('Error fetching quiz data:', error);
  }
}

// Computed Properties
const currentQuestion = computed(() => {
  if (!quiz.value || currentQuestionIndex.value >= quiz.value.questions.length) {
    return null;
  }
  const questionData = quiz.value.questions[currentQuestionIndex.value];
  return {
    question: questionData.question,
    answers: questionData.answers,
    correctAnswer: questionData.correctAnswer,
  };
});

const currentAnswer = computed({
  get: (): string | null => {
    return answers.value[currentQuestionIndex.value] ?? null;
  },
  set: (value: string | null) => {
    answers.value[currentQuestionIndex.value] = value;
  },
});

const score = computed(() => {
  if (!quiz.value) return 0;
  const correctCount = answers.value.reduce((acc, answer, index) => {
    return acc + (answer === quiz.value?.questions[index].correctAnswer ? 1 : 0);
  }, 0);
  return Math.round((correctCount / quiz.value.questions.length) * 100);
});

const correctAnswers = computed(() => {
  if (!quiz.value) return 0;
  return answers.value.reduce((acc, answer, index) => {
    return acc + (answer === quiz.value?.questions[index].correctAnswer ? 1 : 0);
  }, 0);
});

// Timer
function startTimer() {
  timerInterval.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      finishQuiz();
    }
  }, 1000);
}

// Lifecycle Hooks
onMounted(async () => {
  await fetchQuizData(quizId);
  if (quiz.value) {
    startTimer();
  }
});

onBeforeUnmount(() => {
  if (timerInterval.value) {
    window.clearInterval(timerInterval.value);
  }
});

// Helper Functions
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function reviewQuiz() {
  reviewMode.value = true; // Enable review mode
  quizCompleted.value = false; // Exit quiz completion view
  currentQuestionIndex.value = 0; // Reset to the first question
  showAnswer.value = true; // Always show explanations in review mode
}

function handleAnswer(selectedAnswer: string) {
  if (reviewMode.value) return; // Block answer changes in review mode
  currentAnswer.value = selectedAnswer;
}

function nextQuestion() {
  if (quiz.value && currentQuestionIndex.value < quiz.value.questions.length - 1) {
    currentQuestionIndex.value++;
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}

// function finishQuiz() {
//   if (timerInterval.value) {
//     window.clearInterval(timerInterval.value);
//   }
//   quizCompleted.value = true;
// }

async function finishQuiz() {
  if (timerInterval.value) {
    window.clearInterval(timerInterval.value);
  }
  quizCompleted.value = true;

  const timeTaken = quiz.value.duration * 60 - timeLeft.value;

  // Send quiz results to the server
  try {
    const response = await fetch('/api/update-quiz-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quizId: quizId,
        score: score.value,
        timeTaken,
        totalQuestions: quiz.value.questions.length,
        correctAnswers: correctAnswers.value,
      }),
    });

    if (!response.ok) {
      console.error('Failed to update quiz stats');
    }
  } catch (error) {
    console.error('Error updating quiz stats:', error);
  }
}


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
