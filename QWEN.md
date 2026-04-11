# QWEN.md — Wind Extension (Kite Helper)

## Project Overview

**Wind Extension** is a Chrome browser extension (Manifest V3) that displays recommended kite sizes directly on wind forecast websites (**windguru.cz** and **windfinder.com**). It injects a "Kite Size" column into the forecast tables, calculated from wind speed, gust speed, and rider weight.

The kite size calculation algorithm is based on the **Cabrinha Moto X wind range chart** for a 75 kg rider, with adaptive weight correction.

## Architecture

```
windextension/
├── script.js              # Standalone kite size algorithm (reference/clean version)
├── script-windguru.js     # (Unused legacy — see kitesize/windguru.js)
├── script-windfinder.js   # (Unused legacy — see kitesize/windguru.js)
└── kitesize/              # Chrome extension source
    ├── manifest.json      # Extension manifest (MV3)
    ├── utils.js           # Core getKiteSize() algorithm (active version, with commented alternatives)
    ├── windguru.js        # Content script for windguru.cz
    ├── windfinder.js      # Content script for windfinder.com
    ├── options.html       # Settings page
    └── options.js         # Settings logic (save/load rider weight)
```

### Key Components

| File | Purpose |
|------|---------|
| `kitesize/utils.js` | Contains the active `getKiteSize(wind, gust, riderWeight)` function plus several commented-out alternative algorithm versions for experimentation |
| `kitesize/windguru.js` | Content script that injects a "Kite Size" row into windguru.cz forecast tables. Runs on `https://www.windguru.cz/*` |
| `kitesize/windfinder.js` | Content script that injects a "Kite Size" cell into windfinder.com forecast rows. Runs on `https://www.windfinder.com/*` |
| `kitesize/options.html` / `options.js` | Extension options page where the user sets their rider weight (30–150 kg). Persisted via `chrome.storage.local` |

## Kite Size Algorithm

The algorithm in `utils.js` (active, uncommented version) works as follows:

1. **Weight adaptation**: The Cabrinha chart (for 75 kg) is scaled using `weightFactor = pow(riderWeight / 75, 0.75)`.
2. **Filtering**: Kites are valid if `wind >= min` and `gust <= max` in the weight-adjusted chart.
3. **Selection**: Returns all valid kite sizes sorted smallest-to-largest, with warning markers:
   - `!!` — gust > 95% of kite max
   - `!` — gust > 85% of kite max
   - `*` — gust < 60% of kite max (underloaded)
4. **Edge cases**: Returns `~` if too little wind, `!!!` if overpower.

All wind values are expected in **knots (kts)**, rider weight in **kilograms (kg)**.

The file also contains several commented-out alternative algorithm implementations for reference/testing.

## Building and Running

### Load as Chrome Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the `kitesize/` directory.
5. Navigate to [windguru.cz](https://www.windguru.cz) or [windfinder.com](https://www.windfinder.com) to see the injected kite size column.

### Configure Rider Weight

- Click the extension icon → **Options** (or go to `chrome://extensions/` → Kite Helper → Details → Extension options).
- Set your weight in kg and click **Сохранить** (Save).

## Development Notes

- **No build step**: The extension runs plain JavaScript — no bundlers, transpilers, or dependencies.
- **Polling**: Both content scripts use `setInterval(..., 2000)` to re-inject kite sizes every 2 seconds (handles dynamic page updates).
- **Commented algorithms**: `utils.js` contains multiple commented-out versions of `getKiteSize()`. These appear to be iterative experiments with different weighting factors, gust influences, and selection strategies. The active version is the first uncommented function.
- **Root scripts**: `script.js`, `script-windguru.js`, and `script-windfinder.js` in the project root appear to be legacy/backup files and are **not** part of the extension.

## Permissions

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access the active tab's DOM for injection |
| `storage` | Persist rider weight across sessions |
