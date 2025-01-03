<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-300 to-blue-400 relative">
      <h1 class="text-3xl font-bold mb-6 text-white">Stress Relief: Shape Sorter Game</h1>
      <p class="text-lg font-semibold text-white">Score: {{ score }}</p>
  
      <!-- Game Area -->
      <div
        class="relative w-[90vw] h-[80vh] bg-white rounded-lg border-2 border-white overflow-hidden flex items-center justify-center"
      >
        <!-- Drop Zones -->
        <div
          v-for="(zone, index) in dropZones"
          :key="index"
          :style="{ top: zone.y + 'px', left: zone.x + 'px' }"
          class="absolute w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center"
          :class="zone.color"
        ></div>
  
        <!-- Draggable Shapes -->
        <div
          v-for="(shape, index) in shapes"
          :key="index"
          :style="{ top: shape.y + 'px', left: shape.x + 'px', backgroundColor: shape.color }"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragend="dragEnd"
          class="absolute w-16 h-16 rounded-lg cursor-pointer shadow-md"
        ></div>
      </div>
  
      <!-- Game Over -->
      <div
        v-if="gameOver"
        class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-center flex-col"
      >
        <h2 class="text-4xl font-bold">Game Over</h2>
        <p class="text-lg mt-2">Your Score: {{ score }}</p>
        <button
          @click="restartGame"
          class="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  
  const score = ref(0);
  const gameOver = ref(false);
  const shapes = ref([]);
  const dropZones = ref([]);
  const draggedShape = ref(null);
  
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-yellow-400', 'bg-green-400'];
  
  const createGameObjects = () => {
    shapes.value = [];
    dropZones.value = [];
  
    for (let i = 0; i < 4; i++) {
      const shape = {
        id: i,
        color: colors[i],
        x: Math.random() * 600 + 50, // Random position
        y: Math.random() * 300 + 50,
      };
      const dropZone = {
        id: i,
        color: colors[i],
        x: Math.random() * 600 + 50, // Random position
        y: Math.random() * 300 + 50,
      };
      shapes.value.push(shape);
      dropZones.value.push(dropZone);
    }
  };
  
  const dragStart = (index) => {
    draggedShape.value = shapes.value[index];
  };
  
  const dragEnd = (event) => {
    if (!draggedShape.value) return;
  
    const dropZone = dropZones.value.find(
      (zone) =>
        Math.abs(zone.x - draggedShape.value.x) < 40 &&
        Math.abs(zone.y - draggedShape.value.y) < 40 &&
        zone.color === draggedShape.value.color
    );
  
    if (dropZone) {
      score.value += 1;
      draggedShape.value.x = dropZone.x;
      draggedShape.value.y = dropZone.y;
  
      // Remove the matched shape and drop zone
      shapes.value = shapes.value.filter((shape) => shape.id !== draggedShape.value.id);
      dropZones.value = dropZones.value.filter((zone) => zone.id !== dropZone.id);
  
      // Check for Game Over
      if (shapes.value.length === 0) {
        gameOver.value = true;
      }
    }
  
    draggedShape.value = null;
  };
  
  const restartGame = () => {
    score.value = 0;
    gameOver.value = false;
    createGameObjects();
  };
  
  onMounted(() => {
    createGameObjects();
  });
  </script>
  
  <style scoped>
  /* Basic animations for dragging */
  .draggable {
    transition: all 0.2s ease;
  }
  </style>
  