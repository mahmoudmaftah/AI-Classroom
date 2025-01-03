// components/layout/AppSidebar.vue
<script setup lang="ts">
const { isOpen, toggleSidebar } = useSidebar()

const menuItems = [
  { name: 'Dashboard', icon: 'HomeIcon', link: '/dashboard' },
  { name: 'Virtual Tutor', icon: 'ChatBubbleLeftIcon', link: '/tutor' },
  { name: 'Quiz Center', icon: 'AcademicCapIcon', link: '/quiz' },
  { name: 'Progress', icon: 'ChartBarIcon', link: '/progress' },
  { name: 'Games', icon: 'ClockIcon', link: '/games' },
  { name: 'Motivational Stories', icon: 'BookOpenIcon', link: '/motivational-quotes/MotivationalStoriesPage' },
  { name: 'Motivational Quotes', icon: 'BookOpenIcon', link: '/motivational-quotes/MotivationalQuotesPage' },
  { name: 'Task Manager', icon: 'CheckCircleIcon', link: '/taskManager' },
  { name: 'Settings', icon: 'Cog6ToothIcon', link: '/settings' }
]
</script>

<template>
  <aside
    :class="[
      'fixed left-0 top-16 bottom-0 w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out z-40',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <div class="h-full flex flex-col">
      <!-- Toggle Button -->
      <button
        @click="toggleSidebar"
        class="absolute -right-3 top-4 bg-white dark:bg-gray-800 rounded-full p-0.5 border border-gray-200 dark:border-gray-700"
      >
        <svg
          :class="['w-5 h-5 transform transition-transform', isOpen ? 'rotate-180' : '']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-4 space-y-1 overflow-y-auto">
        <div
          v-for="item in menuItems"
          :key="item.name"
          class="py-2"
        >
          <NuxtLink
            :to="item.link"
            class="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400"
            />
            {{ item.name }}
          </NuxtLink>
        </div>
      </nav>

      <!-- Bottom Section -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
              <span class="text-sm font-medium">MM</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              Mahmoud Maftah
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              mahmoudmaftah44@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>