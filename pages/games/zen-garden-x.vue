<template>
    <div class="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 animate-gradient-flow text-gray-800 relative overflow-hidden">
      <header class="p-6 text-center z-10">
        <h1 class="text-4xl font-extrabold text-gray-700 drop-shadow-lg">Zen Garden</h1>
        <p class="text-md text-gray-600 mt-2 italic">Create serene patterns and place stones to relax.</p>
      </header>
  
      <div class="flex flex-1 w-full max-w-6xl mx-auto px-4 py-8 space-x-4 z-10 relative">
        <!-- Tools Sidebar -->
        <div class="w-1/5 p-4 bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg flex flex-col space-y-4 z-20 relative">
          <div class="text-center font-semibold text-gray-700 pb-4 border-b border-gray-200">Tools</div>
          <button
            @click="currentTool = 'rake'"
            class="relative p-3 rounded-md cursor-pointer focus:outline-none transition-colors duration-300 text-left"
            :class="{'bg-blue-100 border border-blue-200': currentTool === 'rake', 'hover:bg-blue-50': currentTool !== 'rake'}"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Rake Tool</span>
            </span>
            <span v-if="currentTool === 'rake'" class="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
          </button>
  
          <button
            @click="currentTool = 'stone'"
            class="relative p-3 rounded-md cursor-pointer focus:outline-none transition-colors duration-300 text-left"
            :class="{'bg-green-100 border border-green-200': currentTool === 'stone', 'hover:bg-green-50': currentTool !== 'stone'}"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M12 20c4.418 0 8-1.343 8-3V5c0-1.657-3.582-3-8-3s-8 1.343-8 3v12c0 1.657 3.582 3 8 3z" />
              </svg>
              <span>Stone Tool</span>
            </span>
            <span v-if="currentTool === 'stone'" class="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
          </button>
  
          <button
            @click="smoothSand"
            class="p-3 rounded-md hover:bg-yellow-50 cursor-pointer focus:outline-none transition-colors duration-300 text-left"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 19h16M4 15h16M4 11h16M4 7h16" />
              </svg>
              <span>Smooth Sand</span>
            </span>
          </button>
  
          <button
            @click="randomizeStones"
            class="p-3 rounded-md hover:bg-pink-50 cursor-pointer focus:outline-none transition-colors duration-300 text-left"
          >
            <span class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M20.88 18.09A10 10 0 1114 4.13" />
              </svg>
              <span>Randomize Stones</span>
            </span>
          </button>
        </div>
  
        <!-- Canvas Area -->
        <div class="flex-1 bg-gray-100 rounded-xl relative overflow-hidden shadow-lg">
          <canvas
            ref="zenCanvas"
            class="w-full h-full"
            @mousedown="startDrawing"
            @mousemove="draw"
            @mouseup="stopDrawing"
            @mouseleave="stopDrawing"
          ></canvas>
  
          <transition-group name="fade" tag="div">
            <div
              v-for="(stone, index) in stones"
              :key="index"
              :style="{ top: stone.y + 'px', left: stone.x + 'px' }"
              class="absolute w-10 h-10 rounded-full bg-gray-400 shadow-inner cursor-move transition-transform duration-300 transform hover:scale-110 hover:shadow-2xl"
              draggable="true"
              @dragstart="onStoneDragStart($event, index)"
              @dragend="onStoneDragEnd($event, index)"
            ></div>
          </transition-group>
  
          <div
            v-if="currentTool === 'stone'"
            :style="{ top: stonePreview.y + 'px', left: stonePreview.x + 'px', display: stonePreview.visible ? 'block' : 'none' }"
            class="pointer-events-none absolute w-10 h-10 rounded-full bg-gray-300 opacity-70 scale-100 transition-transform duration-200 transform"
          ></div>
  
          <div
            class="absolute inset-0"
            @click="placeStone"
            @mousemove="updateStonePreview"
          ></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  /**
   * Purpose: This component simulates a zen garden where you can draw patterns in sand using a rake (canvas line drawing)
   * and place stones as decorative elements. The "Smooth Sand" button resets the canvas to a blank, smooth surface, 
   * allowing you to start fresh.
   */
  
  const currentTool = ref('rake')
  const zenCanvas = ref(null)
  let ctx = null
  
  const isDrawing = ref(false)
  const lastPos = { x: 0, y: 0 }
  
  const stones = ref([
    { x: 100, y: 100 },
    { x: 200, y: 150 },
  ])
  
  const stonePreview = ref({ x: 0, y: 0, visible: false })
  
  let draggedStoneIndex = null
  let initialMouseOffset = { x: 0, y: 0 }
  
  onMounted(() => {
    const canvas = zenCanvas.value
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    ctx = canvas.getContext('2d')
    smoothSand() // Initialize with a smooth sand surface
    window.addEventListener('resize', resizeCanvas)
  })
  
  function resizeCanvas() {
    const canvas = zenCanvas.value
    const savedImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    ctx.putImageData(savedImageData, 0, 0)
  }
  
  function startDrawing(e) {
    if (currentTool.value !== 'rake') return
    isDrawing.value = true
    const { x, y } = getMousePos(e)
    lastPos.x = x
    lastPos.y = y
  }
  
  function draw(e) {
    if (!isDrawing.value || currentTool.value !== 'rake') return
    const { x, y } = getMousePos(e)
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(lastPos.x, lastPos.y)
    ctx.lineTo(x, y)
    ctx.stroke()
    
    lastPos.x = x
    lastPos.y = y
  }
  
  function stopDrawing() {
    if (isDrawing.value) {
      isDrawing.value = false
    }
  }
  
  function getMousePos(e) {
    const rect = zenCanvas.value.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }
  
  function smoothSand() {
    const canvas = zenCanvas.value
    ctx.fillStyle = '#f3f3f3'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  
  function randomizeStones() {
    const canvas = zenCanvas.value
    stones.value = stones.value.map(() => {
      return {
        x: Math.random() * (canvas.width - 40),
        y: Math.random() * (canvas.height - 40)
      }
    })
  }
  
  function placeStone(e) {
    if (currentTool.value !== 'stone') return
    const pos = getMousePos(e)
    stones.value.push({ x: pos.x - 20, y: pos.y - 20 })
  }
  
  function updateStonePreview(e) {
    if (currentTool.value !== 'stone') {
      stonePreview.value.visible = false
      return
    }
    stonePreview.value.visible = true
    const pos = getMousePos(e)
    stonePreview.value.x = pos.x - 20
    stonePreview.value.y = pos.y - 20
  }
  
  function onStoneDragStart(e, index) {
    draggedStoneIndex = index
    const stone = stones.value[index]
    const rect = zenCanvas.value.getBoundingClientRect()
    
    initialMouseOffset.x = e.clientX - (rect.left + stone.x)
    initialMouseOffset.y = e.clientY - (rect.top + stone.y)
  }
  
  function onStoneDragEnd(e, index) {
    if (draggedStoneIndex === null) return
    const rect = zenCanvas.value.getBoundingClientRect()
    stones.value[index].x = e.clientX - rect.left - initialMouseOffset.x
    stones.value[index].y = e.clientY - rect.top - initialMouseOffset.y
    draggedStoneIndex = null
  }
  </script>
  
  <style scoped>
  @keyframes gradient-flow {
    0% {
      background-position: 0% 50%;
    }
    50% { 
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  
  .animate-gradient-flow {
    background-size: 200% 200%;
    animation: gradient-flow 10s ease infinite;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: scale(0.9);
  }
  </style>
  