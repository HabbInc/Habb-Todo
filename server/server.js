const express = require('express');
const mongoose = require('mongoose');
const Task = require('./model/task'); 
const task = require('./model/task');

const cors = require('cors');
app.use(cors());
const app = express();
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


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
