const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


// Define an API endpoint
app.get('/', (req, res) => {
    const name = req.query.name || 'World';
    res.send({ message: `Hello, ${name}!` });
});

// Define an API endpoint, a more elaborate greeting
app.get('/greeting', (req, res) => {
    const name = req.query.name || 'World';
    const title = req.query.title || 'Mr.';
    res.send({ message: `Hello, ${title} ${name}!` });
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
