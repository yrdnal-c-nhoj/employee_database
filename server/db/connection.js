// db/connection.js
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

// Use the Atlas URI from your .env
const URI = process.env.ATLAS_URI;

if (!URI) {
  console.error("ERROR: ATLAS_URI is not defined in .env");
  process.exit(1);
}

// Create a new MongoClient
const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  appName: "mern-server",
});

let db;

try {
  // Connect the client
  await client.connect();

  // Optional: ping the deployment to confirm connection
  await client.db("admin").command({ ping: 1 });
  console.log("✅ MongoDB connected successfully!");

  // Use your database (change "employees" to your DB name if needed)
  db = client.db("employees");
} catch (err) {
  console.error("❌ MongoDB connection failed:", err);
  process.exit(1);
}

export default db;
