// api/record.js
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('emplo');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await client.connect();
    
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const record = await db.collection('records').findOne({ _id: new ObjectId(req.query.id) });
          return res.status(200).json(record);
        } else {
          const records = await db.collection('records').find({}).toArray();
          return res.status(200).json(records);
        }
        
      case 'POST':
        const newRecord = req.body;
        const result = await db.collection('records').insertOne(newRecord);
        return res.status(201).json(result);
        
      case 'DELETE':
        const query = { _id: new ObjectId(req.query.id) };
        const deleteResult = await db.collection('records').deleteOne(query);
        return res.status(200).json(deleteResult);
        
      case 'PATCH':
        const updateQuery = { _id: new ObjectId(req.query.id) };
        const updates = { $set: req.body };
        const updateResult = await db.collection('records').updateOne(updateQuery, updates);
        return res.status(200).json(updateResult);
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}