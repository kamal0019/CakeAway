const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/cakeway";
const client = new MongoClient(uri);

let database;

async function connectDB() {
  try {
    await client.connect();
    database = client.db("cakeway");
    console.log("Connected successfully to MongoDB");
    
    // Test connectivity and ensure collections exist if needed
    return database;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  }
}

function getCollection(name) {
  if (!database) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return database.collection(name);
}

module.exports = { connectDB, getCollection };
