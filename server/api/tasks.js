import { defineEventHandler, readBody } from "h3";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ObjectId } from "mongodb";
import connectToDatabase from "../utils/mongodb";
import get_my_auth_data from "../utils/auth";

// This endpoint can serve multiple operations (create, read, AI-suggest tasks, etc.)
export default defineEventHandler(async (event) => {
  const { method } = event.node.req;
  const body = await readBody(event);
  const db = await connectToDatabase();
  const tasksCollection = db.collection("tasks");

  // Ensure the user is authenticated before proceeding
  const authData = await get_my_auth_data(event);

  // console.log("DB connection established, about to query tasks...");

  // Initialize Gemini AI instance
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Extract data from body (depending on request type)
  const { 
    action,     // e.g. 'CREATE_TASK', 'GET_TASKS', 'AI_SUGGEST_TASKS'
    taskData,   // data for creating or updating tasks
    filters,    // filtering data
    userPrompt, // AI prompt for suggesting tasks
  } = body;

  try {
    switch (action) {
      case "CREATE_TASK": {
        // Example: Insert a single new task into the collection
        // Adjust fields as needed
        const { title, description, priority, deadline, status } = taskData;
        const newTask = {
          googleId: authData.sub, // Use Google ID to associate tasks with users
          title,
          description,
          priority,                // e.g. "High", "Medium", "Low"
          deadline: new Date(deadline),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: status || "pending",
          percentage: 0
        };

        await tasksCollection.insertOne(newTask);
        return { success: true, task: newTask };
      }

      case "UPDATE_TASK": {
        // Example: Update existing task by ID
        const { id, ...rest } = taskData;
        await tasksCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...rest, updatedAt: new Date() } }
        );
        return { success: true };
      }

      case "GET_TASKS": {
        // Basic filtering example
        // You can add additional conditions for priority, status, date range, etc.
        const query = {};
        if (filters?.priority) {
          query.priority = filters.priority;
        }
        if (filters?.status) {
          query.status = filters.status;
        }

        // Retrieve tasks from MongoDB
        // const tasks = await tasksCollection.find(query).toArray();
        const tasks = await tasksCollection.find({ googleId: authData.sub }).toArray();
        return { success: true, tasks };
      }

      case "DELETE_TASK":{
        await tasksCollection.deleteOne({ _id: new ObjectId(body.taskId) });
        return { success: true };
      }


      case "AI_SUGGEST_TASKS": {
        // Use the model to suggest tasks based on the userPrompt (or user profile, or context)
        // This is a simplistic example. You would craft a prompt that instructs the AI
        // to list some tasks in a structured format.
        const promptText = `
          I am a student who wants to manage my tasks more effectively. 
          Please suggest a few tasks (with priority, estimated deadlines, and short descriptions) that I might consider adding to my to-do list.
          
          Additional context: ${userPrompt}
          
          Provide the response in a JSON format with an array of objects like this:
          [
            {
              "title": "...",
              "description": "...",
              "priority": "...",
              "deadline": "YYYY-MM-DD"
            },
            ...
          ]
          Do not include any other text outside of a valid JSON array.
        `;

        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: promptText }] }],
        });

        // Parse out the JSON from the AI response
        let suggestions = [];
        try {
          const rawAiResponse = result.response.text().replace(/```json|```/g, "").trim();
          suggestions = JSON.parse(rawAiResponse);
        } catch (err) {
          console.error("Error parsing AI response for tasks:", err);
        }

        return { success: true, suggestions };
      }

      default:
        return { error: "Unknown action." };
    }
  } catch (error) {
    console.error("Error handling tasks request:", error);
    return { error: "Failed to process task request." };
  }
});
