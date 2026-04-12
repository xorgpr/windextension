const DEFAULT_CHART = [
    { size: 4,  min: 26, max: 39 },
    { size: 5,  min: 24, max: 37 },
    { size: 6,  min: 21, max: 35 },
    { size: 7,  min: 19, max: 33 },
    { size: 8,  min: 15, max: 30 },
    { size: 9,  min: 13, max: 28 },
    { size: 10, min: 12, max: 25 },
    { size: 11, min: 11, max: 22 },
    { size: 12, min: 9,  max: 20 },
    { size: 14, min: 7,  max: 17 },
];

const tbody = document.querySelector('#chartTable tbody');
const statusEl = document.getElementById('status');

function renderChart(chart) {
    tbody.innerHTML = '';
    chart.forEach((entry, i) => addRow(entry.size, entry.min, entry.max));
}

function addRow(size = '', min = '', max = '') {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="number" value="${size}" min="1" step="1"></td>
        <td><input type="number" value="${min}" min="0" step="1"></td>
        <td><input type="number" value="${max}" min="0" step="1"></td>
        <td><button class="delete-btn" title="Delete row">&times;</button></td>
    `;
    tr.querySelector('.delete-btn').addEventListener('click', () => tr.remove());
    tbody.appendChild(tr);
}

function readChart() {
    const rows = tbody.querySelectorAll('tr');
    const chart = [];
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const size = Number(inputs[0].value);
        const min = Number(inputs[1].value);
        const max = Number(inputs[2].value);
        if (size && min && max) {
            chart.push({ size, min, max });
        }
    });
    chart.sort((a, b) => a.size - b.size);
    return chart;
}

// Load weight + chart on open
chrome.storage.local.get(['riderWeight', 'kiteChart'], (result) => {
    document.getElementById('weightInput').value = result.riderWeight || 65;
    renderChart(result.kiteChart || DEFAULT_CHART);
});

// Save
document.getElementById('save').addEventListener('click', () => {
    const weight = Number(document.getElementById('weightInput').value);
    const chart = readChart();

    if (chart.length === 0) {
        statusEl.style.color = 'red';
        statusEl.textContent = 'Error: chart must have at least one valid row.';
        return;
    }

    // Validate: min < max for every row
    for (const entry of chart) {
        if (entry.min >= entry.max) {
            statusEl.style.color = 'red';
            statusEl.textContent = `Error: size ${entry.size} — Min must be less than Max.`;
            return;
        }
    }

    chrome.storage.local.set({ riderWeight: weight, kiteChart: chart }, () => {
        statusEl.style.color = 'green';
        statusEl.textContent = 'Settings saved! Refresh the forecast page to apply.';
    });
});

// Reset to defaults
document.getElementById('resetDefaults').addEventListener('click', () => {
    renderChart(DEFAULT_CHART);
    chrome.storage.local.remove('kiteChart');
    statusEl.style.color = 'green';
    statusEl.textContent = 'Chart reset to defaults. Click Save to apply.';
});

// Add row
document.getElementById('addRow').addEventListener('click', () => addRow());
