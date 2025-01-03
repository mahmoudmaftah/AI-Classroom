<template>
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-extrabold text-center text-blue-600 mb-10">
          🎮 Explore Our Games!
        </h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="game in games"
            :key="game.name"
            class="bg-white rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
          >
            <NuxtLink :to="game.path" class="block p-6">
              <div class="flex flex-col items-center">
                <div
                  class="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl font-bold"
                >
                  {{ game.icon }}
                </div>
                <h2 class="text-lg font-semibold text-gray-800 text-center mb-2">
                  {{ game.name }}
                </h2>
                <p class="text-sm text-gray-500 text-center">
                  {{ game.description }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        games: [
          {
            name: "Calm Breathing",
            path: "/games/calm-breathing-x",
            description: "Relax and breathe with calming animations.",
            icon: "🧘‍♂️",
          },
          {
            name: "Click Color",
            path: "/games/click-color-x",
            description: "Match colors before time runs out!",
            icon: "🎨",
          },
          {
            name: "Color Catcher",
            path: "/games/color-catcher-o",
            description: "Catch the correct colors for points.",
            icon: "🎯",
          },
          {
            name: "Memory Match",
            path: "/games/memory-match-x",
            description: "Challenge your memory with this matching game.",
            icon: "🧠",
          },
          {
            name: "PokeGame",
            path: "/games/pokegame-x",
            description: "A fun battle with Pokémon cards!",
            icon: "⚡",
          },
          {
            name: "Puzzle",
            path: "/games/puzzle-o",
            description: "Solve exciting puzzles and level up.",
            icon: "🧩",
          },
          {
            name: "Sequence Game",
            path: "/games/sequence-game-x",
            description: "Memorize and repeat the sequence.",
            icon: "🔢",
          },
          {
            name: "Shape Sorter",
            path: "/games/shape-sorter-o",
            description: "Match the shapes to their correct slots.",
            icon: "🔷",
          },
          {
            name: "Zen Garden",
            path: "/games/zen-garden-x",
            description: "Relax and design your perfect Zen garden.",
            icon: "🌱",
          },
          {
            name: "Zen Sand",
            path: "/games/zen-sand-x",
            description: "Shape the sand to create beautiful patterns.",
            icon: "🏖️",
          },
          {
            name: "Zen Sand Scoring",
            path: "/games/zen-sand-scoring-x",
            description: "Compete to score high in Zen sand.",
            icon: "📊",
          },
        ],
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  </style>
  