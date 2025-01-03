import connectToDatabase from "../utils/mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ObjectId } from "mongodb";
import get_my_auth_data from "../utils/auth";


export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { prompt, discussion, title, duration, discussionId } = body;

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const db = await connectToDatabase();
    const discussionsCollection = db.collection("discussions");

    let discussionTitle = "Untitled Discussion";
    let discussionDescription = "No description provided.";
    let discussionSubject = "None";

    // Retrieve existing discussion or set defaults
    if (discussionId) {
      const existingDiscussion = await discussionsCollection.findOne({
        _id: new ObjectId(discussionId),
      });

      if (existingDiscussion) {
        discussionTitle = existingDiscussion.title || discussionTitle;
        discussionDescription =
          existingDiscussion.description || discussionDescription;
        discussionSubject = existingDiscussion.subject || discussionSubject;
      } else {
        throw new Error(`Discussion with ID ${discussionId} not found.`);
      }
    } else {
      // Generate title, description, and subject for the first prompt
      const attributesPrompt = `
        Based on the following user input:
        "${prompt}"
        
        Provide a JSON object with the following fields:
        - 'title' (string): A concise title summarizing the discussion.
        - 'description' (string): A brief description summarizing the discussion.
        - 'subject' (string): The subject category (e.g., Mathematics, Physics, Literature, etc.).
        
        Respond only with a valid JSON object. Do not include any additional text or commentary.
      `;

      const attributesResult = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: attributesPrompt }] }],
      });

      try {
        // Parse and sanitize AI response
        const sanitizedAttributes = attributesResult.response.text().trim().replace(/```json|```/g, "");
        const attributes = JSON.parse(sanitizedAttributes);

        discussionTitle = attributes.title || discussionTitle;
        discussionDescription = attributes.description || discussionDescription;
        discussionSubject = attributes.subject || discussionSubject;
      } catch (error) {
        console.error("Error parsing AI response for title, description, and subject:", error);
      }
    }

    // Generate AI response for the user's prompt
    const result = await model.generateContent({
      contents: [...discussion, { role: "user", parts: [{ text: prompt }] }],
    });
    const aiResponse = result.response.text();

    // Append the new user input and AI response to the discussion
    const updatedDiscussion = [
      ...discussion,
      { role: "user", parts: [{ text: prompt }] },
      { role: "model", parts: [{ text: aiResponse }] },
    ];

    let savedDiscussionId;

    // Update or insert the discussion in the database
    if (discussionId) {
      console.log("Updating existing discussion...");
      await discussionsCollection.updateOne(
        { _id: new ObjectId(discussionId) },
        {
          $set: {
            messages: updatedDiscussion,
            updatedAt: new Date(),
          },
        }
      );
      savedDiscussionId = discussionId;
    } else {
      console.log("Creating new discussion...");
      
      // Ensure the user is authenticated before proceeding
      const authData = await get_my_auth_data(event);

      const newDiscussion = await discussionsCollection.insertOne({
        googleId: authData.sub,
        title: discussionTitle,
        description: discussionDescription,
        subject: discussionSubject,
        duration: duration || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: updatedDiscussion,
      });
      savedDiscussionId = newDiscussion.insertedId;
    }

    return {
      success: true,
      response: aiResponse,
      discussionId: savedDiscussionId,
      title: discussionTitle, // Include the title
      description: discussionDescription, // Include the description
      subject: discussionSubject, // Include the subject
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return { error: "Failed to generate content." };
  }
});
