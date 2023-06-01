const express = require('express');
const fs = require('fs');
const app = express();
const mustacheExpress = require('mustache-express');
const promises = require('./route/promises');
const Calculator = require('./modules/calculator');
const { auth, upperAll } = require('./middleware');


// Serve static files
app.use(express.static('public'));

// set the view engine
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/public/html');


// servindo um arquivo estático
app.get('/go-rest', async (req, res) => {
    res.sendFile(__dirname + '/public/html/go-rest.html');
});


// servindo um arquivo estático usando template engine
app.get('/', async (req, res) => {
    const secret = require('./config.json').secret;
    const lorem = fs.readFileSync('./public/assets/lorem.txt');

    res.render('index', {
        foo: 'bar',
        num: 10,
        text: 'variáveis',
        secret,
        lorem,
    });
});


// calculator route that uses a class imported.
app.get('/calc', (req,res) => {
    const n1 = req.query.n1;
    const n2 = req.query.n2;
    const op = req.query.op;

    const calc = new Calculator(n1, n2);
    
    if (!calc[op]) {
        throw Error('Invalid Operation');
    }

    // calc.add()
    // calc.subtract()
    // ...
    const result = calc[op]();

    const opEnum = {
        add: '+',
        subtract: '-',
        multiply: 'x',
        divide: '÷',
    }

    res.render('calculator', {
        n1,
        n2,
        op: opEnum[op],
        result
    });
})


// app.post
// app.put
// app.delete
app.get('/upper', upperAll, async (req, res) => {
    res.send(req.query);
});


app.get('/service', auth, async (req, res) => {
    // perform service tasks
    res.send('service delivered');
});


// mount the router on the app
app.use('/promises', promises);


// handling errors
app.get('/error', async (req, res, next) => {
    try {
        const x = non_ecxiste;
        res.send('nunca vai acontecer');
    }
    catch(error) {
        next(error);
    }
});


// error handling middleware
app.use((err, req, res, next) => {
    // console.error(err.stack);
    res.status(500).send(err.message || 'Something broke!');
});


const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
app.listen(port, host, () => {
    console.log(`Example app listening on port ${port}`)
});