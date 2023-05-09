const button = document.querySelector('button');
const input = document.querySelector('input');

const conversions = {};

button.addEventListener('click', async () => {
    button.disabled = true;
    button.textContent = 'Wait...';

    try {
        const query = new URLSearchParams({ number: input.value });
        const data = await fetch(`/number?${ query }`).then(res => res.json());
        conversions[ input.value ] = data.result.NumberToWordsResult;
        refresh();
    }
    catch (error) {
        console.log(error);
    }


    button.disabled = false;
    button.textContent = 'Convert';
});

function refresh() {
    const list = document.querySelector('ul');
    list.innerHTML = '';

    for (const number in conversions) {
        const item = document.createElement('li');
        item.innerHTML = `<span class="number">${ number }</span>: ${ conversions[number] }`;
        list.appendChild(item);
    }

    input.value = '';
    input.focus();
}