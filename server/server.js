import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import db from './db/connection.js';
import { authenticateToken } from './middleware/auth.js';
import userRoutes from './routes/user.js'; 

const app = express();
const PORT = process.env.PORT || 5050;

// --- SECURITY CHECK ---
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-change-this-in-production') {
  console.warn("⚠️ WARNING: JWT_SECRET is not set or is using the default placeholder. Authentication will be insecure!");
  // In a strict production environment, you might use process.exit(1) here instead.
}

// --- MIDDLEWARE ---

// Dynamic CORS configuration to support Localhost, Vercel, and Render URLs
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'https://employee-database-client.onrender.com',
  'https://employee-database-nu.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

// Use the dynamic CORS configuration
app.use(cors({
  origin: allowedOrigins, // Use the defined allowedOrigins array
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---

// Authentication routes (public)
app.use('/user', userRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).send("Server is running and connected to MongoDB.");
});

// Debug endpoint to test CORS and connectivity
app.get("/test", (req, res) => {
  console.log('Test endpoint hit from origin:', req.headers.origin);
  res.status(200).json({ 
    message: "Test endpoint working", 
    timestamp: new Date().toISOString(),
    origin: req.headers.origin 
  });
});

// 2. Get all records (protected)
app.get('/record', authenticateToken, async (req, res) => {
  try {
    const collection = db.collection('records');
    const records = await collection.find({}).toArray();
    res.status(200).json(records);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// 3. Get a single record by ID (protected)
app.get('/record/:id', authenticateToken, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection('records');
    const result = await collection.findOne(query);

    if (!result) {
      res.status(404).json({ error: "Record not found" });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});

// 4. Create a record (protected)
app.post('/record', authenticateToken, async (req, res) => {
  try {
    const newRecord = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    const collection = db.collection('records');
    const result = await collection.insertOne(newRecord);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// 5. Update a record (PATCH) (protected)
app.patch('/record/:id', authenticateToken, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };
    const collection = db.collection('records');
    const result = await collection.updateOne(query, updates);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update record' });
  }
});

// 6. Delete a record (protected)
app.delete('/record/:id', authenticateToken, async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection('records');
    const result = await collection.deleteOne(query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});