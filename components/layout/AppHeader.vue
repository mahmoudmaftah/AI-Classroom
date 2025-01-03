<script setup lang="ts">
interface MenuItem {
  name: string;
  path: string;
  icon?: string;
}

const colorMode = useColorMode()
const isProfileOpen = ref(false)

const navigationItems = ref<MenuItem[]>([
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Tutor', path: '/tutor' },
  { name: 'Quiz', path: '/quiz' },
  { name: 'Progress', path: '/progress' },
  { name: 'AI Assistant', path: '/huggingface' },
])

const profileItems = ref<MenuItem[]>([
  { name: 'Profile', path: '/profile' },
  { name: 'Settings', path: '/settings' },
  { name: 'Help', path: '/help' },
  { name: 'Sign out', path: '/logout' }
])

const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Navigation -->
        <div class="flex items-center">
          <div class="flex-shrink-0 relative group">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-Classroom
            </h1>
            <div class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></div>
          </div>
          <nav class="hidden md:ml-8 md:flex space-x-1">
            <NuxtLink 
              v-for="item in navigationItems" 
              :key="item.name"
              :to="item.path"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/50 dark:hover:to-purple-900/50 hover:text-primary-600 dark:hover:text-primary-400 relative group"
            >
              {{ item.name }}
              <div class="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary-600 to-purple-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
            </NuxtLink>
          </nav>
        </div>

        <!-- Right Side Controls -->
        <div class="flex items-center space-x-4">
          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 overflow-hidden group transition-all duration-300 hover:ring-2 hover:ring-primary-500/50"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/50 dark:to-purple-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg
              v-if="colorMode.value === 'light'"
              class="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5 relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
          </button>

          <!-- Profile Dropdown -->
          <div class="relative">
            <button
              @click="isProfileOpen = !isProfileOpen"
              class="flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/50 dark:hover:to-purple-900/50"
            >
              <div class="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                <span class="text-sm font-medium">MM</span>
              </div>
              <span class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                USer
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isProfileOpen"
              class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg ring-1 ring-black/5 transform transition-all duration-300 ease-out"
            >
              <div class="py-1">
                <NuxtLink
                  v-for="item in profileItems"
                  :key="item.name"
                  :to="item.path"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 dark:hover:from-primary-900/50 dark:hover:to-purple-900/50 transition-all duration-300"
                >
                  {{ item.name }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>