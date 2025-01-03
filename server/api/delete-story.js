import connectToDatabase from "../utils/mongodb";
import { ObjectId } from "mongodb";

export default defineEventHandler(async (event) => {
  try {
    const { id } = await readBody(event);

    if (!id) {
      return { error: "Story ID is required." };
    }

    const db = await connectToDatabase();
    const storiesCollection = db.collection("motivationalStories");

    const result = await storiesCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { error: "No story found with the provided ID." };
    }

    return { success: true };
  } catch (error) {
    return { error: error.message || "An error occurred while deleting the story." };
  }
});
