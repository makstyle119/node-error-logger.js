# Node-Error-Logger.js

![CI](https://github.com/makstyle119/node-error-logger.js/actions/workflows/test.yml/badge.svg)

> A lightweight, zero-dependency logger for Node.js with file logging, error stacks, and console-style usage.

This package is designed for developers who want **simple, predictable logging** without pulling in large logging frameworks.

---

## ✨ Features

* ✅ Zero dependencies
* ✅ Supports `info`, `warn`, and `error` levels
* ✅ Console-style logging (multiple arguments like `console.log`)
* ✅ Automatic error stack trace logging
* ✅ Logs stored by **date and level**
* ✅ Optional JSON logs (production-friendly)
* ✅ Optional size-based log rotation
* ✅ Async, non-blocking file writes
* ✅ Backward compatible across all v1.x versions

---

## 📦 Installation

```bash
npm i node-error-logger.js
```

---

## 🚀 Basic Usage (Backward Compatible)

```js
const Logger = require('node-error-logger.js');

Logger.info('Application started');
Logger.warn('Low memory warning');
Logger.error('Something went wrong');
```

This works exactly the same as earlier versions.

---

## 🧩 Multiple Arguments (Console-style)

Just like `console.log`, you can pass multiple values:

```js
Logger.info('User created', userId, userData);
Logger.warn('Invalid input', { field: 'email' });
```

Extra values are treated as **metadata**.

---

## ❌ Error Object Support (Automatic)

Pass an `Error` anywhere in the arguments:

```js
try {
  throw new Error('Database connection failed');
} catch (err) {
  Logger.error('Unhandled exception', err, { retry: false });
}
```

✔ Logs the error message
✔ Logs the full stack trace
✔ No extra configuration required

---

## 📂 Log Output Structure

Logs are written to the application root:

```
logs/
 ├── info/
 │   └── 2025-01-01-info.log
 ├── warn/
 │   └── 2025-01-01-warn.log
 └── error/
     └── 2025-01-01-error.log
```

---

## 🧪 JSON Logging Mode (Optional)

Ideal for production environments and log processors.

```js
const Logger = require('node-error-logger.js');

const logger = Logger.createLogger({ json: true });

logger.error('Payment failed', new Error('timeout'), { orderId: 123 });
```

### Example JSON Output

```json
{
  "timestamp": "2025-01-01T12:00:00.000Z",
  "level": "error",
  "message": "Payment failed",
  "meta": [{ "orderId": 123 }],
  "error": {
    "name": "Error",
    "message": "timeout",
    "stack": "..."
  }
}
```

---

## 🔁 Log Rotation (Optional)

Enable size-based log rotation to prevent large log files.

```js
const logger = Logger.createLogger({
  rotate: true,
  maxSizeMB: 10
});
```

* Rotation is **disabled by default**
* Old files are renamed with a timestamp

---

## 🛠 API Reference

### `Logger.info(...args)`

Logs informational messages.

### `Logger.warn(...args)`

Logs warnings.

### `Logger.error(...args)`

Logs errors and automatically captures stack traces when an `Error` is provided.

### `Logger.createLogger(options)`

Creates a new logger instance with custom options.

#### Options

| Option      | Type    | Default | Description                       |
| ----------- | ------- | ------- | --------------------------------- |
| `json`      | boolean | `false` | Enable JSON log output            |
| `rotate`    | boolean | `false` | Enable size-based log rotation    |
| `maxSizeMB` | number  | `5`     | Max log file size before rotation |

---

## 🔒 Backward Compatibility Guarantee

All existing usage patterns are **fully supported** in all `v1.x` releases.

New features are:

* optional
* opt-in
* non-breaking

---

## ❗ What This Package Is (and Is Not)

### ✅ This package is:

* Simple
* Lightweight
* Predictable
* Ideal for small services, scripts, and APIs

### ❌ This package is NOT:

* A replacement for Winston or Pino.
* A plugin-based logging framework.
* Designed for massive distributed systems.

If you need advanced transports or integrations, a full-featured logger may be a better fit.

---

## 📄 License

MIT © Mohammad Moiz Ali (MAKSTYLE119)
