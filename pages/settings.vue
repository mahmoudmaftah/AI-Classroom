<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
      Settings
    </h1>

    <div class="space-y-6">
      <!-- Profile Settings -->
      <BaseCard title="Profile Settings" padding="normal">
        <form @submit.prevent="updateProfile" class="space-y-6">
          <div class="flex items-center space-x-6">
            <div class="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-semibold text-primary-600">
              {{ initials }}
            </div>
            <BaseButton type="button" variant="outline">Change Photo</BaseButton>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="profile.firstName"
              label="First Name"
              required
            />
            <BaseInput
              v-model="profile.lastName"
              label="Last Name"
              required
            />
          </div>

          <BaseInput
            v-model="profile.email"
            label="Email"
            type="email"
            required
          />

          <BaseButton type="submit">Save Changes</BaseButton>
        </form>
      </BaseCard>

      <!-- Preferences -->
      <BaseCard title="Preferences" padding="normal">
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Dark Mode
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Toggle between light and dark theme
              </p>
            </div>
            <button
              @click="toggleDarkMode"
              class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              :class="isDarkMode ? 'bg-primary-600' : 'bg-gray-200'"
            >
              <span
                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                :class="isDarkMode ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              Notification Settings
            </h3>
            <div v-for="notification in notifications" :key="notification.id" class="flex items-center space-x-3">
              <input
                :id="notification.id"
                v-model="notification.enabled"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
              <label :for="notification.id" class="text-sm text-gray-700 dark:text-gray-300">
                {{ notification.label }}
              </label>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Privacy -->
      <BaseCard title="Privacy" padding="normal">
        <div class="space-y-4">
          <div v-for="privacy in privacySettings" :key="privacy.id" class="flex items-center space-x-3">
            <input
              :id="privacy.id"
              v-model="privacy.enabled"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            >
            <label :for="privacy.id" class="text-sm text-gray-700 dark:text-gray-300">
              {{ privacy.label }}
            </label>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const profile = ref({
  firstName: 'Mahmoud',
  lastName: 'Mahmoud',
  email: 'mahmoudmaftah44@gmail.com'
})

const initials = computed(() => {
  return `${profile.value.firstName[0]}${profile.value.lastName[0]}`
})

const isDarkMode = ref(false)

const notifications = ref([
  { id: 'email-notifications', label: 'Email notifications', enabled: true },
  { id: 'study-reminders', label: 'Study reminders', enabled: true },
  { id: 'quiz-updates', label: 'Quiz updates', enabled: true },
  { id: 'progress-reports', label: 'Weekly progress reports', enabled: false }
])

const privacySettings = ref([
  { id: 'public-profile', label: 'Make my profile public', enabled: false },
  { id: 'share-progress', label: 'Share my progress with others', enabled: false },
  { id: 'anonymous-data', label: 'Contribute anonymous data for platform improvement', enabled: true }
])

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
}

const updateProfile = () => {
  // Handle profile update
  console.log('Updating profile:', profile.value)
}
</script>