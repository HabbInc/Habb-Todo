const express = require('express');
const bodyParser = require('body-parser');
const mangoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
}); 

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to MongoDB
mangoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
    console.log('Connected to MongoDB');
    }).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    });