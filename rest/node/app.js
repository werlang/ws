const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const query = require('./connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./config.json');

const secretKey = config.secretKey;

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use(express.urlencoded({ extended: true }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());


// create a new user
app.post('/users', async (req, res) => {
    try {
        // check if user already exists
        let sql = 'SELECT * FROM users WHERE email = ?';
        let result = await query(sql, [ req.body.email ]);
        if (result && result.length) {
            res.status(409).send({ error: 'User already exists' });
            return;
        }
    
        sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        result = await query(sql, [
            req.body.name,
            req.body.email,
            await bcrypt.hash(req.body.password, 10),
        ]);
        res.status(201).send({ message: 'User created', id: result.insertId });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});


// login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // check if user exists
        const sql = 'SELECT * FROM users WHERE email = ?';
        const result = await query(sql, [ email ]);
        if (!result) {
            res.status(404).send({ error: 'User not found' });
            return;
        }
    
        const user = result[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            res.status(401).send({ error: 'Invalid password' });
            return;
        }
    
        const token = jwt.sign({
            id: user.id,
        }, secretKey, { expiresIn: '1h' });
        
        res.send({
            message: 'User logged in',
            token,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

const getUser = async (req, res, next) => {
    const token = req.headers.authorization.replace('Bearer ', '');

    // check if token is valid
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = {
            id: decoded.id,
        }
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).send({ error: 'Invalid token' });
    }
}


// GET a user info
app.get('/users', getUser, async (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    const result = await query(sql, [ req.user.id ]);

    if (!result || !result.length) {
        res.status(404).send({ error: 'User not found' });
        return;
    }

    const user = result[0];

    res.send({
        id: user.id,
        name: user.name,
        email: user.email,
    });
});


// update a user
app.put('/users', getUser, async (req, res) => {
    try {
        const fields = Object.keys(req.body);
        const data = Object.values(req.body);

        if (!fields.length) {
            res.status(400).send({ error: 'No fields to update' });
            return;
        }

        const sql = `UPDATE users SET ${ fields.map(f => `${f} = ?`).join(', ') } WHERE id = ?`;
        await query(sql, [ ...data, req.user.id ]);
        res.send({ message: 'User updated' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});


// delete a user
app.delete('/users', getUser, async (req, res) => {
    try {
        const sql = 'DELETE FROM users WHERE id = ?';
        await query(sql, [ req.user.id ]);
        res.send({ message: 'User deleted' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});


// search user by name or email
app.get('/users/search/:field', async (req, res) => {
    const field = req.params.field;

    if (!['name', 'email'].includes(field)) {
        res.status(400).send({ error: 'Invalid field' });
        return;
    }

    if (!req.query.value) {
        res.status(400).send({ error: 'Missing value' });
        return;
    }

    const value = req.query.value;
    const sql = `SELECT * FROM users WHERE ${field} LIKE ?`;
    let result = await query(sql, [ `%${value}%` ]);

    if (!result || !result.length) {
        res.status(404).send({ error: 'User not found' });
        return;
    }

    result = result.map(user => user[field]);
    res.send(result);
});


// 404
app.use((req, res, next) => {
    res.status(404).send({ error: 'Not found' });
});


// Start the server
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => {
    console.log(`Server is listening on port ${port}`);
});