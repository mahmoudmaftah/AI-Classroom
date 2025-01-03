<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-300 to-blue-400 p-4">
      <h1 class="text-5xl font-extrabold mb-10 text-white animate-pulse">Pokémon Battle Arena</h1>
      
      <!-- If not started, show start UI -->
      <div v-if="!battleStarted" class="transition-all duration-500 ease-in-out flex flex-col items-center space-y-4">
        <p class="text-white text-2xl font-semibold">Welcome to the arena! Click below to start!</p>
        <button @click="startBattle" class="mt-8 px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg">
          Start Battle
        </button>
      </div>
  
      <!-- If battle started, show battlefield -->
      <transition name="fade">
        <div v-if="battleStarted" class="w-full max-w-5xl grid grid-cols-2 gap-8 mb-8 mt-4">
          <!-- Player Side -->
          <div v-if="playerPokemon" class="relative p-6 bg-white rounded-lg shadow-2xl flex flex-col items-center space-y-2 transform hover:scale-105 transition">
            <div class="absolute top-4 right-4 text-sm font-bold uppercase text-gray-700">
              Player
            </div>
            <img :src="playerPokemon.sprites.front_default" alt="Player Pokémon" class="w-48 h-48 mb-4 transition-transform duration-500" :class="{ 'animate-attack': isPlayerAttacking }" />
            <h2 class="text-3xl font-extrabold capitalize text-gray-800">{{ playerPokemon.name }}</h2>
            <p class="text-lg font-semibold text-gray-600 capitalize">Type: {{ playerTypes }}</p>
            <!-- HP Bar -->
            <div class="w-full bg-gray-300 rounded-full h-6 mt-2 relative">
              <div class="bg-green-500 h-6 rounded-full transition-all duration-500" :style="{ width: playerHpBarWidth }"></div>
              <span class="absolute inset-0 flex justify-center items-center text-white font-bold">{{ playerHp }}/100</span>
            </div>
            <p class="text-lg font-semibold text-gray-700">Attack: {{ playerAttackStat }}</p>
            <!-- Possibly show move name if we implement different moves -->
            <div class="text-sm text-gray-500 italic" v-if="playerMoveName">Move: {{ playerMoveName }}</div>
          </div>
  
          <!-- Opponent Side -->
          <div v-if="opponentPokemon" class="relative p-6 bg-white rounded-lg shadow-2xl flex flex-col items-center space-y-2 transform hover:scale-105 transition">
            <div class="absolute top-4 right-4 text-sm font-bold uppercase text-gray-700">
              Opponent
            </div>
            <img :src="opponentPokemon.sprites.front_default" alt="Opponent Pokémon" class="w-48 h-48 mb-4 transition-transform duration-500" :class="{ 'animate-attack': isOpponentAttacking }" />
            <h2 class="text-3xl font-extrabold capitalize text-gray-800">{{ opponentPokemon.name }}</h2>
            <p class="text-lg font-semibold text-gray-600 capitalize">Type: {{ opponentTypes }}</p>
            <!-- HP Bar -->
            <div class="w-full bg-gray-300 rounded-full h-6 mt-2 relative">
              <div class="bg-red-500 h-6 rounded-full transition-all duration-500" :style="{ width: opponentHpBarWidth }"></div>
              <span class="absolute inset-0 flex justify-center items-center text-white font-bold">{{ opponentHp }}/100</span>
            </div>
            <p class="text-lg font-semibold text-gray-700">Attack: {{ opponentAttackStat }}</p>
            <div class="text-sm text-gray-500 italic" v-if="opponentMoveName">Move: {{ opponentMoveName }}</div>
          </div>
        </div>
      </transition>
  
      <!-- Battle Controls -->
      <transition name="fade">
        <div v-if="battleStarted && !battleOver" class="flex space-x-4 mb-6">
          <button @click="playerAttack" class="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg">Attack</button>
          <button @click="healPlayer" class="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg">Heal</button>
        </div>
      </transition>
      
      <!-- Messages -->
      <transition name="fade">
        <p v-if="message" class="mt-4 text-2xl font-bold text-yellow-100 bg-black bg-opacity-40 px-4 py-2 rounded-xl shadow-lg">
          {{ message }}
        </p>
      </transition>
  
      <!-- Reset Game -->
      <transition name="fade">
        <button v-if="battleOver" @click="resetGame" class="mt-8 px-8 py-4 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg">
          Reset Game
        </button>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  
  const playerPokemon = ref(null);
  const opponentPokemon = ref(null);
  
  const playerHp = ref(100);
  const opponentHp = ref(100);
  
  const battleStarted = ref(false);
  const battleOver = ref(false);
  const message = ref('');
  
  const isPlayerAttacking = ref(false);
  const isOpponentAttacking = ref(false);
  
  const playerMoveName = ref('');
  const opponentMoveName = ref('');
  
  // Optional: Background music and sound effects
  // const attackSound = new Audio('path/to/attack-sound.mp3');
  // const healSound = new Audio('path/to/heal-sound.mp3');
  // const victorySound = new Audio('path/to/victory-sound.mp3');
  // const defeatSound = new Audio('path/to/defeat-sound.mp3');
  // const bgMusic = new Audio('path/to/background-music.mp3');
  // bgMusic.loop = true;
  
  const fetchPokemon = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return data;
  };
  
  const fetchRandomMoveName = (pokemonData) => {
    // Get a random move from the Pokémon's moveset if available
    const moves = pokemonData.moves;
    if (moves && moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      return randomMove.move.name;
    }
    return 'tackle';
  };
  
  const startBattle = async () => {
    playerPokemon.value = await fetchPokemon(Math.floor(Math.random() * 151) + 1);
    opponentPokemon.value = await fetchPokemon(Math.floor(Math.random() * 151) + 1);
    playerMoveName.value = fetchRandomMoveName(playerPokemon.value);
    opponentMoveName.value = fetchRandomMoveName(opponentPokemon.value);
  
    battleStarted.value = true;
    message.value = "The battle begins!";
    
    // Optional: Play background music
    // bgMusic.play();
  };
  
  const playerAttack = () => {
    if (battleOver.value) return;
  
    isPlayerAttacking.value = true;
    setTimeout(() => {
      isPlayerAttacking.value = false;
    }, 500);
  
    const damage = playerAttackStat.value;
    opponentHp.value -= damage;
    message.value = `${playerPokemon.value.name} used ${playerMoveName.value} and dealt ${damage} damage!`;
  
    // Optional: Play attack sound
    // attackSound.play();
  
    if (opponentHp.value <= 0) {
      opponentHp.value = 0;
      message.value = "You won the battle! 🎉";
      battleOver.value = true;
      // victorySound.play();
      return;
    }
  
    // Opponent retaliates after a short delay
    setTimeout(opponentAttack, 700);
  };
  
  const opponentAttack = () => {
    if (battleOver.value) return;
  
    isOpponentAttacking.value = true;
    setTimeout(() => {
      isOpponentAttacking.value = false;
    }, 500);
  
    const damage = opponentAttackStat.value;
    playerHp.value -= damage;
    message.value = `${opponentPokemon.value.name} used ${opponentMoveName.value} and dealt ${damage} damage!`;
  
    // Optional: Play attack sound
    // attackSound.play();
  
    if (playerHp.value <= 0) {
      playerHp.value = 0;
      message.value = "You lost the battle! 😢";
      battleOver.value = true;
      // defeatSound.play();
    }
  };
  
  const healPlayer = () => {
    if (battleOver.value || playerHp.value >= 100) return;
    const healAmount = Math.floor(Math.random() * 30) + 10;
    playerHp.value = Math.min(playerHp.value + healAmount, 100);
    message.value = `${playerPokemon.value.name} healed for ${healAmount} HP!`;
  
    // Optional: Play heal sound
    // healSound.play();
  
    // Opponent attacks after healing
    setTimeout(opponentAttack, 700);
  };
  
  const resetGame = () => {
    playerHp.value = 100;
    opponentHp.value = 100;
    battleStarted.value = false;
    battleOver.value = false;
    message.value = "";
    playerPokemon.value = null;
    opponentPokemon.value = null;
    playerMoveName.value = '';
    opponentMoveName.value = '';
  
    // Stop music if playing
    // bgMusic.pause();
    // bgMusic.currentTime = 0;
  };
  
  const playerAttackStat = computed(() => playerPokemon.value ? playerPokemon.value.stats[1].base_stat : 0);
  const opponentAttackStat = computed(() => opponentPokemon.value ? opponentPokemon.value.stats[1].base_stat : 0);
  
  const playerHpBarWidth = computed(() => playerHp.value + '%');
  const opponentHpBarWidth = computed(() => opponentHp.value + '%');
  
  const playerTypes = computed(() => {
    if (!playerPokemon.value) return '';
    return playerPokemon.value.types.map(t => t.type.name).join(', ');
  });
  
  const opponentTypes = computed(() => {
    if (!opponentPokemon.value) return '';
    return opponentPokemon.value.types.map(t => t.type.name).join(', ');
  });
  
  </script>
  
  <style scoped>
  .bg-gradient-to-b {
    background: linear-gradient(to bottom, #38bdf8, #3b82f6);
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  
  .animate-attack {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
  
  @keyframes shake {
    10%, 90% { transform: translateX(-1px); }
    20%, 80% { transform: translateX(2px); }
    30%, 50%, 70% { transform: translateX(-4px); }
    40%, 60% { transform: translateX(4px); }
  }
  </style>
  