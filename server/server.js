import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const MONGO_URI = process.env.ATLAS_URI || 'mongodb://localhost:27017/employee_database';

// Middleware
app.use(cors({
  origin: [
    'https://employee-database-frontend.onrender.com',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
let db;

async function connectToMongo() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB');
    db = client.db();
    
    // Routes
    app.get('/record', async (req, res) => {
      try {
        const records = await db.collection('records').find({}).toArray();
        res.json(records);
      } catch (err) {
        console.error('Error fetching records:', err);
        res.status(500).json({ error: 'Failed to fetch records' });
      }
    });

    // Create a new record
    app.post('/record', async (req, res) => {
      try {
        const { name, position, level } = req.body;
        
        // Basic validation
        if (!name || !position || !level) {
          return res.status(400).json({ error: 'Name, position, and level are required' });
        }
        
        const newRecord = {
          name,
          position,
          level,
          created: new Date()
        };
        
        const result = await db.collection('records').insertOne(newRecord);
        
        if (result.acknowledged) {
          res.status(201).json({ ...newRecord, _id: result.insertedId });
        } else {
          throw new Error('Failed to create record');
        }
      } catch (err) {
        console.error('Error creating record:', err);
        res.status(500).json({ error: 'Failed to create record' });
      }
    });
    
    // Delete a record
    app.delete('/record/:id', async (req, res) => {
      try {
        const result = await db.collection('records').deleteOne({ _id: new ObjectId(req.params.id) });
        
        if (result.deletedCount === 1) {
          res.status(200).json({ message: 'Record deleted successfully' });
        } else {
          res.status(404).json({ error: 'Record not found' });
        }
      } catch (err) {
        console.error('Error deleting record:', err);
        res.status(500).json({ error: 'Failed to delete record' });
      }
    });
    
    // Update a record
    app.put('/record/:id', async (req, res) => {
      try {
        const { name, position, level } = req.body;
        
        // Basic validation
        if (!name || !position || !level) {
          return res.status(400).json({ error: 'Name, position, and level are required' });
        }
        
        const result = await db.collection('records').updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: { name, position, level, updated: new Date() } }
        );
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }
        
        res.json({ message: 'Record updated successfully' });
      } catch (err) {
        console.error('Error updating record:', err);
        res.status(500).json({ error: 'Failed to update record' });
      }
    });
    

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToMongo();
});