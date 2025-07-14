# Logging Middleware

This is a reusable logging middleware for both backend and frontend JavaScript applications.

## Usage

Import the logger and call it with the required parameters:

```js
const log = require('./logger');
log('backend', 'info', 'controller', 'Short URL created successfully', token);
```

- `stack`: 'backend' or 'frontend'
- `level`: 'debug', 'info', 'warn', 'error', 'fatal'
- `package`: see allowed values in the problem statement
- `message`: descriptive log message
- `token`: (optional) Bearer token for protected route

## Example

```js
log('backend', 'error', 'handler', 'received string, expected bool', token);
```

## Note
- This logger sends logs to the remote evaluation service as required by the test guidelines.
- Do not use `console.log` or built-in loggers elsewhere in your codebase. 