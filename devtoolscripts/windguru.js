// WINDGURU
const weight = 65;

const BASE_WEIGHT = 75;
const DEFAULT_KITE_CHART = [
    { size: "4",  min: 26, max: 39 },
    { size: "5",  min: 24, max: 37 },
    { size: "6",  min: 21, max: 35 },
    { size: "7",  min: 19, max: 33 },
    { size: "8",  min: 15, max: 30 },
    { size: "9",  min: 13, max: 28 },
    { size: "10", min: 12, max: 25 },
    { size: "11", min: 11, max: 22 },
    { size: "12", min: 9,  max: 20 },
    { size: "14", min: 7,  max: 17 },
];

function getKiteSize(wind, gust, riderWeight = 65, kiteChart) {
    const chart = kiteChart || DEFAULT_KITE_CHART;

    if (!wind || !gust) return "N/A";

    // 1. Adapt the chart to rider weight
    const ratio = riderWeight / BASE_WEIGHT;
    const weightFactor = ratio; // Math.pow(ratio, 0.75);

    const personalChart = chart.map(k => ({
        size: k.size,
        min: k.min * weightFactor,
        max: k.max * weightFactor
    }));

    // 2. Filter suitable equipment
    // An item is valid if:
    // - Current wind is above its minimum (user can power it up)
    // - Gust wind is below its maximum (won't get overpowered)
    let validKites = personalChart.filter(k => 
        wind >= k.min && 
        gust <= k.max
    );

    if (validKites.length === 0) {
        if (wind < personalChart[personalChart.length - 1].min) return "~";
        return "!!!";
    }

    // 3. Sort from smallest to largest
    validKites.sort((a, b) => a.size - b.size);

    // 4. Build the result string with color indicators
    const resultStrings = validKites.map(k => {
        const loadFactor = gust / k.max;
        let color = "#2ecc71"; // Green (OK)

        if (loadFactor > 0.95) {
            color = "#ff0000ff"; // Red (limit)
        } else if (loadFactor > 0.82) {
            color = "#ffa500"; // Orange (high pull)
        } else if (loadFactor < 0.65) {
            color = "#00ff6aff"; // Light blue (lightwind for this size)
        }

        return `<span style="color: ${color};">${k.size}</span>`;
    });

    return resultStrings.join('<br>');
}

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

const chart = DEFAULT_KITE_CHART;

setInterval(() => windguru(weight, chart), 2000);
windguru(weight, chart);
