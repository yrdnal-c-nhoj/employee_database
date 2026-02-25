// api/record.js
const { MongoClient, ObjectId } = require('mongodb');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (!process.env.ATLAS_URI) {
      return res.status(500).json({ error: 'ATLAS_URI environment variable is not set' });
    }
    
    const client = new MongoClient(process.env.ATLAS_URI);
    await client.connect();
    const database = client.db('emp_list');
    
    // Handle different endpoints
    const { url } = req;
    const id = req.query.id || (req.method === 'DELETE' ? url.split('/').pop() : null);
    
    switch (req.method) {
      case 'GET':
        if (id && id !== 'record') {
          const record = await database.collection('records').findOne({ _id: new ObjectId(id) });
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
        if (!id) {
          return res.status(400).json({ error: 'ID is required for deletion' });
        }
        const query = { _id: new ObjectId(id) };
        const deleteResult = await database.collection('records').deleteOne(query);
        return res.status(200).json(deleteResult);
        
      case 'PATCH':
        if (!id) {
          return res.status(400).json({ error: 'ID is required for update' });
        }
        const updateQuery = { _id: new ObjectId(id) };
        const updates = { $set: req.body };
        const updateResult = await database.collection('records').updateOne(updateQuery, updates);
        return res.status(200).json(updateResult);
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
