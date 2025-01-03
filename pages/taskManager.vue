<template>
    <div class="p-4">
        <h1 class="text-2xl font-bold mb-4">Task Manager</h1>

        <!-- Filters Section -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div>
                <label class="block font-medium">Filter by Priority</label>
                <select v-model="filterPriority" class="mt-1 p-2 border border-gray-300 rounded">
                    <option value="">All</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            <div>
                <label class="block font-medium">Filter by Status</label>
                <select v-model="filterStatus" class="mt-1 p-2 border border-gray-300 rounded">
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded self-end"
                @click="getTasks">
                Apply Filters
            </button>
        </div>

        <!-- Buttons: Create Task & Create Task Using AI -->
        <div class="flex gap-4 mb-8">
            <button class="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                @click="showAddTaskModal = true">
                Create Task
            </button>
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
                @click="showAiModal = true">
                Create Task Using AI
            </button>
        </div>

        <!-- Task List -->
        <div v-if="tasks.length > 0" class="space-y-4">
            <div v-for="task in tasks" :key="task._id" class="p-4 border border-gray-200 rounded shadow-sm">
                <div class="flex justify-between items-center">
                    <h2 class="font-bold text-xl">{{ task.title }}</h2>
                    <div class="flex items-center gap-2">
                        <!-- Priority Badge -->
                        <span :class="{
                            'bg-red-100 text-red-800': task.priority === 'High',
                            'bg-yellow-100 text-yellow-800': task.priority === 'Medium',
                            'bg-green-100 text-green-800': task.priority === 'Low'
                        }" class="px-2 py-1 rounded text-sm font-semibold">
                            {{ task.priority }}
                        </span>
                        <!-- Edit Button -->
                        <button class="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded"
                            @click="openEditModal(task)">
                            Edit
                        </button>

                        <!-- Delete Button -->
                        <button class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                            @click="deleteTask(task._id)">
                            Delete
                        </button>
                    </div>
                </div>

                <p class="mt-2 text-gray-700">{{ task.description }}</p>

                <div class="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        Deadline: <strong>{{ formatDate(task.deadline) }}</strong>
                    </p>
                    <p>
                        Created: <strong>{{ formatDate(task.createdAt) }}</strong>
                    </p>
                    <p>
                        Status: <strong>{{ task.status }}</strong>
                    </p>
                    <p>
                        Progress: <strong>{{ task.percentage }}%</strong>
                    </p>
                </div>

                <!-- Simple progress bar -->
                <div class="w-full bg-gray-200 h-2 rounded mt-2">
                    <div class="bg-blue-600 h-2 rounded" :style="{ width: task.percentage + '%' }"></div>
                </div>
            </div>
        </div>
        <div v-else>
            <p>No tasks found.</p>
        </div>

        <!-- Modal: Create Task Manually -->
        <transition name="fade">
            <div v-if="showAddTaskModal"
                class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div class="bg-white p-6 w-full max-w-md rounded shadow-xl">
                    <h2 class="text-xl font-bold mb-4">Create Task</h2>
                    <div class="flex flex-col gap-2">
                        <label>Title</label>
                        <input v-model="newTaskTitle" placeholder="Task title..." class="border p-2 rounded" />
                        <label>Description</label>
                        <textarea v-model="newTaskDescription" placeholder="Task description..."
                            class="border p-2 rounded" rows="2"></textarea>
                        <label>Priority</label>
                        <select v-model="newTaskPriority" class="border p-2 rounded">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        <label>Deadline</label>
                        <input type="date" v-model="newTaskDeadline" class="border p-2 rounded" />
                    </div>
                    <div class="flex justify-end mt-4 gap-2">
                        <button class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            @click="showAddTaskModal = false">
                            Cancel
                        </button>
                        <button class="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
                            @click="createManualTask">
                            Add Task
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Modal: Create Task Using AI -->
        <transition name="fade">
            <div v-if="showAiModal"  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div  class="bg-white p-6 w-full max-w-xl rounded shadow-xl">
                    <h2 class="text-xl font-bold mb-4">AI-Assisted Task Creation</h2>
                    <label class="block mb-1 font-medium">Your Prompt</label>
                    <textarea v-model="userPrompt" placeholder="Describe the tasks you want suggestions for..."
                        class="w-full p-2 border border-gray-300 rounded mb-2" rows="2"></textarea>
                    <button @click="getAiSuggestedTasks"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded">
                        Suggest Tasks
                    </button>

                    <!-- AI Suggestions -->
                    <div  v-if="aiSuggestions.length > 0" class="mt-4 space-y-2 max-h-64 overflow-auto">
                        <div v-for="(suggestion, index) in aiSuggestions" :key="index"
                            class="p-3 border border-gray-200 rounded flex items-start">
                            <input type="checkbox" class="mt-1 mr-2" v-model="suggestion.selected" />
                            <div class="flex flex-col">
                                <strong>{{ suggestion.title }}</strong>
                                <p class="text-gray-700">{{ suggestion.description }}</p>
                                <p class="text-sm">
                                    <span class="font-semibold">Priority:</span>
                                    {{ suggestion.priority }}
                                </p>
                                <p class="text-sm">
                                    <span class="font-semibold">Deadline:</span>
                                    {{ suggestion.deadline }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-4 gap-2">
                        <button class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" @click="showAiModal = false">
                            Close
                        </button>
                        <button v-if="aiSuggestions.length > 0" @click="addSelectedTasks"
                            class="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white">
                            Add Selected Tasks
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Modal: Edit Task -->
        <transition name="fade">
            <div v-if="showEditTaskModal"
                class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div class="bg-white p-6 w-full max-w-md rounded shadow-xl">
                    <h2 class="text-xl font-bold mb-4">Edit Task</h2>
                    <div class="flex flex-col gap-2">
                        <label>Title</label>
                        <input v-model="editTaskData.title" class="border p-2 rounded" />

                        <label>Description</label>
                        <textarea v-model="editTaskData.description" class="border p-2 rounded" rows="2"></textarea>

                        <label>Priority</label>
                        <select v-model="editTaskData.priority" class="border p-2 rounded">
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>

                        <label>Deadline</label>
                        <input type="date" v-model="editTaskData.deadline" class="border p-2 rounded" />

                        <label>Status</label>
                        <select v-model="editTaskData.status" class="border p-2 rounded">
                            <option value="pending">pending</option>
                            <option value="in-progress">in-progress</option>
                            <option value="completed">completed</option>
                        </select>

                        <label>Progress (%)</label>
                        <input type="number" min="0" max="100" v-model="editTaskData.percentage"
                            class="border p-2 rounded" />
                    </div>
                    <div class="flex justify-end mt-4 gap-2">
                        <button class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            @click="showEditTaskModal = false">
                            Cancel
                        </button>
                        <button class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white" @click="updateTask">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useFetch } from "#app"; // Nuxt 3's built-in composable for server calls
import { useAsyncData } from "#app";

const { data: tasksResponse, error } = await useAsyncData("tasks", () =>
  $fetch("/api/tasks", {
    method: "POST",
    body: { action: "GET_TASKS" },
  })
);

const tasks = ref<any[]>(tasksResponse.value?.tasks || []);

// Reactive states for tasks
// const tasks = ref([]);

// Filters
const filterPriority = ref("");
const filterStatus = ref("");

// Modals
const showAddTaskModal = ref(false);
const showAiModal = ref(false);
const showEditTaskModal = ref(false);

// New task form
const newTaskTitle = ref("");
const newTaskDescription = ref("");
const newTaskPriority = ref("Medium");
const newTaskDeadline = ref("");

// AI prompt & suggestions
const userPrompt = ref("");
const aiSuggestions = ref([]);

// Edit task form
const editTaskData = ref({
    googleId: "",
    id: "",
    title: "",
    description: "",
    priority: "",
    deadline: "",
    status: "",
    percentage: 0,
});

// On component mount, retrieve tasks
onMounted(() => {
    getTasks();
    console.log("Component mounted.");
});

/**
 * Fetch tasks from the server with applied filters
 */
async function getTasks() {
    const { data, error } = await useFetch("/api/tasks", {
        method: "POST",
        body: {
            action: "GET_TASKS",
            filters: {
                priority: filterPriority.value,
                status: filterStatus.value,
            },
            immediate: true, // Immediate flag to show loading spinner
        },
    });
    console.log("Data:", data.value);
    console.log("Error:", error.value);
    if (!error.value && data.value?.success) {
        tasks.value = data.value.tasks;
        console.log("Tasks:", tasks.value);
    }
}

/**
 * Creates a new task manually (no AI).
 */
async function createManualTask() {
    // Basic validation
    if (!newTaskTitle.value) {
        alert("Please enter a title.");
        return;
    }

    const { data, error } = await useFetch("/api/tasks", {
        method: "POST",
        body: {
            action: "CREATE_TASK",
            taskData: {
                title: newTaskTitle.value,
                description: newTaskDescription.value,
                priority: newTaskPriority.value,
                deadline: newTaskDeadline.value,
                status: "pending",
            },
        },
    });

    if (!error.value && data.value?.success) {
        // Clear form fields
        newTaskTitle.value = "";
        newTaskDescription.value = "";
        newTaskPriority.value = "Medium";
        newTaskDeadline.value = "";

        // Close modal
        showAddTaskModal.value = false;

        // Refresh tasks
        getTasks();
    }
}

/**
 * Fetch AI-suggested tasks based on user prompt
 */
async function getAiSuggestedTasks() {
    const { data, error } = await useFetch("/api/tasks", {
        method: "POST",
        body: {
            action: "AI_SUGGEST_TASKS",
            userPrompt: userPrompt.value,
        },
    });
    if (!error.value && data.value?.success) {
        // Mark each suggestion as unselected initially
        aiSuggestions.value = data.value.suggestions.map((item: any) => ({
            ...item,
            selected: false,
        }));
    }
}

/**
 * Add all selected AI suggestions
 */
async function addSelectedTasks() {
    // Filter out only the selected tasks
    const selectedTasks = aiSuggestions.value.filter((s) => s.selected);
    if (selectedTasks.length === 0) {
        alert("No tasks selected.");
        return;
    }

    // For each selected suggestion, call the create task endpoint
    for (const suggestion of selectedTasks) {
        await createTaskFromSuggestion(suggestion);
    }

    // Once done, clear suggestions, close modal, refresh tasks
    aiSuggestions.value = [];
    userPrompt.value = "";
    showAiModal.value = false;
    getTasks();
}

/**
 * Create a single task from an AI suggestion
 */
async function createTaskFromSuggestion(suggestion: any) {
    const { error } = await useFetch("/api/tasks", {
        method: "POST",
        body: {
            action: "CREATE_TASK",
            taskData: {
                title: suggestion.title,
                description: suggestion.description,
                priority: suggestion.priority,
                deadline: suggestion.deadline,
                status: "pending",
            },
        },
    });
    if (error.value) {
        console.error("Error creating task from suggestion:", error.value);
    }
}

/**
 * Open the edit modal for a specific task
 */
function openEditModal(task: any) {
    editTaskData.value = {
        googleId: task.googleId,
        id: task._id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        // Convert date to YYYY-MM-DD format if needed
        deadline: task.deadline ? formatDateForInput(task.deadline) : "",
        status: task.status || "pending",
        percentage: task.percentage || 0,
    };
    showEditTaskModal.value = true;
}

/**
 * Update the currently edited task
 */
async function updateTask() {
    if (!editTaskData.value.title) {
        alert("Please enter a title.");
        return;
    }

    const { data, error } = await useFetch("/api/tasks", {
        method: "POST",
        body: {
            action: "UPDATE_TASK",
            taskData: {
                googleId: editTaskData.value.googleId,
                id: editTaskData.value.id,
                title: editTaskData.value.title,
                description: editTaskData.value.description,
                priority: editTaskData.value.priority,
                deadline: editTaskData.value.deadline,
                status: editTaskData.value.status,
                percentage: editTaskData.value.percentage,
            },
        },
    });

    if (!error.value && data.value?.success) {
        showEditTaskModal.value = false;
        getTasks(); // Refresh the list
    }
}

/**
* Delete a task by ID
*/
async function deleteTask(taskId: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    const { data, error } = await useFetch("/api/tasks", {
        method: "POST",
        body: {
            action: "DELETE_TASK",
            taskId,
        },
    });

    if (!error.value && data.value?.success) {
        // After successful deletion, refresh the task list
        getTasks();
    }
}


/**
 * Format date for display (MM/DD/YYYY)
 */
function formatDate(dateString: string) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

/**
 * Format date for input type="date" (YYYY-MM-DD)
 */
function formatDateForInput(dateString: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Return YYYY-MM-DD
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}
</script>

<style scoped>
/* Simple fade transition for modals */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>