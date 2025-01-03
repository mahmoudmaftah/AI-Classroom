<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-100 via-blue-200 to-indigo-300">
      <h1 class="text-4xl font-semibold mb-6 text-gray-800">Calm Breathing Exercise</h1>
      <p class="text-lg text-gray-700 mb-4">Breathe in sync with the expanding and contracting circle.</p>
  
      <!-- Breathing Circle -->
      <div
        class="relative flex items-center justify-center animate-pulse"
        :class="animationClass"
        style="width: 220px; height: 220px;"
      >
        <div
          class="absolute bg-blue-500 rounded-full shadow-lg transition-all duration-[4s] ease-in-out"
          :style="{ width: `${circleSize}px`, height: `${circleSize}px` }"
        ></div>
      </div>
  
      <!-- Breathing Instruction -->
      <p class="mt-6 text-3xl font-semibold text-gray-700">{{ instruction }}</p>
  
      <!-- Timer -->
      <p v-if="showTimer" class="mt-4 text-xl font-semibold text-gray-600">Time Remaining: {{ remainingTime }} seconds</p>
  
      <!-- Start Button -->
      <button
        v-if="!isRunning"
        @click="startExercise"
        class="mt-8 px-8 py-3 bg-green-500 text-white rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 hover:bg-green-600"
      >
        Start Breathing Exercise
      </button>
  
      <!-- Reset Button -->
      <button
        v-else
        @click="resetExercise"
        class="mt-4 px-8 py-3 bg-red-500 text-white rounded-lg shadow-xl transform transition-transform duration-300 hover:scale-105 hover:bg-red-600"
      >
        Reset
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isRunning = ref(false);
  const circleSize = ref(50);
  const instruction = ref('Ready?');
  const remainingTime = ref(30); // Breathing exercise duration in seconds
  const showTimer = ref(false);
  
  let intervalId = null;
  
  // Start the breathing exercise
  const startExercise = () => {
    isRunning.value = true;
    showTimer.value = true;
  
    let expand = true;
    instruction.value = 'Inhale...';
  
    intervalId = setInterval(() => {
      if (expand) {
        circleSize.value = 200; // Expand the circle
        instruction.value = 'Inhale...';
      } else {
        circleSize.value = 50; // Contract the circle
        instruction.value = 'Exhale...';
      }
      expand = !expand;
    }, 4000); // 4 seconds for each inhale and exhale
  
    // Timer for the exercise
    const timerId = setInterval(() => {
      remainingTime.value -= 1;
      if (remainingTime.value === 0) {
        clearInterval(intervalId);
        clearInterval(timerId);
        instruction.value = 'Well Done!';
        isRunning.value = false;
        showTimer.value = false;
      }
    }, 1000);
  };
  
  // Reset the exercise
  const resetExercise = () => {
    isRunning.value = false;
    circleSize.value = 50;
    instruction.value = 'Ready?';
    remainingTime.value = 30;
    clearInterval(intervalId);
  };
  </script>
  
  <style scoped>
  /* Background transition for a smooth calming effect */
  .bg-gradient-to-b {
    animation: gradientBackground 10s ease infinite;
  }
  
  @keyframes gradientBackground {
    0% { background: linear-gradient(to bottom, #A8D8A5, #A4C8F2, #7A92C6); }
    50% { background: linear-gradient(to bottom, #A4C8F2, #A8D8A5, #7A92C6); }
    100% { background: linear-gradient(to bottom, #A8D8A5, #A4C8F2, #7A92C6); }
  }
  
  /* Smooth transitions for circle expansion and contraction */
  .relative {
    animation: pulse 4s infinite ease-in-out;
  }
  
  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
  
  /* Hover effects for buttons */
  button {
    transition: all 0.3s ease-in-out;
  }
  
  button:hover {
    transform: scale(1.05);
  }
  
  /* Timer and Instruction styles */
  p {
    transition: all 0.5s ease;
  }
  
  .mt-6 {
    color: #333;
    font-weight: 600;
  }
  
  .mt-4 {
    font-size: 1.25rem;
  }
  
  </style>
  