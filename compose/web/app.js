const express = require('express');
const app = express();

// Serve static files
app.use(express.static('public'));

// Serve index.html for all routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/user', (req, res) => {
    res.sendFile(__dirname + '/public/user.html');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
