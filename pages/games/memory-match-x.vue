<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 class="text-3xl font-bold mb-6">Stress Relief: Picture Matching Game</h1>
      <!-- Game Grid -->
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(card, index) in shuffledCards"
          :key="index"
          @click="flipCard(index)"
          :class="[
            'w-24 h-32 bg-blue-200 rounded-lg shadow-md flex items-center justify-center cursor-pointer',
            card.flipped ? 'animate-flip' : '',
            attemptStatus === 'wrong' && flippedCards.includes(index) ? 'animate-shake' : '',
            attemptStatus === 'correct' && flippedCards.includes(index) ? 'border-4 border-green-500' : ''
          ]"
        >
          <!-- Placeholder for Hidden Cards -->
          <div
            v-if="!card.flipped && !card.matched"
            class="w-full h-full flex items-center justify-center bg-gray-300 rounded-lg"
          >
            <p class="text-gray-600 text-sm font-semibold">Card</p>
          </div>
          <!-- Display Image for Flipped or Matched Cards -->
          <img
            v-if="card.flipped || card.matched"
            :src="card.src"
            class="w-full h-full object-cover rounded-lg"
            style="max-width: 100%; max-height: 100%;"
          />
        </div>
      </div>
      <!-- Attempts Counter -->
      <p class="mt-4 text-lg font-semibold">Attempts: {{ attempts }}</p>
      <!-- Game Over Message -->
      <p v-if="isGameOver" class="text-green-600 font-bold mt-6">Congratulations! You matched all pictures!</p>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue';
  
  const imagePaths = [
    '/images/pic1.png',
    '/images/pic2.png',
    '/images/pic3.png',
    '/images/pic4.png',
    '/images/pic5.png',
    '/images/pic6.png',
    '/images/pic7.png',
    '/images/pic8.png',
  ];
  const images = [...imagePaths, ...imagePaths]; // Duplicating for matching
  const shuffledCards = reactive(
    images
      .map((src) => ({ src, flipped: false, matched: false }))
      .sort(() => 0.5 - Math.random())
  );
  
  const attempts = ref(0);
  const flippedCards = ref([]);
  const isGameOver = ref(false);
  const attemptStatus = ref(null); // 'correct', 'wrong', or null
  
  const flipCard = (index) => {
    if (flippedCards.value.length === 2 || shuffledCards[index].flipped) return;
  
    shuffledCards[index].flipped = true;
    flippedCards.value.push(index);
  
    if (flippedCards.value.length === 2) {
      attempts.value++;
      setTimeout(() => {
        const [first, second] = flippedCards.value;
        if (shuffledCards[first].src === shuffledCards[second].src) {
          attemptStatus.value = 'correct';
          shuffledCards[first].matched = true;
          shuffledCards[second].matched = true;
        } else {
          attemptStatus.value = 'wrong';
          shuffledCards[first].flipped = false;
          shuffledCards[second].flipped = false;
        }
  
        setTimeout(() => {
          flippedCards.value = [];
          attemptStatus.value = null;
          checkGameOver();
        }, 1000); // Reset after showing animation
      }, 1000);
    }
  };
  
  const checkGameOver = () => {
    isGameOver.value = shuffledCards.every((card) => card.matched);
  };
  </script>
  
  <style scoped>
  /* Flip Animation */
  @keyframes flip {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(180deg);
    }
  }
  .animate-flip {
    animation: flip 0.6s ease-in-out forwards;
  }
  
  /* Shake Animation for Wrong Attempt */
  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-5px);
    }
    50% {
      transform: translateX(5px);
    }
    75% {
      transform: translateX(-5px);
    }
  }
  .animate-shake {
    animation: shake 0.4s ease-in-out;
  }
  </style>
  