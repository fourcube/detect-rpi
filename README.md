[![npm version](https://badge.fury.io/js/detect-rpi.svg)](https://badge.fury.io/js/detect-rpi)

# detect-rpi

Detect if Node.js is currently running on a Raspberry Pi (including Compute Modules and Pi Zero 2 W).

---

## Install

```bash
npm install detect-rpi --save
```

---

## Usage

```javascript
const isPi = require('detect-rpi');

if (isPi()) {
  console.log('Running on a Raspberry Pi!');
} else {
  console.log('Not running on a Pi.');
}
```

---

## API

The default export is a function that returns a boolean (`true` if running on a Pi, `false` otherwise).  
You can also access several helper functions:

### `isPi()`
Returns `true` if the system is a known Raspberry Pi.

### `isPi.model()`
Returns the string from the `Model` line of `/proc/cpuinfo`, or `null` if not found.

Example:
```text
"Raspberry Pi 4 Model B Rev 1.1"
```

### `isPi.revision()`
Returns the board revision code, or `null` if not available.

Example:
```text
"c03111"
```

### `isPi.info()`
Returns a structured object with all detection info:

```javascript
{
  isPi: true,
  model: "Raspberry Pi Zero 2 W Rev 1.0",
  hardware: "RP3A0",
  revision: "902120"
}
```

---

## Example

```javascript
const isPi = require('detect-rpi');

const info = isPi.info();

if (info.isPi) {
  console.log("Running on a Pi!");
  console.log("Model:   ", info.model);
  console.log("Hardware:", info.hardware);
  console.log("Revision:", info.revision);
} else {
  console.log("Not a Pi.");
}
```

---

## How it works

This module reads `/proc/cpuinfo` and:

- Checks the `Hardware`, `Model`, and `Revision` fields.
- Matches against known Raspberry Pi SoCs, including:
  - `BCM2708`, `BCM2835`, `BCM2711`, `BCM2712`, `RP3A0`, etc.
- Recognizes text like `"Raspberry Pi"` or `"Compute Module"` in the model string.

This works even on **64-bit Raspberry Pi OS Bookworm**, where the `Hardware` field is no longer present.

---

## Supported Models

Includes detection support for:

- Raspberry Pi 1–5
- Raspberry Pi Zero / Zero 2 W
- Compute Module 1–4
- RP3A0 (used in Pi Zero 2 W)
- BCM2712 (Raspberry Pi 5)
