<script setup lang="ts">
import QuestionSuggestions from "@/components/tutor/QuestionSuggestions.vue";
import TutorSidebar from "~/components/tutor/TutorSidebar.vue";
import TutorChat from "~/components/tutor/TutorChat.vue";

// Define the selectedDiscussion state
const selectedDiscussion = ref<{
  id: string | null;
  messages: { 
    id: string; 
    type: "user" | "ai"; 
    content: string; 
    timestamp: Date; 
  }[] | [];
} | null>(null);

// Manage the visibility of the sidebar
const isDiscussionSidebarOpen = ref(true);

// Handle the discussion selection from the sidebar
const handleDiscussionSelect = async (discussion: { id: string }) => {
  try {
    const res = await $fetch<{
      messages: { role: "user" | "model"; parts: { text: string }[] }[];
    }>(`/api/discussions/${discussion.id}`);

    selectedDiscussion.value = {
      id: discussion.id,
      messages: res.messages.map((msg, index) => ({
        id: `${discussion.id}-${index}`,
        type: msg.role === "user" ? "user" : "ai",
        content: msg.parts.map((part) => part.text).join(" "),
        timestamp: new Date(), // Replace this with actual timestamp if available
      })),
    };
  } catch (error) {
    console.error("Failed to fetch discussion messages:", error);
    selectedDiscussion.value = { id: discussion.id, messages: [] };
  }
};

// Handle question suggestions
const handleSuggestionSelect = (question: string) => {
  console.log("Selected question:", question);
};
</script>

<template>
  <div class="relative">
    <!-- Discussion Sidebar -->
    <TutorSidebar @selectDiscussion="handleDiscussionSelect" />

    <!-- Main Content -->
    <div 
      class="transition-[margin] duration-300"
      :class="{ 'lg:ml-80': isDiscussionSidebarOpen }"
    >
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Main Chat Area -->
        <div class="lg:col-span-3">
          <BaseCard padding="none">
            <TutorChat :discussion="selectedDiscussion" />
          </BaseCard>
        </div>

        <!-- Right Sidebar -->
        <div class="space-y-6">
          <!-- Question Suggestions -->
          <QuestionSuggestions @select="handleSuggestionSelect" />

          <!-- Subject Selection -->
          <BaseCard title="Subjects" padding="normal">
            <div class="space-y-2">
              <button
                v-for="subject in ['Mathematics', 'Physics', 'Chemistry', 'Literature']"
                :key="subject"
                class="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span class="text-sm text-gray-900 dark:text-white">{{ subject }}</span>
              </button>
            </div>
          </BaseCard>

          <!-- Study Resources -->
          <BaseCard title="Study Resources" padding="normal">
            <div class="space-y-3">
              <div
                v-for="resource in [
                  'Practice Problems',
                  'Video Tutorials',
                  'Reference Notes',
                  'Formula Sheets'
                ]"
                :key="resource"
                class="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
              >
                <span class="text-sm text-gray-900 dark:text-white">{{ resource }}</span>
                <svg
                  class="w-5 h-5 text-gray-400"
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
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>
