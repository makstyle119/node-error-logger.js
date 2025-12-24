const fs = require('fs');
const path = require('path');
const Logger = require('../index');

const projectRoot = process.cwd();
const logsDir = path.join(projectRoot, 'logs');

const waitForLog = (level) => {
    const levelDir = path.join(logsDir, level);

    for (let i = 0; i < 20; i++) {
        if (fs.existsSync(levelDir)) {
            const files = fs.readdirSync(levelDir);
            if (files.length) {
                const latest = files.sort().pop();
                return fs.readFileSync(path.join(levelDir, latest), 'utf8');
            }
        }
        Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50);
    }

    throw new Error(`Log file not found for level: ${level}`);
};

describe('node-error-logger.js', () => {

    beforeAll(() => {
        jest.spyOn(console, 'info').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });


    test('logs info message to file', () => {
        Logger.info('Info test message');

        const content = waitForLog('info');
        expect(content).toContain('Info test message');
        expect(content).toContain('[INFO]');
    });

    test('logs warning with metadata', () => {
        Logger.warn('Warn test', { userId: 123 });

        const content = waitForLog('warn');
        expect(content).toContain('Warn test');
        expect(content).toContain('userId');
    });

    test('logs error with stack trace', () => {
        const err = new Error('Test failure');

        Logger.error('Error occurred', err);

        const content = waitForLog('error');
        expect(content).toContain('Error occurred');
        expect(content).toContain('Test failure');
        expect(content).toContain('Error: Test failure');
    });

    test('supports multiple arguments like console.log', () => {
        Logger.info('Multi arg', 42, { ok: true });

        const content = waitForLog('info');
        expect(content).toContain('Multi arg');
        expect(content).toContain('42');
        expect(content).toContain('"ok":true');
    });

    test('JSON logger outputs valid JSON', () => {
        const jsonLogger = Logger.createLogger({ json: true });

        jsonLogger.error('JSON error', new Error('json-fail'), { env: 'test' });

        const content = waitForLog('error');
        const lastLine = content.trim().split('\n').pop();
        const parsed = JSON.parse(lastLine);

        expect(parsed.level).toBe('error');
        expect(parsed.message).toBe('JSON error');
        expect(parsed.error.message).toBe('json-fail');
        expect(parsed.meta[0].env).toBe('test');
    });
    afterAll(() => {
        console.info.mockRestore();
        console.warn.mockRestore();
        console.error.mockRestore();
    });
});
