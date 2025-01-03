<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <!-- Left Side: Content -->
          <div>
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Learn Smarter with
              <span class="text-primary-600">AI Tutor</span>
            </h1>
            <p class="mt-6 text-xl text-gray-500 dark:text-gray-300">
              Enhance your learning experience with personalized AI tutoring, interactive quizzes, and smart study tools.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <!-- Put the signing component here -->
              <Signin />
            </div>
          </div>

          <!-- Right Side: Stats -->
          <div class="grid grid-cols-2 gap-6">
            <div
              v-for="stat in stats"
              :key="stat.title"
              class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {{ stat.title }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                {{ stat.value }}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Features that Make Learning Easier
          </h2>
          <p class="mt-4 text-lg text-gray-500 dark:text-gray-300">
            Everything you need to excel in your studies
          </p>
        </div>

        <div class="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="relative p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center mb-4">
              <component
                :is="feature.icon"
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ feature.title }}
            </h3>
            <p class="mt-2 text-gray-500 dark:text-gray-400">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Signin from './signin.vue';

const stats = [
  { title: 'Active Students', value: '10K+' },
  { title: 'Questions Answered', value: '250K+' },
  { title: 'Subjects Covered', value: '50+' },
  { title: 'Success Rate', value: '95%' }
];

const features = [
  {
    title: 'AI Tutor',
    description: 'Get instant help with any subject through our advanced AI tutoring system.',
    icon: 'ChatBubbleLeftRightIcon'
  },
  {
    title: 'Interactive Quizzes',
    description: 'Test your knowledge with personalized quizzes that adapt to your learning pace.',
    icon: 'AcademicCapIcon'
  },
  {
    title: 'Progress Tracking',
    description: 'Monitor your improvement with detailed analytics and performance insights.',
    icon: 'ChartBarIcon'
  },
  {
    title: 'Study Tools',
    description: 'Access a suite of productivity tools designed to optimize your study sessions.',
    icon: 'WrenchScrewdriverIcon'
  },
  {
    title: 'Subject Library',
    description: 'Explore a vast collection of educational resources across multiple subjects.',
    icon: 'BookOpenIcon'
  },
  {
    title: 'Study Reminders',
    description: 'Stay on track with smart reminders and study schedule management.',
    icon: 'BellAlertIcon'
  }
];
</script>
