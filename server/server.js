const express = require('express');
const mongoose = require('mongoose');
const Task = require('./model/task'); 

const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); 

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/api/alltasks', async(req, res) => {
    try {
       const tasks = await Task.find({});
        res.json(tasks);
    } catch (error) {
        console.error('Error in /api/alltasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/addtask', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Task title is required' });
  }
  try {
    const newTask = new Task({
      title: title.trim(),
      description: '',
      completed: false
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
