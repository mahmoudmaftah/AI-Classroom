<template>
    <div class="flex flex-col min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 text-gray-800 relative overflow-hidden">
      <header class="p-6 text-center">
        <h1 class="text-3xl font-semibold text-indigo-800 drop-shadow">Ripple Pond</h1>
        <p class="text-sm text-gray-600 mt-2">Click anywhere to create gentle, colorful ripples that fade away.</p>
      </header>
  
      <div ref="pond" 
           class="flex-1 relative cursor-pointer overflow-hidden"
           @click="createRipple">
        <transition-group name="ripple" tag="div">
          <div v-for="(ripple, index) in ripples" :key="ripple.id"
               class="absolute rounded-full"
               :style="rippleStyle(ripple)"
               :class="rippleClasses">
          </div>
        </transition-group>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const ripples = ref([])
  
  // A palette of soft pastel colors for variety:
  const colors = [
    '#FFDEE9', '#B5FFFC', '#D5FFD5', '#FFFACD', '#E0BBE4', '#CCE2CB', '#FEE1E8', '#FBE4CD', '#F1E0C5'
  ]
  
  function createRipple(e) {
    const pond = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - pond.left
    const y = e.clientY - pond.top
    const size = Math.max(pond.width, pond.height) * 0.4
    const id = Date.now() + Math.random()
  
    const color = colors[Math.floor(Math.random() * colors.length)]
  
    ripples.value.push({ id, x, y, size, color })
  
    // Remove ripple after animation
    setTimeout(() => {
      ripples.value = ripples.value.filter(r => r.id !== id)
    }, 2500)  // Adjusted to match the transition time
  }
  
  function rippleStyle(ripple) {
    return {
      width: ripple.size + 'px',
      height: ripple.size + 'px',
      top: ripple.y - ripple.size / 2 + 'px',
      left: ripple.x - ripple.size / 2 + 'px',
      background: ripple.color,
      opacity: '1',  // Initial full opacity
      transition: 'transform 2.5s ease-out, opacity 2.5s ease-out'
    }
  }
  
  // Ripple classes (no dynamic classes needed, apply all via here)
  const rippleClasses = 'ripple-base'
  </script>
  
  <style scoped>
  /* Initial states for transitions */
  .ripple-enter-active, .ripple-leave-active {
    transition: all 2.5s ease-out;
  }
  
  .ripple-enter-from {
    transform: scale(0) rotate(0deg);
    opacity: 1;  /* Start with full opacity */
  }
  
  .ripple-enter-to {
    transform: scale(1.5) rotate(15deg);
    opacity: 0;  /* Fade out to transparent */
  }
  
  /* Base ripple styling */
  .ripple-base {
    border-radius: 9999px;
    pointer-events: none;
    position: absolute;
    mix-blend-mode: multiply;
  }
  
  /* Optional: You could add subtle floating shapes in the background */
  ::before, ::after {
    content: "";
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    animation: float 10s ease-in-out infinite alternate;
    z-index: -1;
  }
  
  ::after {
    transform: translate(-50%, -50%) scale(1.5);
    animation-delay: 3s;
  }
  
  @keyframes float {
    0% {
      transform: translate(-50%, -50%) scale(1);
    }
    100% {
      transform: translate(-50%, -48%) scale(1.2);
    }
  }
  </style>
  