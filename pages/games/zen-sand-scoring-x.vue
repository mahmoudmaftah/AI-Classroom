<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-8 relative">
  
      <h1 class="text-4xl font-extrabold mb-4 text-gray-800 drop-shadow-md">Draw & Compare</h1>
      <p class="text-lg text-gray-700 mb-6 italic">Try to replicate the faint pattern as accurately as possible!</p>
    
      <!-- Canvas Container -->
      <div
        ref="canvasContainer"
        class="relative bg-white rounded-xl shadow-2xl border-4 border-yellow-600 p-1"
        :style="{ width: canvasSize.width + 'px', height: canvasSize.height + 'px' }"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
      >
        <!-- Reference Image -->
        <img 
          ref="referenceImage" 
          :src="referenceImageSrc"
          class="absolute top-0 left-0 w-full h-full object-contain opacity-20 pointer-events-none"
        />
  
        <!-- User Drawing Canvas -->
        <canvas ref="canvas" class="absolute top-0 left-0"></canvas>
      </div>
    
      <div class="flex space-x-4 mt-8">
        <!-- Clear Button -->
        <button
          @click="clearCanvas"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold focus:outline-none"
        >
          Clear
        </button>
        
        <!-- Score Button -->
        <button
          @click="scoreDrawing"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold focus:outline-none"
        >
          Score My Drawing
        </button>
      </div>
  
      <!-- Scoring Result Modal -->
      <div v-if="showScoreModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white rounded-lg shadow-2xl p-6 w-80 text-center">
          <h2 class="text-2xl font-bold mb-4 text-gray-800">Your Score</h2>
          <p class="text-4xl font-extrabold text-green-600 mb-4">{{ score }}%</p>
          <p class="text-gray-600 mb-6">The closer to 100%, the more accurate your drawing!</p>
          <button
            @click="showScoreModal = false"
            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue';
  
  /**
   * This component allows a user to draw on a canvas and then compares the
   * drawing to a reference image, providing a similarity score.
   */
  
  const canvasSize = ref({ width: 600, height: 400 });
  const isDrawing = ref(false);
  const context = ref(null);
  const referenceImage = ref(null);
  
  // Reference image source (try to replicate a simple shape)
  const referenceImageSrc = ref('/images/black&white/pig.jpeg');
  
  const showScoreModal = ref(false);
  const score = ref(0);
  
  onMounted(() => {
    const canvas = document.querySelector('canvas');
    canvas.width = canvasSize.value.width;
    canvas.height = canvasSize.value.height;
  
    context.value = canvas.getContext('2d');
    context.value.lineWidth = 4;
    context.value.lineCap = 'round';
    context.value.lineJoin = 'round';
    context.value.strokeStyle = '#8B4513'; // Brownish color for strokes
  
    referenceImage.value = document.querySelector('img');
  });
  
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
  
  /**
   * scoreDrawing:
   * 1. Draw the reference image on a hidden canvas.
   * 2. Compare the user's drawing to the reference pixels.
   * 3. Calculate a similarity score and display it.
   */
  const scoreDrawing = async () => {
    const canvas = context.value.canvas;
  
    // Create a hidden canvas to draw the reference image onto
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = canvas.width;
    hiddenCanvas.height = canvas.height;
    const hiddenCtx = hiddenCanvas.getContext('2d');
  
    // Draw the reference image fully visible (no opacity) onto hidden canvas
    await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = referenceImageSrc.value;
      img.onload = () => {
        hiddenCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve();
      };
      img.onerror = () => resolve();
    });
  
    // Get ImageData for both canvases
    const userData = context.value.getImageData(0, 0, canvas.width, canvas.height).data;
    const refData = hiddenCtx.getImageData(0, 0, canvas.width, canvas.height).data;
  
    // Compare pixel-by-pixel
    let matchCount = 0;
    let totalPixels = canvas.width * canvas.height;
    for (let i = 0; i < totalPixels * 4; i += 4) {
      // Compare if both pixels are similar (use a simple threshold)
      const diffR = Math.abs(userData[i] - refData[i]);
      const diffG = Math.abs(userData[i+1] - refData[i+1]);
      const diffB = Math.abs(userData[i+2] - refData[i+2]);
  
      // If pixel is somewhat close, count it
      // Adjust the threshold as needed; here we use 80 as a loose threshold.
      if (diffR < 80 && diffG < 80 && diffB < 80) {
        matchCount++;
      }
    }
  
    // Calculate percentage
    const similarity = ((matchCount / totalPixels) * 100).toFixed(2);
    score.value = similarity;
  
    showScoreModal.value = true;
  };
  </script>
  
  <style scoped>
  /* Add some hover effects and transitions */
  button {
    transition: transform 0.2s;
  }
  
  button:hover {
    transform: translateY(-2px);
  }
  
  /* Modal animations (optional) */
  [ v-cloak ] {
    display: none;
  }
  </style>
  