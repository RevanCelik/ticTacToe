let fields = [
    null, null, null,
    null, null, null,
    null, null, null
];

let currentPlayer = 'circle';  // Track whose turn it is

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
            if (value === 'circle') symbol = createCircleHTML();
            if (value === 'cross') symbol = createCrossHTML();

            // Add onclick only if the field is empty
            let onclickAttr = '';
            if (value === null) {
                onclickAttr = `onclick="cellClicked(${index}, this)"`;
            }

            html += `<td ${onclickAttr}>${symbol}</td>`;
        }

        html += '</tr>';
    }

    html += '</table>';

    document.getElementById('container').innerHTML = html;
}

// Returns an inline SVG string for a 70x70 animated circle (color: #00B0EF)
function createCircleHTML() {
    // radius chosen so stroke fits inside 70x70 viewport
    const r = 22;
    const c = Math.PI * 2 * r; // circumference
    return `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="35" cy="35" r="${r}" stroke="#00B0EF" stroke-width="8" fill="none"
            stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}">
            <animate attributeName="stroke-dashoffset" from="${c}" to="0" dur="0.125s" begin="0s" fill="freeze" />
        </circle>
    </svg>
    `;
}

// Returns an inline SVG string for a 70x70 animated cross (color: #FFC000)
function createCrossHTML() {
    // approximate line length for the diagonal
    const len = 72;
    return `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <line x1="10" y1="10" x2="60" y2="60" stroke="#FFC000" stroke-width="8" stroke-linecap="round"
            stroke-dasharray="${len}" stroke-dashoffset="${len}">
            <animate attributeName="stroke-dashoffset" from="${len}" to="0" dur="0.125s" begin="0s" fill="freeze" />
        </line>
        <line x1="60" y1="10" x2="10" y2="60" stroke="#FFC000" stroke-width="8" stroke-linecap="round"
            stroke-dasharray="${len}" stroke-dashoffset="${len}">
            <animate attributeName="stroke-dashoffset" from="${len}" to="0" dur="0.125s" begin="0.02s" fill="freeze" />
        </line>
    </svg>
    `;
}

// Called when a player clicks on an empty td element
function cellClicked(index, element) {
    // Place the current player's symbol in the fields array
    fields[index] = currentPlayer;

    // Get the HTML for the current player's symbol
    let symbolHTML = '';
    if (currentPlayer === 'circle') {
        symbolHTML = createCircleHTML();
    } else if (currentPlayer === 'cross') {
        symbolHTML = createCrossHTML();
    }

    // Set the innerHTML of the clicked element
    element.innerHTML = symbolHTML;

    // Remove the onclick attribute from this element
    element.removeAttribute('onclick');

    // Check if game is over
    checkGameOver();

    // Toggle the current player for the next turn
    currentPlayer = (currentPlayer === 'circle') ? 'cross' : 'circle';
}

// Check if the game is over (someone won)
function checkGameOver() {
    // All possible winning combinations (3 in a row)
    const winPatterns = [
        [0, 1, 2],  // top row
        [3, 4, 5],  // middle row
        [6, 7, 8],  // bottom row
        [0, 3, 6],  // left column
        [1, 4, 7],  // middle column
        [2, 5, 8],  // right column
        [0, 4, 8],  // diagonal top-left to bottom-right
        [2, 4, 6]   // diagonal top-right to bottom-left
    ];

    // Check each winning pattern
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (fields[a] !== null && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Found a winner
            drawVictoryLine(pattern);
            return;
        }
    }
}

// Draw a white line connecting the 3 winning cells
function drawVictoryLine(pattern) {
    const [a, b, c] = pattern;

    // Get the table element and its position
    const table = document.querySelector('table');
    const tableRect = table.getBoundingClientRect();

    // Calculate positions of the winning cells
    const getCellCenter = (index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        // Each cell is 80px wide/tall with 5px borders
        // With border-collapse, cells are adjacent
        const x = col * 85 + 42.5;  // Center of cell
        const y = row * 85 + 42.5;
        return { x, y };
    };

    const start = getCellCenter(a);
    const end = getCellCenter(c);

    // Create SVG overlay for the victory line
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'victory-line');
    svg.setAttribute('width', '300');
    svg.setAttribute('height', '300');
    svg.setAttribute('viewBox', '0 0 300 300');
    svg.setAttribute('style', `position: fixed; top: ${tableRect.top}px; left: ${tableRect.left}px; pointer-events: none; z-index: 10;`);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', start.x);
    line.setAttribute('y1', start.y);
    line.setAttribute('x2', end.x);
    line.setAttribute('y2', end.y);
    line.setAttribute('stroke', 'white');
    line.setAttribute('stroke-width', '5');
    line.setAttribute('stroke-linecap', 'round');

    svg.appendChild(line);

    // Add SVG to body so it positions over everything
    document.body.appendChild(svg);
}

// Call this at the start of restartGame to remove the line if it exists
function removeVictoryLine() {
    const line = document.getElementById('victory-line');
    if (line) {
        line.parentNode.removeChild(line);
    }
}

function restartGame() {
    fields = [
        null, null, null,
        null, null, null,
        null, null, null
    ];

    removeVictoryLine(); // Remove the victory line if it exists

    render();
}