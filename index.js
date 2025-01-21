const fs = require('fs');
const path = require('path');

const appRoot = path.dirname(require.main.filename); 

const logDirectory = path.join(appRoot, 'logs');
const logLevels = ['info', 'warn', 'error'];

const createLogDirectory = (level) => {
	const levelDir = path.join(logDirectory, level);
		if (!fs.existsSync(levelDir)) {
		fs.mkdirSync(levelDir, { recursive: true });
	}
};

const getTimestamp = () => new Date().toISOString();

const log = (level, message) => {
	createLogDirectory(level); // Ensure directory exists for the level

	const date = new Date().toISOString().slice(0, 10);
	const logFile = path.join(logDirectory, level, `${date}-${level}.log`);
	const logEntry = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}\n`;

	fs.appendFile(logFile, logEntry, 'utf8', (err) => {
		if (err) {
			console.error(`[LoggerService] Failed to write to ${logFile}: ${err.message}`);
		}
	});
	console[level](logEntry.trim()); 
};

// Handle default logging level (info)
const Logger = (message) => {
	if (typeof message === 'string') {
		log('info', message); 
	} else {
		throw new Error('Invalid log message. Expected a string.');
	}
};

// Add logging functions for each level
logLevels.forEach(level => {
	Logger[level] = (message) => log(level, message);
});

module.exports = Logger;