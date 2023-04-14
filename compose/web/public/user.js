document.querySelector('#add').addEventListener('click', async () => {
    const name = document.querySelector('#name').value;
    const data = await fetch(`https://api.aulaws.localhost/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    }).then(data => data.json());
    document.querySelector('#message').innerHTML = data.message;
});

document.querySelector('#find').addEventListener('click', async () => {
    const name = document.querySelector('#name').value;
    if (!name.length) return;
    const data = await fetch(`https://api.aulaws.localhost/user/${name}`).then(data => data.json());
    console.log(data)
    if (!data.message.length) {
        document.querySelector('#message').innerHTML = 'No users found';
        return;
    }
    const message = data.message.map(user => `<li>${user.name}</li>`).join('');
    document.querySelector('#message').innerHTML = `<ul>${message}</ul>`
});