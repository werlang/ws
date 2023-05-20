// menu action
document.querySelectorAll('#menu .item').forEach(e => e.addEventListener('click', () => {
    document.querySelectorAll('.box').forEach(e => e.classList.remove('active'));
    document.querySelector(`#${ e.id }.box`).classList.add('active');

    document.querySelectorAll('#menu .item').forEach(e => e.classList.remove('active'));
    e.classList.add('active');
}));


document.querySelector(`#get-all.item`).click();


const url = 'https://gorest.co.in/public/v2';
let token = localStorage.getItem('token');

// get all users
document.querySelector('#get-all.box #get').addEventListener('click', async () => {
    const args = {};
    if (token) args.headers = { authorization: `Bearer ${ token }` };
    const users = await fetch(`${url}/users`, args).then(data => data.json());
    
    const list = document.querySelector('#get-all.box #list');
    list.innerHTML = '';
    users.forEach(user => {
        const div = document.createElement('div');
        div.innerHTML = `<span>${user.id}</span><span>${user.name}</span><span>${user.email}</span>`;
        list.appendChild(div);
    });
});


// get single user
document.querySelector('#get.box #get').addEventListener('click', async () => {
    const args = {};
    if (token) args.headers = { authorization: `Bearer ${ token }` };
    const id = document.querySelector('#get.box #id').value;
    const list = document.querySelector('#get.box #list');

    if (!id.length) {
        list.innerHTML = 'Informe o id do usuário';
        return;
    }

    const user = await fetch(`${url}/users/${id}`, args).then(data => data.json());
    
    list.innerHTML = '';
    for (let i in user) {
        const div = document.createElement('div');
        div.innerHTML = `<span>${i}</span><span>${user[i]}</span>`;
        list.appendChild(div);
    }
});


// create user
document.querySelector('#register.box #insert').addEventListener('click', async () => {
    const name = document.querySelector('#register.box #name').value;
    const email = document.querySelector('#register.box #email').value;
    const gender = document.querySelector('#register.box #gender').value;
    const list = document.querySelector('#register.box #list');

    try {
        let result = await fetch(`${url}/users`, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${ token }`,
                contentType: 'x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                name,
                email,
                gender,
                status: 'active',
            }),
        });
       
        if (result.status === 401) {
            token = prompt('Informe o token');
            if (token) localStorage.setItem('token', token);
            return;
        }
        else if (result.status !== 201) {
            const error = await result.json();
            list.innerHTML = JSON.stringify(error);
            return;
        }

        result = await result.json();
        console.log(result)

        list.innerHTML = '';
        for (let i in result) {
            const div = document.createElement('div');
            div.innerHTML = `<span>${i}</span><span>${result[i]}</span>`;
            list.appendChild(div);
        }
    }
    catch (err) {
        console.log(err);
    }
});


// edit user
document.querySelector('#edit.box #btn-edit').addEventListener('click', async () => {
    const id = document.querySelector('#edit.box #id').value;
    const name = document.querySelector('#edit.box #name').value;
    const email = document.querySelector('#edit.box #email').value;
    const list = document.querySelector('#edit.box #list');

    if (!id.length) {
        list.innerHTML = 'Informe o id do usuário';
        return;
    }

    const body = {};
    
    if (name.length) body.name = name;
    if (email.length) body.email = email;

    try {
        let result = await fetch(`${url}/users/${id}`, {
            method: 'PUT',
            headers: {
                authorization: `Bearer ${ token }`,
                contentType: 'x-www-form-urlencoded',
            },
            body: new URLSearchParams(body),
        });
       
        if (result.status === 401) {
            token = prompt('Informe o token');
            if (token) localStorage.setItem('token', token);
            return;
        }
        else if (result.status !== 200) {
            const error = await result.json();
            list.innerHTML = JSON.stringify(error);
            return;
        }

        result = await result.json();

        list.innerHTML = '';
        for (let i in result) {
            const div = document.createElement('div');
            div.innerHTML = `<span>${i}</span><span>${result[i]}</span>`;
            list.appendChild(div);
        }

        console.log(result)
    }
    catch (err) {
        console.log(err);
    }
});


// delete user
document.querySelector('#remove.box #get').addEventListener('click', async () => {
    const id = document.querySelector('#remove.box #id').value;
    const list = document.querySelector('#remove.box #list');

    if (!id.length) {
        list.innerHTML = 'Informe o id do usuário';
        return;
    }
    
    const result = await fetch(`${url}/users/${id}`, {
        method: 'DELETE',
        headers: { authorization: `Bearer ${ token }` },
    })
    
    if (result.status === 401) {
        token = prompt('Informe o token');
        if (token) localStorage.setItem('token', token);
        return;
    }
    else if (result.status !== 204) {
        const error = await result.json();
        list.innerHTML = JSON.stringify(error);
        return;
    }

    list.innerHTML = 'Usuário removido com sucesso';

});