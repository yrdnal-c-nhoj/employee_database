// api/record.js
const { MongoClient, ObjectId } = require('mongodb');

let client;
let db;

async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }
  
  if (!process.env.ATLAS_URI) {
    console.error('ATLAS_URI environment variable is not set');
    throw new Error('ATLAS_URI environment variable is not set');
  }
  
  console.log('Connecting to database...');
  client = new MongoClient(process.env.ATLAS_URI);
  await client.connect();
  db = client.db('emp_list');
  console.log('Database connected successfully');
  
  return { client, db };
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db: database } = await connectToDatabase();
    
    switch (req.method) {
      case 'GET':
        if (req.query.id) {
          const record = await database.collection('records').findOne({ _id: new ObjectId(req.query.id) });
          return res.status(200).json(record);
        } else {
          const records = await database.collection('records').find({}).toArray();
          return res.status(200).json(records);
        }
        
      case 'POST':
        const newRecord = req.body;
        const result = await database.collection('records').insertOne(newRecord);
        return res.status(201).json(result);
        
      case 'DELETE':
        const query = { _id: new ObjectId(req.query.id) };
        const deleteResult = await database.collection('records').deleteOne(query);
        return res.status(200).json(deleteResult);
        
      case 'PATCH':
        const updateQuery = { _id: new ObjectId(req.query.id) };
        const updates = { $set: req.body };
        const updateResult = await database.collection('records').updateOne(updateQuery, updates);
        return res.status(200).json(updateResult);
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
