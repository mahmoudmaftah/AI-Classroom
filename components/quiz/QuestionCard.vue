<script setup lang="ts">
// Props and emits
const props = defineProps<{
  question: { question: string; answers: string[]; correctAnswer: string; explanation?: string };
  currentAnswer: string | null;
  showAnswer: boolean;
  reviewMode: boolean;
}>();

const emit = defineEmits(["answer"]);

// Helper function to determine option styles
const getOptionClass = (option: string) => {
  if (props.reviewMode) {
    // Highlight correct and incorrect answers in review mode
    if (option === props.question.correctAnswer) {
      return "border-green-500 bg-green-50 text-green-800 dark:bg-green-900 dark:border-green-700";
    }
    if (option === props.currentAnswer && option !== props.question.correctAnswer) {
      return "border-red-500 bg-red-50 text-red-800 dark:bg-red-900 dark:border-red-700";
    }
    return "bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-300";
  }

  // Default highlight for selected answer
  if (props.currentAnswer === option) {
    return "border-primary-500 bg-primary-50 dark:bg-primary-900 text-primary-800";
  }

  return "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-300";
};
</script>

<template>
  <BaseCard padding="normal">
    <div class="space-y-6">
      <!-- Question Text -->
      <div
        v-if="question?.question"
        class="text-lg font-medium text-gray-900 dark:text-white"
      >
        {{ question.question }}
      </div>
      <div v-else class="text-red-500 dark:text-red-400">
        Invalid question data.
      </div>

      <!-- Options -->
      <div v-if="question?.answers?.length" class="space-y-3">
        <button
          v-for="(option, index) in question.answers"
          :key="index"
          :disabled="reviewMode"
          :aria-pressed="option === currentAnswer"
          :tabindex="0"
          :class="[ 
            'w-full p-4 text-left border rounded-lg transition-colors', 
            getOptionClass(option), 
            reviewMode ? 'cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          ]"
          @click="!reviewMode && emit('answer', option)"
        >
          <div class="flex items-center space-x-3">
            <span
              class="w-6 h-6 flex items-center justify-center rounded-full border"
              :class="{
                'border-green-500 bg-green-50': reviewMode && option === question.correctAnswer,
                'border-red-500 bg-red-50': reviewMode && option === currentAnswer && option !== question.correctAnswer,
                'border-gray-300 bg-white dark:bg-gray-700': !reviewMode
              }"
            >
              {{ String.fromCharCode(65 + index) }}
            </span>
            <span>{{ option }}</span>
          </div>
        </button>
      </div>
      <div v-else class="text-gray-500 dark:text-gray-400">
        No options available.
      </div>

      <!-- Explanation -->
      <div
        v-if="reviewMode && showAnswer && question?.correctAnswer"
        class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <h4 class="font-medium text-gray-900 dark:text-white mb-2">Explanation</h4>
        <p class="text-gray-600 dark:text-gray-300">
          The correct answer is: <strong>{{ question.correctAnswer }}</strong>
        </p>
        <p v-if="question.explanation" class="mt-2 text-gray-600 dark:text-gray-300">
          {{ question.explanation }}
        </p>
      </div>
    </div>
  </BaseCard>
</template>
