import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    // Ensure the user is authenticated
    const authData = await get_my_auth_data(event);

    // Connect to MongoDB
    const db = await connectToDatabase();
    const statsCollection = db.collection("quizStats");

    // Fetch all quiz stats for the authenticated user
    const stats = await statsCollection
      .find({ googleId: authData.sub })
      .toArray();

    // Preprocess data for charts
    const dailyStats = stats.reduce((acc, stat) => {
      const date = new Date(stat.updatedAt).toISOString().split("T")[0]; // Extract YYYY-MM-DD
      if (!acc[date]) {
        acc[date] = { totalScore: 0, quizzesDone: 0 };
      }
      acc[date].totalScore += stat.score; // Accumulate score
      acc[date].quizzesDone += 1; // Increment quiz count
      return acc;
    }, {});

    // Transform the aggregated data into an array
    const dailyStatsArray = Object.keys(dailyStats).map((date) => ({
      date,
      averageScore: dailyStats[date].totalScore / dailyStats[date].quizzesDone,
      quizzesDone: dailyStats[date].quizzesDone,
    }));

    return { success: true, stats: dailyStatsArray };
  } catch (error) {
    console.error("Error fetching quiz stats:", error);
    return { error: "Failed to fetch quiz statistics." };
  }
});
