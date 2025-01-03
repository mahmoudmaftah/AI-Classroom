<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">5x5 Puzzle Game</h1>
      <p class="text-lg font-semibold text-gray-700 mb-4">Rearrange the pieces to solve the puzzle!</p>
  
      <!-- Puzzle Grid -->
      <div class="grid grid-cols-5 grid-rows-5 gap-1 border-4 border-blue-500" style="width: 500px; height: 500px;">
        <div
          v-for="(piece, index) in puzzlePieces"
          :key="index"
          :style="{
            backgroundImage: `url(${piece.src})`,
            backgroundPosition: piece.position,
            backgroundSize: '500px 500px',
          }"
          draggable="true"
          @dragstart="dragStart(index)"
          @dragover.prevent
          @drop="drop(index)"
          class="w-full h-full cursor-pointer border-2 border-gray-400"
        ></div>
      </div>
  
      <!-- Game Result -->
      <p v-if="isSolved" class="mt-6 text-2xl font-bold text-green-600">Congratulations! Puzzle Solved! 🎉</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const puzzlePieces = ref([]);
  const dragIndex = ref(null);
  const isSolved = ref(false);
  
  // Set Up the Puzzle Grid
  const loadPuzzle = () => {
    const positions = [];
  
    // Create puzzle positions for 5x5 grid
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        positions.push({
          id: row * 5 + col,
          src: `/images/puzzle/piece-${row}-${col}.jpg`, // Adjust path as needed
          position: `${-col * 100}px ${-row * 100}px`,
        });
      }
    }
  
    // Shuffle pieces
    puzzlePieces.value = [...positions].sort(() => Math.random() - 0.5);
  };
  
  // Drag and Drop Handlers
  const dragStart = (index) => {
    dragIndex.value = index;
  };
  
  const drop = (targetIndex) => {
    if (dragIndex.value !== null && targetIndex !== dragIndex.value) {
      const temp = puzzlePieces.value[targetIndex];
      puzzlePieces.value[targetIndex] = puzzlePieces.value[dragIndex.value];
      puzzlePieces.value[dragIndex.value] = temp;
      dragIndex.value = null;
      checkIfSolved();
    }
  };
  
  // Check Puzzle Completion
  const checkIfSolved = () => {
    isSolved.value = puzzlePieces.value.every((piece, index) => piece.id === index);
  };
  
  // Load puzzle on page load
  onMounted(() => {
    loadPuzzle();
  });
  </script>
  
  <style scoped>
  /* Basic Puzzle Styling */
  .grid {
    display: grid;
  }
  </style>
  