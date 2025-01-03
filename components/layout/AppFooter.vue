// components/layout/AppFooter.vue
<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About Section -->
        <div class="col-span-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI-Classroom</h3>
          <p class="text-gray-600 dark:text-gray-400">
            Empowering students with AI-driven learning solutions for better academic performance 
            and reduced study stress.
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Quick Links
          </h4>
          <ul class="space-y-2">
            <li v-for="link in ['About', 'Features', 'Pricing', 'Contact']" :key="link">
              <a 
                href="#" 
                class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {{ link }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Connect With Us
          </h4>
          <div class="space-y-2 text-gray-600 dark:text-gray-400">
            <p>support@ai-classroom.com</p>
            <p>+1 (555) 123-4567</p>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p class="text-center text-sm text-gray-500 dark:text-gray-400">
          © {{ currentYear }} AI-Classroom. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>