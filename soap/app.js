const express = require('express');
const app = express();
const port = 4200;

const soap = require('soap');
// const xml = require('xml');

app.get('/', async (req, res) => {
    const url = 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso?WSDL';
    soap.createClient(url, (err, client) => {
        if (err) return console.log(err);

        client.NumberToWords({ ubiNum: "500" }, (err, result) => {
            if (err) return console.log(err);

            // res.set('Content-Type', 'text/xml');
            // res.send(xml(result));
            res.send(result);
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})