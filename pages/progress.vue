<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Learning Progress</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Track your learning journey and improvements</p>
    </div>

    <!-- Progress Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <BaseCard v-for="stat in progressStats" :key="stat.title" padding="normal">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ stat.title }}</p>
            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ stat.value }}</p>
          </div>
          <div :class="['p-3 rounded-lg', stat.bgColor]">
            <component 
              :is="stat.icon" 
              class="w-6 h-6"
              :class="stat.iconColor"
            />
          </div>
        </div>
      </BaseCard>
    </div>



    <!-- Recent Activities -->
    <BaseCard title="Recent Activities" padding="normal">
      <div class="flow-root">
        <ul role="list" class="-mb-8">
          <li v-for="(activity, activityIdx) in recentActivities" :key="activity.id">
            <div class="relative pb-8">
              <span
                v-if="activityIdx !== recentActivities.length - 1"
                class="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                aria-hidden="true"
              />
              <div class="relative flex items-start space-x-3">
                <div 
                  :class="[
                    'relative flex h-10 w-10 items-center justify-center rounded-full',
                    activity.iconBg
                  ]"
                >
                  <component
                    :is="activity.icon"
                    class="h-5 w-5"
                    :class="activity.iconColor"
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ activity.title }}
                    </p>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {{ activity.description }}
                    </p>
                  </div>
                  <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {{ activity.timestamp }}
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  BookOpenIcon
} from '@heroicons/vue/24/outline'

// Progress Statistics
const progressStats = [
  {
    title: 'Total Study Hours',
    value: '42.5',
    icon: ClockIcon,
    bgColor: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Average Score',
    value: '85%',
    icon: ChartBarIcon,
    bgColor: 'bg-green-100 dark:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Completed Quizzes',
    value: '24',
    icon: AcademicCapIcon,
    bgColor: 'bg-purple-100 dark:bg-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400'
  }
]

// Recent Activities
const recentActivities = [
  {
    id: '1',
    title: 'Completed Physics Quiz',
    description: 'Scored 92% on "Introduction to Mechanics"',
    timestamp: '2 hours ago',
    icon: AcademicCapIcon,
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: '2',
    title: 'Study Session',
    description: 'Studied Mathematics for 2 hours',
    timestamp: '4 hours ago',
    icon: ClockIcon,
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    id: '3',
    title: 'New Achievement',
    description: 'Unlocked "Study Streak: 7 Days"',
    timestamp: 'Yesterday',
    icon: BookOpenIcon,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/50',
    iconColor: 'text-yellow-600 dark:text-yellow-400'
  }
]
</script>