function windguru(riderWeight, kiteChart) {
    const containers = document.querySelectorAll('.obal');

    containers.forEach(container => {
        // --- Step 0: Clean up from previous script runs ---
        // Find and remove our injected rows in both tables
        const oldLegendRow = container.querySelector('.table_legend tr.param.KITESIZE');
        if (oldLegendRow) oldLegendRow.remove();

        const oldDataRow = container.querySelector('.tabulka tr.param.KITESIZE');
        if (oldDataRow) oldDataRow.remove();


        // 1. Find rows in the Legend table (left) and Data table (right)
        const legendWindRow = container.querySelector('.table_legend tr.param.WINDSPD');
        const dataWindRow = container.querySelector('.tabulka tr.param.WINDSPD');
        const dataGustRow = container.querySelector('.tabulka tr.param.GUST');

        if (!legendWindRow || !dataWindRow || !dataGustRow) return;

        // --- Step 2: Update the left column (Legend) ---
        // Clone the wind row to preserve height and layout
        const newLegendRow = legendWindRow.cloneNode(true);
        newLegendRow.className = 'param KITESIZE';
        newLegendRow.id = newLegendRow.id.replace('WINDSPD', 'KITESIZE');

        // Change the text
        const titleCell = newLegendRow.querySelector('td');
        if (titleCell) {
            titleCell.innerHTML = 'Kite Size';
        }
        legendWindRow.parentNode.appendChild(newLegendRow);

        // --- Step 3: Update the right grid (Data) ---
        const newDataRow = dataWindRow.cloneNode(true);
        newDataRow.className = 'trow param KITESIZE';
        newDataRow.id = newDataRow.id.replace('WINDSPD', 'KITESIZE');

        const windCells = dataWindRow.querySelectorAll('td');
        const gustCells = dataGustRow.querySelectorAll('td');
        const kiteCells = newDataRow.querySelectorAll('td');

        // Iterate over each cell in the row
        kiteCells.forEach((cell, index) => {
            // Clear background colors copied from wind speed
            cell.style.backgroundColor = '';

            // If this is a narrow separator cell (between days), leave it empty
            if (cell.classList.contains('spacer')) {
                cell.innerHTML = '';
                return;
            }

            // Get data
            const windText = windCells[index]?.innerText;
            const gustText = gustCells[index]?.innerText;

            const wind = parseInt(windText);
            const gust = parseInt(gustText);

            // If data exists, calculate equipment size
            if (!isNaN(wind) && !isNaN(gust)) {
                const kite = getKiteSize(wind, gust, riderWeight, kiteChart);

                // Apply styles to the cell
                cell.innerHTML = kite || '—';
                cell.style.cssText = `
                    text-align: center;
                    font-size: 11px;
                    vertical-align: top;
                `;
            } else {
                cell.innerHTML = '';
            }
        });

        // Add the new row to the end of the data table
        dataWindRow.parentNode.appendChild(newDataRow);
    });
}

chrome.storage.local.get(['riderWeight', 'kiteChart'], (result) => {
	const weight = result.riderWeight || 65;
	const chart = result.kiteChart || undefined;

	setInterval(() => windguru(weight, chart), 2000);
	windguru(weight, chart);
});