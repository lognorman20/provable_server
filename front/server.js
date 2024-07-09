const express = require('express');
const next = require('next');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const uri = 'mongodb+srv://Cluster06164:UNbKi3xL6ZY@cluster0.4chl5sg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

app.prepare().then(() => {
  const server = express();
  const port = 3000;

  server.use(express.json());
  server.use(cors());

  async function main() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');

      const db = client.db('myDatabase');
      const collection = db.collection('myCollection');

      server.get('/documents', async (req, res) => {
        try {
          const documents = await collection.find({}).toArray();
          res.status(200).json(documents);
        } catch (error) {
          console.error('Error fetching documents', error);
          res.status(500).send('Internal Server Error');
        }
      });

      server.get('/documents/:id', async (req, res) => {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send('Invalid ID format');
        }
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
      });

      server.post('/submit', async (req, res) => {
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
      });

      server.put('/update/:id', async (req, res) => {
        const { id } = req.params;
        const { text, name, hash } = req.body;
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
          );

          if (result.matchedCount === 0) {
            return res.status(404).send('Document not found');
          }
          res.status(200).send('Document updated');
        } catch (error) {
          console.error('Error updating document', error);
          res.status(500).send('Internal Server Error');
        }
      });

      server.delete('/delete/:id', async (req, res) => {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send('Invalid ID format');
        }
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
      });

      server.all('*', (req, res) => {
        return handle(req, res);
      });

      server.listen(port, (err) => {
        if (err) throw err;
        console.log(`Server is running on http://localhost:${port}`);
      });
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      process.exit(1);
    }
  }

  main().catch(console.error);
});
