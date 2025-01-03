<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute } from "vue-router";

interface ApiResponse {
  success: boolean;
  response: string;
  discussionId?: string;
  discussion?: { role: string; parts: { text: string }[] }[];
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  status?: "sending" | "sent" | "error";
}

const route = useRoute();
const messages = ref<Message[]>([
  {
    id: "1",
    type: "ai",
    content: "Hello! I'm your AI tutor. How can I help you with your studies today?",
    status: "sent",
  },
]);

const newMessage = ref("");
const chatContainer = ref<HTMLElement | null>(null);
const discussion = ref<{ role: string; parts: { text: string }[] }[]>([]);
const currentDiscussionId = ref<string | null>(null);

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Function to load an existing discussion
const loadDiscussion = async (id: string) => {
  try {
    const res = (await $fetch(`/api/load-discussion?id=${id}`)) as ApiResponse;
    if (res.success && res.discussion) {
      discussion.value = res.discussion;
      currentDiscussionId.value = id;
      messages.value = res.discussion.map((msg) => ({
        id: Date.now().toString(),
        type: msg.role === "user" ? "user" : "ai",
        content: msg.parts[0]?.text || "",
        status: "sent",
      }));
      scrollToBottom();
    } else {
      throw new Error("Failed to load discussion.");
    }
  } catch (error) {
    console.error("Error loading discussion:", error);
  }
};

// Function to send a message and get AI response
const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const currentPrompt = newMessage.value;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: "user",
    content: currentPrompt,
    status: "sending",
  };

  messages.value.push(userMessage);

  const requestBody = {
    prompt: currentPrompt,
    discussion: discussion.value,
    discussionId: currentDiscussionId.value,
  };

  newMessage.value = "";
  await nextTick();
  scrollToBottom();

  try {
    const res = (await $fetch("/api/generate-content-discussion", {
      method: "POST",
      body: requestBody,
    })) as ApiResponse;

    if (res.success) {
      userMessage.status = "sent";

      const aiMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: res.response,
        status: "sent",
      };

      messages.value.push(aiMessage);

      discussion.value.push(
        { role: "user", parts: [{ text: currentPrompt }] },
        { role: "model", parts: [{ text: res.response }] }
      );

      if (res.discussionId) {
        currentDiscussionId.value = res.discussionId;
      }
    } else {
      throw new Error("Unexpected API response format.");
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    userMessage.status = "error";

    messages.value.push({
      id: Date.now().toString(),
      type: "ai",
      content: "Sorry, something went wrong. Please try again.",
      status: "error",
    });
  }

  await nextTick();
  scrollToBottom();
};

// Watch for query parameter changes and load discussions
watch(
  () => route.query.id,
  async (newId) => {
    if (newId) {
      await loadDiscussion(newId as string);
    } else {
      // Clear state for new discussion
      discussion.value = [];
      messages.value = [
        {
          id: "1",
          type: "ai",
          content: "Hello! I'm your AI tutor. How can I help you with your studies today?",
          status: "sent",
        },
      ];
      currentDiscussionId.value = null;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col h-[calc(100vh-10rem)]">
    <!-- Chat Messages -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[message.type === 'user' ? 'ml-auto bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-800']"
        class="max-w-[80%] rounded-lg p-4"
      >
        <div class="flex items-end space-x-2">
          <div class="flex-1">
            <p
              :class="[message.type === 'user' ? 'text-white' : 'text-gray-900 dark:text-white']"
              class="text-sm"
            >
              {{ message.content }}
            </p>
          </div>
          <!-- Status indicators for user messages -->
          <div v-if="message.type === 'user'" class="flex-shrink-0">
            <svg
              v-if="message.status === 'sending'"
              class="animate-spin h-4 w-4 text-white"
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
            <svg
              v-else-if="message.status === 'sent'"
              class="h-4 w-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
      <form @submit.prevent="sendMessage" class="flex space-x-4">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Ask your question..."
          class="flex-1 rounded-lg border px-4 py-2"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg"
          :disabled="!newMessage.trim()"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>
