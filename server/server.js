import express from 'express';
import cors from 'cors';
import { ObjectId } from 'mongodb';
import db from './db/connection.js'; 

const app = express();
const PORT = process.env.PORT || 5050;

// --- MIDDLEWARE ---

// Dynamic CORS configuration to support Localhost, Vercel, and Render URLs
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'https://employee-database-client.onrender.com', // Old Render link
  'https://employee-database-git-main-johns-projects-75897040.vercel.app', // Your Vercel git URL
  'https://employee-database-nu.vercel.app', // Your Vercel production URL
  process.env.CLIENT_URL // Set this in Render Dashboard to your Vercel URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---

// 1. Health Check
app.get("/", (req, res) => {
  res.status(200).send("Server is running and connected to MongoDB.");
});

// 2. Get all records
app.get('/record', async (req, res) => {
  try {
    const collection = db.collection('records');
    const records = await collection.find({}).toArray();
    res.status(200).json(records);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
});

// 3. Get a single record by ID
app.get('/record/:id', async (req, res) => {
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

// 4. Create a record
app.post('/record', async (req, res) => {
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

// 5. Update a record (PATCH)
app.patch('/record/:id', async (req, res) => {
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

// 6. Delete a record
app.delete('/record/:id', async (req, res) => {
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