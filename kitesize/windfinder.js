function windfinder(riderWeight, kiteChart) {
    // Get all forecast rows in the table
    const rows = document.querySelectorAll('.fc-table-horizon');

    rows.forEach(row => {
        const wsText = row.querySelector('.cell-ws .unit')?.innerText;
        const wgText = row.querySelector('.cell-wg .unit')?.innerText;

        if (wsText && wgText) {
            const wind = parseInt(wsText);
            const gust = parseInt(wgText);
            const kite = getKiteSize(wind, gust, riderWeight, kiteChart);

            // Add or update custom equipment size cell
            let kiteCell = row.querySelector('.custom-kite-cell');
            if (!kiteCell) {
                kiteCell = document.createElement('div');
                kiteCell.className = 'custom-kite-cell';
                row.appendChild(kiteCell);
            }

            // Style the cell
            kiteCell.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                line-height: 0.8;
                font-size: 13px;
                padding: 4px 0;
            `;

            kiteCell.innerHTML = kite ? `${kite}` : '—';
        }
    });
}

chrome.storage.local.get(['riderWeight', 'kiteChart'], (result) => {
    const weight = result.riderWeight || 65;
    const chart = result.kiteChart || undefined;

    setInterval(() => windfinder(weight, chart), 2000);
    windfinder(weight, chart);
});
