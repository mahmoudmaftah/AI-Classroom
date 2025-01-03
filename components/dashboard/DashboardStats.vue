// components/dashboard/DashboardStats.vue
<script setup lang="ts">
interface StatCard {
  title: string
  value: string | number
  change: number
  icon: any
  trend: 'up' | 'down' | 'neutral'
}

const stats: StatCard[] = [
  {
    title: 'Study Hours',
    value: '24.5',
    change: 12,
    icon: 'ClockIcon',
    trend: 'up'
  },
  {
    title: 'Quiz Score Avg',
    value: '85%',
    change: 8.2,
    icon: 'AcademicCapIcon',
    trend: 'up'
  },
  {
    title: 'Topics Mastered',
    value: '12',
    change: 2,
    icon: 'CheckBadgeIcon',
    trend: 'up'
  },
  {
    title: 'Focus Score',
    value: '92',
    change: -3,
    icon: 'BoltIcon',
    trend: 'down'
  }
]

const getTrendColor = (trend: string) => {
  return {
    'up': 'text-green-500',
    'down': 'text-red-500',
    'neutral': 'text-gray-500'
  }[trend]
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <BaseCard
      v-for="stat in stats"
      :key="stat.title"
      padding="normal"
      hover
      class="transition-all duration-300 hover:scale-105"
    >
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-500 truncate">
            {{ stat.title }}
          </p>
          <div class="flex items-baseline">
            <p class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ stat.value }}
            </p>
            <p 
              :class="[
                'ml-2 text-sm font-medium',
                getTrendColor(stat.trend)
              ]"
            >
              {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
            </p>
          </div>
        </div>
        <div 
          class="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg"
        >
          <component
            :is="stat.icon"
            class="w-6 h-6 text-primary-600 dark:text-primary-400"
          />
        </div>
      </div>
    </BaseCard>
  </div>
</template>
