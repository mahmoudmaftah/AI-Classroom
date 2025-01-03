<template>
    <div>
      <h1>Generate AI Content</h1>
      <div v-if="discussion.length">
        <h2>Discussion</h2>
        <ul>
          <li v-for="item in discussion" :key="item.prompt">
            <p v-for="part in item.parts" :key="part.text">
              {{ part.text }}
            </p>
          </li>
        </ul>
      </div>
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
        discussion: [],
      };
    },
    methods: {
      async generateContent() {
        this.response = null;
        this.error = null;
        try {
          const res = await $fetch("/api/generate-content-discussion", {
            method: "POST",
            body: { prompt: this.prompt, discussion: this.discussion },
          });
          if (res.error) {
            this.error = res.error;
          } else {
            // this.response = res;
            // this.discussion.push({ prompt: this.prompt, response: res });
            this.discussion.push({ role: "user", parts: [{text: this.prompt}] });
            this.discussion.push({ role: "model", parts: [{text: res}] });
            this.prompt = "";
            this.response = ""; 
          }
        } catch (error) {
          console.error("Fetch Error:", error);
          this.error = "Failed to fetch AI response.";
        }
      },
    },
  };
</script>
  