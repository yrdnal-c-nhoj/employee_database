import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import db from './db/connection.js'; 

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors()); 
app.use(express.json());

// --- ROUTES ---

// Health Check / Test Route
app.get("/", (req, res) => {
  res.send("Server is running and connected to the database logic.");
});

// Get all records
app.get('/record', async (req, res) => {
  try {
    const records = await db.collection('records').find({}).toArray();
    res.status(200).json(records);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// Create a record
app.post('/record', async (req, res) => {
  try {
    const newRecord = req.body;
    const result = await db.collection('records').insertOne(newRecord);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// Delete a record
app.delete('/record/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const result = await db.collection('records').deleteOne(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// Update a record
app.patch('/record/:id', async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = { $set: req.body };
    const result = await db.collection('records').updateOne(query, updates);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update record' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});