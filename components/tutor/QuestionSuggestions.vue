<script setup lang="ts">
interface Suggestion {
  id: string
  question: string
  subject: string
}

const suggestions: Suggestion[] = [
  {
    id: '1',
    question: "Can you explain Newton's First Law?",
    subject: 'Physics'
  },
  {
    id: '2',
    question: 'How do I solve quadratic equations?',
    subject: 'Mathematics'
  },
  {
    id: '3',
    question: 'What are the main themes in Macbeth?',
    subject: 'Literature'
  }
];

const emit = defineEmits(['select'])
</script>

<template>
  <BaseCard title="Suggested Questions" padding="normal">
    <div class="space-y-2">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        @click="emit('select', suggestion.question)"
        class="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <p class="text-sm font-medium text-gray-900 dark:text-white">
          {{ suggestion.question }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          {{ suggestion.subject }}
        </p>
      </button>
    </div>
  </BaseCard>
</template>