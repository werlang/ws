document.querySelector('button').addEventListener('click', async () => {
    const name = document.querySelector('#name').value;
    const data = await fetch(`https://api.aulaws.localhost/greeting?name=${name}`).then(data => data.json());
    document.querySelector('#message').innerHTML = data.message;
});