<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <BaseCard padding="normal">
      <template #title>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          AI Assistant
        </h1>
      </template>

      <div class="space-y-6">
        <!-- Input Area -->
        <div class="space-y-4">
          <textarea
            v-model="userInput"
            rows="4"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your question or prompt..."
            :disabled="isLoading"
          ></textarea>

          <div class="flex justify-end">
            <BaseButton 
              @click="sendQuery"
              :loading="isLoading"
              :disabled="!userInput.trim() || isLoading"
            >
              {{ isLoading ? 'Processing...' : 'Send Query' }}
            </BaseButton>
          </div>
        </div>

        <!-- Response Area -->
        <div v-if="response || error" class="space-y-4">
          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
            {{ error }}
          </div>

          <div v-if="response" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">Response:</h3>
            <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ response }}</p>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
const userInput = ref<string>('');
const response = ref<string>('');
const error = ref<string>('');
const isLoading = ref<boolean>(false);

const nuxtApp = useNuxtApp();
const queryModel = nuxtApp.$queryHuggingFaceModel;

const sendQuery = async () => {
  if (!userInput.value.trim()) return;

  response.value = '';
  error.value = '';
  isLoading.value = true;

  try {
    response.value = await queryModel(userInput.value);
  } catch (err) {
    error.value = 'An error occurred while querying the model. Please try again later.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>