const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://Cluster06164:UNbKi3xL6ZY@cluster0.4chl5sg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export default async function handler(req, res) {
  const { id } = req.query;
  const { text, name, hash } = req.body;

  await client.connect();
  console.log('Connected to MongoDB');
  
  const db = client.db('myDatabase');
  const collection = db.collection('myCollection');
  
  if (!ObjectId.isValid(id)) {
    return res.status(400).send('Invalid ID format');
  }
        
  if (req.method === 'GET') {
    try {
      const document = await collection.findOne({ _id: new ObjectId(id) });
      if (!document) {
        return res.status(404).send('Document not found');
      }
      res.status(200).json(document);
    } catch (error) {
      console.error('Error fetching document', error);
      res.status(500).send('Internal Server Error');
    }
  } else if (req.method === 'PUT') {
    if (!text && !name && !hash) {
      return res.status(400).send('At least one field (text, name, or hash) is required');
    }
    try {
      const updateFields = {};
      if (text) updateFields.text = text;
      if (name) updateFields.name = name;
      if (hash) updateFields.hash = hash;

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send('Document not found');
      }
      res.status(200).send('Document updated');
    } catch (error) {
      console.error('Error updating document', error);
      res.status(500).send('Internal Server Error');
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).send('Document not found');
      }
      res.status(200).send('Document deleted');
    } catch (error) {
      console.error('Error deleting document', error);
      res.status(500).send('Internal Server Error');
    }
  } else if (req.method === 'POST') {
    if (!text && !name && !hash) {
      return res.status(400).send('At least one field (text, name, or hash) is required');
    }
    try {
      const result = await collection.insertOne({ text, name, hash, createdAt: new Date() });
      res.status(201).send(`Document inserted with ID: ${result.insertedId}`);
    } catch (error) {
      console.error('Error inserting document', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}