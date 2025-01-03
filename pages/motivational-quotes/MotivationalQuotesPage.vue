<template>
    <div class="quotes-container">
      <h1 class="page-title">Motivational Quotes Generator</h1>
  
      <div class="form-card">
        <form @submit.prevent="submitForm" class="quote-form">
          <div class="form-group">
            <label for="category" class="form-label">Category:</label>
            <input v-model="category" id="category" class="form-input" required placeholder="e.g. Success" />
          </div>
  
          <div class="form-group">
            <label for="tone" class="form-label">Tone:</label>
            <input v-model="tone" id="tone" class="form-input" required placeholder="e.g. Inspiring" />
          </div>
  
          <button type="submit" class="submit-button">Generate Quote</button>
        </form>
      </div>
  
      <transition name="fade">
        <div v-if="quotes.length" class="quotes-list">
          <h2 class="section-title">Motivational Quotes</h2>
          <transition-group name="list" tag="ul" class="quotes-ul">
            <li v-for="(quote, index) in quotes" :key="quote + index" class="quote-item">
              "{{ quote }}"
            </li>
          </transition-group>
        </div>
      </transition>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        quotes: [],
        category: "",
        tone: "",
      };
    },
    async created() {
      try {
        const response = await fetch("/api/fetch-motivational-quotes");
        const result = await response.json();
        if (result.success) {
          // Flatten all quotes from the database
          // The structure returned is an array of quote docs, each with a quotes array
          this.quotes = result.quotes.map(q => q.quotes).flat();
        } else {
          console.warn(result.message || "No quotes found.");
        }
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    },
    methods: {
      async submitForm() {
        try {
          const response = await fetch("/api/generate-motivational-quote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category: this.category,
              tone: this.tone,
            }),
          });
  
          const result = await response.json();
          
          if (result.success && result.quotes && result.quotes.quotes && result.quotes.quotes.length) {
            // Add the newly generated single quote at the beginning of the array
            this.quotes.unshift(result.quotes.quotes[0]);
            // Clear the form inputs
            this.category = "";
            this.tone = "";
          } else {
            console.warn("Quote generation succeeded, but no quote returned.");
          }
        } catch (error) {
          console.error("Error generating quote:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Background and Layout */
  .quotes-container {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #f4f9f4, #cbe8ca);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    font-family: "Helvetica Neue", Arial, sans-serif;
  }
  
  .page-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #2c3e50;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  /* Form Card */
  .form-card {
    background: #ffffffee;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
    width: 100%;
    max-width: 500px;
    transition: transform 0.3s ease;
  }
  
  .form-card:hover {
    transform: translateY(-3px);
  }
  
  .quote-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: bold;
    color: #34495e;
  }
  
  .form-input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  .form-input:focus {
    border-color: #2ecc71;
    outline: none;
  }
  
  .submit-button {
    background: #2ecc71;
    color: #fff;
    font-size: 1.1rem;
    padding: 0.7rem 1.2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: background 0.3s ease, transform 0.2s ease;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  }
  
  .submit-button:hover {
    background: #27ae60;
    transform: translateY(-2px);
  }
  
  .submit-button:active {
    transform: translateY(1px);
  }
  
  /* Quotes List */
  .quotes-list {
    background: #ffffffee;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 700px;
    text-align: center;
  }
  
  .section-title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: #2c3e50;
    text-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .quotes-ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .quote-item {
    background: #f4f9f4;
    margin: 0.5rem 0;
    padding: 1rem;
    border-radius: 8px;
    border-left: 5px solid #2ecc71;
    font-size: 1.1rem;
    color: #34495e;
    position: relative;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    cursor: default;
  }
  
  .quote-item:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: scale(1.02);
  }
  
  /* Transitions & Animations */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  </style>
  