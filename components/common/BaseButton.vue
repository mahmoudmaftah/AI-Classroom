// components/common/BaseButton.vue
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

const buttonClasses = computed(() => {
  return {
    'inline-flex items-center justify-center rounded-md font-medium transition-colors': true,
    // Size variations
    'px-3 py-1.5 text-sm': props.size === 'sm',
    'px-4 py-2 text-base': props.size === 'md',
    'px-6 py-3 text-lg': props.size === 'lg',
    // Variant variations
    'bg-primary-600 text-white hover:bg-primary-700': props.variant === 'primary',
    'bg-gray-200 text-gray-800 hover:bg-gray-300': props.variant === 'secondary',
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-50': props.variant === 'outline',
    'bg-red-600 text-white hover:bg-red-700': props.variant === 'danger',
    // States
    'opacity-50 cursor-not-allowed': props.disabled,
    'relative cursor-wait': props.loading
  }
})
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <slot />
  </button>
</template>