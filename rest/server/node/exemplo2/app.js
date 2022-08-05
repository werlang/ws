const express = require('express');
const fetch = require('node-fetch'); // instalar versão 2.x
const mysql = require('mysql2');
const fs = require('fs');
const app = express();
const port = 4200;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const config = JSON.parse(fs.readFileSync('config.json'));
const conn = mysql.createPool({
    namedPlaceholders: true,
    ...config
});
conn.executeAsync = async (sql, data) => new Promise(resolve => conn.execute(sql, data, (err, rows) => resolve(rows)));

const getUsers = async id => {
    let field_sql = '';
    const data = [];
    if (id) {
        field_sql = 'WHERE id = ?';
        data.push(id);
    }

    const sql = `SELECT * FROM users ${ field_sql }`;
    const rows = await conn.executeAsync(sql, data);
    return {
        status: 200,
        message: 'OK',
        results: rows,
    };
}

app.get('/users', async (req, res) => {
    const output = await getUsers();
    res.status( output.status ).send( output );
});

app.get('/users/:user', async (req, res) => {
    const output = await getUsers( req.params.user );
    res.status( output.status ).send( output );
});

app.post('/users', async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    };

    if (Object.values(user).filter(e => !e).length) {
        res.status(400).send({
            message: 'Must inform all fields',
            status: 400,
        });
        return;
    }

    const sql = "INSERT INTO users (name,email,password) VALUES (:name, :email, :password)";
    const rows = await conn.executeAsync(sql, user);
    res.status(201).send({
        status: 201,
        message: 'User created',
        result: {
            id: rows.insertId,
            ...user,
        },
    });
});

app.put('/users/:user', async (req, res) => {
    const id = req.params.user;

    const queries = Object.entries(req.body).map(async ([field, value]) => {
        const sql = `UPDATE users SET ${ field } = ? WHERE id = ?`;
        return await conn.executeAsync(sql, [ value, id ]);
    });

    await Promise.all(queries);
    
    req.body.user = id;
    res.status(200).send({
        message: 'User edited',
        status: 200,
        result: req.body,
    });
});

app.delete('/users/:user', async (req, res) => {
    const id = req.params.user;

    const sql = `DELETE FROM users WHERE id = ?`;
    await conn.executeAsync(sql, [ id ]);
    
    res.status(204).send({
        message: 'User deleted',
        status: 204,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})