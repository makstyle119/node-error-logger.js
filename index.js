const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */

const appRoot = process.cwd();
const logDirectory = path.join(appRoot, 'logs');
const logLevels = ['info', 'warn', 'error'];

const defaultOptions = {
	json: false,
	rotate: false,
	maxSizeMB: 5
};

/* ================= HELPERS ================= */

const timestamp = () => new Date().toISOString();

const createLogDirectory = (level) => {
	const dir = path.join(logDirectory, level);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
};

const rotateIfNeeded = (file, options) => {
	if (!options.rotate || !fs.existsSync(file)) return;

	const { size } = fs.statSync(file);
	if (size < options.maxSizeMB * 1024 * 1024) return;

	const rotatedFile = file.replace('.log', `-${Date.now()}.log`);
	fs.renameSync(file, rotatedFile);
};

const serializeValue = (value) => {
	if (typeof value === 'string') return value;
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
};

/* ================= FORMATTER ================= */

const formatLog = (level, args, options) => {
	const time = timestamp();

	let message = '';
	let error = null;
	const meta = [];

	args.forEach(arg => {
		if (arg instanceof Error && !error) {
			error = arg;
		} else if (typeof arg === 'string' && !message) {
			message = arg;
		} else {
			meta.push(arg);
		}
	});

	if (!message) message = '[no message]';

	const payload = {
		timestamp: time,
		level,
		message
	};

	if (meta.length) payload.meta = meta;

	if (error) {
		payload.error = {
			name: error.name,
			message: error.message,
			stack: error.stack
		};
	}

	/* ---------- JSON MODE ---------- */
	if (options.json) {
		return JSON.stringify(payload) + '\n';
	}

	/* ---------- TEXT MODE ---------- */
	let output = `[${time}] [${level.toUpperCase()}] ${message}`;

	if (meta.length) {
		output += ' | ' + meta.map(serializeValue).join(' ');
	}

	if (error) {
		output += ` | ${error.message}\n${error.stack}`;
	}

	return output + '\n';
};

/* ================= CORE LOGGER ================= */

const log = (level, args, options = defaultOptions) => {
	createLogDirectory(level);

	const date = timestamp().slice(0, 10);
	const logFile = path.join(logDirectory, level, `${date}-${level}.log`);

	rotateIfNeeded(logFile, options);

	const entry = formatLog(level, args, options);

	if (process.env.NODE_ENV === 'test') {
		try {
			fs.appendFileSync(logFile, entry, 'utf8');
		} catch (err) {
			console.error('[node-error-logger] Failed to write log:', err.message);
		}
	} else {
		fs.appendFile(logFile, entry, 'utf8', (err) => {
			if (err) {
				console.error('[node-error-logger] Failed to write log:', err.message);
			}
		});
	}


	(console[level] || console.log)(entry.trim());
};

/* ================= DEFAULT EXPORT (BACKWARD COMPATIBLE) ================= */

const Logger = (...args) => log('info', args);

logLevels.forEach(level => {
	Logger[level] = (...args) => log(level, args);
});

/* ================= OPTIONAL FACTORY API ================= */

Logger.createLogger = (options = {}) => {
	const cfg = { ...defaultOptions, ...options };

	return {
		info: (...args) => log('info', args, cfg),
		warn: (...args) => log('warn', args, cfg),
		error: (...args) => log('error', args, cfg)
	};
};

module.exports = Logger;
