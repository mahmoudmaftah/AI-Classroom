// api/generate-motivational-story.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";


export default defineEventHandler(async (event) => {
  try {
    // Initialize Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    
    // Ensure the user is authenticated before proceeding
    const authData = await get_my_auth_data(event);

    // Construct the prompt with randomness using hyperparameters
    const prompt = `
Generate a unique motivational story about a real-life historical or contemporary figure from diverse fields such as mathematics, physics, computer science, chemistry, medicine, engineering, or literature. Avoid repeating previous responses. Describe their struggles and ultimate success. Include a famous quote from them if possible. Also, provide a one-sentence description summarizing the story.
Suggest relevant tags such as 'science', 'motivation', 'failure', 'success', 'perseverance', etc.

The output should be in this format:
{
  "story": "...",
  "quote": "...",
  "tags": ["...", "..."],
  "description": "..."
}`;

    // Generate content with temperature and top_p settings for randomness
    const result = await model.generateContent(prompt, {
      temperature: 0.8, // Increases randomness
      top_p: 0.9, // Controls diversity
    });

    let content = result.response.text().replace(/```json|```/g, "").trim();

    if (!content) {
      throw new Error("Failed to retrieve content from the model.");
    }

    const generatedStory = JSON.parse(content);

    // Save to database
    const db = await connectToDatabase();
    const storiesCollection = db.collection("motivationalStories");

    const newStory = {
      googleId: authData.sub,
      ...generatedStory,
      createdAt: new Date(),
    };

    const resultInsert = await storiesCollection.insertOne(newStory);

    return { success: true, story: { ...newStory, id: resultInsert.insertedId } };
  } catch (error) {
    return { error: error.message || "An error occurred while generating the story." };
  }
});
