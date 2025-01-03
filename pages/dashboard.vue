<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { ref } from 'vue';
import Chart from 'chart.js/auto';

const loginStreak = ref(0);

const upcomingTasks = ref([
  {
    id: '1',
    title: 'Physics Quiz',
    dueDate: 'Today, 3:00 PM',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Math Assignment Review',
    dueDate: 'Tomorrow, 11:00 AM',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Literature Essay',
    dueDate: 'In 2 days',
    priority: 'low',
  },
]);

const scoresData = ref([]);
const quizzesData = ref([]);
let scoreChartInstance: Chart | null = null;
let quizzesChartInstance: Chart | null = null;

// Fetch stats from the server
async function fetchStats() {
  try {
    const response = await fetch('/api/get-quiz-stats');
    const result = await response.json();

    if (result.success) {
      // Update scoresData and quizzesData
      scoresData.value = result.stats.map((stat) => ({
        date: stat.date,
        totalScore: stat.averageScore,
      }));

      quizzesData.value = result.stats.map((stat) => ({
        date: stat.date,
        quizzesDone: stat.quizzesDone,
      }));
    } else {
      console.error("Failed to fetch quiz stats:", result.error);
    }
  } catch (error) {
    console.error("Error fetching quiz stats:", error);
  }
}

// Render chart utility
const renderChart = (id, type, data, options) => {
  const ctx = document.getElementById(id) as HTMLCanvasElement;
  if (ctx) {
    return new Chart(ctx, {
      type,
      data,
      options,
    });
  }
};

onMounted(async () => {

  try {
    const response = await fetch('/api/get-login-streak');
    const data = await response.json();
    if (data.success) {
      loginStreak.value = data.streak;
    }
  } catch (error) {
    console.error("Error fetching login streak:", error);
  }
  
  await fetchStats(); // Fetch stats from the API

  // Render Total Score Line Chart
  scoreChartInstance = renderChart(
    'scoreChart',
    'line',
    {
      labels: scoresData.value.map((item) => item.date),
      datasets: [
        {
          label: 'Average Score',
          data: scoresData.value.map((item) => item.totalScore),
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          fill: true,
        },
      ],
    },
    { responsive: true, maintainAspectRatio: false }
  );

  // Render Quizzes Done Bar Chart
  quizzesChartInstance = renderChart(
    'quizzesChart',
    'bar',
    {
      labels: quizzesData.value.map((item) => item.date),
      datasets: [
        {
          label: 'Quizzes Done',
          data: quizzesData.value.map((item) => item.quizzesDone),
          backgroundColor: '#10B981',
        },
      ],
    },
    { responsive: true, maintainAspectRatio: false }
  );
});
onBeforeUnmount(() => {
  // Destroy chart instances to prevent memory leaks
  if (scoreChartInstance) scoreChartInstance.destroy();
  if (quizzesChartInstance) quizzesChartInstance.destroy();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, Mahmoud!
        </h1>
        <p class="mt-1 text-gray-500 dark:text-gray-400">
          Here's an overview of your learning progress
        </p>
      </div>
      <BaseButton>Start Studying</BaseButton>
    </div>

    <!-- Stats Cards -->
    <DashboardStats />

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Progress Charts Section -->
      <div class="lg:col-span-2">
        <BaseCard title="Your Progress Over Time" padding="normal">
          <!-- Total Score Line Chart -->
          <div>
            <canvas id="scoreChart" width="400" height="200"></canvas>
          </div>
          <!-- Quizzes Done Bar Chart -->
          <div class="mt-6">
            <canvas id="quizzesChart" width="400" height="200"></canvas>
          </div>
        </BaseCard>
      </div>

      <!-- Upcoming Tasks -->
      <div>
        <BaseCard title="Upcoming Tasks" padding="normal">
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="task in upcomingTasks" :key="task.id" class="py-3">
              <div class="flex justify-between items-center">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ task.title }}
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ task.dueDate }}
                  </p>
                </div>
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    {
                      'bg-red-100 text-red-800': task.priority === 'high',
                      'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                      'bg-green-100 text-green-800': task.priority === 'low',
                    },
                  ]"
                >
                  {{ task.priority }}
                </span>
              </div>
            </li>
          </ul>
        </BaseCard>
      </div>

      <div>
        <p>Your current login streak is:</p>
        <div class="text-3xl font-bold text-green-500">{{ loginStreak }} days</div>
      </div>

      <!-- Recent Activity -->
      <div class="lg:col-span-3">
        <RecentActivity />
      </div>
    </div>
  </div>
</template>
