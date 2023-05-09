const express = require('express');
const app = express();

const soap = require('soap');

// Serve static files
app.use(express.static('public'));

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.get('/number', async (req, res) => {
    const url = 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL';
    soap.createClient(url, (err, client) => {
        if (err) return console.log(err);

        client.NumberToWords({ ubiNum: req.query.number }, (err, result) => {
            if (err) return console.log(err);
            res.send({ result });
        });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})