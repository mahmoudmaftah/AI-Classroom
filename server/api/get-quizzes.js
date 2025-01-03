import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";


export default defineEventHandler(async (event) => {
  try {
    // Connect to MongoDB
    const db = await connectToDatabase();

    // Ensure the user is authenticated before proceeding
    const authData = await get_my_auth_data(event);

    const quizzesCollection = db.collection("quizzes");

    // Fetch all quizzes
    const quizzes = await quizzesCollection.find({googleId: authData.sub}).toArray();

    // Map the MongoDB `_id` to `id` for frontend compatibility
    const formattedQuizzes = quizzes.map((quiz) => ({
      id: quiz._id.toString(), // Convert ObjectId to string
      title: quiz.title,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      duration: quiz.duration,
      questions: quiz.questions,
    }));

    return { success: true, quizzes: formattedQuizzes };
  } catch (error) {
    return { error: "Failed to load quizzes." };
  }
});
