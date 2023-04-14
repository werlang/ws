const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const { query } = require('./connection');
const redis = require('redis');
const redisClient = redis.createClient({ url: 'redis://redis' });
redisClient.connect();

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


// Define an API endpoint
app.get('/greeting', (req, res) => {
    const name = req.query.name || 'World';
    res.send({ message: `Hello, ${name}!` });
});

// Insert user
app.post('/user', async (req, res) => {
    const name = req.body.name;
    query('INSERT INTO users (name) VALUES (?)', [name]);
    res.send({ message: `User ${name} added` });
});

// Find user
app.get('/user/:name', async (req, res) => {
    const name = req.params.name;
    const rows = await query('SELECT * FROM users WHERE name = ?', [name]);
    res.send({ message: rows || [] });
});

// get counter value
app.get('/counter', async (req, res) => {
    const value = await redisClient.get('counter');
    res.send({ message: value });
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
