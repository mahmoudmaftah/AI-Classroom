import { GoogleGenerativeAI } from "@google/generative-ai";
import connectToDatabase from "../utils/mongodb"; // MongoDB connection utility
import get_my_auth_data from "../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    // Read request body
    const body = await readBody(event);

    // Ensure the user is authenticated before proceeding
    const authData = await get_my_auth_data(event);

    // Extract fields from request
    const { category, tone } = body;

    // Validate input
    if (!category || !tone) {
      return { error: "Both category and tone are required." };
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the prompt for a single quote
    const prompt = `
Generate a single motivational quote for students in the category of "${category}" with a "${tone}" tone. 
The quote should be inspiring and encourage students to study and persevere.

The output should be in this format:
[
  "Your single generated quote here."
]
`;

    // Call the model with the structured prompt
    const result = await model.generateContent(prompt);

    // Extract content from the model's response
    let content = result.response.text();

    // Remove Markdown formatting if present
    content = content.replace(/```json|```/g, "").trim();

    if (!content) {
      throw new Error("Failed to retrieve content from the model.");
    }

    // Parse the generated quote (single-element array)
    const generatedQuotes = JSON.parse(content);

    // Connect to MongoDB
    const db = await connectToDatabase();
    const quotesCollection = db.collection("motivationalQuotes");

    // Create the new quotes object
    const newQuotes = {
      googleId: authData.sub, // Use Google ID to associate quotes with
      category,
      tone,
      quotes: generatedQuotes, // single-quote array
      createdAt: new Date(),
    };

    // Insert the new quotes into the database
    const resultInsert = await quotesCollection.insertOne(newQuotes);

    // Return the inserted quote with its MongoDB-generated ID
    return { success: true, quotes: { ...newQuotes, id: resultInsert.insertedId } };
  } catch (error) {
    return { error: error.message || "An error occurred during quote generation." };
  }
});
