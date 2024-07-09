import { NextApiRequest, NextApiResponse } from 'next';

const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb+srv://Cluster06164:UNbKi3xL6ZY@cluster0.4chl5sg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

export default async function handler(req, res) {
  await client.connect();
  console.log('Connected to MongoDB');

  const db = client.db('myDatabase');
  const collection = db.collection('myCollection');

  if (req.method === 'GET') {
     
        try {
          const documents = await collection.find({}).toArray();
          res.status(200).json(documents);
        } catch (error) {
          console.error('Error fetching documents', error);
          res.status(500).send('Internal Server Error');
        }
  } else if (req.method === 'POST') {
    const { text, name, hash } = req.body;
    try {
      console.log(text, name, hash)
      const result = await collection.insertOne({ text, name, hash, createdAt: new Date() });
      res.status(201).send(`Document inserted with ID: ${result.insertedId}`);
    } catch (error) {
      console.error('Error inserting document', error);
      res.status(500).send('Internal Server Error');
    }
    res.status(201).json({ message: 'Document saved' });
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}