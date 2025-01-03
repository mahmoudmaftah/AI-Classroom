<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const chartData = {
  labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Literature'],
  datasets: [
    {
      label: 'Average Score (%)',
      data: [85, 78, 92, 88, 76],
      backgroundColor: [
        'rgba(59, 130, 246, 0.5)', // blue
        'rgba(16, 185, 129, 0.5)', // green
        'rgba(99, 102, 241, 0.5)', // indigo
        'rgba(239, 68, 68, 0.5)',  // red
        'rgba(245, 158, 11, 0.5)'  // yellow
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(99, 102, 241)',
        'rgb(239, 68, 68)',
        'rgb(245, 158, 11)'
      ],
      borderWidth: 1
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
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