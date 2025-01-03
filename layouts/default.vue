<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    <AppSidebar />
    
    <!-- Update main tag -->
    <main :class="[
      'pt-16 transition-[padding] duration-300 ease-in-out',
      { 'lg:pl-64': isOpen }
    ]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppSidebar from '~/components/layout/AppSidebar.vue'
import AppFooter from '~/components/layout/AppFooter.vue'

const { isOpen } = useSidebar()
</script>