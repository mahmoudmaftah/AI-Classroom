<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router"; // Import Vue Router

interface FetchResponse {
  success: boolean;
  discussions?: {
    id: string;
    title: string;
    description: string;
    subject: string;
    date: string;
  }[];
  error?: string;
}

interface Discussion {
  id: string;
  title: string;
  date: string;
  preview: string;
  subject: string;
  color: string;
  unread?: boolean;
  pinned?: boolean;
}

interface NewDiscussion {
  id: string;
  title: string;
  description: string;
  subject: string;
  date: string;
  preview: string; // Add preview field
  color: string; // Add color field
  unread?: boolean; // Optional
  pinned?: boolean; // Optional
}

const router = useRouter(); // Use Vue Router
const discussions = ref<Discussion[]>([]);

// Fetch discussions from the API
const fetchDiscussions = async () => {
  try {
    const res = await $fetch<FetchResponse>("/api/load-discussions-history");
    if (res.success && res.discussions) {
      discussions.value = res.discussions.map((discussion: any) => ({
        id: discussion.id,
        title: discussion.title,
        date: discussion.date,
        preview: discussion.description,
        subject: discussion.subject,
        color: "from-blue-500 to-cyan-500", // Example; you can map colors based on subjects
        unread: false, // Example; adjust this logic as needed
        pinned: false, // Example; adjust this logic as needed
      }));
    } else {
      console.error("Failed to load discussions:", res.error);
    }
  } catch (error) {
    console.error("Error fetching discussions:", error);
  }
};

// Format date for grouping
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const formatDate = (date: string) => {
  const parsedDate = new Date(date);
  if (parsedDate.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (parsedDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: today.getFullYear() !== parsedDate.getFullYear() ? "numeric" : undefined,
  });
};

// Group discussions by date
const groupedDiscussions = computed(() => {
  const grouped = new Map<string, Discussion[]>();
  discussions.value.forEach((discussion) => {
    const dateKey = formatDate(discussion.date);
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)?.push(discussion);
  });
  return grouped;
});

// Navigate to the selected discussion
const navigateToDiscussion = (id: string | null) => {
  if (id) {
    router.push({ name: "tutor", query: { id } }); // Navigate to the discussion
  } else {
    router.push({ name: "tutor" }); // Start a new discussion
  }
};

// Fetch discussions on mount
onMounted(() => {
  fetchDiscussions();
});
</script>

<template>
  <div class="fixed left-0 top-16 bottom-0 w-80 bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 z-30">
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <h2 class="text-xl font-semibold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Learning History
        </h2>
      </div>

      <!-- Search Bar -->
      <div class="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
        <div class="relative">
          <input
            type="text"
            placeholder="Search discussions..."
            class="w-full pl-10 pr-4 py-2 rounded-xl border-0 bg-gray-100/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500/50 transition-all duration-300"
          />
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Discussions List -->
      <div class="flex-1 overflow-y-auto">
        <div class="px-2">
          <template v-for="[date, items] in groupedDiscussions" :key="date">
            <!-- Date Header -->
            <div class="sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-3 px-3 text-sm font-medium text-gray-500 dark:text-gray-400 z-10">
              {{ date }}
            </div>

            <!-- Discussion Items -->
            <div class="space-y-2 mb-6">
              <div
                v-for="discussion in items"
                :key="discussion.id"
                class="group relative rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-300 hover:shadow-lg"
                @click="navigateToDiscussion(discussion.id)"
              >
                <!-- Subject Tag -->
                <div class="flex items-center gap-2 mb-2">
                  <div
                    class="text-xs px-2.5 py-1 rounded-full font-medium bg-gradient-to-r text-white"
                    :class="discussion.color"
                  >
                    {{ discussion.subject }}
                  </div>

                  <!-- Indicators -->
                  <div class="flex items-center gap-2 ml-auto">
                    <div
                      v-if="discussion.unread"
                      class="w-2 h-2 rounded-full bg-primary-500 animate-pulse"
                    />
                    <svg
                      v-if="discussion.pinned"
                      class="w-4 h-4 text-primary-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {{ discussion.title }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {{ discussion.preview }}
                </p>

                <!-- Hover Effect Gradient Border -->
                <div
                  class="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style="
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask-composite: exclude;
                    -webkit-mask-composite: xor;
                  "
                />
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- New Discussion Button -->
      <div class="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50">
        <button
          class="w-full py-2.5 px-4 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:ring-2 focus:ring-primary-500/50 flex items-center justify-center space-x-2"
          @click="navigateToDiscussion(null)" 
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>New Discussion</span>
        </button>
      </div>
    </div>
  </div>
</template>
