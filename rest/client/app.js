const express = require('express');
const fetch = require('node-fetch'); // instalar versão 2.x
const fs = require('fs');
const app = express();
const port = 4200;

app.get('/', async (req, res) => {
    const url = 'https://gorest.co.in/public/v2/users';
    const resp = await fetch(url);
    res.send(await resp.json());
});

app.post('/users', async (req, res) => {
    const url = 'https://gorest.co.in/public/v2/users';
    // USE UM ARQUIVO EXTERNO E COLOQUE ELE NO GITIGNORE
    const key = JSON.parse(fs.readFileSync('config.json')).apiKey;

    const body = {
        name: 'Foo Bar Silva',
        email: 'foo@bar.ifsul.edu.br',
        gender: 'male',
        status: 'active',
    };

    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ key }`,
        },
        body: body,
    });
    res.send(await resp.json());
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})