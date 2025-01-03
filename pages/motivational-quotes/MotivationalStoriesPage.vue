<template>
  <div class="stories-container">
    <h1>Motivational Stories</h1>

    <!-- Filter Section -->
    <div class="filter-section">
      <p>Select tags to filter:</p>
      <div class="tags-filter">
        <div 
          v-for="tag in tags" 
          :key="tag" 
          class="tag-checkbox"
        >
          <input 
            type="checkbox" 
            :value="tag" 
            v-model="selectedTags" 
            @change="filterStories"
            id="tag-check-{{ tag }}"
          >
          <label :for="'tag-check-' + tag">#{{ tag }}</label>
        </div>
      </div>
      <button @click="clearFilters" v-if="selectedTags.length > 0" class="clear-button">Clear Filters</button>
    </div>

    <!-- Story Grid -->
    <transition-group name="fade" tag="div" class="stories-grid">
      <div 
        v-for="story in filteredStories" 
        :key="story.id" 
        class="story-card" 
        @click="toggleStory(story.id)"
      >
        <h2>{{ story.description }}</h2>
        <p class="story-date">Generated on: {{ new Date(story.createdAt).toLocaleDateString() }}</p>
        <div class="story-tags">
          <span v-for="tag in story.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </div>
    </transition-group>

    <!-- Modal for Story Details -->
    <transition name="modal-fade">
      <div v-if="selectedStory" class="story-modal" @click.self="closeStory">
        <div class="modal-content">
          <h2>{{ selectedStory.description }}</h2>
          <blockquote class="story-text">{{ selectedStory.story }}</blockquote>
          <p class="story-quote">"{{ selectedStory.quote }}"</p>
          <p class="story-date">Generated on: {{ new Date(selectedStory.createdAt).toLocaleDateString() }}</p>
          <div class="story-tags">
            <span v-for="tag in selectedStory.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>
          <button @click="closeStory" class="close-button">Close</button>
        </div>
      </div>
    </transition>

    <!-- Generate New Story Section -->
    <div class="generate-section">
      <button @click="generateStory" class="generate-button">Generate Motivational Story</button>
      <div v-if="generatedStory" class="generated-story">
        <blockquote class="story-text">{{ generatedStory.story }}</blockquote>
        <p class="story-quote">"{{ generatedStory.quote }}"</p>
        <div class="story-tags">
          <span v-for="tag in generatedStory.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stories: [],
      filteredStories: [],
      selectedStory: null,
      tags: [],
      selectedTags: [],
      generatedStory: null,
    };
  },
  async created() {
    try {
      const response = await fetch("/api/fetch-motivational-stories");
      const result = await response.json();
      if (result.success) {
        this.stories = result.stories;
        this.filteredStories = result.stories;
        this.extractTags();
      } else {
        console.warn(result.message || "No stories found.");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    }
  },
  methods: {
    toggleStory(id) {
      this.selectedStory = this.stories.find((story) => story.id === id);
    },
    closeStory() {
      this.selectedStory = null;
    },
    filterStories() {
      if (this.selectedTags.length > 0) {
        this.filteredStories = this.stories.filter((story) => 
          this.selectedTags.every((tag) => story.tags.includes(tag))
        );
      } else {
        this.filteredStories = this.stories;
      }
    },
    clearFilters() {
      this.selectedTags = [];
      this.filteredStories = this.stories;
    },
    extractTags() {
      const tagSet = new Set();
      this.stories.forEach((story) => {
        story.tags.forEach((tag) => tagSet.add(tag));
      });
      this.tags = Array.from(tagSet);
    },
    async generateStory() {
      try {
        const response = await fetch("/api/generate-motivational-story");
        const result = await response.json();
        if (result.success) {
          this.generatedStory = result.story;
        } else {
          console.warn(result.message || "No story generated.");
        }
      } catch (error) {
        console.error("Error generating story:", error);
      }
    },
  },
};
</script>

<style scoped>
/* Reuse styles from both components */
.stories-container {
  padding: 2rem;
  text-align: center;
  font-family: Arial, sans-serif;
  background: #fefefe;
  min-height: 100vh;
}

h1 {
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: #333;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-section p {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1rem;
}

.tag-checkbox {
  margin: 0.5rem;
}

.tag-checkbox input {
  margin-right: 0.5rem;
  transform: scale(1.2);
  cursor: pointer;
}

.tag-checkbox label {
  cursor: pointer;
  font-weight: bold;
}

.clear-button {
  background: #c0392b;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.clear-button:hover {
  background: #e74c3c;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

.story-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  user-select: none;
}

.story-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
}

.story-card:active {
  transform: translateY(-2px) scale(0.98);
}

.story-date {
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 1rem;
}

.story-tags .tag {
  display: inline-block;
  background: #e1f7d5;
  color: #2c3e50;
  padding: 0.3rem 0.6rem;
  margin: 0.25rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: bold;
}

.story-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  text-align: left;
  position: relative;
  animation: slide-down 0.3s ease;
}

@keyframes slide-down {
  0% {
    transform: translateY(-30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-content h2 {
  margin-top: 0;
}

.story-text {
  font-style: italic;
  margin: 1.5rem 0;
  color: #555;
}

.story-quote {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.modal-content button.close-button {
  background: #3498db;
  color: #fff;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

.modal-content button.close-button:hover {
  background: #2980b9;
}

.generate-section {
  margin-top: 2rem;
}

.generate-button {
  background: #4caf50;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

.generated-story {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
