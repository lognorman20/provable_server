const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// MongoDB connection URI
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function main() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('myDatabase');
    const collection = db.collection('myCollection');

    // Handle GET requests to /documents
    app.get('/documents', async (req, res) => {
      try {
        const documents = await collection.find({}).toArray(); // Fetch all documents
        res.status(200).json(documents);
      } catch (error) {
        console.error('Error fetching documents', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Handle GET requests to /documents/:id
    app.get('/documents/:id', async (req, res) => {
      const { id } = req.params; // Extract the ID from the request parameters
      if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
      }
      try {
        const document = await collection.findOne({ _id: new ObjectId(id) }); // Fetch the document by ID
        if (!document) {
          return res.status(404).send('Document not found');
        }
        res.status(200).json(document);
      } catch (error) {
        console.error('Error fetching document', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Handle POST requests to /submit
    app.post('/submit', async (req, res) => {
      const { text, name, hash } = req.body; // Extract text, name, and hash
      if (!text || !name || !hash) {
        return res.status(400).send('Text, Name, and Hash are required');
      }
      try {
        const result = await collection.insertOne({ text, name, hash, createdAt: new Date() }); // Insert all fields
        res.status(201).send(`Document inserted with ID: ${result.insertedId}`);
      } catch (error) {
        console.error('Error inserting document', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Handle PUT requests to /update/:id
    app.put('/update/:id', async (req, res) => {
      const { id } = req.params; // Extract the ID from the request parameters
      const { text, name, hash } = req.body; // Extract the fields to update from the request body
      if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
      }
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
        ); // Update the document by ID

        if (result.matchedCount === 0) {
          return res.status(404).send('Document not found');
        }
        res.status(200).send('Document updated');
      } catch (error) {
        console.error('Error updating document', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Handle DELETE requests to /delete/:id
    app.delete('/delete/:id', async (req, res) => {
      const { id } = req.params; // Extract the ID from the request parameters
      if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID format');
      }
      try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Delete the document by ID
        if (result.deletedCount === 0) {
          return res.status(404).send('Document not found');
        }
        res.status(200).send('Document deleted');
      } catch (error) {
        console.error('Error deleting document', error);
        res.status(500).send('Internal Server Error');
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

main().catch(console.error);
