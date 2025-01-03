import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";

export default defineEventHandler(async (event) => {
    try {
        // Parse the request body
        const body = await readBody(event);

        // Ensure the user is authenticated
        const authData = await get_my_auth_data(event);

        const { quizId, score, timeTaken, totalQuestions, correctAnswers } = body;

        // Connect to MongoDB
        const db = await connectToDatabase();
        const statsCollection = db.collection("quizStats");

        // Update or insert the user's quiz statistics
        await statsCollection.insertOne({
            quizId,
            googleId: authData.sub,
            score,
            timeTaken,
            totalQuestions,
            correctAnswers,
            updatedAt: new Date(),
        }// Create a new record if it doesn't exist
        );

        return { success: true, message: "Quiz statistics updated successfully" };
    } catch (error) {
        console.error("Error updating quiz stats:", error);
        return { error: "Failed to update quiz statistics." };
    }
});
