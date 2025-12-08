// server.js
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import records from "./routes/record.js"; // note the .js extension

// dotenv import if needed
// import dotenv from "dotenv";
// dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
