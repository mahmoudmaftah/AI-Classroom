import connectToDatabase from "../utils/mongodb";
import { ObjectId } from "mongodb";
import get_my_auth_data from "../utils/auth";


export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  try {
    const db = await connectToDatabase();
    const discussionsCollection = db.collection("discussions");

    const discussion = await discussionsCollection.findOne({ _id: new ObjectId(id) });

    if (!discussion) {
      throw new Error("Discussion not found.");
    }

    return {
      success: true,
      discussion: discussion.messages,
    };
  } catch (error) {
    console.error("Error loading discussion:", error);
    return { success: false, error: "Failed to load discussion." };
  }
});
