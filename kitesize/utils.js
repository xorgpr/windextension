function getKiteSize(wind, gust, riderWeight = 65) {
    const BASE_WEIGHT = 75;

    const MIN_WIND = 7;
    const MAX_SAFE_GUST = 35;
    const MAX_SAFE_WIND = 38;
    const MAX_SPREAD = 12;

    const kiteChart = [
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

    const availableSizes =
        kiteChart
            .map(k => k.size)
            .sort((a, b) => a - b);

    function getNearestBalancedSize(size) {
        let nearest = availableSizes[0];

        for (let s of availableSizes) {
            if (Math.abs(s - size) <
                Math.abs(nearest - size)) {

                nearest = s;
            }
        }

        return nearest;
    }

    if (!wind || !gust)
        return null;

    if (wind < MIN_WIND)
        return 'no wind';

    if (gust >= MAX_SAFE_GUST || wind > MAX_SAFE_WIND)
        return '⚠️';

    const spread = gust - wind;

    if (spread >= MAX_SPREAD)
        return '⚠️';

    let gustFactor = 0.3;

    if (spread >= 8)
        gustFactor = 0.4;

    if (spread >= 10)
        gustFactor = 0.5;

    let effectiveWind =
        wind + spread * gustFactor;

    if (spread >= 9)
        effectiveWind += 1;

    const candidates =
        kiteChart.filter(k =>
            effectiveWind >= k.min &&
            effectiveWind <= k.max &&
            gust <= k.max
        );

    if (candidates.length === 0)
        return null;

    const recommended =
        candidates
            .sort((a, b) =>
                a.size - b.size
            )[0];

    const ratio = riderWeight / BASE_WEIGHT;

    const safeRatio =
        Math.max(0.7,
        Math.min(1.4, ratio));

    const weightFactor = Math.pow(safeRatio, 0.8);

    let adjustedSize = recommended.size * weightFactor;

    adjustedSize = getNearestBalancedSize(adjustedSize);

    if (effectiveWind > 27 && spread >= 8) {
        const index = availableSizes.indexOf(adjustedSize);

        if (index > 0) {
            adjustedSize = availableSizes[index - 1];
        }
    }

    return adjustedSize + 'm';
}
