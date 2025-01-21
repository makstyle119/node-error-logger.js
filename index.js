const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "logs");

const createLogDirectory = () => {
	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory, { recursive: true });
	}
};

const getTimestamp = () => new Date().toISOString();

const log = (level, message) => {
	const date = new Date().toISOString().slice(0, 10);
	const logFile = path.join(logDirectory, `${date}-${level}.log`);
	const logEntry = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}\n`;

  	createLogDirectory(); // Ensure directory exists before writing

	fs.appendFile(logFile, logEntry, "utf8", (err) => {
		if (err) {
			console.error(
				`[LoggerService] Failed to write to ${logFile}: ${err.message}`
			);
		}
	});

	console[level](logEntry.trim());
};

// Handle default logging level (info)
const Logger = (message) => {
	if (typeof message === "string") {
		log("info", message);
	} else {
		throw new Error("Invalid log message. Expected a string.");
	}
};

Logger.info = (message) => log("info", message);
Logger.warn = (message) => log("warn", message);
Logger.error = (message, error) => {
	const errorMessage = error ? `${message} | Stack: ${error.stack}` : message;
	log("error", errorMessage);
};

module.exports = Logger;
