<template>
    <div class="story-container">
      <button @click="generateStory" class="generate-button">Generate Motivational Story</button>
      <div v-if="story" class="story-content">
        <blockquote class="story-text">{{ story.story }}</blockquote>
        <p class="story-quote">"{{ story.quote }}"</p>
        <div class="story-tags">
          <span v-for="tag in story.tags" :key="tag" class="tag">#{{ tag }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        story: null,
      };
    },
    methods: {
      async generateStory() {
        try {
          const response = await fetch("/api/generate-motivational-story");
          const result = await response.json();
          if (result.success) {
            this.story = result.story;
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
  .story-container {
    text-align: center;
    padding: 2rem;
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
  
  .story-content {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .story-text {
    font-size: 1.25rem;
    font-style: italic;
    margin-bottom: 1rem;
  }
  
  .story-quote {
    font-size: 1rem;
    color: #555;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .story-tags .tag {
    display: inline-block;
    background: #e0e0e0;
    color: #333;
    padding: 0.25rem 0.5rem;
    margin: 0.25rem;
    border-radius: 3px;
    font-size: 0.875rem;
  }
  </style>
  