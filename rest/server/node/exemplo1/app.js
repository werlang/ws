const express = require('express');
const app = express();
const port = 4200;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota que serve um arquivo. Para as páginas do sistema
app.get('/', async (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

// Rota exemplo.
// exemplo: /foo
app.get('/foo', async (req, res) => {
    res.send({ message: 'bar' });
});

// recebe value como query param, return o valor elevado ao quadrado
// exemplo: /square?value=12
app.get('/square', async (req, res) => {
    const value = parseInt(req.query.value);
    if (value && !isNaN(value)) {
        res.send({ value: Math.pow(value, 2) });
        return;
    }
    res.status(400).send({ message: 'Value must be a number' });
});

// pega um usuário definido pelo id
// exemplo: /users/123
app.get('/users/:user', async (req, res) => {
    const user = req.params.user;

    const result = [];
    // pega informacoes do usuario no db. pões no array
    // SELECT * FROM users WHERE id = :user
    if (user == 123) {
        result.push({
            id: user,
            name: 'Pablo',
            email: 'pablowerlang@ifsul.edu.br',
        });
    }
    
    res.send({ result: result });
});

// método post insere user no db
// exemplo: [método POST] /users
// body: {
//     name: 'Pablo',
//     email: 'pablowerlang@ifsul.edu.br',
// }
app.post('/users', async (req, res) => {
    const user = req.body;

    if (!user.name || !user.email) {
        res.status(400).send({ message: 'Must inform all fields.' });
        return;
    }

    // INSERT INTO users (name, email) VALUES (?, ?);
    user.id = 1; //aqui uso o método do mysql pra pegar o id auto_increment

    res.status(201).send({
        message: 'User created',
        user: user,
    });
});

// se não entrar em nenhuma outra rota. Not found
app.use((req, res) => {
    res.status(404).send({ message: 'Nothing to be seen here.' });
    // res.status(404).sendFile(`${__dirname}/notfound.html`);

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})