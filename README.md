# windextension

Simple JavaScript script to estimate kite size based on **wind speed** and **gusts**.

The algorithm calculates a recommended kite size using:

- average wind speed
- gust speed
- rider weight
- safety limits for gust spread
- adaptive wind correction

Wind values must be provided in **knots (kts)**.

---

## Data Source

The base kite size chart used in this script is taken from:

**Cabrinha Moto X wind range chart**

https://www.cabrinha.com/products/0-04-moto-x

Wind ranges in the chart are defined for a **75 kg rider** and expressed in **knots**.

---

## Units

All wind values must be provided in:

- **Wind speed:** knots (kts)
- **Gust speed:** knots (kts)
- **Rider weight:** kilograms (kg)

Example:

```js
getKiteSize(8, 12, 65)
```