import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://Cluster06164:UNbKi3xL6ZY@cluster0.4chl5sg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export default async function handler(req, res) {
  await client.connect();
  const db = client.db('myDatabase');
  const collection = db.collection('myCollection');

  if (req.method === 'POST') {
    const { text, name, hash } = req.body;
    if (!text || !name || !hash) {
      return res.status(400).send('Text, Name, and Hash are required');
    }
    try {
      const result = await collection.insertOne({ text, name, hash, createdAt: new Date() });
      res.status(201).send(`Document inserted with ID: ${result.insertedId}`);
    } catch (error) {
      console.error('Error inserting document', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}