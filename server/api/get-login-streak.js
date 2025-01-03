import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    // Ensure the user is authenticated
    const authData = await get_my_auth_data(event);

    // Connect to MongoDB
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Fetch the user's login streak
    const user = await usersCollection.findOne({ googleId: authData.sub });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const today = new Date().toISOString().split("T")[0];
    const lastLoginDate = user.lastLoginDate || null;

    let streak = user.loginStreak || 0;

    if (lastLoginDate === today) {
      // The user has already logged in today; keep the streak
    } else {
      // Update the streak based on the last login date
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split("T")[0];

      if (lastLoginDate === yesterdayString) {
        streak += 1; // Continue the streak
      } else {
        streak = 0; // Streak is broken
      }

      // Update the user's record
      await usersCollection.updateOne(
        { googleId: authData.sub },
        { $set: { lastLoginDate: today, loginStreak: streak } }
      );
    }

    return { success: true, streak };
  } catch (error) {
    console.error("Error retrieving login streak:", error);
    return { success: false, error: "Failed to retrieve login streak" };
  }
});
