const DEFAULT_KITE_CHART = [
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

function getKiteSize(wind, gust, riderWeight = 65, kiteChart) {
    const BASE_WEIGHT = 75;

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
