import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";


export default defineEventHandler(async (event) => {
  try {
    const db = await connectToDatabase();
    const discussionsCollection = db.collection("discussions");

    // Ensure the user is authenticated before proceeding
    const authData = await get_my_auth_data(event);

    // Fetch discussions with only required fields
    const discussions = await discussionsCollection
      .find({googleId: authData.sub}, { projection: { title: 1, description: 1, subject: 1, createdAt: 1 } })
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();

    // Map discussions for the frontend
    const formattedDiscussions = discussions.map((discussion) => ({
      id: discussion._id.toString(),
      title: discussion.title,
      description: discussion.description,
      subject: discussion.subject,
      date: discussion.createdAt,
    }));

    return { success: true, discussions: formattedDiscussions };
  } catch (error) {
    console.error("Error loading discussions:", error);
    return { success: false, error: "Failed to load discussions." };
  }
});
