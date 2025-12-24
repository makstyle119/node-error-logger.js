# Changelog

All notable changes to this project will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/).

---

## [1.2.0] – 2025-01-XX

### Added
- Support for multiple arguments (console-style logging).
- Automatic detection and logging of `Error` objects with stack traces.
- Optional JSON logging mode for structured logs.
- Optional size-based log rotation.
- Factory API: `Logger.createLogger(options)`.

### Changed
- Improved internal log formatting and safety.
- Console output now safely falls back to `console.log` when needed.

### Fixed
- README now accurately reflects error logging behavior.

### Backward Compatibility
- All existing v1.x usage remains fully supported.
- No breaking changes introduced.

---

## [1.1.0] – 2024-XX-XX

### Added
- Error object support (message + stack trace).
- Improved README accuracy and clarity.

---

## [1.0.4] – Initial Stable Release

### Added
- Basic file and console logging.
- Support for `info`, `warn`, and `error` levels.
- Daily log files organized by level.
