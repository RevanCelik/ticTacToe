let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

function init() {
    render();
}

function render() {
    let html = '<table>';

    for (let i = 0; i < 3; i++) {
        html += '<tr>';

        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let value = fields[index];

            let symbol = '';
            if (value === 'circle') symbol = 'O';
            if (value === 'cross') symbol = 'X';

            html += `<td>${symbol}</td>`;
        }

        html += '</tr>';
    }

    html += '</table>';

    document.getElementById('container').innerHTML = html;
}