import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";



export default defineEventHandler(async (event) => {
  try {

    console.log(" TEST 1");

    // Connect to MongoDB
    const db = await connectToDatabase();
    const storiesCollection = db.collection("motivationalStories");

    // Ensure the user is authenticated before proceeding
    const authData = await get_my_auth_data(event);

    // Fetch all stories from the collection
    const stories = await storiesCollection.find({googleId: authData.sub}).sort({ createdAt: -1 }).toArray();

    if (!stories.length) {
      return { message: "No motivational stories found." };
    }

    // Return all fetched stories
    return { success: true, stories };
  } catch (error) {
    return { error: error.message || "An error occurred while fetching stories." };
  }
});
