<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Study Hours',
      data: [4, 3, 5, 4, 6, 3, 4],
      borderColor: '#2563eb',
      backgroundColor: '#2563eb',
      tension: 0.4
    },
    {
      label: 'Focus Score',
      data: [90, 85, 88, 92, 87, 86, 89],
      borderColor: '#16a34a',
      backgroundColor: '#16a34a',
      tension: 0.4
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}
</script>

<template>
  <BaseCard title="Weekly Progress" padding="normal">
    <div class="h-80">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </BaseCard>
</template>