
import express, { json } from 'express';
import cors from 'cors';
import { connect, Schema, model, Types } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 8080;
const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;


// Connect to MongoDB
connect(`mongodb+srv://${dbUsername}:${dbPassword}@cluster0.8r29g9z.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Define schema and model for lists and items
const listSchema = new Schema({
  items: [{ id: String, content: String, showTick: Boolean }]
});
const List = model('List', listSchema);

// Create Express server
const app = express();
app.use(json());
app.use(cors());

// Define routes
app.get('/api/lists', async (req, res) => {
  try {
    const lists = await List.find();
    res.json(lists);
  } catch (error) {
    console.error('Error getting lists:', error);
    res.status(500).json({ error: 'Failed to retrieve lists' });
  }
});

app.post('/api/lists', async (req, res) => {
  try {
    const newList = new List(req.body);
    await newList.save();
    res.json(newList);
  } catch (error) {
    console.error('Error creating list:', error);
    res.status(500).json({ error: 'Failed to create list' });
  }
});

app.put('/api/lists/:id', async (req, res) => {
  try {
    const listId = req.params.id;
    const list = await List.findByIdAndUpdate(listId, req.body, { new: true });
    res.json(list);
  } catch (error) {
    console.error('Error updating list:', error);
    res.status(500).json({ error: 'Failed to update list' });
  }
});

app.delete('/api/lists/:id', async (req, res) => {
  try {
    const listId = req.params.id;
    await List.findByIdAndDelete(listId);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ error: 'Failed to delete list' });
  }
});

// Start the server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
