import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Your MongoDB connection string

let client;
let db;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri); // No additional options needed
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("AI-Classroom"); // Replace with your database name
  }
  return db;
}

export default connectToDatabase;
