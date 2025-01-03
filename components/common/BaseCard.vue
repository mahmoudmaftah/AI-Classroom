// components/common/BaseCard.vue
<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  padding?: 'none' | 'small' | 'normal' | 'large'
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'normal',
  hover: false
})

const cardClasses = computed(() => {
  return {
    'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700': true,
    'p-0': props.padding === 'none',
    'p-3': props.padding === 'small',
    'p-6': props.padding === 'normal',
    'p-8': props.padding === 'large',
    'transition-shadow hover:shadow-lg': props.hover
  }
})
</script>

<template>
  <div :class="cardClasses">
    <div v-if="title || subtitle" class="mb-4">
      <h3 v-if="title" class="text-lg font-medium text-gray-900 dark:text-white">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400">
        {{ subtitle }}
      </p>
    </div>
    <slot />
  </div>
</template>