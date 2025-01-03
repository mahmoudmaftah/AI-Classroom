<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-300 to-blue-100">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Zen Sand Garden</h1>
      <p class="text-lg text-gray-600 mb-4">Drag to create patterns and relax your mind.</p>
  
      <!-- Sand Garden -->
      <div
        ref="canvasContainer"
        class="relative bg-yellow-100 rounded-lg shadow-lg"
        :style="{ width: canvasSize.width + 'px', height: canvasSize.height + 'px' }"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      >
        <canvas ref="canvas" class="absolute"></canvas>
      </div>
  
      <!-- Clear Button -->
      <button
        @click="clearCanvas"
        class="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Clear Sand
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  // Canvas dimensions
  const canvasSize = ref({ width: 600, height: 400 });
  const isDrawing = ref(false);
  const context = ref(null);
  
  const startDrawing = (event) => {
    isDrawing.value = true;
  
    const canvas = context.value.canvas;
    const rect = canvas.getBoundingClientRect();
    context.value.beginPath();
    context.value.moveTo(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  };
  
  const draw = (event) => {
    if (!isDrawing.value) return;
  
    const canvas = context.value.canvas;
    const rect = canvas.getBoundingClientRect();
    context.value.lineTo(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
    context.value.stroke();
  };
  
  const stopDrawing = () => {
    if (!isDrawing.value) return;
  
    context.value.closePath();
    isDrawing.value = false;
  };
  
  const clearCanvas = () => {
    const canvas = context.value.canvas;
    context.value.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  onMounted(() => {
    const canvas = document.querySelector('canvas');
    canvas.width = canvasSize.value.width;
    canvas.height = canvasSize.value.height;
  
    context.value = canvas.getContext('2d');
    context.value.lineWidth = 2;
    context.value.lineCap = 'round';
    context.value.strokeStyle = '#8B4513'; // Sand rake color
  });
  </script>
  
  <style scoped>
  /* Canvas container styling */
  .relative {
    border: 2px solid #d4af37; /* Gold frame for sand garden */
  }
  </style>
  