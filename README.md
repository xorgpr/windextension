# Wind Sports Helper

A Chrome extension that displays recommended equipment sizes (kites, wings, sails) directly on wind forecast websites — [**windguru.cz**](https://www.windguru.cz) and [**windfinder.com**](https://www.windfinder.com).

It injects an "Equipment Size" column into the forecast tables, calculated from wind speed, gust speed, and rider weight.

> **Beta version.** This extension provides recommendations only. See the [disclaimer](#disclaimer).

---

## How It Works

1. **Weight adaptation** — The base equipment chart (originally for a 75 kg rider) is scaled using `weightFactor = (riderWeight / 75) ^ 0.75`.
2. **Filtering** — An equipment size is valid if:
   - Current wind ≥ its minimum (you can power it up)
   - Gust wind ≤ its maximum (you won't get overpowered)
3. **Color indicators** — Valid sizes are shown with color-coded warnings:
   - **Red** — gusts > 95% of max (near limit)
   - **Orange** — gusts > 82% of max (high pull)
   - **Green** — normal range (OK)
   - **Light blue** — gusts < 65% of max (underloaded / lightwind)
4. **Edge cases** — `~` means too little wind for any equipment, `!!!` means overpower.

All wind values are expected in **knots (kts)**, rider weight in **kilograms (kg)**.

---

## Default Equipment Chart

The default chart is based on the [**Cabrinha Moto X wind range**](https://www.cabrinha.com/products/0-04-moto-x):

| Size (m²) | Min (kts) | Max (kts) |
|-----------|-----------|-----------|
| 4         | 26        | 39        |
| 5         | 24        | 37        |
| 6         | 21        | 35        |
| 7         | 19        | 33        |
| 8         | 15        | 30        |
| 9         | 13        | 28        |
| 10        | 12        | 25        |
| 11        | 11        | 22        |
| 12        | 9         | 20        |
| 14        | 7         | 17        |

You can fully customize this in the extension's **Options** page.

---

## Installation

### Load as unpacked extension (development)

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked**.
4. Select the `kitesize/` directory.
5. Navigate to [windguru.cz](https://www.windguru.cz) or [windfinder.com](https://www.windfinder.com) to see the injected equipment size column.

### Configure rider weight and equipment chart

1. Go to `chrome://extensions/` → **Wind Sports Helper** → **Details** → **Extension options**.
2. Set your weight in kg.
3. Add, edit, or remove equipment sizes in the table.
4. Click **Save** and refresh the forecast page.

---

## Supported Websites

| Website         | URL                        |
|-----------------|----------------------------|
| WindGuru        | `https://www.windguru.cz`  |
| Windfinder      | `https://www.windfinder.com` |

> ⚠️ The extension relies on the page structure of these websites. If they change their layout, the injection may break until updated.

---

## Permissions

| Permission  | Purpose |
|-------------|---------|
| `activeTab` | Read wind forecast data from the active tab on supported websites. |
| `storage`   | Save your rider weight and equipment chart locally between sessions. |

---

## Privacy

This extension **does not collect, store, or transmit any data** to external servers.

- Your weight and equipment chart are stored locally via `chrome.storage.local`.
- Wind and gust values are read directly from the forecast page DOM.
- All calculations run entirely within your browser.
- No analytics, no tracking, no telemetry, no network requests.

---

## Disclaimer

This is a **beta version** — use at your own risk.

The developer makes no guarantees about the accuracy of the calculations and is **not responsible** for any injuries, equipment damage, or other consequences arising from the use of this extension.

Always rely on your own judgment, experience, and local conditions when selecting equipment.

---

## License

MIT. See [LICENSE](LICENSE).

---

## Source

[github.com/xorgpr/windextension](https://github.com/xorgpr/windextension/)
