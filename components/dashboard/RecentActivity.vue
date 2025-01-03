<script setup lang="ts">
interface Activity {
  id: string
  type: 'quiz' | 'study' | 'achievement'
  title: string
  description: string
  timestamp: string
  icon: any
  iconBg: string
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'quiz',
    title: 'Mathematics Quiz Completed',
    description: 'Scored 92% in Calculus fundamentals',
    timestamp: '2 hours ago',
    icon: 'AcademicCapIcon',
    iconBg: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    id: '2',
    type: 'study',
    title: 'Study Session',
    description: 'Completed 2 hours of focused study',
    timestamp: '4 hours ago',
    icon: 'ClockIcon',
    iconBg: 'bg-green-100 dark:bg-green-900'
  },
  {
    id: '3',
    type: 'achievement',
    title: 'New Achievement',
    description: 'Earned "Study Streak" badge',
    timestamp: 'Yesterday',
    icon: 'TrophyIcon',
    iconBg: 'bg-yellow-100 dark:bg-yellow-900'
  }
]
</script>

<template>
  <BaseCard title="Recent Activity" padding="normal">
    <div class="flow-root">
      <ul role="list" class="-mb-8">
        <li v-for="(activity, activityIdx) in activities" :key="activity.id">
          <div class="relative pb-8">
            <span
              v-if="activityIdx !== activities.length - 1"
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
                  class="h-5 w-5 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div class="min-w-0 flex-1">
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ activity.title }}
                  </div>
                  <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    {{ activity.timestamp }}
                  </p>
                </div>
                <div class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>{{ activity.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </BaseCard>
</template>