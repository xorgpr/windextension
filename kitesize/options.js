const tbody = document.querySelector('#chartTable tbody');
const statusEl = document.getElementById('status');

function renderChart(chart) {
    tbody.innerHTML = '';
    chart.forEach((entry, i) => addRow(entry.size, entry.min, entry.max));
}

function addRow(size = '', min = '', max = '') {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${size}" min="1" step="1"></td>
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
        const size = inputs[0].value;
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
    renderChart(result.kiteChart || DEFAULT_KITE_CHART);
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
    renderChart(DEFAULT_KITE_CHART);
    chrome.storage.local.remove('kiteChart');
    statusEl.style.color = 'green';
    statusEl.textContent = 'Chart reset to defaults. Click Save to apply.';
});

// Add row
document.getElementById('addRow').addEventListener('click', () => addRow());
