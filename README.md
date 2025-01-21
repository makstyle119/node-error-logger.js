# Node-Error-Logger.JS

> A simple and efficient Node.js package for logging errors and messages to files and the console.

## Features:
- Supports error, warning, and info logs.
- Logs messages with timestamps and severity levels.
- Saves logs to separate files based on date and level.
- Provides clear and concise API for logging.

## Installation:
```Bash
npm i node-error-logger.js
```

## Usage
1. Import the Logger module:
```JavaScript
const Logger = require('node-error-logger.js');
```
2. Use the provided logging functions:
```JavaScript
Logger.info('Application started successfully.');

// Log an error with an optional error object
const myError = new Error('Something went wrong!');
Logger.error('An error occurred!', myError);
```

## API:
- `Logger.info(message):` Logs an informational message.
- `Logger.warn(message):` Logs a warning message.
- `Logger.error(message, error):` Logs an error message. (Optional error object for stack trace)

## Example:
```JavaScript
const Logger = require('node-error-logger.js');

// Log messages throughout your application
Logger.info('Processing data...');

try {
  // Your application logic here
} catch (error) {
  Logger.error('An error occurred!', error);
}

Logger.warn('A potential issue might arise.');
```

## Benefits:
- Improves debugging by providing detailed logs.
- Helps monitor application behavior and identify errors.
- Easy to integrate into your Node.js projects.