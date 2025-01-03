import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";


export default defineEventHandler(async (event) => {
  try {
    // Connect to MongoDB
    const db = await connectToDatabase();
    const quotesCollection = db.collection("motivationalQuotes");
    
    // Ensure the user is authenticated before proceeding
    const authData = await get_my_auth_data(event);

    // Fetch all quotes from the collection
    const quotes = await quotesCollection.find({
      googleId: authData.sub,
    }).toArray();

    if (!quotes.length) {
      return { message: "No motivational quotes found." };
    }

    // Return all fetched quotes as is
    return { success: true, quotes };
  } catch (error) {
    return { error: error.message || "An error occurred while fetching quotes." };
  }
});
