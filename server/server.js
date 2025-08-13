const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Task = require('./model/task');

const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();
require('./passportConfig');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;


app.use(session({
  secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth route
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    // Issue JWT and redirect to frontend with token
    try {
      const user = req.user;
      const token = jwt.sign(
        { user: { id: user.id } },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (e) {
      console.error('OAuth callback error:', e);
      res.redirect(`${FRONTEND_URL}?error=oauth_failed`);
    }
    }
);

// Middleware
// Increase body size limits to support base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

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
      completed: false
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/deletetask/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updatetask/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    task.completed = !task.completed;
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});