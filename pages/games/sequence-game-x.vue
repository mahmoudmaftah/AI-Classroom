<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 class="text-2xl font-bold mb-8">Memory Circle Game</h1>
  
      <!-- Difficulty Selection -->
      <div class="mb-6 flex flex-col items-center">
        <label class="mr-4 font-semibold mb-2">Select Difficulty:</label>
        <select v-model="difficulty" @change="resetGame" class="border p-2 rounded">
          <option value="easy">Easy (2 circles)</option>
          <option value="medium">Medium (4 circles)</option>
          <option value="hard">Hard (8 circles)</option>
        </select>
      </div>
  
      <!-- Circles Grid -->
      <div class="grid gap-4 mb-8"
           :class="{
             'grid-cols-2': circleCount === 2,
             'grid-cols-2 md:grid-cols-4': circleCount === 4, 
             'grid-cols-4 md:grid-cols-4 lg:grid-cols-4 grid-rows-2': circleCount === 8
           }">
        <div
          v-for="(circle, index) in circles"
          :key="index"
          @click="handleCircleClick(index)"
          class="w-16 h-16 rounded-full cursor-pointer transition-transform duration-200 ease-out flex items-center justify-center text-white font-bold"
          :class="circleClass(index)"
        >
          <!-- Optional: Show index for debugging -->
          <!-- <span>{{ index }}</span> -->
        </div>
      </div>
  
      <!-- Status and Controls -->
      <div class="mt-8 flex flex-col items-center">
        <div v-if="gameOver" class="text-red-500 font-bold mb-4">Game Over! Final Score: {{ sequence.length - 1 }}</div>
        <button v-else-if="sequence.length === 0 && !isShowingSequence" @click="startGame" class="bg-blue-600 text-white p-2 rounded shadow hover:bg-blue-700 transition-colors duration-200">
          Start Game
        </button>
        <div v-else-if="!gameOver && !isShowingSequence">Score: {{ sequence.length }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const difficulty = ref('easy')
  const sequence = ref([])
  const userProgress = ref(0)
  const isShowingSequence = ref(false)
  const disableInput = ref(true)
  const highlightedCircle = ref(null)
  const gameOver = ref(false)
  
  // New state variables for animations
  const clickedCircle = ref(null)
  const wrongCircle = ref(null)
  
  const circleCount = computed(() => {
    if (difficulty.value === 'easy') return 2
    if (difficulty.value === 'medium') return 4
    if (difficulty.value === 'hard') return 8
  })
  
  const circles = computed(() => {
    const palette = [
      {base: 'bg-red-500', highlight: 'bg-red-300'},
      {base: 'bg-blue-500', highlight: 'bg-blue-300'},
      {base: 'bg-green-500', highlight: 'bg-green-300'},
      {base: 'bg-yellow-500', highlight: 'bg-yellow-300'},
      {base: 'bg-purple-500', highlight: 'bg-purple-300'},
      {base: 'bg-pink-500', highlight: 'bg-pink-300'},
      {base: 'bg-orange-500', highlight: 'bg-orange-300'},
      {base: 'bg-indigo-500', highlight: 'bg-indigo-300'},
    ]
    return palette.slice(0, circleCount.value)
  })
  
  function resetGame() {
    gameOver.value = false
    sequence.value = []
    userProgress.value = 0
    disableInput.value = true
    highlightedCircle.value = null
    clickedCircle.value = null
    wrongCircle.value = null
  }
  
  function startGame() {
    resetGame()
    newRound()
  }
  
  function newRound() {
    const newIndex = Math.floor(Math.random() * circleCount.value)
    sequence.value.push(newIndex)
    showSequence()
  }
  
  async function showSequence() {
    isShowingSequence.value = true
    disableInput.value = true
    for (let i = 0; i < sequence.value.length; i++) {
      const circleIndex = sequence.value[i]
      highlightedCircle.value = circleIndex
      await wait(600) // time circle stays highlighted
      highlightedCircle.value = null
      await wait(200) // gap before next circle
    }
    isShowingSequence.value = false
    disableInput.value = false
    userProgress.value = 0
  }
  
  function handleCircleClick(index) {
    if (disableInput.value) return
  
    // Show a quick "clicked" animation for both correct and wrong picks
    clickedCircle.value = index
    setTimeout(() => {
      clickedCircle.value = null
    }, 200)
  
    if (sequence.value[userProgress.value] === index) {
      userProgress.value++
      // If reached end of sequence
      if (userProgress.value === sequence.value.length) {
        setTimeout(() => {
          newRound()
        }, 500)
      }
    } else {
      // Wrong answer: show shake animation and red flash
      wrongCircle.value = index
      setTimeout(() => {
        gameOver.value = true
        disableInput.value = true
        wrongCircle.value = null
      }, 500)
    }
  }
  
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  function circleClass(index) {
    const isActive = highlightedCircle.value === index
    const base = circles.value[index].base
    const highlight = circles.value[index].highlight
  
    let classes = [base, 'transition-all', 'scale-100']
  
    // Highlighted circle during sequence show
    if (isActive) {
      classes.push('scale-110', 'ring-4', 'ring-yellow-300', highlight)
    }
  
    // Dim circles when input is disabled (not during sequence to avoid confusion)
    if (disableInput.value && !isShowingSequence.value) {
      classes.push('opacity-50', 'pointer-events-none')
    }
  
    // Correct click feedback
    if (clickedCircle.value === index && !wrongCircle.value) {
      // Add a quick pulse/scale animation to confirm input
      classes.push('animate-ping')
    }
  
    // Wrong answer feedback
    if (wrongCircle.value === index) {
      classes.push('bg-red-700', 'shake')
    }
  
    return classes
  }
  </script>
  
  <style scoped>
  @keyframes shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-4px); }
    40%, 60% { transform: translateX(4px); }
  }
  
  .shake {
    animation: shake 0.5s linear;
  }
  </style>
  