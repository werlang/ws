const express = require('express');
const fetch = require('node-fetch'); // instalar versão 2.x

// create a router instance
const router = express.Router();

// define routes on the router
router.get('/', (req, res) => {
    res.send('Hello, world!');
});


router.get('/await', async (req,res) => {
    const users = [];

    const url = `https://gorest.co.in/public/v2`;

    let time = Date.now();

    for (let i=1 ; i<=5 ; i++) {
        const query = new URLSearchParams({ page: i }).toString();
        const data = await fetch(`${url}/users?${query}`).then(data => data.json());
        users.push(...data);
    }

    res.send({
        time: Date.now() - time,
        users,
    })
});


router.get('/async', async (req,res) => {
    const users = [];

    const url = `https://gorest.co.in/public/v2`;

    let time = Date.now();

    for (let i=1 ; i<=5 ; i++) {
        const query = new URLSearchParams({ page: i }).toString();
        const promise = fetch(`${url}/users?${query}`);
        users.push(promise);
    }

    // // Approach 1: Promises in sequence
    // let responses = await Promise.all(users);
    // responses = responses.map(r => r.json());
    // responses = await Promise.all(responses);
    // const data = [];
    // responses.forEach(r => data.push(...r))

    // // Approach 2: Promise Object
    // let responses = users.map(async call => {
    //     return new Promise(resolve => {
    //         call.then(dataRaw => {
    //             dataRaw.json().then(data => {
    //                 resolve(data);
    //             })
    //         });
    //     })
    // });
    // const data = [];
    // (await Promise.all(responses)).forEach(r => data.push(...r))

    // // Approach 3: One liner
    // const data = (await Promise.all((await Promise.all(users)).map(r => r.json()))).reduce((p,c) => [...p, ...c], [])


    res.send({
        time: Date.now() - time,
        users: data,
    })
});

module.exports = router;


