const mysql = require('mysql2');
const configFile = require('./config.json');

const conn = mysql.createConnection({
    namedPlaceholders: true,
    ...configFile.mysql
});

async function query(sql, data) {
    return await new Promise(resolve => conn.execute(sql, data, (err, results, fields) => {
        if (err) {
            console.error(err);
            resolve(false);
            return;
        }

        resolve(results)
    }));
}

module.exports = query;