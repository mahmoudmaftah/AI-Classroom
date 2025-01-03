<template>
    <div>
      <h1>Generate AI Content</h1>
      <form @submit.prevent="generateContent">
        <textarea
          v-model="prompt"
          placeholder="Enter your prompt"
          rows="5"
          style="width: 100%;"
        ></textarea>
        <button type="submit">Generate</button>
      </form>
      <div v-if="response || error">
        <h2 v-if="response">Response</h2>
        <p v-html="response"></p>
        <h2 v-if="error">Error</h2>
        <p>{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        prompt: "",
        response: null,
        error: null,
      };
    },
    methods: {
      async generateContent() {
        this.response = null;
        this.error = null;
        try {
          const res = await $fetch("/api/generate-content", {
            method: "POST",
            body: { prompt: this.prompt },
          });
          if (res.error) {
            this.error = res.error;
          } else {
            this.response = res;
          }
        } catch (error) {
          console.error("Fetch Error:", error);
          this.error = "Failed to fetch AI response.";
        }
      },
    },
  };
</script>
  