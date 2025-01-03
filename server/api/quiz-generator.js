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
    const { subject, description, difficulty, time, numQuestions, notions } = body;

    // Validate input
    if (!subject || !description || !difficulty || !time || !numQuestions || !notions) {
      return { error: "All fields (subject, description, difficulty, time, numQuestions, notions) are required." };
    }

    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the prompt
    const prompt = `
Generate a quiz in JSON format based on the following information:
Subject: ${subject}
Description: ${description}
Difficulty: ${difficulty}
Time: ${time} minutes
Number of Questions: ${numQuestions}
Notions: ${notions.join(", ")}

The output should be in this format:
[
  {
    "question": "What is 2 + 2?",
    "answers": ["1", "2", "3", "4"],
    "correctAnswer": "4"
  },
  ...
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

    // Parse the generated quiz
    const generatedQuestions = JSON.parse(content);

    // Connect to MongoDB
    const db = await connectToDatabase();
    const quizzesCollection = db.collection("quizzes"); // Use the "quizzes" collection

    // Create the new quiz object
    const newQuiz = {
      googleId: authData.sub, // Use Google ID to associate quizzes with users
      title: `${subject} Quiz`,
      subject,
      difficulty,
      duration: time,
      description,
      questions: generatedQuestions,
      createdAt: new Date(), // Timestamp for creation
    };

    // Insert the new quiz into the database
    const resultInsert = await quizzesCollection.insertOne(newQuiz);

    // Return the inserted quiz with its MongoDB-generated ID
    return { success: true, quiz: { ...newQuiz, id: resultInsert.insertedId } };
  } catch (error) {
    return { error: error.message || "An error occurred during quiz generation." };
  }
});
