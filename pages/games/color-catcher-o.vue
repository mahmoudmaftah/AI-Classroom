<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-300 to-purple-400 relative">
      <h1 class="text-3xl font-bold mb-6 text-white">Stress Relief: Color Catcher Game</h1>
      <p class="text-lg font-semibold text-white">Score: {{ score }}</p>
  
      <!-- Bubbles Container -->
      <div
        ref="gameArea"
        class="relative w-[90vw] h-[80vh] bg-white border-2 border-white rounded-lg overflow-hidden"
        @click="handleMiss"
        >

        <!-- Bubbles -->
        <div
        v-for="(bubble, index) in bubbles"
        :key="index"
        :style="{ top: bubble.y + 'px', left: bubble.x + 'px', backgroundColor: bubble.color }"
        class="absolute w-12 h-12 border border-black rounded-full shadow-lg animate-pop cursor-pointer"
        @click.stop="catchBubble(index)"
        ></div>
      </div>
  
      <!-- Game Over Message -->
      <div
        v-if="gameOver"
        class="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white text-center flex-col"
      >
        <h2 class="text-4xl font-bold">Game Over</h2>
        <p class="text-lg mt-2">Your Score: {{ score }}</p>
        <button
          @click="restartGame"
          class="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const score = ref(0);
  const bubbles = ref([]);
  const gameOver = ref(false);
  const gameInterval = ref(null);
  const bubbleTimeouts = [];
  
  const colors = ['#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#F472B6'];
  
  const createBubble = () => {
    const gameArea = document.querySelector('.relative');
    const maxWidth = gameArea.clientWidth - 48; // Subtract bubble size (48px)
    const maxHeight = gameArea.clientHeight - 48;
  
    const bubble = {
      x: Math.random() * maxWidth,
      y: Math.random() * maxHeight,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  
    bubbles.value.push(bubble);
  
    // Remove bubble after 3 seconds
    const timeout = setTimeout(() => {
      const index = bubbles.value.indexOf(bubble);
      if (index !== -1) bubbles.value.splice(index, 1);
    }, 3000);
    bubbleTimeouts.push(timeout);
  };
  
  const startGame = () => {
    score.value = 0;
    bubbles.value = [];
    gameOver.value = false;
  
    gameInterval.value = setInterval(() => {
      createBubble();
  
      if (score.value >= 20 || bubbles.value.length > 10) {
        endGame();
      }
    }, 1000);
  };
  
  const endGame = () => {
    clearInterval(gameInterval.value);
    bubbleTimeouts.forEach(clearTimeout);
    bubbles.value = [];
    gameOver.value = true;
  };
  
  const restartGame = () => {
    startGame();
  };
  
  const catchBubble = (index) => {
    score.value += 1;
    bubbles.value.splice(index, 1);
  };
  
  const handleMiss = () => {
    // Optional: Deduct score if the player misses
  };
  
  onMounted(() => {
    startGame();
  });
  
  onUnmounted(() => {
    clearInterval(gameInterval.value);
    bubbleTimeouts.forEach(clearTimeout);
  });
  </script>
  
  <style scoped>
  /* Bubble Pop Animation */
  @keyframes pop {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  .animate-pop {
    animation: pop 0.3s ease-in-out;
  }
  </style>
  